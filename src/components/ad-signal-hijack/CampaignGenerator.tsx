
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Target, 
  Copy, 
  PlayCircle,
  Wand2,
  Brain,
  TrendingUp,
  Eye
} from 'lucide-react';

interface GeneratedCampaign {
  id: string;
  name: string;
  hook: string;
  bodyText: string;
  cta: string;
  platform: string;
  hijackedFrom: string;
  warmLeadMatch: number;
  competitorBeat: number;
  estimatedCTR: number;
  generatedAt: string;
}

export default function CampaignGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('1');

  const generatedCampaigns: GeneratedCampaign[] = [
    {
      id: '1',
      name: 'HubSpot Alternative Campaign',
      hook: 'The HubSpot Alternative That Costs 70% Less',
      bodyText: 'Stop overpaying for marketing tools. Get the same features HubSpot charges $3,000/month for at just $299. Real customers, real results, real savings.',
      cta: 'Try Free for 30 Days',
      platform: 'Meta',
      hijackedFrom: 'HubSpot',
      warmLeadMatch: 94,
      competitorBeat: 87,
      estimatedCTR: 4.2,
      generatedAt: '2 minutes ago'
    }
  ];

  const selectedCampaignData = generatedCampaigns.find(c => c.id === selectedCampaign) || generatedCampaigns[0];

  const generateNewCampaign = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Generation Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Campaign Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Warm Leads Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">8</div>
              <div className="text-sm text-muted-foreground">Competitor Ads Hijacked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">95%</div>
              <div className="text-sm text-muted-foreground">Intent Match Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">4.2%</div>
              <div className="text-sm text-muted-foreground">Predicted CTR</div>
            </div>
          </div>

          <Button 
            onClick={generateNewCampaign} 
            disabled={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Generating Precision Campaign...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate New Campaign
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Generated Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Campaign Preview</TabsTrigger>
              <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
              <TabsTrigger value="targeting">Targeting Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Preview */}
                <div>
                  <div className="bg-muted/20 rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">Generated Campaign</Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                        {selectedCampaignData.platform}
                      </Badge>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-400">
                        Hijacked from {selectedCampaignData.hijackedFrom}
                      </Badge>
                    </div>
                    
                    <div className="w-full h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded mb-3 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-muted-foreground" />
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2">{selectedCampaignData.hook}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{selectedCampaignData.bodyText}</p>
                    
                    <Button size="sm" className="w-full">
                      {selectedCampaignData.cta}
                    </Button>

                    <div className="mt-3 text-xs text-muted-foreground">
                      Generated {selectedCampaignData.generatedAt}
                    </div>
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Performance Indicators</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Warm Lead Match</span>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedCampaignData.warmLeadMatch} className="w-20 h-2" />
                            <span className="text-sm font-medium w-8">{selectedCampaignData.warmLeadMatch}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Competitor Beat Score</span>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedCampaignData.competitorBeat} className="w-20 h-2" />
                            <span className="text-sm font-medium w-8">{selectedCampaignData.competitorBeat}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Estimated CTR</span>
                          <span className="text-sm font-medium text-success">{selectedCampaignData.estimatedCTR}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Launch Campaign
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Campaign Intelligence Breakdown
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Hijack Strategy</div>
                      <p className="text-sm bg-muted/30 p-3 rounded">
                        Directly challenges competitor pricing while maintaining their proven hook structure. 
                        Uses specific numbers (70% less, $299 vs $3,000) to create immediate value contrast.
                      </p>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Warm Lead Alignment</div>
                      <p className="text-sm bg-muted/30 p-3 rounded">
                        Targets 12 warm leads actively searching for "affordable marketing automation" 
                        and "HubSpot alternatives" in the last 48 hours.
                      </p>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Psychological Triggers Used</div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">Price Anchoring</Badge>
                        <Badge variant="secondary">Social Proof</Badge>
                        <Badge variant="secondary">Loss Aversion</Badge>
                        <Badge variant="secondary">Urgency</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-4">
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Precision Targeting Setup</h3>
                <p className="text-muted-foreground">Configure audience parameters and bidding strategy</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
