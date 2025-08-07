-- Create table for user-submitted glossary suggestions
CREATE TABLE IF NOT EXISTS public.glossary_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  user_id UUID NULL,
  contact_name TEXT NULL,
  contact_email TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.glossary_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can submit, only admins can manage, users can view their own
CREATE POLICY IF NOT EXISTS "Anyone can submit glossary suggestions"
ON public.glossary_suggestions
FOR INSERT
USING (true)
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admins can manage glossary suggestions"
ON public.glossary_suggestions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY IF NOT EXISTS "Users can view their own suggestions"
ON public.glossary_suggestions
FOR SELECT
USING (auth.uid() = user_id);

-- Trigger to maintain updated_at
CREATE TRIGGER IF NOT EXISTS update_glossary_suggestions_updated_at
BEFORE UPDATE ON public.glossary_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_glossary_suggestions_status_created_at
ON public.glossary_suggestions (status, created_at DESC);
