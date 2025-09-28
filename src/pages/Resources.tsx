import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { CategoryFilter } from "@/components/resources/CategoryFilter";
import { FloatingShapes } from "@/components/home/FloatingShapes";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data - would be fetched from backend
const mockResources = [
  {
    id: "1",
    title: "Data Structures Final Exam 2023",
    description: "Complete past paper with solutions",
    category: "past-papers" as const,
    type: "file" as const,
    size: "2.4 MB",
    year: "2023",
    semester: "Fall",
  },
  {
    id: "2",
    title: "Algorithm Design Notes",
    description: "Comprehensive study notes covering all topics",
    category: "notes" as const,
    type: "file" as const,
    size: "5.1 MB",
  },
  {
    id: "3",
    title: "Introduction to Algorithms - MIT",
    description: "Free online textbook",
    category: "books" as const,
    type: "link" as const,
    url: "https://mitpress.mit.edu/books/introduction-algorithms",
  },
  {
    id: "4",
    title: "Week 1-4 Lecture Slides",
    description: "Professor's presentation slides",
    category: "slides" as const,
    type: "file" as const,
    size: "12.3 MB",
  },
];

const Resources = () => {
  const { course, year } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = mockResources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const courseLabels: Record<string, string> = {
    cs: "Computer Science",
    math: "Mathematics",
    physics: "Physics",
    eng: "Engineering",
    bio: "Biology",
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <FloatingShapes />
      <Header />
      
      <main className="relative pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {courseLabels[course || ""] || "Course"} - Year {year}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Browse and download academic resources for your course
            </p>
          </div>

          {/* Filters and Search */}
          <div className="glass-card p-6 rounded-xl border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50 border-white/20"
                  />
                </div>
              </div>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;