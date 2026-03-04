"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
    FileText, Database, Plus, Search, Filter, Loader2, Trash2,
    Table, CheckCircle2, AlertCircle, RefreshCw, MoreVertical,
    ExternalLink, HardDrive, LayoutGrid, Users, Calendar, ChevronRight
} from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function DatasetsPage() {
    const [datasets, setDatasets] = useState([])
    const [loading, setLoading] = useState(true)
    const [teams, setTeams] = useState([])
    const [selectedTeam, setSelectedTeam] = useState(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const { data: ds } = await supabase.from('datasets').select('*').order('created_at', { ascending: false })
            const { data: ts } = await supabase.from('teams').select('*')
            if (ds) setDatasets(ds)
            if (ts) setTeams(ts)
            setLoading(false)
        }
        fetchData()
    }, [])

    const deleteDataset = async (id, tableName) => {
        if (!confirm("Are you sure you want to delete this dataset?")) return

        const { error } = await supabase.from('datasets').delete().eq('id', id)
        if (error) alert(error.message)
        else {
            setDatasets(datasets.filter(d => d.id !== id))
        }
    }

    const handleMoveToTeam = async (datasetId, teamId) => {
        const { error } = await supabase
            .from('datasets')
            .update({ team_id: teamId })
            .eq('id', datasetId)

        if (!error) {
            setDatasets(datasets.map(d => d.id === datasetId ? { ...d, team_id: teamId } : d))
        }
    }

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col space-y-3">
                    <div className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border rounded-full bg-primary/5 text-primary border-primary/20 w-fit">
                        Neural Sources
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground font-heading">
                        Your Datasets<span className="text-primary">.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-medium">
                        Manage and explore your neural data sources and intelligence nodes.
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/app/datasets/new")}
                    size="lg"
                    className="shadow-xl shadow-primary/20"
                >
                    <Plus className="w-5 h-5 mr-3" />
                    Add Dataset
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : datasets.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 sm:p-20 text-center bg-card border-border rounded-[2.5rem] sm:rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] sm:rounded-[2.5rem] bg-muted text-muted-foreground flex items-center justify-center mb-8 shadow-2xl">
                            <Database className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-4 tracking-tight">No datasets yet</h3>
                        <p className="text-muted-foreground/60 mb-10 max-w-sm text-base sm:text-lg leading-relaxed font-medium">Your intelligence engine requires data. Upload your first CSV or Excel file to get started.</p>
                        <Button
                            onClick={() => router.push("/app/datasets/new")}
                            size="lg"
                            className="shadow-2xl shadow-primary/40 px-12"
                        >
                            Upload Now
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {datasets.map((ds) => (
                        <Card key={ds.id} className="group hover:border-primary/40 hover:bg-primary/[0.01] transition-all duration-500 bg-card border-border overflow-hidden relative rounded-[2rem]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors" />
                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center p-6 sm:p-8 gap-8 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/10 shrink-0">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-xl sm:text-2xl text-foreground tracking-tight truncate group-hover:text-primary transition-colors">{ds.name}</h3>
                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-3">
                                        <span className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-2 opacity-50" />
                                            {new Date(ds.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center">
                                            <Table className="w-3.5 h-3.5 mr-2 opacity-50" />
                                            {ds.row_count.toLocaleString()} rows
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-muted border border-border text-[9px]">
                                            {(ds.file_size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
                                    {ds.status === 'processing' || ds.status === 'pending' ? (
                                        <div className="px-5 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center">
                                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                            {ds.status === 'processing' ? 'Processing' : 'Queued'}
                                        </div>
                                    ) : ds.status === 'failed' ? (
                                        <div className="px-5 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center" title={ds.error_message}>
                                            <AlertCircle className="w-3 h-3 mr-2" />
                                            Failed
                                        </div>
                                    ) : (
                                        <div className="px-5 h-10 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                                            <CheckCircle2 className="w-3 h-3 mr-2" />
                                            Health: {ds.health_score}%
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => deleteDataset(ds.id, ds.table_name)}
                                            className="p-3 text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/app/datasets/${ds.id}`)}
                                            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground/40 group-hover:text-primary group-hover:bg-primary/20 transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Team Sharing Control */}
                            {teams.length > 0 && (
                                <div className="px-8 py-4 border-t border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em]">
                                        {ds.team_id ? (
                                            <span className="flex items-center text-primary">
                                                <Users className="w-3.5 h-3.5 mr-2" /> Team Shared Access
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-muted-foreground/40">
                                                <HardDrive className="w-3.5 h-3.5 mr-2" /> Private Endpoint
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Security Proxy:</span>
                                        <select
                                            className="text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none focus:ring-0 text-primary cursor-pointer hover:text-primary/80 transition-colors h-auto p-0"
                                            value={ds.team_id || ""}
                                            onChange={(e) => handleMoveToTeam(ds.id, e.target.value)}
                                        >
                                            <option value="" className="bg-card text-muted-foreground">{ds.team_id ? 'Unshare Access' : 'Assign to Team'}</option>
                                            {teams.map(t => (
                                                <option key={t.id} value={t.id} className="bg-card text-foreground">{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
