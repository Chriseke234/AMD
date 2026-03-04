"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase"
import { getURL } from "@/lib/auth-helpers"
import { Sparkles, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
                emailRedirectTo: `${getURL()}/auth/callback`,
            }
        })
        if (error) alert(error.message)
        else alert("Check your email for confirmation!")
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen bg-background selection:bg-primary selection:text-white">
            {/* Left: Branding & Illustration */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#030303] relative overflow-hidden p-20 flex-col justify-between border-r border-white/5">
                {/* Background Glows with Animation */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full animation-pulse-slow animate-mesh" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/15 blur-[110px] rounded-full animation-pulse-slow animate-mesh" style={{ animationDelay: '2s' }} />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center space-x-4 group mb-24">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform">
                            A
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-white">AskMyData</span>
                    </Link>

                    <div className="space-y-10">
                        <div className="inline-flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] border rounded-full border-white/10 bg-white/5 text-primary backdrop-blur-md shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Elite Infrastructure
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
                            Experience <br /> pure <span className="text-primary tracking-tighter">Intelligence.</span>
                        </h2>
                        <p className="text-xl text-white/50 font-medium max-w-md leading-relaxed">
                            Unlock the full potential of your datasets with our multi-model AI orchestration engine.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        {[
                            "Unlimited Datasets",
                            "Neural AI Logic",
                            "Team Governance",
                            "Stripe Billing"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl glass border-white/5 group hover:border-primary/20 transition-all">
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                <span className="text-white/80 text-xs font-black uppercase tracking-widest">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
                    © 2026 AskMyData Systems.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-24 overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.03),transparent_40%)] pointer-events-none" />
                <div className="w-full max-w-xl space-y-12 animation-fade-up relative z-10">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-tighter">Create <span className="text-primary tracking-tighter">Account.</span></h1>
                        <p className="text-muted-foreground text-xl font-medium">Join the next generation of data-driven leaders.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Identity Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    className="h-16 pl-14 rounded-[1.5rem] border-border/50 focus:border-primary/50 transition-all text-base font-medium shadow-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Email Destination</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="h-16 pl-14 rounded-[1.5rem] border-border/50 focus:border-primary/50 transition-all text-base font-medium shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Access Credentials</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="password"
                                    placeholder="Create strong password"
                                    className="h-16 pl-14 rounded-[1.5rem] border-border/50 focus:border-primary/50 transition-all text-base font-medium shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full h-18 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all group" disabled={loading}>
                            {loading ? "Registering..." : "Initialize Profile"}
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.4em]">
                            <span className="bg-background px-6 text-muted-foreground/40 leading-none flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-2" />
                                Secure Registration Protocol
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground font-semibold">
                        Already have access?{" "}
                        <a href="/login" className="text-primary font-black uppercase tracking-widest hover:underline transition-all underline-offset-4 ml-2">Authenticate</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
