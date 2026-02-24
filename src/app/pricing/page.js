import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react"
import { Navbar } from "@/components/Navbar"

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for students and early explorers.",
            features: ["5 Datasets included", "Advanced AI Chat", "Basic Dashboards", "1 Team member"],
            cta: "Get Started",
            variant: "outline"
        },
        {
            name: "Pro",
            price: "$29",
            description: "Powerful features for growing teams.",
            features: ["Unlimited Datasets", "Predictive Analytics", "Custom Dashboards", "Up to 5 Team members", "Priority Support"],
            cta: "Go Pro",
            variant: "primary",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Scalar intelligence for large organizations.",
            features: ["Dedicated Infrastructure", "SSO & Audit Logs", "Unlimited API Access", "24/7 Dedicated Support", "White-labeling"],
            cta: "Contact Sales",
            variant: "outline"
        }
    ]

    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="pt-32 pb-24 text-center">
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto italic">
                        "We believe intelligence should be accessible to everyone."
                    </p>

                    <div className="grid grid-cols-1 gap-8 mt-20 lg:grid-cols-3 max-w-6xl mx-auto">
                        {plans.map((p, i) => (
                            <div
                                key={i}
                                className={`relative flex flex-col p-8 rounded-3xl border transition-all hover:scale-105 ${p.highlight
                                    ? 'border-[var(--primary)] bg-white shadow-2xl z-10'
                                    : 'border-[var(--border)] glass'
                                    }`}
                            >
                                {p.highlight && (
                                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center shadow-lg">
                                        <Zap className="w-3 h-3 mr-1" /> Best Value
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-black">{p.price}</span>
                                    {p.price !== 'Custom' && <span className="text-slate-500 ml-1">/mo</span>}
                                </div>
                                <p className="text-sm text-slate-500 mb-8">{p.description}</p>

                                <ul className="space-y-4 mb-10 flex-1 text-left">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-start text-sm font-medium">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${p.highlight ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--primary)]'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/signup" className="w-full">
                                    <Button variant={p.variant} size="lg" className="w-full">
                                        {p.cta}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-8 glass rounded-3xl border border-[var(--primary)]/10 max-w-4xl mx-auto text-center space-y-4">
                        <div className="inline-flex p-3 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-2">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h4 className="text-2xl font-bold">Try all advanced features for FREE!</h4>
                        <p className="text-[var(--muted-foreground)]">Our Free plan currently includes 100% access to regression, forecasting, and anomaly detection.</p>
                        <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[var(--primary)] uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" /> Secure Payments by Stripe & Paystack
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
