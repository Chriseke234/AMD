"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Database, Plus, Trash2, Calendar, FileText, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function DatasetsPage() {
    const [datasets, setDatasets] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchDatasets()
    }, [])

    const fetchDatasets = async () => {
        const { data, error } = await supabase
            .from('datasets')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else setDatasets(data || [])
        setLoading(false)
    }

    const deleteDataset = async (id, tableName) => {
        if (!confirm("Are you sure you want to delete this dataset?")) return

        const { error } = await supabase.from('datasets').delete().eq('id', id)
        if (error) alert(error.message)
        else fetchDatasets()
    }

    return (
        <div className="space-y-8 animation-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Datasets</h1>
                    <p className="text-[var(--muted-foreground)] text-lg">Manage and explore your uploaded data sources.</p>
                </div>
                <Button onClick={() => router.push("/app/datasets/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dataset
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : datasets.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mb-6">
                        <Database className="w-8 h-8 text-[var(--muted-foreground)]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No datasets yet</h3>
                    <p className="text-[var(--muted-foreground)] mb-6">Upload your first CSV or Excel file to get started.</p>
                    <Button onClick={() => router.push("/app/datasets/new")}>Upload Now</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {datasets.map((ds) => (
                        <Card key={ds.id} className="group hover:border-[var(--primary)] transition-all overflow-hidden">
                            <div className="flex items-center p-6">
                                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mr-6 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate">{ds.name}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-[var(--muted-foreground)] mt-1">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {new Date(ds.created_at).toLocaleDateString()}
                                        </span>
                                        <span>{(ds.file_size / 1024).toFixed(1)} KB</span>
                                        <span>{ds.row_count} rows</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                        Score: {ds.health_score}
                                    </div>
                                    <button
                                        onClick={() => deleteDataset(ds.id, ds.table_name)}
                                        className="p-2 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
