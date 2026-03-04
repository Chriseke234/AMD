"use client"

import { useState, useEffect, use } from "react"
import { createClient } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Database, TrendingUp, Zap, Layers } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function PublicDashboardPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const token = params.token // Token is currently just the dashboard ID
    const [dashboard, setDashboard] = useState(null)
    const [widgets, setWidgets] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchPublicData = async () => {
            const { data: ds } = await supabase
                .from('dashboards')
                .select('*')
                .eq('id', token)
                .single()

            if (!ds) {
                setLoading(false)
                return
            }

            setDashboard(ds)

            const { data: ws } = await supabase
                .from('dashboard_widgets')
                .select('*')
                .eq('dashboard_id', token)
                .order('created_at', { ascending: true })

            const wsWithData = await Promise.all((ws || []).map(async (w) => {
                const { data } = await supabase.rpc('execute_ai_query', { sql_query: w.sql_query })
                return { ...w, data: data || [] }
            }))

            setWidgets(wsWithData)
            setLoading(false)
        }
        fetchPublicData()
    }, [token])

    const renderChart = (widget) => {
        const data = widget.data
        if (!data || data.length === 0) return null
        const keys = Object.keys(data[0])
        const xKey = keys[0]
        const yKey = keys[1]

        if (widget.chart_type === 'bar') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey={xKey} font-size={10} tickLine={false} axisLine={false} tick={{ fill: '#ffffff60' }} />
                        <YAxis font-size={10} tickLine={false} axisLine={false} tick={{ fill: '#ffffff60' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0b', border: 'none', borderRadius: '12px' }} />
                        <Bar dataKey={yKey} fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )
        }
        return <pre className="text-[10px] opacity-20">{JSON.stringify(data, null, 2)}</pre>
    }

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-black uppercase tracking-widest animate-pulse">Neural Decrypting...</div>
    if (!dashboard) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-black uppercase tracking-widest">Access Denied / Invalid Hub</div>

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 sm:p-12 font-sans selection:bg-primary selection:text-white">
            <div className="max-w-[1600px] mx-auto space-y-12">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-primary">
                            <Layers className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Public Intelligence Node</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter">{dashboard.name}<span className="text-primary">.</span></h1>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Shared via AskMyData Protocol</p>
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center space-x-3">
                        <Database className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Registry Hub</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 auto-rows-[340px]">
                    {widgets.map(w => (
                        <Card key={w.id} className="lg:col-span-6 p-8 bg-[#0a0a0b] border-white/5 rounded-[2.5rem] flex flex-col shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                            <div className="flex flex-col mb-6 relative z-10">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-2" />
                                    Insight Widget
                                </span>
                                <h3 className="text-lg font-black">{w.title}</h3>
                            </div>
                            <div className="flex-1 min-h-0 relative z-10">
                                {renderChart(w)}
                            </div>
                        </Card>
                    ))}
                </div>

                <footer className="pt-20 pb-10 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Built with AskMyData • The Future of Neural Analytics</p>
                </footer>
            </div>
        </div>
    )
}
