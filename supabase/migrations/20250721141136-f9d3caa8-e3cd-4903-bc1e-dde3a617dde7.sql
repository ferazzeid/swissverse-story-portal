-- Remove placeholder entries from 2022 that contain "conceptualization" or "community formation"
DELETE FROM public.timeline_content 
WHERE year = 2022 
AND (
  LOWER(title) LIKE '%conceptualization%' 
  OR LOWER(title) LIKE '%community formation%'
  OR LOWER(content) LIKE '%conceptualization%'
  OR LOWER(content) LIKE '%community formation%'
);