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

export async function fetchLiveAds(filters: SearchFilters, cursor?: string) {
  const { data, error } = await supabase.functions.invoke("ad-signal-search", {
    body: { filters, cursor },
  });
  if (error) throw error;
  return data as { ads: AdItem[]; nextCursor?: string; total?: number };
}

export async function fetchAnalytics(filters: SearchFilters) {
  const { data, error } = await supabase.functions.invoke("ad-signal-analytics", {
    body: { filters },
  });
  if (error) throw error;
  return data as {
    angles: { emotional: number; logical: number };
    offers: Record<string, number>;
    formats: Record<string, number>;
    trends: Array<{ date: string; count: number }>;
  };
}

export async function exportCSV(filters: SearchFilters) {
  const { data, error } = await supabase.functions.invoke("ad-signal-export", {
    body: { filters, type: "csv" },
  });
  if (error) throw error;
  // data: { filename: string, mime: string, base64: string }
  const { filename, mime, base64 } = data as { filename: string; mime: string; base64: string };
  const blob = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([blob], { type: mime }));
  return { url, filename };
}
