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
    <main ref={containerRef} className="min-h-screen bg-background relative selection:bg-primary selection:text-white spotlight">
      <Navbar />
      <Hero />

      {/* Trusted By Section */}
      <section className="py-24 bg-background relative border-y border-border/30 overflow-hidden">
        <div className="container px-4 mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60 mb-16 animation-fade-up">Validated by Enterprise Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-32 opacity-30 grayscale contrast-125 group hover:grayscale-0 transition-all duration-1000 animation-fade-up">
            <div className="text-3xl font-black tracking-tighter hover:text-primary transition-all cursor-default hover:scale-110">DATACORE</div>
            <div className="text-3xl font-black tracking-tighter hover:text-primary transition-all cursor-default hover:scale-110">NEBULA</div>
            <div className="text-3xl font-black tracking-tighter hover:text-primary transition-all cursor-default hover:scale-110">SYNERGY</div>
            <div className="text-3xl font-black tracking-tighter hover:text-primary transition-all cursor-default hover:scale-110">QUANTUM</div>
            <div className="text-3xl font-black tracking-tighter hover:text-primary transition-all cursor-default hover:scale-110">VERTEX</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-40 bg-[#fafafa] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_40%)]" />

        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mb-32 text-center mx-auto animation-fade-up">
            <div className="inline-flex items-center px-5 py-2 mb-10 text-[11px] font-black uppercase tracking-[0.4em] border rounded-full bg-primary/5 text-primary border-primary/20 shadow-sm">
              Core Capabilities
            </div>
            <h2 className="text-6xl font-black mb-10 lg:text-8xl tracking-tighter italic leading-[0.9] font-heading">Built for <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-12">Scale.</span> <br />Design for Clarity.</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed opacity-70">AskMyData melds high-fidelity AI with production-grade data infrastructure for the ultimate intelligence experience.</p>
          </div>

          <div id="solutions" className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-14 rounded-[3.5rem] border border-border/60 glass group hover:border-primary/40 transition-all duration-700 animation-fade-up card-shine shadow-xl shadow-black/[0.02] ${f.className}`}
                style={{ animationDelay: f.delay }}
              >
                <div className="w-20 h-20 rounded-[2.2rem] bg-white flex items-center justify-center mb-10 border border-slate-100 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 shadow-lg">
                  <f.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black italic tracking-tight mb-5 font-heading uppercase">{f.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium opacity-80">{f.description}</p>
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
