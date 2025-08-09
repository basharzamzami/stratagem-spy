
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingDown,
  DollarSign, 
  Eye,
  Users,
  Target,
  Download,
  BarChart3,
  Zap,
  ArrowDown,
  ArrowUp,
  Calendar
} from 'lucide-react';

interface DrainMetrics {
  competitor: string;
  traffic_stolen: number;
  revenue_diverted: number;
  ad_spend_saved: number;
  engagement_hijacked: number;
  conversion_rate: number;
  hijack_efficiency: number;
  time_period: string;
}

const AdDrainReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  
  const drainData: DrainMetrics[] = [
    {
      competitor: 'HubSpot',
      traffic_stolen: 2850,
      revenue_diverted: 45000,
      ad_spend_saved: 12000,
      engagement_hijacked: 15200,
      conversion_rate: 8.4,
      hijack_efficiency: 92,
      time_period: '24h'
    },
    {
      competitor: 'Salesforce',
      traffic_stolen: 1920,
      revenue_diverted: 32000,
      ad_spend_saved: 8500,
      engagement_hijacked: 11400,
      conversion_rate: 6.8,
      hijack_efficiency: 87,
      time_period: '24h'
    },
    {
      competitor: 'Marketo',
      traffic_stolen: 1450,
      revenue_diverted: 28000,
      ad_spend_saved: 6200,
      engagement_hijacked: 8900,
      conversion_rate: 9.2,
      hijack_efficiency: 89,
      time_period: '24h'
    }
  ];

  const totalMetrics = drainData.reduce((acc, curr) => ({
    traffic_stolen: acc.traffic_stolen + curr.traffic_stolen,
    revenue_diverted: acc.revenue_diverted + curr.revenue_diverted,
    ad_spend_saved: acc.ad_spend_saved + curr.ad_spend_saved,
    engagement_hijacked: acc.engagement_hijacked + curr.engagement_hijacked
  }), {
    traffic_stolen: 0,
    revenue_diverted: 0,
    ad_spend_saved: 0,
    engagement_hijacked: 0
  });

  const avgConversionRate = drainData.reduce((sum, curr) => sum + curr.conversion_rate, 0) / drainData.length;
  const avgHijackEfficiency = drainData.reduce((sum, curr) => sum + curr.hijack_efficiency, 0) / drainData.length;

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-400';
    if (efficiency >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const exportReport = () => {
    // Mock export functionality
    console.log('Exporting drain report...');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-red-500" />
            Ad Drain Report
          </h2>
          <p className="text-muted-foreground">Traffic and revenue diverted from competitors</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-background border border-border rounded px-3 py-1 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {totalMetrics.traffic_stolen.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Traffic Stolen</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
                  <ArrowUp className="w-3 h-3" />
                  +23% vs yesterday
                </div>
              </div>
              <Users className="w-8 h-8 text-red-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  ${totalMetrics.revenue_diverted.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Revenue Diverted</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  +18% vs yesterday
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  ${totalMetrics.ad_spend_saved.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Ad Spend Saved</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-blue-400">
                  <ArrowDown className="w-3 h-3" />
                  Their loss, your gain
                </div>
              </div>
              <Target className="w-8 h-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {avgHijackEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Hijack Efficiency</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-purple-400">
                  <Zap className="w-3 h-3" />
                  Avg across all campaigns
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Tabs defaultValue="competitors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="competitors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            By Competitor
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="competitors" className="space-y-6">
          <div className="grid gap-4">
            {drainData.map((competitor, index) => (
              <Card key={competitor.competitor} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{competitor.competitor}</h3>
                        <p className="text-sm text-muted-foreground">Primary target</p>
                      </div>
                    </div>
                    <Badge className={`${getEfficiencyColor(competitor.hijack_efficiency)} bg-transparent border`} variant="outline">
                      {competitor.hijack_efficiency}% Efficient
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Traffic Stolen</div>
                      <div className="text-xl font-bold text-red-400">
                        {competitor.traffic_stolen.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Revenue Diverted</div>
                      <div className="text-xl font-bold text-green-400">
                        ${competitor.revenue_diverted.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Engagement Hijacked</div>
                      <div className="text-xl font-bold text-blue-400">
                        {competitor.engagement_hijacked.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                      <div className="text-xl font-bold text-purple-400">
                        {competitor.conversion_rate}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Hijack Efficiency</span>
                      <span className={getEfficiencyColor(competitor.hijack_efficiency)}>
                        {competitor.hijack_efficiency}%
                      </span>
                    </div>
                    <Progress value={competitor.hijack_efficiency} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                    <span>Ad Spend Saved: ${competitor.ad_spend_saved.toLocaleString()}</span>
                    <span>ROI: +{(((competitor.revenue_diverted - competitor.ad_spend_saved) / competitor.ad_spend_saved) * 100).toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hijack Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drainData.map(competitor => (
                    <div key={competitor.competitor} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{competitor.competitor}</span>
                        <span className="text-sm text-muted-foreground">
                          {competitor.hijack_efficiency}%
                        </span>
                      </div>
                      <Progress value={competitor.hijack_efficiency} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Revenue Diverted</span>
                    <span className="font-bold text-success">
                      ${totalMetrics.revenue_diverted.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Cost Investment</span>
                    <span className="font-bold">
                      ${totalMetrics.ad_spend_saved.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-medium">Net Profit</span>
                    <span className="font-bold text-success">
                      ${(totalMetrics.revenue_diverted - totalMetrics.ad_spend_saved).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ROI</span>
                    <span className="font-bold text-success">
                      +{(((totalMetrics.revenue_diverted - totalMetrics.ad_spend_saved) / totalMetrics.ad_spend_saved) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hijack Timeline Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive timeline chart would be rendered here</p>
                  <p className="text-sm text-muted-foreground mt-1">Showing hijack performance over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdDrainReport;
