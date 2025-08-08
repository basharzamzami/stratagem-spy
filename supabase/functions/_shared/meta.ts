// supabase/functions/_shared/meta.ts
import { AdItem, SearchFilters } from "./types.ts";

const META_BASE = "https://graph.facebook.com/v18.0";

export async function fetchMetaAds(filters: SearchFilters, cursor?: string) {
  const token = Deno.env.get("META_ADS_ACCESS_TOKEN");
  if (!token) {
    return { ads: [], nextCursor: undefined, total: 0 };
  }
  // This is a placeholder; Meta Ad Library queries vary by country and params.
  // Use Ad Library endpoint with proper fields and paging.
  const url = new URL(`${META_BASE}/ads_archive`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("ad_type", "POLITICAL_AND_ISSUE_ADS"); // placeholder to pass validation
  url.searchParams.set("search_terms", filters.business || "");
  if (cursor) url.searchParams.set("after", cursor);
  const res = await fetch(url.toString());
  if (!res.ok) {
    return { ads: [], nextCursor: undefined, total: 0 };
  }
  const json = await res.json();
  const normalized: AdItem[] = (json.data || []).map((it: any) => ({
    id: String(it.id),
    platform: "meta",
    competitor_name: it.page_name || "Unknown",
    creative_url: it.ad_snapshot_url,
    creative_type: "image",
    headline: it.ad_creative_bodies?.[0] || undefined,
    primary_text: it.ad_creative_bodies?.[0] || undefined,
    cta: undefined,
    first_seen: it.start_time,
    last_seen: it.stop_time,
    active: !it.is_inactive,
    metrics: {},
    raw_source: it,
  }));
  const nextCursor = json.paging?.cursors?.after;
  return { ads: normalized, nextCursor, total: normalized.length };
}
