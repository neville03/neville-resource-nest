-- Create community_posts table for user-generated content
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view community posts
CREATE POLICY "Community posts are publicly readable"
ON public.community_posts
FOR SELECT
USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
ON public.community_posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
ON public.community_posts
FOR DELETE
USING (auth.uid() = created_by);

-- Admins can delete any post
CREATE POLICY "Admins can delete any post"
ON public.community_posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update any post
CREATE POLICY "Admins can update any post"
ON public.community_posts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();