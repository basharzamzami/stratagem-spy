
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Zap, 
  Brain, 
  Eye, 
  Sword,
  Copy,
  Rocket,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { adSkeletonExtractor, HijackIntelligence } from '@/services/adSkeletonExtractor';
import { counterAdWeaponizer, CounterAdWeapon } from '@/services/counterAdWeaponizer';
import { useToast } from '@/hooks/use-toast';

const AdHijackIntelligence = () => {
  const [adContent, setAdContent] = useState('');
  const [headline, setHeadline] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [weaponizing, setWeaponizing] = useState(false);
  const [intelligence, setIntelligence] = useState<HijackIntelligence | null>(null);
  const [counterWeapon, setCounterWeapon] = useState<CounterAdWeapon | null>(null);
  const { toast } = useToast();

  const extractIntelligence = async () => {
    if (!adContent.trim() || !headline.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide both headline and ad content",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      const intel = await adSkeletonExtractor.extractAdIntelligence(
        adContent, 
        headline
      );
      setIntelligence(intel);
      
      toast({
        title: "🧠 Intelligence Extracted",
        description: "Ad DNA decoded and ready for weaponization"
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Unable to analyze ad intelligence",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const weaponizeAd = async () => {
    if (!intelligence || !competitor.trim()) {
      toast({
        title: "Missing Data",
        description: "Need intelligence data and competitor name",
        variant: "destructive"
      });
      return;
    }

    setWeaponizing(true);
    try {
      const weapon = await counterAdWeaponizer.weaponizeAd(
        intelligence,
        competitor
      );
      setCounterWeapon(weapon);
      
      toast({
        title: "⚔️ Weapon Ready",
        description: "Counter-ad weapon generated and ready to deploy"
      });
    } catch (error) {
      toast({
        title: "Weaponization Failed",
        description: "Unable to generate counter-ad weapon",
        variant: "destructive"
      });
    } finally {
      setWeaponizing(false);
    }
  };

  const getTriggerColor = (strength: number) => {
    if (strength >= 70) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (strength >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/5 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Ad Intelligence Extractor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Competitor Name</label>
              <Input
                placeholder="e.g., HubSpot, Salesforce, etc."
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Headline</label>
              <Input
                placeholder="Their exact headline..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Ad Content</label>
            <Textarea
              placeholder="Paste their complete ad text here..."
              value={adContent}
              onChange={(e) => setAdContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={extractIntelligence}
              disabled={analyzing}
              className="flex-1"
            >
              {analyzing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Extracting DNA...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Extract Intelligence
                </>
              )}
            </Button>

            {intelligence && (
              <Button 
                onClick={weaponizeAd}
                disabled={weaponizing}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {weaponizing ? (
                  <>
                    <Sword className="w-4 h-4 mr-2 animate-bounce" />
                    Weaponizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Weapon
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Intelligence Analysis */}
      {intelligence && (
        <Tabs defaultValue="skeleton" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="skeleton">Ad Skeleton</TabsTrigger>
            <TabsTrigger value="psychology">Psychology</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="funnel">Funnel Map</TabsTrigger>
            <TabsTrigger value="gaps">Weaknesses</TabsTrigger>
          </TabsList>

          <TabsContent value="skeleton">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Ad Structure Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hook Analysis */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Hook Intelligence
                  </h4>
                  <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Type</div>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {intelligence.ad_skeleton.hook.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Psychological Driver</div>
                        <p className="text-sm text-muted-foreground">
                          {intelligence.ad_skeleton.hook.psychological_driver}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">Hook Text</div>
                      <p className="text-sm bg-background/50 p-2 rounded">
                        "{intelligence.ad_skeleton.hook.text}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Value Stack */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Value Stack Deconstruction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Benefits</div>
                      <div className="space-y-1">
                        {intelligence.ad_skeleton.value_stack.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="block text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Emotional Triggers</div>
                      <div className="space-y-1">
                        {intelligence.ad_skeleton.value_stack.emotional_triggers.map((trigger, idx) => (
                          <Badge key={idx} variant="secondary" className="block text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Proof Elements</div>
                      <div className="space-y-1">
                        {intelligence.ad_skeleton.value_stack.proof_elements.map((proof, idx) => (
                          <Badge key={idx} variant="outline" className="block text-xs bg-green-500/10 text-green-400">
                            {proof}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Analysis */}
                <div className="space-y-3">
                  <h4 className="font-semibold">CTA Strategy</h4>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Text:</span> {intelligence.ad_skeleton.cta.text}
                      </div>
                      <div>
                        <span className="font-medium">Placement:</span> {intelligence.ad_skeleton.cta.placement}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="psychology">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Psychological Trigger Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(intelligence.psychological_triggers).map(([trigger, data]) => (
                    <div key={trigger} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getTriggerColor(data.strength)}>
                            {trigger.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{data.strength}%</span>
                        </div>
                      </div>
                      <Progress value={data.strength} className="h-2" />
                      {data.elements.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Detected: {data.elements.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creative">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Creative Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Visual Elements</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Primary Visual: </span>
                        <Badge variant="outline">{intelligence.creative_analysis.primary_visual}</Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Motion Style: </span>
                        <Badge variant="outline">{intelligence.creative_analysis.motion_style}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Color Psychology</h4>
                    <div className="flex gap-2">
                      {intelligence.creative_analysis.color_psychology.map((color, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Funnel Mapping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Entry Strategy</h4>
                    <div className="space-y-2 text-sm">
                      <div>Landing Page: {intelligence.funnel_mapping.landing_page_type}</div>
                      <div>Lead Magnet: {intelligence.funnel_mapping.lead_magnet}</div>
                      <div>Nurture Style: {intelligence.funnel_mapping.nurture_style}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Upsell Sequence</h4>
                    <div className="space-y-1">
                      {intelligence.funnel_mapping.upsell_sequence.map((step, idx) => (
                        <Badge key={idx} variant="outline" className="block text-xs">
                          Step {idx + 1}: {step}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Hijack Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-destructive">Weakness Gaps</h4>
                  <div className="space-y-2">
                    {intelligence.hijack_opportunities.weakness_gaps.map((gap, idx) => (
                      <div key={idx} className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
                        {gap}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-orange-500">Amplification Angles</h4>
                  <div className="space-y-2">
                    {intelligence.hijack_opportunities.amplification_angles.map((angle, idx) => (
                      <div key={idx} className="p-2 bg-orange-500/10 border border-orange-500/20 rounded text-sm">
                        {angle}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-success">Counter-Positioning</h4>
                  <div className="space-y-2">
                    {intelligence.hijack_opportunities.counter_positioning.map((position, idx) => (
                      <div key={idx} className="p-2 bg-success/10 border border-success/20 rounded text-sm">
                        {position}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Counter-Weapon Display */}
      {counterWeapon && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/5 border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sword className="w-5 h-5" />
                Counter-Ad Weapon
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Rocket className="w-3 h-3 mr-1" />
                  Deploy
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Generated Ad */}
            <div className="bg-background/50 p-6 rounded-lg border-l-4 border-l-orange-500">
              <h3 className="text-lg font-bold mb-2">
                {counterWeapon.counter_creative.headline}
              </h3>
              <p className="text-muted-foreground mb-2 text-sm italic">
                {counterWeapon.counter_creative.hook_amplification}
              </p>
              <p className="text-foreground/90 mb-4 text-sm leading-relaxed">
                {counterWeapon.counter_creative.body_text}
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                {counterWeapon.counter_creative.cta}
              </Button>
            </div>

            {/* Amplification Analysis */}
            <div>
              <h4 className="font-semibold mb-3">Psychological Amplifiers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {counterWeapon.psychological_amplifiers.map((amp, idx) => (
                  <div key={idx} className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">{amp.trigger}</Badge>
                      <div className="text-xs">
                        {amp.original_strength}% → {amp.amplified_strength}%
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {amp.amplification_method}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Concept */}
            <div>
              <h4 className="font-semibold mb-2">Visual Concept</h4>
              <p className="text-sm bg-muted/30 p-3 rounded">
                {counterWeapon.counter_creative.visual_concept}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdHijackIntelligence;
