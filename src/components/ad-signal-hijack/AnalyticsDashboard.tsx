import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export default function AnalyticsDashboard() {
  return (
    <Card className="saas-card p-6">
      <CardContent>
        <h3 className="text-xl font-semibold mb-4">Ad Analysis Dashboard</h3>
        <ChartContainer config={{}}>
          {/* Charts will be added after backend integration */}
          <div className="flex items-center justify-center text-muted-foreground">Charts coming soon</div>
        </ChartContainer>
        <ChartLegend content={<ChartLegendContent />} />
      </CardContent>
    </Card>
  );
}
