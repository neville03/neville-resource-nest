-- Add SELECT policy to restrict analytics data access to admins only
-- This protects user IP addresses and user agents (PII) from unauthorized access
CREATE POLICY "Admins can view analytics data" 
ON public.resource_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));