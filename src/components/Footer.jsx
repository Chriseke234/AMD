import Link from "next/link";
import { Send } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border/30 pt-32 pb-16 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.03),transparent_40%)]" />
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-3 group mb-8">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-black text-xl shadow-xl shadow-primary/20">
                                A
                            </div>
                            <span className="text-2xl font-black tracking-tighter">
                                AskMyData
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-base leading-relaxed mb-8 font-medium">
                            The intelligent data layer for modern teams. Transform raw signals into strategic clarity with AI.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><Link href="/signup" className="hover:text-primary transition-colors">Integrations</Link></li>
                            <li><Link href="/signup" className="hover:text-primary transition-colors">Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Carrers</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Legal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-[0.2em] text-xs mb-8">Newsletter</h4>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="strategy@yourcompany.com"
                                className="w-full bg-secondary/50 border border-border/50 h-14 px-6 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 group-hover:border-primary/40 transition-all font-medium"
                            />
                            <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="mt-6 text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black italic">Join 12,000+ data leaders</p>
                    </div>
                </div>

                <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-muted-foreground">
                        © 2026 AskMyData AI. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/" className="hover:text-primary transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
