import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "sv_session_id";

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export type EventMetadata = Record<string, any> | undefined;

export async function logEvent(eventType: string, metadata?: EventMetadata) {
  try {
    const session_id = getSessionId();
    const path = typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined;
    const { data } = await supabase.auth.getUser();
    const user_id = data.user?.id ?? null;

    // Best-effort, ignore errors in UI
    await supabase.from("app_events").insert({
      event_type: eventType,
      session_id,
      path,
      metadata: metadata ?? {},
      user_id,
    });
  } catch (e) {
    // swallow errors to avoid breaking UX
    console.debug("logEvent error", e);
  }
}
