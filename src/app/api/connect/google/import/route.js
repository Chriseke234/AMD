import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const { fileId, fileName } = await request.json()
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

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { data: profile } = await supabase
            .from('profiles')
            .select('google_access_token')
            .eq('id', user.id)
            .single()

        // 1. Fetch Sheet Data
        const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/A1:Z1000`, {
            headers: { 'Authorization': `Bearer ${profile.google_access_token}` }
        })

        const data = await res.json()
        if (data.error) throw new Error(data.error.message)

        const rows = data.values
        if (!rows || rows.length === 0) throw new Error("Sheet is empty")

        const headers = rows[0].map(h => String(h).trim())
        const dataRows = rows.slice(1).map(row => {
            const obj = {}
            headers.forEach((h, i) => {
                obj[h] = row[i] || ""
            })
            return obj
        })

        // 2. Create entry in datasets table
        const tableName = `google_${Math.random().toString(36).substring(7).toLowerCase()}`
        const { data: dataset, error: dsError } = await supabase
            .from('datasets')
            .insert({
                user_id: user.id,
                name: fileName,
                table_name: tableName,
                file_size: 0,
                column_count: headers.length,
                row_count: dataRows.length,
                status: 'processing',
                storage_path: `google://${fileId}`
            })
            .select()
            .single()

        if (dsError) throw dsError

        // 3. Create table via RPC
        const columns = headers.map(h => ({ name: h, type: 'text' }))
        const { error: createError } = await supabase.rpc('create_dataset_table', {
            p_table_name: tableName,
            p_columns: columns
        })
        if (createError) throw createError

        // 4. Insert data in batches
        const batchSize = 100
        for (let i = 0; i < dataRows.length; i += batchSize) {
            const batch = dataRows.slice(i, i + batchSize)
            const { error: insertError } = await supabase.rpc('insert_dataset_data', {
                p_table_name: tableName,
                p_data: batch
            })
            if (insertError) throw insertError
        }

        // 5. Update columns metadata
        const colMetadata = headers.map(h => ({
            dataset_id: dataset.id,
            name: h,
            data_type: 'text'
        }))
        await supabase.from('dataset_columns').insert(colMetadata)

        // 6. Mark as completed
        await supabase.from('datasets').update({ status: 'completed' }).eq('id', dataset.id)

        return NextResponse.json({ success: true, datasetId: dataset.id })
    } catch (error) {
        console.error("Google Import Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
