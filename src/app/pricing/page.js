import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react"
import { Navbar } from "@/components/Navbar"

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "0",
            symbol: "$",
            description: "Perfect for students and early explorers.",
            features: ["5 Datasets included", "Advanced AI Chat", "Basic Dashboards", "1 Team member"],
            cta: "Get Started",
            variant: "outline"
        },
        {
            name: "Pro",
            price: "15",
            symbol: "$",
            description: "Powerful features for growing teams.",
            features: ["Unlimited Datasets", "Predictive Analytics", "Custom Dashboards", "Up to 5 Team members", "Priority Support"],
            cta: "Go Pro",
            variant: "primary",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            symbol: "",
            description: "Scalar intelligence for large organizations.",
            features: ["Dedicated Infrastructure", "SSO & Audit Logs", "Unlimited API Access", "24/7 Dedicated Support", "White-labeling"],
            cta: "Contact Sales",
            variant: "outline"
        }
    ]

    return (
        <main className="min-h-screen bg-[#fafafa]">
            <Navbar />
            <section className="pt-48 pb-32 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.05),transparent_40%)]" />

                <div className="container px-4 mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto mb-24 animation-fade-up">
                        <h1 className="text-6xl font-black tracking-tighter lg:text-8xl mb-8 font-heading">Simple, Transparent <span className="text-primary italic">Pricing.</span></h1>
                        <p className="text-2xl text-muted-foreground max-w-2xl mx-auto italic font-medium opacity-70">
                            "We believe intelligence should be accessible to everyone."
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-12 mt-20 lg:grid-cols-3 max-w-7xl mx-auto items-center">
                        {plans.map((p, i) => (
                            <div
                                key={i}
                                className={`relative flex flex-col p-14 rounded-[4rem] border transition-all duration-700 hover:scale-105 animation-fade-up card-shine ${p.highlight
                                    ? 'border-primary bg-white shadow-[0_48px_96px_-24px_rgba(124,58,237,0.25)] z-10'
                                    : 'border-border/60 glass bg-white/40'
                                    }`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {p.highlight && (
                                    <div className="absolute top-0 right-12 -translate-y-1/2 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] px-8 py-3 rounded-full flex items-center shadow-2xl shadow-primary/40 animate-bounce-slow">
                                        <Zap className="w-4 h-4 mr-2" /> Best Value
                                    </div>
                                )}

                                <h3 className={`text-3xl font-black mb-4 font-heading uppercase italic tracking-tight ${p.highlight ? 'text-primary' : ''}`}>{p.name}</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className={`text-5xl font-black font-heading ${p.highlight ? 'text-primary' : ''}`}>{p.symbol}</span>
                                    <span className={`text-[6rem] font-black tracking-tighter leading-none font-heading ${p.highlight ? 'text-primary' : ''}`}>{p.price}</span>
                                    {p.price !== 'Custom' && <span className="text-muted-foreground font-black ml-3 uppercase text-xs tracking-[0.3em] opacity-60">/mo</span>}
                                </div>
                                <p className="text-base text-muted-foreground mb-12 font-medium opacity-70 leading-relaxed">{p.description}</p>

                                <ul className="space-y-6 mb-16 flex-1 text-left">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-start text-base font-semibold tracking-tight opacity-90">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-5 mt-0.5 shadow-sm ${p.highlight ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/signup" className="w-full">
                                    <Button className={`w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all border-none ${p.highlight ? 'bg-primary hover:bg-primary-hover shadow-primary/40' : 'bg-slate-900 text-white hover:bg-slate-800'}`} size="lg">
                                        {p.cta}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-32 p-16 glass rounded-[4rem] border border-primary/10 max-w-5xl mx-auto text-center space-y-8 shadow-2xl shadow-black/[0.02] animation-fade-up">
                        <div className="inline-flex p-5 rounded-3xl bg-primary/10 text-primary mb-2 shadow-inner">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h4 className="text-4xl font-black font-heading tracking-tight italic">Try all advanced features for FREE!</h4>
                        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto opacity-70 leading-relaxed">Our Free plan currently includes 100% access to regression, forecasting, and anomaly detection.</p>
                        <div className="flex items-center justify-center space-x-4 text-xs font-black text-primary uppercase tracking-[0.4em]">
                            <ShieldCheck className="w-5 h-5" /> Secure Payments by Stripe & Paystack
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
