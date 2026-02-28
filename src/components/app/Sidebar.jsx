"use client"

import { Home, Database, BarChart3, Settings, LogOut, PlusCircle, Users, Zap, LayoutGrid, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const navItems = [
        { name: "Console", icon: Home, href: "/app" },
        { name: "Datasets", icon: Database, href: "/app/datasets" },
        { name: "Neural Chat", icon: BarChart3, href: "/app/chat" },
        { name: "Dashboards", icon: LayoutGrid, href: "/app/dashboards" },
        { name: "Team Governance", icon: Users, href: "/app/team" },
        { name: "Settings", icon: Settings, href: "/app/settings" },
    ]

    return (
        <div className="flex flex-col w-72 h-screen border-r border-white/5 bg-[#030303] relative z-50">
            {/* Branding */}
            <div className="flex items-center h-24 px-8 mb-4">
                <Link href="/app" className="flex items-center space-x-4 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-black text-xl shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform">
                        A
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">AskMyData</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-8 overflow-y-auto">
                <div className="px-4">
                    <button
                        onClick={() => router.push('/app/datasets/new')}
                        className="w-full flex items-center justify-center space-x-3 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group"
                    >
                        <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                        <span>Initialize Data</span>
                    </button>
                </div>

                <div className="space-y-1">
                    <div className="px-6 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Main Systems</span>
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-6 py-4 space-x-4 text-xs font-black uppercase tracking-[0.2em] rounded-[1.2rem] transition-all relative group ${isActive
                                    ? "text-primary bg-primary/5"
                                    : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
                                )}
                                <item.icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                                <span className="flex-1 italic">{item.name}</span>
                                {isActive && <ChevronRight className="w-3 h-3 opacity-40" />}
                            </Link>
                        )
                    })}
                </div>

                <div className="px-4 mt-auto">
                    <div className="p-6 rounded-3xl bg-secondary/10 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[30px] rounded-full" />
                        <div className="relative z-10 space-y-3">
                            <Zap className="w-5 h-5 text-primary" />
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Pro Protocol</div>
                            <div className="text-xs font-medium text-white/30 leading-relaxed">Unlock multi-model neural processing.</div>
                            <button className="text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:underline underline-offset-4">Upgrade Node</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-4 space-x-4 text-xs font-black uppercase tracking-widest text-red-500/50 rounded-2xl hover:bg-red-500/5 hover:text-red-500 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </div>
    )
}
