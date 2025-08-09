
import { useState } from 'react';
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Activity, 
  Target, 
  TrendingDown,
  Eye,
  Users,
  Dna,
  Rocket
} from 'lucide-react';
import LiveEngagementPulse from '@/components/ad-signal-hijack/LiveEngagementPulse';
import CreativeDNAAnalyzer from '@/components/ad-signal-hijack/CreativeDNAAnalyzer';
import CounterAdLauncher from '@/components/ad-signal-hijack/CounterAdLauncher';
import AudienceSpilloverHijack from '@/components/ad-signal-hijack/AudienceSpilloverHijack';
import AdDrainReport from '@/components/ad-signal-hijack/AdDrainReport';

export default function AdSignalHijack2Dashboard() {
  const [activeHijacks, setActiveHijacks] = useState(8);
  const [trafficStolen, setTrafficStolen] = useState(6220);
  const [revenueImpact, setRevenueImpact] = useState(105000);
  const [hijackEfficiency, setHijackEfficiency] = useState(89.2);

  return (
    <div className="min-h-screen w-screen bg-background flex">
      <Navigation />
      <div className="flex-1 min-h-screen w-full overflow-auto">
        <div className="p-8 space-y-6 min-h-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-orange-500" />
                  Ad Signal Hijack 2.0
                </h1>
                <p className="text-muted-foreground text-lg">
                  "The Conversion Parasite" — Attach to competitors' hottest ads and drain their leads
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  PARASITE MODE ACTIVE
                </Badge>
                <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  <Target className="w-4 h-4 mr-2" />
                  Configure Targets
                </Button>
              </div>
            </div>
          </div>

          {/* Real-time Hijack Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{activeHijacks}</div>
                    <div className="text-sm text-muted-foreground">Active Hijacks</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-orange-400">
                      <Zap className="w-3 h-3" />
                      3 launching soon
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-orange-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-400">{trafficStolen.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Traffic Stolen (24h)</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
                      <TrendingDown className="w-3 h-3" />
                      +18% vs yesterday
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-red-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">${(revenueImpact / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-muted-foreground">Revenue Diverted</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                      <Activity className="w-3 h-3" />
                      Real-time impact
                    </div>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{hijackEfficiency}%</div>
                    <div className="text-sm text-muted-foreground">Hijack Efficiency</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-purple-400">
                      <Eye className="w-3 h-3" />
                      Conversion parasite
                    </div>
                  </div>
                  <Rocket className="w-8 h-8 text-purple-500 opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Hijack Pipeline */}
          <Tabs defaultValue="pulse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pulse" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Live Pulse
              </TabsTrigger>
              <TabsTrigger value="dna" className="flex items-center gap-2">
                <Dna className="w-4 h-4" />
                Creative DNA
              </TabsTrigger>
              <TabsTrigger value="counter" className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Counter-Ads
              </TabsTrigger>
              <TabsTrigger value="spillover" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Audience Hijack
              </TabsTrigger>
              <TabsTrigger value="drain" className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Drain Report
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pulse" className="space-y-6">
              <Card className="p-6">
                <CardContent className="p-0">
                  <LiveEngagementPulse />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dna" className="space-y-6">
              <Card className="p-6">
                <CardContent className="p-0">
                  <CreativeDNAAnalyzer />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="counter" className="space-y-6">
              <Card className="p-6">
                <CardContent className="p-0">
                  <CounterAdLauncher />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spillover" className="space-y-6">
              <Card className="p-6">
                <CardContent className="p-0">
                  <AudienceSpilloverHijack />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drain" className="space-y-6">
              <Card className="p-6">
                <CardContent className="p-0">
                  <AdDrainReport />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions Footer */}
          <Card className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Conversion Parasite Status</h3>
                  <p className="text-muted-foreground">
                    Actively draining competitor traffic with {hijackEfficiency}% efficiency
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View All Targets
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Launch New Hijack
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
