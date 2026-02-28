"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import {
    Send, Sparkles, Database, Trash2, Layout, Plus, Check, ChevronRight, ChevronDown, Download, Share2,
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
        <div className="flex flex-col h-[calc(100vh-8rem)] animation-fade-in shadow-2xl rounded-[2.5rem] overflow-hidden glass border border-[var(--border)]/50">
            {/* Header */}
            <div className="px-8 py-5 border-b border-[var(--border)]/50 bg-white/50 backdrop-blur-md flex items-center justify-between relative z-20">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg tracking-tight">AI Data Assistant</h2>
                        <div className="flex items-center text-xs font-medium text-green-500">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                            Connected & Ready
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-5 border-primary/20 hover:border-primary/40 bg-white"
                        onClick={() => setShowDatasetSelector(!showDatasetSelector)}
                    >
                        <Database className="w-4 h-4 mr-2 text-primary" />
                        {selectedIds.length} {selectedIds.length === 1 ? 'Dataset' : 'Datasets'} Selected
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDatasetSelector ? 'rotate-180' : ''}`} />
                    </Button>

                    {showDatasetSelector && (
                        <Card className="absolute right-0 mt-3 w-72 p-4 shadow-2xl border-primary/10 z-50 animation-scale-in">
                            <h4 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-3">Select Data Sources</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {datasets.map(ds => (
                                    <div
                                        key={ds.id}
                                        onClick={() => toggleDataset(ds.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedIds.includes(ds.id) ? 'bg-primary/5 border border-primary/20' : 'hover:bg-[var(--muted)] border border-transparent'}`}
                                    >
                                        <div className="flex items-center space-x-3 truncate">
                                            <div className={`p-2 rounded-lg ${selectedIds.includes(ds.id) ? 'bg-primary text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                                                <Database className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-semibold truncate">{ds.name}</span>
                                        </div>
                                        {selectedIds.includes(ds.id) && <Check className="w-4 h-4 text-primary shrink-0" />}
                                    </div>
                                ))}
                                {datasets.length === 0 && (
                                    <p className="text-xs text-[var(--muted-foreground)] text-center py-4">No datasets found.</p>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-gradient-to-b from-white/50 to-[var(--muted)]/10 scroll-smooth">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'bg-primary text-white rounded-3xl rounded-tr-none px-6 py-4 shadow-lg shadow-primary/20' : 'space-y-4'}`}>
                            {msg.role === 'ai' ? (
                                <div className="space-y-5">
                                    <div className={`rounded-3xl rounded-tl-none p-6 shadow-sm border border-[var(--border)]/50 ${msg.type === 'error' ? 'bg-red-50 text-red-800 border-red-100' : 'bg-white'}`}>
                                        <p className="text-[var(--foreground)] leading-relaxed">{msg.content}</p>
                                        {msg.sql && (
                                            <div className="mt-4 pt-4 border-t border-[var(--border)]/50">
                                                <details className="cursor-pointer group">
                                                    <summary className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest flex items-center group-hover:text-primary transition-colors">
                                                        View Generated SQL
                                                    </summary>
                                                    <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-x-auto font-mono border border-white/10 shadow-inner">
                                                        {msg.sql}
                                                    </pre>
                                                </details>
                                            </div>
                                        )}
                                    </div>

                                    {msg.type === 'analysis' && msg.results?.length > 0 && (
                                        <Card className="p-8 border-primary/10 bg-white/80 backdrop-blur shadow-xl hover:shadow-2xl transition-shadow duration-500 rounded-[2rem] overflow-hidden group">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                                <h4 className="font-bold text-lg flex items-center text-[var(--foreground)]">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                        {msg.chartType === 'pie' ? <PieChartIcon className="w-5 h-5 text-primary" /> : <BarChart3 className="w-5 h-5 text-primary" />}
                                                    </div>
                                                    {msg.title || "Query Results"}
                                                </h4>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 rounded-lg text-xs"
                                                        onClick={() => {
                                                            setSavingWidget(msg)
                                                            setIsSaveModalOpen(true)
                                                        }}
                                                    >
                                                        <Pin className="w-3 h-3 mr-1" /> Pin to Dashboard
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs">
                                                        <Download className="w-3 h-3 mr-1" /> Export
                                                    </Button>
                                                </div>
                                            </div>
                                            {renderChart(msg)}
                                        </Card>
                                    )}
                                </div>
                            ) : (
                                <p className="font-medium">{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-[var(--border)] rounded-full px-6 py-4 shadow-sm flex items-center space-x-3">
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Assistant is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white/80 backdrop-blur-md border-t border-[var(--border)]/50 relative z-10">
                <form onSubmit={handleSend} className="relative max-w-5xl mx-auto flex items-center space-x-4">
                    <div className="relative flex-1 group">
                        <Input
                            className="pr-12 pl-6 py-8 text-lg rounded-[2rem] border-primary/10 group-hover:border-primary/30 focus-visible:ring-primary shadow-lg shadow-primary/5 bg-white transition-all"
                            placeholder={selectedIds.length > 0 ? "Ask a question about your data..." : "Select a dataset to begin..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={selectedIds.length === 0}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading || selectedIds.length === 0}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                </form>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-6 px-4">
                    <div className="flex items-center text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                        <div className="w-4 h-4 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                            <Info className="w-2.5 h-2.5 text-primary" />
                        </div>
                        Natural Language Analysis
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                        <div className="w-4 h-4 rounded-md bg-green-500/10 flex items-center justify-center mr-2">
                            <Database className="w-2.5 h-2.5 text-green-500" />
                        </div>
                        Secure PG Role Execution
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse" />
                        AskMyData L4 Engine Active
                    </div>
                </div>
            </div>
            {/* Save to Dashboard Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-8 animation-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold italic">Pin to Dashboard</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsSaveModalOpen(false)}><X className="w-5 h-5" /></Button>
                        </div>

                        <p className="text-[var(--muted-foreground)] mb-6 text-sm">Select a dashboard to save this insight. It will be updated live as your data changes.</p>

                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-8">
                            {dashboards.map(db => (
                                <button
                                    key={db.id}
                                    onClick={() => handleSaveToDashboard(db.id)}
                                    disabled={isSaving}
                                    className="w-full p-4 rounded-xl border border-border/50 hover:border-primary hover:bg-primary/5 flex items-center justify-between transition-all group disabled:opacity-50"
                                >
                                    <div className="flex items-center">
                                        <Layout className="w-5 h-5 mr-3 text-primary" />
                                        <span className="font-bold">{db.name}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                            <Link href="/app/dashboards" className="block">
                                <Button variant="ghost" className="w-full justify-start text-[var(--muted-foreground)]">
                                    <Plus className="w-4 h-4 mr-2" /> Create New Dashboard
                                </Button>
                            </Link>
                        </div>

                        {isSaving && (
                            <div className="flex items-center justify-center py-4 text-primary font-bold">
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    )
}
