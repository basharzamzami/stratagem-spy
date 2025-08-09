
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Calendar, Award } from 'lucide-react';

const performanceData = [
  { month: 'Jan', leads: 89, deals: 12, revenue: 145000 },
  { month: 'Feb', leads: 124, deals: 18, revenue: 220000 },
  { month: 'Mar', leads: 156, deals: 24, revenue: 280000 },
  { month: 'Apr', leads: 142, deals: 19, revenue: 195000 },
  { month: 'May', leads: 178, deals: 28, revenue: 350000 },
  { month: 'Jun', leads: 203, deals: 32, revenue: 420000 }
];

const sourceData = [
  { name: 'Website', value: 35, color: '#3b82f6' },
  { name: 'Campaign Manager', value: 28, color: '#10b981' },
  { name: 'Referrals', value: 18, color: '#f59e0b' },
  { name: 'LinkedIn', value: 12, color: '#8b5cf6' },
  { name: 'Direct', value: 7, color: '#ef4444' }
];

const competitorMentions = [
  { competitor: 'SimilarWeb', mentions: 45, deals: 8, won: 3 },
  { competitor: 'SEMrush', mentions: 38, deals: 6, won: 2 },
  { competitor: 'Ahrefs', mentions: 32, deals: 5, won: 4 },
  { competitor: 'BuzzSumo', mentions: 24, deals: 4, won: 1 },
  { competitor: 'SpyFu', mentions: 18, deals: 3, won: 2 }
];

export default function CRMAnalytics() {
  const totalRevenue = performanceData.reduce((sum, month) => sum + month.revenue, 0);
  const totalDeals = performanceData.reduce((sum, month) => sum + month.deals, 0);
  const avgDealSize = totalRevenue / totalDeals;
  
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">+32.8%</div>
            <div className="text-sm text-muted-foreground mt-1">Lead generation</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">24.3%</div>
            <div className="text-sm text-muted-foreground mt-1">Lead to deal</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Avg Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">${Math.round(avgDealSize).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Per closed deal</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sales Cycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">28 days</div>
            <div className="text-sm text-muted-foreground mt-1">Avg time to close</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} name="Leads" />
                <Line type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={2} name="Deals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources & Competitor Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {sourceData.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span>{source.name}</span>
                  </div>
                  <span className="font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Competitor Battle Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorMentions.map((comp, idx) => (
                <div key={idx} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-foreground">{comp.competitor}</div>
                    <Badge 
                      variant="outline" 
                      className={comp.won >= comp.deals / 2 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                    >
                      {comp.won}/{comp.deals} won
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Mentions</div>
                      <div className="font-semibold text-foreground">{comp.mentions}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Deals</div>
                      <div className="font-semibold text-foreground">{comp.deals}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Win Rate</div>
                      <div className="font-semibold text-foreground">
                        {Math.round((comp.won / comp.deals) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
