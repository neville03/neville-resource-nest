import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseSelector } from "@/components/home/CourseSelector";
import { Sparkles, Zap, Globe } from "lucide-react";
import heroImage from "@/assets/hero-background.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="relative">
        {/* Hero Image Section */}
        <div className="relative h-[600px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pt-24">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full mb-4 shadow-lg">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Your personalized library</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading">
                  <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">Your studies</span>
                  <br />
                  <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">Made Simple.</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-2xl mx-auto px-4 font-medium">
                  Access past papers, study notes, lecture slides, and recommended books 
                  all in one beautifully organized platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 -mt-8">

          {/* Course Selector */}
          <div className="flex justify-center mb-16">
            <div className="w-full max-w-2xl">
              <CourseSelector />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-soft hover-lift border border-gray-100 group">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Instant Access</h3>
              <p className="text-sm text-gray-600">
                Download resources instantly or access external links with a single click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft hover-lift border border-gray-100 group">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Community Driven</h3>
              <p className="text-sm text-gray-600">
                Suggest new resources to help your fellow students succeed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft hover-lift border border-gray-100 group sm:col-span-2 md:col-span-1">
              <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Always Updated</h3>
              <p className="text-sm text-gray-600">
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
