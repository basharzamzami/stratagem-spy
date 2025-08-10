
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAlerts, markAlertAsRead, Alert } from '@/services/specterNet';
import { Search, AlertTriangle, Bell, CheckCircle, Eye, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function IntelligenceAlerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', showOnlyUnread],
    queryFn: () => fetchAlerts(showOnlyUnread),
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAlertAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({
        title: "Alert marked as read",
        description: "Alert status updated successfully"
      });
    },
  });

  const filteredAlerts = alerts?.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  }) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2 text-muted-foreground">Loading alerts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Intelligence Alerts</h2>
          <p className="text-muted-foreground">Real-time competitive intelligence notifications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={severityFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSeverityFilter('all')}
          >
            All
          </Button>
          <Button
            variant={severityFilter === 'critical' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSeverityFilter('critical')}
          >
            Critical
          </Button>
          <Button
            variant={severityFilter === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSeverityFilter('high')}
          >
            High
          </Button>
          <Button
            variant={showOnlyUnread ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowOnlyUnread(!showOnlyUnread)}
          >
            <Filter className="w-4 h-4 mr-1" />
            {showOnlyUnread ? 'Unread Only' : 'All Alerts'}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <div className="text-lg font-bold text-red-400">
                  {alerts?.filter(a => a.severity === 'critical').length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-400" />
              <div>
                <div className="text-lg font-bold text-orange-400">
                  {alerts?.filter(a => a.severity === 'high').length || 0}
                </div>
                <div className="text-xs text-muted-foreground">High</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-lg font-bold text-yellow-400">
                  {alerts?.filter(a => a.severity === 'medium').length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Medium</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-lg font-bold text-blue-400">
                  {alerts?.filter(a => !a.read).length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Unread</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                {searchTerm || severityFilter !== 'all' ? 'Try adjusting your filters' : 'No alerts at this time'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`hover:shadow-lg transition-all duration-200 ${
                !alert.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {getSeverityIcon(alert.severity)}
                        <span className="ml-1">{alert.severity.toUpperCase()}</span>
                      </Badge>
                      {!alert.read && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    {alert.message && (
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    )}
                  </div>
                  
                  {!alert.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsReadMutation.mutate(alert.id)}
                      disabled={markAsReadMutation.isPending}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Mark Read
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Alert Type: {alert.type}</span>
                  <span>{new Date(alert.created_at).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
