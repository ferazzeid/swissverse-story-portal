-- Content management tables for Swissverse

-- Gallery images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Timeline content table
CREATE TABLE public.timeline_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  year_title TEXT NOT NULL,
  month TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  highlight TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  image_url TEXT,
  gradient_class TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_images
CREATE POLICY "Anyone can view gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage gallery images" 
ON public.gallery_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for timeline_content
CREATE POLICY "Anyone can view timeline content" 
ON public.timeline_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage timeline content" 
ON public.timeline_content 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timeline_content_updated_at
BEFORE UPDATE ON public.timeline_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_gallery_images_active_order ON public.gallery_images (is_active, display_order);
CREATE INDEX idx_timeline_content_active_year_order ON public.timeline_content (is_active, year, display_order);