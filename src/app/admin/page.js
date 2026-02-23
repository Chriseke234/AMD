import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Users, BarChart3, Database, DollarSign, Zap, ShieldAlert } from "lucide-react"

export default function AdminDashboard() {
    const kpis = [
        { title: "Total Users", value: "1,284", change: "+12%", icon: Users, color: "text-blue-500" },
        { title: "AI Token Usage", value: "4.2M", change: "+24%", icon: Zap, color: "text-yellow-500" },
        { title: "Est. AI Cost", value: "$42.10", change: "-5%", icon: DollarSign, color: "text-green-500" },
        { title: "Query Failures", value: "0.2%", change: "-1.5%", icon: ShieldAlert, color: "text-red-500" },
    ]

    return (
        <div className="space-y-8 animation-fade-in">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, i) => (
                    <Card key={i} className="border-none shadow-md bg-white dark:bg-[#1e293b]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-[#64748b]">
                                {kpi.title}
                            </CardTitle>
                            <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{kpi.value}</div>
                            <p className={`text-xs mt-1 font-bold ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {kpi.change} <span className="text-slate-400 font-normal">vs last month</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 min-h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Query Execution Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-12">
                        <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 italic">
                            Interactive Performance Chart Visualization
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Recent System Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { type: 'info', msg: 'Admin login detected', time: '2m ago' },
                                { type: 'err', msg: 'Query timeout (User: #204)', time: '15m ago' },
                                { type: 'warn', msg: 'High token usage spike', time: '1h ago' },
                                { type: 'info', msg: 'New dataset uploaded (CSV)', time: '2h ago' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-start space-x-3 text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className={`w-2 h-2 mt-1.5 rounded-full ${log.type === 'err' ? 'bg-red-500' : log.type === 'warn' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                    <div className="flex-1">
                                        <p className="font-medium">{log.msg}</p>
                                        <p className="text-xs text-slate-400">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">Real-time AI Cost Monitoring</CardTitle>
                        <div className="flex space-x-2">
                            <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">Day</div>
                            <div className="px-3 py-1 rounded-full bg-[var(--primary)] text-xs font-bold text-white">Month</div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-64 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400">
                            Cost Analysis Trend Line
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
