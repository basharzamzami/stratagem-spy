import { describe, it, expect, vi, beforeAll } from "vitest";
import * as metaApi from "../../src/services/metaApi";
import { runOnce } from "../../src/workers/adFetcher";

vi.mock("../../src/utils/prisma", () => ({
  prisma: {
    competitor: { findMany: vi.fn().mockResolvedValue([{ id: "c1", accountId: "a1", advertiser: "Acme", platform: "meta", isActive: true }]) },
    adCreative: { createMany: vi.fn().mockResolvedValue({ count: 1 }) },
  },
}));

vi.spyOn(metaApi, "fetchAdsByAdvertiser").mockResolvedValue([
  {
    platform: "meta",
    advertiserName: "Acme",
    copy: "Hello",
    cta: "Learn More",
    landingUrl: "https://example.com",
    assets: [{ type: "image", url: "https://img" }],
    fetchedAt: new Date(),
  },
]);

beforeAll(() => {
  process.env.MOCK_MODE = "true";
});

describe("workers/adFetcher", () => {
  it("inserts fetched ads", async () => {
    await expect(runOnce()).resolves.toBeUndefined();
  });
});

