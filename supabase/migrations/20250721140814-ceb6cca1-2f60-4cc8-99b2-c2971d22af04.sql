-- Add new timeline entries for 2022 and 2023
INSERT INTO public.timeline_content (
  year, year_title, month, title, content, highlight, 
  icon_name, gradient_class, display_order, is_active
) VALUES 
(
  2022, 'Repositioning Era', '', 'Swiss Becomes Swissverse',
  'I rebranded to Swissverse across social channels. Swiss became more than an avatar — it became a platform for expanding beyond DCL.',
  'Brand Shift', 'Star', 'from-blue-500 to-teal-500', 18, true
),
(
  2022, 'Repositioning Era', '', 'OG Exodus Begins',
  'Many DCL OGs left due to platform stagnation. I stayed active but also started exploring new spaces in Web3 and gaming.',
  'Shifting Ground', 'Users', 'from-orange-500 to-red-500', 19, true
),
(
  2022, 'Repositioning Era', '', 'Land Sold at Peak',
  'I sold most of my Decentraland land near the market peak and reallocated funds into gaming projects. The bear market hit soon after.',
  'Exit Timing', 'Database', 'from-green-400 to-yellow-500', 20, true
),
(
  2022, 'Repositioning Era', '', 'The Bear Market Hits',
  'NFTs and metaverse assets tanked. Community activity dropped. DCL remained, but the hype disappeared almost overnight.',
  'Crash Phase', 'Shield', 'from-gray-600 to-black', 21, true
),
(
  2022, 'Repositioning Era', '', 'DCL ''38 Users'' Scandal',
  'A viral report claimed Decentraland had 38 users. It hurt the community but clarified how far we still had to go.',
  'Public Blowback', 'Globe', 'from-red-500 to-pink-600', 22, true
),
(
  2023, 'New Horizons', '', 'First Movers to Hyperfy',
  'Discovered Hyperfy. Joined early builders exploring drag-and-drop metaverse tooling. It felt like a fresh start.',
  'New Platform', 'Rocket', 'from-purple-500 to-indigo-600', 23, true
);