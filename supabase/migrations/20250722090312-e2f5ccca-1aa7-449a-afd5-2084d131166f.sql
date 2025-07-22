-- Make month field optional in timeline_content table
ALTER TABLE public.timeline_content 
ALTER COLUMN month DROP NOT NULL;