import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const { datasetId } = await request.json()
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

        const { data: dataset } = await supabase.from('datasets').select('*').eq('id', datasetId).single()
        if (!dataset) throw new Error("Dataset not found")

        const { data: columns } = await supabase.from('dataset_columns').select('*').eq('dataset_id', datasetId)

        const scanResults = []

        for (const col of columns) {
            const tableName = `data."${dataset.table_name}"`

            // 1. Check for Nulls
            const { data: nullData } = await supabase.rpc('execute_ai_query', {
                sql_query: `SELECT count(*) as count FROM ${tableName} WHERE "${col.name}" IS NULL`
            })
            const nullCount = parseInt(nullData[0]?.count || 0)

            // 2. Simple Outlier Detection for numeric types
            let outliers = 0
            if (['numeric', 'integer', 'float', 'double precision'].includes(col.data_type.toLowerCase())) {
                const { data: stats } = await supabase.rpc('execute_ai_query', {
                    sql_query: `SELECT avg("${col.name}") as avg, stddev("${col.name}") as std FROM ${tableName}`
                })
                const { avg, std } = stats[0] || { avg: 0, std: 0 }

                if (std > 0) {
                    const { data: outlierData } = await supabase.rpc('execute_ai_query', {
                        sql_query: `SELECT count(*) as count FROM ${tableName} WHERE ABS("${col.name}" - ${avg}) > ${2 * std}`
                    })
                    outliers = parseInt(outlierData[0]?.count || 0)
                }
            }

            if (nullCount > 0 || outliers > 0) {
                scanResults.push({
                    column: col.name,
                    nullCount,
                    outliers,
                    severity: nullCount > (dataset.row_count * 0.1) ? 'critical' : 'warning'
                })
            }
        }

        // Update health score based on findings
        const totalIssues = scanResults.reduce((acc, r) => acc + r.nullCount + r.outliers, 0)
        const newHealth = Math.max(0, 100 - Math.min(100, Math.round((totalIssues / (dataset.row_count * columns.length || 1)) * 100)))

        await supabase.from('datasets').update({ health_score: newHealth }).eq('id', datasetId)

        return NextResponse.json({ scanResults, healthScore: newHealth })
    } catch (error) {
        console.error("Scan Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
