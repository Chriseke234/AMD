"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase"
import { getURL } from "@/lib/auth-helpers"
import { Sparkles, Mail, Lock, Chrome, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) alert(error.message)
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${getURL()}/auth/callback`,
            }
        })
        if (error) alert(error.message)
    }

    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            {/* Background Decoration for mobile */}
            <div className="lg:hidden absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
            </div>

            {/* Left: Branding & Context (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-[40%] xl:w-[45%] bg-card relative overflow-hidden p-16 xl:p-24 flex-col justify-between border-r">
                <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/15 blur-[120px] rounded-full animate-float" />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center space-x-3 group mb-20">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-xl text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                            A
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground">AskMyData</span>
                    </Link>

                    <div className="space-y-8">
                        <div className="inline-flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] border rounded-full glass-premium text-primary">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Intelligence 2.0
                        </div>
                        <h2 className="text-5xl xl:text-7xl font-black text-foreground leading-[0.95] tracking-tighter italic">
                            Data that <br /> <span className="text-primary not-italic">speaks.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-sm leading-relaxed">
                            Professional analytics for teams that demand clarity. Access your neural intelligence dashboard.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="p-8 rounded-[2.5rem] border glass-premium shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Neural Core v4.1</div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-primary/40 animate-pulse" />
                            </div>
                            <div className="h-1.5 w-2/3 bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-muted-foreground/30 font-black uppercase tracking-[0.4em]">
                    © 2026 AskMyData AI Systems.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-[60%] xl:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md space-y-10 animate-fade-in">
                    <div className="lg:hidden">
                        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Base
                        </Link>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic text-foreground">Welcome <span className="text-primary tracking-tighter not-italic">Back.</span></h1>
                        <p className="text-muted-foreground text-lg font-medium">Continue your data strategy session.</p>
                    </div>

                    <div className="space-y-4">
                        <Button variant="outline" className="w-full h-14 sm:h-16 space-x-4 rounded-2xl border-border bg-card hover:bg-muted transition-all group" onClick={handleGoogleLogin}>
                            <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Continue with Google</span>
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                            <span className="bg-background px-4 text-muted-foreground/60 leading-none">Protocol Secure Login</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Endpoint</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="your@agency.com"
                                    className="h-14 sm:h-16 pl-14 rounded-2xl border-border bg-card/50 focus:border-primary/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1 text-[10px] font-black uppercase tracking-widest">
                                <label className="text-muted-foreground">Encryption Key</label>
                                <a href="#" className="text-primary hover:underline underline-offset-4">Reset?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-14 sm:h-16 pl-14 rounded-2xl border-border bg-card/50 focus:border-primary/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full h-14 sm:h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all" disabled={loading}>
                            {loading ? "Authenticating..." : "Initialize Dashboard"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground font-semibold">
                        New Analyst?{" "}
                        <Link href="/signup" className="text-primary font-black uppercase tracking-widest hover:underline underline-offset-4 ml-2">Join for Free</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
