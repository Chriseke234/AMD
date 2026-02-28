import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Database, BarChart3, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const stats = [
        { title: "Total Datasets", value: "0", icon: Database, color: "text-blue-500" },
        { title: "Total Queries", value: "0", icon: BarChart3, color: "text-primary" },
        { title: "AI Tokens Used", value: "0", icon: TrendingUp, color: "text-green-500" },
        { title: "Data Health", value: "100%", icon: AlertCircle, color: "text-amber-500" },
    ]

    return (
        <div className="space-y-12 animation-fade-in pb-20">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-white font-heading italic">
                    Dashboard Overview<span className="text-primary not-italic">.</span>
                </h1>
                <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
                    Monitor your neural data infrastructure and AI intelligence metrics in real-time.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="group hover:border-primary/30 transition-all duration-500 glass border-white/5 bg-white/[0.02] overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-colors" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 glass border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full animate-pulse" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <Database className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight font-heading">No datasets found</h3>
                        <p className="text-white/40 mb-10 max-w-sm leading-relaxed">Connect your first dataset to initialize the neural analyzer and start chatting with your data.</p>
                        <Link href="/app/datasets/new">
                            <Button className="rounded-full px-10 py-6 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40">
                                Initialize Dataset
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 glass border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 blur-[100px] rounded-full animate-pulse" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 text-white/50 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            <BarChart3 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight font-heading">Clean History</h3>
                        <p className="text-white/40 mb-10 max-w-sm leading-relaxed">Your AI-powered analytics insights and query history will be displayed here once active.</p>
                        <Link href="#">
                            <Button variant="outline" className="rounded-full px-10 py-6 text-sm font-black uppercase tracking-widest border-white/10 hover:bg-white/5 text-white/60">
                                System Documentation
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
