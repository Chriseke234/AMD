"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import {
    CreditCard, Check, Zap, Shield,
    ArrowRight, Loader2, Sparkles,
    Database, Users, Layout, Globe
} from "lucide-react"

export default function BillingPage() {
    const [subscription, setSubscription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [upgrading, setUpgrading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchSubscription()
    }, [])

    const fetchSubscription = async () => {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .single()

        if (data) setSubscription(data)
        setLoading(false)
    }

    const handleUpgrade = async (tier) => {
        setUpgrading(true)
        // This will call our future Stripe API route
        try {
            const res = await fetch('/api/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier })
            })
            const { url } = await res.json()
            if (url) window.location.href = url
            else alert("Monetization mode is in preview. Stripe keys required for production checkout.")
        } catch (err) {
            alert("Billing system is initializing. Please try again in 5 minutes.")
        } finally {
            setUpgrading(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[var(--muted-foreground)] uppercase tracking-widest font-bold text-xs">Accessing Financial Vault...</p>
        </div>
    )

    const tiers = [
        {
            name: "Starter",
            price: "$0",
            description: "Perfect for exploring your data",
            features: ["Up to 3 Datasets", "100 AI Queries / mo", "Basic Charts", "Community Support"],
            cta: "Current Plan",
            current: subscription?.plan_tier === 'free',
            color: "text-[var(--muted-foreground)]",
            bg: "bg-[var(--muted)]/20"
        },
        {
            name: "Pro",
            price: "$49",
            description: "For professionals and growing teams",
            features: ["Unlimited Datasets", "Unlimited AI Queries", "Custom Dashboards", "Priority G-Sheets & DBs", "Advanced Forecasting"],
            cta: "Upgrade to Pro",
            current: subscription?.plan_tier === 'pro',
            highlight: true,
            color: "text-primary",
            bg: "bg-primary/5"
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Mission-critical data operations",
            features: ["Dedicated AI Instance", "SSO & Audit Logs", "White-label Analytics", "Dedicated Account Manager", "Custom Connectors"],
            cta: "Contact Sales",
            current: subscription?.plan_tier === 'enterprise',
            color: "text-purple-600",
            bg: "bg-purple-600/5"
        }
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-12 animation-fade-in p-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter italic flex items-center justify-center uppercase">
                    <CreditCard className="w-10 h-10 mr-4 text-primary" /> Plans & Billing
                </h1>
                <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto">
                    Power up your data analysis with premium features and dedicated resources.
                </p>
            </div>

            {/* Current Status Card */}
            <Card className="p-8 border-primary/20 bg-primary/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-24 h-24 text-primary" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                            <Zap className="w-10 h-10 text-primary fill-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Current Active Plan</p>
                            <h2 className="text-3xl font-black italic uppercase">{subscription?.plan_tier || 'Free'} Edition</h2>
                            <p className="text-[var(--muted-foreground)] text-sm mt-1">Status: <span className="text-emerald-500 font-bold uppercase">{subscription?.status || 'Active'}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" className="rounded-full">Manage Payment Method</Button>
                        <Button className="rounded-full px-8 shadow-lg shadow-primary/20">View Billing History</Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, i) => (
                    <Card key={i} className={`p-8 flex flex-col relative transition-all duration-500 ${tier.highlight ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'hover:border-primary/50'}`}>
                        {tier.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                Recommended
                            </div>
                        )}
                        <div className="mb-8">
                            <h3 className={`text-xl font-bold italic mb-2 ${tier.color}`}>{tier.name}</h3>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-4xl font-black tracking-tighter">{tier.price}</span>
                                {tier.price !== "Custom" && <span className="text-[var(--muted-foreground)] text-sm font-bold">/mo</span>}
                            </div>
                            <p className="text-xs text-[var(--muted-foreground)] mt-2 font-medium">{tier.description}</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature, j) => (
                                <div key={j} className="flex items-center text-sm">
                                    <div className={`w-5 h-5 rounded-full ${tier.bg} ${tier.color} flex items-center justify-center mr-3 shrink-0`}>
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="font-medium text-[var(--foreground)]">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tier.current ? 'bg-[var(--muted)] text-[var(--muted-foreground)] pointer-events-none' : 'shadow-lg hover:shadow-primary/25'}`}
                            onClick={() => handleUpgrade(tier.name.toLowerCase())}
                            disabled={upgrading}
                        >
                            {upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : tier.cta}
                            {!tier.current && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Usage Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8">
                    <h3 className="text-xl font-bold italic mb-6 flex items-center">
                        <Database className="w-5 h-5 mr-3 text-primary" /> Resource Usage
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                <span>Datasets</span>
                                <span>1 / 3</span>
                            </div>
                            <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[33%] rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                <span>AI Queries</span>
                                <span>45 / 100</span>
                            </div>
                            <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[45%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 bg-slate-900 text-white border-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold italic mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-3 text-primary" /> Enterprise Identity
                        </h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Need custom data residency, self-hosting options, or advanced audit logs? Our Enterprise tier provides dedicated infrastructure for elite teams.
                        </p>
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-black uppercase tracking-widest text-xs">
                            Schedule Technical Demo
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
