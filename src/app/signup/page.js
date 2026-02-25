"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase"
import { getURL } from "@/lib/auth-helpers"
import { Sparkles, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react"

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
        <div className="flex min-h-screen bg-background">
            {/* Left: Branding & Illustration (Shared with Login) */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#0a0a0b] relative overflow-hidden p-16 flex-col justify-between">
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
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Enterprise-Grade Infrastructure
                    </div>
                    <h2 className="text-5xl font-black text-white mb-8 leading-tight">
                        Experience the <br /><span className="text-primary italic">Intelligence</span> difference.
                    </h2>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        {[
                            "Unlimited Datasets",
                            "Advanced AI Logic",
                            "Secure Collaboration",
                            "Real-time Updates"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center space-x-2 text-white/70 text-sm font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-sm text-white/40 font-medium">
                    © 2026 AskMyData. Your Data, Mastered.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-lg space-y-8 animation-fade-up">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground text-lg">Start your journey with AskMyData today.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    className="h-14 pl-12 rounded-2xl border-border/50 focus:border-primary/50 transition-all text-base"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="h-14 pl-12 rounded-2xl border-border/50 focus:border-primary/50 transition-all text-base"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 group" disabled={loading}>
                            {loading ? "Creating account..." : "Create My Account"}
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-4 text-muted-foreground font-bold tracking-widest leading-none">Security Guaranteed</span>
                        </div>
                    </div>

                    <p className="text-center text-base text-muted-foreground font-medium">
                        Already have an account?{" "}
                        <a href="/login" className="text-primary font-bold hover:underline transition-all underline-offset-4">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
