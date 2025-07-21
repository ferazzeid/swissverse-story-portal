-- Remove the old placeholder "Digital Birth" entry
DELETE FROM public.timeline_content 
WHERE title = 'Digital Birth' AND month = 'March' AND year = 2020;