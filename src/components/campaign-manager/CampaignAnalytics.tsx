
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Zap } from 'lucide-react';

const performanceData = [
  { date: '01/08', spend: 890, conversions: 42, roas: 3.2 },
  { date: '01/09', spend: 1120, conversions: 56, roas: 3.8 },
  { date: '01/10', spend: 980, conversions: 48, roas: 3.5 },
  { date: '01/11', spend: 1340, conversions: 73, roas: 4.1 },
  { date: '01/12', spend: 1180, conversions: 61, roas: 3.9 },
  { date: '01/13', spend: 1450, conversions: 89, roas: 4.3 },
  { date: '01/14', spend: 1280, conversions: 67, roas: 3.7 }
];

const platformData = [
  { name: 'Google', value: 45, color: '#4285F4' },
  { name: 'Meta', value: 32, color: '#1877F2' },
  { name: 'YouTube', value: 15, color: '#FF0000' },
  { name: 'TikTok', value: 8, color: '#FE2C55' }
];

const CampaignAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground/70">Total Spend</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">$8,240</div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                +23%
              </Badge>
            </div>
            <p className="text-xs text-card-foreground/70 mt-2">vs. last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground/70">Conversions</CardTitle>
              <Target className="w-4 h-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">436</div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18%
              </Badge>
            </div>
            <p className="text-xs text-card-foreground/70 mt-2">vs. last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground/70">Average ROAS</CardTitle>
              <Zap className="w-4 h-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">3.7x</div>
              <Badge variant="secondary" className="bg-warning/20 text-warning">
                <TrendingDown className="w-3 h-3 mr-1" />
                -5%
              </Badge>
            </div>
            <p className="text-xs text-card-foreground/70 mt-2">vs. last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground/70">Avg. CPA</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">$18.90</div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                -12%
              </Badge>
            </div>
            <p className="text-xs text-card-foreground/70 mt-2">vs. last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Daily Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Line 
                  type="monotone" 
                  dataKey="spend" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {platformData.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm text-card-foreground">{platform.name}</span>
                  <span className="text-sm text-card-foreground/70">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROAS Performance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">ROAS by Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Bar 
                dataKey="roas" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAnalytics;
