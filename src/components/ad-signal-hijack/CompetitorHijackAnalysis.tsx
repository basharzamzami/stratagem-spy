
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Zap, 
  Eye, 
  Copy,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  PlayCircle
} from 'lucide-react';

interface AdSkeleton {
  hook: string;
  hookType: 'curiosity' | 'problem' | 'status' | 'fear';
  setup: string;
  valueStack: string[];
  cta: string;
  ctaPlacement: 'early' | 'middle' | 'end';
  urgencyTriggers: string[];
}

interface PsychTriggers {
  scarcity: number;
  socialProof: number;
  authority: number;
  novelty: number;
  relatability: number;
  fomo: number;
}

interface CompetitorAd {
  id: string;
  competitor: string;
  platform: string;
  headline: string;
  bodyText: string;
  cta: string;
  imageUrl: string;
  skeleton: AdSkeleton;
  psychTriggers: PsychTriggers;
  offerMechanics: {
    coreOffer: string;
    valueAdds: string[];
    pricePosition: string;
    riskReversal: string;
  };
  performance: {
    estimatedSpend: number;
    engagementRate: number;
    conversionSignals: number;
  };
}

export default function CompetitorHijackAnalysis() {
  const [selectedAd, setSelectedAd] = useState<string>('1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const competitorAds: CompetitorAd[] = [
    {
      id: '1',
      competitor: 'HubSpot',
      platform: 'Meta',
      headline: 'The Marketing Tool Every Growing Business Needs',
      bodyText: 'Stop juggling 10 different tools. Get everything you need to grow your business in one powerful platform. Try HubSpot free for 14 days.',
      cta: 'Start Free Trial',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      skeleton: {
        hook: 'The Marketing Tool Every Growing Business Needs',
        hookType: 'status',
        setup: 'Stop juggling 10 different tools',
        valueStack: ['All-in-one platform', 'Save time', 'Grow faster'],
        cta: 'Start Free Trial',
        ctaPlacement: 'end',
        urgencyTriggers: ['14 days free']
      },
      psychTriggers: {
        scarcity: 60,
        socialProof: 85,
        authority: 90,
        novelty: 40,
        relatability: 95,
        fomo: 70
      },
      offerMechanics: {
        coreOffer: 'Free 14-day trial',
        valueAdds: ['No credit card required', 'Full access'],
        pricePosition: 'Premium with free trial',
        riskReversal: 'No commitment'
      },
      performance: {
        estimatedSpend: 15000,
        engagementRate: 3.2,
        conversionSignals: 8.7
      }
    }
  ];

  const selectedAdData = competitorAds.find(ad => ad.id === selectedAd) || competitorAds[0];

  const getHookTypeColor = (type: string) => {
    switch (type) {
      case 'curiosity': return 'bg-purple-500/10 text-purple-400';
      case 'problem': return 'bg-red-500/10 text-red-400';
      case 'status': return 'bg-blue-500/10 text-blue-400';
      case 'fear': return 'bg-orange-500/10 text-orange-400';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const hijackAd = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // This would generate a hijacked version
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Competitor Ad Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Live Competitor Ad Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ad Preview */}
            <div className="lg:col-span-1">
              <div className="bg-muted/20 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{selectedAdData.competitor}</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                    {selectedAdData.platform}
                  </Badge>
                </div>
                
                <img 
                  src={selectedAdData.imageUrl} 
                  alt="Ad creative" 
                  className="w-full h-32 object-cover rounded mb-3"
                />
                
                <h3 className="font-semibold text-sm mb-2">{selectedAdData.headline}</h3>
                <p className="text-sm text-muted-foreground mb-3">{selectedAdData.bodyText}</p>
                
                <Button size="sm" className="w-full">
                  {selectedAdData.cta}
                </Button>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium">${(selectedAdData.performance.estimatedSpend / 1000).toFixed(0)}K</div>
                    <div className="text-muted-foreground">Spend</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{selectedAdData.performance.engagementRate}%</div>
                    <div className="text-muted-foreground">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{selectedAdData.performance.conversionSignals}</div>
                    <div className="text-muted-foreground">Signals</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="skeleton" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
                  <TabsTrigger value="psychology">Psychology</TabsTrigger>
                  <TabsTrigger value="offers">Offers</TabsTrigger>
                  <TabsTrigger value="hijack">Hijack</TabsTrigger>
                </TabsList>

                <TabsContent value="skeleton" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Ad Structure Breakdown
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">Hook Type</div>
                          <Badge className={getHookTypeColor(selectedAdData.skeleton.hookType)}>
                            {selectedAdData.skeleton.hookType.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">Hook</div>
                          <p className="text-sm bg-muted/30 p-2 rounded">
                            "{selectedAdData.skeleton.hook}"
                          </p>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">Setup/Context</div>
                          <p className="text-sm bg-muted/30 p-2 rounded">
                            "{selectedAdData.skeleton.setup}"
                          </p>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">Value Stack</div>
                          <div className="flex gap-1 flex-wrap">
                            {selectedAdData.skeleton.valueStack.map((value, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">CTA Strategy</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{selectedAdData.skeleton.cta}</Badge>
                            <Badge variant="outline" className="text-xs">
                              Placement: {selectedAdData.skeleton.ctaPlacement}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="psychology" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Psychological Trigger Analysis
                      </h4>
                      
                      <div className="space-y-3">
                        {Object.entries(selectedAdData.psychTriggers).map(([trigger, score]) => (
                          <div key={trigger} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{trigger.replace(/([A-Z])/g, ' $1')}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={score} className="w-20 h-2" />
                              <span className="text-sm font-medium w-8">{score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="text-sm font-medium text-primary mb-1">Dominant Strategy</div>
                        <p className="text-xs text-muted-foreground">
                          Authority + Relatability combo targeting growing businesses with tool fatigue
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="offers" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Offer Mechanics Decoded
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Core Offer</div>
                          <p className="text-sm bg-muted/30 p-2 rounded">
                            {selectedAdData.offerMechanics.coreOffer}
                          </p>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Risk Reversal</div>
                          <p className="text-sm bg-muted/30 p-2 rounded">
                            {selectedAdData.offerMechanics.riskReversal}
                          </p>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Price Position</div>
                          <p className="text-sm bg-muted/30 p-2 rounded">
                            {selectedAdData.offerMechanics.pricePosition}
                          </p>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Value Add-ons</div>
                          <div className="flex gap-1 flex-wrap">
                            {selectedAdData.offerMechanics.valueAdds.map((addon, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {addon}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hijack" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Hijack Strategy Generator
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="text-sm font-medium text-primary mb-2">Hijack Opportunity</div>
                          <p className="text-sm text-muted-foreground">
                            Their hook is status-based but generic. You can hijack with specific pain points and stronger proof.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium mb-2">Original Hook</div>
                            <p className="text-sm bg-muted/30 p-2 rounded border-l-4 border-red-500">
                              "The Marketing Tool Every Growing Business Needs"
                            </p>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium mb-2">Your Hijack Hook</div>
                            <p className="text-sm bg-success/10 p-2 rounded border-l-4 border-success">
                              "The HubSpot Alternative That Costs 70% Less"
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            onClick={hijackAd} 
                            disabled={isAnalyzing}
                            className="flex items-center gap-2"
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                                Generate Hijack Ad
                              </>
                            )}
                          </Button>
                          <Button variant="outline">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Analysis
                          </Button>
                          <Button variant="outline">
                            <PlayCircle className="w-4 h-4 mr-2" />
                            A/B Test
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
