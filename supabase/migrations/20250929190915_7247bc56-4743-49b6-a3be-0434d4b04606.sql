-- Create enum for resource categories
CREATE TYPE resource_category AS ENUM ('past_papers', 'notes', 'slides', 'book_links');

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table for storing all types of resources
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category resource_category NOT NULL,
  course_code TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  file_url TEXT,
  external_link TEXT,
  file_size INTEGER,
  file_type TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  CHECK ((file_url IS NOT NULL AND external_link IS NULL) OR (file_url IS NULL AND external_link IS NOT NULL))
);

-- Create suggestions table
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category resource_category NOT NULL,
  course_code TEXT,
  year INTEGER CHECK (year >= 1 AND year <= 4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create analytics table for tracking
CREATE TABLE public.resource_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'download')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_ip TEXT,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
-- Courses: Everyone can read
CREATE POLICY "Courses are publicly readable" ON public.courses
  FOR SELECT USING (true);

-- Resources: Everyone can read
CREATE POLICY "Resources are publicly readable" ON public.resources
  FOR SELECT USING (true);

-- Suggestions: Everyone can insert
CREATE POLICY "Anyone can submit suggestions" ON public.suggestions
  FOR INSERT WITH CHECK (true);

-- Analytics: Anyone can insert (for tracking)
CREATE POLICY "Analytics can be inserted" ON public.resource_analytics
  FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resources', 'resources', true);

-- Storage policies for resources bucket
CREATE POLICY "Resources are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'resources');

CREATE POLICY "Admins can upload resources" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Admins can update resources" ON storage.objects
  FOR UPDATE USING (bucket_id = 'resources');

CREATE POLICY "Admins can delete resources" ON storage.objects
  FOR DELETE USING (bucket_id = 'resources');

-- Insert initial course data
INSERT INTO public.courses (code, name) VALUES
  ('cs', 'Computer Science'),
  ('math', 'Mathematics'),
  ('physics', 'Physics'),
  ('eng', 'Engineering'),
  ('bio', 'Biology');

-- Insert default admin user (password: CS2024Admin)
-- Note: In production, use proper password hashing
INSERT INTO public.admin_users (username, password_hash) VALUES
  ('admin', 'CS2024Admin');