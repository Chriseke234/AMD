"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
    Users, Database, Sparkles, TrendingUp,
    ArrowUpRight, ArrowDownRight, Activity,
    ShieldCheck, DollarSign, Loader2, RefreshCw
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const supabase = createClient()

    const fetchStats = async () => {
        setRefreshing(true)
        const { data, error } = await supabase.rpc('get_system_stats')
        if (data) setStats(data)
        setLoading(false)
        setRefreshing(false)
    }

    useEffect(() => {
        fetchStats()
    }, [])

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[var(--muted-foreground)] uppercase tracking-widest font-bold text-xs">Loading System Intel...</p>
        </div>
    )

    const metrics = [
        { title: "Total Users", value: stats?.users || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
        { title: "Data Sources", value: stats?.datasets || 0, icon: Database, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+5%" },
        { title: "AI Queries", value: stats?.queries || 0, icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+28%" },
        { title: "Estimated Cost", value: `$${stats?.estimated_cost_usd?.toFixed(2) || '0.00'}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "-2%" },
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8 animation-fade-in p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center">
                        <Activity className="w-10 h-10 mr-4 text-primary" /> ADMIN COMMAND
                    </h1>
                    <p className="text-[var(--muted-foreground)] font-medium">Real-time platform oversight & unit economics</p>
                </div>
                <Button
                    variant="outline"
                    className="rounded-full border-primary/20 hover:bg-primary/5"
                    onClick={fetchStats}
                    disabled={refreshing}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Syncing...' : 'Sync Data'}
                </Button>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <Card key={i} className="p-6 group hover:border-primary/50 transition-all overflow-hidden relative">
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform ${m.color}`}>
                            <m.icon className="w-12 h-12" />
                        </div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center`}>
                                <m.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{m.title}</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-black">{m.value}</h3>
                            <div className={`flex items-center text-xs font-bold ${m.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {m.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {m.trend}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Growth Chart */}
                <Card className="lg:col-span-8 p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Platform Growth</h3>
                            <p className="text-sm text-[var(--muted-foreground)]">30-day activity trend</p>
                        </div>
                        <div className="flex bg-[var(--muted)]/30 p-1 rounded-lg">
                            <button className="px-3 py-1 text-xs font-bold rounded-md bg-white shadow-sm">Queries</button>
                            <button className="px-3 py-1 text-xs font-bold text-[var(--muted-foreground)]">Users</button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'W1', q: 400, u: 240 },
                                { name: 'W2', q: 700, u: 380 },
                                { name: 'W3', q: 1200, u: 520 },
                                { name: 'W4', q: stats?.queries || 1500, u: stats?.users || 600 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="q" stroke="var(--primary)" fillOpacity={1} fill="url(#colorQ)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* System Health */}
                <Card className="lg:col-span-4 p-8">
                    <h3 className="text-xl font-bold mb-6">Service Health</h3>
                    <div className="space-y-6">
                        {[
                            { name: "API Gateway", status: "Operational", color: "bg-emerald-500" },
                            { name: "AI Inference Engine", status: "Degraded (L4)", color: "bg-amber-500" },
                            { name: "Data Processing Pipeline", status: "Operational", color: "bg-emerald-500" },
                            { name: "Supabase DB Core", status: "Operational", color: "bg-emerald-500" },
                        ].map((h, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${h.color} animate-pulse`} />
                                    <span className="text-sm font-bold truncate">{h.name}</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{h.status}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                            <div className="flex items-center text-primary">
                                <Activity className="w-5 h-5 mr-3" />
                                <div className="text-xs">
                                    <p className="font-bold">Resource Utilization</p>
                                    <p className="opacity-70">85% platform capacity</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
