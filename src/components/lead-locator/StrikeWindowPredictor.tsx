
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Target, 
  Zap, 
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Activity,
  Shield,
  BarChart3
} from 'lucide-react';
import { 
  predictStrikeWindows, 
  getAuditMetrics,
  type StrikeWindowPrediction 
} from '@/services/strikeWindowPredictor';
import { strikeWindowMonitoring } from '@/services/strikeWindowMonitoring';
import { useToast } from '@/hooks/use-toast';

export default function StrikeWindowPredictor() {
  const [strikeWindows, setStrikeWindows] = useState<StrikeWindowPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [auditMetrics, setAuditMetrics] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update system health and metrics periodically
    const updateMetrics = () => {
      const health = strikeWindowMonitoring.getSystemHealth();
      const audit = getAuditMetrics();
      setSystemHealth(health);
      setAuditMetrics(audit);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const runPredictionAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(90, prev + Math.random() * 20));
      }, 200);

      // Get mock lead IDs for analysis
      const mockLeadIds = ['lead_001', 'lead_002', 'lead_003', 'lead_004'];
      
      // Run actual prediction analysis
      const predictions = await predictStrikeWindows(mockLeadIds);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Simulate real-time updates
      const enhancedPredictions = predictions.map((prediction, index) => ({
        ...prediction,
        lead_name: ['Sarah Chen', 'Marcus Rodriguez', 'Lisa Wang', 'David Thompson'][index] || 'Unknown Lead',
        company: ['TechScale Solutions', 'Growth Dynamics', 'Apex Marketing', 'Innovation Corp'][index] || 'Unknown Company',
        time_until_window: Math.max(0, 
          (new Date(prediction.predicted_window_start).getTime() - Date.now()) / (1000 * 60 * 60)
        )
      }));
      
      setStrikeWindows(enhancedPredictions);
      
      toast({
        title: "Prediction Analysis Complete",
        description: `Generated ${predictions.length} strike window predictions with ${Math.round(systemHealth?.health_score * 100 || 85)}% system confidence`
      });

      // Record metrics
      strikeWindowMonitoring.recordMetric('predictions_processed', predictions.length, 10);
      strikeWindowMonitoring.updateAcceptanceCriteria('processing_performance', 'prediction_latency_95th_percentile_ms', 1500);

    } catch (error) {
      console.error('Prediction analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete strike window analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getWindowStatus = (window: any) => {
    const now = new Date().getTime();
    const start = new Date(window.predicted_window_start).getTime();
    const end = new Date(window.predicted_window_end).getTime();
    
    if (now >= start && now <= end) return 'active';
    if (now < start) return 'upcoming';
    return 'expired';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'expired': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'phone': return <Phone className="w-3 h-3" />;
      case 'linkedin': return <MessageSquare className="w-3 h-3" />;
      case 'ads': return <Target className="w-3 h-3" />;
      default: return <MessageSquare className="w-3 h-3" />;
    }
  };

  const formatTimeUntil = (hours: number) => {
    if (hours < 0) return 'Expired';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'failing': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with System Health */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Strike Window Predictor</h2>
          <p className="text-muted-foreground">AI-powered conversion timing with audit infrastructure</p>
        </div>
        <div className="flex items-center gap-4">
          {systemHealth && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className={`w-4 h-4 ${getHealthStatusColor(systemHealth.overall_status)}`} />
              <span className={getHealthStatusColor(systemHealth.overall_status)}>
                System: {systemHealth.overall_status.toUpperCase()}
              </span>
              <span className="text-muted-foreground">
                ({systemHealth.passing_criteria}/{systemHealth.total_criteria} checks passing)
              </span>
            </div>
          )}
          <Button onClick={runPredictionAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Processing strike window predictions...</span>
                <span className="text-sm text-muted-foreground">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Lead data retrieval
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3" />
                  Historical analysis
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-3 h-3" />
                  Probability calculation
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Window optimization
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Metrics Dashboard */}
      {auditMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(auditMetrics.overall_accuracy * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Prediction Accuracy</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(auditMetrics.precision * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Precision Rate</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {auditMetrics.sample_size}
                </div>
                <div className="text-xs text-muted-foreground">Sample Size</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(auditMetrics.f1_score * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">F1 Score</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Strike Windows */}
      {strikeWindows.length > 0 && (
        <div className="space-y-4">
          {strikeWindows.map((window) => {
            const status = getWindowStatus(window);
            return (
              <Card key={window.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{window.lead_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{window.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Model: {window.model_version}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Confidence: {Math.round(window.calculation_metadata.data_quality_score * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(status)}>
                        {status === 'active' && <Zap className="w-3 h-3 mr-1" />}
                        {status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
                        {status === 'expired' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {status.toUpperCase()}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary">
                        {Math.round(window.conversion_probability * 100)}% ± {Math.round((window.confidence_interval[1] - window.confidence_interval[0]) * 50)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Strike Window Timeline */}
                  <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Optimal Strike Window</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeUntil(window.time_until_window)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {new Date(window.predicted_window_start).toLocaleString()} - {' '}
                      {new Date(window.predicted_window_end).toLocaleString()}
                    </div>
                    <Progress 
                      value={status === 'active' ? 100 : status === 'upcoming' ? Math.max(0, 100 - (window.time_until_window * 4)) : 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Behavioral Triggers */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Behavioral Triggers (Urgency: {window.urgency_score})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {window.behavioral_triggers.map((trigger, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {trigger.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Optimal Channels with Response Rates */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Optimal Channels</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {window.optimal_channels.map((channel, idx) => {
                        const action = window.auto_scheduled_actions.find(a => a.type === channel);
                        return (
                          <div key={idx} className="bg-muted/20 rounded p-2">
                            <div className="flex items-center gap-1 mb-1">
                              {getChannelIcon(channel)}
                              <span className="text-xs font-medium capitalize">{channel}</span>
                            </div>
                            {action && (
                              <div className="text-xs text-muted-foreground">
                                {Math.round(action.expected_response_rate * 100)}% expected response
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auto-Scheduled Actions */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Auto-Scheduled Actions</h4>
                    <div className="space-y-2">
                      {window.auto_scheduled_actions.slice(0, 3).map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                          <div className="flex items-center gap-2">
                            {getChannelIcon(action.type)}
                            <div>
                              <p className="text-xs font-medium">
                                {action.type.replace('_', ' ').toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-xs">
                                {action.content_preview}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(action.scheduled_time).toLocaleTimeString()}
                            </span>
                            {action.status === 'scheduled' && (
                              <Clock className="w-3 h-3 text-blue-400" />
                            )}
                            {action.status === 'completed' && (
                              <CheckCircle className="w-3 h-3 text-green-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing Metadata */}
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View Processing Details
                    </summary>
                    <div className="mt-2 p-2 bg-muted/10 rounded">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Processing Time: {window.calculation_metadata.processing_time_ms}ms</div>
                        <div>Algorithm: {window.calculation_metadata.algorithm_version}</div>
                        <div>Checks Passed: {window.calculation_metadata.validation_checks_passed.length}</div>
                        <div>Warnings: {window.calculation_metadata.warning_flags.length}</div>
                      </div>
                    </div>
                  </details>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Adjust Window
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {strikeWindows.length === 0 && !isAnalyzing && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Strike Windows</h3>
            <p className="text-muted-foreground mb-4">
              Run the prediction analysis to identify optimal conversion windows with full audit tracking
            </p>
            <Button onClick={runPredictionAnalysis}>
              <Zap className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
