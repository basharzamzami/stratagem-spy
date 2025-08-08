import { Button } from "@/components/ui/button";
import { SearchFilters, exportCSV } from "@/services/adSignal";

export default function ExportControls({ filters }: { filters: SearchFilters }) {
  return (
    <div className="flex gap-3">
      <Button onClick={async () => {
        const { url, filename } = await exportCSV(filters);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'ads.csv';
        a.click();
        URL.revokeObjectURL(url);
      }}>CSV</Button>
      <Button variant="outline" disabled>PDF</Button>
    </div>
  );
}
