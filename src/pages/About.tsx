import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Target, Users, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import nevillePhoto from "@/assets/neville-photo.jpg";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="relative pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-8 hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* About Content */}
          <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-soft">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-8">
              <span className="text-gray-800">About</span>
              <span className="text-primary"> Nest</span>
            </h1>

            <div className="space-y-8">
              {/* Mission Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Nest was created to democratize access to academic resources 
                  and foster a collaborative learning environment. We believe that every 
                  student deserves easy access to quality study materials, regardless of 
                  their background or circumstances.
                </p>
              </div>

              {/* Community Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Community Driven</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  This platform thrives on the contributions of students like you. 
                  By sharing resources and suggesting new materials, you're helping 
                  build a comprehensive library that benefits everyone. Together, 
                  we're stronger.
                </p>
              </div>

              {/* Legal Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Legal & Ethical</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We are committed to respecting intellectual property rights. 
                  All external book links direct to legally available resources, 
                  and we encourage users to only share materials they have the 
                  right to distribute. Academic integrity is our priority.
                </p>
              </div>

              {/* Meet the Team Section */}
              <div className="mt-12">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Meet the Team
                  </h2>
                </div>
                
                <div className="flex justify-center">
                  <div className="group relative max-w-sm">
                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-primary/5 via-white to-accent/5 p-8 rounded-2xl shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                      {/* Decorative elements */}
                      <div className="absolute -top-2 -right-2 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                      <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all"></div>
                      
                      <div className="relative z-10 text-center">
                        {/* Photo */}
                        <div className="mb-6 relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                          <img 
                            src={nevillePhoto}
                            alt="Neville Akoragye - Founder"
                            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                        </div>
                        
                        {/* Info */}
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                          Neville Akoragye
                        </h3>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                          <span className="text-sm font-semibold text-primary">Founder & Lead Developer</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Passionate about building tools that empower students and make education more accessible for everyone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>Built with passion and</span>
                  <Heart className="w-4 h-4 text-primary" />
                  <span>by students, for students.</span>
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
