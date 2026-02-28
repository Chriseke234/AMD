"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Layout, ArrowLeft, ChevronLeft, Share2, Plus, Loader2, Trash2, Maximize2, Sparkles, TrendingUp, Calendar, Zap } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

export default function DashboardDetailPage({ params }) {
    const [dashboard, setDashboard] = useState(null)
    const [widgets, setWidgets] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchDashboardData()
    }, [params.id])

    const fetchDashboardData = async () => {
        const { data: dashboardData } = await supabase
            .from('dashboards')
            .select('*')
            .eq('id', params.id)
            .single()

        const { data: widgetsData } = await supabase
            .from('dashboard_widgets')
            .select('*')
            .eq('dashboard_id', params.id)
            .order('created_at', { ascending: true })

        setDashboard(dashboardData)

        // Execute queries for each widget
        const widgetsWithData = await Promise.all((widgetsData || []).map(async (widget) => {
            const { data, error } = await supabase.rpc('execute_ai_query', { sql_query: widget.sql_query })
            return { ...widget, data: data || [] }
        }))

        setWidgets(widgetsWithData)
        setLoading(false)
    }

    const removeWidget = async (id) => {
        const { error } = await supabase.from('dashboard_widgets').delete().eq('id', id)
        if (!error) setWidgets(widgets.filter(w => w.id !== id))
    }

    const renderChart = (widget) => {
        const data = widget.data
        if (!data || data.length === 0) return (
            <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4">
                <Zap className="w-8 h-8 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Null Data Buffer</span>
            </div>
        )

        const keys = Object.keys(data[0])
        const xKey = keys[0]
        const yKey = keys[1]

        const COLORS = ['#7c3aed', '#6366f1', '#a855f7', '#ec4899', '#3b82f6'];

        if (widget.chart_type === 'bar') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey={xKey} fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#ffffff60' }} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#ffffff60' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                        />
                        <Bar dataKey={yKey} fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )
        }

        if (widget.chart_type === 'line') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="lineContent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey={xKey} fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#ffffff60' }} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#ffffff60' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                        />
                        <Line type="monotone" dataKey={yKey} stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4, stroke: '#030303' }} />
                    </LineChart>
                </ResponsiveContainer>
            )
        }

        return <pre className="text-[10px] overflow-auto h-full">{JSON.stringify(data, null, 2)}</pre>
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[var(--muted-foreground)]">Loading your insights...</p>
        </div>
    )

    if (!dashboard) return <div>Dashboard not found</div>

    return (
        <div className="space-y-12 animation-fade-in pb-20">
            {/* Immersive Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                <div className="flex items-center space-x-6">
                    <Link href="/app/dashboards">
                        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all group">
                            <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center space-x-3 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">System Workspace Active</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white italic">{dashboard.name}</h1>
                        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                            <Calendar className="w-3 h-3 mr-2" />
                            Deployed: {new Date(dashboard.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 bg-white/[0.03] p-2 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
                    <Button variant="ghost" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/5">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Link href="/app/chat">
                        <Button className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                            <Plus className="w-4 h-4 mr-2 shadow-sm" /> Add Insight
                        </Button>
                    </Link>
                </div>
            </div>

            {widgets.length === 0 ? (
                <div className="py-20">
                    <Card className="p-24 text-center border-dashed border-2 border-border/40 bg-secondary/5 rounded-[4rem] flex flex-col items-center justify-center group relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.03),transparent_70%)]" />
                        <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 text-primary flex items-center justify-center mb-10 shadow-3xl shadow-primary/20 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-4 italic text-white">Neural Workspace Empty.</h3>
                        <p className="text-white/30 max-w-sm mb-12 text-lg font-medium leading-relaxed">
                            Interact with the AI Analytics Chat to pin insights and build your operational intelligence.
                        </p>
                        <Link href="/app/chat">
                            <Button size="lg" className="h-16 px-12 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30">
                                Launch AI Chat
                            </Button>
                        </Link>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 auto-rows-[360px]">
                    {widgets.map(widget => (
                        <Card
                            key={widget.id}
                            style={{ gridColumn: `span ${widget.position.w || 6}`, gridRow: `span ${widget.position.h ? Math.ceil(widget.position.h / 4) : 1}` }}
                            className="p-8 flex flex-col group overflow-hidden bg-[#0a0a0b] border-white/5 hover:border-primary/20 transition-all duration-500 rounded-[2.5rem] shadow-2xl relative"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.05),transparent_50%)]" />

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-2" />
                                        Insight Engine
                                    </div>
                                    <h3 className="font-black text-lg text-white italic tracking-tight truncate pr-4">{widget.title}</h3>
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                                        onClick={() => removeWidget(widget.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-white/20 hover:text-white hover:bg-white/5 rounded-xl">
                                        <Maximize2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-0 relative z-10">
                                {renderChart(widget)}
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-white/10 flex items-center justify-between relative z-10">
                                <span>Buffer: Verified</span>
                                <span className="text-primary/40 italic">Live Sync Active</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
