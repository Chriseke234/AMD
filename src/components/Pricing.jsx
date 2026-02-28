import { Check } from "lucide-react";
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
        <section id="pricing" className="py-32 bg-[var(--background)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.05),transparent_40%)]" />
            <div className="container px-4 mx-auto relative z-10">
                <div className="max-w-3xl mb-24 text-center mx-auto animation-fade-up">
                    <div className="inline-flex items-center px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] border rounded-full bg-primary/5 text-primary border-primary/20">
                        Tiered Plans
                    </div>
                    <h2 className="text-4xl font-black mb-6 lg:text-6xl tracking-tighter italic">Simple, <span className="text-primary tracking-tighter">Transparent</span> Pricing.</h2>
                    <p className="text-lg text-muted-foreground font-medium">Start for free and scale as your data intelligence requirements grow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={`relative p-12 rounded-[3.5rem] border transition-all duration-700 animation-fade-up card-shine ${tier.highlighted
                                ? 'bg-primary/5 border-primary shadow-[0_32px_64px_-16px_rgba(124,58,237,0.2)] scale-105 z-10'
                                : 'bg-white/50 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5'
                                }`}
                            style={{ animationDelay: `${0.1 + (i * 0.1)}s` }}
                        >
                            {tier.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-2xl shadow-primary/30">
                                    Recommended
                                </div>
                            )}
                            <div className="mb-10">
                                <h3 className={`text-2xl font-black italic uppercase tracking-tight mb-2 ${tier.highlighted ? 'text-primary' : ''}`}>{tier.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{tier.description}</p>
                            </div>
                            <div className="mb-12 flex items-baseline">
                                <span className={`text-4xl font-black ${tier.highlighted ? 'text-primary' : ''}`}>{tier.price === 'Custom' ? '' : '$'}</span>
                                <span className={`text-7xl font-black tracking-tighter ${tier.highlighted ? 'text-primary' : ''}`}>{tier.price}</span>
                                {tier.price !== 'Custom' && <span className="text-muted-foreground font-bold ml-2 uppercase text-xs tracking-widest">/mo</span>}
                            </div>
                            <ul className="space-y-5 mb-12">
                                {tier.features.map((feature, j) => (
                                    <li key={j} className="flex items-center text-sm font-semibold tracking-tight">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 shrink-0 shadow-sm ${tier.highlighted ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signup">
                                <Button
                                    className={`w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${tier.highlighted ? 'shadow-primary/30' : ''}`}
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
