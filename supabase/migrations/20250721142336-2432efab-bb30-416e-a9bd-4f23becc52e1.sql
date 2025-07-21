-- Remove old placeholder entries
DELETE FROM public.timeline_content 
WHERE LOWER(title) LIKE '%vision established%' 
   OR LOWER(title) LIKE '%research phase%'
   OR LOWER(title) LIKE '%hypothec begins%'
   OR LOWER(title) LIKE '%platform evolution%'
   OR LOWER(content) LIKE '%vision established%'
   OR LOWER(content) LIKE '%research phase%';