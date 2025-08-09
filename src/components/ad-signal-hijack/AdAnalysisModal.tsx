
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdItem } from "@/services/adSignal";
import { 
  Brain, 
  Target, 
  Zap, 
  DollarSign, 
  Eye, 
  TrendingUp,
  Copy,
  ExternalLink,
  PlayCircle
} from "lucide-react";

interface AdAnalysisModalProps {
  ad: AdItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock analysis data - in real app would come from AI analysis
const getAdAnalysis = (ad: AdItem) => ({
  skeleton: {
    hookType: "Problem-Solution",
    storytellingStyle: "Direct Response",
    valueStack: ["Security", "Reliability", "ROI"],
    ctaPlacement: "Bottom-right",
    flowScore: 8.5
  },
  triggers: [
    { type: "Scarcity", strength: 9, evidence: "Limited time offer" },
    { type: "Authority", strength: 7, evidence: "Fortune 500 trusted" },
    { type: "Social Proof", strength: 8, evidence: "10,000+ customers" },
    { type: "FOMO", strength: 6, evidence: "Don't miss out" }
  ],
  offerMechanics: {
    primaryOffer: "Free 30-day trial",
    riskReversal: "Money-back guarantee",
    urgencyTactic: "Limited-time pricing",
    priceAnchor: "$299/month (was $499)",
    bonuses: ["Free onboarding", "24/7 support"]
  },
  creative: {
    dominantColors: ["#0066CC", "#FF6600"],
    emotionalTone: "Professional urgency",
    visualHierarchy: "Logo → Headline → CTA",
    designStyle: "Clean corporate"
  },
  targeting: {
    demographics: "Business owners 35-55",
    psychographics: "Security-conscious, growth-focused",
    platforms: ["LinkedIn", "Google Search"],
    estimatedBudget: "$5,000-15,000/month"
  }
});

export default function AdAnalysisModal({ ad, isOpen, onClose }: AdAnalysisModalProps) {
  if (!ad) return null;

  const analysis = getAdAnalysis(ad);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Ad Intelligence Analysis - {ad.competitor_name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="skeleton" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
          </TabsList>

          <TabsContent value="skeleton" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Ad Structure & Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Hook Type</h4>
                    <Badge variant="secondary">{analysis.skeleton.hookType}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Flow Score</h4>
                    <div className="text-2xl font-bold text-success">
                      {analysis.skeleton.flowScore}/10
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Value Stack</h4>
                  <div className="flex gap-2 flex-wrap">
                    {analysis.skeleton.valueStack.map((value, idx) => (
                      <Badge key={idx} variant="outline">{value}</Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Actual Ad Content</h4>
                  <p className="font-medium mb-2">{ad.headline}</p>
                  <p className="text-sm text-muted-foreground">{ad.primary_text}</p>
                  {ad.cta && (
                    <Badge className="mt-2">{ad.cta}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="triggers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Psychological Triggers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.triggers.map((trigger, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{trigger.type}</h4>
                        <p className="text-sm text-muted-foreground">{trigger.evidence}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{trigger.strength}/10</div>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${trigger.strength * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Offer Mechanics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Primary Offer</h4>
                      <p className="text-sm">{analysis.offerMechanics.primaryOffer}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Risk Reversal</h4>
                      <p className="text-sm">{analysis.offerMechanics.riskReversal}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Urgency</h4>
                      <p className="text-sm">{analysis.offerMechanics.urgencyTactic}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Price Anchor</h4>
                      <p className="text-sm font-mono">{analysis.offerMechanics.priceAnchor}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Bonuses</h4>
                      <div className="flex flex-col gap-1">
                        {analysis.offerMechanics.bonuses.map((bonus, idx) => (
                          <Badge key={idx} variant="secondary" className="w-fit">
                            {bonus}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creative" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Creative Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Color Palette</h4>
                    <div className="flex gap-2">
                      {analysis.creative.dominantColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Design Style</h4>
                    <Badge variant="outline">{analysis.creative.designStyle}</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Visual Hierarchy</h4>
                  <p className="text-sm text-muted-foreground">
                    {analysis.creative.visualHierarchy}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Emotional Tone</h4>
                  <Badge>{analysis.creative.emotionalTone}</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Targeting Deduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Demographics</h4>
                    <p className="text-sm">{analysis.targeting.demographics}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Estimated Budget</h4>
                    <p className="text-sm font-mono">{analysis.targeting.estimatedBudget}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Psychographics</h4>
                  <p className="text-sm">{analysis.targeting.psychographics}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Platform Focus</h4>
                  <div className="flex gap-2">
                    {analysis.targeting.platforms.map((platform, idx) => (
                      <Badge key={idx} variant="secondary">{platform}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy Analysis
          </Button>
          <Button variant="outline" className="flex-1">
            <PlayCircle className="w-4 h-4 mr-2" />
            Create Counter-Ad
          </Button>
          <Button variant="outline" className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Original
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
