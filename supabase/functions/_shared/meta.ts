// supabase/functions/_shared/meta.ts
import { AdItem, SearchFilters } from "./types.ts";

const META_BASE = "https://graph.facebook.com/v18.0";

export async function fetchMetaAds(filters: SearchFilters, cursor?: string) {
  const token = Deno.env.get("META_ADS_ACCESS_TOKEN");
  if (!token) {
    return { ads: [], nextCursor: undefined, total: 0 };
  }
  const url = new URL(`${META_BASE}/ads_archive`);
  url.searchParams.set("access_token", token);
  // NOTE: fields and params must be adapted to your app’s permissions and use case.
  url.searchParams.set("ad_type", "POLITICAL_AND_ISSUE_ADS"); // placeholder constraint
  if (filters.business) url.searchParams.set("search_terms", filters.business);
  if (cursor) url.searchParams.set("after", cursor);
  if (filters.dateRange?.from) url.searchParams.set("start_date", filters.dateRange.from);
  if (filters.dateRange?.to) url.searchParams.set("end_date", filters.dateRange.to);

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
    creative_type: guessFormat(it),
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

function guessFormat(it: any): string {
  const snap: string | undefined = it?.ad_snapshot_url;
  if (snap?.includes("video")) return "video";
  return "image";
}
