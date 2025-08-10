// Shared types for Ad Signal Hijack backend
// These types are kept framework-agnostic and used across services, routes and workers.

export type Platform = "meta" | "google" | "tiktok";

export interface RawAdAsset {
  type: "image" | "video" | "unknown";
  url: string;
}

export interface RawAd {
  platform: Platform;
  advertiserName: string;
  copy: string;
  cta?: string;
  landingUrl: string;
  assets: RawAdAsset[]; // images/videos
  fetchedAt: Date;
  // provider-specific metadata for troubleshooting
  providerMeta?: Record<string, unknown>;
}

export interface AdCreativeCreateInput {
  accountId: string;
  competitorId: string;
  platform: Platform;
  copy: string;
  creativeUrls: string[];
  cta?: string;
  landingUrl: string;
  fetchedAt: Date;
  hash: string;
}

export interface PaginationCursor {
  fetchedAt: string; // ISO string
  id: string; // tie-breaker
}

export interface AdsQuery {
  accountId: string;
  competitorId?: string;
  platform?: Platform;
  dateFrom?: Date;
  dateTo?: Date;
  pageSize: number;
  cursor?: string; // base64-encoded PaginationCursor
}

export interface AdsListItem {
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
  items: AdsListItem[];
  nextCursor?: string;
}

export interface AdDetailResponse extends AdsListItem {
  landingUrl: string;
  h1?: string | null;
  h2?: string | null;
  formPresent: boolean;
  pixelPresent: boolean;
}

export interface CounterTaskCreateInput {
  title: string;
  priority: number; // 1..3
  description?: string;
}

export interface MetricsEmitter {
  incr: (name: string, value?: number, tags?: Record<string, string | number>) => void;
  gauge?: (name: string, value: number, tags?: Record<string, string | number>) => void;
}

export interface RateLimiterConfig {
  bucketKey: string;
  tokensPerInterval: number;
  intervalMs: number;
  maxBurst?: number;
}

