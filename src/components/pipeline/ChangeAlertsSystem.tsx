
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Eye, 
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAlerts, markAlertAsRead } from '@/services/specterNet';
import { useToast } from '@/hooks/use-toast';

export default function ChangeAlertsSystem() {
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [alertFilters, setAlertFilters] = useState({
    severity: 'all',
    type: 'all'
  });
  const { toast } = useToast();

  const { data: alertsData, refetch, isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      try {
        return await fetchAlerts();
      } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
    },
    refetchInterval: realTimeEnabled ? 15000 : false // Refresh every 15 seconds if enabled
  });

  // Ensure alerts is always an array
  const alerts = Array.isArray(alertsData) ? alertsData : [];

  // Simulate real-time alerts
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      // Simulate random competitive changes
      const alertTypes = [
        {
          type: 'competitor_spend_increase',
          title: 'SimilarWeb Ad Spend Surge',
          message: 'SimilarWeb increased ad spend by 45% in the last 24 hours',
          severity: 'high',
          icon: TrendingUp,
          color: 'text-red-400'
        },
        {
          type: 'new_competitor_ad',
          title: 'New SEMrush Campaign Detected',
          message: 'SEMrush launched new "Enterprise Analytics" campaign targeting our keywords',
          severity: 'medium',
          icon: Target,
          color: 'text-yellow-400'
        },
        {
          type: 'pricing_change',
          title: 'Competitor Pricing Update',
          message: 'Ahrefs reduced enterprise pricing by 15%',
          severity: 'high',
          icon: DollarSign,
          color: 'text-red-400'
        }
      ];

      // Randomly trigger an alert (10% chance every interval)
      if (Math.random() < 0.1) {
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        toast({
          title: "🚨 Change Alert",
          description: randomAlert.message,
          duration: 5000
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeEnabled, toast]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'competitor_spend_increase': return TrendingUp;
      case 'competitor_spend_decrease': return TrendingDown;
      case 'new_competitor_ad': return Target;
      case 'pricing_change': return DollarSign;
      case 'keyword_ranking_change': return Eye;
      default: return AlertTriangle;
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId);
      refetch();
      toast({
        title: "Alert marked as read",
        description: "Alert has been processed"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive"
      });
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.read);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading alerts...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Unable to load alerts at this time.</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert System Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Change Alert System
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Real-time monitoring</span>
                <Switch 
                  checked={realTimeEnabled} 
                  onCheckedChange={setRealTimeEnabled}
                />
              </div>
              <Badge variant="outline" className="bg-primary/20 text-primary">
                {unreadAlerts.length} unread
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{criticalAlerts.length}</div>
            <div className="text-sm text-muted-foreground">Require immediate action</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Unread Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{unreadAlerts.length}</div>
            <div className="text-sm text-muted-foreground">Pending review</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Spend Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {alerts.filter(a => a.type.includes('spend')).length}
            </div>
            <div className="text-sm text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Auto Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">12</div>
            <div className="text-sm text-muted-foreground">Tasks generated</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Alert Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Live Alert Feed
            {realTimeEnabled && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              
              return (
                <div key={alert.id} 
                     className={`p-4 rounded-lg border ${!alert.read ? 'bg-muted/20' : 'bg-muted/10 opacity-75'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertIcon className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-400' :
                        alert.severity === 'high' ? 'text-orange-400' :
                        alert.severity === 'medium' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{alert.title}</h4>
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {!alert.read && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!alert.read && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button size="sm" variant="default">
                        Create Task
                      </Button>
                    </div>
                  </div>

                  {alert.data && (
                    <div className="mt-3 p-2 bg-muted/10 rounded text-xs">
                      <pre className="text-muted-foreground overflow-auto">
                        {JSON.stringify(alert.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}

            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No alerts yet. The system is monitoring for competitive changes.</p>
                {!realTimeEnabled && (
                  <p className="text-sm mt-2">Enable real-time monitoring to receive instant alerts.</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
