
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  Eye, 
  Zap, 
  Clock, 
  Target,
  TrendingUp,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  realTimeCompetitorMonitor, 
  CompetitorActivity, 
  AutoPlaybook 
} from '@/services/realTimeCompetitorMonitor';
import CompetitorActivityFeed from './CompetitorActivityFeed';
import AutoPlaybookManager from './AutoPlaybookManager';

export default function RealTimeMonitorDashboard() {
  const [activities, setActivities] = useState<CompetitorActivity[]>([]);
  const [playbooks, setPlaybooks] = useState<AutoPlaybook[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stats, setStats] = useState({
    activitiesLast24h: 0,
    highImpactAlerts: 0,
    activePlaybooks: 0,
    avgResponseTime: '2.3h'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load initial data
    setActivities(realTimeCompetitorMonitor.getRecentActivities());
    setPlaybooks(realTimeCompetitorMonitor.getAllPlaybooks());
    updateStats();

    // Set up real-time listener
    const unsubscribe = realTimeCompetitorMonitor.onActivity((activity) => {
      setActivities((prev) => [activity, ...prev.slice(0, 19)]); // Keep last 20
      setPlaybooks(realTimeCompetitorMonitor.getAllPlaybooks());
      updateStats();
      
      // Show toast notification
      toast({
        title: `🚨 ${activity.competitor_name} Activity Detected`,
        description: activity.description,
        duration: 5000,
      });
    });

    return unsubscribe;
  }, [toast]);

  const updateStats = () => {
    const recent = realTimeCompetitorMonitor.getRecentActivities();
    const last24h = recent.filter(a => 
      new Date(a.detected_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );
    
    setStats({
      activitiesLast24h: last24h.length,
      highImpactAlerts: recent.filter(a => a.impact_level === 'high' || a.impact_level === 'critical').length,
      activePlaybooks: realTimeCompetitorMonitor.getActivePlaybooks().length,
      avgResponseTime: '2.3h'
    });
  };

  const toggleMonitoring = () => {
    if (!isMonitoring) {
      realTimeCompetitorMonitor.startMonitoring();
      setIsMonitoring(true);
      toast({
        title: "🔍 Monitoring Activated",
        description: "Real-time competitor monitoring is now active"
      });
    } else {
      setIsMonitoring(false);
      toast({
        title: "⏸️ Monitoring Paused",
        description: "Real-time monitoring has been paused"
      });
    }
  };

  const refreshData = () => {
    setActivities(realTimeCompetitorMonitor.getRecentActivities());
    setPlaybooks(realTimeCompetitorMonitor.getAllPlaybooks());
    updateStats();
    
    toast({
      title: "Data Refreshed",
      description: "Latest competitor data loaded"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Real-Time Competitor Monitoring</h2>
          <p className="text-muted-foreground">Automated detection and response to competitor activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={isMonitoring ? "default" : "secondary"}
            className={isMonitoring ? "bg-success text-success-foreground" : ""}
          >
            {isMonitoring ? (
              <>
                <div className="w-2 h-2 rounded-full bg-success-foreground mr-2 animate-pulse" />
                LIVE
              </>
            ) : (
              'PAUSED'
            )}
          </Badge>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={toggleMonitoring} className="flex items-center gap-2">
            {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isMonitoring ? 'Pause' : 'Start'} Monitoring
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.activitiesLast24h}</div>
                <div className="text-sm text-muted-foreground">Activities (24h)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{stats.highImpactAlerts}</div>
                <div className="text-sm text-muted-foreground">High Impact Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{stats.activePlaybooks}</div>
                <div className="text-sm text-muted-foreground">Active Playbooks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{stats.avgResponseTime}</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Activity Feed ({activities.length})
          </TabsTrigger>
          <TabsTrigger value="playbooks" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Auto Playbooks ({playbooks.length})
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Intelligence Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <CompetitorActivityFeed activities={activities} />
        </TabsContent>

        <TabsContent value="playbooks">
          <AutoPlaybookManager 
            playbooks={playbooks} 
            onUpdateStatus={(id, status) => {
              realTimeCompetitorMonitor.updatePlaybookStatus(id, status);
              setPlaybooks(realTimeCompetitorMonitor.getAllPlaybooks());
            }}
          />
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Competitive Intelligence Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Intelligence Analysis Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced pattern recognition and strategic insights from competitor activities
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
