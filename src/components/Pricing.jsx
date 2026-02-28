import { Check, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import Link from "next/link";

export function Pricing() {
    const tiers = [
        {
            name: "Starter",
            price: "0",
            description: "Perfect for individuals and side projects.",
            features: [
                "Up to 3 Datasets",
                "100 AI Queries / month",
                "Basic Visualizations",
                "24h Support Response"
            ],
            cta: "Get Started",
            highlighted: false
        },
        {
            name: "Pro",
            price: "49",
            description: "The complete toolkit for data professionals.",
            features: [
                "Unlimited Datasets",
                "Unlimited AI Queries",
                "Advanced Charts & Exports",
                "Custom Branding",
                "Priority Support"
            ],
            cta: "Go Pro",
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Scale-ready infrastructure for large teams.",
            features: [
                "SSO & Advanced Security",
                "Dedicated Account Manager",
                "Custom AI Training",
                "SLA Guarantees",
                "On-premise Deployment"
            ],
            cta: "Contact Sales",
            highlighted: false
        }
    ];

    return (
        <section id="pricing" className="py-40 bg-[#fafafa] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.08),transparent_40%)]" />
            <div className="container px-4 mx-auto relative z-10">
                <div className="max-w-3xl mb-32 text-center mx-auto animation-fade-up">
                    <div className="inline-flex items-center px-5 py-2 mb-10 text-[11px] font-black uppercase tracking-[0.4em] border rounded-full bg-primary/5 text-primary border-primary/20 shadow-sm">
                        Tiered Plans
                    </div>
                    <h2 className="text-6xl font-black mb-10 lg:text-8xl tracking-tighter italic font-heading">Simple, <span className="text-primary tracking-tighter">Transparent</span> Pricing.</h2>
                    <p className="text-xl text-muted-foreground font-medium opacity-70">Start for free and scale as your data intelligence requirements grow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto items-center">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={`relative p-14 rounded-[4rem] border transition-all duration-700 animation-fade-up card-shine ${tier.highlighted
                                ? 'bg-white border-primary shadow-[0_48px_96px_-24px_rgba(124,58,237,0.25)] scale-110 z-10'
                                : 'bg-white/40 backdrop-blur-xl border-border/60 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5'
                                }`}
                            style={{ animationDelay: `${0.1 + (i * 0.1)}s` }}
                        >
                            {tier.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] px-8 py-3 rounded-full shadow-2xl shadow-primary/40 animate-bounce-slow">
                                    <Sparkles className="w-4 h-4 inline mr-2" />
                                    Recommended
                                </div>
                            )}
                            <div className="mb-12">
                                <h3 className={`text-3xl font-black italic uppercase tracking-tight mb-3 font-heading ${tier.highlighted ? 'text-primary' : ''}`}>{tier.name}</h3>
                                <p className="text-base text-muted-foreground font-medium opacity-70">{tier.description}</p>
                            </div>
                            <div className="mb-14 flex items-baseline">
                                <span className={`text-5xl font-black font-heading ${tier.highlighted ? 'text-primary' : ''}`}>{tier.price === 'Custom' ? '' : '$'}</span>
                                <span className={`text-[6rem] font-black tracking-tighter font-heading leading-none ${tier.highlighted ? 'text-primary' : ''}`}>{tier.price}</span>
                                {tier.price !== 'Custom' && <span className="text-muted-foreground font-black ml-3 uppercase text-xs tracking-[0.3em] opacity-60">/mo</span>}
                            </div>
                            <ul className="space-y-6 mb-16">
                                {tier.features.map((feature, j) => (
                                    <li key={j} className="flex items-center text-base font-semibold tracking-tight opacity-90">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-5 shrink-0 shadow-md ${tier.highlighted ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signup">
                                <Button
                                    className={`w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all hover:scale-[1.03] active:scale-95 border-none ${tier.highlighted ? 'shadow-primary/40 bg-primary hover:bg-primary-hover' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                                    variant={tier.highlighted ? 'default' : 'outline'}
                                >
                                    {tier.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
