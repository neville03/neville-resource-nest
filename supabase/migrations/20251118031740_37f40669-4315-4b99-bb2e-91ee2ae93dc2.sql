-- Drop unused PII columns from resource_analytics table
-- These columns are not being used by the application and pose a privacy risk

ALTER TABLE public.resource_analytics 
DROP COLUMN IF EXISTS user_ip,
DROP COLUMN IF EXISTS user_agent;