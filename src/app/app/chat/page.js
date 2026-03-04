"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import {
    Send, Sparkles, Database, Trash2, Layout as LayoutIcon, Plus, Check, ChevronRight, ChevronDown as ChevronDownIcon, Download, Share2,
    BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table as TableIcon,
    Pin, Save, Loader2, X, Info, AlertCircle, Menu, History, MessageSquare, Edit3
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useTheme } from "@/components/ThemeProvider"

export default function AnalyticsChat() {
    const { theme } = useTheme()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [datasets, setDatasets] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [showDatasetSelector, setShowDatasetSelector] = useState(false)
    const [dashboards, setDashboards] = useState([])
    const [savingWidget, setSavingWidget] = useState(null)
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // New Persistence States
    const [threads, setThreads] = useState([])
    const [activeThreadId, setActiveThreadId] = useState(null)
    const [showThreads, setShowThreads] = useState(false)

    const messagesEndRef = useRef(null)
    const supabase = createClient()
    const COLORS = ['#7c3aed', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

    useEffect(() => {
        fetchInitialData()
        fetchThreads()
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

    const fetchThreads = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: ts } = await supabase
            .from('chat_threads')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })

        setThreads(ts || [])
        if (ts?.length > 0 && !activeThreadId) {
            loadThread(ts[0].id)
        }
    }

    const loadThread = async (threadId) => {
        setActiveThreadId(threadId)
        setLoading(true)
        const { data: msgs } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('thread_id', threadId)
            .order('created_at', { ascending: true })

        if (msgs) {
            setMessages(msgs.map(m => ({
                id: m.id,
                role: m.role,
                content: m.content,
                type: m.type,
                ...m.metadata
            })))
        }
        setLoading(false)
    }

    const startNewThread = () => {
        setActiveThreadId(null)
        setMessages([
            { id: 'welcome', role: 'ai', content: "Hello! I'm your AI Data Assistant. Ask me anything about your datasets.", type: 'text' }
        ])
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

        const { data: { user } } = await supabase.auth.getUser()

        let threadId = activeThreadId
        if (!threadId) {
            const { data: newThread } = await supabase
                .from('chat_threads')
                .insert({
                    user_id: user.id,
                    title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
                    dataset_ids: selectedIds
                })
                .select()
                .single()
            threadId = newThread.id
            setActiveThreadId(threadId)
            setThreads([newThread, ...threads])
        }

        const userMsg = { role: 'user', content: input }
        setMessages(prev => [...prev, { ...userMsg, id: Date.now() }])
        setInput("")
        setLoading(true)

        // Save User Message
        await supabase.from('chat_messages').insert({
            thread_id: threadId,
            role: 'user',
            content: input
        })

        try {
            const res = await fetch('/api/ai-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input, datasetIds: selectedIds })
            })

            const data = await res.json()

            if (data.error) {
                const errorMsg = { role: 'ai', content: data.error, type: 'error' }
                setMessages(prev => [...prev, { ...errorMsg, id: Date.now() + 1 }])
                await supabase.from('chat_messages').insert({ thread_id: threadId, ...errorMsg })
            } else {
                const aiMsg = {
                    role: 'ai',
                    content: data.insight,
                    type: 'analysis',
                    metadata: {
                        sql: data.sql,
                        results: data.results,
                        chartType: data.chartType,
                        title: data.title,
                        query: input,
                        chartConfig: data.chartConfig
                    }
                }
                setMessages(prev => [...prev, { ...aiMsg, id: Date.now() + 1 }])

                // Save AI Response
                await supabase.from('chat_messages').insert({
                    thread_id: threadId,
                    role: 'ai',
                    content: aiMsg.content,
                    type: aiMsg.type,
                    metadata: aiMsg.metadata
                })

                // Update thread timestamp
                await supabase.from('chat_threads').update({ updated_at: new Date() }).eq('id', threadId)
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

    const deleteThread = async (id) => {
        if (!confirm("Are you sure?")) return
        await supabase.from('chat_threads').delete().eq('id', id)
        setThreads(threads.filter(t => t.id !== id))
        if (activeThreadId === id) startNewThread()
    }

    const handleSaveToDashboard = async (dashboardId) => {
        if (!savingWidget) return
        setIsSaving(true)

        try {
            const { error } = await supabase.from('dashboard_widgets').insert({
                dashboard_id: dashboardId,
                dataset_id: selectedIds[0],
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
        const { chartType, results } = msg
        if (!results || results.length === 0) return null

        const dataKeys = Object.keys(results[0])
        const xKey = dataKeys[0]
        const yKeys = dataKeys.slice(1)

        const strokeColor = theme === 'dark' ? '#334155' : '#e2e8f0';
        const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';

        switch (chartType) {
            case 'bar':
                return (
                    <div className="h-64 sm:h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={results}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={strokeColor} />
                                <XAxis dataKey={xKey} fontSize={10} tickLine={false} axisLine={false} stroke={textColor} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke={textColor} />
                                <Tooltip
                                    cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--card)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                {yKeys.map((key, i) => (
                                    <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[6, 6, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )
            case 'line':
                return (
                    <div className="h-64 sm:h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={results}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={strokeColor} />
                                <XAxis dataKey={xKey} fontSize={10} tickLine={false} axisLine={false} stroke={textColor} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke={textColor} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--card)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                {yKeys.map((key, i) => (
                                    <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )
            case 'pie':
                return (
                    <div className="h-64 sm:h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={results}
                                    cx="50%" cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey={yKeys[0]}
                                    nameKey={xKey}
                                >
                                    {results.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--card)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )
            default:
                return (
                    <div className="overflow-x-auto rounded-2xl border border-border mt-6">
                        <table className="w-full text-xs sm:text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                                <tr>
                                    {Object.keys(results[0]).map(h => (
                                        <th key={h} className="px-4 py-3 font-bold uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {results.slice(0, 50).map((row, i) => (
                                    <tr key={i} className="bg-card hover:bg-muted/20 transition-colors">
                                        {Object.values(row).map((v, j) => (
                                            <td key={j} className="px-4 py-3 text-foreground font-medium">{String(v)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {results.length > 50 && (
                            <div className="p-3 text-center text-[10px] text-muted-foreground bg-muted/10 font-bold uppercase tracking-widest">
                                Truncated to 50 entries
                            </div>
                        )}
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] glass-premium rounded-none sm:rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-primary/5 blur-[120px] pointer-events-none" />

            <header className="px-6 sm:px-10 py-4 sm:py-6 border-b bg-background/50 backdrop-blur-2xl flex items-center justify-between relative z-30">
                <div className="flex items-center space-x-4 sm:space-x-6">
                    <button
                        onClick={() => setShowThreads(!showThreads)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${showThreads ? 'bg-primary text-white border-primary' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
                    >
                        <History className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="font-black text-lg sm:text-2xl tracking-tighter text-foreground font-heading italic">
                            Neural Assistant<span className="text-primary not-italic">.</span>
                        </h2>
                        <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-green-500/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 shadow-lg shadow-green-500/50" />
                            System Online
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all" onClick={startNewThread}>
                        <Plus className="w-5 h-5" />
                    </Button>
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full px-4 sm:px-6 h-10 sm:h-12 border-border hover:border-primary/40 bg-background/50 text-[10px] font-black uppercase tracking-widest transition-all"
                            onClick={() => setShowDatasetSelector(!showDatasetSelector)}
                        >
                            <Database className="w-3.5 h-3.5 mr-2 text-primary" />
                            <span className="hidden sm:inline">{selectedIds.length} Nodes</span>
                            <ChevronDownIcon className={`w-3.5 h-3.5 ml-2 transition-transform ${showDatasetSelector ? 'rotate-180' : ''}`} />
                        </Button>

                        {showDatasetSelector && (
                            <Card className="absolute right-0 mt-4 w-72 sm:w-80 p-5 shadow-3xl border-border bg-card z-50 animate-fade-in rounded-[2rem]">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 px-2">Knowledge Sources</h4>
                                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2">
                                    {datasets.map(ds => (
                                        <div
                                            key={ds.id}
                                            onClick={() => toggleDataset(ds.id)}
                                            className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${selectedIds.includes(ds.id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'}`}
                                        >
                                            <div className="flex items-center space-x-3 truncate">
                                                <div className={`p-2 rounded-lg ${selectedIds.includes(ds.id) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                                    <Database className="w-3.5 h-3.5" />
                                                </div>
                                                <span className={`text-xs font-bold truncate ${selectedIds.includes(ds.id) ? 'text-foreground' : 'text-muted-foreground'}`}>{ds.name}</span>
                                            </div>
                                            {selectedIds.includes(ds.id) && <Check className="w-3.5 h-3.5 text-primary" />}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Threads Sidebar */}
                {showThreads && (
                    <div className="w-80 border-r border-border bg-card/30 backdrop-blur-3xl animate-in slide-in-from-left duration-300 absolute lg:relative z-40 h-full overflow-y-auto p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Logs</h3>
                            <button onClick={() => setShowThreads(false)} className="lg:hidden p-2"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-2">
                            {threads.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => loadThread(t.id)}
                                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${activeThreadId === t.id ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-muted/50'}`}
                                >
                                    <div className="flex items-center space-x-3 relative z-10">
                                        <MessageSquare className={`w-4 h-4 ${activeThreadId === t.id ? 'text-primary' : 'text-muted-foreground/40'}`} />
                                        <span className={`text-xs font-bold truncate ${activeThreadId === t.id ? 'text-foreground' : 'text-muted-foreground/60'}`}>{t.title}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            {threads.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">No history found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 bg-gradient-to-b from-transparent to-secondary/20 scroll-smooth relative">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white rounded-[2rem] rounded-tr-none px-6 sm:px-8 py-4 sm:py-5 shadow-xl shadow-primary/20 text-sm sm:text-base font-medium' : 'w-full space-y-6'}`}>
                                {msg.role === 'ai' ? (
                                    <div className="space-y-6">
                                        <div className={`rounded-[2rem] rounded-tl-none p-6 sm:p-8 border backdrop-blur-md relative overflow-hidden ${msg.type === 'error' ? 'bg-red-500/5 text-red-500 border-red-500/20' : 'bg-card/50 border-border shadow-lg'}`}>
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base font-medium">{msg.content}</p>
                                            {msg.sql && (
                                                <div className="mt-6 pt-6 border-t border-border">
                                                    <details className="cursor-pointer group">
                                                        <summary className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center group-hover:text-primary transition-colors">
                                                            Visual Logical Schema
                                                        </summary>
                                                        <div className="mt-4 p-4 bg-muted/50 text-primary font-mono text-[10px] rounded-xl overflow-x-auto border border-border">
                                                            {msg.sql}
                                                        </div>
                                                    </details>
                                                </div>
                                            )}
                                        </div>

                                        {msg.type === 'analysis' && msg.results?.length > 0 && (
                                            <Card className="p-6 sm:p-10 border-border bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden group relative">
                                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative z-10">
                                                    <h4 className="font-black text-lg flex items-center text-foreground font-heading italic">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                            {msg.chartType === 'pie' ? <PieChartIcon className="w-5 h-5 text-primary" /> : <BarChart3 className="w-5 h-5 text-primary" />}
                                                        </div>
                                                        {msg.title || "Intelligence Render"}
                                                    </h4>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 rounded-full px-4 text-[9px] font-black uppercase tracking-widest border-border bg-background/50 hover:bg-primary hover:text-white transition-all"
                                                            onClick={() => {
                                                                setSavingWidget(msg)
                                                                setIsSaveModalOpen(true)
                                                            }}
                                                        >
                                                            <Pin className="w-3.5 h-3.5 mr-2" /> Pin
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 rounded-full px-4 text-[9px] font-black uppercase tracking-widest border-border bg-background/50 hover:bg-muted transition-all"
                                                            onClick={() => {
                                                                const keys = Object.keys(msg.metadata.results[0]);
                                                                const csv = [
                                                                    keys.join(','),
                                                                    ...msg.metadata.results.map(row => keys.map(k => JSON.stringify(row[k])).join(','))
                                                                ].join('\n');
                                                                const blob = new Blob([csv], { type: 'text/csv' });
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement('a');
                                                                a.setAttribute('href', url);
                                                                a.setAttribute('download', `${msg.metadata.title || 'insight'}.csv`);
                                                                a.click();
                                                            }}
                                                        >
                                                            <Download className="w-3.5 h-3.5 mr-2" /> Export CSV
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
                        <div className="flex justify-start animate-pulse">
                            <div className="rounded-full px-6 py-4 bg-muted/50 border border-border flex items-center space-x-3">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Synthesizing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <footer className="p-4 sm:p-8 bg-background/80 backdrop-blur-3xl border-t border-border relative z-20">
                <form onSubmit={handleSend} className="relative max-w-5xl mx-auto flex items-center">
                    <div className="relative flex-1 group">
                        <Input
                            className="pr-14 pl-6 sm:pl-10 py-8 sm:py-10 text-lg sm:text-xl rounded-[1.5rem] sm:rounded-[2.5rem] border-border bg-secondary/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                            placeholder={selectedIds.length > 0 ? "Ask a question..." : "Select datasets to begin..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={selectedIds.length === 0}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading || selectedIds.length === 0}
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 disabled:opacity-20 disabled:shadow-none"
                        >
                            <Send className="w-6 h-6 sm:w-7 sm:h-7" />
                        </button>
                    </div>
                </form>
            </footer>

            {/* Pin Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                    <Card className="w-full max-w-md p-8 sm:p-10 border-border bg-card animate-fade-in shadow-3xl rounded-[2.5rem] sm:rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-foreground tracking-tighter italic font-heading">Pin Node<span className="text-primary not-italic">.</span></h2>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-muted-foreground" onClick={() => setIsSaveModalOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto mb-8 pr-2">
                            {dashboards.map(db => (
                                <button
                                    key={db.id}
                                    onClick={() => handleSaveToDashboard(db.id)}
                                    disabled={isSaving}
                                    className="w-full p-5 rounded-2xl border border-border bg-secondary/30 hover:bg-primary/5 hover:border-primary/30 flex items-center justify-between transition-all group disabled:opacity-50"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mr-4 group-hover:bg-primary/10 transition-colors">
                                            <LayoutIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{db.name}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
