"use client"

import { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { Zap, Shield, BarChart3, Users, Globe, Database, Sparkles } from "lucide-react";

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
      title: "Natural Language AI",
      description: "Ask questions in plain English and get instant SQL results with stunning visualizations.",
      icon: Zap,
      className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/5 to-primary/10",
      delay: "0.1s"
    },
    {
      title: "Bank-Grade Security",
      description: "Your data stays private with enterprise-level encryption and RLS policies.",
      icon: Shield,
      className: "md:col-span-1",
      delay: "0.2s"
    },
    {
      title: "Real-time Dashboards",
      description: "Build interactive dashboards that update as your data changes.",
      icon: BarChart3,
      className: "md:col-span-1",
      delay: "0.3s"
    },
    {
      title: "Team Collaboration",
      description: "Share insights and collaborate with your entire team effortlessly.",
      icon: Users,
      className: "md:col-span-1",
      delay: "0.4s"
    },
    {
      title: "Global Scalability",
      description: "Powered by Supabase for high availability and low latency globally.",
      icon: Globe,
      className: "md:col-span-1",
      delay: "0.5s"
    },
    {
      title: "Flexible Datasets",
      description: "Upload CSV, Excel, or connect directly to your SQL databases.",
      icon: Database,
      className: "md:col-span-1",
      delay: "0.6s"
    }
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-background relative spotlight overflow-hidden">
      <Navbar />
      <Hero />

      {/* Trusted By Section */}
      <section className="py-20 border-y border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <div className="container px-6 mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60 mb-12 animate-fade-in">Validated by Enterprise Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-30 grayscale group hover:grayscale-0 transition-all duration-1000 animate-fade-in">
            {['DATACORE', 'NEBULA', 'SYNERGY', 'QUANTUM', 'VERTEX'].map((name) => (
              <div key={name} className="text-2xl sm:text-3xl font-black tracking-tighter hover:text-primary transition-all cursor-default hover:scale-105">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 sm:py-40 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_40%)] opacity-[0.05]" />

        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mb-20 sm:mb-32 text-center mx-auto animate-fade-in">
            <div className="inline-flex items-center px-5 py-2 mb-8 text-[11px] font-black uppercase tracking-[0.4em] border rounded-full bg-primary/5 text-primary border-primary/20 shadow-sm">
              Engine Core
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-10 tracking-tighter italic leading-tight">Built for <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Scale.</span> <br />Design for Clarity.</h2>
            <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto opacity-70">AskMyData melds high-fidelity AI with production-grade infrastructure for the ultimate intelligence experience.</p>
          </div>

          <div id="solutions" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-7xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border border-border glass-premium group hover:border-primary/40 transition-all duration-500 animate-fade-in ${f.className}`}
                style={{ animationDelay: f.delay }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2.2rem] bg-card flex items-center justify-center mb-8 border border-border group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 shadow-lg">
                  <f.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-4 uppercase">{f.title}</h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium opacity-80">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />
      <Footer />
    </main>
  );
}
