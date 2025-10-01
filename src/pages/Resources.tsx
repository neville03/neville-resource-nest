import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { CategoryFilter } from "@/components/resources/CategoryFilter";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Resources = () => {
  const { course, year } = useParams();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch resources when component mounts or params change
  useEffect(() => {
    fetchResources();
  }, [course, year]);

  const fetchResources = async () => {
    if (!course || !year) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('course_code', course)
        .eq('year', parseInt(year))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }

      console.log('Fetched resources:', data); // Debug log
      setResources(data || []);

      if (!data || data.length === 0) {
        toast({
          title: "No resources yet",
          description: "No resources have been uploaded for this course and year",
        });
      }
    } catch (error: any) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: any) => {
    try {
      // Increment download count
      await supabase
        .from('resources')
        .update({ download_count: (resource.download_count || 0) + 1 })
        .eq('id', resource.id);

      // Open file URL
      window.open(resource.file_url, '_blank');

      toast({
        title: "Success",
        description: "Download started!"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download resource",
        variant: "destructive"
      });
    }
  };

  // Convert category from database format to display format
  const formatCategory = (dbCategory: string) => {
    switch (dbCategory) {
      case 'past_papers':
        return 'past-papers';
      case 'notes':
        return 'notes';
      case 'slides':
        return 'slides';
      case 'book_links':
        return 'books';
      default:
        return dbCategory;
    }
  };

  // Transform database resources to match ResourceCard props
  const transformedResources = resources.map(resource => ({
    id: resource.id,
    title: resource.title,
    description: resource.description || '',
    category: formatCategory(resource.category),
    type: resource.file_type === 'external_link' || resource.category === 'book_links' ? 'link' as const : 'file' as const,
    size: resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(2)} MB` : undefined,
    url: resource.file_url,
    year: resource.year?.toString(),
    onDownload: () => handleDownload(resource),
  }));

  const filteredResources = transformedResources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const courseLabels: Record<string, string> = {
    cs: "Computer Science",
    it: "Information Systems and Technology",
    se: "Software Engineering",
    blis: "Library and Information Science"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="relative pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-heading mb-2">
              <span className="text-gray-800">{courseLabels[course || ""] || course?.toUpperCase()}</span>
              <span className="text-primary"> - Year {year}</span>
            </h1>
            <p className="text-gray-600">
              Browse and download academic resources for your course
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-xl shadow-soft mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                </div>
              </div>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          ) : (
            <>
              {/* Resources Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} {...resource} />
                ))}
              </div>

              {/* Empty State */}
              {filteredResources.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-soft">
                  <p className="text-gray-500 mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "No resources found matching your criteria."
                      : "No resources available for this course and year yet."
                    }
                  </p>
                  {resources.length === 0 && (
                    <p className="text-sm text-gray-400">
                      Check back soon or suggest resources to help your peers!
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
