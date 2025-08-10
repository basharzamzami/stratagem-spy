
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
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
  Users,
  BarChart3,
  Flame,
  DollarSign
} from 'lucide-react';
import { useMockData } from './MockDataProvider';

export default function RichRealTimeMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const { realTimeActivities, campaignMetrics } = useMockData();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
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
      case 'engagement_spike': return <Flame className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatMetricValue = (metric: any) => {
    if (metric.unit === '$') {
      return `$${metric.current.toFixed(2)}`;
    }
    return `${metric.current}${metric.unit}`;
  };

  const getChangePercentage = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {campaignMetrics.map((metric) => (
              <div key={metric.name} className="p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.name}</span>
                  {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                  {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                  {metric.trend === 'stable' && <BarChart3 className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="text-2xl font-bold">
                  {formatMetricValue(metric)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.trend === 'up' && '+'}{getChangePercentage(metric.current, metric.previous)}% vs previous
                </div>
                {metric.trend !== 'stable' && (
                  <div className="mt-2">
                    <Progress 
                      value={Math.min(Math.abs(parseFloat(getChangePercentage(metric.current, metric.previous))), 100)} 
                      className="h-1"
                    />
                  </div>
                )}
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
              <CardTitle className="flex items-center justify-between">
                <span>Live Activity Feed</span>
                <Badge className={`${isMonitoring ? 'bg-success/20 text-success' : 'bg-muted/20 text-muted-foreground'}`}>
                  {isMonitoring ? 'MONITORING' : 'PAUSED'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realTimeActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                    <div className={`p-2 rounded-lg ${getPriorityColor(activity.priority)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {activity.timestamp}
                        </div>
                        <Badge 
                          variant={activity.priority === 'critical' || activity.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.priority.toUpperCase()}
                        </Badge>
                        {activity.data && (
                          <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                    {activity.type === 'conversion' && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-success">
                          ${activity.data?.lead_value.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                    )}
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
                    Active Alerts ({realTimeActivities.filter(a => a.priority === 'critical' || a.priority === 'high').length})
                  </h4>
                  <div className="space-y-3">
                    {realTimeActivities
                      .filter(activity => activity.priority === 'critical' || activity.priority === 'high')
                      .slice(0, 3)
                      .map((activity) => (
                        <div key={activity.id} className={`p-3 rounded-lg border ${getPriorityColor(activity.priority)}`}>
                          <div className="text-sm font-medium">{activity.type.replace('_', ' ').toUpperCase()}</div>
                          <p className="text-xs mt-1 line-clamp-2">
                            {activity.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs">{activity.timestamp}</span>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                              Action
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Opportunities
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-sm font-medium text-success">High Intent Leads Detected</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {campaignMetrics.find(m => m.name === 'Warm Leads')?.current} warm leads in last hour with 90+ intent scores
                      </p>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs mt-2">
                        View Leads
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="text-sm font-medium text-blue-400">Budget Optimization</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Current ROAS of {campaignMetrics.find(m => m.name === 'ROAS')?.current}x suggests room for 30% budget increase
                      </p>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs mt-2">
                        Optimize
                      </Button>
                    </div>

                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-sm font-medium text-purple-400">Viral Ad Opportunity</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Competitor TikTok ad showing viral signs - replicate strategy immediately
                      </p>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs mt-2">
                        Create
                      </Button>
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
                  <h4 className="font-semibold mb-3">Campaign Performance Trends</h4>
                  <div className="bg-gradient-to-r from-primary/20 to-success/20 rounded-lg h-40 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold text-success">+24.5%</div>
                      <div className="text-sm text-muted-foreground">Performance increase this week</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Live Lead Flow</h4>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg h-40 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">
                        {campaignMetrics.find(m => m.name === 'Warm Leads')?.current}
                      </div>
                      <div className="text-sm text-muted-foreground">Active warm leads</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-success" />
                  <div className="text-xl font-bold">$47,830</div>
                  <div className="text-sm text-muted-foreground">Revenue This Month</div>
                </div>
                
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-xl font-bold">
                    {((campaignMetrics.find(m => m.name === 'Conversions')?.current || 0) / (campaignMetrics.find(m => m.name === 'Warm Leads')?.current || 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Lead Conversion Rate</div>
                </div>
                
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <div className="text-xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Viral Ads Detected</div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize All Campaigns
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
