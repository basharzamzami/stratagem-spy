
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Users, 
  Clock,
  Play,
  Pause,
  Settings,
  BarChart3
} from 'lucide-react';
import EmailCampaignList from './EmailCampaignList';
import EmailAnalytics from './EmailAnalytics';
import EmailSequenceBuilder from './EmailSequenceBuilder';

interface EmailSequence {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  emails_count: number;
  subscribers: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  created_at: string;
  last_sent: string;
}

interface EmailMetrics {
  total_sequences: number;
  total_subscribers: number;
  avg_open_rate: number;
  avg_click_rate: number;
  emails_sent_today: number;
  revenue_generated: number;
}

export default function EmailSequenceMonitor() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API calls
  const mockSequences: EmailSequence[] = [
    {
      id: '1',
      name: 'Welcome Series',
      status: 'active',
      emails_count: 5,
      subscribers: 1247,
      open_rate: 68.5,
      click_rate: 12.3,
      conversion_rate: 4.2,
      created_at: '2025-01-01',
      last_sent: '2 hours ago'
    },
    {
      id: '2',
      name: 'Competitor Analysis Onboarding',
      status: 'active',
      emails_count: 7,
      subscribers: 892,
      open_rate: 72.1,
      click_rate: 15.8,
      conversion_rate: 6.1,
      created_at: '2025-01-05',
      last_sent: '1 day ago'
    },
    {
      id: '3',
      name: 'Feature Announcement',
      status: 'paused',
      emails_count: 3,
      subscribers: 2156,
      open_rate: 45.2,
      click_rate: 8.7,
      conversion_rate: 2.1,
      created_at: '2025-01-10',
      last_sent: '3 days ago'
    }
  ];

  const mockMetrics: EmailMetrics = {
    total_sequences: 8,
    total_subscribers: 4295,
    avg_open_rate: 61.9,
    avg_click_rate: 12.3,
    emails_sent_today: 156,
    revenue_generated: 24750
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'paused': return 'bg-warning/20 text-warning border-warning/30';
      case 'draft': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'completed': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Active Sequences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{mockMetrics.total_sequences}</div>
              <Mail className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{mockMetrics.total_subscribers.toLocaleString()}</div>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Avg Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{mockMetrics.avg_open_rate}%</div>
              <Eye className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Avg Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{mockMetrics.avg_click_rate}%</div>
              <MousePointer className="w-5 h-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Emails Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{mockMetrics.emails_sent_today}</div>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">${mockMetrics.revenue_generated.toLocaleString()}</div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sequences Quick View */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Active Email Sequences
            </div>
            <Button size="sm">
              <Play className="w-4 h-4 mr-2" />
              New Sequence
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSequences.filter(seq => seq.status === 'active').map((sequence) => (
              <div key={sequence.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-card-foreground">{sequence.name}</div>
                    <div className="text-sm text-card-foreground/60">
                      {sequence.emails_count} emails • {sequence.subscribers} subscribers
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-card-foreground">{sequence.open_rate}%</div>
                    <div className="text-xs text-card-foreground/60">Open Rate</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-card-foreground">{sequence.click_rate}%</div>
                    <div className="text-xs text-card-foreground/60">Click Rate</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-card-foreground">{sequence.conversion_rate}%</div>
                    <div className="text-xs text-card-foreground/60">Conversion</div>
                  </div>
                  
                  <Badge className={getStatusColor(sequence.status)}>
                    {sequence.status}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pause className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Open Rate Trend</span>
                      <span className="text-sm text-success">+5.2%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Click Rate Trend</span>
                      <span className="text-sm text-success">+2.1%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm text-warning">-0.3%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Welcome Series - Email 3 sent</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">New subscriber added to Onboarding</div>
                      <div className="text-xs text-muted-foreground">4 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Feature Announcement paused</div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <EmailCampaignList sequences={mockSequences} />
        </TabsContent>

        <TabsContent value="analytics">
          <EmailAnalytics />
        </TabsContent>

        <TabsContent value="builder">
          <EmailSequenceBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
