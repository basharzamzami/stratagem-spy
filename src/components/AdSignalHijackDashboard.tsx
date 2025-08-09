
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WarmLeadDetector from '@/components/ad-signal-hijack/WarmLeadDetector';
import CompetitorHijackAnalysis from '@/components/ad-signal-hijack/CompetitorHijackAnalysis';
import CampaignGenerator from '@/components/ad-signal-hijack/CampaignGenerator';
import PrecisionTargeting from '@/components/ad-signal-hijack/PrecisionTargeting';
import RealTimeMonitor from '@/components/ad-signal-hijack/RealTimeMonitor';
import { 
  Target, 
  Zap, 
  Brain, 
  TrendingUp, 
  Eye,
  Activity,
  DollarSign,
  Users
} from 'lucide-react';

const AdSignalHijackDashboard = () => {
  const [activeLeads, setActiveLeads] = useState(147);
  const [hijackedAds, setHijackedAds] = useState(23);
  const [generatedCampaigns, setGeneratedCampaigns] = useState(8);
  const [conversionLift, setConversionLift] = useState(284);

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Specter Net: Warm Lead + Ad Hijack Fusion
          </h1>
          <p className="text-muted-foreground">
            Precision campaign targeting with real-time competitor intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
            Live Targeting Active
          </Badge>
          <Button 
            onClick={() => window.open('/ad-signal-hijack-2', '_blank')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            Try Hijack 2.0
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Warm Leads</p>
                <p className="text-2xl font-bold text-foreground">{activeLeads}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +23% from yesterday
                </p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hijacked Ad Strategies</p>
                <p className="text-2xl font-bold text-foreground">{hijackedAds}</p>
                <p className="text-xs text-orange-400 flex items-center gap-1 mt-1">
                  <Eye className="w-3 h-3" />
                  8 new this hour
                </p>
              </div>
              <Brain className="w-8 h-8 text-orange-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Generated Campaigns</p>
                <p className="text-2xl font-bold text-foreground">{generatedCampaigns}</p>
                <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3" />
                  3 launching today
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Lift</p>
                <p className="text-2xl font-bold text-foreground">{conversionLift}%</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <DollarSign className="w-3 h-3" />
                  vs competitor baseline
                </p>
              </div>
              <Activity className="w-8 h-8 text-success opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Fusion Pipeline */}
      <Tabs defaultValue="warm-leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="warm-leads" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Warm Lead Detection
          </TabsTrigger>
          <TabsTrigger value="ad-hijack" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Ad Hijack Analysis
          </TabsTrigger>
          <TabsTrigger value="campaign-gen" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Campaign Generator
          </TabsTrigger>
          <TabsTrigger value="precision-target" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Precision Targeting
          </TabsTrigger>
          <TabsTrigger value="real-time" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-Time Monitor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="warm-leads" className="space-y-6">
          <WarmLeadDetector />
        </TabsContent>

        <TabsContent value="ad-hijack" className="space-y-6">
          <CompetitorHijackAnalysis />
        </TabsContent>

        <TabsContent value="campaign-gen" className="space-y-6">
          <CampaignGenerator />
        </TabsContent>

        <TabsContent value="precision-target" className="space-y-6">
          <PrecisionTargeting />
        </TabsContent>

        <TabsContent value="real-time" className="space-y-6">
          <RealTimeMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdSignalHijackDashboard;
