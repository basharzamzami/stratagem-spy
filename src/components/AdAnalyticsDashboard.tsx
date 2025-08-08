
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Brain, 
  Heart, 
  Gift, 
  Clock, 
  Image, 
  Video, 
  Layout,
  TrendingUp,
  Target
} from 'lucide-react';

const AdAnalyticsDashboard = () => {
  // Mock analytics data
  const angleData = [
    { name: 'Emotional', value: 65, color: '#ef4444' },
    { name: 'Logical', value: 45, color: '#3b82f6' },
    { name: 'Mixed', value: 25, color: '#8b5cf6' }
  ];

  const offerData = [
    { name: 'Free Trial', count: 156 },
    { name: 'Discount', count: 134 },
    { name: 'Limited Time', count: 89 },
    { name: 'Guarantee', count: 67 },
    { name: 'Free Resource', count: 45 }
  ];

  const formatData = [
    { name: 'Image', value: 45 },
    { name: 'Video', value: 35 },
    { name: 'Carousel', value: 15 },
    { name: 'Collection', value: 5 }
  ];

  const trendData = [
    { date: '2024-01-01', emotional: 45, logical: 32, mixed: 18 },
    { date: '2024-01-02', emotional: 52, logical: 28, mixed: 22 },
    { date: '2024-01-03', emotional: 48, logical: 35, mixed: 19 },
    { date: '2024-01-04', emotional: 65, logical: 45, mixed: 25 },
    { date: '2024-01-05', emotional: 58, logical: 42, mixed: 28 },
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ad Intelligence Analytics</h2>
          <p className="text-muted-foreground">Decode competitor strategies and creative patterns</p>
        </div>
        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
          <TrendingUp className="w-3 h-3 mr-1" />
          847 Ads Analyzed
        </Badge>
      </div>

      {/* Quick Insights */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Emotional Appeal</div>
                <div className="text-xl font-bold text-foreground">65%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Logical Appeal</div>
                <div className="text-xl font-bold text-foreground">45%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Urgency Elements</div>
                <div className="text-xl font-bold text-foreground">78%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Offer-Based</div>
                <div className="text-xl font-bold text-foreground">89%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Angle Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Appeal Strategy Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {angleData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name} Appeal</span>
                    <span className="text-sm text-muted-foreground">{item.value} ads</span>
                  </div>
                  <Progress value={(item.value / Math.max(...angleData.map(d => d.value))) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offer Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Top Offer Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={offerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Creative Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Creative Format Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={formatData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {formatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {formatData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Appeal Trends (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="emotional" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="logical" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mixed" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insight Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Rising Trend</h4>
                <p className="text-sm text-muted-foreground">Free trial offers increased 34% this week across SaaS competitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Urgency Tactics</h4>
                <p className="text-sm text-muted-foreground">"Limited time" appears in 78% of high-performing ads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Video className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Video Dominance</h4>
                <p className="text-sm text-muted-foreground">Video ads show 2.3x higher engagement than static images</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdAnalyticsDashboard;
