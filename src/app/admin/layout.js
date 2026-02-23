import { AdminSidebar } from "@/components/app/AdminSidebar"

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm flex items-center px-8 justify-between">
                    <h2 className="font-bold text-lg uppercase tracking-wider text-slate-500">System Monitoring</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Systems Operational
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
