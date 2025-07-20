-- Create home page content table for main hero section and SEO
CREATE TABLE public.home_page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  tag_type TEXT NOT NULL DEFAULT 'h1',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO metadata table
CREATE TABLE public.seo_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.home_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for home_page_content
CREATE POLICY "Anyone can view home page content" 
ON public.home_page_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage home page content" 
ON public.home_page_content 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for seo_metadata
CREATE POLICY "Anyone can view SEO metadata" 
ON public.seo_metadata 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage SEO metadata" 
ON public.seo_metadata 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_home_page_content_updated_at
BEFORE UPDATE ON public.home_page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at
BEFORE UPDATE ON public.seo_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default home page content
INSERT INTO public.home_page_content (section_key, title, content, tag_type) VALUES
('hero_title', 'Welcome to SWISSVERSE', '', 'h1'),
('hero_subtitle', 'where SWISS helps build a Future of Web3, NFT and Metaverse', '', 'h2'),
('explorer_title', 'Metaverse Explorer', '', 'h3'),
('pioneer_title', 'Web3 Pioneer', '', 'h3'),
('creator_title', 'NFT Creator', '', 'h3');

-- Insert default SEO metadata for home page
INSERT INTO public.seo_metadata (page_name, meta_title, meta_description) VALUES
('home', 'SWISSVERSE - Future of Web3, NFT and Metaverse', 'Discover the SWISSVERSE where SWISS helps build the future of Web3, NFT and Metaverse. Join our community of creators, explorers and pioneers.');