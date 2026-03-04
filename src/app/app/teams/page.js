"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import {
    Users, Plus, Mail, Shield, Settings, Trash2,
    Check, X, Loader2, UserPlus, Globe, Lock
} from "lucide-react"

export default function TeamsPage() {
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [newTeamName, setNewTeamName] = useState("")
    const [activeTeam, setActiveTeam] = useState(null)
    const [inviting, setInviting] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const supabase = createClient()

    useEffect(() => {
        fetchTeams()
    }, [])

    const fetchTeams = async () => {
        const { data: teamsData, error: teamsError } = await supabase
            .from('teams')
            .select('*, team_members(*)')

        if (teamsData) {
            setTeams(teamsData)
            if (teamsData.length > 0) setActiveTeam(teamsData[0])
        }
        setLoading(false)
    }

    const handleCreateTeam = async (e) => {
        e.preventDefault()
        if (!newTeamName.trim()) return

        setCreating(true)
        const { data: { user } } = await supabase.auth.getUser()

        const slug = newTeamName.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(2, 7)

        const { data: team, error } = await supabase
            .from('teams')
            .insert({ name: newTeamName, slug, owner_id: user.id })
            .select()
            .single()

        if (team) {
            // Owner is automatically an admin member
            await supabase.from('team_members').insert({
                team_id: team.id,
                profile_id: user.id,
                role: 'owner'
            })

            setTeams([...teams, { ...team, team_members: [] }])
            setActiveTeam(team)
            setNewTeamName("")
        }
        setCreating(false)
    }

    const handleInvite = async (e) => {
        e.preventDefault()
        if (!inviteEmail.trim() || !activeTeam) return

        setInviting(true)
        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase.from('team_invitations').insert({
            team_id: activeTeam.id,
            email: inviteEmail,
            invited_by: user.id,
            token: Math.random().toString(36).substring(2, 15),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })

        if (!error) {
            alert(`Invitation sent to ${inviteEmail}`)
            setInviteEmail("")
        }
        setInviting(false)
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[var(--muted-foreground)]">Loading workspace...</p>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto space-y-8 animation-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Workspace</h1>
                    <p className="text-[var(--muted-foreground)] text-lg">Manage your organization and collaborators</p>
                </div>
                <form onSubmit={handleCreateTeam} className="flex items-center space-x-2">
                    <Input
                        placeholder="Organization Name"
                        className="w-64"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <Button type="submit" disabled={creating || !newTeamName}>
                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        New Team
                    </Button>
                </form>
            </div>

            {teams.length === 0 ? (
                <Card className="p-20 text-center border-dashed border-2 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-3xl bg-primary/5 text-primary flex items-center justify-center mb-6">
                        <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Build your team</h3>
                    <p className="text-[var(--muted-foreground)] max-w-sm mb-8">Create an organization to share datasets and dashboards with your colleagues.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Team Sidebar */}
                    <div className="lg:col-span-4 space-y-3">
                        <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-2">Active Teams</p>
                        {teams.map(team => (
                            <button
                                key={team.id}
                                onClick={() => setActiveTeam(team)}
                                className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group ${activeTeam?.id === team.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-border/50 hover:border-primary/50'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${activeTeam?.id === team.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                                        {team.name[0].toUpperCase()}
                                    </div>
                                    <span className="font-bold">{team.name}</span>
                                </div>
                                {activeTeam?.id !== team.id && <Settings className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>
                        ))}
                    </div>

                    {/* Team Management Content */}
                    <div className="lg:col-span-8">
                        {activeTeam && (
                            <div className="space-y-6">
                                <Card className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                                <Shield className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">{activeTeam.name}</h2>
                                                <p className="text-sm text-[var(--muted-foreground)] flex items-center">
                                                    <Globe className="w-3 h-3 mr-1" /> askmydata.com/team/{activeTeam.slug}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">Settings</Button>
                                            <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="p-6 rounded-2xl bg-[var(--muted)]/20 border border-border/50">
                                            <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Total Members</p>
                                            <h4 className="text-3xl font-black">{activeTeam.team_members?.length || 1}</h4>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[var(--muted)]/20 border border-border/50">
                                            <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Role</p>
                                            <h4 className="text-3xl font-black text-primary">Admin</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold">Members</h3>
                                            <form onSubmit={handleInvite} className="flex items-center space-x-2">
                                                <Input
                                                    placeholder="Invite via email..."
                                                    className="w-48 h-9 text-sm"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                />
                                                <Button size="sm" type="submit" disabled={inviting}>
                                                    {inviting ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3 mr-1" />} Invite
                                                </Button>
                                            </form>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Static placeholder for current user/owner */}
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-white">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 border-2 border-white shadow-sm" />
                                                    <div>
                                                        <p className="font-bold text-sm">You (Owner)</p>
                                                        <p className="text-xs text-[var(--muted-foreground)]">Full administrative control</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">Admin</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-6 group hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <Plus className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-primary transition-colors" />
                                        </div>
                                        <h4 className="font-bold mb-1">Shared Datasets</h4>
                                        <p className="text-xs text-[var(--muted-foreground)]">0 resources shared with this team</p>
                                    </Card>
                                    <Card className="p-6 group hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <Plus className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-primary transition-colors" />
                                        </div>
                                        <h4 className="font-bold mb-1">Team Dashboards</h4>
                                        <p className="text-xs text-[var(--muted-foreground)]">0 boards published to organization</p>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
