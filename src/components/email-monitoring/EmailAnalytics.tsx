
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Eye, 
  MousePointer, 
  Users,
  Calendar,
  Clock,
  Target,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function EmailAnalytics() {
  const performanceData = [
    { month: 'Jan', openRate: 65, clickRate: 12, conversions: 3.2 },
    { month: 'Feb', openRate: 68, clickRate: 14, conversions: 4.1 },
    { month: 'Mar', openRate: 72, clickRate: 16, conversions: 4.8 },
    { month: 'Apr', openRate: 69, clickRate: 13, conversions: 3.9 },
    { month: 'May', openRate: 74, clickRate: 18, conversions: 5.2 },
    { month: 'Jun', openRate: 71, clickRate: 15, conversions: 4.3 }
  ];

  const sequenceData = [
    { name: 'Welcome Series', subscribers: 1247, revenue: 8940 },
    { name: 'Onboarding', subscribers: 892, revenue: 12500 },
    { name: 'Feature Updates', subscribers: 2156, revenue: 3200 },
    { name: 'Reactivation', subscribers: 645, revenue: 2800 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 38, color: '#10B981' },
    { name: 'Tablet', value: 17, color: '#F59E0B' }
  ];

  const topPerformers = [
    { subject: 'Welcome to Specter Insights!', openRate: 89.2, clickRate: 24.1 },
    { subject: 'Your Competitor Analysis is Ready', openRate: 76.5, clickRate: 18.9 },
    { subject: 'New Feature: Real-time Monitoring', openRate: 72.1, clickRate: 16.3 },
    { subject: 'Weekly Market Intelligence Report', openRate: 68.9, clickRate: 14.2 }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Email Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="openRate" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Open Rate (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clickRate" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Click Rate (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="Conversion Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Top Performing Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                    <div className="flex-1">
                      <div className="font-medium text-card-foreground">{email.subject}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="w-3 h-3 text-success" />
                          <span>{email.openRate}% open</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MousePointer className="w-3 h-3 text-primary" />
                          <span>{email.clickRate}% click</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      Top Performer
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Sequence Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sequenceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="subscribers" fill="#3B82F6" name="Subscribers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4 text-success" />
                      Open Rate
                    </span>
                    <span className="text-sm font-bold">71.2%</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-primary" />
                      Click Rate
                    </span>
                    <span className="text-sm font-bold">15.8%</span>
                  </div>
                  <Progress value={16} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      Conversion Rate
                    </span>
                    <span className="text-sm font-bold">4.7%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Best Send Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-success" />
                      <span className="font-medium">Tuesday 10:00 AM</span>
                    </div>
                    <Badge className="bg-success/20 text-success">Best</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium">Thursday 2:00 PM</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Good</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Friday 4:00 PM</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Average</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue by Email Sequence</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sequenceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
