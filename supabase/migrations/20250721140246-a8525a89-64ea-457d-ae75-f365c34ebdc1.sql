-- Remove outdated timeline entries and add new 2024 and 2025 entries
DELETE FROM public.timeline_content WHERE year IN (2024, 2025);

-- Insert new timeline entries for 2024 and 2025
INSERT INTO public.timeline_content (
  year, year_title, month, title, content, highlight, 
  icon_name, gradient_class, display_order, is_active
) VALUES 
(
  2024, 'Metaverse Winter', '', 'The Metaverse Winter',
  'By 2024, most activity stopped. YouTube died, builders left, but a few of us kept showing up in X Spaces to hold the line.',
  'Quiet Persistence', 'Calendar', 'from-gray-500 to-gray-700', 16, true
),
(
  2025, 'Reframing the Vision', '', 'AI Reshapes the Metaverse',
  'AI tools are now reframing how we think about identity, creativity, and worldbuilding. The future''s unclear — but it''s still alive.',
  'AI Integration', 'Cpu', 'from-green-500 to-blue-500', 17, true
);