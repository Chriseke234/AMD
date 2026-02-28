"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import {
    Plus, Layout, PieChart, BarChart3, LineChart, Save,
    Share2, Grid3X3, Layers, Sparkles, Move, Settings2,
    Eye, ChevronLeft, Boxes, Zap
} from "lucide-react"
import Link from "next/link"

export default function DashboardBuilder() {
    const [widgets, setWidgets] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    const addWidget = (type) => {
        setWidgets([...widgets, {
            id: Date.now(),
            type,
            title: `New ${type.toUpperCase()} Analysis`,
            w: type === 'kpi' ? 3 : 6,
            h: 4
        }])
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] -m-8 overflow-hidden bg-[#030303]">
            {/* Widget Gallery Sidebar */}
            <div className="w-full lg:w-80 border-r border-white/5 bg-[#050506] flex flex-col relative z-20">
                <div className="p-8 border-b border-white/5 space-y-4">
                    <Link href="/app/dashboards" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors mb-4 group">
                        <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Systems
                    </Link>
                    <h2 className="text-2xl font-black italic tracking-tighter text-white flex items-center">
                        <Boxes className="w-6 h-6 mr-3 text-primary" />
                        Component <span className="text-primary ml-2 not-italic underline decoration-primary/30 underline-offset-4">Library.</span>
                    </h2>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Orchestrate your workspace</p>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center">
                            <Zap className="w-3 h-3 mr-2 text-yellow-500" />
                            Primary Metrics
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'KPI Nucleus', icon: Grid3X3, type: 'kpi', color: 'text-emerald-500' },
                                { name: 'Bar Distribution', icon: BarChart3, type: 'bar', color: 'text-primary' },
                            ].map(item => (
                                <button
                                    key={item.type}
                                    onClick={() => addWidget(item.type)}
                                    className="w-full flex items-center p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 transition-all group text-left relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <item.icon className={`w-5 h-5 mr-4 ${item.color} group-hover:scale-110 transition-transform relative z-10`} />
                                    <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors relative z-10">{item.name}</span>
                                    <Plus className="w-4 h-4 ml-auto text-white/20 group-hover:text-primary transition-all relative z-10" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center mt-4">
                            <Layers className="w-3 h-3 mr-2 text-indigo-500" />
                            Visual Engines
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Neural Line Trend', icon: LineChart, type: 'line', color: 'text-indigo-500' },
                                { name: 'Pie Segmentation', icon: PieChart, type: 'pie', color: 'text-purple-500' },
                            ].map(item => (
                                <button
                                    key={item.type}
                                    onClick={() => addWidget(item.type)}
                                    className="w-full flex items-center p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 transition-all group text-left relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <item.icon className={`w-5 h-5 mr-4 ${item.color} group-hover:scale-110 transition-transform relative z-10`} />
                                    <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors relative z-10">{item.name}</span>
                                    <Plus className="w-4 h-4 ml-auto text-white/20 group-hover:text-primary transition-all relative z-10" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-[#030303]/80 backdrop-blur-xl border-t border-white/5">
                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-white/10 hover:bg-white/5" variant="outline">
                        <Settings2 className="w-4 h-4 mr-2" />
                        Canvas Logic
                    </Button>
                </div>
            </div>

            {/* Builder Canvas Area */}
            <div className="flex-1 bg-[#050506] p-4 lg:p-12 overflow-auto relative">
                {/* Canvas Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05),transparent_70%)]" />

                {/* Canvas Header */}
                <div className="sticky top-0 z-30 flex items-center justify-between mb-12 glass p-4 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center space-x-6 px-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Operational Workspace</div>
                            <div className="text-lg font-black text-white italic tracking-tight">Untitled_Workspace_01</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 px-2">
                        <Button variant="ghost" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-all">
                            <Eye className="w-4 h-4 mr-2" /> Preview
                        </Button>
                        <Button variant="outline" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-white/10 hover:bg-white/5">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        <Button
                            className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20"
                            onClick={() => setIsSaving(true)}
                        >
                            <Save className="w-4 h-4 mr-2" /> {isSaving ? "Syncing..." : "Save State"}
                        </Button>
                    </div>
                </div>

                {/* Grid Canvas */}
                <div className="min-h-[70vh] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col p-10 relative overflow-hidden bg-white/[0.01]">
                    {widgets.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-32">
                            <div className="w-32 h-32 rounded-[3.5rem] bg-[#030303] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center mb-10 relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <Layout className="w-14 h-14 text-white/10 group-hover:text-primary transition-colors duration-700 relative z-10" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-6 text-white italic">Design your <span className="text-primary not-italic">Intelligence.</span></h2>
                            <p className="text-white/30 max-w-sm text-lg font-medium leading-relaxed">
                                Deploy components from the library to build your custom operational interface.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 gap-8">
                            {widgets.map(w => (
                                <Card
                                    key={w.id}
                                    className={`relative bg-[#080809] border-white/5 hover:border-white/10 transition-all duration-500 rounded-[2.5rem] overflow-hidden group shadow-2xl`}
                                    style={{ gridColumn: `span ${w.w}` }}
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02),transparent_40%)]" />
                                    <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                                        <div className="flex items-center space-x-3">
                                            <Move className="w-3.5 h-3.5 text-white/20 cursor-move" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{w.type} Analysis</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            onClick={() => setWidgets(widgets.filter(x => x.id !== w.id))}
                                        >
                                            <Plus className="w-4 h-4 rotate-45" />
                                        </Button>
                                    </div>
                                    <CardContent className="h-64 flex flex-col items-center justify-center relative p-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 shadow-xl">
                                            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                                        </div>
                                        <div className="space-y-2 text-center">
                                            <div className="text-sm font-black text-white italic tracking-tight">{w.title}</div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Operational Neural Preview</div>
                                        </div>
                                    </CardContent>
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-se-resize">
                                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {/* Draft Add State */}
                            <button
                                onClick={() => addWidget('bar')}
                                className="col-span-12 lg:col-span-3 h-auto min-h-[4rem] rounded-[2rem] border-2 border-dashed border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center group"
                            >
                                <Plus className="w-6 h-6 text-white/10 group-hover:text-primary transition-colors" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
