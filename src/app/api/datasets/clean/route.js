import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const { datasetId, operation, params } = await request.json()
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

        // 1. Fetch dataset metadata
        const { data: dataset, error: dsError } = await supabase
            .from('datasets')
            .select('*')
            .eq('id', datasetId)
            .eq('user_id', user.id)
            .single()

        if (dsError || !dataset) throw new Error("Dataset not found")

        // Utility for safe Postgres quoting to prevent SQL injection
        const quoteIdent = (ident) => `"${String(ident).replace(/"/g, '""')}"`;
        const quoteLiteral = (lit) => `'${String(lit).replace(/'/g, "''")}'`;

        const qTableName = `data.${quoteIdent(tableName)}`;
        let sql = ""

        // 2. Build SQL based on operation securely
        switch (operation) {
            case 'remove_duplicates':
                const cols = params.columns.map(quoteIdent).join(', ');
                sql = `DELETE FROM ${qTableName} WHERE ctid NOT IN (SELECT min(ctid) FROM ${qTableName} GROUP BY ${cols})`;
                break;
            case 'drop_nulls':
                const whereClause = params.columns.map(col => `${quoteIdent(col)} IS NULL`).join(' OR ');
                sql = `DELETE FROM ${qTableName} WHERE ${whereClause}`;
                break;
            case 'rename_column':
                sql = `ALTER TABLE ${qTableName} RENAME COLUMN ${quoteIdent(params.oldName)} TO ${quoteIdent(params.newName)}`;
                break;
            case 'fill_nulls':
                sql = `UPDATE ${qTableName} SET ${quoteIdent(params.column)} = ${quoteLiteral(params.value)} WHERE ${quoteIdent(params.column)} IS NULL`;
                break;
            case 'smart_fill':
                // AI-driven fill: placeholder logic. Real scenario calculates mode/mean via AI.
                sql = `UPDATE ${qTableName} SET ${quoteIdent(params.column)} = ${quoteLiteral(params.value)} WHERE ${quoteIdent(params.column)} IS NULL`;
                break;
            default:
                throw new Error("Invalid operation");
        }

        // 3. Execute via a new custom RPC (we need a more powerful exec than execute_ai_query for DML)
        // For now, we'll assume we can use execute_sql or create a specific one
        const { error: execError } = await supabase.rpc('execute_data_mutation', {
            p_sql: sql
        })

        if (execError) throw execError

        // 4. Update row count after deletion operations
        if (['remove_duplicates', 'drop_nulls'].includes(operation)) {
            const { data: countData } = await supabase.rpc('execute_ai_query', {
                sql_query: `SELECT count(*) FROM data.${tableName}`
            })
            const newCount = countData[0]?.count || 0
            await supabase.from('datasets').update({ row_count: newCount }).eq('id', datasetId)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Cleaning Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
