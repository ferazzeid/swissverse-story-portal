-- Create storage buckets for different image types
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('gallery-images', 'gallery-images', true),
  ('timeline-images', 'timeline-images', true),
  ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery images
CREATE POLICY "Anyone can view gallery images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for timeline images
CREATE POLICY "Anyone can view timeline images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'timeline-images');

CREATE POLICY "Admins can upload timeline images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'timeline-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update timeline images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'timeline-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete timeline images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'timeline-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for project images  
CREATE POLICY "Anyone can view project images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update project images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));