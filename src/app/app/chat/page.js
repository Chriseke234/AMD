"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Send, Sparkles, Database, PieChart, Info, AlertCircle } from "lucide-react"

export default function AnalyticsChat() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', content: "Hello! I'm your AI Data Assistant. Ask me anything about your datasets, e.g., 'Show me the revenue trend for last month.'", type: 'text' }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleSend = (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg = { id: Date.now(), role: 'user', content: input, type: 'text' }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: 'ai',
                content: "I'm analyzing your data now. Based on your 'sales' dataset, the trend shows a 12% increase in revenue compared to previous periods.",
                type: 'insight',
                chart: true
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animation-fade-in shadow-xl rounded-3xl overflow-hidden glass border border-[var(--border)]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-bold">AI Data Assistant</h2>
                        <div className="flex items-center text-xs text-green-500">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                            Ready to analyze
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Database className="w-4 h-4 mr-2" />
                    Select Datasets
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[var(--muted)]/30">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-[var(--primary)] text-white rounded-2xl p-4' : 'space-y-4'}`}>
                            {msg.role === 'ai' ? (
                                <div className="space-y-4">
                                    <div className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                                        <p className="text-[var(--foreground)]">{msg.content}</p>
                                    </div>
                                    {msg.chart && (
                                        <Card className="p-6 border-[var(--primary)]/20 bg-[var(--primary)]/5">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-bold flex items-center">
                                                    <PieChart className="w-4 h-4 mr-2 text-[var(--primary)]" />
                                                    Revenue Over Time
                                                </h4>
                                                <Button variant="ghost" size="sm" className="h-7 text-xs">Explain SQL</Button>
                                            </div>
                                            <div className="aspect-[16/6] bg-[var(--border)]/50 rounded-xl flex items-center justify-center">
                                                <p className="text-xs text-[var(--muted-foreground)]">Visual Chart Component Placeholder</p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-[var(--muted-foreground)] rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-[var(--muted-foreground)] rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-[var(--muted-foreground)] rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[var(--background)] border-t border-[var(--border)]">
                <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                    <Input
                        className="pr-12 py-6 text-lg"
                        placeholder="Ask a question about your data..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <div className="mt-2 text-center text-[10px] text-[var(--muted-foreground)] flex items-center justify-center space-x-4">
                    <span className="flex items-center"><Info className="w-3 h-3 mr-1" /> Use plain English</span>
                    <span className="flex items-center"><Database className="w-3 h-3 mr-1" /> Multi-dataset joins enabled</span>
                    <span className="flex items-center font-medium text-[var(--primary)]"><Sparkles className="w-3 h-3 mr-1" /> Powered by AskMyData Intelligence</span>
                </div>
            </div>
        </div>
    )
}
