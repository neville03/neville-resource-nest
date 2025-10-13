import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Calendar } from "lucide-react";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to contribute to the community",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("community_posts").insert({
      title,
      content,
      created_by: user.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your contribution has been published!",
      });
      setTitle("");
      setContent("");
      setIsOpen(false);
      fetchPosts();
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="h-10 w-10 text-primary" />
                Community Hub
              </h1>
              <p className="text-muted-foreground">
                Share knowledge, summaries, and academic content with fellow students
              </p>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Contribute
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Share Your Knowledge</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your post a clear title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your summary, notes, or academic insights..."
                      rows={8}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Publishing..." : "Publish"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No posts yet. Be the first to contribute!
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{post.content}</p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="mt-4 rounded-lg max-w-full h-auto"
                      />
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
