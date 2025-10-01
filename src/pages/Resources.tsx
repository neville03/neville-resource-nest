import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { CategoryFilter } from "@/components/resources/CategoryFilter";
import { ArrowLeft, Search } from "lucide-react";
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
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [course, year]);

  const fetchResources = async () => {
    if (!course || !year) return;
    
    try {
      setLoading(true);
      
      // Fetch resources for this course and year
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('course_code', course)
        .eq('year', parseInt(year))
        .order('created_at', { ascending: false });

      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
        toast({
          title: "Error",
          description: "Failed to load resources",
          variant: "destructive"
        });
      }

      // Fetch course info
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('code', course)
        .single();

      if (resourcesData) setResources(resourcesData);
      if (courseData) setCourseInfo(courseData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: any) => {
    try {
      // Track download
      const { error } = await supabase
        .from('resources')
        .update({ download_count: (resource.download_count || 0) + 1 })
        .eq('id', resource.id);

      if (error) {
        console.error('Error tracking download:', error);
      }

      // Track analytics
      await supabase
        .from('resource_analytics')
        .insert({
          resource_id: resource.id,
          event_type: 'download'
        });

      // Open file or link
      if (resource.file_url) {
        window.open(resource.file_url, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const categoryMap: Record<string, string> = {
      'past_papers': 'past-papers',
      'notes': 'notes',
      'slides': 'slides',
      'book_links': 'books'
    };
    
    const resourceCategory = categoryMap[resource.category] || resource.category;
    const matchesCategory = selectedCategory === "all" || resourceCategory === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <span className="text-gray-800">{courseInfo?.name || course?.toUpperCase()}</span>
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

          {/* Resources Grid */}
          {loading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-soft">
              <p className="text-gray-500">Loading resources...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => {
                  const categoryMap: Record<string, string> = {
                    'past_papers': 'past-papers',
                    'notes': 'notes',
                    'slides': 'slides',
                    'book_links': 'books'
                  };
                  
                  return (
                    <ResourceCard 
                      key={resource.id} 
                      id={resource.id}
                      title={resource.title}
                      description={resource.description}
                      category={categoryMap[resource.category] || resource.category}
                      type={resource.file_type === 'external_link' ? 'link' : 'file'}
                      size={resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(1)} MB` : undefined}
                      url={resource.file_url}
                      year={resource.year?.toString()}
                      onDownload={() => handleDownload(resource)}
                    />
                  );
                })}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-soft">
                  <p className="text-gray-500">No resources found matching your criteria.</p>
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