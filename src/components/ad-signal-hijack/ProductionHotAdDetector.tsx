
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
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Cpu,
  BarChart3
} from 'lucide-react';
import { productionHotAdDetector, HotAdAlert } from '@/services/productionHotAdDetector';
import { counterAdJobManager, CounterAdJob } from '@/services/counterAdJobManager';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProductionHotAdDetector = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hotAlerts, setHotAlerts] = useState<HotAdAlert[]>([]);
  const [counterAdJobs, setCounterAdJobs] = useState<CounterAdJob[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    hot_ads_detected_last_hour: 0,
    engagement_events_processed: 0,
    avg_detection_latency: 0,
    system_status: 'stopped' as const
  });
  const [scanProgress, setScanProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
    
    const interval = setInterval(() => {
      if (isMonitoring) {
        loadRealtimeData();
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const loadInitialData = async () => {
    try {
      // Load recent hot ad alerts
      const { data: alertsData } = await supabase
        .from('hot_ad_alerts')
        .select('*')
        .order('detect_time', { ascending: false })
        .limit(20);

      if (alertsData) {
        setHotAlerts(alertsData.map(alert => ({
          ad_id: alert.ad_id,
          platform: alert.platform,
          competitor_id: alert.competitor_id,
          detect_time: alert.detect_time,
          velocity_score: alert.velocity_score,
          baseline: alert.baseline,
          primary_triggers: alert.primary_triggers || [],
          creative_dna_id: alert.creative_dna_id,
          snapshot_url: alert.snapshot_url,
          status: alert.status
        })));
      }

      // Load active counter-ad jobs
      const activeJobs = await counterAdJobManager.getActiveJobs();
      setCounterAdJobs(activeJobs);

      // Load system metrics
      const metrics = await productionHotAdDetector.getSystemMetrics();
      setSystemMetrics(metrics);

    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const metrics = await productionHotAdDetector.getSystemMetrics();
      setSystemMetrics(metrics);
      
      // Load new alerts
      const { data: newAlerts } = await supabase
        .from('hot_ad_alerts')
        .select('*')
        .order('detect_time', { ascending: false })
        .limit(5);

      if (newAlerts && newAlerts.length > 0) {
        const formattedAlerts = newAlerts.map(alert => ({
          ad_id: alert.ad_id,
          platform: alert.platform,
          competitor_id: alert.competitor_id,
          detect_time: alert.detect_time,
          velocity_score: alert.velocity_score,
          baseline: alert.baseline,
          primary_triggers: alert.primary_triggers || [],
          creative_dna_id: alert.creative_dna_id,
          snapshot_url: alert.snapshot_url,
          status: alert.status
        }));

        setHotAlerts(prev => {
          const existingIds = new Set(prev.map(a => a.ad_id));
          const newOnes = formattedAlerts.filter(a => !existingIds.has(a.ad_id));
          return [...newOnes, ...prev].slice(0, 20);
        });
      }

    } catch (error) {
      console.error('Failed to load realtime data:', error);
    }
  };

  const toggleMonitoring = async () => {
    try {
      if (isMonitoring) {
        await productionHotAdDetector.stopMonitoring();
        setIsMonitoring(false);
        toast({
          title: "⏸️ Detection Stopped",
          description: "Hot Ad detection service has been stopped"
        });
      } else {
        await productionHotAdDetector.startMonitoring();
        setIsMonitoring(true);
        toast({
          title: "🚀 Detection Started", 
          description: "Scanning competitor ads for engagement spikes..."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle monitoring service",
        variant: "destructive"
      });
    }
  };

  const createCounterAd = async (alert: HotAdAlert) => {
    if (!alert.creative_dna_id) {
      toast({
        title: "Creative DNA Missing",
        description: "Wait for Creative DNA extraction to complete",
        variant: "destructive"
      });
      return;
    }

    try {
      setScanProgress(20);
      const job = await counterAdJobManager.createCounterAdJob(
        alert.ad_id,
        alert.creative_dna_id,
        'manual'
      );
      setScanProgress(100);

      setCounterAdJobs(prev => [job, ...prev]);
      
      toast({
        title: "✅ Counter-Ad Created",
        description: `Generated ${job.variants.length} variants for ${alert.ad_id}`
      });

      setTimeout(() => setScanProgress(0), 1000);

    } catch (error) {
      setScanProgress(0);
      toast({
        title: "Creation Failed",
        description: "Failed to create counter-ad job",
        variant: "destructive"
      });
    }
  };

  const approveCounterAd = async (jobId: string) => {
    try {
      await counterAdJobManager.approveJob(jobId);
      
      setCounterAdJobs(prev =>
        prev.map(job =>
          job.job_id === jobId ? { ...job, status: 'scheduled' } : job
        )
      );

      toast({
        title: "✅ Job Approved",
        description: "Counter-ad job approved and scheduled"
      });

    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve counter-ad job",
        variant: "destructive"
      });
    }
  };

  const deployCounterAd = async (jobId: string) => {
    try {
      const result = await counterAdJobManager.deployJob(jobId);
      
      if (result.success) {
        setCounterAdJobs(prev =>
          prev.map(job =>
            job.job_id === jobId ? { ...job, status: 'deployed' } : job
          )
        );

        toast({
          title: "🚀 Deployment Success",
          description: "Counter-ad deployed to platforms"
        });
      }

    } catch (error) {
      toast({
        title: "Deployment Failed", 
        description: "Failed to deploy counter-ad",
        variant: "destructive"
      });
    }
  };

  const getVelocityColor = (velocity: number) => {
    if (velocity >= 80) return 'text-red-400';
    if (velocity >= 60) return 'text-orange-400';
    if (velocity >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'detected': return 'destructive';
      case 'processing': return 'secondary';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Production Hot Ad Detection System
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleMonitoring}
                variant={isMonitoring ? "destructive" : "default"}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Detection
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Detection
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* System Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {systemMetrics.system_status === 'active' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium capitalize">
                  {systemMetrics.system_status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                HOTAD-001 Service
              </div>
            </div>

            {/* Detection Metrics */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {systemMetrics.hot_ads_detected_last_hour} Hot Ads/Hour
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {systemMetrics.engagement_events_processed} Events Processed
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {systemMetrics.avg_detection_latency.toFixed(1)}s Latency
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Target: less than 5min end-to-end
              </div>
            </div>

            {/* Scan Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing</span>
                <span className="text-sm text-muted-foreground">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hot Ad Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Hot Ad Alerts ({hotAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hotAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isMonitoring ? 'Scanning for hot ads...' : 'Start monitoring to detect hot ads'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hotAlerts.map(alert => (
                <Alert key={alert.ad_id} className="border-l-4 border-l-orange-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusBadgeVariant(alert.status)}>
                            {alert.status.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{alert.ad_id}</span>
                          <Badge variant="outline">{alert.platform}</Badge>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getVelocityColor(alert.velocity_score)}`}>
                            {alert.velocity_score}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(alert.detect_time).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Competitor</div>
                          <div className="font-medium">{alert.competitor_id}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Triggers</div>
                          <div className="font-medium">
                            {alert.primary_triggers.length > 0 ? 
                              alert.primary_triggers.join(', ') : 
                              'Extracting...'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Baseline</div>
                          <div className="font-medium">{alert.baseline.toFixed(1)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => createCounterAd(alert)}
                          disabled={!alert.creative_dna_id || scanProgress > 0}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Create Counter-Ad
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          View DNA
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Counter-Ad Jobs */}
      {counterAdJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Counter-Ad Jobs ({counterAdJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {counterAdJobs.map(job => (
                <div key={job.job_id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">vs {job.original_ad_id}</div>
                      <div className="text-sm text-muted-foreground">
                        {job.variants.length} variants • ${job.estimated_cost}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={job.status === 'deployed' ? 'default' : 'secondary'}>
                        {job.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {job.scheduled_time && (
                        <>
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(job.scheduled_time).toLocaleTimeString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Show first variant as preview */}
                  {job.variants.length > 0 && (
                    <div className="p-3 bg-muted/30 rounded">
                      <div className="font-medium text-sm">{job.variants[0].headline}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Strategy: {job.variants[0].strategy} • CTR: {(job.variants[0].predicted_ctr_score * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {job.status === 'pending_approval' && (
                      <Button 
                        size="sm" 
                        onClick={() => approveCounterAd(job.job_id)}
                      >
                        ✅ Approve
                      </Button>
                    )}
                    {job.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        onClick={() => deployCounterAd(job.job_id)}
                      >
                        🚀 Deploy
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      📊 Analytics
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionHotAdDetector;
