import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Features Grid Placeholder */}
      <section id="features" className="py-24 bg-[var(--muted)]">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Natural Language Queries",
                description: "Ask questions in plain English and get instant answers from your datasets."
              },
              {
                title: "Advanced Analytics",
                description: "Regression, forecasting, and anomaly detection at your fingertips for free."
              },
              {
                title: "Team Collaboration",
                description: "Share dashboards and insights with your team members in real-time."
              }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white border rounded-2xl border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                <h3 className="mb-4 text-xl font-bold">{f.title}</h3>
                <p className="text-[var(--muted-foreground)]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
