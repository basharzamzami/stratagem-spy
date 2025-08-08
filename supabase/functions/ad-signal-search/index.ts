// supabase/functions/ad-signal-search/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { fetchMetaAds } from "../_shared/meta.ts";
import type { SearchFilters } from "../_shared/types.ts";

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), { ...init, headers: { "content-type": "application/json", ...(init.headers || {}) } });
}

serve(async (req) => {
  const { filters = {}, cursor }: { filters?: SearchFilters; cursor?: string } = await req.json().catch(() => ({} as any));

  const platforms = (filters.platforms || ["meta"]).filter(Boolean);
  const results = [] as Array<{ ads: any[]; nextCursor?: string; total?: number }>;

  try {
    if (platforms.includes("meta")) {
      const meta = await fetchMetaAds(filters, cursor);
      results.push(meta);
    }
  } catch (e) {
    console.error("meta error", e);
  }

  const ads = results.flatMap((r) => r.ads);
  const nextCursor = results.find((r) => r.nextCursor)?.nextCursor;
  const total = results.reduce((acc, r) => acc + (r.total || 0), 0);

  return json({ ads, nextCursor, total });
});
