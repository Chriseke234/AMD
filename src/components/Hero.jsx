import Link from "next/link";
import { Button } from "./ui/Button";
import { Sparkles, ArrowRight, Play, Database, Shield, Zap } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden lg:pt-56 lg:pb-40 bg-mesh">
            {/* Background Grids & Neural Glows */}
            <div className="absolute inset-0 -z-10 bg-grid opacity-[0.1]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-mesh" />
                <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full animate-mesh" style={{ animationDelay: '3s' }} />
            </div>

            <div className="container relative px-6 mx-auto">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
                    {/* Elite Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-10 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] border border-white/10 glass-premium text-primary animate-fade-in shadow-2xl shadow-primary/20 rounded-full">
                        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                        Next-Gen Intelligence OS
                    </div>

                    <h1 className="mb-8 text-5xl sm:text-8xl lg:text-9xl font-black tracking-[calc(-0.05em)] leading-[0.85] text-balance animate-fade-in font-heading italic">
                        The Data <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-primary via-purple-400 to-indigo-500 not-italic px-4 drop-shadow-sm">
                            Singularity.
                        </span>
                    </h1>

                    <p className="mb-14 text-lg sm:text-2xl text-muted-foreground font-medium max-w-3xl opacity-70 animate-fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
                        Connect your ecosystems. Orchestrate neural data flows. <br className="hidden md:block" />
                        Build the future of <span className="text-foreground font-black underline decoration-primary/40 underline-offset-8">autonomous analytics</span> today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <Button size="lg" className="neo-button w-full sm:px-12 h-18 sm:h-22 rounded-2xl sm:rounded-[2.5rem] text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(124,58,237,0.4)] bg-primary group">
                                Initialize System
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                        <button className="flex items-center space-x-4 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all group">
                            <div className="w-12 h-12 rounded-2xl glass-premium flex items-center justify-center group-hover:scale-110 transition-all border-white/5 shadow-xl shadow-black/20">
                                <Play className="w-4 h-4 fill-primary text-primary ml-1" />
                            </div>
                            <span>Watch Protocol</span>
                        </button>
                    </div>

                    {/* Elite Preview Showcase */}
                    <div className="relative w-full mt-32 sm:mt-48 lg:mt-56 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {/* Decorative floating elements */}
                        <div className="absolute -top-20 -left-10 w-48 h-48 glass-premium rounded-[3rem] p-6 hidden lg:block animate-float z-20 shadow-2xl shadow-primary/10">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                                <Zap className="text-primary w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-1.5 w-1/2 bg-white/20 rounded-full" />
                                <div className="h-1.5 w-full bg-white/10 rounded-full" />
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -right-10 w-64 h-64 glass-premium rounded-[3rem] p-8 hidden lg:block animate-float z-20 shadow-2xl shadow-purple-500/10" style={{ animationDelay: '1s' }}>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                                <Database className="text-purple-400 w-6 h-6" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                                <div className="h-2 w-full bg-white/10 rounded-full" />
                                <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                            </div>
                        </div>

                        {/* Main Mockup */}
                        <div className="relative mx-auto rounded-[3rem] sm:rounded-[4.5rem] border-[12px] border-background glass p-3 sm:p-5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden max-w-6xl group bg-black">
                            <div className="aspect-[16/10] w-full rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden relative border border-white/10">
                                <img
                                    src="/brain/f039823c-dfe2-4207-bf2c-40e0522d1558/premium_dashboard_preview_1772612529490.png"
                                    alt="AskMyData Intelligence OS"
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[3s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />

                                {/* Overlay HUD */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                                    <div className="px-8 py-4 glass-premium rounded-2xl border-white/20">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Glow */}
                        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30" />
                    </div>
                </div>
            </div>
        </section>
    );
}
