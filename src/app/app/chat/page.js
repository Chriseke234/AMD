"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import {
    Send, Sparkles, Database, Trash2, Layout, Plus, Check, ChevronRight, ChevronDown as ChevronDownIcon, Download, Share2,
    BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table as TableIcon,
    Pin, Save, Loader2, X, Info, AlertCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import Link from "next/link"

export default function AnalyticsChat() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [datasets, setDatasets] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [showDatasetSelector, setShowDatasetSelector] = useState(false)
    const [dashboards, setDashboards] = useState([])
    const [savingWidget, setSavingWidget] = useState(null) // Stores the message being saved
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const messagesEndRef = useRef(null)
    const supabase = createClient()

    const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        fetchInitialData()
        setMessages([
            { id: 1, role: 'ai', content: "Hello! I'm your AI Data Assistant. Ask me anything about your datasets, e.g., 'Show me the revenue trend for last month.'", type: 'text' }
        ])
    }, [])

    const fetchInitialData = async () => {
        const { data: ds } = await supabase.from('datasets').select('id, name').eq('status', 'completed')
        const { data: db } = await supabase.from('dashboards').select('*').order('name')
        setDatasets(ds || [])
        setDashboards(db || [])
        if (ds?.length > 0 && selectedIds.length === 0) {
            setSelectedIds([ds[0].id])
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return
        if (selectedIds.length === 0) {
            alert("Please select at least one dataset first.")
            return
        }

        const userMsg = { id: Date.now(), role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setLoading(true)

        try {
            const res = await fetch('/api/ai-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input, datasetIds: selectedIds })
            })

            const data = await res.json()

            if (data.error) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: data.error,
                    type: 'error'
                }])
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: data.insight,
                    sql: data.sql,
                    results: data.results,
                    chartType: data.chartType,
                    title: data.title,
                    type: 'analysis',
                    query: userMsg.content, // Store the original query for saving
                    chartConfig: data.chartConfig // Store chart config for saving
                }])
            }
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: "Something went wrong while connecting to the AI engine.",
                type: 'error'
            }])
        } finally {
            setLoading(false)
        }
    }

    const toggleDataset = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleSaveToDashboard = async (dashboardId) => {
        if (!savingWidget) return
        setIsSaving(true)

        try {
            const { error } = await supabase.from('dashboard_widgets').insert({
                dashboard_id: dashboardId,
                dataset_id: selectedIds[0], // Assuming single dataset for now, or need to handle multiple
                title: savingWidget.query,
                sql_query: savingWidget.sql,
                chart_type: savingWidget.chartType,
                chart_config: savingWidget.chartConfig,
                position: { x: 0, y: 0, w: 6, h: 4 }
            })

            if (error) throw error

            setIsSaveModalOpen(false)
            setSavingWidget(null)
            alert("Insight saved to dashboard!")
        } catch (err) {
            alert("Failed to save: " + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const renderChart = (msg) => {
        const { chartType, results, title } = msg
        if (!results || results.length === 0) return null

        // Simple heuristic for chart data
        const dataKeys = Object.keys(results[0])
        const xKey = dataKeys[0]
        const yKeys = dataKeys.slice(1)

        switch (chartType) {
            case 'bar':
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={results}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey={xKey} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                {yKeys.map((key, i) => (
                                    <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )
            case 'line':
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={results}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey={xKey} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                {yKeys.map((key, i) => (
                                    <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )
            case 'pie':
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={results}
                                    cx="50%" cy="50%"
                                    outerRadius={80}
                                    dataKey={yKeys[0]}
                                    nameKey={xKey}
                                    label
                                >
                                    {results.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )
            case 'table':
            default:
                return (
                    <div className="overflow-x-auto rounded-xl border border-[var(--border)] max-h-64">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)] sticky top-0">
                                <tr>
                                    {Object.keys(results[0]).map(h => (
                                        <th key={h} className="px-4 py-2 font-bold uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {results.slice(0, 50).map((row, i) => (
                                    <tr key={i} className="bg-white hover:bg-[var(--muted)]/20 transition-colors">
                                        {Object.values(row).map((v, j) => (
                                            <td key={j} className="px-4 py-2 text-[var(--foreground)]">{String(v)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {results.length > 50 && (
                            <div className="p-2 text-center text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/10">
                                Showing first 50 rows
                            </div>
                        )}
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animation-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden glass border-white/5 bg-white/[0.01] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/5 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="px-10 py-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-2xl flex items-center justify-between relative z-20">
                <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shadow-2xl shadow-primary/20 border border-primary/20 group hover:scale-110 transition-transform">
                        <Sparkles className="w-7 h-7 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="font-black text-2xl tracking-tighter text-white font-heading italic">
                            Neural Assistant<span className="text-primary not-italic">.</span>
                        </h2>
                        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-green-500/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                            Core L4 Active
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-6 py-5 border-white/10 hover:border-primary/40 bg-white/5 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-all overflow-hidden relative group"
                        onClick={() => setShowDatasetSelector(!showDatasetSelector)}
                    >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Database className="w-4 h-4 mr-3 text-primary relative z-10" />
                        <span className="relative z-10">{selectedIds.length} Nodes Active</span>
                        <ChevronDownIcon className={`w-4 h-4 ml-3 transition-transform relative z-10 ${showDatasetSelector ? 'rotate-180' : ''}`} />
                    </Button>

                    {showDatasetSelector && (
                        <Card className="absolute right-0 mt-4 w-80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5 glass bg-[#0f0f12] z-50 animation-scale-in rounded-[2rem]">
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 px-2">Knowledge Sources</h4>
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                {datasets.map(ds => (
                                    <div
                                        key={ds.id}
                                        onClick={() => toggleDataset(ds.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${selectedIds.includes(ds.id) ? 'bg-primary/10 border border-primary/30 shadow-[inset_0_0_20px_rgba(124,58,237,0.05)]' : 'hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <div className="flex items-center space-x-4 truncate">
                                            <div className={`p-2.5 rounded-xl transition-colors ${selectedIds.includes(ds.id) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/20'}`}>
                                                <Database className="w-4 h-4" />
                                            </div>
                                            <span className={`text-sm font-bold truncate transition-colors ${selectedIds.includes(ds.id) ? 'text-white' : 'text-white/40'}`}>{ds.name}</span>
                                        </div>
                                        {selectedIds.includes(ds.id) && <Check className="w-4 h-4 text-primary shrink-0 animate-scale-in" />}
                                    </div>
                                ))}
                                {datasets.length === 0 && (
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 text-center py-6">No neural nodes found.</p>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-10 overflow-y-auto space-y-10 bg-gradient-to-b from-transparent to-black/20 scroll-smooth custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animation-slide-up`}>
                        <div className={`max-w-[85%] lg:max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white rounded-[2rem] rounded-tr-none px-8 py-5 shadow-[0_10px_30px_rgba(124,58,237,0.3)] font-medium text-lg' : 'space-y-6'}`}>
                            {msg.role === 'ai' ? (
                                <div className="space-y-6">
                                    <div className={`rounded-[2.5rem] rounded-tl-none p-8 shadow-2xl border backdrop-blur-md relative overflow-hidden ${msg.type === 'error' ? 'bg-red-500/5 text-red-400 border-red-500/20' : 'bg-white/[0.03] border-white/5'}`}>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                        <p className="text-white/80 leading-relaxed text-lg font-medium">{msg.content}</p>
                                        {msg.sql && (
                                            <div className="mt-6 pt-6 border-t border-white/5">
                                                <details className="cursor-pointer group">
                                                    <summary className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center group-hover:text-primary transition-colors">
                                                        Protocol Trace (SQL)
                                                    </summary>
                                                    <div className="mt-4 p-5 bg-[#050507] text-primary/80 rounded-2xl text-xs overflow-x-auto font-mono border border-white/5 shadow-inner">
                                                        {msg.sql}
                                                    </div>
                                                </details>
                                            </div>
                                        )}
                                    </div>

                                    {msg.type === 'analysis' && msg.results?.length > 0 && (
                                        <Card className="p-10 border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all duration-700 rounded-[3rem] overflow-hidden group relative">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors" />
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6 relative z-10">
                                                <h4 className="font-black text-xl flex items-center text-white font-heading tracking-tight italic">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-xl shadow-primary/10">
                                                        {msg.chartType === 'pie' ? <PieChartIcon className="w-6 h-6 text-primary" /> : <BarChart3 className="w-6 h-6 text-primary" />}
                                                    </div>
                                                    {msg.title || "Observation Matrix"}
                                                </h4>
                                                <div className="flex items-center space-x-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-10 rounded-full px-5 text-[10px] font-black uppercase tracking-widest border-white/5 bg-white/5 hover:bg-primary hover:text-white transition-all"
                                                        onClick={() => {
                                                            setSavingWidget(msg)
                                                            setIsSaveModalOpen(true)
                                                        }}
                                                    >
                                                        <Pin className="w-3.5 h-3.5 mr-2" /> Pin Node
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-10 rounded-full px-5 text-[10px] font-black uppercase tracking-widest border-white/5 bg-white/5 hover:bg-white/10 transition-all font-black">
                                                        <Download className="w-3.5 h-3.5 mr-2" /> Export
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="relative z-10">
                                                {renderChart(msg)}
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            ) : (
                                <p className="font-bold tracking-tight">{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animation-pulse">
                        <div className="glass border-white/5 bg-white/[0.02] rounded-full px-8 py-5 shadow-2xl flex items-center space-x-4">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Neural Processing...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-black/40 backdrop-blur-3xl border-t border-white/5 relative z-10">
                <form onSubmit={handleSend} className="relative max-w-5xl mx-auto flex items-center">
                    <div className="relative flex-1 group">
                        <Input
                            className="pr-16 pl-10 py-10 text-xl rounded-[2.5rem] border-white/5 group-hover:border-primary/30 focus-visible:ring-primary shadow-2xl bg-white/5 text-white placeholder:text-white/20 transition-all font-medium custom-focus"
                            placeholder={selectedIds.length > 0 ? "Ask a question about your datasets..." : "Select activation nodes to begin..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={selectedIds.length === 0}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading || selectedIds.length === 0}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(124,58,237,0.4)] disabled:opacity-20 disabled:hover:scale-100 disabled:shadow-none"
                        >
                            <Send className="w-7 h-7" />
                        </button>
                    </div>
                </form>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-10">
                    <div className="flex items-center text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                        <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                            <Info className="w-3 h-3 text-primary" />
                        </div>
                        Natural Logic
                    </div>
                    <div className="flex items-center text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                        <div className="w-5 h-5 rounded-lg bg-green-500/10 flex items-center justify-center mr-3">
                            <Database className="w-3 h-3 text-green-500" />
                        </div>
                        Secure PG Role
                    </div>
                    <div className="flex items-center text-[9px] font-black text-primary uppercase tracking-[0.4em]">
                        <Sparkles className="w-4 h-4 mr-3 animate-pulse" />
                        AskMyData L4 Engine
                    </div>
                </div>
            </div>

            {/* Save to Dashboard Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                    <Card className="w-full max-lg p-10 glass border-white/5 bg-[#0f0f12] animation-scale-in rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-white tracking-tighter italic font-heading">Pin to Dashboard<span className="text-primary not-italic">.</span></h2>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-white/30 hover:text-white" onClick={() => setIsSaveModalOpen(false)}>
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <p className="text-white/40 mb-10 text-lg leading-relaxed">Select a dashboard node to persist this intelligence insight. It will be updated live as your data evolves.</p>

                        <div className="space-y-4 max-h-80 overflow-y-auto pr-3 mb-10 custom-scrollbar">
                            {dashboards.map(db => (
                                <button
                                    key={db.id}
                                    onClick={() => handleSaveToDashboard(db.id)}
                                    disabled={isSaving}
                                    className="w-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 flex items-center justify-between transition-all group disabled:opacity-50"
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mr-5 group-hover:bg-primary/20 transition-colors">
                                            <Layout className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="font-black text-lg text-white group-hover:text-primary transition-colors">{db.name}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                </button>
                            ))}
                            <Link href="/app/dashboards" className="block mt-4">
                                <Button variant="ghost" className="w-full justify-center py-6 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/5">
                                    <Plus className="w-4 h-4 mr-3" /> Create New Dashboard
                                </Button>
                            </Link>
                        </div>

                        {isSaving && (
                            <div className="flex items-center justify-center py-6 text-primary font-black uppercase tracking-widest text-xs">
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Persisting Intelligence...
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    )
}
