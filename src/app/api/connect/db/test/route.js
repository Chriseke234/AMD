import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Client as PGClient } from 'pg'
import mysql from 'mysql2/promise'

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

    const { type, config } = await request.json()

    try {
        if (type === 'postgres') {
            const client = new PGClient({
                host: config.host,
                port: config.port,
                database: config.database,
                user: config.user,
                password: config.password,
                ssl: config.ssl ? { rejectUnauthorized: false } : false,
                connectionTimeoutMillis: 5000
            })
            await client.connect()

            const res = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
            `)

            await client.end()
            return NextResponse.json({ tables: res.rows.map(r => r.table_name) })

        } else if (type === 'mysql') {
            const connection = await mysql.createConnection({
                host: config.host,
                port: config.port,
                database: config.database,
                user: config.user,
                password: config.password,
                connectTimeout: 5000
            })

            const [rows] = await connection.execute('SHOW TABLES')
            await connection.end()

            const tableNames = rows.map(r => Object.values(r)[0])
            return NextResponse.json({ tables: tableNames })
        }

        return NextResponse.json({ error: "Unsupported database type" }, { status: 400 })
    } catch (err) {
        console.error("DB Connection Error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
