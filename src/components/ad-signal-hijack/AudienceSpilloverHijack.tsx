
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Target, 
  Eye,
  TrendingUp,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HijackTarget {
  id: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'linkedin' | 'display';
  competitor: string;
  placement_type: string;
  audience_size: number;
  engagement_rate: number;
  hijack_opportunity: number;
  status: 'active' | 'paused' | 'setup';
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
  };
}

const AudienceSpilloverHijack = () => {
  const [hijackTargets, setHijackTargets] = useState<HijackTarget[]>([
    {
      id: '1',
      platform: 'youtube',
      competitor: 'HubSpot',
      placement_type: 'Pre-roll Video',
      audience_size: 50000,
      engagement_rate: 4.2,
      hijack_opportunity: 85,
      status: 'active',
      performance: {
        impressions: 12500,
        clicks: 525,
        conversions: 42,
        cost: 850
      }
    },
    {
      id: '2',
      platform: 'facebook',
      competitor: 'Salesforce',
      placement_type: 'News Feed',
      audience_size: 75000,
      engagement_rate: 3.8,
      hijack_opportunity: 72,
      status: 'active',
      performance: {
        impressions: 18750,
        clicks: 712,
        conversions: 68,
        cost: 1200
      }
    },
    {
      id: '3',
      platform: 'linkedin',
      competitor: 'Marketo',
      placement_type: 'Sponsored Content',
      audience_size: 25000,
      engagement_rate: 5.1,
      hijack_opportunity: 91,
      status: 'setup'
    }
  ]);

  const [isAutoHijack, setIsAutoHijack] = useState(true);
  const { toast } = useToast();

  const toggleHijackTarget = (targetId: string) => {
    setHijackTargets(prev => prev.map(target => 
      target.id === targetId 
        ? { ...target, status: target.status === 'active' ? 'paused' : 'active' }
        : target
    ));
    
    toast({
      title: "Hijack Target Updated",
      description: "Audience spillover configuration changed"
    });
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      youtube: '📺',
      facebook: '📘',
      instagram: '📷',
      linkedin: '💼',
      display: '🖥️'
    };
    return icons[platform as keyof typeof icons] || '📱';
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'setup': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalImpressions = hijackTargets.reduce((sum, target) => 
    sum + (target.performance?.impressions || 0), 0
  );
  const totalClicks = hijackTargets.reduce((sum, target) => 
    sum + (target.performance?.clicks || 0), 0
  );
  const totalCost = hijackTargets.reduce((sum, target) => 
    sum + (target.performance?.cost || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Audience Spillover Hijack
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Auto-Hijack</span>
                <Switch 
                  checked={isAutoHijack}
                  onCheckedChange={setIsAutoHijack}
                />
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                {hijackTargets.filter(t => t.status === 'active').length} Active
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-foreground">{totalImpressions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Hijacked Impressions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Stolen Clicks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">${totalCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Hijack Investment</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {totalClicks > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'}%
              </div>
              <div className="text-sm text-muted-foreground">Hijack CTR</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hijack Targets */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Active Hijacks
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Setup Queue
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-4">
            {hijackTargets.filter(target => target.status === 'active').map(target => (
              <Card key={target.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getPlatformIcon(target.platform)}</div>
                      <div>
                        <div className="font-semibold">{target.competitor}</div>
                        <div className="text-sm text-muted-foreground">
                          {target.placement_type} • {target.audience_size.toLocaleString()} audience
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(target.status)} variant="outline">
                        {target.status.toUpperCase()}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleHijackTarget(target.id)}
                      >
                        {target.status === 'active' ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Hijack Opportunity</div>
                      <div className={`text-lg font-bold ${getOpportunityColor(target.hijack_opportunity)}`}>
                        {target.hijack_opportunity}%
                      </div>
                      <Progress value={target.hijack_opportunity} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                      <div className="text-lg font-bold text-foreground">{target.engagement_rate}%</div>
                    </div>

                    {target.performance && (
                      <>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Hijacked Traffic</div>
                          <div className="text-lg font-bold text-foreground">
                            {target.performance.clicks.toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Conversions</div>
                          <div className="text-lg font-bold text-success">
                            {target.performance.conversions}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {target.performance && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                      <span>Cost: ${target.performance.cost}</span>
                      <span>CTR: {((target.performance.clicks / target.performance.impressions) * 100).toFixed(2)}%</span>
                      <span>CVR: {((target.performance.conversions / target.performance.clicks) * 100).toFixed(2)}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid gap-4">
            {hijackTargets.filter(target => target.status === 'setup').map(target => (
              <Card key={target.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getPlatformIcon(target.platform)}</div>
                      <div>
                        <div className="font-semibold">{target.competitor}</div>
                        <div className="text-sm text-muted-foreground">
                          {target.placement_type} • Ready for activation
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold ${getOpportunityColor(target.hijack_opportunity)}`}>
                        {target.hijack_opportunity}% opportunity
                      </div>
                      <Button
                        size="sm"
                        onClick={() => toggleHijackTarget(target.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Activate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hijackTargets.filter(target => target.performance).map(target => (
              <Card key={target.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <span>{getPlatformIcon(target.platform)}</span>
                      {target.competitor}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {target.platform}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Impressions</div>
                      <div className="font-medium">{target.performance!.impressions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                      <div className="font-medium">{target.performance!.clicks.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                      <div className="font-medium text-success">{target.performance!.conversions}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cost</div>
                      <div className="font-medium">${target.performance!.cost}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">ROI</div>
                    <div className="text-lg font-bold text-success">
                      +{(((target.performance!.conversions * 100) - target.performance!.cost) / target.performance!.cost * 100).toFixed(0)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudienceSpilloverHijack;
