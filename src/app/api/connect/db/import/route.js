import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Client as PGClient } from 'pg'
import mysql from 'mysql2/promise'

export async function POST(request) {
    const { type, config, tables } = await request.json()
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

        let remoteClient;

        if (type === 'postgres') {
            remoteClient = new PGClient({
                host: config.host,
                port: config.port,
                database: config.database,
                user: config.user,
                password: config.password,
                ssl: config.ssl ? { rejectUnauthorized: false } : false,
            })
            await remoteClient.connect()
        } else if (type === 'mysql') {
            remoteClient = await mysql.createConnection({
                host: config.host,
                port: config.port,
                database: config.database,
                user: config.user,
                password: config.password,
            })
        }

        for (const tableName of tables) {
            let rows = [];
            let columns = [];

            if (type === 'postgres') {
                const schemaRes = await remoteClient.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = $1 AND table_schema = 'public'
                `, [tableName])
                columns = schemaRes.rows.map(c => ({ name: c.column_name, type: 'text' }))

                const dataRes = await remoteClient.query(`SELECT * FROM "${tableName}" LIMIT 1000`)
                rows = dataRes.rows
            } else if (type === 'mysql') {
                const [schemaRows] = await remoteClient.execute(`DESCRIBE \`${tableName}\``)
                columns = schemaRows.map(c => ({ name: c.Field, type: 'text' }))

                const [dataRows] = await remoteClient.execute(`SELECT * FROM \`${tableName}\` LIMIT 1000`)
                rows = dataRows
            }

            // Create entry in Supabase
            const localTableName = `db_${type}_${Math.random().toString(36).substring(7).toLowerCase()}`
            const { data: dataset, error: dsError } = await supabase
                .from('datasets')
                .insert({
                    user_id: user.id,
                    name: `${tableName} (${type})`,
                    table_name: localTableName,
                    file_size: 0,
                    column_count: columns.length,
                    row_count: rows.length,
                    status: 'processing',
                    storage_path: `db://${type}/${config.host}/${tableName}`
                })
                .select()
                .single()

            if (dsError) throw dsError

            // Create table locally
            const { error: createError } = await supabase.rpc('create_dataset_table', {
                p_table_name: localTableName,
                p_columns: columns
            })
            if (createError) throw createError

            // Insert data in batches
            const batchSize = 100
            for (let i = 0; i < rows.length; i += batchSize) {
                const batch = rows.slice(i, i + batchSize)
                const { error: insertError } = await supabase.rpc('insert_dataset_data', {
                    p_table_name: localTableName,
                    p_data: batch
                })
                if (insertError) throw insertError
            }

            // Sync columns metadata
            const colMetadata = columns.map(c => ({
                dataset_id: dataset.id,
                name: c.name,
                data_type: 'text'
            }))
            await supabase.from('dataset_columns').insert(colMetadata)

            await supabase.from('datasets').update({ status: 'completed' }).eq('id', dataset.id)
        }

        if (type === 'postgres') await remoteClient.end()
        else if (type === 'mysql') await remoteClient.end()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DB Import Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
