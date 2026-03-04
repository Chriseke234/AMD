"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Share2, Database, Zap, Activity, ShieldCircle, Map, Info, MousePointer2, Focus } from "lucide-react"

export default function GraphPage() {
    const [datasets, setDatasets] = useState([])
    const [loading, setLoading] = useState(true)
    const canvasRef = useRef(null)
    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('datasets')
            .select('id, name, source_type, metadata')
        if (!error) setDatasets(data)
        setLoading(false)
    }

    // Simple Force-Directed Graph Simulation
    useEffect(() => {
        if (!datasets.length || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId

        // Initialize nodes
        const nodes = datasets.map((ds, i) => ({
            ...ds,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: 0,
            radius: ds.source_type === 'derived' ? 30 : 40,
            color: ds.source_type === 'derived' ? '#38bdf8' : '#6366f1'
        }))

        // Create links between derived nodes and their parents
        const links = []
        nodes.forEach(node => {
            if (node.metadata?.parent_id) {
                const parent = nodes.find(n => n.id === node.metadata.parent_id)
                if (parent) links.push({ source: node, target: parent })
            }
        })

        const simulate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 1. Apply Forces
            nodes.forEach((node, i) => {
                // Repulsion
                nodes.forEach((other, j) => {
                    if (i === j) return
                    const dx = node.x - other.x
                    const dy = node.y - other.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    if (distance < 200) {
                        const force = (200 - distance) / 1000
                        node.vx += dx * force
                        node.vy += dy * force
                    }
                })

                // Centering
                node.vx += (canvas.width / 2 - node.x) * 0.001
                node.vy += (canvas.height / 2 - node.y) * 0.001

                // Friction
                node.vx *= 0.95
                node.vy *= 0.95

                // Update Position
                node.x += node.vx
                node.y += node.vy
            })

            // Link Forces
            links.forEach(link => {
                const dx = link.target.x - link.source.x
                const dy = link.target.y - link.source.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const force = (distance - 150) * 0.01
                link.source.vx += dx * force
                link.source.vy += dy * force
                link.target.vx -= dx * force
                link.target.vy -= dy * force

                // Draw Links
                ctx.beginPath()
                ctx.moveTo(link.source.x, link.source.y)
                ctx.lineTo(link.target.x, link.target.y)
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)'
                ctx.setLineDash([5, 5])
                ctx.stroke()
                ctx.setLineDash([])
            })

            // 2. Draw Nodes
            nodes.forEach(node => {
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius)
                gradient.addColorStop(0, node.color)
                gradient.addColorStop(1, 'rgba(0,0,0,0)')

                ctx.beginPath()
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
                ctx.fillStyle = node.color
                ctx.globalAlpha = 0.8
                ctx.shadowBlur = 20
                ctx.shadowColor = node.color
                ctx.fill()
                ctx.globalAlpha = 1
                ctx.shadowBlur = 0

                // Label
                ctx.fillStyle = 'white'
                ctx.font = 'bold 10px Inter'
                ctx.textAlign = 'center'
                ctx.fillText(node.name, node.x, node.y + node.radius + 15)
                ctx.fillStyle = 'rgba(255,255,255,0.4)'
                ctx.font = 'black 8px Inter'
                ctx.fillText(node.source_type?.toUpperCase(), node.x, node.y + node.radius + 28)
            })

            animationFrameId = requestAnimationFrame(simulate)
        }

        simulate()
        return () => cancelAnimationFrame(animationFrameId)
    }, [datasets])

    return (
        <div className="h-[calc(100vh-12rem)] relative overflow-hidden rounded-[3rem] border border-white/5 bg-[#050505] group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]" />

            {/* UI Overlay */}
            <div className="absolute top-10 left-10 z-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-3 mb-1">
                        <Share2 className="w-3 h-3 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Knowledge Graph Prototype</span>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white">Registry Topology<span className="text-primary not-italic">.</span></h1>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-glow-indigo" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Raw Nodes: {datasets.filter(d => d.source_type !== 'derived').length}</span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-sky-400 shadow-glow-sky" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Derived: {datasets.filter(d => d.source_type === 'derived').length}</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 z-10 flex flex-col items-end space-y-4">
                <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-2xl max-w-xs space-y-4">
                    <div className="flex items-center space-x-3 text-primary">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Neural Linkage</span>
                    </div>
                    <p className="text-[11px] font-medium text-white/40 leading-relaxed">
                        Nodes represent distinct datasets. Dashed edges indicate lineage created via Derived Node protocols.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"><Focus className="w-4 h-4" /></button>
                    <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"><MousePointer2 className="w-4 h-4" /></button>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={2000}
                height={2000}
                className="w-full h-full cursor-crosshair opacity-80"
                style={{ filter: 'contrast(1.2)' }}
            />
        </div>
    )
}
