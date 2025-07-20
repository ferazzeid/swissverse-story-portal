-- Create section titles table for managing main titles and subtitles
CREATE TABLE public.section_titles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create metaverse projects table
CREATE TABLE public.metaverse_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create youtube videos table
CREATE TABLE public.youtube_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id text NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create resources table
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  link_url text,
  category text NOT NULL DEFAULT 'tool',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metaverse_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policies for section_titles
CREATE POLICY "Anyone can view section titles" 
ON public.section_titles 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage section titles" 
ON public.section_titles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for metaverse_projects
CREATE POLICY "Anyone can view metaverse projects" 
ON public.metaverse_projects 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage metaverse projects" 
ON public.metaverse_projects 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for youtube_videos
CREATE POLICY "Anyone can view youtube videos" 
ON public.youtube_videos 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage youtube videos" 
ON public.youtube_videos 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for resources
CREATE POLICY "Anyone can view resources" 
ON public.resources 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage resources" 
ON public.resources 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add update triggers
CREATE TRIGGER update_section_titles_updated_at
BEFORE UPDATE ON public.section_titles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metaverse_projects_updated_at
BEFORE UPDATE ON public.metaverse_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_youtube_videos_updated_at
BEFORE UPDATE ON public.youtube_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default section titles
INSERT INTO public.section_titles (section_name, title, subtitle) VALUES
('metaverse_gallery', 'METAVERSE Gallery', NULL),
('youtube', 'YouTube', 'Latest videos from our channel'),
('resources', 'Tools & Resources', 'Everything you need to build in the metaverse');

-- Insert current metaverse projects
INSERT INTO public.metaverse_projects (title, description, image_url, display_order) VALUES
('Virtual Worlds', 'Immersive digital environments where reality meets imagination', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80', 1),
('NFT Galleries', 'Showcase and trade digital assets in stunning virtual spaces', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80', 2),
('Social Hubs', 'Connect with creators and builders from around the globe', 'https://images.unsplash.com/photo-1540270776932-e72e7c2d11cd?auto=format&fit=crop&w=800&q=80', 3),
('Gaming Experiences', 'Play and create games in limitless virtual environments', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80', 4);

-- Insert current resources
INSERT INTO public.resources (title, description, icon_name, category, display_order) VALUES
('hyperfy SDK', 'Build immersive metaverse experiences with our powerful development kit', 'Code2', 'development', 1),
('3D Asset Library', 'Access thousands of optimized 3D models and environments', 'Box', 'assets', 2),
('Community Discord', 'Join our vibrant community of creators and developers', 'MessageCircle', 'community', 3),
('Documentation', 'Comprehensive guides and API references for developers', 'FileText', 'docs', 4),
('Tutorials', 'Step-by-step video tutorials to get you started', 'PlayCircle', 'learning', 5),
('Templates', 'Pre-built templates to jumpstart your metaverse projects', 'Layout', 'templates', 6);