
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchAlerts, markAlertAsRead, Alert } from '@/services/specterNet';
import { Bell, AlertTriangle, Info, Zap, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function IntelligenceAlerts() {
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', filter],
    queryFn: () => fetchAlerts(filter === 'unread'),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const markReadMutation = useMutation({
    mutationFn: markAlertAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({
        title: "Alert marked as read",
        description: "Alert status updated successfully"
      });
    },
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/5';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/5';
      default: return 'border-blue-500/50 bg-blue-500/5';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_ad': return <Zap className="w-4 h-4 text-primary" />;
      case 'competitor_change': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'high_intent_lead': return <Eye className="w-4 h-4 text-green-400" />;
      case 'dominance_shift': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatAlertType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const alertTime = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2 text-muted-foreground">Loading intelligence alerts...</span>
      </div>
    );
  }

  const unreadCount = alerts?.filter(alert => !alert.read).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Intelligence Alerts</h2>
          {unreadCount > 0 && (
            <Badge className="bg-red-500/20 text-red-400 animate-pulse">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Alerts
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? "You're all caught up! No new alerts to review." 
                  : "No intelligence alerts have been generated yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts?.map((alert) => (
            <Card 
              key={alert.id} 
              className={`${getSeverityColor(alert.severity)} transition-all duration-200 ${
                !alert.read ? 'border-primary/30' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Alert Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(alert.type)}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{alert.title}</h3>
                          {!alert.read && (
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {formatAlertType(alert.type)}
                          </Badge>
                          <Badge className={`text-xs ${
                            alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(alert.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {!alert.read && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => markReadMutation.mutate(alert.id)}
                          disabled={markReadMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Alert Message */}
                    {alert.message && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>
                    )}

                    {/* Alert Data */}
                    {alert.data && (
                      <div className="bg-muted/30 rounded-lg p-3 text-sm">
                        <div className="text-xs text-muted-foreground mb-1">Additional Data:</div>
                        <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">
                          {JSON.stringify(alert.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Alert Channels */}
                    {alert.channels && alert.channels.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Channels:</span>
                        {alert.channels.map((channel, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
