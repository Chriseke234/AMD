import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Database, BarChart3, TrendingUp, AlertCircle } from "lucide-react"

export default function DashboardPage() {
    const stats = [
        { title: "Total Datasets", value: "0", icon: Database, color: "text-blue-500" },
        { title: "Total Queries", value: "0", icon: BarChart3, color: "text-purple-500" },
        { title: "AI Tokens Used", value: "0", icon: TrendingUp, color: "text-green-500" },
        { title: "Data Health", value: "100%", icon: AlertCircle, color: "text-amber-500" },
    ]

    return (
        <div className="space-y-8 animation-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-[var(--muted-foreground)] text-lg">Quick insights into your data intelligence activity.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="min-h-[300px] flex flex-col items-center justify-center text-center p-12">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-6">
                        <Database className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No datasets found</h3>
                    <p className="text-[var(--muted-foreground)] mb-6">Connect your first dataset to start chatting with your data.</p>
                    <Button>Upload Dataset</Button>
                </Card>

                <Card className="min-h-[300px] flex flex-col items-center justify-center text-center p-12">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-6">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No analytics history</h3>
                    <p className="text-[var(--muted-foreground)] mb-6">Your AI-powered analytics insights will appear here.</p>
                    <Button variant="outline">Learn more</Button>
                </Card>
            </div>
        </div>
    )
}
