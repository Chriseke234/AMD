"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Users, UserPlus, Mail, Shield, Trash2 } from "lucide-react"

export default function TeamPage() {
    const [email, setEmail] = useState("")

    const members = [
        { name: "Chris (You)", email: "chris@example.com", role: "Owner" },
        { name: "Sarah Tech", email: "sarah@example.com", role: "Admin" },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8 animation-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Collaboration</h1>
                    <p className="text-[var(--muted-foreground)] text-lg">Manage your team and workspace permissions.</p>
                </div>
                <div className="flex items-center -space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-xs">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Invite Team Members</CardTitle>
                    <p className="text-sm text-[var(--muted-foreground)]">Send an invitation to join your workspace.</p>
                </CardHeader>
                <CardContent className="flex space-x-4">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <Input
                            className="pl-10"
                            placeholder="colleague@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button className="space-x-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Invite</span>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Current Members</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-[var(--border)]">
                        {members.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                                        {m.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold">{m.name}</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">{m.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center text-sm font-medium">
                                        <Shield className="w-4 h-4 mr-2 text-[var(--primary)]" />
                                        {m.role}
                                    </div>
                                    {m.role !== 'Owner' && (
                                        <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
