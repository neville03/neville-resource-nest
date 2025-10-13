import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Calendar, User } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_by: string;
  created_at: string;
}

interface CommunityTabProps {
  posts: CommunityPost[];
  onRefresh: () => void;
}

export const CommunityTab = ({ posts, onRefresh }: CommunityTabProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    const { error } = await supabase.from("community_posts").insert({
      title,
      content,
      image_url: imageUrl || null,
      created_by: user.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Post published successfully",
      });
      setTitle("");
      setContent("");
      setImageUrl("");
      onRefresh();
    }

    setIsCreating(false);
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Admin Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <Label htmlFor="admin-title">Title</Label>
              <Input
                id="admin-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-content">Content</Label>
              <Textarea
                id="admin-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your message to students..."
                rows={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-image">Image URL (optional)</Label>
              <Input
                id="admin-image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Community Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No posts yet</p>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.created_by.substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the post.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{post.content}</p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="mt-4 rounded-lg max-w-sm h-auto"
                      />
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
