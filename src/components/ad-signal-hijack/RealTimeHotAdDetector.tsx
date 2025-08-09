
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
  Clock
} from 'lucide-react';
import { hotAdDetector, HotAdAlert, CounterAdJob, EngagementSnapshot } from '@/services/hotAdDetector';
import { hotAdMonitoring, AcceptanceCriteria } from '@/services/hotAdMonitoring';
import { useToast } from '@/hooks/use-toast';

const RealTimeHotAdDetector = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hotAlerts, setHotAlerts] = useState<HotAdAlert[]>([]);
  const [counterAdJobs, setCounterAdJobs] = useState<CounterAdJob[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<AcceptanceCriteria[]>([]);
  const [performanceSummary, setPerformanceSummary] = useState({
    avg_detection_latency: 0,
    avg_classification_accuracy: 0,
    avg_generation_time: 0,
    test_pass_rate: 0
  });
  const [watchlist] = useState<string[]>(['HubSpot', 'Salesforce', 'Marketo', 'ActiveCampaign']);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial monitoring data
    setAcceptanceCriteria(hotAdMonitoring.getAcceptanceCriteria());
    setPerformanceSummary(hotAdMonitoring.getPerformanceSummary());

    if (isMonitoring) {
      const interval = setInterval(async () => {
        await runDetectionCycle();
      }, 30000); // Run every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const runDetectionCycle = async () => {
    setScanProgress(0);
    
    try {
      // Simulate progress
      setScanProgress(20);
      
      // Generate mock engagement data for competitors
      const mockEngagementData = generateMockEngagementData();
      setScanProgress(40);

      // Process engagement data through real detector
      const startTime = Date.now();
      const newAlerts = await hotAdDetector.processEngagementData(mockEngagementData);
      const detectionLatency = Date.now() - startTime;
      
      // Record performance metric
      hotAdMonitoring.recordMetric('detection_latency', detectionLatency, 5000);
      setScanProgress(60);

      // Process any new alerts
      for (const alert of newAlerts) {
        // Extract creative DNA
        const mockAdContent = generateMockAdContent(alert.ad_id);
        const creativeDNA = await hotAdDetector.extractCreativeDNA(
          mockAdContent.content, 
          mockAdContent.headline
        );
        
        // Update alert with triggers
        alert.primary_triggers = [creativeDNA.hook_type];
        alert.creative_dna_id = creativeDNA.dna_id;
        
        // Record classification accuracy (mock)
        hotAdMonitoring.recordMetric('classification_accuracy', creativeDNA.confidence_scores[creativeDNA.hook_type], 0.9);
        
        setScanProgress(80);
        
        // Generate counter-ad if velocity is high enough
        if (alert.velocity_score >= 60) {
          const counterAdStart = Date.now();
          const counterAd = await hotAdDetector.generateCounterAd(
            alert.ad_id, 
            creativeDNA, 
            mockAdContent.content
          );
          const generationTime = Date.now() - counterAdStart;
          
          hotAdMonitoring.recordMetric('generation_time', generationTime, 60000);
          setCounterAdJobs(prev => [counterAd, ...prev].slice(0, 10));
        }
      }

      setScanProgress(100);
      
      // Update alerts state
      if (newAlerts.length > 0) {
        setHotAlerts(prev => [...newAlerts, ...prev].slice(0, 15));
        
        toast({
          title: "🔥 Hot Ads Detected!",
          description: `${newAlerts.length} competitor ads showing engagement spikes`
        });
      }

      // Update monitoring data
      setAcceptanceCriteria(hotAdMonitoring.getAcceptanceCriteria());
      setPerformanceSummary(hotAdMonitoring.getPerformanceSummary());

    } catch (error) {
      console.error('Detection cycle error:', error);
      toast({
        title: "Detection Error",
        description: "Failed to process engagement data",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setScanProgress(0), 1000);
    }
  };

  const generateMockEngagementData = (): EngagementSnapshot[] => {
    const snapshots: EngagementSnapshot[] = [];
    const now = Date.now();
    
    watchlist.forEach((competitor, idx) => {
      // Generate multiple ads per competitor
      for (let adIdx = 0; adIdx < 3; adIdx++) {
        const adId = `${competitor.toLowerCase()}_ad_${adIdx}`;
        
        // Create engagement pattern (some with spikes)
        for (let timeIdx = 0; timeIdx < 10; timeIdx++) {
          const timestamp = new Date(now - (timeIdx * 2 * 60 * 1000)).toISOString();
          
          // Simulate spike for some ads
          const isSpike = Math.random() < 0.1 && timeIdx < 3;
          const baseEngagement = 10 + Math.random() * 20;
          const spikeMultiplier = isSpike ? 3 + Math.random() * 2 : 1;
          
          snapshots.push({
            ad_id: adId,
            timestamp,
            likes: Math.floor(baseEngagement * spikeMultiplier * 0.6),
            comments: Math.floor(baseEngagement * spikeMultiplier * 0.2),
            shares: Math.floor(baseEngagement * spikeMultiplier * 0.1),
            clicks: Math.floor(baseEngagement * spikeMultiplier * 0.4),
            impressions: Math.floor(baseEngagement * spikeMultiplier * 10)
          });
        }
      }
    });
    
    return snapshots;
  };

  const generateMockAdContent = (adId: string) => {
    const templates = [
      {
        headline: "Discover the Secret Formula",
        content: "Unlock the hidden strategy that top performers use to dominate their market. Limited time access."
      },
      {
        headline: "Don't Miss This Opportunity", 
        content: "Before it's too late - secure your competitive advantage with our proven system."
      },
      {
        headline: "Join the Elite Circle",
        content: "Exclusive access for industry leaders. Premium tools for premium results."
      }
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      toast({
        title: "🎯 Real-Time Detection Started",
        description: "Scanning competitor engagement patterns..."
      });
    } else {
      toast({
        title: "⏸️ Detection Paused",
        description: "Real-time monitoring stopped"
      });
    }
  };

  const runAcceptanceTests = async () => {
    toast({
      title: "🧪 Running Acceptance Tests",
      description: "Testing system components..."
    });

    const results = await hotAdMonitoring.runAcceptanceTests();
    const passedTests = results.filter(r => r.passed).length;
    
    toast({
      title: "✅ Tests Complete",
      description: `${passedTests}/${results.length} tests passed`
    });

    setAcceptanceCriteria(hotAdMonitoring.getAcceptanceCriteria());
  };

  const approveCounterAd = (jobId: string) => {
    setCounterAdJobs(prev => 
      prev.map(job => 
        job.job_id === jobId 
          ? { ...job, status: 'approved' as const }
          : job
      )
    );
    
    toast({
      title: "✅ Counter-Ad Approved",
      description: "Ad will be launched according to schedule"
    });
  };

  const getVelocityColor = (velocity: number) => {
    if (velocity >= 80) return 'text-red-400';
    if (velocity >= 60) return 'text-orange-400'; 
    if (velocity >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const systemHealth = hotAdMonitoring.getSystemHealth();

  return (
    <div className="space-y-6">
      {/* System Health & Controls */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-Time HotAd Detection System
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={runAcceptanceTests}>
                🧪 Run Tests
              </Button>
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
                {systemHealth.overall_status === 'healthy' ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
                <span className="text-sm font-medium capitalize">
                  {systemHealth.overall_status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {systemHealth.passing_criteria}/{systemHealth.total_criteria} criteria passing
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Avg Detection: {performanceSummary.avg_detection_latency.toFixed(0)}ms</span>
              <div className="text-xs text-muted-foreground">
                Classification: {(performanceSummary.avg_classification_accuracy * 100).toFixed(1)}%
              </div>
            </div>

            {/* Scan Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scan Progress</span>
                <span className="text-sm text-muted-foreground">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>

            {/* Watchlist */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Monitoring ({watchlist.length})</span>
              <div className="flex flex-wrap gap-1">
                {watchlist.slice(0, 3).map(competitor => (
                  <Badge key={competitor} variant="secondary" className="text-xs">
                    {competitor}
                  </Badge>
                ))}
                {watchlist.length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{watchlist.length - 3}</Badge>
                )}
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
                {isMonitoring ? 'Scanning engagement patterns...' : 'Start monitoring to detect hot ads'}
              </p>
            </CardContent>
          </Card>
        ) : (
          hotAlerts.map(alert => (
            <Alert key={alert.ad_id} className="border-l-4 border-l-orange-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-orange-500/20 text-orange-400">
                        VELOCITY SPIKE
                      </Badge>
                      <span className="font-medium">{alert.ad_id}</span>
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
                      <div className="text-muted-foreground">Primary Triggers</div>
                      <div className="font-medium">{alert.primary_triggers.join(', ')}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Confidence</div>
                      <div className="font-medium">{(alert.confidence * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Relative Increase</div>
                      <div className="font-medium">+{(alert.relative_increase * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Target className="w-3 h-3 mr-1" />
                      Launch Counter-Ad
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      View Analysis
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))
        )}
      </div>

      {/* Counter-Ad Jobs */}
      {counterAdJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Generated Counter-Ads ({counterAdJobs.length})
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
                        {job.creative_variants.length} variants • Est. ${job.estimated_cost}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={job.status === 'approved' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(job.scheduled_time).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {job.creative_variants.slice(0, 1).map((variant, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded">
                        <div className="font-medium text-sm">{variant.headline}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Strategy: {variant.strategy} • CTA: {variant.cta}
                        </div>
                      </div>
                    ))}
                  </div>

                  {job.status === 'created' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => approveCounterAd(job.job_id)}
                      >
                        ✅ Approve & Launch
                      </Button>
                      <Button size="sm" variant="outline">
                        ✏️ Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acceptance Criteria Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Acceptance Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {acceptanceCriteria.map(criteria => (
              <div key={`${criteria.feature}_${criteria.criteria}`} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium text-sm">{criteria.feature}.{criteria.criteria}</div>
                  <div className="text-xs text-muted-foreground">
                    Current: {criteria.current_value} | Target: {criteria.target_value}
                  </div>
                </div>
                <Badge variant={criteria.status === 'passing' ? 'default' : criteria.status === 'failing' ? 'destructive' : 'secondary'}>
                  {criteria.status === 'passing' ? '✅' : criteria.status === 'failing' ? '❌' : '⏳'} {criteria.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeHotAdDetector;
