-- Remove Technology Foundation entry and update P2E Strategy title
DELETE FROM public.timeline_content 
WHERE title = 'Technology Foundation' AND year = 2021;

UPDATE public.timeline_content 
SET title = 'P2E Strategy'
WHERE title = 'Casino & P2E Strategy' AND year = 2021;