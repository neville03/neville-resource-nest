-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table to store user roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for resources table
CREATE POLICY "Admins can insert resources"
  ON public.resources
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resources"
  ON public.resources
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resources"
  ON public.resources
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for suggestions table
CREATE POLICY "Admins can view all suggestions"
  ON public.suggestions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update suggestions"
  ON public.suggestions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete suggestions"
  ON public.suggestions
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for resources bucket
CREATE POLICY "Admins can upload to resources bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'resources' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update files in resources bucket"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'resources' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete files from resources bucket"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'resources' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Public can view files in resources bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resources');

-- Secure the admin_users table with RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin_users"
  ON public.admin_users
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix update_updated_at_column function security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;