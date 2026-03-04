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

    const { datasetId, instruction } = await request.json()

    try {
        // 1. Fetch Source Schema
        const { data: dataset, error: dsError } = await supabase
            .from('datasets')
            .select('*, dataset_columns(*)')
            .eq('id', datasetId)
            .single()

        if (dsError || !dataset) return NextResponse.json({ error: "Dataset not found" }, { status: 404 })

        const schemaContext = dataset.dataset_columns.map(col => `${col.name} (${col.data_type})`).join(', ')

        // 2. Generate Transformation SQL
        const { object: aiResponse } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: z.object({
                sql: z.string().describe("The SQL SELECT query for the transformation."),
                newName: z.string().describe("A professional name for this derived dataset."),
                columns: z.array(z.object({
                    name: z.string(),
                    type: z.string()
                })).describe("The schema of the resulting transformation.")
            }),
            system: `You are a Data Engineer. Your task is to generate a PostgreSQL SELECT statement that transforms the given table.
            SOURCE TABLE: data."${dataset.table_name}"
            COLUMNS: ${schemaContext}
            INSTRUCTION: ${instruction}
            
            RULES:
            1. ONLY SELECT.
            2. Resulting columns must have clear aliases.
            3. Use PostgreSQL compatible syntax.`,
            prompt: `Transform the data: ${instruction}`
        })

        // 3. Create the Derived Table (new table for simplicity/performance in this app context)
        const newTableName = `derived_${Date.now()}`
        const createQuery = `CREATE TABLE data."${newTableName}" AS ${aiResponse.sql}`

        const { error: execError } = await supabase.rpc('execute_ai_query', {
            sql_query: createQuery
        })

        if (execError) throw execError

        // 4. Register the new dataset
        const { data: newDataset, error: regError } = await supabase
            .from('datasets')
            .insert({
                user_id: user.id,
                name: aiResponse.newName,
                table_name: newTableName,
                source_type: 'derived',
                metadata: {
                    parent_id: datasetId,
                    transformation: instruction,
                    original_sql: aiResponse.sql
                }
            })
            .select()
            .single()

        if (regError) throw regError

        // 5. Register columns
        const columnInserts = aiResponse.columns.map(col => ({
            dataset_id: newDataset.id,
            name: col.name,
            data_type: col.type
        }))

        await supabase.from('dataset_columns').insert(columnInserts)

        return NextResponse.json({
            success: true,
            dataset: newDataset
        })

    } catch (error) {
        console.error("Derived Node Creation Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
