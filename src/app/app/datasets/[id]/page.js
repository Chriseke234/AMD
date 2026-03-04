"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import {
    Database, Table, CheckCircle2, AlertCircle, Loader2,
    Trash2, RefreshCw, Layers, Sparkles, Filter,
    ChevronLeft, Copy, Sliders, Wand2, ArrowDown
} from "lucide-react"

export default function DatasetDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const id = params.id
    const [dataset, setDataset] = useState(null)
    const [columns, setColumns] = useState([])
    const [previewData, setPreviewData] = useState([])
    const [loading, setLoading] = useState(true)
    const [cleaning, setCleaning] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [scanResults, setScanResults] = useState([])
    const supabase = createClient()
    const router = useRouter()

    const handleNeuralScan = async () => {
        setScanning(true)
        try {
            const res = await fetch('/api/datasets/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ datasetId: id })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            setScanResults(data.scanResults)
            setDataset(prev => ({ ...prev, health_score: data.healthScore }))
        } catch (err) {
            alert(err.message)
        } finally {
            setScanning(false)
        }
    }

    useEffect(() => {
        const fetchDataset = async () => {
            const { data: ds, error } = await supabase
                .from('datasets')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                router.push('/app/datasets')
                return
            }

            setDataset(ds)

            // Fetch columns
            const { data: cols } = await supabase
                .from('dataset_columns')
                .select('*')
                .eq('dataset_id', id)
            setColumns(cols || [])

            // Fetch preview (top 15)
            const { data: preview } = await supabase.rpc('execute_ai_query', {
                sql_query: `SELECT * FROM data.${ds.table_name} LIMIT 15`
            })
            setPreviewData(preview || [])
            setLoading(false)
        }
        fetchDataset()
    }, [id])

    const handleCleanAction = async (operation, actionParams = {}) => {
        setCleaning(true)
        try {
            const res = await fetch('/api/datasets/clean', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    datasetId: id,
                    operation,
                    params: actionParams
                })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            // Refresh preview
            const { data: freshPreview } = await supabase.rpc('execute_ai_query', {
                sql_query: `SELECT * FROM data.${dataset.table_name} LIMIT 15`
            })
            setPreviewData(freshPreview || [])

            // Refresh metadata
            const { data: freshDs } = await supabase.from('datasets').select('*').eq('id', id).single()
            setDataset(freshDs)

        } catch (err) {
            alert(err.message)
        } finally {
            setCleaning(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )

    return (
        <div className="space-y-10 animate-fade-in pb-20 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/app/datasets')}
                        className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors mb-4 group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/10">
                            <Database className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground italic">
                                {dataset.name}<span className="text-primary not-italic">.</span>
                            </h1>
                            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.4em] mt-2">
                                Neural Data Node | {dataset.table_name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="px-6 py-4 rounded-2xl bg-card border border-border flex items-center space-x-4 shadow-sm">
                        <Table className="w-5 h-5 text-primary" />
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Entities</div>
                            <div className="text-xl font-black">{dataset.row_count.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-card border border-border flex items-center space-x-4 shadow-sm">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Integrity</div>
                            <div className="text-xl font-black text-amber-400">{dataset.health_score}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tools Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6 flex items-center">
                                <Wand2 className="w-3 h-3 mr-2 text-primary" />
                                Neural Optimization
                            </h3>
                            <div className="space-y-3">
                                <Button
                                    className="w-full justify-start h-14 rounded-2xl shadow-md group relative overflow-hidden"
                                    onClick={handleNeuralScan}
                                    disabled={cleaning || scanning}
                                >
                                    {scanning ? (
                                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform text-amber-300" />
                                    )}
                                    Neural Auto-Scan
                                    {scanning && <div className="absolute inset-0 bg-primary/20 animate-pulse" />}
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full justify-start h-14 rounded-2xl shadow-sm group"
                                    onClick={() => handleCleanAction('remove_duplicates', { columns: columns.map(c => c.name) })}
                                    disabled={cleaning || scanning}
                                >
                                    <Copy className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                                    Deduplicate Data
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-14 rounded-2xl group border-amber-500/20 text-amber-600 hover:bg-amber-500/5"
                                    onClick={() => handleCleanAction('drop_nulls', { columns: columns.map(c => c.name) })}
                                    disabled={cleaning || scanning}
                                >
                                    <Filter className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                                    Purge Null Values
                                </Button>

                                {scanResults.length > 0 && (
                                    <div className="mt-8 p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600">Scan Anomalies</h4>
                                        <div className="space-y-3">
                                            {scanResults.map((res, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-foreground/60">{res.column}</span>
                                                    <div className="flex items-center space-x-2">
                                                        {res.nullCount > 0 && <span className="text-[9px] font-black bg-red-500/10 text-red-500 px-2 py-0.5 rounded">{res.nullCount} NULLS</span>}
                                                        {res.outliers > 0 && <span className="text-[9px] font-black bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">{res.outliers} OUTLIERS</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6 flex items-center">
                                <Sliders className="w-3 h-3 mr-2 text-primary" />
                                Column Structuring
                            </h3>
                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                                {columns.map((col) => (
                                    <div key={col.id} className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between group">
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-black truncate">{col.name}</div>
                                            <div className="text-[9px] font-medium text-muted-foreground/60 uppercase">{col.data_type}</div>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-primary transition-all">
                                            <RefreshCw className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-4">
                                <span>Security Protocol</span>
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                            </div>
                            <Button variant="ghost" className="w-full h-12 rounded-xl text-red-500/60 hover:bg-red-500/5 hover:text-red-500 text-[10px] font-black uppercase tracking-widest">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Terminate Node
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Data Preview */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-[2.5rem] bg-card border-border shadow-2xl overflow-hidden flex flex-col h-full max-h-[700px]">
                        <div className="p-8 border-b border-border bg-muted/10 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight italic">Live Registry Preview</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Top {previewData.length} instances visible</p>
                                </div>
                            </div>
                            {cleaning && (
                                <div className="flex items-center space-x-3 text-primary animate-pulse">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Processing Changes...</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur-md">
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col.id} className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                                                <div className="flex items-center space-x-2">
                                                    <span>{col.name}</span>
                                                    <ArrowDown className="w-3 h-3 opacity-20" />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {previewData.map((row, i) => (
                                        <tr key={i} className="hover:bg-primary/[0.02] transition-colors group">
                                            {columns.map(col => (
                                                <td key={col.id} className="px-6 py-4 text-sm font-medium text-foreground/80 whitespace-nowrap">
                                                    {row[col.name] === null ? (
                                                        <span className="text-[10px] bg-red-500/5 text-red-400 px-2 py-0.5 rounded italic">NULL</span>
                                                    ) : (
                                                        String(row[col.name])
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {previewData.length === 0 && (
                                <div className="p-20 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto text-muted-foreground/20">
                                        <Table className="w-8 h-8" />
                                    </div>
                                    <div className="text-muted-foreground/40 font-black uppercase tracking-widest text-xs">No entries found in current ledger</div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
