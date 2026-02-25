"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase"
import { getURL } from "@/lib/auth-helpers"
import { Sparkles, Mail, Lock, Github, Chrome } from "lucide-react"

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
        <div className="flex min-h-screen bg-background">
            {/* Left: Branding & Illustration */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#0a0a0b] relative overflow-hidden p-16 flex-col justify-between">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animation-pulse-slow" />
                <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full animation-pulse-slow" style={{ animationDelay: '2s' }} />

                <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-primary/30">
                        A
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">AskMyData</span>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center px-4 py-1.5 mb-8 text-sm font-semibold border rounded-full border-white/10 bg-white/5 text-primary-foreground backdrop-blur-md">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI-Powered Business Intelligence
                    </div>
                    <h2 className="text-5xl font-black text-white mb-8 leading-tight">
                        Turn raw data into <span className="text-primary italic">actionable</span> insights.
                    </h2>

                    <div className="relative w-full aspect-video glass border-white/10 rounded-3xl p-8 flex flex-col justify-end shadow-2xl">
                        <div className="space-y-4">
                            <div className="h-3 w-3/4 bg-white/10 rounded-full animate-pulse" />
                            <div className="h-3 w-1/2 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                            <div className="h-3 w-2/3 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                        <div className="mt-8 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-white/60 text-sm font-medium">AI Agent Processing...</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-white/40 font-medium">
                    © 2026 AskMyData. Intelligent Analytics Platform.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-lg space-y-8 animation-fade-up">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground text-lg">Log in to your account to continue.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" className="w-full h-14 space-x-3 rounded-2xl border-border/50 hover:bg-secondary transition-all" onClick={handleGoogleLogin}>
                            <Chrome className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Continue with Google</span>
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-4 text-muted-foreground font-bold tracking-widest leading-none">Or use email</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="h-14 pl-12 rounded-2xl border-border/50 focus:border-primary/50 transition-all text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Password</label>
                                <a href="#" className="text-sm text-primary font-bold hover:underline transition-all">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="h-14 pl-12 rounded-2xl border-border/50 focus:border-primary/50 transition-all text-base"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20" disabled={loading}>
                            {loading ? "Authenticating..." : "Login to my Account"}
                        </Button>
                    </form>

                    <p className="text-center text-base text-muted-foreground font-medium">
                        Don&apos;t have an account?{" "}
                        <a href="/signup" className="text-primary font-bold hover:underline transition-all underline-offset-4">Sign up for free</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
