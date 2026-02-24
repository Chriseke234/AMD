"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase"
import { getURL } from "@/lib/auth-helpers"

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
                redirectTo: `${getURL()}auth/callback`,
            }
        })
        if (error) alert(error.message)
    }

    return (
        <div className="flex min-h-screen">
            {/* Left: Branding & Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-[var(--primary)] text-white p-12 flex-col justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-2xl">A</div>
                    <span className="text-2xl font-bold">AskMyData</span>
                </div>

                <div className="max-w-md">
                    <h2 className="text-4xl font-bold mb-6 italic">"The most powerful tool for data intelligence, now in your hands."</h2>
                    <div className="w-full aspect-video glass rounded-3xl border-white/20 p-6 flex flex-col justify-end">
                        <div className="space-y-2">
                            <div className="h-2 w-3/4 bg-white/20 rounded" />
                            <div className="h-2 w-1/2 bg-white/20 rounded" />
                            <div className="h-2 w-2/3 bg-white/20 rounded" />
                        </div>
                    </div>
                </div>

                <div className="text-sm opacity-80">
                    © 2026 AskMyData. Advanced AI Powered Analytics.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--background)]">
                <Card className="w-full max-w-md border-none shadow-none lg:shadow-sm lg:border">
                    <CardHeader className="text-center space-y-1">
                        <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
                        <p className="text-[var(--muted-foreground)]">Enter your credentials to access your insights</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button variant="outline" className="w-full space-x-2" onClick={handleGoogleLogin}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Continue with Google</span>
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[var(--border)]" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Password</label>
                                    <a href="#" className="text-xs text-[var(--primary)] hover:underline">Forgot password?</a>
                                </div>
                                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <Button className="w-full" disabled={loading}>
                                {loading ? "Authenticating..." : "Login"}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-[var(--muted-foreground)]">
                            Don&apos;t have an account?{" "}
                            <a href="/signup" className="text-[var(--primary)] font-semibold hover:underline">Sign up for free</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
