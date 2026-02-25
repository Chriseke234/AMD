import Link from "next/link";
import { Button } from "./ui/Button";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-24 pb-32 overflow-hidden lg:pt-40 lg:pb-56">
            {/* Immersive Background Elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(124,58,237,0.08)_0%,transparent_100%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animation-pulse-slow" />
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full animation-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container relative px-4 mx-auto">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-1.5 mb-10 text-sm font-semibold border rounded-full glass border-primary/20 text-primary animation-fade-up">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Next-Gen Data Intelligence for Teams
                    </div>

                    <h1 className="mb-8 text-6xl font-black tracking-tight lg:text-8xl animation-fade-up leading-[1.1]" style={{ animationDelay: '0.1s' }}>
                        Your Data, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">
                            Speaks Volumes
                        </span>
                    </h1>

                    <p className="mb-12 text-lg text-muted-foreground lg:text-xl max-w-2xl animation-fade-up text-balance" style={{ animationDelay: '0.2s' }}>
                        The most intuitive AI-powered interface to analyze, visualize, and collaborate.
                        Transform complex datasets into beautiful insights in seconds.
                    </p>

                    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 animation-fade-up" style={{ animationDelay: '0.3s' }}>
                        <Link href="/signup" className="group relative">
                            <Button size="lg" className="px-8 h-14 rounded-full text-base font-semibold shadow-xl shadow-primary/20">
                                Get Started Free
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="ghost" size="lg" className="px-8 h-14 rounded-full text-base font-semibold border border-border/50 bg-white/5 backdrop-blur-sm group">
                                <Play className="mr-2 w-4 h-4 fill-primary text-primary" />
                                Watch Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Mockup Preview Area */}
                    <div className="relative w-full mt-24 lg:mt-32 animation-scale-in" style={{ animationDelay: '0.5s' }}>
                        <div className="relative mx-auto rounded-[2rem] border border-white/20 glass p-2 shadow-2xl overflow-hidden max-w-5xl">
                            <div className="aspect-[16/10] w-full bg-[#0a0a0b] rounded-[1.8rem] relative overflow-hidden flex items-center justify-center">
                                {/* Dashboard Mockup UI Elements */}
                                <div className="absolute top-0 left-0 w-full h-12 border-b border-white/5 bg-white/5 flex items-center px-6 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>

                                <div className="text-white/40 flex flex-col items-center">
                                    <div className="w-20 h-20 mb-6 rounded-3xl border border-white/10 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                                        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                                    </div>
                                    <p className="font-medium tracking-wide">Initializing AI Data Engine...</p>
                                </div>

                                {/* Floating UI Widgets */}
                                <div className="absolute bottom-10 right-10 w-48 h-32 glass border-white/10 rounded-2xl hidden md:block" />
                                <div className="absolute top-20 left-10 w-40 h-24 glass border-white/10 rounded-2xl hidden md:block" />
                            </div>
                        </div>

                        {/* Interactive Gradients */}
                        <div className="absolute -inset-10 -z-10 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
        </section>
    );
}
