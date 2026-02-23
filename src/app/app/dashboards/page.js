"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Layout, Plus, Share2, Clock, MoreHorizontal, ArrowUpRight } from "lucide-react"

export default function DashboardsPage() {
    const router = useRouter()
    const dashboardList = [
        { id: '1', title: "Q1 Sales Performance", owner: "You", shared: true, lastEdit: "2 hours ago" },
        { id: '2', title: "Inventory Health", owner: "Sarah Tech", shared: false, lastEdit: "Yesterday" },
    ]

    return (
        <div className="space-y-8 animation-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboards</h1>
                    <p className="text-[var(--muted-foreground)] text-lg">Visualize your data insights with custom widgets.</p>
                </div>
                <Button onClick={() => router.push("/app/dashboards/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Dashboard
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardList.map((db) => (
                    <Card key={db.id} className="group hover:shadow-lg transition-all border-[var(--border)] overflow-hidden flex flex-col">
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-8 group-hover:bg-[var(--primary)]/5 transition-colors">
                            <Layout className="w-12 h-12 text-slate-300 group-hover:text-[var(--primary)]/40 transition-colors" />
                        </div>
                        <CardHeader className="flex-1 p-5 pb-0">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-xl font-bold group-hover:text-[var(--primary)] transition-colors">{db.title}</CardTitle>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 px-2 py-0.5 rounded-full">by {db.owner}</span>
                                {db.shared && (
                                    <span className="flex items-center text-[10px] text-blue-500 font-bold uppercase tracking-tight">
                                        <Share2 className="w-3 h-3 mr-1" /> Shared
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <div className="p-5 pt-4 border-t border-[var(--border)] mt-4 flex items-center justify-between">
                            <div className="flex items-center text-xs text-[var(--muted-foreground)]">
                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                {db.lastEdit}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/app/dashboards/${db.id}`)}>
                                Open <ArrowUpRight className="w-3 h-3 ml-2" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
