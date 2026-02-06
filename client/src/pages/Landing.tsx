import { Link } from "wouter";
import { ArrowRight, BarChart3, Shield, Zap, Check } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
                FinPulse
              </span>
            </div>
            <Link href="/api/login">
              <button className="px-5 py-2 rounded-full font-medium text-sm bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-enter">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now with AI Forecasting
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-tight animate-enter" style={{ animationDelay: "100ms" }}>
            AI-Powered Financial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-indigo-600">Intelligence for SMEs</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-enter" style={{ animationDelay: "200ms" }}>
            Upload your financial documents and get instant credit scores, risk analysis, and actionable insights to grow your business.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-enter" style={{ animationDelay: "300ms" }}>
            <Link href="/api/login">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-card text-foreground border border-border shadow-sm hover:bg-muted/50 transition-all duration-300">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Analysis",
                description: "Get comprehensive financial health reports in seconds, not days."
              },
              {
                icon: Shield,
                title: "Risk Assessment",
                description: "Identify potential risks and get AI-driven recommendations to mitigate them."
              },
              {
                icon: BarChart3,
                title: "Smart Forecasting",
                description: "Predict future cash flows and plan your business growth with confidence."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2025 FinPulse Professional. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
