-- Create enum only if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can view all suggestions" ON public.suggestions;
DROP POLICY IF EXISTS "Admins can update suggestions" ON public.suggestions;
DROP POLICY IF EXISTS "Admins can delete suggestions" ON public.suggestions;
DROP POLICY IF EXISTS "Admins can upload to resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update files in resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files from resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files in resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can view admin_users" ON public.admin_users;

-- Create policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert resources" ON public.resources FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update resources" ON public.resources FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete resources" ON public.resources FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all suggestions" ON public.suggestions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update suggestions" ON public.suggestions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete suggestions" ON public.suggestions FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload to resources bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update files in resources bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete files from resources bucket" ON storage.objects FOR DELETE USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view files in resources bucket" ON storage.objects FOR SELECT USING (bucket_id = 'resources');

-- Secure admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view admin_users" ON public.admin_users FOR SELECT USING (public.has_role(auth.uid(), 'admin'));