
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Zap, 
  Eye, 
  TrendingUp, 
  Sword,
  ArrowLeft
} from 'lucide-react';
import RichRealTimeMonitor from '@/components/ad-signal-hijack/RichRealTimeMonitor';
import RichWarmLeadDetector from '@/components/ad-signal-hijack/RichWarmLeadDetector';
import CreativeDNAAnalyzer from '@/components/ad-signal-hijack/CreativeDNAAnalyzer';
import CounterAttackOrchestrator from '@/components/ad-signal-hijack/CounterAttackOrchestrator';
import { MockDataProvider } from '@/components/ad-signal-hijack/MockDataProvider';
import { HotAd } from '@/services/mockAdData';

const EnhancedAdSignalHijack = () => {
  const [selectedAd, setSelectedAd] = useState<HotAd | null>(null);
  const [showCounterAttack, setShowCounterAttack] = useState(false);

  const handleCounterAttack = (ad: HotAd) => {
    setSelectedAd(ad);
    setShowCounterAttack(true);
  };

  const handleCloseCounterAttack = () => {
    setShowCounterAttack(false);
    setSelectedAd(null);
  };

  if (showCounterAttack && selectedAd) {
    return (
      <MockDataProvider>
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleCloseCounterAttack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Counter-Attack Mode
              </h1>
              <p className="text-muted-foreground">
                Full spectrum competitive hijacking system
              </p>
            </div>
          </div>
          
          <CounterAttackOrchestrator 
            targetAd={selectedAd}
            onClose={handleCloseCounterAttack}
          />
        </div>
      </MockDataProvider>
    );
  }

  return (
    <MockDataProvider>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Enhanced Ad Signal Hijack
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time competitive intelligence, creative DNA extraction, and automated counter-attack deployment
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="monitor" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Monitor
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Warm Leads
            </TabsTrigger>
            <TabsTrigger value="dna" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Creative DNA
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <RichRealTimeMonitor onCounterAttack={handleCounterAttack} />
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <RichWarmLeadDetector />
          </TabsContent>

          <TabsContent value="dna" className="space-y-6">
            <CreativeDNAAnalyzer />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Counter-Attack Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Sword className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Performance tracking, ROI analysis, and competitive benchmarking
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MockDataProvider>
  );
};

export default EnhancedAdSignalHijack;
