
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Rocket,
  Search,
  ExternalLink,
  Clock,
  Zap
} from 'lucide-react';
import { CompetitorActivity } from '@/services/realTimeCompetitorMonitor';

interface CompetitorActivityFeedProps {
  activities: CompetitorActivity[];
}

export default function CompetitorActivityFeed({ activities }: CompetitorActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ad_change': return <TrendingUp className="w-4 h-4" />;
      case 'pricing_update': return <DollarSign className="w-4 h-4" />;
      case 'content_change': return <FileText className="w-4 h-4" />;
      case 'product_launch': return <Rocket className="w-4 h-4" />;
      case 'seo_ranking_change': return <Search className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Activities Detected</h3>
          <p className="text-muted-foreground">
            Start monitoring to detect competitor activities in real-time
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{activity.competitor_name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(activity.detected_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getImpactColor(activity.impact_level)}>
                  {activity.impact_level.toUpperCase()}
                </Badge>
                {activity.auto_response_generated && (
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Auto-Response
                  </Badge>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-foreground font-medium mb-2">{activity.description}</p>
              
              {/* Activity Details */}
              {activity.data && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  {activity.data.platform && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Platform:</span>
                      <span className="text-muted-foreground">{activity.data.platform}</span>
                    </div>
                  )}
                  
                  {activity.data.keywords && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Keywords:</span>
                      <div className="flex gap-1 flex-wrap">
                        {activity.data.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activity.data.metrics && (
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {Object.entries(activity.data.metrics).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                          <span className="text-muted-foreground ml-2">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activity.data.before && activity.data.after && (
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="bg-red-500/10 rounded p-3">
                        <div className="font-medium text-sm text-red-400 mb-2">Before</div>
                        <pre className="text-xs text-muted-foreground">
                          {JSON.stringify(activity.data.before, null, 2)}
                        </pre>
                      </div>
                      <div className="bg-green-500/10 rounded p-3">
                        <div className="font-medium text-sm text-green-400 mb-2">After</div>
                        <pre className="text-xs text-muted-foreground">
                          {JSON.stringify(activity.data.after, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {activity.data?.url && (
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Source
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Analyze Impact
                </Button>
              </div>
              
              {activity.playbook_id && (
                <Button size="sm" className="bg-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  View Playbook
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
