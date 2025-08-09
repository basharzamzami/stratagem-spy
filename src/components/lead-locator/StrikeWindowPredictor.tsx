
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
  CheckCircle
} from 'lucide-react';

interface StrikeWindow {
  id: string;
  lead_id: string;
  lead_name: string;
  company: string;
  predicted_window_start: string;
  predicted_window_end: string;
  conversion_probability: number;
  optimal_channels: ('email' | 'phone' | 'linkedin' | 'ads')[];
  behavioral_triggers: string[];
  urgency_score: number;
  time_until_window: number; // hours
  auto_scheduled_actions: AutoAction[];
}

interface AutoAction {
  id: string;
  type: 'email' | 'ad_campaign' | 'phone_call' | 'linkedin_message';
  scheduled_time: string;
  content_preview: string;
  status: 'scheduled' | 'sent' | 'completed';
}

export default function StrikeWindowPredictor() {
  const [strikeWindows, setStrikeWindows] = useState<StrikeWindow[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '48h' | '72h'>('48h');

  // Mock data for demonstration
  const mockStrikeWindows: StrikeWindow[] = [
    {
      id: '1',
      lead_id: 'lead_001',
      lead_name: 'Jane Smith',
      company: 'SolarTech Solutions',
      predicted_window_start: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours from now
      predicted_window_end: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(), // 22 hours from now
      conversion_probability: 94,
      optimal_channels: ['email', 'phone', 'linkedin'],
      behavioral_triggers: ['urgency_language', 'multiple_searches', 'competitor_comparison'],
      urgency_score: 89,
      time_until_window: 18,
      auto_scheduled_actions: [
        {
          id: 'action_1',
          type: 'email',
          scheduled_time: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
          content_preview: 'Hi Jane, noticed your LinkedIn post about finding B2B solar suppliers...',
          status: 'scheduled'
        },
        {
          id: 'action_2',
          type: 'ad_campaign',
          scheduled_time: new Date(Date.now() + 18.5 * 60 * 60 * 1000).toISOString(),
          content_preview: 'Targeted LinkedIn ad: "Texas Solar Solutions That Actually Deliver"',
          status: 'scheduled'
        }
      ]
    },
    {
      id: '2',
      lead_id: 'lead_002',
      lead_name: 'Marcus Rodriguez',
      company: 'TechFlow Enterprises',
      predicted_window_start: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
      predicted_window_end: new Date(Date.now() + 34 * 60 * 60 * 1000).toISOString(),
      conversion_probability: 87,
      optimal_channels: ['email', 'ads'],
      behavioral_triggers: ['pain_point_expression', 'budget_mentioned'],
      urgency_score: 76,
      time_until_window: 30,
      auto_scheduled_actions: [
        {
          id: 'action_3',
          type: 'email',
          scheduled_time: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
          content_preview: 'Marcus, saw your forum post about CRM integration challenges...',
          status: 'scheduled'
        }
      ]
    },
    {
      id: '3',
      lead_id: 'lead_003',
      lead_name: 'Lisa Chen',
      company: 'Growth Dynamics',
      predicted_window_start: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      predicted_window_end: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
      conversion_probability: 91,
      optimal_channels: ['phone', 'linkedin'],
      behavioral_triggers: ['immediate_need', 'decision_authority'],
      urgency_score: 95,
      time_until_window: 6,
      auto_scheduled_actions: [
        {
          id: 'action_4',
          type: 'phone_call',
          scheduled_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          content_preview: 'Call script: Lead mentioned "need solution ASAP" - focus on immediate availability',
          status: 'scheduled'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStrikeWindows(mockStrikeWindows.map(window => ({
        ...window,
        time_until_window: Math.max(0, window.time_until_window - 0.1)
      })));
    }, 6000); // Update every 6 seconds (represents 6 minutes)

    return () => clearInterval(interval);
  }, []);

  const runPredictionAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStrikeWindows(mockStrikeWindows);
    setIsAnalyzing(false);
  };

  const getWindowStatus = (window: StrikeWindow) => {
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
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Strike Window Predictor</h2>
          <p className="text-muted-foreground">AI-powered conversion timing engine</p>
        </div>
        <Button onClick={runPredictionAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Predict Windows
            </>
          )}
        </Button>
      </div>

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
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(status)}>
                        {status === 'active' && <Zap className="w-3 h-3 mr-1" />}
                        {status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
                        {status === 'expired' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {status.toUpperCase()}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary">
                        {window.conversion_probability}% Probability
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Strike Window Timeline */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Optimal Strike Window</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeUntil(window.time_until_window)} remaining
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {new Date(window.predicted_window_start).toLocaleString()} - {' '}
                      {new Date(window.predicted_window_end).toLocaleString()}
                    </div>
                    <Progress 
                      value={status === 'active' ? 100 : status === 'upcoming' ? 0 : 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Behavioral Triggers */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Behavioral Triggers</h4>
                    <div className="flex flex-wrap gap-1">
                      {window.behavioral_triggers.map((trigger, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {trigger.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Optimal Channels */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Optimal Channels</h4>
                    <div className="flex gap-2">
                      {window.optimal_channels.map((channel, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs flex items-center gap-1">
                          {getChannelIcon(channel)}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Auto-Scheduled Actions */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Auto-Scheduled Actions</h4>
                    <div className="space-y-2">
                      {window.auto_scheduled_actions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                          <div className="flex items-center gap-2">
                            {getChannelIcon(action.type)}
                            <div>
                              <p className="text-xs font-medium">{action.type.replace('_', ' ').toUpperCase()}</p>
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

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Full Profile
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
              Run the prediction analysis to identify optimal conversion windows for your leads
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
