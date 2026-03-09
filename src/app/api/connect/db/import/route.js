import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Client as PGClient } from 'pg'
import mysql from 'mysql2/promise'
import snowflake from 'snowflake-sdk'
import { BigQuery } from '@google-cloud/bigquery'

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
        } else if (type === 'snowflake') {
            remoteClient = snowflake.createConnection({
                account: config.host,
                username: config.user,
                password: config.password,
                warehouse: config.warehouse,
                database: config.database,
                schema: config.schema || 'PUBLIC',
                role: config.role || undefined
            });
            await new Promise((resolve, reject) => {
                remoteClient.connect((err, conn) => {
                    if (err) return reject(err);
                    resolve(conn);
                });
            });
        } else if (type === 'bigquery') {
            remoteClient = new BigQuery({
                projectId: config.host,
                credentials: {
                    client_email: config.user,
                    private_key: config.privateKey.replace(/\\n/g, '\n'),
                }
            });
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
            } else if (type === 'snowflake') {
                columns = await new Promise((resolve, reject) => {
                    remoteClient.execute({
                        sqlText: `DESCRIBE TABLE "${config.database}"."${config.schema || 'PUBLIC'}"."${tableName}"`,
                        complete: (err, stmt, rows) => {
                            if (err) return reject(err);
                            resolve(rows.map(r => ({ name: r.name, type: 'text' })));
                        }
                    });
                });

                rows = await new Promise((resolve, reject) => {
                    remoteClient.execute({
                        sqlText: `SELECT * FROM "${config.database}"."${config.schema || 'PUBLIC'}"."${tableName}" LIMIT 1000`,
                        complete: (err, stmt, rowsData) => {
                            if (err) return reject(err);
                            resolve(rowsData);
                        }
                    });
                });
            } else if (type === 'bigquery') {
                const dataset = remoteClient.dataset(config.database);
                const table = dataset.table(tableName);
                const [metadata] = await table.getMetadata();
                columns = metadata.schema.fields.map(f => ({ name: f.name, type: 'text' }));

                const [rowsData] = await table.getRows({ maxResults: 1000 });
                rows = rowsData;
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
            const { error: createError } = await supabase.rpc('create_secure_dataset_table', {
                p_table_name: localTableName,
                p_columns: columns
            })
            if (createError) {
                console.error("Secure Table Creation Error:", createError);
                const { error: oldCreateError } = await supabase.rpc('create_dataset_table', {
                    p_table_name: localTableName,
                    p_columns: columns
                });
                if (oldCreateError) throw oldCreateError;
            }

            // Insert data in batches
            const batchSize = 100
            for (let i = 0; i < rows.length; i += batchSize) {
                const batch = rows.slice(i, i + batchSize).map(r => ({ ...r, user_id: user.id }))
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
        else if (type === 'snowflake') {
            await new Promise(resolve => remoteClient.destroy((err, conn) => resolve(conn)));
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DB Import Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
