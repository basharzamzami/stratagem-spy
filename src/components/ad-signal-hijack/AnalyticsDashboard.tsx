
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { SearchFilters } from "@/services/adSignal";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts';

const COLORS = ['#6E56CF', '#22C55E', '#EF4444', '#F59E0B', '#06B6D4', '#A78BFA'];

interface AnalyticsDashboardProps {
  filters: SearchFilters;
  data?: {
    angles: { emotional: number; logical: number };
    offers: Record<string, number>;
    formats: Record<string, number>;
    trends: Array<{ date: string; count: number }>;
  };
  isLoading: boolean;
}

export default function AnalyticsDashboard({ filters, data, isLoading }: AnalyticsDashboardProps) {
  const angleData = data ? [
    { name: 'Emotional', value: data.angles.emotional },
    { name: 'Logical', value: data.angles.logical },
  ] : [];
  const formatData = data ? Object.entries(data.formats).map(([k,v]) => ({ name: k, value: v })) : [];
  const offerData = data ? Object.entries(data.offers).map(([k,v]) => ({ name: k, value: v })) : [];
  const trendData = data?.trends || [];

  return (
    <Card className="saas-card p-6">
      <CardContent>
        <h3 className="text-xl font-semibold mb-4">Ad Analysis Dashboard</h3>
        {isLoading && <AnalyticsSkeleton />}
        {!data && !isLoading && <div className="text-sm text-muted-foreground">No analytics data available</div>}
        {data && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={angleData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                    {angleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={formatData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Bar dataKey="value" fill="#6E56CF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={offerData} dataKey="value" nameKey="name" outerRadius={80}>
                    {offerData.map((entry, index) => (
                      <Cell key={`cell-offer-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Line type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2} dot={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
