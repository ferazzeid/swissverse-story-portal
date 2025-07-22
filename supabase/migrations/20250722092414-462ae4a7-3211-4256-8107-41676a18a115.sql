-- Create glossary_terms table
CREATE TABLE public.glossary_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  related_terms TEXT[], -- Array of related term IDs or slugs
  term_slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active glossary terms" 
ON public.glossary_terms 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage glossary terms" 
ON public.glossary_terms 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_glossary_terms_term_slug ON public.glossary_terms(term_slug);
CREATE INDEX idx_glossary_terms_category ON public.glossary_terms(category);
CREATE INDEX idx_glossary_terms_is_active ON public.glossary_terms(is_active);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_glossary_terms_updated_at
BEFORE UPDATE ON public.glossary_terms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample terms to get started
INSERT INTO public.glossary_terms (term, definition, category, term_slug, display_order) VALUES
('NFT', 'Non-Fungible Token. A unique digital asset stored on a blockchain that represents ownership of a specific item or piece of content.', 'blockchain', 'nft', 1),
('Metaverse', 'A collective virtual shared space created by the convergence of virtually enhanced physical reality and physically persistent virtual space.', 'metaverse', 'metaverse', 2),
('Web3', 'The third generation of the internet based on blockchain technology, emphasizing decentralization and user ownership.', 'blockchain', 'web3', 3),
('Avatar', 'A digital representation of a user in virtual environments, often customizable and used for identity in metaverse platforms.', 'metaverse', 'avatar', 4),
('Smart Contract', 'Self-executing contracts with terms directly written into code, automatically enforcing agreements on blockchain networks.', 'blockchain', 'smart-contract', 5),
('VR', 'Virtual Reality. A simulated experience that can be similar to or completely different from the real world using special electronic equipment.', 'technical', 'vr', 6),
('AR', 'Augmented Reality. Technology that overlays digital information onto the real world through devices like smartphones or AR glasses.', 'technical', 'ar', 7),
('DAO', 'Decentralized Autonomous Organization. An organization represented by rules encoded as a computer program that is transparent and controlled by shareholders.', 'blockchain', 'dao', 8);