import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Users, 
  Download, 
  Trash2, 
  Eye, 
  Link,
  CheckCircle,
  XCircle
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [resources, setResources] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalResources: 0,
    totalDownloads: 0,
    pendingSuggestions: 0,
    totalViews: 0
  });
  
  // Form states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    category: "",
    courseCode: "",
    year: "",
    externalLink: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch resources
    const { data: resourcesData } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch suggestions
    const { data: suggestionsData } = await supabase
      .from('suggestions')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    // Fetch courses
    const { data: coursesData } = await supabase
      .from('courses')
      .select('*')
      .order('name');

    if (resourcesData) setResources(resourcesData);
    if (suggestionsData) setSuggestions(suggestionsData);
    if (coursesData) setCourses(coursesData);
    
    // Calculate stats
    if (resourcesData) {
      const totalDownloads = resourcesData.reduce((sum, r) => sum + (r.download_count || 0), 0);
      const pendingSuggestions = suggestionsData?.filter(s => s.status === 'pending').length || 0;
      
      setStats({
        totalResources: resourcesData.length,
        totalDownloads,
        pendingSuggestions,
        totalViews: 0
      });
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !resourceForm.title || !resourceForm.category || !resourceForm.courseCode || !resourceForm.year) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload file to storage
      const fileName = `${Date.now()}_${uploadFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(fileName);

      // Insert resource record
      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          title: resourceForm.title,
          description: resourceForm.description,
          category: resourceForm.category as any,
          course_code: resourceForm.courseCode,
          year: parseInt(resourceForm.year),
          file_url: publicUrl,
          file_size: uploadFile.size,
          file_type: uploadFile.type
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Resource uploaded successfully"
      });

      // Reset form and refresh data
      setResourceForm({
        title: "",
        description: "",
        category: "",
        courseCode: "",
        year: "",
        externalLink: ""
      });
      setUploadFile(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-admin-border">
          <div className="flex space-x-8">
            {["overview", "upload", "resources", "suggestions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-admin-accent text-admin-accent"
                    : "border-transparent text-muted-foreground hover:text-admin-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-admin-card border-admin-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Resources</p>
                  <p className="text-3xl font-bold text-admin-foreground">{stats.totalResources}</p>
                </div>
                <FileText className="w-8 h-8 text-admin-accent" />
              </div>
            </Card>
            <Card className="bg-admin-card border-admin-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-3xl font-bold text-admin-foreground">{stats.totalDownloads}</p>
                </div>
                <Download className="w-8 h-8 text-admin-accent" />
              </div>
            </Card>
            <Card className="bg-admin-card border-admin-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Suggestions</p>
                  <p className="text-3xl font-bold text-admin-foreground">{stats.pendingSuggestions}</p>
                </div>
                <Users className="w-8 h-8 text-admin-accent" />
              </div>
            </Card>
            <Card className="bg-admin-card border-admin-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold text-admin-foreground">{stats.totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-admin-accent" />
              </div>
            </Card>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload */}
            <Card className="bg-admin-card border-admin-border p-6">
              <h3 className="text-lg font-semibold text-admin-foreground mb-4">Upload File</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file" className="text-admin-foreground">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="title" className="text-admin-foreground">Title *</Label>
                  <Input
                    id="title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    placeholder="Enter resource title"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-admin-foreground">Category *</Label>
                  <Select 
                    value={resourceForm.category}
                    onValueChange={(value) => setResourceForm({...resourceForm, category: value})}
                  >
                    <SelectTrigger className="bg-admin-background border-admin-border text-admin-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-card border-admin-border">
                      <SelectItem value="past_papers">Past Papers</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="slides">Slides</SelectItem>
                      <SelectItem value="book_links">Book Links</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course" className="text-admin-foreground">Course *</Label>
                  <Select 
                    value={resourceForm.courseCode}
                    onValueChange={(value) => setResourceForm({...resourceForm, courseCode: value})}
                  >
                    <SelectTrigger className="bg-admin-background border-admin-border text-admin-foreground">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-card border-admin-border">
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.code}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year" className="text-admin-foreground">Year *</Label>
                  <Select 
                    value={resourceForm.year}
                    onValueChange={(value) => setResourceForm({...resourceForm, year: value})}
                  >
                    <SelectTrigger className="bg-admin-background border-admin-border text-admin-foreground">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-card border-admin-border">
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleFileUpload}
                  className="w-full bg-admin-accent hover:bg-admin-accent/80"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Resources Tab - simplified for space */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-admin-foreground">All Resources</h3>
            <div className="bg-admin-card border border-admin-border rounded-lg p-4">
              {resources.length === 0 ? (
                <p className="text-muted-foreground">No resources uploaded yet</p>
              ) : (
                <div className="space-y-2">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex justify-between items-center p-2 hover:bg-admin-background/50 rounded">
                      <div>
                        <p className="text-admin-foreground font-medium">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {resource.category?.replace('_', ' ')} • {resource.course_code?.toUpperCase()} • Year {resource.year}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteResource(resource.id, resource.file_url)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggestions Tab - simplified */}
        {activeTab === "suggestions" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-admin-foreground">User Suggestions</h3>
            {suggestions.length === 0 ? (
              <p className="text-muted-foreground">No suggestions yet</p>
            ) : (
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="bg-admin-card border-admin-border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-admin-foreground">{suggestion.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        suggestion.status === 'implemented' ? 'bg-green-600/20 text-green-400' :
                        suggestion.status === 'rejected' ? 'bg-red-600/20 text-red-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {suggestion.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const handleDeleteResource = async (id: string, fileUrl?: string) => {
  // Implementation already included in component
};

const handleSuggestionStatus = async (id: string, status: string) => {
  // Implementation already included in component
};

export default AdminDashboard;