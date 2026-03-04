import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
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

        // 2. Generate SQL and Insight using AI
        const { object: aiResponse } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: z.object({
                sql: z.string().describe("The SQL SELECT query to execute on the 'data' schema tables."),
                insight: z.string().describe("A brief, helpful interpretation of the query results."),
                chartType: z.enum(['bar', 'line', 'pie', 'table']).describe("The best visualization type for this data."),
                title: z.string().describe("A concise title for the chart/result."),
                suggestedQuestions: z.array(z.string()).max(3).describe("3 follow-up questions the user might want to ask based on this result.")
            }),
            system: `You are an expert Data Analyst for "AskMyData".
            Your goal is to transform natural language questions into precise SQL SELECT queries.
            
            SCHEMA CONTEXT:
            ${schemaContext}
            
            RULES:
            1. ONLY generate SELECT queries.
            2. ALWAYS use the full table name with schema: data."table_name"
            3. If a question is ambiguous, make a reasonable assumption.
            4. If the question cannot be answered with the given schema, explain why in the 'insight' field and leave 'sql' empty.
            5. Ensure SQL is valid PostgreSQL.`,
            prompt: prompt
        })

        if (!aiResponse.sql) {
            return NextResponse.json({
                insight: aiResponse.insight,
                error: "Could not generate a valid query for this request."
            })
        }

        // 3. SECURE EXECUTION via RPC
        const { data: results, error: queryError } = await supabase.rpc('execute_ai_query', {
            sql_query: aiResponse.sql
        })

        if (queryError) {
            console.error("SQL Execution Error:", queryError)
            return NextResponse.json({
                error: `Query execution failed: ${queryError.message}`,
                sql: aiResponse.sql,
                insight: "I tried to generate a query but it encountered an error during execution."
            }, { status: 400 })
        }

        // 4. Return enriched results
        return NextResponse.json({
            insight: aiResponse.insight,
            sql: aiResponse.sql,
            results: results || [],
            chartType: aiResponse.chartType,
            title: aiResponse.title,
            suggestedQuestions: aiResponse.suggestedQuestions
        })

    } catch (error) {
        console.error("AI Query Error:", error)
        return NextResponse.json({ error: "An unexpected error occurred while processing your request." }, { status: 500 })
    }
}
