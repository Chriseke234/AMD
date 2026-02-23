"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ShieldCheck, ToggleLeft, ToggleRight, Sparkles, Database, BarChart3, Braces } from "lucide-react"

export default function AdminFeaturesPage() {
    const [flags, setFlags] = useState([
        { id: 1, name: "Advanced AI Forecast", enabled: true, icon: Sparkles, color: "text-purple-500" },
        { id: 2, name: "Multi-dataset Joins", enabled: true, icon: Database, color: "text-blue-500" },
        { id: 3, name: "Live Dashboard Streaming", enabled: false, icon: BarChart3, color: "text-green-500" },
        { id: 4, name: "Public API Beta", enabled: false, icon: Braces, color: "text-amber-500" },
    ])

    const toggleFlag = (id) => {
        setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animation-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center">
                    <ShieldCheck className="w-8 h-8 mr-4 text-[var(--primary)]" />
                    Feature Flags
                </h1>
                <p className="text-slate-500 text-lg">Manage accessibility and system-wide feature rollout.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {flags.map((flag) => (
                    <Card key={flag.id} className="hover:border-[var(--primary)]/30 transition-all bg-white dark:bg-[#1e293b]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${flag.color}`}>
                                        <flag.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{flag.name}</h3>
                                        <p className="text-sm text-slate-400">Control of this component for all users.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`text-xs font-black uppercase tracking-widest ${flag.enabled ? 'text-green-500' : 'text-slate-400'}`}>
                                        {flag.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                    <button
                                        onClick={() => toggleFlag(flag.id)}
                                        className={`transition-colors ${flag.enabled ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`}
                                    >
                                        {flag.enabled ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12" />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end pt-6">
                <Button size="lg" className="px-12">Commit Changes</Button>
            </div>
        </div>
    )
}
