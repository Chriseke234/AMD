import Link from "next/link";
import { Button } from "./ui/Button";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-32 overflow-hidden lg:pt-48 lg:pb-64">
            {/* Immersive Background Elements */}
            <div className="absolute inset-0 -z-10 bg-[#fafafa]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full animation-pulse-slow animate-mesh" />
                <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-accent/10 blur-[130px] rounded-full animation-pulse-slow animate-mesh" style={{ animationDelay: '4s' }} />
            </div>

            <div className="container relative px-4 mx-auto">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-12 text-[10px] font-black uppercase tracking-[0.4em] border rounded-full glass border-primary/20 text-primary animation-fade-up shadow-[0_0_30px_rgba(124,58,237,0.15)] bg-white/40">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Next-Gen Intelligence
                    </div>

                    <h1 className="mb-12 text-7xl font-black tracking-tighter lg:text-[8.5rem] animation-fade-up leading-[0.85] text-balance font-heading">
                        Your Data, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-600 to-indigo-600 italic px-4 select-none">
                            Speaks.
                        </span>
                    </h1>

                    <p className="mb-16 text-xl text-muted-foreground lg:text-2xl font-medium max-w-3xl animation-fade-up text-balance leading-relaxed opacity-80" style={{ animationDelay: '0.2s' }}>
                        The most intuitive AI interface to analyze, visualize, and scale your business logic.
                        Turn raw complexity into <span className="text-foreground font-black underline decoration-primary/40 underline-offset-[12px] decoration-4">immediate clarity.</span>
                    </p>

                    <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 animation-fade-up" style={{ animationDelay: '0.3s' }}>
                        <Link href="/signup" className="group">
                            <Button size="lg" className="px-14 h-20 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all bg-primary hover:bg-primary-hover border-none">
                                Deploy Now
                                <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-3 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#pricing">
                            <Button variant="outline" size="lg" className="px-12 h-20 rounded-[2rem] text-xl font-black uppercase tracking-widest border-2 border-border/60 bg-white/20 backdrop-blur-xl group hover:bg-white/40 shadow-xl shadow-black/5">
                                <Play className="mr-4 w-5 h-5 fill-primary text-primary" />
                                View Plans
                            </Button>
                        </Link>
                    </div>

                    {/* Mockup Preview Area */}
                    <div className="relative w-full mt-40 lg:mt-56 animation-scale-in" style={{ animationDelay: '0.5s' }}>
                        <div className="relative mx-auto rounded-[4rem] border-[6px] border-white/50 glass p-4 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.4)] overflow-hidden max-w-[1100px] group">
                            <div className="aspect-[16/10] w-full bg-[#050506] rounded-[3.2rem] relative overflow-hidden flex items-center justify-center border border-white/10">
                                {/* Synthetic Code Grid Background */}
                                <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

                                <div className="relative z-10 flex flex-col items-center group-hover:scale-110 transition-transform duration-1000">
                                    <div className="w-28 h-28 mb-10 rounded-[2.5rem] bg-gradient-to-br from-primary via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-primary/50 group-hover:rotate-6 transition-transform duration-700">
                                        <Sparkles className="w-14 h-14 text-white animate-pulse" />
                                    </div>
                                    <h3 className="text-4xl font-black italic tracking-tight text-white/95">Analytics Engine Active</h3>
                                    <div className="flex items-center space-x-3 mt-6">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                        <p className="text-white/50 font-black uppercase tracking-[0.5em] text-[11px]">Processing 18.4M Nodes</p>
                                    </div>
                                </div>

                                {/* Floating Terminal/UI Widgets */}
                                <div className="absolute bottom-16 right-16 w-80 h-48 glass border-white/20 rounded-[2.5rem] hidden md:flex items-center justify-center shadow-2xl group-hover:-translate-y-8 group-hover:-rotate-2 transition-all duration-1000">
                                    <div className="w-full p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="h-3 w-32 bg-white/20 rounded-full" />
                                            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-1.5 w-full bg-white/10 rounded-full" />
                                            <div className="h-1.5 w-full bg-white/10 rounded-full" />
                                            <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-28 left-16 w-72 h-40 glass border-white/20 rounded-[2.5rem] hidden md:flex items-center justify-center shadow-2xl group-hover:translate-x-6 group-hover:rotate-2 transition-all duration-1000">
                                    <div className="p-8 w-full space-y-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-md bg-accent/40" />
                                            <div className="h-2 w-24 bg-white/20 rounded-full" />
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div className="flex space-x-1">
                                                {[1, 2, 3, 4].map(i => <div key={i} className="w-6 bg-primary/20 rounded-t-sm" style={{ height: `${i * 10}px` }} />)}
                                            </div>
                                            <div className="h-2 w-16 bg-white/10 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Gradients */}
                        <div className="absolute -inset-40 -z-10 bg-gradient-to-r from-primary/40 via-transparent to-accent/40 blur-[130px] opacity-50 animate-pulse-slow" />
                    </div>
                </div>
            </div>
        </section>
    );
}
