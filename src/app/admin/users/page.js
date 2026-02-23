"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, MoreVertical, Shield, UserX, UserCheck, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else setUsers(data || [])
        setLoading(false)
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8 animation-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">User Management</h1>
                    <p className="text-slate-500 text-lg">Monitor accounts, manage roles, and track usage.</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline"><Mail className="w-4 h-4 mr-2" /> Broadcast</Button>
                    <Button>Export CSV</Button>
                </div>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-[#1e293b]">
                <div className="p-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between bg-slate-50/50 dark:bg-[#0f172a]/20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            className="pl-10 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-[#334155]"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4 text-sm font-medium text-slate-500">
                        <span>Total: {users.length}</span>
                        <span className="text-blue-500">Active: {users.length}</span>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#0f172a]/40 text-xs font-bold uppercase text-slate-500 tracking-wider">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-[#0f172a]/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                                                    {user.name?.[0] || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{user.name || 'Anonymous'}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' || user.role === 'super-admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-xs text-green-500 font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                                                Active
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-1">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-[var(--primary)] transition-colors" title="Manage Permissions">
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-500 transition-colors" title="Suspend User">
                                                    <UserX className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
