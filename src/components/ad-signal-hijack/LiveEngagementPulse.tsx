
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity,
  Zap, 
  TrendingUp, 
  Eye,
  Target,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';
import { engagementMonitor, HotAdAlert } from '@/services/engagementMonitor';
import { useToast } from '@/hooks/use-toast';

const LiveEngagementPulse = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hotAlerts, setHotAlerts] = useState<HotAdAlert[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [watchlist, setWatchlist] = useState<string[]>(['HubSpot', 'Salesforce', 'Marketo']);
  const { toast } = useToast();

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(async () => {
        setScanProgress(0);
        
        // Simulate scanning progress
        for (let i = 0; i <= 100; i += 20) {
          setTimeout(() => setScanProgress(i), i * 10);
        }
        
        try {
          engagementMonitor.setWatchlist(watchlist);
          const alerts = await engagementMonitor.scanCompetitorAds();
          
          const newAlerts = alerts.filter(alert => 
            !hotAlerts.some(existing => existing.id === alert.id)
          );
          
          if (newAlerts.length > 0) {
            setHotAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
            toast({
              title: "🔥 Hot Ad Detected!",
              description: `${newAlerts.length} competitor ads are spiking in engagement`
            });
          }
        } catch (error) {
          console.error('Scanning error:', error);
        }
      }, 30000); // Scan every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring, hotAlerts, watchlist, toast]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      toast({
        title: "🎯 Live Monitoring Started",
        description: "Scanning competitor ads for engagement spikes..."
      });
    } else {
      toast({
        title: "⏸️ Monitoring Paused",
        description: "Live scanning has been stopped"
      });
    }
  };

  const getVelocityColor = (velocity: number) => {
    if (velocity >= 5) return 'text-red-400';
    if (velocity >= 3) return 'text-orange-400';
    if (velocity >= 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getAlertSeverity = (velocity: number) => {
    if (velocity >= 5) return { level: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (velocity >= 3) return { level: 'HIGH', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { level: 'MEDIUM', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Engagement Pulse
            </div>
            <Button
              onClick={toggleMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Live Scan
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scan Progress</span>
                <span className="text-sm text-muted-foreground">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Watchlist ({watchlist.length})</span>
              <div className="flex flex-wrap gap-1">
                {watchlist.map(competitor => (
                  <Badge key={competitor} variant="secondary" className="text-xs">
                    {competitor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                <span className="text-sm">
                  {isMonitoring ? 'Monitoring Active' : 'Standby Mode'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hot Alerts Feed */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Hot Ad Alerts ({hotAlerts.length})
          </h3>
          {hotAlerts.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setHotAlerts([])}>
              Clear All
            </Button>
          )}
        </div>

        {hotAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isMonitoring ? 'Scanning for hot competitor ads...' : 'Start monitoring to detect engagement spikes'}
              </p>
            </CardContent>
          </Card>
        ) : (
          hotAlerts.map(alert => {
            const severity = getAlertSeverity(alert.engagement_velocity);
            
            return (
              <Alert key={alert.id} className="border-l-4 border-l-orange-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className={severity.color} variant="outline">
                          {severity.level}
                        </Badge>
                        <span className="font-medium ml-2">{alert.competitor}</span>
                        <span className="text-muted-foreground ml-2">on {alert.platform}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getVelocityColor(alert.engagement_velocity)}`}>
                          +{(alert.engagement_velocity * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(alert.detected_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm">"{alert.ad_content}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Target className="w-3 h-3 mr-1" />
                        Launch Counter-Ad
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Analyze Creative
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LiveEngagementPulse;
