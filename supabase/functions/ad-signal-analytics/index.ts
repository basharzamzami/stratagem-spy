// supabase/functions/ad-signal-analytics/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { fetchMetaAds } from "../_shared/meta.ts";
import type { AdItem } from "../_shared/types.ts";
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

const EMOTIONAL = ["love", "amazing", "incredible", "fear", "urgent", "excited", "secret", "shock", "wow", "best ever", "insane"];
const LOGICAL = ["save", "because", "evidence", "data", "proven", "results", "optimize", "tutorial", "guide", "how to", "framework"];
const OFFERS: Record<string, string[]> = {
  discount: ["% off", "off", "save", "discount", "sale", "price drop"],
  free_trial: ["free trial", "try free", "trial"],
  guarantee: ["guarantee", "money back", "refund"],
  limited_time: ["limited", "ends soon", "today only", "last chance"],
  free_shipping: ["free shipping", "ship free"],
};

function includesAny(text: string, keywords: string[]) {
  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k));
}

function analyzeAds(ads: AdItem[]) {
  let emotional = 0, logical = 0;
  const offers: Record<string, number> = {};
  const formats: Record<string, number> = {};
  const trendsMap: Record<string, number> = {};

  for (const ad of ads) {
    const text = `${ad.headline || ""} ${ad.primary_text || ""}`.trim();
    if (text) {
      if (includesAny(text, EMOTIONAL)) emotional++;
      if (includesAny(text, LOGICAL)) logical++;
      for (const [offer, keys] of Object.entries(OFFERS)) {
        if (includesAny(text, keys)) offers[offer] = (offers[offer] || 0) + 1;
      }
    }
    const fmt = (ad.creative_type || "unknown").toLowerCase();
    formats[fmt] = (formats[fmt] || 0) + 1;
    if (ad.first_seen) {
      const d = new Date(ad.first_seen);
      const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString().slice(0, 10);
      trendsMap[day] = (trendsMap[day] || 0) + 1;
    }
  }

  const trends = Object.entries(trendsMap).sort(([a],[b]) => a < b ? -1 : 1).map(([date, count]) => ({ date, count }));
  return { angles: { emotional, logical }, offers, formats, trends };
}

serve(async (req) => {
  const body = await req.json().catch(() => ({}));
  const parsed = FiltersSchema.safeParse(body.filters);
  const filters = parsed.success ? parsed.data : {};
  const platforms = (filters?.platforms || ["meta"]).filter(Boolean) as string[];
  let ads: AdItem[] = [];

  try {
    if (platforms.includes("meta")) {
      const meta = await fetchMetaAds(filters as any);
      ads = ads.concat(meta.ads);
    }
  } catch (e) {
    console.error("analytics meta error", e);
  }

  const result = analyzeAds(ads);
  return json(result);
});
