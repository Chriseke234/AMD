"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Search, FileSpreadsheet, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function GoogleSheetsPicker() {
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [importing, setImporting] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchSpreadsheets()
    }, [])

    const fetchSpreadsheets = async () => {
        try {
            const res = await fetch('/api/connect/google/list')
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setFiles(data.files || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleImport = async (file) => {
        setImporting(file.id)
        try {
            const res = await fetch('/api/connect/google/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId: file.id, fileName: file.name })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            router.push('/app/datasets?success=google_import')
        } catch (err) {
            alert(`Import failed: ${err.message}`)
            setImporting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animation-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Select Google Sheet</h1>
                    <p className="text-[var(--muted-foreground)] text-lg text-green-600 font-medium flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        Connected to Google Drive
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-[var(--muted-foreground)]">Fetching your spreadsheets...</p>
                </div>
            ) : error ? (
                <Card className="p-12 text-center border-red-100 bg-red-50">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-800 mb-2">Failed to load files</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <Button onClick={fetchSpreadsheets}>Try Again</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {files.map(file => (
                        <Card
                            key={file.id}
                            className={`p-4 flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer group ${importing === file.id ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => handleImport(file)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                    <FileSpreadsheet className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--foreground)]">{file.name}</h3>
                                    <p className="text-xs text-[var(--muted-foreground)]">Last modified: {new Date(file.modifiedTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-[var(--muted-foreground)] group-hover:text-primary transition-colors">
                                {importing === file.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-sm font-medium">Import</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </div>
                        </Card>
                    ))}
                    {files.length === 0 && (
                        <Card className="p-20 text-center border-dashed border-2">
                            <Search className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No spreadsheets found</h3>
                            <p className="text-[var(--muted-foreground)]">Make sure you have spreadsheets in your Google Drive.</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}
