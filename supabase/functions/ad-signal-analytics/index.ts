// supabase/functions/ad-signal-analytics/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const { filters } = await req.json().catch(() => ({ filters: {} }));
  // TODO: compute analytics from DB/cache
  const data = {
    angles: { emotional: 0, logical: 0 },
    offers: {},
    formats: {},
    trends: [],
  };
  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
});
