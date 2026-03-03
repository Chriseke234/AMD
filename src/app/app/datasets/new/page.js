"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Upload, FileText, CheckCircle2, Database, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"

function NewDatasetContent() {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [status, setStatus] = useState("idle") // idle, uploading, success, error
    const searchParams = useSearchParams()
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        if (searchParams.get('connected') === 'google') {
            router.push('/app/datasets/connect/google')
        }
        if (searchParams.get('error') === 'google_config_missing') {
            setStatus("config_error")
        }
    }, [searchParams, router])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        setStatus("uploading")

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('datasets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Insert metadata into datasets table
            const { error: dbError } = await supabase
                .from('datasets')
                .insert({
                    user_id: user.id,
                    name: file.name,
                    table_name: `data_${Math.random().toString(36).substring(7).toLowerCase()}`,
                    file_size: file.size,
                    column_count: 0,
                    row_count: 0,
                    status: 'pending',
                    storage_path: filePath,
                })

            if (dbError) throw dbError

            setStatus("success")
            setTimeout(() => router.push("/app/datasets"), 2000)
        } catch (err) {
            console.error(err)
            setStatus("error")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animation-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upload New Dataset</h1>
                <p className="text-[var(--muted-foreground)] text-lg">Supported formats: CSV, Excel (.xlsx, .xls)</p>
            </div>

            {status === "config_error" && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-4 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-red-500">Google Auth Configuration Missing</h3>
                        <p className="text-sm text-red-400 leading-relaxed mb-4">
                            To connect Google Sheets, you need to set up OAuth keys in your `.env.local` file.
                            Please refer to the setup guide I created for you.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                            onClick={() => setStatus("idle")}
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => document.getElementById('file-upload').click()}>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Upload Files</h3>
                    <p className="text-[var(--muted-foreground)] mb-6">CSV, Excel (.xlsx, .xls)</p>
                    <Input id="file-upload" type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
                    {file && (
                        <div className="w-full flex items-center p-3 bg-white border rounded-xl text-sm mb-4">
                            <FileText className="w-4 h-4 mr-2 text-primary" />
                            <span className="truncate flex-1">{file.name}</span>
                        </div>
                    )}
                    <Button className="w-full" disabled={!file || uploading} onClick={handleUpload}>
                        {uploading ? "Uploading..." : "Import File"}
                    </Button>
                </Card>

                <div className="space-y-6">
                    <Card className="p-8 flex items-center space-x-6 hover:bg-primary/5 transition-colors cursor-pointer group border-primary/10" onClick={() => window.location.href = '/api/connect/google'}>
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold">Google Sheets</h3>
                            <p className="text-sm text-[var(--muted-foreground)]">Connect directly to your sheets</p>
                        </div>
                    </Card>

                    <Card className="p-8 flex items-center space-x-6 hover:bg-primary/5 transition-colors cursor-pointer group border-primary/10" onClick={() => router.push('/app/datasets/connect/db')}>
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Database className="w-8 h-8" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold">SQL Database</h3>
                            <p className="text-sm text-[var(--muted-foreground)]">Postgres, MySQL, SQL Server</p>
                        </div>
                    </Card>
                </div>
            </div>

            {status === "success" && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="p-10 max-w-sm w-full text-center animation-scale-in">
                        <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Success!</h3>
                        <p className="text-[var(--muted-foreground)]">Your data is being processed.</p>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default function NewDatasetPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        }>
            <NewDatasetContent />
        </Suspense>
    )
}
