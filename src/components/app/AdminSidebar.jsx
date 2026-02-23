"use client"

import { LayoutDashboard, Users, CreditCard, ShieldCheck, Activity, Settings, LogOut, Package } from "lucide-react"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: "Overview", icon: LayoutDashboard, href: "/admin" },
        { name: "User Management", icon: Users, href: "/admin/users" },
        { name: "Subscriptions", icon: CreditCard, href: "/admin/billing" },
        { name: "System Logs", icon: Activity, href: "/admin/logs" },
        { name: "Feature Flags", icon: ShieldCheck, href: "/admin/features" },
        { name: "Global Settings", icon: Settings, href: "/admin/settings" },
    ]

    return (
        <div className="flex flex-col w-64 h-screen border-r border-[#334155] bg-[#0f172a] text-slate-300">
            <div className="flex items-center h-16 px-6 border-b border-[#334155]">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)] text-white font-bold">A</div>
                    <span className="text-xl font-bold tracking-tight text-white">Admin Hub</span>
                </div>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 space-x-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? "bg-[var(--primary)] text-white"
                                    : "hover:bg-[#1e293b] hover:text-white"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </a>
                    )
                })}
            </div>

            <div className="p-4 border-t border-[#334155]">
                <div className="flex items-center p-3 rounded-lg bg-[#1e293b] mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] mr-3" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Super Admin</p>
                        <p className="text-xs truncate opacity-60">admin@askmydata.ai</p>
                    </div>
                </div>
                <button className="flex items-center w-full px-4 py-2 space-x-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Exit Console</span>
                </button>
            </div>
        </div>
    )
}
