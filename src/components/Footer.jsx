import Link from "next/link";
import { Send, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background border-t pt-24 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />
            <div className="container px-6 mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-3 group mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                A
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-foreground">
                                AskMyData<span className="text-primary italic">.</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium max-w-xs">
                            The intelligent data layer for modern teams. Transform raw signals into strategic clarity with AI.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="p-2 rounded-lg bg-secondary border hover:text-primary transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-secondary border hover:text-primary transition-colors">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-secondary border hover:text-primary transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#solutions" className="hover:text-primary transition-colors">Solutions</a></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">API Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Stay Updated</h4>
                        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-bold">Join the data revolution</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="name@email.com"
                                className="w-full bg-secondary border border-border h-12 px-5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 group-hover:border-primary/40 transition-all"
                            />
                            <button className="absolute right-1 top-1 w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-widest">
                    <p>© 2026 AskMyData Systems. Built for Scale.</p>
                    <div className="flex space-x-6">
                        <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Security</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
