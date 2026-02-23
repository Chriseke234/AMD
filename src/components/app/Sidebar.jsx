"use client"

import { Home, Database, BarChart3, Settings, LogOut, PlusCircle, Users } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const navItems = [
        { name: "Overview", icon: Home, href: "/app" },
        { name: "Datasets", icon: Database, href: "/app/datasets" },
        { name: "Analytics Chat", icon: BarChart3, href: "/app/chat" },
        { name: "Team", icon: Users, href: "/app/team" },
        { name: "Settings", icon: Settings, href: "/app/settings" },
    ]

    return (
        <div className="flex flex-col w-64 h-screen border-r border-[var(--border)] bg-[var(--background)]">
            <div className="flex items-center h-16 px-6 border-b border-[var(--border)]">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)] text-white font-bold">A</div>
                    <span className="text-xl font-bold tracking-tight">AskMyData</span>
                </div>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <Button variant="primary" className="w-full justify-start space-x-2 mb-6" onClick={() => router.push('/app/datasets/new')}>
                    <PlusCircle className="w-4 h-4" />
                    <span>New Dataset</span>
                </Button>

                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 space-x-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </a>
                    )
                })}
            </div>

            <div className="p-4 border-t border-[var(--border)]">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 space-x-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

function Button({ className, variant = "primary", children, ...props }) {
    const variants = {
        primary: "bg-[var(--primary)] text-white hover:brightness-110",
    }
    return (
        <button className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    )
}
