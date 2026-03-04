"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Shield, Bell, Trash2, Zap, Activity, AlertTriangle, CheckCircle2, Search, Plus, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"

export default function SentryPage() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchAlerts()
    }, [])

    const fetchAlerts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/sentry/alerts')
            const data = await res.json()
            if (!data.error) setAlerts(data)
        } catch (err) {
            console.error("Failed to fetch alerts")
        }
        setLoading(false)
    }

    const deleteAlert = async (id) => {
        await supabase.from('neural_alerts').delete().eq('id', id)
        setAlerts(alerts.filter(a => a.id !== id))
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Immersive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Neural Sentry Protocol Active</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white italic">Registry Sentry<span className="text-primary not-italic">.</span></h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest max-w-md">Proactive Data Monitoring & Real-time Anomaly Detection Hub.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex items-center">
                        <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10">All Watchers</Button>
                        <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Triggered</Button>
                    </div>
                </div>
            </div>

            {/* Sentry Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)
                ) : alerts.length === 0 ? (
                    <Card className="lg:col-span-3 py-24 border-dashed border-2 bg-white/[0.02] flex flex-col items-center justify-center rounded-[4rem]">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                            <Shield className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-black italic mb-4">No Sentry Entities Bound</h3>
                        <p className="text-white/20 text-sm font-medium mb-10 max-w-xs text-center leading-relaxed">Bind AI-driven watchers to your datasets from any insight card or chat session.</p>
                        <Button className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20">Init Sentry Protocol</Button>
                    </Card>
                ) : (
                    alerts.map(alert => (
                        <Card key={alert.id} className="p-8 bg-[#0a0a0b] border-white/5 rounded-[2.5rem] hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${alert.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                    {alert.status === 'active' ? <Activity className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl" onClick={() => deleteAlert(alert.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">{alert.datasets?.name || 'Dataset'}</span>
                                    <h3 className="text-xl font-black italic truncate">{alert.title}</h3>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Condition Logic</span>
                                        <span className="text-[10px] font-mono text-primary">{alert.condition}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[70%] bg-primary animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
                                <span className="flex items-center"><Bell className="w-3 h-3 mr-2" /> Real-time Enabled</span>
                                <span className="text-primary italic">Status: Monitoring</span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
