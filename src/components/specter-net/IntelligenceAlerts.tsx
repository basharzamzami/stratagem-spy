import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchAlerts, markAlertAsRead, createTask, Alert } from '@/services/specterNet';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  Zap, 
  CheckCircle, 
  Eye, 
  Target,
  Globe,
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Clock,
  TrendingUp,
  MapPin,
  Search,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enhanced alert types with competitor focus
const COMPETITOR_ALERT_TYPES = [
  { value: 'website_change', label: 'Website Changes', icon: Globe, color: 'text-blue-400' },
  { value: 'new_ad_campaign', label: 'New Ad Campaign', icon: Zap, color: 'text-purple-400' },
  { value: 'keyword_ranking', label: 'Keyword Ranking Change', icon: TrendingUp, color: 'text-green-400' },
  { value: 'gmb_update', label: 'GMB Profile Update', icon: MapPin, color: 'text-orange-400' },
  { value: 'review_update', label: 'Review Changes', icon: Star, color: 'text-yellow-400' },
  { value: 'pricing_change', label: 'Pricing Updates', icon: Target, color: 'text-red-400' },
];

const DELIVERY_CHANNELS = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'slack', label: 'Slack', icon: MessageSquare },
  { value: 'discord', label: 'Discord', icon: MessageSquare },
  { value: 'sms', label: 'SMS', icon: Smartphone },
];

export default function IntelligenceAlerts() {
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [enabledChannels, setEnabledChannels] = useState<string[]>(['email']);
  const [autoCreateTasks, setAutoCreateTasks] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', filter, selectedType],
    queryFn: () => fetchAlerts(filter === 'unread'),
    refetchInterval: 15000, // Enhanced real-time monitoring every 15 seconds
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

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast({
        title: "Task Created",
        description: "Intelligence task generated from alert"
      });
    },
  });

  // Enhanced alert data with competitor focus
  const mockCompetitorAlerts = [
    {
      id: '1',
      type: 'website_change',
      title: 'Competitor Homepage Redesign Detected',
      message: 'MarketingPro LLC has updated their homepage with new pricing structure and service offerings. 3 new sections added, CTA changed from "Get Quote" to "Start Free Trial".',
      severity: 'warning',
      data: {
        competitor: 'MarketingPro LLC',
        url: 'https://marketingpro.com',
        changes: ['New pricing table', 'Updated hero section', 'Added testimonials'],
        impact_score: 8.5
      },
      read: false,
      channels: ['email', 'slack'],
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
    },
    {
      id: '2',
      type: 'new_ad_campaign',
      title: 'High-Spend Google Ads Campaign Launched',
      message: 'DigitalEdge Agency launched a new Google Ads campaign targeting "marketing automation" with estimated daily budget of $2,500+. 12 new ad variations detected.',
      severity: 'critical',
      data: {
        competitor: 'DigitalEdge Agency',
        platform: 'Google Ads',
        keywords: ['marketing automation', 'lead generation software', 'CRM integration'],
        estimated_budget: '$2,500/day',
        ad_count: 12
      },
      read: false,
      channels: ['email', 'slack', 'discord'],
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 minutes ago
    },
    {
      id: '3',
      type: 'gmb_update',
      title: 'GMB Profile Major Update - Chicago Location',
      message: 'TechSolutions Inc updated their Chicago GMB profile with new business hours, 15+ new photos, and updated service descriptions. Overall rating improved from 4.2 to 4.6.',
      severity: 'warning',
      data: {
        competitor: 'TechSolutions Inc',
        location: 'Chicago, IL',
        changes: ['Business hours extended', '15 new photos', 'Service descriptions updated'],
        rating_change: { from: 4.2, to: 4.6 },
        review_count: 127
      },
      read: true,
      channels: ['email'],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      id: '4',
      type: 'keyword_ranking',
      title: 'Competitor Ranking Surge for Target Keywords',
      message: 'WebMasters Pro jumped from position 8 to position 3 for "digital marketing services Chicago" and gained top 10 positions for 5 related keywords.',
      severity: 'critical',
      data: {
        competitor: 'WebMasters Pro',
        keywords: [
          { keyword: 'digital marketing services chicago', from: 8, to: 3 },
          { keyword: 'seo agency chicago', from: 15, to: 7 },
          { keyword: 'ppc management chicago', from: 12, to: 9 }
        ],
        search_volume: '8,100/month combined'
      },
      read: false,
      channels: ['email', 'slack'],
      created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString() // 1.5 hours ago
    }
  ];

  // Filter alerts by type if selected
  const filteredAlerts = selectedType === 'all' 
    ? [...(alerts || []), ...mockCompetitorAlerts]
    : [...(alerts || []), ...mockCompetitorAlerts].filter(alert => alert.type === selectedType);

  const handleCreateTaskFromAlert = (alert: Alert) => {
    const taskTitle = `Follow up on ${alert.title}`;
    const taskDescription = `Analyze competitor change: ${alert.message}`;
    
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      priority: alert.severity === 'critical' ? 5 : alert.severity === 'warning' ? 4 : 3,
      category: 'competitor_analysis',
      status: 'pending' as const,
      estimated_impact: alert.severity === 'critical' ? 'high' : 'medium',
      execution_steps: {
        steps: [
          `Analyze the competitor change: ${alert.data?.competitor || 'competitor'}`,
          'Assess impact on our market position',
          'Develop counter-strategy recommendations',
          'Implement responsive actions',
          'Monitor results and adjust tactics'
        ]
      },
      related_entities: alert.data
    };

    createTaskMutation.mutate(newTask);
  };

  const getTypeIcon = (type: string) => {
    const alertType = COMPETITOR_ALERT_TYPES.find(t => t.value === type);
    if (alertType) {
      const IconComponent = alertType.icon;
      return <IconComponent className={`w-4 h-4 ${alertType.color}`} />;
    }
    return <Bell className="w-4 h-4 text-muted-foreground" />;
  };

  const getTypeLabel = (type: string) => {
    const alertType = COMPETITOR_ALERT_TYPES.find(t => t.value === type);
    return alertType?.label || type.replace('_', ' ').toUpperCase();
  };

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
        <span className="ml-2 text-muted-foreground">Monitoring competitor changes...</span>
      </div>
    );
  }

  const unreadCount = filteredAlerts?.filter(alert => !alert.read).length || 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Competitor Change Alerts</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">Live Monitoring</span>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500/20 text-red-400 animate-pulse">
              {unreadCount} new changes
            </Badge>
          )}
        </div>
      </div>

      {/* Alert Configuration Panel */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Monitoring Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Alert Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Alert Types</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {COMPETITOR_ALERT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Channels */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Channels</label>
              <div className="flex flex-wrap gap-2">
                {DELIVERY_CHANNELS.map(channel => {
                  const IconComponent = channel.icon;
                  return (
                    <Button
                      key={channel.value}
                      variant={enabledChannels.includes(channel.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setEnabledChannels(prev => 
                          prev.includes(channel.value)
                            ? prev.filter(c => c !== channel.value)
                            : [...prev, channel.value]
                        );
                      }}
                      className="flex items-center gap-1"
                    >
                      <IconComponent className="w-3 h-3" />
                      {channel.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Auto Task Creation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Automation</label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoCreateTasks}
                  onCheckedChange={setAutoCreateTasks}
                />
                <span className="text-sm text-muted-foreground">Auto-create tasks</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Alerts ({filteredAlerts?.length || 0})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Enhanced Alerts List */}
      <div className="space-y-3">
        {filteredAlerts?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No competitor changes detected</h3>
              <p className="text-muted-foreground">
                Our monitoring systems are actively scanning for competitor changes.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts?.map((alert) => (
            <Card 
              key={alert.id} 
              className={`${getSeverityColor(alert.severity)} transition-all duration-200 hover:shadow-lg ${
                !alert.read ? 'border-primary/30 shadow-md' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Alert Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(alert.type)}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{alert.title}</h3>
                          {!alert.read && (
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        
                        {/* Enhanced metadata */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(alert.type)}
                          </Badge>
                          <Badge className={`text-xs ${
                            alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {alert.data?.competitor && (
                            <Badge variant="secondary" className="text-xs">
                              {alert.data.competitor}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(alert.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Actions */}
                      <div className="flex items-center gap-2">
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCreateTaskFromAlert(alert)}
                          disabled={createTaskMutation.isPending}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Create Task
                        </Button>
                      </div>
                    </div>

                    {/* Alert Message */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {alert.message}
                    </p>

                    {/* Enhanced Alert Data Display */}
                    {alert.data && (
                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <div className="text-xs font-medium text-foreground mb-2">Change Details:</div>
                        
                        {/* Competitor specific data rendering */}
                        {alert.data.changes && (
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Detected Changes:</span>
                            <ul className="list-disc list-inside text-xs text-foreground space-y-1">
                              {alert.data.changes.map((change: string, index: number) => (
                                <li key={index}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {alert.data.impact_score && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Impact Score:</span>
                            <Badge className={`text-xs ${
                              alert.data.impact_score >= 8 ? 'bg-red-500/20 text-red-400' :
                              alert.data.impact_score >= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {alert.data.impact_score}/10
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Delivery Channels Status */}
                    {alert.channels && alert.channels.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Delivered via:</span>
                        <div className="flex gap-1">
                          {alert.channels.map((channel, index) => {
                            const channelConfig = DELIVERY_CHANNELS.find(c => c.value === channel);
                            if (channelConfig) {
                              const IconComponent = channelConfig.icon;
                              return (
                                <div key={index} className="flex items-center gap-1">
                                  <IconComponent className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{channelConfig.label}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
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
