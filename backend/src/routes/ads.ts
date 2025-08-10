import express from "express";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { AdsQuerySchema, CounterTaskBodySchema, AdDetailResponseSchema, AdsListResponseSchema } from "../schemas/adSchemas";

const router = express.Router();

router.get("/", async (req, res) => {
  const parse = AdsQuerySchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid query", details: parse.error.flatten() });
  }
  const { accountId, competitorId, platform, pageSize, dateFrom, dateTo, cursor } = parse.data;

  // Cursor: base64 of { fetchedAt, id }
  let cursorObj: { fetchedAt: string; id: string } | null = null;
  if (cursor) {
    try {
      cursorObj = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    } catch {}
  }

  const where: any = { accountId };
  if (competitorId) where.competitorId = competitorId;
  if (platform) where.platform = platform;
  if (dateFrom || dateTo) where.fetchedAt = { gte: dateFrom, lte: dateTo };

  // keyset pagination condition
  if (cursorObj) {
    const cursorDate = new Date(cursorObj.fetchedAt);
    where.AND = [
      {
        OR: [
          { fetchedAt: { lt: cursorDate } },
          { AND: [{ fetchedAt: cursorDate }, { id: { lt: cursorObj.id } }] },
        ],
      },
    ];
  }

  const items = await prisma.adCreative.findMany({
    where,
    orderBy: [{ fetchedAt: "desc" }, { id: "desc" }],
    take: pageSize + 1,
    select: {
      id: true,
      platform: true,
      copy: true,
      creativeUrls: true,
      cta: true,
      snapshotUrl: true,
      fetchedAt: true,
      competitorId: true,
    },
  });

  let nextCursor: string | undefined;
  if (items.length > pageSize) {
    const next = items[pageSize];
    nextCursor = Buffer.from(JSON.stringify({ fetchedAt: next.fetchedAt.toISOString(), id: next.id }), "utf8").toString("base64");
    items.pop();
  }

  const payload = { items: items.map((i) => ({ ...i, fetchedAt: i.fetchedAt.toISOString() })), nextCursor };
  const validated = AdsListResponseSchema.safeParse(payload);
  if (!validated.success) return res.status(500).json({ error: "Validation failed" });
  return res.json(validated.data);
});

router.get("/:id", async (req, res) => {
  const id = z.string().uuid().safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "Invalid id" });

  const ad = await prisma.adCreative.findUnique({ where: { id: id.data } });
  if (!ad) return res.status(404).json({ error: "Not found" });

  const payload = {
    id: ad.id,
    platform: ad.platform as any,
    copy: ad.copy,
    creativeUrls: ad.creativeUrls,
    cta: ad.cta,
    snapshotUrl: ad.snapshotUrl,
    fetchedAt: ad.fetchedAt.toISOString(),
    competitorId: ad.competitorId,
    landingUrl: ad.landingUrl,
    h1: ad.h1,
    h2: ad.h2,
    formPresent: ad.formPresent,
    pixelPresent: ad.pixelPresent,
  };
  const validated = AdDetailResponseSchema.safeParse(payload);
  if (!validated.success) return res.status(500).json({ error: "Validation failed" });
  return res.json(validated.data);
});

router.post("/:id/counter-task", async (req, res) => {
  const id = z.string().uuid().safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "Invalid id" });
  const body = CounterTaskBodySchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body", details: body.error.flatten() });

  const ad = await prisma.adCreative.findUnique({ where: { id: id.data } });
  if (!ad) return res.status(404).json({ error: "Ad not found" });

  // Handle duplicate creation by id+title uniqueness within same ad
  const existing = await prisma.task.findFirst({ where: { adId: ad.id, title: body.data.title } });
  if (existing) return res.status(200).json({ id: existing.id, duplicate: true });

  const created = await prisma.task.create({
    data: {
      adId: ad.id,
      title: body.data.title,
      priority: body.data.priority,
      description: body.data.description,
    },
    select: { id: true },
  });
  return res.status(201).json(created);
});

export default router;

