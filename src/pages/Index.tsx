import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseSelector } from "@/components/home/CourseSelector";
import { FloatingShapes } from "@/components/home/FloatingShapes";
import { Sparkles, Zap, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <FloatingShapes />
      <Header />
      
      <main className="relative pt-24 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-primary/30 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Academic Success Hub</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Academic Resources
              </span>
              <br />
              <span className="text-foreground">Made Simple</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access past papers, study notes, lecture slides, and recommended books 
              all in one beautifully organized platform.
            </p>
          </div>

          {/* Course Selector */}
          <div className="flex justify-center mb-16">
            <CourseSelector />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Access</h3>
              <p className="text-sm text-muted-foreground">
                Download resources instantly or access external links with a single click.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-secondary/30 transition-all duration-300 group">
              <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-4 group-hover:bg-secondary/20 transition-colors">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Suggest new resources to help your fellow students succeed.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-accent/30 transition-all duration-300 group">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Always Updated</h3>
              <p className="text-sm text-muted-foreground">
                Fresh resources added regularly to keep you ahead of the curve.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;