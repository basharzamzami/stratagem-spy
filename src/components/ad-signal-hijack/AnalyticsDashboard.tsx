import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { SearchFilters } from "@/services/adSignal";

export default function AnalyticsDashboard({ filters }: { filters: SearchFilters }) {
  const { data, isFetching, isError } = useQuery({
    queryKey: ["ad-analytics", filters],
    queryFn: async () => {
      const res = await fetch("/functions/v1/ad-signal-analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filters }) });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json() as Promise<{ angles: { emotional: number; logical: number }; offers: Record<string, number>; formats: Record<string, number>; trends: Array<{ date: string; count: number }>; }>;
    },
  });

  return (
    <Card className="saas-card p-6">
      <CardContent>
        <h3 className="text-xl font-semibold mb-4">Ad Analysis Dashboard</h3>
        {isFetching && <div className="text-sm text-muted-foreground">Loading analytics…</div>}
        {isError && <div className="text-sm text-destructive">Failed to load analytics</div>}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer config={{}}>
              <div className="text-sm">Angles: Emotional {data.angles.emotional}, Logical {data.angles.logical}</div>
            </ChartContainer>
            <ChartContainer config={{}}>
              <div className="text-sm">Formats: {Object.entries(data.formats).map(([k,v]) => `${k}:${v}`).join(", ") || '—'}</div>
            </ChartContainer>
            <ChartContainer config={{}}>
              <div className="text-sm">Offers: {Object.entries(data.offers).map(([k,v]) => `${k}:${v}`).join(", ") || '—'}</div>
            </ChartContainer>
            <ChartContainer config={{}}>
              <div className="text-sm">Trend points: {data.trends.length}</div>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
