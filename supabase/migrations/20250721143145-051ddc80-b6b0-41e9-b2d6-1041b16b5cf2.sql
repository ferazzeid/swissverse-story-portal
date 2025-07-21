-- Remove more placeholder entries
DELETE FROM public.timeline_content 
WHERE LOWER(title) LIKE '%vision crystallization%' 
   OR LOWER(title) LIKE '%hyperfly era begins%'
   OR LOWER(content) LIKE '%vision crystallization%'
   OR LOWER(content) LIKE '%hyperfly era begins%';