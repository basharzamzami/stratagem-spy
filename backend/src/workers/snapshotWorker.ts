import { chromium } from "playwright";
import { prisma } from "../utils/prisma";
import { uploadScreenshot } from "../utils/s3";
import { Sentry, initSentry } from "../utils/sentry";

const CONCURRENCY = parseInt(process.env.SNAPSHOT_CONCURRENCY || "3", 10);

async function analyzePage(page: any) {
  const h1 = await page.$eval("h1", (el: any) => el?.textContent?.trim() || "").catch(() => "");
  const h2 = await page.$eval("h2", (el: any) => el?.textContent?.trim() || "").catch(() => "");
  const formPresent = !!(await page.$("form"));

  // Detect basic tracking pixels
  const pixelPresent = await page.evaluate(() => {
    // @ts-ignore
    const hasFbq = typeof window.fbq === "function";
    // @ts-ignore
    const hasGtm = !!(window.dataLayer && Array.isArray(window.dataLayer));
    const scripts = Array.from(document.scripts).map((s) => s.src || "");
    const hasGtmTag = scripts.some((s) => s.includes("gtm.js") || s.includes("googletagmanager"));
    const hasMeta = scripts.some((s) => s.includes("connect.facebook.net"));
    return hasFbq || hasGtm || hasGtmTag || hasMeta;
  }).catch(() => false);

  return { h1, h2, formPresent, pixelPresent };
}

export async function processAd(adId: string) {
  initSentry();
  const ad = await prisma.adCreative.findUnique({ where: { id: adId } });
  if (!ad) return;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  try {
    await page.goto(ad.landingUrl, { timeout: 15000, waitUntil: "domcontentloaded" });
    const analysis = await analyzePage(page);
    const buffer = await page.screenshot({ fullPage: true, type: "png" });
    const s3Url = await uploadScreenshot(buffer as Buffer, "image/png");

    await prisma.adCreative.update({
      where: { id: ad.id },
      data: { ...analysis, snapshotUrl: s3Url },
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error("snapshotWorker error", err);
    throw err;
  } finally {
    await browser.close();
  }
}

export async function runQueue() {
  // For simplicity, process recently created ads without snapshot
  const pending = await prisma.adCreative.findMany({
    where: { snapshotUrl: null },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  const chunks: typeof pending[] = [];
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    chunks.push(pending.slice(i, i + CONCURRENCY));
  }

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map((ad) =>
        processAd(ad.id).catch((e) => {
          // retry once after small delay
          return new Promise((resolve) => setTimeout(resolve, 1500)).then(() => processAd(ad.id)).catch(() => null);
        })
      )
    );
  }
}

if (require.main === module) {
  runQueue().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

