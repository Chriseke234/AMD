import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Zap, Shield, BarChart3, Users, Globe, Database } from "lucide-react";

export default function Home() {
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
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Bento Grid Features */}
      <section id="features" className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.03),transparent_40%)]" />

        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mb-20 text-center mx-auto animation-fade-up">
            <h2 className="text-3xl font-black mb-4 lg:text-5xl">Everything you need to <br /><span className="text-primary">Master your Data.</span></h2>
            <p className="text-lg text-muted-foreground">AskMyData combines powerful AI with enterprise-grade infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-10 rounded-[2rem] border border-border/50 glass group hover:border-primary/30 transition-all duration-500 animation-fade-up ${f.className}`}
                style={{ animationDelay: f.delay }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing and Footer could go here next... */}
    </main>
  );
}
