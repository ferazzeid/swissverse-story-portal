-- Remove month metadata from Genesis Era entries
UPDATE public.timeline_content 
SET month = ''
WHERE year = 2020 AND year_title = 'Genesis Era';