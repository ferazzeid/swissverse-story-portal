-- Add new tools and resources to existing ones
INSERT INTO public.resources (title, description, category, icon_name, link_url, display_order, is_active) VALUES
('Meshcapade', 'Platform for generating realistic, rigged 3D human avatars with biomechanical accuracy.', '3D/Avatar/Metaverse', 'users', 'https://meshcapade.com/', 100, true),
('Union Avatars', 'AI-powered avatar generator transforming selfies into 3D avatars for games and VR.', '3D/Avatar/Metaverse', 'user', 'https://unionavatars.com/', 101, true),
('Hunyuan 3D Model', 'Tencent''s open-source text-to-3D generator supporting advanced prompts and mesh export.', '3D/Avatar/Metaverse', 'code', 'https://3d-models.hunyuan.tencent.com/', 102, true),
('Trellis 3D', 'AI-based generator for 3D assets using text or image input—great for metaverse creators.', '3D/Avatar/Metaverse', 'wand', 'https://trellis3d.net/', 103, true),
('Wilder World', 'Photorealistic metaverse on Unreal Engine 5 featuring racing, FPS, and social spaces.', '3D/Avatar/Metaverse', 'globe', 'https://www.wilderworld.com/', 104, true),
('Netvrk', 'Immersive AI‑enabled metaverse built with UE5 for gaming, education, and virtual real estate.', '3D/Avatar/Metaverse', 'globe', 'https://www.netvrk.co/', 105, true),
('Otherside', 'Yuga Labs'' MMORPG‑style metaverse blending gameplay with NFT characters and story.', '3D/Avatar/Metaverse', 'globe', 'https://otherside.xyz/', 106, true),
('OVR (OVER)', 'AR metaverse featuring geolocated experiences, virtual land, and NFT overlays.', '3D/Avatar/Metaverse', 'globe', 'https://marketplace.ovr.ai/', 107, true),
('some.place', 'Mobile-first metaverse delivering immersive branded experiences and personal spaces.', '3D/Avatar/Metaverse', 'globe', 'https://some.place/', 108, true),
('Worldwide Webb', 'Pixel-art web3 metaverse with NFT avatars, social features, and MMO gameplay.', '3D/Avatar/Metaverse', 'globe', 'https://worldwidewebb.io/', 109, true),
('Midjourney', 'Popular AI image-generation tool for creating stylized visuals from text prompts.', 'AI/Image/Video', 'image', 'https://www.midjourney.com/', 110, true),
('MagicQuill', 'AI writing assistant demo on HuggingFace, aiding creative text generation.', 'AI/Image/Video', 'pen-tool', 'https://huggingface.co/spaces/AI4Editing/MagicQuill', 111, true),
('D-ID', 'AI video platform for generating talking avatars and realistic face animation.', 'AI/Image/Video', 'video', 'https://www.d-id.com/', 112, true),
('RunwayML', 'AI video and image platform offering creative tools and generative editing.', 'AI/Image/Video', 'video', 'https://runwayml.com/', 113, true),
('Replit', 'Collaborative in-browser IDE supporting multiple languages, dev servers, and AI coding tools.', 'AI/Image/Video', 'code', 'https://replit.dev/', 114, true),
('Deepgram', 'AI speech-to-text API platform for real-time transcription and audio analytics.', 'AI/Image/Video', 'mic', 'https://deepgram.com/', 115, true),
('Airtable', 'Flexible no-code database/spreadsheet hybrid for organizing content, assets, and workflows.', 'AI/Image/Video', 'table', 'https://www.airtable.com/', 116, true),
('Flutterflow', 'Visual app builder for creating Flutter mobile/web apps with integrated backend.', 'Dev Tools/Infra', 'monitor', 'https://flutterflow.io/', 117, true),
('Pinecone', 'Vector database service for scalable similarity search and AI applications.', 'Dev Tools/Infra', 'database', 'https://app.pinecone.io/', 118, true),
('RapidAPI', 'Marketplace for discovering, testing, and connecting to thousands of REST APIs.', 'Dev Tools/Infra', 'plug', 'https://rapidapi.com/', 119, true),
('Docker', 'Container platform for packaging and running applications in lightweight, portable environments.', 'Dev Tools/Infra', 'box', 'https://www.docker.com/', 120, true),
('Livekit', 'Open-source platform for real-time audio/video with low-latency group communications.', 'Dev Tools/Infra', 'video', 'https://docs.livekit.io/home/', 121, true),
('n8n', 'Workflow automation tool that enables low-code, on-premise integration between apps and services.', 'Dev Tools/Infra', 'shuffle', 'https://n8n.io/', 122, true),
('Weaviate', 'Open-source vector search engine for semantic AI applications and knowledge graphs.', 'Dev Tools/Infra', 'search', 'https://weaviate.io/', 123, true),
('Gumloop', 'Platform for creating, aggregating, and monetizing branded communities and chats.', 'Dev Tools/Infra', 'message-square', 'https://www.gumloop.com/', 124, true),
('Cursor', 'AI code assistant and pair-programming tool integrated into the editor.', 'Dev Tools/Infra', 'code', 'https://www.cursor.com/', 125, true),
('Haiper AI', 'AI-powered co-pilot for browsing and multitasking, bringing GPT directly to your workflow.', 'Dev Tools/Infra', 'zap', 'https://haiper.ai/', 126, true),
('Akool', 'AI that builds APIs from natural language prompts and integrates into your tech stack.', 'Dev Tools/Infra', 'code', 'https://akool.com/', 127, true),
('ChatGPT', 'OpenAI''s conversational AI model for chat, coding, content generation, and research.', 'AI/Language/ML', 'message-circle', 'https://chatgpt.com/', 128, true),
('Claude AI', 'Anthropic''s conversational AI assistant focusing on safe and helpful interactions.', 'AI/Language/ML', 'message-circle', 'https://claude.ai/new', 129, true),
('Perplexity', 'AI-powered search engine combining web retrieval with conversational answers.', 'AI/Language/ML', 'search', 'https://www.perplexity.ai/', 130, true),
('NotebookLM', 'Google''s AI research notebook for organizing insights and generating documentation.', 'AI/Language/ML', 'book', 'https://notebooklm.google/', 131, true),
('Deepseek Chat', 'Search and chat over your own documents using AI.', 'AI/Language/ML', 'search', 'https://chat.deepseek.com/', 132, true),
('Together.ai', 'Community platform for open-source AI projects and development collaboration.', 'AI/Language/ML', 'users', 'https://www.together.ai/', 133, true),
('PyTorch', 'Open-source deep learning framework widely used for model training and research.', 'AI/Language/ML', 'cpu', 'https://pytorch.org/', 134, true),
('DeBridge', 'Cross-chain liquidity and messaging protocol enabling seamless transfers across blockchains.', 'Crypto/Web3 Services', 'hash', 'https://app.debridge.finance/', 135, true),
('Thorswap', 'Decentralized exchange aggregator for cross-chain swaps using Thorchain liquidity.', 'Crypto/Web3 Services', 'hash', 'https://app.thorswap.finance/', 136, true),
('Synapse Protocol', 'Cross-chain bridge and messaging protocol connecting multiple blockchains.', 'Crypto/Web3 Services', 'hash', 'https://synapseprotocol.com/', 137, true);

-- Also update the Blender entry since it has different categorization and description
UPDATE public.resources 
SET 
  description = 'Open-source 3D creation suite for modeling, animation, VFX, and VR/AR content.',
  category = '3D/Avatar/Metaverse',
  display_order = 99
WHERE title = 'Blender';