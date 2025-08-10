import { getRedis } from "../utils/redis";
import { Sentry } from "../utils/sentry";
import { RawAd } from "../types/ad.types";

// Token bucket rate limiter using Redis
async function acquireToken(bucketKey: string, tokensPerInterval: number, intervalMs: number, maxBurst = tokensPerInterval) {
  const redis = getRedis();
  const now = Date.now();
  const stateKey = `ratelimit:${bucketKey}`;
  const lastRefillKey = `${stateKey}:ts`;
  const tokensKey = `${stateKey}:tokens`;

  const [lastRefillRaw, tokensRaw] = await Promise.all([redis.get(lastRefillKey), redis.get(tokensKey)]);
  const lastRefill = lastRefillRaw ? parseInt(lastRefillRaw, 10) : now;
  const tokens = tokensRaw ? parseFloat(tokensRaw) : maxBurst;
  const elapsed = Math.max(0, now - lastRefill);
  const refill = (elapsed / intervalMs) * tokensPerInterval;
  const currentTokens = Math.min(maxBurst, tokens + refill);

  if (currentTokens >= 1) {
    await Promise.all([
      redis.set(lastRefillKey, String(now), "EX", Math.ceil(intervalMs / 1000) * 5),
      redis.set(tokensKey, String(currentTokens - 1), "EX", Math.ceil(intervalMs / 1000) * 5),
    ]);
    return true;
  }
  return false;
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchAdsByAdvertiser(advertiserName: string, since?: Date): Promise<RawAd[]> {
  const MOCK = process.env.MOCK_MODE === "true" || !process.env.META_ADS_ACCESS_TOKEN;
  const RATE = { tokensPerInterval: 10, intervalMs: 1000, maxBurst: 20 };
  const bucketKey = `meta:${advertiserName.toLowerCase()}`;

  const tryFetch = async () => {
    if (!(await acquireToken(bucketKey, RATE.tokensPerInterval, RATE.intervalMs, RATE.maxBurst))) {
      await sleep(150);
      return tryFetch();
    }

    if (MOCK) {
      const now = new Date();
      return [
        {
          platform: "meta",
          advertiserName,
          copy: `Great offer from ${advertiserName}! Save big today.`,
          cta: "Shop Now",
          landingUrl: "https://example.com/offers",
          assets: [
            { type: "image", url: "https://via.placeholder.com/600x400.png?text=Ad" },
          ],
          fetchedAt: now,
          providerMeta: { mock: true },
        },
      ] satisfies RawAd[];
    }

    const token = process.env.META_ADS_ACCESS_TOKEN!;
    const base = process.env.META_ADS_BASE || "https://graph.facebook.com/v18.0";

    const params = new URLSearchParams({
      access_token: token,
      search_terms: advertiserName,
      ad_active_status: "ALL",
      fields: [
        "ad_snapshot_url",
        "page_name",
        "ad_creative_body",
        "cta_text",
        "ad_creative_link_caption",
        "ad_creative_link_title",
        "ad_delivery_start_time",
      ].join(","),
      limit: "25",
    });
    if (since) params.set("since", Math.floor(since.getTime() / 1000).toString());

    const url = `${base}/ads_archive?${params.toString()}`;

    let attempt = 0;
    while (attempt < 5) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Meta API ${res.status}: ${text}`);
        }
        const json: any = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        const normalized: RawAd[] = data.map((item: any) => {
          const assets = [] as RawAd["assets"];
          if (item.ad_snapshot_url) {
            assets.push({ type: "image", url: item.ad_snapshot_url });
          }
          const copy = item.ad_creative_body || item.ad_creative_link_title || "";
          return {
            platform: "meta",
            advertiserName,
            copy,
            cta: item.cta_text || undefined,
            landingUrl: item.ad_creative_link_caption || "https://example.com",
            assets,
            fetchedAt: new Date(),
            providerMeta: { id: item.id },
          } as RawAd;
        });
        return normalized;
      } catch (err: any) {
        attempt += 1;
        const backoff = Math.min(1000 * 2 ** attempt, 10_000) + Math.random() * 250;
        Sentry.captureException?.(err, { level: "warning", tags: { module: "metaApi" } } as any);
        await sleep(backoff);
      }
    }
    return [];
  };

  return tryFetch();
}

