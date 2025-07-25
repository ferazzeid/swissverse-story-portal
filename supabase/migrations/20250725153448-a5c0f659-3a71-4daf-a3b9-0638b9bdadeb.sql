-- Create table for configurable buttons and links
CREATE TABLE public.configurable_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  button_variant TEXT NOT NULL DEFAULT 'default',
  button_size TEXT NOT NULL DEFAULT 'default',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.configurable_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage configurable links" 
ON public.configurable_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view configurable links" 
ON public.configurable_links 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_configurable_links_updated_at
BEFORE UPDATE ON public.configurable_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data with current values
INSERT INTO public.configurable_links (link_key, title, url, icon_name, button_variant, button_size, display_order) VALUES
('hero_visit_metaverse', 'Visit the Metaverse', 'https://hyperfy.io/swissverse', 'Globe', 'cyber', 'xl', 1),
('hero_follow_x', 'Follow on X', 'https://x.com/swissverse', 'Sparkles', 'glow', 'xl', 2),
('footer_visit_metaverse', 'Visit Metaverse', 'https://world.swissverse.org', 'Globe', 'cyber', 'xl', 3),
('footer_join_dcl', 'Join DCL Community', 'https://decentraland.org/', 'Users', 'glow', 'xl', 4),
('footer_glossary', 'Glossary', '/glossary', 'BookOpen', 'outline', 'xl', 5),
('footer_social_x', 'X', 'https://x.com/swissverse', 'Twitter', 'glow', 'icon', 6),
('footer_social_instagram', 'Instagram', 'https://www.instagram.com/swiss.verse/', 'Instagram', 'glow', 'icon', 7),
('footer_social_youtube', 'YouTube', 'https://www.youtube.com/@SWISSVERSE', 'Youtube', 'glow', 'icon', 8),
('footer_social_email', 'Email', 'mailto:swiss@dcl.business', 'Mail', 'glow', 'icon', 9);