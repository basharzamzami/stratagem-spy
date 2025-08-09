// supabase/functions/ad-signal-export/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

function toBase64(u8: Uint8Array) {
  let s = "";
  u8.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), { ...init, headers: { "content-type": "application/json", ...(init.headers || {}) } });
}

serve(async (req) => {
  const { filters = {}, type = "csv" } = await req.json().catch(() => ({ filters: {}, type: "csv" }));

  if (type === "csv") {
    const header = "id,platform,competitor,headline\n";
    const csv = new TextEncoder().encode(header);
    return json({ filename: "ads.csv", mime: "text/csv", base64: toBase64(csv) });
  }

  if (type === "pdf") {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const title = "Ad Signal Hijack Report";
    const sub = `Generated: ${new Date().toISOString()}`;
    const body = `Filters: ${JSON.stringify(filters).slice(0, 1000)}`;

    page.drawText(title, { x: 48, y: 740, size: 24, font, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(sub, { x: 48, y: 712, size: 10, font, color: rgb(0.35, 0.35, 0.35) });

    const wrap = (s: string, n = 90) => s.match(new RegExp(`.{1,${n}}`, 'g')) || [];
    let y = 680;
    for (const line of wrap(body)) {
      page.drawText(line, { x: 48, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 16;
      if (y < 60) break;
    }

    const pdfBytes = await pdfDoc.save();
    return json({ filename: "ad-report.pdf", mime: "application/pdf", base64: toBase64(new Uint8Array(pdfBytes)) });
  }

  return json({ error: "Unsupported export type" }, { status: 400 });
});
