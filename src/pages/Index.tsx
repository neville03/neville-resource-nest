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
        <div className="relative h-[500px] sm:h-[600px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pt-16 sm:pt-24">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center space-y-4 sm:space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">Your personalized library</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-heading px-4">
                  <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">Your studies</span>
                  <br />
                  <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">Made Simple.</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-2xl mx-auto px-4 font-medium">
                  Access past papers, study notes, lecture slides, and recommended books 
                  all in one beautifully organized platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Selector Section */}
        <div className="bg-white py-12 sm:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <CourseSelector />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft hover-lift border border-gray-100 group">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg w-fit mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2">Instant Access</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Download resources instantly or access external links with a single click.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft hover-lift border border-gray-100 group">
              <div className="p-2 sm:p-3 bg-accent/10 rounded-lg w-fit mb-3 sm:mb-4 group-hover:bg-accent/20 transition-colors">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2">Community Driven</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Suggest new resources to help your fellow students succeed.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft hover-lift border border-gray-100 group sm:col-span-2 md:col-span-1">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg w-fit mb-3 sm:mb-4 group-hover:bg-blue-100 transition-colors">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2">Always Updated</h3>
              <p className="text-xs sm:text-sm text-gray-600">
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
