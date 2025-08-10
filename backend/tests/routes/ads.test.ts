import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";

vi.mock("../../src/utils/prisma", () => ({
  prisma: {
    adCreative: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
    },
  },
}));

describe("GET /api/ads", () => {
  const app = createApp();
  it("validates query params", async () => {
    const res = await request(app).get("/api/ads");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/ads/:id", () => {
  const app = createApp();
  it("returns 400 for invalid id", async () => {
    const res = await request(app).get("/api/ads/not-a-uuid");
    expect(res.status).toBe(400);
  });
});

