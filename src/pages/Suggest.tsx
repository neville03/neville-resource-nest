import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Suggest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    resourceTitle: "",
    resourceType: "",
    course: "",
    year: "",
    description: "",
    link: "",
    studentName: "",
    studentEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This would send to backend
    setTimeout(() => {
      toast({
        title: "Suggestion submitted!",
        description: "Thank you for helping improve our resource library.",
      });
      setIsSubmitting(false);
      navigate("/");
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="relative pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
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

          {/* Form Card */}
          <div className="bg-white p-8 rounded-xl shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-800">Suggest a Resource</h1>
                <p className="text-sm text-gray-600">
                  Help your fellow students by suggesting new resources
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resource Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">Resource Information</h3>
                
                <div>
                  <Label htmlFor="title" className="text-gray-700">Resource Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.resourceTitle}
                    onChange={(e) => handleInputChange("resourceTitle", e.target.value)}
                    placeholder="e.g., Data Structures Final Exam 2023"
                    className="bg-white border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-gray-700">Resource Type *</Label>
                    <Select
                      value={formData.resourceType}
                      onValueChange={(value) => handleInputChange("resourceType", value)}
                      required
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="past-paper">Past Paper</SelectItem>
                        <SelectItem value="notes">Study Notes</SelectItem>
                        <SelectItem value="slides">Lecture Slides</SelectItem>
                        <SelectItem value="book">Book Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="course" className="text-gray-700">Course *</Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) => handleInputChange("course", value)}
                      required
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="eng">Engineering</SelectItem>
                        <SelectItem value="bio">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="year" className="text-gray-700">Academic Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => handleInputChange("year", value)}
                  >
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide details about this resource..."
                    className="bg-white border-gray-200 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="link" className="text-gray-700">Resource Link (if available)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                    placeholder="https://..."
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">Your Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      placeholder="John Doe"
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.studentEmail}
                      onChange={(e) => handleInputChange("studentEmail", e.target.value)}
                      placeholder="john@university.edu"
                      className="bg-white border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-accent"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Suggest;