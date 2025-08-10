import * as Sentry from "@sentry/node";

let inited = false;

export function initSentry() {
  if (inited) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });
  inited = true;
}

export { Sentry };

