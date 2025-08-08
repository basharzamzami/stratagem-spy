import { supabase } from "@/integrations/supabase/client";

export type Platform = "meta" | "google" | "youtube" | "tiktok";

export type SearchFilters = {
  business?: string;
  industry?: string;
  location?: { city?: string; state?: string; zip?: string };
  platforms?: Platform[];
  dateRange?: { from?: string; to?: string };
  adFormats?: string[];
  spendRange?: { min?: number; max?: number };
  engagementRange?: { min?: number; max?: number };
};

export type AdItem = {
  id: string;
  platform: Platform;
  competitor_name: string;
  creative_url?: string;
  creative_type?: "image" | "video" | "carousel" | string;
  headline?: string;
  primary_text?: string;
  cta?: string;
  first_seen?: string;
  last_seen?: string;
  active?: boolean;
  metrics?: Record<string, number>;
};

function withTimeout<T>(p: Promise<T>, ms = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
  });
}

export async function fetchLiveAds(filters: SearchFilters, cursor?: string) {
  const promise = supabase.functions.invoke("ad-signal-search", { body: { filters, cursor } });
  const { data, error } = await withTimeout(promise, 5000);
  if (error) throw error;
  return data as { ads: AdItem[]; nextCursor?: string; total?: number };
}

export async function fetchAnalytics(filters: SearchFilters) {
  const promise = supabase.functions.invoke("ad-signal-analytics", { body: { filters } });
  const { data, error } = await withTimeout(promise, 5000);
  if (error) throw error;
  return data as {
    angles: { emotional: number; logical: number };
    offers: Record<string, number>;
    formats: Record<string, number>;
    trends: Array<{ date: string; count: number }>;
  };
}

export async function exportCSV(filters: SearchFilters) {
  const promise = supabase.functions.invoke("ad-signal-export", { body: { filters, type: "csv" } });
  const { data, error } = await withTimeout(promise, 8000);
  if (error) throw error;
  const { filename, mime, base64 } = data as { filename: string; mime: string; base64: string };
  const blob = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([blob], { type: mime }));
  return { url, filename };
}
