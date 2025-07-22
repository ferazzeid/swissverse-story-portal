-- Add SEO metadata fields to timeline_content table
ALTER TABLE public.timeline_content 
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT;