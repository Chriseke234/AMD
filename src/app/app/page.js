import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Database, BarChart3, TrendingUp, AlertCircle, Sparkles, Layout } from "lucide-react"
import { NeuralActivityChart, IntegritySparkline } from "@/components/app/NeuralCharts"
import Link from "next/link"

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: datasets } = await supabase.from('datasets').select('id, health_score', { count: 'exact' })
    const { data: dashboards } = await supabase.from('dashboards').select('id', { count: 'exact' })

    // Average integrity
    const avgHealth = datasets?.length > 0
        ? Math.round(datasets.reduce((acc, curr) => acc + (curr.health_score || 0), 0) / datasets.length)
        : 100

    const stats = [
        { title: "Datasets", value: datasets?.length || 0, icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Dashboards", value: dashboards?.length || 0, icon: Layout, color: "text-primary", bg: "bg-primary/10" },
        { title: "Neural Load", value: "85%", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10", chart: 'activity' },
        { title: "Avg Integrity", value: `${avgHealth}%`, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", chart: 'sparkline' },
    ]

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <div className="flex flex-col space-y-3">
                <div className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border rounded-full bg-primary/5 text-primary border-primary/20 w-fit">
                    Neural Engine Online
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground font-heading italic">
                    Neural Control Center<span className="text-primary not-italic">.</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-medium">
                    Monitor your neural data infrastructure and AI intelligence metrics in real-time.
                </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="group hover:border-primary/30 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 bg-card border-border overflow-hidden relative rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full" />

                        {stat.chart === 'sparkline' && <IntegritySparkline />}

                        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 p-5 sm:p-6">
                            <CardTitle className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 p-5 sm:p-6 pt-0">
                            <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter">{stat.value}</div>
                            {stat.chart === 'activity' && <NeuralActivityChart />}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {!datasets || datasets.length === 0 ? (
                    <Card className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-card border-border hover:border-primary/20 transition-all group relative overflow-hidden rounded-[2.5rem]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full animate-pulse" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/10 group-hover:scale-110 transition-transform duration-500">
                                <Database className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">No datasets found</h3>
                            <p className="text-muted-foreground/60 mb-8 max-w-sm leading-relaxed text-sm font-medium">Connect your first dataset to initialize the neural analyzer and start chatting with your data.</p>
                            <Link href="/app/datasets/new">
                                <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">
                                    Initialize Dataset
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <Card className="min-h-[350px] p-8 sm:p-10 bg-card border-border hover:border-primary/20 transition-all rounded-[2.5rem] relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-6 italic">Neural Inventory</h3>
                            <div className="space-y-4">
                                {datasets.slice(0, 3).map((ds, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                        <div className="flex items-center space-x-3">
                                            <Database className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-bold uppercase tracking-widest opacity-60">Dataset Node</span>
                                        </div>
                                        <div className="text-xs font-black text-primary">{ds.health_score || 0}% Integrity</div>
                                    </div>
                                ))}
                                <Link href="/app/datasets" className="block text-center pt-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors cursor-pointer">Explore Full Grid &rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-card border-border hover:border-primary/20 transition-all group relative overflow-hidden rounded-[2.5rem]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 blur-[100px] rounded-full animate-pulse" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-muted text-muted-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">Clean History</h3>
                        <p className="text-muted-foreground/60 mb-8 max-w-sm leading-relaxed text-sm font-medium">Your AI-powered analytics insights and query history will be displayed here once active.</p>
                        <Link href="/app/chat">
                            <Button variant="secondary" size="lg" className="rounded-full px-8">
                                AI Assistant
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
