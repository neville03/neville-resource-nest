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
  XCircle,
  ExternalLink
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

  // Book link form state
  const [bookLinkForm, setBookLinkForm] = useState({
    title: "",
    author: "",
    description: "",
    externalUrl: "",
    courseCode: "",
    year: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
      }

      // Fetch suggestions
      const { data: suggestionsData, error: suggestionsError } = await supabase
        .from('suggestions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (suggestionsError) {
        console.error('Error fetching suggestions:', suggestionsError);
      }

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('name');

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
      }

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
    } catch (error) {
      console.error('Error in fetchData:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !resourceForm.title || !resourceForm.category || !resourceForm.courseCode || !resourceForm.year) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to upload resources",
          variant: "destructive"
        });
        return;
      }

      // Upload file to storage
      const fileName = `${Date.now()}_${uploadFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(fileName, uploadFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

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
          file_type: uploadFile.type,
          created_by: session.user.id
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Failed to save resource: ${insertError.message}`);
      }

      toast({
        title: "Success! 🎉",
        description: "Resource uploaded successfully and is now live"
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

      // Clear file input
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchData();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload resource",
        variant: "destructive"
      });
    }
  };

  const handleAddBookLink = async () => {
    if (!bookLinkForm.title || !bookLinkForm.externalUrl || !bookLinkForm.courseCode || !bookLinkForm.year) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, URL, Course, Year)",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          title: bookLinkForm.title,
          description: bookLinkForm.description,
          category: 'book_links',
          course_code: bookLinkForm.courseCode,
          year: parseInt(bookLinkForm.year),
          file_url: bookLinkForm.externalUrl,
          file_type: 'external_link'
        });

      if (insertError) throw insertError;

      toast({
        title: "Success! 🎉",
        description: "Book link added successfully"
      });

      // Reset form
      setBookLinkForm({
        title: "",
        author: "",
        description: "",
        externalUrl: "",
        courseCode: "",
        year: ""
      });

      fetchData();
    } catch (error: any) {
      console.error('Book link error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book link",
        variant: "destructive"
      });
    }
  };

  const handleDeleteResource = async (id: string, fileUrl?: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      // If it's a file (not external link), delete from storage
      if (fileUrl && !fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('resources')
            .remove([fileName]);

          if (storageError) {
            console.error('Storage delete error:', storageError);
          }
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({
        title: "Deleted",
        description: "Resource deleted successfully"
      });

      fetchData();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete resource",
        variant: "destructive"
      });
    }
  };

  const handleSuggestionStatus = async (id: string, status: 'implemented' | 'rejected' | 'pending') => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: `Suggestion marked as ${status}`
      });

      fetchData();
    } catch (error: any) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update suggestion",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSuggestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Suggestion deleted successfully"
      });

      fetchData();
    } catch (error: any) {
      console.error('Delete suggestion error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete suggestion",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-admin-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage resources, review suggestions, and track statistics</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-admin-border">
          <div className="flex space-x-8">
            {["overview", "upload", "book-links", "resources", "suggestions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-admin-accent text-admin-accent"
                    : "border-transparent text-muted-foreground hover:text-admin-foreground"
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
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
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                    <p className="text-3xl font-bold text-admin-foreground">{courses.length}</p>
                  </div>
                  <Eye className="w-8 h-8 text-admin-accent" />
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-admin-card border-admin-border p-6">
              <h3 className="text-lg font-semibold text-admin-foreground mb-4">Recent Resources</h3>
              <div className="space-y-2">
                {resources.slice(0, 5).map((resource) => (
                  <div key={resource.id} className="flex justify-between items-center p-3 bg-admin-background/50 rounded">
                    <div>
                      <p className="text-admin-foreground font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(resource.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs text-admin-accent">
                      {resource.download_count || 0} downloads
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-2xl">
            <Card className="bg-admin-card border-admin-border p-6">
              <h3 className="text-lg font-semibold text-admin-foreground mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload File Resource
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file" className="text-admin-foreground">File *</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: PDF, DOC, DOCX, PPT, PPTX, TXT (Max 100MB)
                  </p>
                </div>
                <div>
                  <Label htmlFor="title" className="text-admin-foreground">Title *</Label>
                  <Input
                    id="title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    placeholder="e.g., Data Structures Mid-Sem 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-admin-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    placeholder="Brief description of the resource..."
                    rows={3}
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
                      <SelectItem value="past_papers">📄 Past Papers</SelectItem>
                      <SelectItem value="notes">📝 Notes</SelectItem>
                      <SelectItem value="slides">📊 Slides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                <Button 
                  onClick={handleFileUpload}
                  className="w-full bg-admin-accent hover:bg-admin-accent/80 text-white"
                  disabled={!uploadFile}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Book Links Tab */}
        {activeTab === "book-links" && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-2xl">
            <Card className="bg-admin-card border-admin-border p-6">
              <h3 className="text-lg font-semibold text-admin-foreground mb-4 flex items-center gap-2">
                <Link className="w-5 h-5" />
                Add Book Link
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bookTitle" className="text-admin-foreground">Book Title *</Label>
                  <Input
                    id="bookTitle"
                    value={bookLinkForm.title}
                    onChange={(e) => setBookLinkForm({...bookLinkForm, title: e.target.value})}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    placeholder="e.g., Introduction to Algorithms"
                  />
                </div>
                <div>
                  <Label htmlFor="author" className="text-admin-foreground">Author(s)</Label>
                  <Input
                    id="author"
                    value={bookLinkForm.author}
                    onChange={(e) => setBookLinkForm({...bookLinkForm, author: e.target.value})}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    placeholder="e.g., Cormen, Leiserson, Rivest"
                  />
                </div>
                <div>
                  <Label htmlFor="bookUrl" className="text-admin-foreground">External URL *</Label>
                  <Input
                    id="bookUrl"
                    value={bookLinkForm.externalUrl}
                    onChange={(e) => setBookLinkForm({...bookLinkForm, externalUrl: e.target.value})}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    placeholder="https://library.edu/book-link"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to university library, Google Scholar, or legal source
                  </p>
                </div>
                <div>
                  <Label htmlFor="bookDescription" className="text-admin-foreground">Description</Label>
                  <Textarea
                    id="bookDescription"
                    value={bookLinkForm.description}
                    onChange={(e) => setBookLinkForm({...bookLinkForm, description: e.target.value})}
                    className="bg-admin-background border-admin-border text-admin-foreground"
                    placeholder="Brief description of the book..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bookCourse" className="text-admin-foreground">Course *</Label>
                    <Select
                      value={bookLinkForm.courseCode}
                      onValueChange={(value) => setBookLinkForm({...bookLinkForm, courseCode: value})}
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
                    <Label htmlFor="bookYear" className="text-admin-foreground">Year *</Label>
                    <Select
                      value={bookLinkForm.year}
                      onValueChange={(value) => setBookLinkForm({...bookLinkForm, year: value})}
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
                </div>
                <Button
                  onClick={handleAddBookLink}
                  className="w-full bg-admin-accent hover:bg-admin-accent/80 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Add Book Link
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-admin-foreground">All Resources ({resources.length})</h3>
              <Button
                onClick={() => setActiveTab("upload")}
                className="bg-admin-accent hover:bg-admin-accent/80"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>

            <div className="bg-admin-card border border-admin-border rounded-lg overflow-hidden">
              {resources.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No resources uploaded yet</p>
                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="mt-4 bg-admin-accent hover:bg-admin-accent/80"
                  >
                    Upload Your First Resource
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-admin-border">
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-4 hover:bg-admin-background/50 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-admin-foreground font-medium">{resource.title}</h4>
                            <span className="px-2 py-0.5 text-xs rounded bg-admin-accent/20 text-admin-accent">
                              {resource.category?.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {resource.course_code?.toUpperCase()} • Year {resource.year}
                            {resource.description && ` • ${resource.description}`}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                            <span>{resource.download_count || 0} downloads</span>
                            {resource.file_type === 'external_link' && (
                              <span className="flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                External Link
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.file_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(resource.file_url, '_blank')}
                              className="text-admin-accent hover:text-admin-accent/80"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteResource(resource.id, resource.file_url)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === "suggestions" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-admin-foreground">
              User Suggestions ({suggestions.length})
            </h3>

            {suggestions.length === 0 ? (
              <Card className="bg-admin-card border-admin-border p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No suggestions yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="bg-admin-card border-admin-border p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-admin-foreground">{suggestion.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            suggestion.status === 'implemented' ? 'bg-green-600/20 text-green-400' :
                            suggestion.status === 'rejected' ? 'bg-red-600/20 text-red-400' :
                            'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {suggestion.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>From: {suggestion.name}</span>
                          <span>{suggestion.email}</span>
                          <span>{suggestion.course_code} • Year {suggestion.year}</span>
                          <span>{new Date(suggestion.submitted_at).toLocaleDateString()}</span>
                        </div>
                        {suggestion.url && (
                          <a
                            href={suggestion.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-admin-accent hover:underline mt-1 inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View suggested resource
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {suggestion.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSuggestionStatus(suggestion.id, 'implemented')}
                              className="text-green-400 hover:text-green-300"
                              title="Mark as implemented"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSuggestionStatus(suggestion.id, 'rejected')}
                              className="text-red-400 hover:text-red-300"
                              title="Reject suggestion"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSuggestion(suggestion.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete suggestion"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

export default AdminDashboard;
