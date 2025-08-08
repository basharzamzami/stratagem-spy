// supabase/functions/_shared/types.ts
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
  creative_type?: string;
  headline?: string;
  primary_text?: string;
  cta?: string;
  first_seen?: string;
  last_seen?: string;
  active?: boolean;
  metrics?: Record<string, number>;
  raw_source?: unknown;
};
