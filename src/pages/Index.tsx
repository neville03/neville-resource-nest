import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseSelector } from "@/components/home/CourseSelector";
import { Sparkles, Zap, Globe } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";

const Index = () => {
  const heroImages = [hero1, hero2, hero3, hero4];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Carousel Background */}
        <div className="relative h-[600px] overflow-hidden">
          {/* Background Carousel */}
          <Carousel
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="absolute inset-0 -z-10"
          >
            <CarouselContent>
              {heroImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[600px] w-full">
                    <img
                      src={image}
                      alt={`Academic success ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto max-w-6xl px-4 h-full flex flex-col justify-center">
            <div className="max-w-3xl space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Your Academic Success Hub</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading text-white leading-tight">
                Go from 20% to 90% prepared — in minutes.
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 font-medium">
                Smart revision. Instant results.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-16">
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