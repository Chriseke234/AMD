"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
    Users, Search, Shield, UserX,
    MoreVertical, Mail, Crown, Loader2,
    CheckCircle2, AlertTriangle, ShieldAlert
} from "lucide-react"

export default function UserManagementPage() {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setProfiles(data)
        setLoading(false)
    }

    const updateRole = async (userId, newRole) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

        if (!error) {
            setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p))
        }
    }

    const filteredUsers = profiles.filter(p =>
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[var(--muted-foreground)] uppercase tracking-widest font-bold text-xs">Accessing User Database...</p>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto space-y-8 animation-fade-in p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center">
                        <ShieldAlert className="w-8 h-8 mr-4 text-primary" /> USER INTEL
                    </h1>
                    <p className="text-[var(--muted-foreground)] font-medium">Platform identity & access control</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                    <Input
                        placeholder="Search users..."
                        className="pl-10 w-80 rounded-full border-primary/10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-border/50">
                <table className="w-full text-left">
                    <thead className="bg-[var(--muted)]/20 text-[var(--muted-foreground)] uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Access Level</th>
                            <th className="px-6 py-4">Activity</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-0.5">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-primary">
                                                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{user.name || 'Anonymous'}</p>
                                            <p className="text-xs text-[var(--muted-foreground)] flex items-center">
                                                <Mail className="w-3 h-3 mr-1" /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'super-admin' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                        user.role === 'admin' ? 'bg-amber-500 text-white' :
                                            'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => updateRole(user.id, 'user')}
                                            className={`p-2 rounded-lg transition-all ${user.role === 'user' ? 'bg-primary text-white' : 'hover:bg-primary/10 text-[var(--muted-foreground)]'}`}
                                            title="Standard User"
                                        >
                                            <Users className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => updateRole(user.id, 'admin')}
                                            className={`p-2 rounded-lg transition-all ${user.role === 'admin' ? 'bg-amber-500 text-white' : 'hover:bg-amber-500/10 text-[var(--muted-foreground)]'}`}
                                            title="Admin Access"
                                        >
                                            <Shield className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => updateRole(user.id, 'super-admin')}
                                            className={`p-2 rounded-lg transition-all ${user.role === 'super-admin' ? 'bg-red-500 text-white' : 'hover:bg-red-500/10 text-[var(--muted-foreground)]'}`}
                                            title="Super Admin Control"
                                        >
                                            <Crown className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-[var(--muted-foreground)] font-medium">
                                    Joined {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <Button variant="ghost" size="icon" className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <UserX className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-[var(--muted-foreground)]">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
