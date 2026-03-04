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
            price: "15",
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
        <section id="pricing" className="py-24 sm:py-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--primary),transparent_40%)] opacity-[0.05]" />
            <div className="container px-6 mx-auto relative z-10">
                <div className="max-w-3xl mb-16 sm:mb-24 text-center mx-auto animate-fade-in">
                    <div className="inline-flex items-center px-5 py-2 mb-8 text-[11px] font-bold uppercase tracking-[0.4em] border rounded-full bg-primary/5 text-primary border-primary/20 shadow-sm">
                        Tiered Plans
                    </div>
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tighter italic leading-tight">Simple, <span className="text-primary">Transparent</span> Pricing.</h2>
                    <p className="text-lg sm:text-xl text-muted-foreground font-medium opacity-70">Start for free and scale as your data intelligence requirements grow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto items-stretch">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={`relative p-8 sm:p-14 rounded-[3rem] border transition-all duration-500 animate-fade-in flex flex-col ${tier.highlighted
                                ? 'bg-card border-primary shadow-[0_32px_64px_-16px_rgba(124,58,237,0.2)] md:scale-105 z-10 ring-4 ring-primary/5'
                                : 'bg-card/50 backdrop-blur-xl border-border hover:border-primary/30'
                                }`}
                            style={{ animationDelay: `${0.1 + (i * 0.1)}s` }}
                        >
                            {tier.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-xl">
                                    <Sparkles className="w-4 h-4 inline mr-2" />
                                    Recommended
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className={`text-2xl font-black italic uppercase tracking-tight mb-2 ${tier.highlighted ? 'text-primary' : ''}`}>{tier.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium opacity-70">{tier.description}</p>
                            </div>
                            <div className="mb-10 flex items-baseline">
                                <span className={`text-4xl font-black font-heading ${tier.highlighted ? 'text-primary' : ''}`}>{tier.price === 'Custom' ? '' : '$'}</span>
                                <span className={`text-6xl sm:text-7xl font-black tracking-tighter leading-none ${tier.highlighted ? 'text-primary' : ''}`}>{tier.price}</span>
                                {tier.price !== 'Custom' && <span className="text-muted-foreground font-bold ml-2 uppercase text-[10px] tracking-[0.2em] opacity-60">/mo</span>}
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                {tier.features.map((feature, j) => (
                                    <li key={j} className="flex items-center text-sm sm:text-base font-medium tracking-tight">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 shrink-0 ${tier.highlighted ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signup">
                                <Button
                                    className={`w-full h-16 sm:h-20 rounded-2xl sm:rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${tier.highlighted ? 'bg-primary hover:bg-primary-hover shadow-primary/20' : 'bg-foreground text-background hover:opacity-90'}`}
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
