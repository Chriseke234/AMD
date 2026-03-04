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

    const { image, fileName } = await request.json() // image is base64

    try {
        // 1. Vision Processing
        const { object: scanResult } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: z.object({
                tableName: z.string().describe("A professional table name for this data (e.g. sales_records)."),
                title: z.string().describe("Human friendly dataset title."),
                columns: z.array(z.object({
                    name: z.string(),
                    type: z.string().describe("PostgreSQL data type (text, decimal, integer, date).")
                })),
                rows: z.array(z.any()).describe("The extracted rows as objects matching the column names.")
            }),
            system: `You are an expert Data Digitizer. 
            Extract all table data from the provided image. 
            Ensure column names are snake_case and SQL friendly.
            Convert values to correct types (e.g. strip currency symbols for 'decimal').`,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Digitize this table.' },
                        { type: 'image', image: image }
                    ]
                }
            ]
        })

        // 2. Create Table
        const tableId = `scan_${Date.now()}`
        const colDefinitions = scanResult.columns.map(c => `"${c.name}" ${c.type}`).join(', ')
        const createQuery = `CREATE TABLE data."${tableId}" (${colDefinitions})`

        const { error: createError } = await supabase.rpc('execute_ai_query', {
            sql_query: createQuery
        })

        if (createError) throw createError

        // 3. Insert Rows
        // Batch insert for performance
        if (scanResult.rows.length > 0) {
            const keys = scanResult.columns.map(c => `"${c.name}"`).join(', ')
            const values = scanResult.rows.map(row =>
                '(' + scanResult.columns.map(c => {
                    const val = row[c.name]
                    if (val === null || val === undefined) return 'NULL'
                    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
                    return val
                }).join(', ') + ')'
            ).join(', ')

            const insertQuery = `INSERT INTO data."${tableId}" (${keys}) VALUES ${values}`
            await supabase.rpc('execute_ai_query', { sql_query: insertQuery })
        }

        // 4. Register Dataset
        const { data: dataset, error: regError } = await supabase
            .from('datasets')
            .insert({
                user_id: user.id,
                name: scanResult.title || fileName,
                table_name: tableId,
                source_type: 'neural_scan'
            })
            .select()
            .single()

        if (regError) throw regError

        // 5. Register Columns
        const columnInserts = scanResult.columns.map(col => ({
            dataset_id: dataset.id,
            name: col.name,
            data_type: col.type
        }))

        await supabase.from('dataset_columns').insert(columnInserts)

        return NextResponse.json({ success: true, datasetId: dataset.id })

    } catch (error) {
        console.error("Neural Scan Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
