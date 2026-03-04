"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Database, ShieldCheck, AlertCircle, Loader2, ChevronRight, CheckCircle2 } from "lucide-react"

export default function DBConnectorPage() {
    const [step, setStep] = useState(1) // 1: Form, 2: Table Selection
    const [dbType, setDbType] = useState('postgres')
    const [config, setConfig] = useState({
        host: '',
        port: '5432',
        database: '',
        user: '',
        password: '',
        ssl: true
    })
    const [loading, setLoading] = useState(false)
    const [tables, setTables] = useState([])
    const [selectedTables, setSelectedTables] = useState([])
    const [importing, setImporting] = useState(false)
    const router = useRouter()

    const handleTestConnection = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/connect/db/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: dbType, config })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            setTables(data.tables || [])
            setStep(2)
        } catch (err) {
            alert(`Connection failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleImport = async () => {
        if (selectedTables.length === 0) return
        setImporting(true)
        try {
            const res = await fetch('/api/connect/db/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: dbType, config, tables: selectedTables })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            router.push('/app/datasets?success=db_import')
        } catch (err) {
            alert(`Import failed: ${err.message}`)
            setImporting(false)
        }
    }

    const toggleTable = (name) => {
        setSelectedTables(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animation-fade-in px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Connect Database</h1>
                    <p className="text-[var(--muted-foreground)] text-sm sm:text-lg">Directly sync tables from your external DB</p>
                </div>
                <Button variant="outline" className="w-fit" onClick={() => router.back()}>Cancel</Button>
            </div>

            {step === 1 ? (
                <Card className="p-5 sm:p-8 shadow-xl border-primary/10">
                    <form onSubmit={handleTestConnection} className="space-y-5 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={() => { setDbType('postgres'); setConfig({ ...config, port: '5432' }) }}
                                className={`p-3 sm:p-4 rounded-xl border flex items-center space-x-3 transition-all ${dbType === 'postgres' ? 'bg-primary/5 border-primary shadow-sm' : 'border-[var(--border)] hover:bg-[var(--muted)]'}`}
                            >
                                <div className={`p-2 rounded-lg ${dbType === 'postgres' ? 'bg-primary text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                                    <Database className="w-5 h-5" />
                                </div>
                                <span className="font-bold">PostgreSQL</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setDbType('mysql'); setConfig({ ...config, port: '3306' }) }}
                                className={`p-3 sm:p-4 rounded-xl border flex items-center space-x-3 transition-all ${dbType === 'mysql' ? 'bg-primary/5 border-primary shadow-sm' : 'border-[var(--border)] hover:bg-[var(--muted)]'}`}
                            >
                                <div className={`p-2 rounded-lg ${dbType === 'mysql' ? 'bg-primary text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                                    <Database className="w-5 h-5" />
                                </div>
                                <span className="font-bold">MySQL</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Host</label>
                                <Input required placeholder="db.example.com" value={config.host} onChange={e => setConfig({ ...config, host: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Port</label>
                                <Input required placeholder={dbType === 'postgres' ? '5432' : '3306'} value={config.port} onChange={e => setConfig({ ...config, port: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Database Name</label>
                            <Input required placeholder="production_db" value={config.database} onChange={e => setConfig({ ...config, database: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Username</label>
                                <Input required placeholder="readonly_user" value={config.user} onChange={e => setConfig({ ...config, user: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Password</label>
                                <Input required type="password" placeholder="••••••••" value={config.password} onChange={e => setConfig({ ...config, password: e.target.value })} />
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-xl flex items-start space-x-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                                <strong>Secure Connection:</strong> We recommend using a read-only user and enabling SSL. Your credentials are encrypted and used only for data synchronization.
                            </p>
                        </div>

                        <Button type="submit" className="w-full py-4 sm:py-6 text-sm sm:text-lg" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting...</>
                            ) : "Test & Fetch Tables"}
                        </Button>
                    </form>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="p-3 sm:p-4 bg-green-50 border-green-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                            <span className="font-bold text-green-800 text-sm sm:text-base">Connection Successful!</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-green-700 hover:bg-green-100">Edit Connection</Button>
                    </Card>

                    <div className="grid grid-cols-1 gap-4">
                        <h3 className="font-bold text-lg px-2">Select Tables to Import</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tables.map(table => (
                                <Card
                                    key={table}
                                    onClick={() => toggleTable(table)}
                                    className={`p-4 flex items-center justify-between cursor-pointer transition-all border-2 ${selectedTables.includes(table) ? 'border-primary bg-primary/5' : 'border-transparent hover:border-[var(--border)]'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${selectedTables.includes(table) ? 'bg-primary text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                                            <Database className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold">{table}</span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedTables.includes(table) ? 'bg-primary border-primary text-white' : 'border-[var(--border)]'}`}>
                                        {selectedTables.includes(table) && <CheckCircle2 className="w-4 h-4" />}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="sticky bottom-8">
                        <Button className="w-full py-5 sm:py-8 text-base sm:text-xl shadow-2xl" disabled={selectedTables.length === 0 || importing} onClick={handleImport}>
                            {importing ? (
                                <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Syncing Data...</>
                            ) : (
                                <>Import {selectedTables.length} Tables <ChevronRight className="ml-2 w-6 h-6" /></>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
