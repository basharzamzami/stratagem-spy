import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Eye, 
  Zap,
  AlertTriangle,
  Users,
  DollarSign,
  Clock,
  Activity
} from 'lucide-react';
import AdHijackIntelligence from '@/components/ad-signal-hijack/AdHijackIntelligence';
import CompetitorHijackAnalysis from '@/components/ad-signal-hijack/CompetitorHijackAnalysis';
import CreativeDNAAnalyzer from '@/components/ad-signal-hijack/CreativeDNAAnalyzer';
import CounterAdLauncher from '@/components/ad-signal-hijack/CounterAdLauncher';

// Live Engagement Pulse Component
const LiveEngagementPulse = () => {
  const [pulseData, setPulseData] = useState({
    totalAds: 247,
    activeSpikes: 12,
    avgEngagement: 3.2,
    topCompetitor: 'HubSpot'
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-success" />
          Live Pulse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Monitored Ads</span>
          <span className="font-medium">{pulseData.totalAds}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Active Spikes</span>
          <span className="font-medium text-destructive">{pulseData.activeSpikes}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Avg Engagement</span>
          <span className="font-medium">{pulseData.avgEngagement}%</span>
        </div>
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-1">Top Threat</div>
          <Badge variant="destructive" className="text-xs">
            {pulseData.topCompetitor}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// Competitor Watchlist Component
const CompetitorWatchlist = () => {
  const competitors = [
    { name: 'HubSpot', ads: 45, trend: 'up', threat: 'high' },
    { name: 'Salesforce', ads: 32, trend: 'stable', threat: 'medium' },
    { name: 'Pipedrive', ads: 28, trend: 'down', threat: 'low' },
    { name: 'Monday.com', ads: 19, trend: 'up', threat: 'medium' }
  ];

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {competitors.map((comp, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded text-xs">
            <div>
              <div className="font-medium">{comp.name}</div>
              <div className="text-muted-foreground">{comp.ads} ads</div>
            </div>
            <div className="flex items-center gap-1">
              <span>{getTrendIcon(comp.trend)}</span>
              <span className={getThreatColor(comp.threat)}>●</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Quick Actions Panel Component
const QuickActionsPanel = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
          <Eye className="w-3 h-3 mr-2" />
          View Top Spike
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
          <Target className="w-3 h-3 mr-2" />
          Launch Counter
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
          <AlertTriangle className="w-3 h-3 mr-2" />
          Set Alert
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
          <TrendingUp className="w-3 h-3 mr-2" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
};

// Competitor Insights Component
const CompetitorInsights = () => {
  const insights = [
    {
      type: 'threat',
      message: 'HubSpot increased spend 40%',
      time: '2h ago',
      icon: AlertTriangle,
      color: 'text-destructive'
    },
    {
      type: 'opportunity',
      message: 'Gap in "AI automation" keywords',
      time: '4h ago',
      icon: Target,
      color: 'text-success'
    },
    {
      type: 'trend',
      message: 'Video ads +230% engagement',
      time: '6h ago',
      icon: TrendingUp,
      color: 'text-blue-500'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-500" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-start gap-2">
              <insight.icon className={`w-3 h-3 mt-0.5 ${insight.color}`} />
              <div className="flex-1">
                <p className="text-xs font-medium">{insight.message}</p>
                <p className="text-xs text-muted-foreground">{insight.time}</p>
              </div>
            </div>
            {idx < insights.length - 1 && <div className="border-b border-muted/20" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const EnhancedAdSignalHijack = () => {
  const [activeTab, setActiveTab] = useState('intelligence');

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Ad Signal Hijack
              </h1>
              <p className="text-muted-foreground">
                Decode competitor ads and weaponize counter-intelligence
              </p>
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive">
              🎯 Active Intelligence
            </Badge>
          </div>

          {/* Main Intelligence System */}
          <AdHijackIntelligence />

          {/* Existing components in tabs */}
          <Tabs defaultValue="intelligence" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="intelligence">🧠 Intelligence</TabsTrigger>
              <TabsTrigger value="analysis">🔍 Analysis</TabsTrigger>
              <TabsTrigger value="creative">🎨 Creative DNA</TabsTrigger>
              <TabsTrigger value="launcher">🚀 Launcher</TabsTrigger>
            </TabsList>

            <TabsContent value="intelligence">
              <div className="text-center py-8 text-muted-foreground">
                Use the Intelligence Extractor above to decode competitor ads
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <CompetitorHijackAnalysis />
            </TabsContent>

            <TabsContent value="creative">
              <CreativeDNAAnalyzer />
            </TabsContent>

            <TabsContent value="launcher">
              <CounterAdLauncher />
            </TabsContent>
          </Tabs>
        </div>

        {/* Intelligence Rail */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <LiveEngagementPulse />
            <CompetitorWatchlist />
            <QuickActionsPanel />
            <CompetitorInsights />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdSignalHijack;
