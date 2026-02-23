import { Button } from "./ui/Button";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)] opacity-10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />
            </div>

            <div className="container px-4 mx-auto text-center">
                <div className="inline-flex items-center px-3 py-1 mb-8 text-sm font-medium border rounded-full glass border-[var(--primary)]/20 text-[var(--primary)] animation-fade-in">
                    <span className="flex w-2 h-2 mr-2 rounded-full bg-[var(--primary)] animate-pulse" />
                    Free Advanced AI Analytics for Everyone
                </div>

                <h1 className="mb-8 text-5xl font-extrabold tracking-tight lg:text-7xl">
                    Talk to Your Data, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-foreground)]">
                        Uncover Hidden Insights
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto mb-10 text-lg text-[var(--muted-foreground)] lg:text-xl">
                    Upload datasets, query in natural language, and build stunning dashboards in seconds.
                    The power of advanced analytics, now accessible to everyone.
                </p>

                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Button size="lg" className="w-full sm:w-auto">Get Started Free</Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">View Demo</Button>
                </div>

                {/* Mockup Preview Area */}
                <div className="relative mt-20 animation-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative mx-auto rounded-3xl border border-[var(--border)] glass p-4 shadow-2xl overflow-hidden max-w-5xl group">
                        <div className="aspect-[16/9] w-full bg-[#f8fafc] dark:bg-[#0f172a] rounded-2xl flex items-center justify-center">
                            <div className="text-[var(--muted-foreground)] flex flex-col items-center">
                                <div className="w-16 h-16 mb-4 rounded-full border-2 border-dashed border-[var(--primary)]/40 flex items-center justify-center animate-spin-slow">
                                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10" />
                                </div>
                                <p className="font-medium">AI Insights Loading...</p>
                            </div>
                        </div>
                        {/* Gradient Overlay for that premium feel */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/20 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
