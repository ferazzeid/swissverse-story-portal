-- Remove Hyperfi Error Begins placeholder entry
DELETE FROM public.timeline_content 
WHERE LOWER(title) LIKE '%hyperfi error begins%' 
   OR LOWER(title) LIKE '%hyperfy error begins%'
   OR LOWER(content) LIKE '%hyperfi error begins%'
   OR LOWER(content) LIKE '%hyperfy error begins%';