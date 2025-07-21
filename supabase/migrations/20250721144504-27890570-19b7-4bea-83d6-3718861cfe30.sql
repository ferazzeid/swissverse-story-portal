-- Update Swiss Becomes Swissverse to use capital letters
UPDATE public.timeline_content 
SET 
  title = 'SWISS Becomes SWISSVERSE',
  content = 'I rebranded to SWISSVERSE across social channels. SWISS became more than an avatar — it became a platform for expanding beyond DCL.'
WHERE LOWER(title) LIKE '%swiss becomes swissverse%' 
   OR LOWER(title) LIKE '%swiss becomes swissverse%';