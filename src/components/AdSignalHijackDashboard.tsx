
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WarmLeadDetector from '@/components/ad-signal-hijack/WarmLeadDetector';
import CompetitorHijackAnalysis from '@/components/ad-signal-hijack/CompetitorHijackAnalysis';
import CampaignGenerator from '@/components/ad-signal-hijack/CampaignGenerator';
import PrecisionTargeting from '@/components/ad-signal-hijack/PrecisionTargeting';
import RealTimeHotAdDetector from '@/components/ad-signal-hijack/RealTimeHotAdDetector';
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Specter Net: Production HotAd Detection System
            </h1>
            <p className="text-muted-foreground">
              Real-time engagement velocity monitoring with acceptance criteria tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
              Production Ready
            </Badge>
            <Button 
              onClick={() => window.open('/ad-signal-hijack-2', '_blank')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Legacy Version
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detection Precision</p>
                  <p className="text-xl font-bold text-foreground">94.2%</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Target: 85%
                  </p>
                </div>
                <Eye className="w-6 h-6 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Deploy Latency</p>
                  <p className="text-xl font-bold text-foreground">8.4min</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <Activity className="w-3 h-3" />
                    Target: 15min
                  </p>
                </div>
                <Zap className="w-6 h-6 text-orange-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classification Accuracy</p>
                  <p className="text-xl font-bold text-foreground">91.8%</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <Brain className="w-3 h-3" />
                    Target: 90%
                  </p>
                </div>
                <Target className="w-6 h-6 text-blue-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Health</p>
                  <p className="text-xl font-bold text-foreground">Healthy</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <DollarSign className="w-3 h-3" />
                    All criteria passing
                  </p>
                </div>
                <Activity className="w-6 h-6 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Production System - Fills remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Tabs defaultValue="hotad-detection" className="h-full flex flex-col">
          <div className="flex-shrink-0 px-6 pt-4 bg-background">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hotad-detection" className="flex items-center gap-2 text-sm">
                <Zap className="w-3 h-3" />
                <span className="hidden md:inline">HotAd Detection</span>
                <span className="md:hidden">Detection</span>
              </TabsTrigger>
              <TabsTrigger value="warm-leads" className="flex items-center gap-2 text-sm">
                <Users className="w-3 h-3" />
                <span className="hidden md:inline">Warm Leads</span>
                <span className="md:hidden">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="ad-hijack" className="flex items-center gap-2 text-sm">
                <Brain className="w-3 h-3" />
                <span className="hidden md:inline">Ad Hijack</span>
                <span className="md:hidden">Hijack</span>
              </TabsTrigger>
              <TabsTrigger value="campaign-gen" className="flex items-center gap-2 text-sm">
                <Target className="w-3 h-3" />
                <span className="hidden md:inline">Campaign Gen</span>
                <span className="md:hidden">Campaign</span>
              </TabsTrigger>
              <TabsTrigger value="precision-target" className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden md:inline">Targeting</span>
                <span className="md:hidden">Target</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            <TabsContent value="hotad-detection" className="h-full m-0 p-0">
              <div className="h-full overflow-auto p-6">
                <RealTimeHotAdDetector />
              </div>
            </TabsContent>

            <TabsContent value="warm-leads" className="h-full m-0 p-0">
              <div className="h-full overflow-auto p-6">
                <WarmLeadDetector />
              </div>
            </TabsContent>

            <TabsContent value="ad-hijack" className="h-full m-0 p-0">
              <div className="h-full overflow-auto p-6">
                <CompetitorHijackAnalysis />
              </div>
            </TabsContent>

            <TabsContent value="campaign-gen" className="h-full m-0 p-0">
              <div className="h-full overflow-auto p-6">
                <CampaignGenerator />
              </div>
            </TabsContent>

            <TabsContent value="precision-target" className="h-full m-0 p-0">
              <div className="h-full overflow-auto p-6">
                <PrecisionTargeting />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdSignalHijackDashboard;
