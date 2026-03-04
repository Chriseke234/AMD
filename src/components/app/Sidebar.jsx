"use client"

import { Home, Database, BarChart3, Settings, LogOut, PlusCircle, Users, Zap, LayoutGrid, ChevronRight, Menu, X, ShieldCheck, Sparkles, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/Button"

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const navItems = [
        { name: "Console", icon: Home, href: "/app" },
        { name: "Inventory", icon: Database, href: "/app/datasets" },
        { name: "Assistant", icon: Sparkles, href: "/app/chat" },
        { name: "Dashboard", icon: LayoutGrid, href: "/app/dashboards" },
        { name: "Sentry", icon: ShieldCheck, href: "/app/sentry" },
        { name: 'Knowledge', href: '/app/graph', icon: Share2 },
        { name: 'Canvas', href: '/app/canvas', icon: LayoutGrid },
        { name: "Teams", icon: Users, href: "/app/team" },
        { name: "Settings", icon: Settings, href: "/app/settings" },
    ]

    const NavContent = () => (
        <div className="flex flex-col h-full bg-card border-r border-border relative z-50">
            {/* Branding */}
            <div className="flex items-center h-24 px-8 mb-4">
                <Link href="/app" className="flex items-center space-x-4 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-black text-xl shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                        A
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-foreground font-heading italic">
                        AskMyData<span className="text-primary not-italic">.</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-8 overflow-y-auto">
                <div className="px-4">
                    <button
                        onClick={() => {
                            router.push('/app/datasets/new')
                            setIsOpen(false)
                        }}
                        className="w-full flex items-center justify-center space-x-3 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden"
                    >
                        <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500 relative z-10" />
                        <span className="relative z-10">Initialize Data</span>
                    </button>
                </div>

                <div className="space-y-1">
                    <div className="px-6 mb-4 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Main Systems</span>
                        <div className="h-px flex-1 bg-border ml-4" />
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-6 py-4 space-x-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all relative group ${isActive
                                    ? "text-primary bg-primary/5 border border-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                                )}
                                <item.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "scale-110 text-primary" : "group-hover:scale-110 group-hover:text-foreground"}`} />
                                <span className={`flex-1 transition-colors duration-300 ${isActive ? "font-bold" : "group-hover:text-foreground"}`}>{item.name}</span>
                                {isActive && <ChevronRight className="w-3 h-3 opacity-40 animate-pulse" />}
                            </Link>
                        )
                    })}
                </div>

                <div className="px-4 mt-8">
                    <div className="p-6 rounded-3xl bg-primary/[0.03] border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[30px] rounded-full" />
                        <div className="relative z-10 space-y-3">
                            <Zap className="w-5 h-5 text-primary" />
                            <div className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Pro Protocol</div>
                            <div className="text-[11px] font-medium text-muted-foreground leading-relaxed">Unlock multi-model neural processing.</div>
                            <button className="text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:underline underline-offset-4">Upgrade Node</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-border mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-4 space-x-4 text-[10px] font-black uppercase tracking-widest text-red-500/60 rounded-2xl hover:bg-red-500/5 hover:text-red-500 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-72 h-screen relative z-50">
                <NavContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-[40] p-3 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl transition-all active:scale-90"
                >
                    <Menu className="w-5 h-5 text-primary" />
                </button>

                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex">
                        <div className="fixed inset-0 bg-background/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
                        <div className="relative w-72 h-full animate-in slide-in-from-left duration-300 shadow-2xl">
                            <NavContent />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-[-60px] p-3 rounded-2xl bg-card border border-border shadow-2xl active:scale-95 transition-all"
                            >
                                <X className="w-5 h-5 text-foreground" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
