import { describe, it, expect } from "vitest";
import { fetchAdsByAdvertiser } from "../../src/services/metaApi";

// Run with: MOCK_MODE=true vitest run backend/tests/services/metaApi.test.ts

describe("metaApi.fetchAdsByAdvertiser", () => {
  it("returns mock ads in MOCK_MODE", async () => {
    process.env.MOCK_MODE = "true";
    const res = await fetchAdsByAdvertiser("Acme Corp");
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].platform).toBe("meta");
    expect(res[0].advertiserName).toBe("Acme Corp");
  });
});

