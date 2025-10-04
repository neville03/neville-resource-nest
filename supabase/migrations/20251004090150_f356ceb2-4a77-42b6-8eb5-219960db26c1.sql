-- Remove the insecure admin_users table
-- This table was storing password hashes that could be accessed by unauthorized users
-- We're using Supabase Auth + user_roles instead for secure authentication
DROP TABLE IF EXISTS public.admin_users CASCADE;