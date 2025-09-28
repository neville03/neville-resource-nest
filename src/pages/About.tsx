import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingShapes } from "@/components/home/FloatingShapes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Target, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <FloatingShapes />
      <Header />
      
      <main className="relative pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-8 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* About Content */}
          <div className="glass-card p-8 md:p-12 rounded-2xl border border-white/20">
            <h1 className="text-4xl font-bold mb-8">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                About ResourceHub
              </span>
            </h1>

            <div className="space-y-8">
              {/* Mission Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  ResourceHub was created to democratize access to academic resources 
                  and foster a collaborative learning environment. We believe that every 
                  student deserves easy access to quality study materials, regardless of 
                  their background or circumstances.
                </p>
              </div>

              {/* Community Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Community Driven</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  This platform thrives on the contributions of students like you. 
                  By sharing resources and suggesting new materials, you're helping 
                  build a comprehensive library that benefits everyone. Together, 
                  we're stronger.
                </p>
              </div>

              {/* Legal Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold">Legal & Ethical</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to respecting intellectual property rights. 
                  All external book links direct to legally available resources, 
                  and we encourage users to only share materials they have the 
                  right to distribute. Academic integrity is our priority.
                </p>
              </div>

              {/* Creator Section */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>Built with passion and</span>
                  <Heart className="w-4 h-4 text-primary animate-pulse-glow" />
                  <span>by students, for students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;