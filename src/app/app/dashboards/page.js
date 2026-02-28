"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Plus, Layout, Calendar, MoreVertical, ExternalLink, Trash2, Loader2, Sparkles, Users, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export default function DashboardsPage() {
    const [dashboards, setDashboards] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [newDashboardName, setNewDashboardName] = useState("")
    const [teams, setTeams] = useState([])
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: db } = await supabase
                .from('dashboards')
                .select('*')
                .order('created_at', { ascending: false })

            const { data: ts } = await supabase.from('teams').select('*')

            if (db) setDashboards(db)
            if (ts) setTeams(ts)
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleCreateDashboard = async (e) => {
        e.preventDefault()
        if (!newDashboardName.trim()) return

        setCreating(true)
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from('dashboards')
            .insert({
                name: newDashboardName,
                user_id: user.id
            })
            .select()
            .single()

        if (!error) {
            setDashboards([data, ...dashboards])
            setNewDashboardName("")
        }
        setCreating(false)
    }

    const handleDeleteDashboard = async (id) => {
        if (!confirm("Are you sure you want to delete this dashboard?")) return

        const { error } = await supabase
            .from('dashboards')
            .delete()
            .eq('id', id)

        if (!error) {
            setDashboards(dashboards.filter(d => d.id !== id))
        }
    }

    const handleMoveToTeam = async (dashboardId, teamId) => {
        const { error } = await supabase
            .from('dashboards')
            .update({ team_id: teamId })
            .eq('id', dashboardId)

        if (!error) {
            setDashboards(dashboards.map(d => d.id === dashboardId ? { ...d, team_id: teamId } : d))
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animation-fade-in pb-20">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#030303] p-12 lg:p-16 shadow-2xl">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-mesh" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full animate-mesh" style={{ animationDelay: '2s' }} />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] border rounded-full border-primary/20 bg-primary/5 text-primary">
                            <Sparkles className="w-3 h-3 mr-2" />
                            Live Analytics
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white italic">
                            Your <span className="text-primary not-italic">Dashboards.</span>
                        </h1>
                        <p className="text-white/40 text-lg font-medium max-w-md">
                            Curate, analyze, and scale your insights in high-fidelity workspaces.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="px-6 py-4 rounded-2xl glass border-white/5 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Active</div>
                                <div className="text-xl font-bold text-white">{dashboards.length}</div>
                            </div>
                        </div>
                        <div className="px-6 py-4 rounded-2xl glass border-white/5 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Usage</div>
                                <div className="text-xl font-bold text-white">Optimal</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                    Directory Systems
                </div>
                <form onSubmit={handleCreateDashboard} className="flex items-center space-x-3 w-full sm:w-auto">
                    <Input
                        placeholder="Dashboard Identifier..."
                        className="w-full sm:w-72 h-14 rounded-2xl bg-secondary/30 border-border/40 focus:border-primary/50 font-medium px-6 transition-all"
                        value={newDashboardName}
                        onChange={(e) => setNewDashboardName(e.target.value)}
                    />
                    <Button type="submit" disabled={creating || !newDashboardName} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                        {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        <span className="ml-2 hidden sm:inline">Initialize</span>
                    </Button>
                </form>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-[2rem] animate-pulse bg-secondary/20 border border-border/30" />
                    ))}
                </div>
            ) : dashboards.length === 0 ? (
                <div className="px-4">
                    <Card className="p-24 text-center border-dashed border-2 border-border/40 bg-secondary/5 rounded-[3rem] flex flex-col items-center justify-center group overflow-hidden relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.02),transparent_70%)]" />
                        <div className="w-24 h-24 rounded-[2rem] bg-primary/5 text-primary flex items-center justify-center mb-8 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">
                            <Layout className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-4 italic">No deployments found.</h3>
                        <p className="text-muted-foreground max-w-sm mb-10 text-lg font-medium leading-relaxed">
                            Initialize your first high-fidelity dashboard to start orchestrating your data insights.
                        </p>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {dashboards.map(dashboard => (
                        <Card key={dashboard.id} className="group relative bg-[#030303] border-white/5 hover:border-primary/30 transition-all duration-500 rounded-[2.2rem] overflow-hidden card-shine shadow-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.05),transparent_40%)]" />

                            <Link href={`/app/dashboards/${dashboard.id}`} className="block p-8">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-primary/5">
                                        <Layout className="w-7 h-7" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white/20 hover:text-red-500 transition-colors h-10 w-10 rounded-xl hover:bg-red-500/10"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleDeleteDashboard(dashboard.id)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter text-white mb-4 group-hover:text-primary transition-colors italic leading-tight">{dashboard.name}</h3>

                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    <span className="flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/5 italic">
                                        <Calendar className="w-3 h-3 mr-2 text-primary" />
                                        {new Date(dashboard.created_at).toLocaleDateString()}
                                    </span>
                                    {dashboard.is_public ? (
                                        <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/10">Public</span>
                                    ) : (
                                        <span className="bg-white/5 text-white/30 px-3 py-1.5 rounded-full border border-white/5">Private</span>
                                    )}
                                </div>
                            </Link>

                            <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex justify-between items-center relative z-10">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 leading-none">Status: Active</span>
                                    </div>
                                    {teams.length > 0 && (
                                        <select
                                            className="text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none p-0 focus:ring-0 text-primary cursor-pointer h-auto leading-none hover:translate-x-1 transition-transform"
                                            value={dashboard.team_id || ""}
                                            onChange={(e) => handleMoveToTeam(dashboard.id, e.target.value)}
                                        >
                                            <option value="">Transfer to Team</option>
                                            {teams.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <Link href={`/app/dashboards/${dashboard.id}`}>
                                    <Button variant="ghost" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-xs text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 group/btn">
                                        Expand
                                        <ExternalLink className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
