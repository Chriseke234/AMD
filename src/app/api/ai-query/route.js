import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateObject, generateText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export async function POST(request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { prompt, datasetIds } = await request.json()

    if (!datasetIds || datasetIds.length === 0) {
        return NextResponse.json({ error: "Please select at least one dataset." }, { status: 400 })
    }

    try {
        // 1. Fetch Dataset Schemas & Table Names
        const { data: columns, error: schemaError } = await supabase
            .from('dataset_columns')
            .select('name, data_type, datasets(name, table_name)')
            .in('dataset_id', datasetIds)

        if (schemaError) throw schemaError

        // Group columns by table
        const tables = columns.reduce((acc, col) => {
            const table = col.datasets.table_name
            if (!acc[table]) acc[table] = { name: col.datasets.name, columns: [] }
            acc[table].columns.push(`${col.name} (${col.data_type})`)
            return acc
        }, {})

        const schemaContext = Object.entries(tables).map(([tableName, info]) => {
            return `Table: data."${tableName}" (Friendly name: ${info.name})\nColumns: ${info.columns.join(', ')}`
        }).join('\n\n')

        // Fetch Semantic Context (Business definitions)
        let semanticQuery = supabase.from('semantic_definitions').select('term, definition').eq('user_id', user.id);
        if (datasetIds.length > 0) {
            semanticQuery = semanticQuery.or(`dataset_id.in.(${datasetIds.join(',')}),dataset_id.is.null`);
        }
        const { data: semantics } = await semanticQuery;

        const semanticContext = semantics && semantics.length > 0
            ? "BUSINESS TERMINOLOGY & DEFINITIONS:\n" + semantics.map(s => `- ${s.term}: ${s.definition}`).join('\n')
            : "BUSINESS TERMINOLOGY: None defined.";

        // 2. Multi-Step Agentic Reasoning (Phase 1: Exploration)
        const agentSystemPrompt = `You are an expert Data Analyst for "AskMyData".
        Your goal is to answer the user's question by querying the database.
        
        SCHEMA CONTEXT:
        ${schemaContext}
        
        ${semanticContext}
        
        RULES:
        1. Use the 'query_database' tool to explore the data.
        2. ALWAYS use the full table name with schema: data.table_name
        3. If your query fails with an error, try rewriting it to fix the issue.
        4. If the data looks anomalous or you need more context to answer a "Why" question, issue follow-up queries.
        5. Once you have found the definitive answer, output your findings clearly in text.`;

        let finalSqlUsed = "";
        let finalResults = null;

        const { text: agentText } = await generateText({
            model: openai('gpt-4o-mini'),
            system: agentSystemPrompt,
            prompt: prompt,
            maxSteps: 4,
            tools: {
                query_database: tool({
                    description: 'Execute a precise Postgres SELECT query to gather data.',
                    parameters: z.object({
                        sql: z.string().describe("The SQL SELECT query.")
                    }),
                    execute: async ({ sql }) => {
                        const { data, error } = await supabase.rpc('execute_ai_query', { sql_query: sql });
                        if (error) {
                            return { error: `Query failed: ${error.message}` };
                        }
                        // Save the last successful query state for the final output
                        finalSqlUsed = sql;
                        finalResults = data || [];
                        // Return limited row data to the LLM to prevent context overflow
                        const slice = (data || []).slice(0, 100);
                        return { success: true, rowCount: data?.length || 0, sampleData: slice };
                    }
                })
            }
        });

        if (!finalSqlUsed || !finalResults) {
            return NextResponse.json({
                insight: agentText || "I couldn't find any relevant data to answer your question.",
                error: "The agent could not formulate a successful query."
            });
        }

        // 3. Structured Formatting (Phase 2: Final UI Payload)
        const formatPrompt = `Based on your analysis, format the findings.
        
        Agent's Analysis: ${agentText}
        Final SQL Executed: ${finalSqlUsed}
        
        Extract the core insight, the best chart type to visualize these results, a title, and up to 3 follow-up questions.
        If the user asked for a forecast, generate simulated future data points.`;

        const { object: aiResponse } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: z.object({
                insight: z.string().describe("A concise (1-2 sentence) executive summary of the findings."),
                chartType: z.enum(['bar', 'line', 'pie', 'table']).describe("The best visualization type based on the data structure."),
                title: z.string().describe("A short, descriptive title for the chart."),
                isForecast: z.boolean().describe("True if the user asked for a prediction or forecast."),
                forecastResults: z.array(z.any()).optional().describe("If isForecast is true, provide 3-5 predicted data points that logically follow the trend."),
                suggestedQuestions: z.array(z.string()).max(3).describe("Follow-up questions the user might ask next.")
            }),
            system: "You are a highly concise editorial formatting bot for AskMyData.",
            prompt: formatPrompt
        });

        // 4. Return enriched results
        return NextResponse.json({
            insight: aiResponse.insight,
            sql: aiResponse.sql,
            results: results || [],
            chartType: aiResponse.chartType,
            title: aiResponse.title,
            isForecast: aiResponse.isForecast,
            forecastResults: aiResponse.forecastResults || [],
            suggestedQuestions: aiResponse.suggestedQuestions
        })

    } catch (error) {
        console.error("AI Query Error:", error)
        return NextResponse.json({ error: "An unexpected error occurred while processing your request." }, { status: 500 })
    }
}
