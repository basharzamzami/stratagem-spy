import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  TrendingUp, 
  Zap, 
  Clock, 
  Target,
  Sword,
  Activity,
  BarChart3,
  Users,
  DollarSign
} from 'lucide-react';
import { useMockData } from './MockDataProvider';
import EnhancedHotAdCard from './EnhancedHotAdCard';
import { HotAd } from '@/services/mockAdData';

interface RichRealTimeMonitorProps {
  onCounterAttack?: (ad: HotAd) => void;
}

const RichRealTimeMonitor = ({ onCounterAttack }: RichRealTimeMonitorProps) => {
  const { hotAds, realTimeActivities, campaignMetrics, competitorInsights } = useMockData();
  const [selectedVelocity, setSelectedVelocity] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredHotAds = hotAds.filter(ad => {
    if (selectedVelocity !== 'all' && ad.velocity !== selectedVelocity) {
      return false;
    }
    if (selectedPlatform !== 'all' && ad.platform !== selectedPlatform) {
      return false;
    }
    return true;
  });

  const handleCounterAttack = (ad: HotAd) => {
    if (onCounterAttack) {
      onCounterAttack(ad);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            <Activity className="w-4 h-4 mr-2" />
            {realTimeActivities.length} Real-Time Activities
          </Badge>
          <Badge variant="secondary">
            <Flame className="w-4 h-4 mr-2" />
            {hotAds.length} Hot Ads
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="border rounded px-3 py-1 text-sm"
            value={selectedVelocity}
            onChange={e => setSelectedVelocity(e.target.value)}
          >
            <option value="all">All Velocities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            className="border rounded px-3 py-1 text-sm"
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="Meta">Meta</option>
            <option value="Google">Google</option>
            <option value="YouTube">YouTube</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="TikTok">TikTok</option>
          </select>
        </div>
      </div>

      {/* Hot Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotAds.map(ad => (
          <EnhancedHotAdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {/* Real-Time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Real-Time Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-muted">
            {realTimeActivities.map(activity => (
              <li key={activity.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm">{activity.message}</p>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Campaign Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Campaign Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {campaignMetrics.map(metric => (
              <div key={metric.name} className="text-center">
                <div className="text-2xl font-bold">{metric.current}{metric.unit}</div>
                <div className="text-sm text-muted-foreground">{metric.name}</div>
                <div className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  <TrendingUp className="inline-block w-3 h-3 mr-1" />
                  {metric.trend === 'up' ? 'Increased' : 'Decreased'} from {metric.previous}{metric.unit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Competitor Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitorInsights.map(insight => (
              <div key={insight.competitor} className="p-4 rounded-lg bg-muted/10">
                <h4 className="font-semibold">{insight.competitor}</h4>
                <p className="text-sm text-muted-foreground">
                  {insight.totalAds} total ads • {insight.estimatedSpend}
                </p>
                <ul className="list-disc list-inside text-sm mt-2">
                  {insight.recentChanges.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RichRealTimeMonitor;
