import { Button } from "@/components/ui/button";
import { SearchFilters, exportCSV } from "@/services/adSignal";

export default function ExportControls({ filters }: { filters: SearchFilters }) {
  const copyLink = async () => {
    const url = new URL(window.location.href);
    // encode filters in query params
    url.searchParams.set("filters", encodeURIComponent(JSON.stringify(filters)));
    await navigator.clipboard.writeText(url.toString());
  };

  const exportPDF = async () => {
    const res = await fetch("/functions/v1/ad-signal-export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filters, type: "pdf" }) });
    if (!res.ok) throw new Error("Failed to export PDF");
    const { filename, mime, base64 } = await res.json();
    const blob = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([blob], { type: mime }));
    const a = document.createElement('a'); a.href = url; a.download = filename || 'ad-report.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3">
      <Button onClick={async () => {
        const { url, filename } = await exportCSV(filters);
        const a = document.createElement('a'); a.href = url; a.download = filename || 'ads.csv'; a.click(); URL.revokeObjectURL(url);
      }}>CSV</Button>
      <Button variant="outline" onClick={exportPDF}>PDF</Button>
      <Button variant="secondary" onClick={copyLink}>Copy link</Button>
    </div>
  );
}
