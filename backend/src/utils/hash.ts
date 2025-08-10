import crypto from "crypto";

export function hashAd(data: {
  platform: string;
  advertiserName?: string;
  copy: string;
  cta?: string;
  landingUrl: string;
  creativeUrls: string[];
}) {
  const h = crypto.createHash("sha256");
  h.update(data.platform);
  if (data.advertiserName) h.update(data.advertiserName);
  h.update(data.copy);
  if (data.cta) h.update(data.cta);
  h.update(data.landingUrl);
  for (const u of data.creativeUrls) h.update(u);
  return h.digest("hex");
}

