"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function NewDatasetPage() {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [status, setStatus] = useState("idle") // idle, uploading, success, error
    const router = useRouter()
    const supabase = createClient()

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
                    table_name: `data_${Math.random().toString(36).substring(7)}`,
                    file_size: file.size,
                    row_count: 0, // Will be updated by worker
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

            <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-center">
                {status === "idle" || status === "uploading" ? (
                    <>
                        <div className={`w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-6 ${uploading ? 'animate-pulse' : ''}`}>
                            <Upload className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Select your file</h3>
                        <p className="text-[var(--muted-foreground)] mb-8">Drag and drop or click to browse</p>

                        <div className="w-full max-w-xs space-y-4">
                            <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
                            {file && (
                                <div className="flex items-center p-3 bg-white border rounded-lg text-sm text-left">
                                    <FileText className="w-4 h-4 mr-2 text-[var(--primary)]" />
                                    <span className="truncate flex-1">{file.name}</span>
                                </div>
                            )}
                            <Button className="w-full" disabled={!file || uploading} onClick={handleUpload}>
                                {uploading ? "Uploading..." : "Start Analysis"}
                            </Button>
                        </div>
                    </>
                ) : status === "success" ? (
                    <div className="flex flex-col items-center py-10">
                        <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload Complete!</h3>
                        <p className="text-[var(--muted-foreground)]">Parsing your dataset and generating insights...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-10">
                        <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload Failed</h3>
                        <p className="text-[var(--muted-foreground)] mb-6">There was an issue processing your file.</p>
                        <Button onClick={() => setStatus("idle")}>Try Again</Button>
                    </div>
                )}
            </Card>
        </div>
    )
}
