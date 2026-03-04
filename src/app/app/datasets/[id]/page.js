"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import {
    Database, Table, CheckCircle2, AlertCircle, Loader2,
    Trash2, RefreshCw, Layers, Sparkles, Filter,
    ChevronLeft, Copy, Sliders, Wand2, ArrowDown,
    ArrowRight, ArrowLeft, Hash, Type, Calendar, Share2,
    BrainCircuit, MessageSquareText
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
    const [suggesting, setSuggesting] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [narrative, setNarrative] = useState("")
    const [narrativeLoading, setNarrativeLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleExport = (format) => {
        let content = ""
        let filename = `${dataset.name}_export.${format}`
        let type = "text/plain"

        if (format === 'json') {
            content = JSON.stringify(previewData, null, 2)
            type = "application/json"
        } else {
            const keys = columns.map(c => c.name)
            content = [
                keys.join(','),
                ...previewData.map(row => keys.map(k => JSON.stringify(row[k])).join(','))
            ].join('\n')
            type = "text/csv"
        }

        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
    }

    const handleSmartRename = async () => {
        setSuggesting(true)
        try {
            const res = await fetch('/api/datasets/rename-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ datasetId: id, columns: columns.map(c => c.name) })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setSuggestions(data.suggestions)
        } catch (err) {
            alert(err.message)
        } finally {
            setSuggesting(false)
        }
    }

    const applyRename = async (original, suggested) => {
        setCleaning(true)
        try {
            await handleCleanAction('rename_column', { oldName: original, newName: suggested })
            setSuggestions(prev => prev.filter(s => s.original !== original))
        } catch (err) {
            alert(err.message)
        } finally {
            setCleaning(false)
        }
    }

    const getTypeIcon = (type) => {
        const t = type?.toLowerCase() || ''
        if (t.includes('int') || t.includes('num') || t.includes('double')) return <Hash className="w-3 h-3 text-blue-500" />
        if (t.includes('text') || t.includes('char')) return <Type className="w-3 h-3 text-purple-500" />
        if (t.includes('time') || t.includes('date')) return <Calendar className="w-3 h-3 text-amber-500" />
        if (t.includes('bool')) return <CheckCircle2 className="w-3 h-3 text-green-500" />
        return <Database className="w-3 h-3 text-muted-foreground" />
    }

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

            // Trigger narrative if not already present or just forced
            if (preview?.length > 0) {
                handleGenerateNarrative(ds, cols, preview.slice(0, 5))
            }
        }
        fetchDataset()
    }, [id])

    const handleGenerateNarrative = async (ds, cols, sample) => {
        setNarrativeLoading(true)
        try {
            const res = await fetch('/api/datasets/narrative', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    datasetId: id,
                    columns: cols.map(c => c.name),
                    sampleData: sample
                })
            })
            const data = await res.json()
            if (data.narrative) setNarrative(data.narrative)
        } catch (err) {
            console.error("Narrative failed", err)
        } finally {
            setNarrativeLoading(false)
        }
    }

    const handleNeuralRepair = async () => {
        const columnsToRepair = scanResults.filter(r => r.nullCount > 0).map(r => r.column)
        if (columnsToRepair.length === 0) {
            alert("Neural Scan detects no critical null anomalies for repair.")
            return
        }

        setCleaning(true)
        try {
            for (const col of columnsToRepair) {
                // In a true "Elite" version, we'd predict values. 
                // For now, we use the smartest statistical default (Mode/Median) or AI suggestion via the clean route.
                await handleCleanAction('smart_fill', { column: col, value: 'AI_REPAIRED' })
            }
        } finally {
            setCleaning(false)
        }
    }

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
        <div className="space-y-10 animate-fade-in pb-20 max-w-[1600px] mx-auto px-4 sm:px-0 mt-10">
            <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <Skeleton className="h-12 w-32 rounded-xl" />
                    <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Skeleton className="h-[600px] rounded-[2.5rem]" />
                <Skeleton className="lg:col-span-3 h-[600px] rounded-[2.5rem]" />
            </div>
        </div>
    )

    return (
        <div className="space-y-6 sm:space-y-10 animate-fade-in pb-20 max-w-[1600px] mx-auto px-4 sm:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/app/datasets')}
                        className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors mb-2 sm:mb-4 group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                            <Database className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tighter italic font-heading">
                                {dataset.name}<span className="text-primary not-italic">.</span>
                            </h1>
                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">
                                Registry Node: <span className="text-foreground/60">{id.slice(0, 8)}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-border bg-card shadow-sm hover:shadow-md transition-all">
                        <Share2 className="w-4 h-4 mr-2" /> Share Node
                    </Button>
                </div>
            </div>

            {/* AI Narrative Section */}
            {(narrative || narrativeLoading) && (
                <div className="relative group p-6 sm:p-8 rounded-[2rem] bg-gradient-to-r from-primary/5 via-card to-background border border-primary/10 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="absolute top-0 right-10 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                            <BrainCircuit className="w-6 h-6 outline-none" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Executive Summary</h3>
                                {narrativeLoading && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
                            </div>
                            {narrativeLoading ? (
                                <div className="space-y-2 mt-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[70%]" />
                                </div>
                            ) : (
                                <p className="text-sm sm:text-base font-medium text-foreground/80 leading-relaxed italic">
                                    "{narrative}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                    variant="outline"
                                    className="w-full justify-start h-14 rounded-2xl border-primary/20 text-primary hover:bg-primary hover:text-white shadow-sm group relative overflow-hidden"
                                    onClick={handleNeuralRepair}
                                    disabled={cleaning || scanning}
                                >
                                    <BrainCircuit className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
                                    Neural Smart-Repair
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
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Sliders className="w-3 h-3 mr-2 text-primary" />
                                    Column Structuring
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-primary transition-all"
                                    onClick={handleSmartRename}
                                    disabled={suggesting}
                                >
                                    {suggesting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1 text-amber-400" />}
                                    AI Rename
                                </Button>
                            </h3>

                            {suggestions.length > 0 && (
                                <div className="mb-6 p-5 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center">
                                        <Sparkles className="w-3 h-3 mr-2" />
                                        Neural Suggestions
                                    </div>
                                    <div className="space-y-2">
                                        {suggestions.map((s, i) => (
                                            <div key={i} className="flex items-center justify-between bg-card p-3 rounded-xl border border-border shadow-sm group/suggestion">
                                                <div className="min-w-0 pr-2">
                                                    <div className="text-[10px] font-bold truncate flex items-center text-muted-foreground/40">
                                                        {s.original}
                                                    </div>
                                                    <div className="text-[10px] font-black text-primary truncate">
                                                        {s.suggested}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shrink-0"
                                                    onClick={() => applyRename(s.original, s.suggested)}
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-muted-foreground transition-all"
                                        onClick={() => setSuggestions([])}
                                    >
                                        Dismiss All
                                    </Button>
                                </div>
                            )}

                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                                {columns.map((col) => (
                                    <div key={col.id} className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between group">
                                        <div className="flex items-center min-w-0 pr-2">
                                            <div className="mr-3 p-2 rounded-lg bg-background border border-border">
                                                {getTypeIcon(col.data_type)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-black truncate">{col.name}</div>
                                                <div className="text-[9px] font-medium text-muted-foreground/60 uppercase">{col.data_type}</div>
                                            </div>
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

                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-[2.5rem] bg-card border-border shadow-2xl overflow-hidden flex flex-col h-full max-h-[700px]">
                        <div className="p-6 sm:p-8 border-b border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shrink-0">
                            <div className="flex items-center space-x-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-black tracking-tight italic truncate">Live Registry Preview</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Top {previewData.length} instances visible</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-none h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border-border bg-background/50 hover:bg-muted transition-all"
                                    onClick={() => handleExport('csv')}
                                >
                                    Export CSV
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-none h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border-border bg-background/50 hover:bg-muted transition-all"
                                    onClick={() => handleExport('json')}
                                >
                                    Export JSON
                                </Button>
                            </div>
                            {cleaning && (
                                <div className="flex items-center space-x-3 text-primary animate-pulse min-w-fit">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Processing Changes...</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto relative">
                            {/* Mobile Scroll Indicator */}
                            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none lg:hidden opacity-50" />
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur-md">
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col.id} className="px-4 sm:px-6 py-4 sm:py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    {getTypeIcon(col.data_type)}
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
                                                <td key={col.id} className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-foreground/80 whitespace-nowrap">
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
