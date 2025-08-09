
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Target, 
  Brain,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';
import LiveEngagementPulse from '@/components/ad-signal-hijack/LiveEngagementPulse';
import CreativeDNAAnalyzer from '@/components/ad-signal-hijack/CreativeDNAAnalyzer';
import CounterAdLauncher from '@/components/ad-signal-hijack/CounterAdLauncher';
import AudienceSpilloverHijack from '@/components/ad-signal-hijack/AudienceSpilloverHijack';
import AdDrainReport from '@/components/ad-signal-hijack/AdDrainReport';
import PsychTriggerAnalyzer from '@/components/ad-signal-hijack/PsychTriggerAnalyzer';

export default function AdSignalHijack2Dashboard() {
  const [activeTab, setActiveTab] = useState('pulse');

  // Mock stats for dashboard header
  const stats = [
    { label: 'Active Hijacks', value: '12', icon: Zap, color: 'text-orange-400' },
    { label: 'Revenue Drained', value: '$47.2K', icon: DollarSign, color: 'text-green-400' },
    { label: 'Ads Intercepted', value: '156', icon: Target, color: 'text-blue-400' },
    { label: 'Engagement Stolen', value: '24.8%', icon: TrendingUp, color: 'text-purple-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
            <Zap className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ad Signal Hijack 2.0</h1>
            <p className="text-muted-foreground">The Conversion Parasite System</p>
          </div>
          <Badge className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            LIVE HIJACKING
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="pulse" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live Pulse
          </TabsTrigger>
          <TabsTrigger value="psychology" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Psychology
          </TabsTrigger>
          <TabsTrigger value="dna" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            DNA Analysis
          </TabsTrigger>
          <TabsTrigger value="launcher" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Counter-Ads
          </TabsTrigger>
          <TabsTrigger value="hijack" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Spillover
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Drain Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pulse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Engagement Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LiveEngagementPulse />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="psychology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Psychological Trigger Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PsychTriggerAnalyzer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dna" className="space-y-6">
          <CreativeDNAAnalyzer />
        </TabsContent>

        <TabsContent value="launcher" className="space-y-6">
          <CounterAdLauncher />
        </TabsContent>

        <TabsContent value="hijack" className="space-y-6">
          <AudienceSpilloverHijack />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdDrainReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
