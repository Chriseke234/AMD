"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase"
import { getURL } from "@/lib/auth-helpers"

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
                emailRedirectTo: `${getURL()}auth/callback`,
            }
        })
        if (error) alert(error.message)
        else alert("Check your email for confirmation!")
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex lg:w-1/2 bg-[var(--primary)] text-white p-12 flex-col justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-2xl">A</div>
                    <span className="text-2xl font-bold">AskMyData</span>
                </div>
                <div className="max-w-md">
                    <h2 className="text-4xl font-bold mb-6">Join thousands of data-driven teams.</h2>
                    <p className="opacity-80">Get started with advanced analytics for free. No credit card required.</p>
                </div>
                <div className="text-sm opacity-80">© 2026 AskMyData.</div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--background)]">
                <Card className="w-full max-w-md border-none shadow-none lg:shadow-sm lg:border">
                    <CardHeader className="text-center space-y-1">
                        <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
                        <p className="text-[var(--muted-foreground)]">Start your data journey today</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <Button className="w-full" disabled={loading}>
                                {loading ? "Creating account..." : "Sign Up"}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-[var(--muted-foreground)]">
                            Already have an account?{" "}
                            <a href="/login" className="text-[var(--primary)] font-semibold hover:underline">Login</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
