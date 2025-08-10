import express from "express";
import cors from "cors";
import adsRouter from "./routes/ads";
import { initSentry, Sentry } from "./utils/sentry";

export function createApp() {
  initSentry();
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  // Health
  app.get("/healthz", (_req, res) => res.json({ ok: true }));

  // API routes
  app.use("/api/ads", adsRouter);

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: any, res: any, _next: any) => {
    Sentry.captureException(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Internal Server Error" });
  });

  return app;
}

