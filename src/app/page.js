"use client"

import { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Globe,
  Database,
  Sparkles,
  Cpu,
  Layers,
  Network,
  ChevronRight,
  Fingerprint
} from "lucide-react";

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      containerRef.current.style.setProperty("--mouse-x", `${clientX}px`);
      containerRef.current.style.setProperty("--mouse-y", `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      title: "Neural Engine v4",
      description: "Ask questions in plain English. Our multi-model orchestration layer translates intent into production-grade analytics instantly.",
      icon: Network,
      className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20",
      delay: "0.1s",
      badge: "State of the Art"
    },
    {
      title: "Protocol Security",
      description: "Zero-trust architecture with bank-grade encryption and end-to-end RLS integration.",
      icon: Shield,
      className: "md:col-span-1",
      delay: "0.2s"
    },
    {
      title: "Live Synthesis",
      description: "Dashboards that don't just show data, they synthesize strategy as your numbers evolve.",
      icon: BarChart3,
      className: "md:col-span-1",
      delay: "0.3s"
    },
    {
      title: "Ecosystem Sync",
      description: "Native connectors for PostgreSQL, Snowflake, BigQuery, and enterprise spreadsheet clusters.",
      icon: Database,
      className: "md:col-span-1",
      delay: "0.4s"
    },
    {
      title: "Team Governance",
      description: "Granular access controls and collaborative intelligence threads for elite teams.",
      icon: Users,
      className: "md:col-span-1",
      delay: "0.5s"
    },
    {
      title: "Global Edge",
      description: "Sub-100ms response times globally, powered by our hyper-distributed intelligence network.",
      icon: Globe,
      className: "md:col-span-1",
      delay: "0.6s"
    }
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-background relative spotlight overflow-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />

      {/* Marquee Section (replacing "Trusted By") */}
      <section className="py-24 border-y border-white/5 relative bg-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />
        <div className="container px-6 mx-auto relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mb-16 text-center animate-fade-in">
            A New Standard for Data Teams
          </p>
          <div className="relative flex overflow-x-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-20 items-center opacity-20 grayscale hover:grayscale-0 transition-all duration-1000">
              {['DATACORE', 'NEBULA OS', 'SYNERGY AI', 'QUANTUM FLUX', 'VERTEX ENGINE', 'PHASE ZERO', 'AXON SYSTEMS'].map((name) => (
                <div key={name} className="text-3xl sm:text-5xl font-black tracking-tighter hover:text-primary transition-all cursor-default hover:scale-110 px-4">{name}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 sm:py-56 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(124,58,237,0.05),transparent_50%)]" />

        <div className="container px-6 mx-auto relative z-10">
          <div className="max-w-4xl mb-24 sm:mb-40 text-center mx-auto animate-fade-in">
            <div className="inline-flex items-center px-5 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 glass-premium text-primary rounded-full">
              <Cpu className="w-4 h-4 mr-2" />
              Intelligence Core
            </div>
            <h2 className="text-5xl sm:text-8xl font-black mb-10 tracking-tighter leading-[0.9]">
              Built for <span className="text-primary">Scale.</span> <br />Design for <span className="relative inline-block">Clarity.<div className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 -rotate-2" /></span>
            </h2>
            <p className="text-lg sm:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto opacity-60 leading-relaxed">
              Powerful analytics meets production infrastructure.
            </p>
          </div>

          <div id="solutions" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-10 sm:p-14 rounded-[3.5rem] border border-white/10 glass-premium group hover:border-primary/40 transition-all duration-700 animate-fade-in flex flex-col justify-between ${f.className}`}
                style={{ animationDelay: f.delay }}
              >
                <div>
                  {f.badge && (
                    <span className="inline-block px-3 py-1 mb-6 text-[8px] font-black uppercase tracking-[0.2em] bg-primary text-white rounded-full">{f.badge}</span>
                  )}
                  <div className="w-20 h-20 rounded-[2.2rem] bg-secondary flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_20px_40px_rgba(124,58,237,0.3)] transition-all duration-700 shadow-2xl">
                    <f.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-6 uppercase text-foreground leading-none">{f.title}</h3>
                  <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity duration-500">{f.description}</p>
                </div>
                <div className="mt-12 flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-700">
                  <span>Explore Features</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Protocol Section (New) */}
      <section id="protocol" className="py-32 sm:py-56 bg-secondary/40 relative border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="container px-6 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 animate-fade-in">
              <div className="inline-flex items-center px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 glass-premium text-purple-400 rounded-full">
                <Fingerprint className="w-4 h-4 mr-2" />
                The Protocol
              </div>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9]">
                Advanced <br /> <span className="text-white">Encryption Layer.</span>
              </h2>
              <div className="space-y-8 max-w-xl">
                <div className="flex gap-6">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Zero Knowledge Base</h4>
                    <p className="text-muted-foreground leading-relaxed font-medium opacity-70">Your data source remains isolated. We only process intelligence, never store records.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Layers className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Neural Orchestration</h4>
                    <p className="text-muted-foreground leading-relaxed font-medium opacity-70">Dynamic routing across specialized LLM clusters ensures the highest reasoning fidelity.</p>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <button className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10">
                  Read Whitepaper
                </button>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="aspect-square glass-premium rounded-[4rem] border-white/5 p-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-[3s]" />
                <div className="relative h-full flex items-center justify-center border border-white/10 rounded-[3.8rem] overflow-hidden">
                  <div className="text-center space-y-6">
                    <Network className="w-32 h-32 text-white/10 mx-auto animate-pulse" />
                    <div className="text-white/20 font-black uppercase tracking-[1em] text-[10px]">Neural Matrix v4.1</div>
                  </div>
                </div>
              </div>
              {/* Floating HUD */}
              <div className="absolute -top-10 -right-10 glass-premium rounded-3xl p-6 border-white/20 shadow-2xl z-20 animate-float">
                <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-primary">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Real-time Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
