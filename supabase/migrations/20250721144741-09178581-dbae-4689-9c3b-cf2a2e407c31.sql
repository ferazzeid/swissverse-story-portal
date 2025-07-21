-- Add story system to timeline_content table
ALTER TABLE public.timeline_content 
ADD COLUMN story_slug TEXT UNIQUE,
ADD COLUMN full_story TEXT,
ADD COLUMN story_image_url TEXT,
ADD COLUMN has_story BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX idx_timeline_content_story_slug ON public.timeline_content(story_slug);
CREATE INDEX idx_timeline_content_has_story ON public.timeline_content(has_story);

-- Update existing entries to have slugs
UPDATE public.timeline_content 
SET 
  story_slug = LOWER(REPLACE(REPLACE(title, ' ', '-'), '&', 'and')),
  has_story = true
WHERE is_active = true;