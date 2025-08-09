// supabase/functions/ad-signal-search/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { fetchMetaAds } from "../_shared/meta.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const FiltersSchema = z.object({
  business: z.string().optional(),
  industry: z.string().optional(),
  location: z.object({ city: z.string().optional(), state: z.string().optional(), zip: z.string().optional() }).optional(),
  platforms: z.array(z.enum(["meta","google","youtube","tiktok"]).optional()).optional(),
  dateRange: z.object({ from: z.string().optional(), to: z.string().optional() }).optional(),
  adFormats: z.array(z.string()).optional(),
  spendRange: z.object({ min: z.number(), max: z.number() }).optional(),
  engagementRange: z.object({ min: z.number(), max: z.number() }).optional(),
}).optional();

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), { ...init, headers: { "content-type": "application/json", ...(init.headers || {}) } });
}

serve(async (req) => {
  const body = await req.json().catch(() => ({}));
  const parsed = FiltersSchema.safeParse(body.filters);
  const filters = parsed.success ? parsed.data : {};
  const cursor = typeof body.cursor === 'string' ? body.cursor : undefined;

  const platforms = (filters.platforms || ["meta"]).filter(Boolean) as string[];
  const results: Array<{ ads: any[]; nextCursor?: string; total?: number }> = [];

  try {
    if (platforms.includes("meta")) {
      const meta = await fetchMetaAds(filters as any, cursor);
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
