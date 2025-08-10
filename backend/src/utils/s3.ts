import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

let s3: S3Client | null = null;

export function getS3() {
  if (s3) return s3;
  if (process.env.MOCK_MODE === "true") {
    // In tests, mock uploads by returning a deterministic URL
    s3 = {} as any;
    return s3;
  }
  s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: process.env.AWS_ACCESS_KEY_ID
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      : undefined,
  });
  return s3;
}

export async function uploadScreenshot(buffer: Buffer, contentType = "image/png") {
  const bucket = process.env.S3_BUCKET || "specter-net-ad-snapshots";
  const key = `ad-signal/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.png`;

  if (process.env.MOCK_MODE === "true") {
    // return a fake S3 URL for tests
    return `https://mock-s3/${bucket}/${key}`;
  }

  const client = getS3();
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType, ACL: "private" });
  await (client as S3Client).send(cmd);
  const publicBase = process.env.S3_PUBLIC_BASE_URL; // e.g. CloudFront distribution
  return publicBase ? `${publicBase}/${key}` : `s3://${bucket}/${key}`;
}

