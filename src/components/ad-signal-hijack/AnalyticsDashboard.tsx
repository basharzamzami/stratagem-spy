
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  DollarSign,
  Eye,
  Activity,
  Users,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

// Mock analytics data
const mockAnalytics = {
  totalAdsTracked: 2847,
  activeCompetitors: 23,
  dailyNewAds: 127,
  topPerformingAd: "TechFlow's Enterprise Demo CTA",
  avgEngagementRate: 4.7,
  totalSpendTracked: 892000,
  trendingKeywords: ['enterprise software', 'AI automation', 'workflow optimization'],
  platformDistribution: [
    { name: 'Meta', value: 45, count: 1281, spend: 394000, color: '#3b82f6' },
    { name: 'Google', value: 32, count: 911, spend: 285000, color: '#ef4444' },
    { name: 'YouTube', value: 15, count: 427, spend: 134000, color: '#10b981' },
    { name: 'TikTok', value: 8, count: 228, spend: 79000, color: '#8b5cf6' }
  ],
  competitorSpending: [
    { name: 'TechFlow Solutions', spending: 67500, ads: 245, engagement: 5.2, trend: 'up' },
    { name: 'DataDriven Analytics', spending: 52000, ads: 189, engagement: 4.8, trend: 'up' },
    { name: 'InnovateNow Corp', spending: 45500, ads: 167, engagement: 3.9, trend: 'down' },
    { name: 'NextGen Dynamics', spending: 38000, ads: 203, engagement: 4.1, trend: 'stable' },
    { name: 'Digital Pioneers', spending: 32500, ads: 134, engagement: 3.7, trend: 'down' }
  ],
  monthlyTrends: [
    { month: 'Sep', ads: 156, spend: 45000, engagement: 3.2 },
    { month: 'Oct', ads: 189, spend: 52000, engagement: 3.8 },
    { month: 'Nov', ads: 234, spend: 67000, engagement: 4.1 },
    { month: 'Dec', ads: 287, spend: 89000, engagement: 4.7 },
    { month: 'Jan', ads: 324, spend: 98000, engagement: 5.1 }
  ],
  adTypeBreakdown: [
    { type: 'Video', count: 1245, percentage: 43.7, avgSpend: 1850 },
    { type: 'Image', count: 892, percentage: 31.3, avgSpend: 1200 },
    { type: 'Carousel', count: 456, percentage: 16.0, avgSpend: 2100 },
    { type: 'Text', count: 254, percentage: 8.9, avgSpend: 780 }
  ]
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <ArrowUpRight className="w-3 h-3 text-green-400" />;
    case 'down': return <ArrowDownRight className="w-3 h-3 text-red-400" />;
    default: return <Minus className="w-3 h-3 text-yellow-400" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up': return 'text-green-400';
    case 'down': return 'text-red-400';
    default: return 'text-yellow-400';
  }
};

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ad Signal Analytics</h2>
          <p className="text-muted-foreground">Real-time competitive advertising intelligence and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Activity className="w-3 h-3 mr-1" />
            Live Tracking
          </Badge>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{mockAnalytics.totalAdsTracked.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Ads Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{mockAnalytics.activeCompetitors}</div>
                <div className="text-sm text-muted-foreground">Active Competitors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{mockAnalytics.dailyNewAds}</div>
                <div className="text-sm text-muted-foreground">New Ads Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">${(mockAnalytics.totalSpendTracked/1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Total Spend Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
          <TabsTrigger value="trends">Trending Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Ad Volume & Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockAnalytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="ads" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ad Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Ad Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.adTypeBreakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{item.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.count}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Avg Spend: ${item.avgSpend.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Competitor Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.competitorSpending.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                          {competitor.name[0]}
                        </div>
                        <div>
                          <div className="font-medium">{competitor.name}</div>
                          <div className="text-sm text-muted-foreground">{competitor.ads} active ads</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(competitor.trend)}
                        <span className="text-sm font-medium">${competitor.spending.toLocaleString()}/mo</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm font-medium">${competitor.spending.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Monthly Spend</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{competitor.ads}</div>
                        <div className="text-xs text-muted-foreground">Active Ads</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{competitor.engagement}%</div>
                        <div className="text-xs text-muted-foreground">Avg Engagement</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalytics.platformDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockAnalytics.platformDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.platformDistribution.map((platform, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: platform.color }}
                          />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ${(platform.spend / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {platform.count} ads • {platform.value}% share
                      </div>
                      <Progress value={platform.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trending Keywords & Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockAnalytics.trendingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                      #{keyword}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Top performing ad copy mentions these keywords 73% more frequently than last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockAnalytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
