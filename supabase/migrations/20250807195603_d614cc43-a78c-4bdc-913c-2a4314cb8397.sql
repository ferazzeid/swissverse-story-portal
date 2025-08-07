-- Create minimal analytics events table with RLS and validation trigger
CREATE TABLE IF NOT EXISTS public.app_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  session_id text NULL,
  path text NULL,
  event_type text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;

-- Validation function to limit payload sizes and sanitize
CREATE OR REPLACE FUNCTION public.validate_app_events()
RETURNS trigger AS $$
BEGIN
  -- Coalesce metadata
  IF NEW.metadata IS NULL THEN
    NEW.metadata := '{}'::jsonb;
  END IF;
  
  -- Enforce reasonable limits
  IF length(COALESCE(NEW.event_type, '')) > 64 THEN
    RAISE EXCEPTION 'event_type too long';
  END IF;
  IF length(COALESCE(NEW.path, '')) > 256 THEN
    RAISE EXCEPTION 'path too long';
  END IF;
  -- Cap metadata stringified length
  IF length(NEW.metadata::text) > 4000 THEN
    RAISE EXCEPTION 'metadata too large';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- Trigger on insert
DROP TRIGGER IF EXISTS trg_validate_app_events ON public.app_events;
CREATE TRIGGER trg_validate_app_events
BEFORE INSERT ON public.app_events
FOR EACH ROW EXECUTE FUNCTION public.validate_app_events();

-- Indexes for querying
CREATE INDEX IF NOT EXISTS idx_app_events_created_at ON public.app_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_events_event_type ON public.app_events (event_type);
CREATE INDEX IF NOT EXISTS idx_app_events_path ON public.app_events (path);
CREATE INDEX IF NOT EXISTS idx_app_events_session ON public.app_events (session_id);

-- Policies
DROP POLICY IF EXISTS "Anyone can insert app events" ON public.app_events;
CREATE POLICY "Anyone can insert app events"
ON public.app_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can read app events" ON public.app_events;
CREATE POLICY "Only admins can read app events"
ON public.app_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can modify app events" ON public.app_events;
CREATE POLICY "Only admins can modify app events"
ON public.app_events
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can delete app events" ON public.app_events;
CREATE POLICY "Only admins can delete app events"
ON public.app_events
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
