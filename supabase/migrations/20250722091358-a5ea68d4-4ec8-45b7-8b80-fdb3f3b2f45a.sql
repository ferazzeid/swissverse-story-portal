-- Clear existing resources and add new ones
DELETE FROM public.resources;

-- Insert new resources
INSERT INTO public.resources (title, description, category, icon_name, link_url, display_order, is_active) VALUES
('Decentraland', 'A browser‑based 3D virtual world built on Ethereum where users can buy land, socialize, and create experiences.', 'platform', 'globe', 'https://decentraland.org', 1, true),
('Decentraland Feedback (Canny)', 'Decentraland''s public roadmap and feedback board powered by Canny, letting the community vote on features.', 'community', 'users', 'https://decentraland.canny.io/', 2, true),
('OpenSea', 'The largest NFT marketplace for discovering, minting, buying, and selling a vast array of digital assets across blockchains.', 'platform', 'code', 'https://opensea.com', 3, true),
('Blender', 'Free, open‑source 3D creation suite for modeling, animation, VFX, game assets, and VR/AR content.', 'tool', 'hammer', 'https://www.blender.org/', 4, true),
('Hyperfy (hyperfy.io)', 'Open‑source, browser‑based framework combining Three.js and PhysX for building real‑time multiuser 3D virtual worlds.', 'tool', 'settings', 'https://hyperfy.io/', 5, true),
('Hyperfy (hyperfy.xyz)', 'Web entrypoint to explore and build in the Hyperfy metaverse ecosystem, showcasing docs, worlds, and events.', 'platform', 'globe', 'https://hyperfy.xyz/', 6, true),
('Coinbase', 'Leading crypto exchange and wallet service for buying, selling, transferring, staking, and exploring blockchain apps.', 'service', 'settings', 'https://coinbase.com', 7, true),
('Kraken', 'Secure, regulated cryptocurrency exchange offering trading, staking, margin, futures, stocks & ETFs.', 'service', 'settings', 'https://kraken.com', 8, true);