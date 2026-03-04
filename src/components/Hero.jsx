import Link from "next/link";
import { Button } from "./ui/Button";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden lg:pt-48 lg:pb-32">
            {/* Background Grids & Glows */}
            <div className="absolute inset-0 -z-10 bg-grid opacity-[0.2] dark:opacity-[0.1]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container relative px-6 mx-auto">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] border rounded-full glass-premium text-primary animate-fade-in shadow-xl shadow-primary/10">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Intelligence 2.0 Released
                    </div>

                    <h1 className="mb-8 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-balance animate-fade-in">
                        Data That <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-600 italic px-2">
                            Understands.
                        </span>
                    </h1>

                    <p className="mb-12 text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl opacity-80 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        The most intuitive AI interface to analyze and visualize your business logic.
                        Professional-grade insights, <span className="text-foreground font-bold">zero learning curve.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:px-10 h-16 sm:h-20 rounded-2xl sm:rounded-3xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                                Get Started
                                <ArrowRight className="ml-3 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Preview Image / Mockup */}
                    <div className="relative w-full mt-24 sm:mt-32 lg:mt-40 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="relative mx-auto rounded-3xl sm:rounded-[4rem] border-8 border-background glass p-2 sm:p-4 shadow-3xl shadow-black/10 overflow-hidden max-w-5xl group">
                            <div className="aspect-[16/10] w-full bg-secondary rounded-2xl sm:rounded-[3.2rem] flex items-center justify-center border border-border overflow-hidden relative">
                                <div className="absolute inset-0 bg-grid opacity-20" />
                                <div className="relative z-10 flex flex-col items-center group-hover:scale-110 transition-transform duration-1000">
                                    <div className="w-20 h-20 mb-6 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground italic tracking-tight">AI Engine Powered</h3>
                                    <div className="flex items-center space-x-2 mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span>System Optimized</span>
                                    </div>
                                </div>

                                {/* Decorative HUD elements */}
                                <div className="absolute top-10 left-10 w-48 h-32 glass rounded-3xl border-border hidden lg:block" />
                                <div className="absolute bottom-10 right-10 w-64 h-48 glass rounded-3xl border-border hidden lg:block" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
