import Link from "next/link";
import { Send, Github, Twitter, Linkedin, Database, Globe, Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary/20 border-t border-white/5 pt-32 pb-16 relative overflow-hidden mt-32">
            <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container px-6 mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-24">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1 border-r border-white/5 pr-8">
                        <Link href="/" className="flex items-center space-x-3 group mb-8">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-black text-2xl shadow-2xl shadow-primary/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                                A
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-foreground">
                                AskMyData<span className="text-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-10 font-medium opacity-60">
                            Orchestrating intelligence for global systems. Transform raw data into strategic clarity with the Neural Protocol.
                        </p>
                        <div className="flex space-x-6">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-primary hover:border-primary/40 transition-all hover:-translate-y-1">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-primary mb-8 uppercase tracking-[0.4em]">Standard Solutions</h4>
                        <ul className="space-y-4 text-base text-muted-foreground font-medium">
                            <li><a href="#features" className="hover:text-white transition-colors opacity-60 hover:opacity-100">Neural Engine</a></li>
                            <li><a href="#solutions" className="hover:text-white transition-colors opacity-60 hover:opacity-100">Live Synthesis</a></li>
                            <li><Link href="#" className="hover:text-white transition-colors opacity-60 hover:opacity-100">Ecosystem Sync</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-primary mb-8 uppercase tracking-[0.4em]">Intelligence Hub</h4>
                        <ul className="space-y-4 text-base text-muted-foreground font-medium">
                            <li><Link href="#" className="hover:text-white transition-colors opacity-60 hover:opacity-100">Governance</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors opacity-60 hover:opacity-100">Whitepaper</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors opacity-60 hover:opacity-100">API Protocol</Link></li>
                        </ul>
                    </div>

                    <div className="glass-premium p-8 rounded-[2rem] border-white/10">
                        <h4 className="text-[10px] font-black text-foreground mb-6 uppercase tracking-[0.4em]">Stay Synced</h4>
                        <p className="text-xs text-muted-foreground mb-6 font-medium opacity-60">Join the elite intelligence network.</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="name@protocol.com"
                                className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 group-hover:border-primary/40 transition-all font-medium placeholder:opacity-30"
                            />
                            <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 text-[11px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                    <p className="opacity-40">© 2026 AskMyData Systems. Orchestrating the future.</p>
                    <div className="flex space-x-10">
                        <Link href="#" className="hover:text-primary transition-colors opacity-40 hover:opacity-100">Privacy</Link>
                        <Link href="#" className="hover:text-primary transition-colors opacity-40 hover:opacity-100">Security</Link>
                        <Link href="#" className="hover:text-primary transition-colors opacity-40 hover:opacity-100">Protocol</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
