// supabase/functions/ad-signal-export/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

function toBase64(u8: Uint8Array) {
  let s = "";
  u8.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}

serve(async (req) => {
  const { filters, type } = await req.json().catch(() => ({ filters: {}, type: "csv" }));
  if (type === "csv") {
    const csv = new TextEncoder().encode("id,platform,competitor,headline\n");
    return new Response(JSON.stringify({ filename: "ads.csv", mime: "text/csv", base64: toBase64(csv) }), { headers: { "content-type": "application/json" } });
  }
  return new Response(JSON.stringify({ error: "PDF export not yet implemented" }), { status: 400, headers: { "content-type": "application/json" } });
});
