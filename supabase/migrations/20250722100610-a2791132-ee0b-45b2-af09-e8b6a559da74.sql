-- Add new glossary terms from the provided list
INSERT INTO public.glossary_terms (term, definition, category, term_slug, display_order) VALUES

-- Identity & Ownership category
('Digital Identity', 'How individuals represent themselves online across platforms, wallets, avatars, and decentralized apps (dApps).', 'identity', 'digital-identity', 9),
('Digital Ownership', 'The concept of verifiable control and rights over digital assets (via blockchain).', 'identity', 'digital-ownership', 10),

-- Infrastructure & Governance category  
('DApp', 'Decentralized Application. Applications built on blockchain without centralized servers.', 'infrastructure', 'dapp', 11),
('Interoperability', 'Ability for systems or platforms to work and share assets/data seamlessly.', 'infrastructure', 'interoperability', 12),
('On-chain vs Off-chain', 'Data/actions recorded directly on the blockchain vs processed externally.', 'infrastructure', 'on-chain-vs-off-chain', 13),

-- Crypto & Finance category
('Cryptocurrency', 'Digital currency secured by cryptography, often used within blockchain ecosystems.', 'finance', 'cryptocurrency', 14),
('Tokenomics', 'The economic design and function of a crypto token within its ecosystem.', 'finance', 'tokenomics', 15),
('DEX', 'Decentralized Exchange. Peer-to-peer marketplaces for swapping crypto assets without intermediaries.', 'finance', 'dex', 16),
('Stablecoin', 'A cryptocurrency pegged to the value of a fiat currency (like USD).', 'finance', 'stablecoin', 17),
('Gas Fees', 'Transaction costs paid to perform operations on a blockchain.', 'finance', 'gas-fees', 18),

-- Gaming & Earning category
('Play-to-Earn', 'Games that reward players with crypto or NFTs for gameplay.', 'gaming', 'play-to-earn', 19),
('Metaverse Economy', 'All economic activities in virtual worlds (e.g., buying land, selling skins, earning tokens).', 'gaming', 'metaverse-economy', 20),
('GameFi', 'Fusion of gaming and decentralized finance, often involving P2E mechanics.', 'gaming', 'gamefi', 21),

-- AI & Intelligence category
('Generative AI', 'AI models that can generate content (text, visuals, code, etc.) based on prompts or data.', 'ai', 'generative-ai', 22),
('AI Agents', 'Autonomous digital entities that can act or learn on behalf of a user in digital or virtual environments.', 'ai', 'ai-agents', 23);