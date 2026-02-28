import Link from "next/link";
import { Button } from "./ui/Button";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-32 overflow-hidden lg:pt-48 lg:pb-64">
            {/* Immersive Background Elements */}
            <div className="absolute inset-0 -z-10 bg-background" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full animation-pulse-slow animate-mesh" />
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-accent/15 blur-[110px] rounded-full animation-pulse-slow animate-mesh" style={{ animationDelay: '3s' }} />
                <div className="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-indigo-500/10 blur-[90px] rounded-full animation-pulse-slow animate-mesh" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="container relative px-4 mx-auto">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] border rounded-full glass border-primary/20 text-primary animation-fade-up shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Next-Gen Intelligence
                    </div>

                    <h1 className="mb-10 text-7xl font-black tracking-tighter lg:text-[7rem] animation-fade-up leading-[0.9] text-balance">
                        Your Data, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-indigo-500 italic px-2">
                            Speaks.
                        </span>
                    </h1>

                    <p className="mb-14 text-lg text-muted-foreground lg:text-2xl font-medium max-w-3xl animation-fade-up text-balance leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        The most intuitive AI interface to analyze, visualize, and scale your business logic.
                        Turn raw complexity into <span className="text-foreground font-black underline decoration-primary/30 underline-offset-8">immediate clarity.</span>
                    </p>

                    <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-6 animation-fade-up" style={{ animationDelay: '0.3s' }}>
                        <Link href="/signup" className="group">
                            <Button size="lg" className="px-12 h-18 rounded-[1.5rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                                Deploy Now
                                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#pricing">
                            <Button variant="ghost" size="lg" className="px-10 h-18 rounded-[1.5rem] text-lg font-black uppercase tracking-widest border-2 border-border/50 bg-white/5 backdrop-blur-md group hover:bg-white/10">
                                <Play className="mr-3 w-4 h-4 fill-primary text-primary" />
                                View Plans
                            </Button>
                        </Link>
                    </div>

                    {/* Mockup Preview Area */}
                    <div className="relative w-full mt-32 lg:mt-48 animation-scale-in" style={{ animationDelay: '0.5s' }}>
                        <div className="relative mx-auto rounded-[3.5rem] border-4 border-white/20 glass p-3 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] overflow-hidden max-w-6xl group">
                            <div className="aspect-[16/9] w-full bg-[#050506] rounded-[3rem] relative overflow-hidden flex items-center justify-center border border-white/5">
                                {/* Synthetic Code Grid Background */}
                                <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-24 h-24 mb-8 rounded-[2rem] bg-gradient-to-br from-primary via-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:rotate-12 transition-transform duration-700">
                                        <Sparkles className="w-12 h-12 text-white animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black italic tracking-tight text-white/90">Analytics Engine Active</h3>
                                    <p className="text-white/40 mt-4 font-black uppercase tracking-[0.4em] text-[10px]">Processing 7.2M Data Points</p>
                                </div>

                                {/* Floating Terminal/UI Widgets */}
                                <div className="absolute bottom-12 right-12 w-64 h-40 glass border-white/10 rounded-3xl hidden md:flex items-center justify-center shadow-2xl group-hover:-translate-y-4 transition-transform duration-1000">
                                    <div className="w-full p-6 space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <div className="h-2 w-24 bg-white/10 rounded-full" />
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full" />
                                        <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                                    </div>
                                </div>
                                <div className="absolute top-24 left-12 w-56 h-32 glass border-white/10 rounded-3xl hidden md:flex items-center justify-center shadow-2xl group-hover:translate-x-4 transition-transform duration-1000">
                                    <div className="p-6 w-full space-y-4">
                                        <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30" />
                                        <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Gradients */}
                        <div className="absolute -inset-20 -z-10 bg-gradient-to-r from-primary/30 via-transparent to-accent/30 blur-[120px] opacity-40 animate-pulse-slow" />
                    </div>
                </div>
            </div>
        </section>
    );
}
