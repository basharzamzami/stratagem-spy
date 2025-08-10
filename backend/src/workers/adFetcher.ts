import { prisma } from "../utils/prisma";
import { getRedis } from "../utils/redis";
import { Sentry, initSentry } from "../utils/sentry";
import { fetchAdsByAdvertiser } from "../services/metaApi";
import { hashAd } from "../utils/hash";
import type { RawAd } from "../types/ad.types";

const DEFAULT_INTERVAL_MINUTES = parseInt(process.env.FETCH_INTERVAL_MINUTES || "30", 10);

function metric(name: string, value = 1, tags?: Record<string, string | number>) {
  // Placeholder for metrics backend; can be wired to StatsD/CloudWatch/etc.
  if (process.env.NODE_ENV !== "production") {
    console.log("metric", name, value, tags);
  }
}

export async function runOnce() {
  initSentry();
  const redis = getRedis();

  const competitors = await prisma.competitor.findMany({ where: { isActive: true } });

  for (const comp of competitors) {
    try {
      if (comp.platform !== "meta") continue; // Only meta for now
      const ads: RawAd[] = await fetchAdsByAdvertiser(comp.advertiser);
      const toInsert: any[] = [];

      for (const ad of ads) {
        const creativeUrls = ad.assets.map((a) => a.url);
        const hash = hashAd({ platform: ad.platform, advertiserName: ad.advertiserName, copy: ad.copy, cta: ad.cta, landingUrl: ad.landingUrl, creativeUrls });

        const dedupKey = `ad:dedup:${hash}`;
        const locked = await redis.setnx(dedupKey, "1");
        if (locked === 1) {
          await redis.expire(dedupKey, 30); // 30s TTL to avoid immediate dupes
        } else {
          metric("ads_duplicated", 1, { competitorId: comp.id });
          continue;
        }

        toInsert.push({
          accountId: comp.accountId,
          competitorId: comp.id,
          platform: ad.platform,
          copy: ad.copy,
          creativeUrls,
          cta: ad.cta,
          landingUrl: ad.landingUrl,
          fetchedAt: ad.fetchedAt,
          hash,
        });
      }

      if (toInsert.length) {
        const created = await prisma.adCreative.createMany({ data: toInsert, skipDuplicates: true });
        metric("ads_fetched", created.count, { competitorId: comp.id });
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error("adFetcher error", err);
    }
  }
}

export async function startScheduler() {
  await runOnce();
  const intervalMs = DEFAULT_INTERVAL_MINUTES * 60 * 1000;
  setInterval(runOnce, intervalMs);
}

// ESM-compatible direct-run detection
const isDirectRun = typeof process !== "undefined" && process.argv[1] && process.argv[1].includes("adFetcher");
if (isDirectRun) {
  startScheduler().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

