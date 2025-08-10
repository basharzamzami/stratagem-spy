export type Platform = "meta" | "google" | "tiktok";

export interface AdListItem {
  id: string;
  platform: Platform;
  copy: string;
  creativeUrls: string[];
  cta?: string | null;
  snapshotUrl?: string | null;
  fetchedAt: string; // ISO
  competitorId: string;
}

export interface AdsListResponse {
  items: AdListItem[];
  nextCursor?: string;
}

export interface AdDetail extends AdListItem {
  landingUrl: string;
  h1?: string | null;
  h2?: string | null;
  formPresent: boolean;
  pixelPresent: boolean;
}

export interface CounterTaskBody {
  title: string;
  priority: number; // 1 High, 2 Medium, 3 Low
  description?: string;
}

