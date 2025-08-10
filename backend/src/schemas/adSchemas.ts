import { z } from "zod";

export const CursorSchema = z.string().optional();

export const AdsQuerySchema = z.object({
  accountId: z.string().min(1),
  competitorId: z.string().min(1).optional(),
  platform: z.enum(["meta", "google", "tiktok"]).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  cursor: CursorSchema,
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export const CounterTaskBodySchema = z.object({
  title: z.string().min(3).max(200),
  priority: z.number().int().min(1).max(3),
  description: z.string().max(1000).optional(),
});

export const AdsListItemSchema = z.object({
  id: z.string().uuid(),
  platform: z.enum(["meta", "google", "tiktok"]),
  copy: z.string(),
  creativeUrls: z.array(z.string().url()),
  cta: z.string().nullable().optional(),
  snapshotUrl: z.string().url().nullable().optional(),
  fetchedAt: z.string(),
  competitorId: z.string(),
});

export const AdsListResponseSchema = z.object({
  items: z.array(AdsListItemSchema),
  nextCursor: z.string().optional(),
});

export const AdDetailResponseSchema = AdsListItemSchema.extend({
  landingUrl: z.string().url(),
  h1: z.string().nullable().optional(),
  h2: z.string().nullable().optional(),
  formPresent: z.boolean(),
  pixelPresent: z.boolean(),
});

export type AdsQueryInput = z.infer<typeof AdsQuerySchema>;
export type CounterTaskBodyInput = z.infer<typeof CounterTaskBodySchema>;
export type AdsListItem = z.infer<typeof AdsListItemSchema>;
export type AdsListResponse = z.infer<typeof AdsListResponseSchema>;
export type AdDetailResponse = z.infer<typeof AdDetailResponseSchema>;

