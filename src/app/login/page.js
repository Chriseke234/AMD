"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase"
import { getURL } from "@/lib/auth-helpers"
import { Sparkles, Mail, Lock, Github, Chrome } from "lucide-react"
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
                            Intelligence 2.0
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter italic">
                            Turn raw data <br /> into <span className="text-primary tracking-tighter not-italic">Clarity.</span>
                        </h2>
                        <p className="text-xl text-white/50 font-medium max-w-md leading-relaxed">
                            Join thousands of teams leveraging AI to master their data ecosystems in real-time.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl space-y-6 group">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">AI Status: Optimal</div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-primary/40 animate-pulse" />
                            </div>
                            <div className="h-2 w-2/3 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 pt-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-xs font-bold text-white/60 uppercase tracking-widest">Neural Engine Scaling...</div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
                    © 2026 AskMyData Systems.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-24 overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.03),transparent_40%)] pointer-events-none" />
                <div className="w-full max-w-lg space-y-12 animation-fade-up relative z-10">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-tighter italic">Welcome <span className="text-primary tracking-tighter">Back.</span></h1>
                        <p className="text-muted-foreground text-xl font-medium">Log in to your workspace to continue.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" className="w-full h-16 space-x-4 rounded-[1.5rem] border-border/50 hover:bg-secondary transition-all shadow-sm group" onClick={handleGoogleLogin}>
                            <Chrome className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
                            <span className="font-black uppercase tracking-widest text-xs">Continue with Google</span>
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                            <span className="bg-background px-6 text-muted-foreground/60 leading-none">Or secure email login</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Email Address</label>
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
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Security Token</label>
                                <a href="#" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline transition-all underline-offset-4">Reset?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-16 pl-14 rounded-[1.5rem] border-border/50 focus:border-primary/50 transition-all text-base font-medium shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full h-16 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all" disabled={loading}>
                            {loading ? "Decrypting..." : "Initialize Session"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground font-semibold">
                        New to the platform?{" "}
                        <a href="/signup" className="text-primary font-black uppercase tracking-widest hover:underline transition-all underline-offset-4 ml-2">Register Free</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
