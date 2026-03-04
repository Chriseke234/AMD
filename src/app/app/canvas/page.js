"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Layout, Maximize2, Move, Pin, Share2, Plus, MousePointer2, Hand, ZoomIn, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"

export default function CanvasPage() {
    const [widgets, setWidgets] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('select') // 'select' or 'pan'
    const supabase = createClient()

    useEffect(() => {
        fetchWidgets()
    }, [])

    const fetchWidgets = async () => {
        const { data, error } = await supabase
            .from('dashboard_widgets')
            .select('*')
            .limit(10)

        if (!error) {
            // Assign random initial positions for the canvas layout
            setWidgets(data.map((w, i) => ({
                ...w,
                x: 100 + (i % 3) * 450,
                y: 100 + Math.floor(i / 3) * 400
            })))
        }
        setLoading(false)
    }

    const updatePosition = (id, x, y) => {
        setWidgets(widgets.map(w => w.id === id ? { ...w, x, y } : w))
    }

    return (
        <div className="h-[calc(100vh-12rem)] relative overflow-hidden rounded-[3rem] border border-white/5 bg-[#050505] bg-[url('/grid.svg')] bg-[length:40px_40px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.08),transparent_70%)]" />

            {/* Float Toolbar */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 p-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl shadow-2xl">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-11 w-11 rounded-xl transition-all ${viewMode === 'select' ? 'bg-primary text-white shadow-glow-primary' : 'text-white/40 hover:bg-white/5'}`}
                    onClick={() => setViewMode('select')}
                >
                    <MousePointer2 className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-11 w-11 rounded-xl transition-all ${viewMode === 'pan' ? 'bg-primary text-white shadow-glow-primary' : 'text-white/40 hover:bg-white/5'}`}
                    onClick={() => setViewMode('pan')}
                >
                    <Hand className="w-5 h-5" />
                </Button>
                <div className="w-[1px] h-6 bg-white/10 mx-2" />
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-white/40 hover:bg-white/5 hover:text-white"><Plus className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-white/40 hover:bg-white/5 hover:text-white"><Search className="w-5 h-5" /></Button>
            </div>

            {/* Action Bar */}
            <div className="absolute top-10 right-10 z-20 flex items-center space-x-3">
                <Button className="h-12 px-6 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 flex items-center">
                    <Share2 className="w-4 h-4 mr-2" /> Publish Story
                </Button>
            </div>

            {/* Canvas Area */}
            <div className="absolute inset-0 p-20 overflow-auto scrollbar-hide">
                <div className="relative w-[4000px] h-[4000px]">
                    {loading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-96 rounded-[2.5rem] absolute scale-95 opacity-50" style={{ left: 100 + i * 300, top: 100 }} />)
                    ) : (
                        widgets.map(widget => (
                            <Card
                                key={widget.id}
                                className="absolute p-6 bg-[#0a0a0b]/80 border-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl hover:border-primary/20 transition-all duration-300 w-[420px] group cursor-grab active:cursor-grabbing"
                                style={{ left: widget.x, top: widget.y, transform: 'scale(1)' }}
                                onMouseDown={(e) => {
                                    if (viewMode !== 'select') return
                                    const startX = e.clientX - widget.x
                                    const startY = e.clientY - widget.y

                                    const onMouseMove = (moveEvent) => {
                                        updatePosition(widget.id, moveEvent.clientX - startX, moveEvent.clientY - startY)
                                    }

                                    const onMouseUp = () => {
                                        document.removeEventListener('mousemove', onMouseMove)
                                        document.removeEventListener('mouseup', onMouseUp)
                                    }

                                    document.addEventListener('mousemove', onMouseMove)
                                    document.addEventListener('mouseup', onMouseUp)
                                }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Layout className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{widget.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white rounded-lg"><Maximize2 className="w-3.5 h-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white rounded-lg"><Pin className="w-3.5 h-3.5" /></Button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black italic mb-6 truncate">{widget.title}</h3>

                                <div className="h-40 w-full bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-6 overflow-hidden">
                                    <div className="w-full h-full opacity-40 blur-sm bg-gradient-to-br from-primary/20 to-transparent" />
                                    <Activity className="absolute w-8 h-8 text-primary shadow-glow-primary animate-pulse" />
                                </div>

                                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                                    <span>Intelligence Active</span>
                                    <span className="text-primary italic">Neuro-Rendered</span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Mini Legend */}
            <div className="absolute bottom-10 left-10 z-20 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Active Entity</span>
                </div>
                <div className="w-[1px] h-3 bg-white/10 mx-2" />
                <div className="flex items-center space-x-2">
                    <Move className="w-3 h-3" />
                    <span>Free Transform Mode</span>
                </div>
            </div>
        </div>
    )
}
