
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, 
  Zap, 
  Eye, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users
} from 'lucide-react';

interface LiveActivity {
  id: string;
  type: 'lead_detected' | 'competitor_ad' | 'campaign_update' | 'conversion';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  data?: any;
}

interface CampaignMetric {
  name: string;
  current: number;
  previous: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export default function RealTimeMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoAdjust, setAutoAdjust] = useState(true);

  const liveActivities: LiveActivity[] = [
    {
      id: '1',
      type: 'lead_detected',
      message: 'New warm lead detected: "marketing automation pricing" search from Austin, TX',
      timestamp: '2 seconds ago',
      priority: 'high'
    },
    {
      id: '2',
      type: 'competitor_ad',
      message: 'HubSpot increased ad spend by 40% in San Francisco market',
      timestamp: '1 minute ago',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'conversion',
      message: 'Campaign "HubSpot Alternative" generated qualified lead from hijacked traffic',
      timestamp: '3 minutes ago',
      priority: 'high'
    },
    {
      id: '4',
      type: 'campaign_update',
      message: 'Auto-bid adjustment: Increased CPC to $3.20 for high-intent keywords',
      timestamp: '5 minutes ago',
      priority: 'low'
    }
  ];

  const campaignMetrics: CampaignMetric[] = [
    { name: 'Warm Leads', current: 147, previous: 134, unit: '', trend: 'up' },
    { name: 'CTR', current: 4.2, previous: 3.8, unit: '%', trend: 'up' },
    { name: 'CPC', current: 2.40, previous: 2.80, unit: '$', trend: 'down' },
    { name: 'Conversions', current: 12, previous: 8, unit: '', trend: 'up' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead_detected': return <Users className="w-4 h-4" />;
      case 'competitor_ad': return <Eye className="w-4 h-4" />;
      case 'campaign_update': return <Target className="w-4 h-4" />;
      case 'conversion': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Monitor Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-Time Campaign Monitor
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Auto-Adjust</span>
                <Switch 
                  checked={autoAdjust}
                  onCheckedChange={setAutoAdjust}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
                <span className="text-sm">{isMonitoring ? 'Live' : 'Paused'}</span>
                <Switch 
                  checked={isMonitoring}
                  onCheckedChange={setIsMonitoring}
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {campaignMetrics.map((metric) => (
              <div key={metric.name} className="p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.name}</span>
                  {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                  {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                </div>
                <div className="text-2xl font-bold">
                  {metric.unit === '$' && '$'}{metric.current}{metric.unit !== '$' && metric.unit}
                </div>
                <div className="text-xs text-muted-foreground">
                  vs {metric.unit === '$' && '$'}{metric.previous}{metric.unit !== '$' && metric.unit} previous
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live Activity
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Smart Alerts
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-lg ${getPriorityColor(activity.priority)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        <Badge 
                          variant={activity.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Active Alerts
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-sm font-medium text-red-400">High Competitor Activity</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        HubSpot increased ad frequency by 60% in your target markets
                      </p>
                    </div>
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="text-sm font-medium text-orange-400">Bid Adjustment Needed</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        CPC increased 25% for high-intent keywords
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Opportunities
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-sm font-medium text-success">Warm Lead Surge</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        147 new warm leads detected in last hour
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="text-sm font-medium text-blue-400">Budget Opportunity</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Under-budget by 30% with room to scale
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Campaign Performance</h4>
                  <div className="bg-gradient-to-r from-primary/20 to-success/20 rounded-lg h-32 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Lead Flow Visualization</h4>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg h-32 flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Detailed Report
                </Button>
                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
