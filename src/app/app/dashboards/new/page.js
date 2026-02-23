"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Plus, Layout, PieChart, BarChart3, LineChart, Save, Share2, Grid3X3, Layers } from "lucide-react"

export default function DashboardBuilder() {
    const [widgets, setWidgets] = useState([])

    const addWidget = (type) => {
        setWidgets([...widgets, { id: Date.now(), type }])
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] -m-8 animation-fade-in overflow-hidden">
            {/* Widget Panel */}
            <div className="w-72 border-r border-[var(--border)] bg-[var(--background)] flex flex-col">
                <div className="p-6 border-b border-[var(--border)]">
                    <h2 className="font-bold flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-[var(--primary)]" />
                        Widgets
                    </h2>
                    <p className="text-xs text-[var(--muted-foreground)]">Drag or click to add</p>
                </div>
                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                    {[
                        { name: 'KPI Card', icon: Grid3X3, type: 'kpi' },
                        { name: 'Bar Chart', icon: BarChart3, type: 'bar' },
                        { name: 'Line Trend', icon: LineChart, type: 'line' },
                        { name: 'Pie Distribution', icon: PieChart, type: 'pie' },
                    ].map(item => (
                        <button
                            key={item.type}
                            onClick={() => addWidget(item.type)}
                            className="w-full flex items-center p-3 rounded-xl border border-[var(--border)] glass hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-sm font-medium group"
                        >
                            <item.icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-[var(--primary)]" />
                            {item.name}
                            <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-[var(--muted)]/50 border-t border-[var(--border)]">
                    <Button className="w-full" variant="outline">Import Setup</Button>
                </div>
            </div>

            {/* Builder Canvas */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 p-10 overflow-auto relative">
                {/* Canvas Header */}
                <div className="fixed top-20 right-8 z-10 flex space-x-2 glass p-2 rounded-2xl border border-[var(--border)] shadow-xl">
                    <Button variant="ghost" size="sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                    <Button size="sm"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                </div>

                {/* Grid Canvas */}
                <div className="min-h-full rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col p-10 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-900/50">
                    {widgets.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-6">
                                <Layout className="w-10 h-10 text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Build your dashboard</h2>
                            <p className="text-[var(--muted-foreground)] max-w-sm">Use the left panel to add charts and KPI widgets to your canvas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {widgets.map(w => (
                                <Card key={w.id} className="h-64 shadow-xl border-[var(--primary)]/10">
                                    <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">{w.type} Widget</span>
                                        <Plus className="w-4 h-4 text-slate-300 rotate-45 cursor-pointer hover:text-red-500" onClick={() => setWidgets(widgets.filter(x => x.id !== w.id))} />
                                    </div>
                                    <CardContent className="flex items-center justify-center h-full">
                                        <div className="text-slate-300 flex flex-col items-center">
                                            <PieChart className="w-12 h-12 mb-2 opacity-20" />
                                            <span className="text-sm italic">Analytics Preview</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
