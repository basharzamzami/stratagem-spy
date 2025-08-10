
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Zap, 
  Eye, 
  Users, 
  Activity,
  Brain,
  Settings,
  BarChart3,
  TrendingUp,
  Flame
} from 'lucide-react';

// Import mock data components
import { MockDataProvider, useMockData } from '@/components/ad-signal-hijack/MockDataProvider';
import EnhancedHotAdCard from '@/components/ad-signal-hijack/EnhancedHotAdCard';
import RichWarmLeadDetector from '@/components/ad-signal-hijack/RichWarmLeadDetector';
import RichRealTimeMonitor from '@/components/ad-signal-hijack/RichRealTimeMonitor';
import PsychTriggerAnalyzer from '@/components/ad-signal-hijack/PsychTriggerAnalyzer';
import WatchlistManager from '@/components/ad-signal-hijack/WatchlistManager';

function EnhancedAdSignalHijackContent() {
  const { hotAds, alerts, tasks } = useMockData();
  
  // Get critical metrics for header
  const criticalAds = hotAds.filter(ad => ad.velocity === 'critical' || ad.velocity === 'viral').length;
  const totalEngagementSpikes = hotAds.reduce((sum, ad) => sum + ad.engagementSpike, 0);
  const activeAlerts = alerts.filter(alert => !alert.dismissed).length;
  const urgentTasks = tasks.filter(task => task.priority === 1).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Live Stats */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Ad Signal Hijack Command Center</h1>
              <p className="text-muted-foreground">Real-time competitor intelligence & campaign weaponization</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-success/20 text-success animate-pulse">
                LIVE MONITORING
              </Badge>
              <Badge className="bg-primary/20 text-primary">
                {hotAds.length} Hot Ads Tracked
              </Badge>
            </div>
          </div>
          
          {/* Live Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <div>
                  <div className="text-lg font-bold text-red-400">{criticalAds}</div>
                  <div className="text-xs text-muted-foreground">Critical Ads</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <div>
                  <div className="text-lg font-bold text-success">{totalEngagementSpikes}</div>
                  <div className="text-xs text-muted-foreground">Total Spikes</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-lg font-bold">{activeAlerts}</div>
                  <div className="text-xs text-muted-foreground">Active Alerts</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-lg font-bold text-orange-400">{urgentTasks}</div>
                  <div className="text-xs text-muted-foreground">Urgent Tasks</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-lg font-bold">4.8x</div>
                  <div className="text-xs text-muted-foreground">Avg ROAS</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-lg font-bold">147</div>
                  <div className="text-xs text-muted-foreground">Warm Leads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="hot-ads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hot-ads" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Hot Ads
            </TabsTrigger>
            <TabsTrigger value="warm-leads" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Warm Leads
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="psych-analyzer" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Psych Analyzer
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hot-ads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-400" />
                    Hot Ads Intelligence
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View All
                    </Button>
                    <Button size="sm">
                      <Zap className="w-3 h-3 mr-1" />
                      Mass Deploy
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotAds.map((ad) => (
                  <EnhancedHotAdCard key={ad.id} ad={ad} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warm-leads" className="space-y-6">
            <RichWarmLeadDetector />
          </TabsContent>

          <TabsContent value="monitor" className="space-y-6">
            <RichRealTimeMonitor />
          </TabsContent>

          <TabsContent value="psych-analyzer" className="space-y-6">
            <PsychTriggerAnalyzer />
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <WatchlistManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration & Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Monitoring Settings</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Scan Frequency</div>
                        <div className="text-sm text-muted-foreground">Every 2 minutes</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Alert Threshold</div>
                        <div className="text-sm text-muted-foreground">200% engagement spike</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Integration Status</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <div>
                          <div className="font-medium">Meta Ads Library</div>
                          <div className="text-sm text-muted-foreground">Connected</div>
                        </div>
                        <Badge className="bg-success/20 text-success">Active</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <div>
                          <div className="font-medium">Google Ads API</div>
                          <div className="text-sm text-muted-foreground">Connected</div>
                        </div>
                        <Badge className="bg-success/20 text-success">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function EnhancedAdSignalHijack() {
  return (
    <MockDataProvider>
      <EnhancedAdSignalHijackContent />
    </MockDataProvider>
  );
}
