import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dna, 
  Palette, 
  MessageSquare, 
  Eye, 
  Zap,
  Target,
  Copy,
  Download,
  Brain
} from 'lucide-react';
import { creativeDNAExtractor } from '@/services/creativeDNAExtractor';
import { psychTriggerMapper, TriggerAnalysis } from '@/services/psychTriggerMapper';
import { CreativeDNA } from '@/services/engagementMonitor';
import { useToast } from '@/hooks/use-toast';

interface CreativeDNAAnalyzerProps {
  initialData?: {
    headline?: string;
    content?: string;
    imageUrl?: string;
  };
  onAnalysisComplete?: () => void;
}

const CreativeDNAAnalyzer = ({ initialData, onAnalysisComplete }: CreativeDNAAnalyzerProps) => {
  const [adContent, setAdContent] = useState(initialData?.content || '');
  const [adImageUrl, setAdImageUrl] = useState(initialData?.imageUrl || '');
  const [headline, setHeadline] = useState(initialData?.headline || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [creativeDNA, setCreativeDNA] = useState<CreativeDNA | null>(null);
  const [triggerAnalysis, setTriggerAnalysis] = useState<TriggerAnalysis | null>(null);
  const { toast } = useToast();

  // Auto-analyze if initial data is provided
  useEffect(() => {
    if (initialData?.content && !creativeDNA) {
      analyzeAd();
    }
  }, [initialData]);

  const analyzeAd = async () => {
    if (!adContent.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide ad content to analyze",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressSteps = [
      { progress: 20, step: "Analyzing text content..." },
      { progress: 40, step: "Extracting visual elements..." },
      { progress: 60, step: "Identifying psychological triggers..." },
      { progress: 80, step: "Mapping creative structure..." },
      { progress: 100, step: "Building DNA profile..." }
    ];

    for (const step of progressSteps) {
      setTimeout(() => {
        setAnalysisProgress(step.progress);
      }, step.progress * 30);
    }

    try {
      // Get creative DNA
      const dna = await creativeDNAExtractor.analyzeAd(adContent, adImageUrl);
      setCreativeDNA(dna);
      
      // Get psychological triggers
      const triggers = psychTriggerMapper.analyzeTriggers(adContent, headline);
      setTriggerAnalysis(triggers);
      
      toast({
        title: "🧬 Complete Analysis Ready",
        description: "Creative DNA + psychological triggers mapped"
      });

      // Mark step as complete
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze creative DNA",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisProgress(0);
      }, 3000);
    }
  };

  const copyDNABlueprint = () => {
    if (creativeDNA && triggerAnalysis) {
      const blueprint = JSON.stringify({ creativeDNA, triggerAnalysis }, null, 2);
      navigator.clipboard.writeText(blueprint);
      toast({
        title: "Copied to clipboard",
        description: "Complete analysis blueprint ready for use"
      });
    }
  };

  const getHookTypeColor = (hookType: string) => {
    const colors = {
      curiosity: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      fear: 'bg-red-500/20 text-red-400 border-red-500/30',
      status: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      urgency: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      social_proof: 'bg-green-500/20 text-green-400 border-green-500/30',
      scarcity: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[hookType as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getTriggerColor = (trigger: string) => {
    const colors = {
      curiosity: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      fear: 'bg-red-500/20 text-red-400 border-red-500/30',
      status: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      relatability: 'bg-green-500/20 text-green-400 border-green-500/30',
      novelty: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      fomo: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[trigger as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Input Section - Only show if no initial data */}
      {!initialData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="w-5 h-5" />
              Enhanced Creative DNA Extractor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Headline (Optional)</label>
              <Input
                placeholder="Enter competitor's headline..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Content</label>
              <Textarea
                placeholder="Paste competitor ad text here..."
                value={adContent}
                onChange={(e) => setAdContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Image URL (Optional)</label>
              <Input
                placeholder="https://example.com/ad-image.jpg"
                value={adImageUrl}
                onChange={(e) => setAdImageUrl(e.target.value)}
              />
            </div>

            <Button 
              onClick={analyzeAd} 
              disabled={analyzing || !adContent.trim()}
              className="w-full"
            >
              {analyzing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Extracting DNA...
                </>
              ) : (
                <>
                  <Dna className="w-4 h-4 mr-2" />
                  Analyze Creative DNA + Triggers
                </>
              )}
            </Button>

            {analyzing && (
              <div className="space-y-2">
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Deep analysis in progress... {analysisProgress}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {creativeDNA && triggerAnalysis && (
        <Tabs defaultValue="dna" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dna">Creative DNA</TabsTrigger>
            <TabsTrigger value="psychology">Psychology</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="dna" className="space-y-6">
            {/* Core DNA Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Core DNA Profile
                  </div>
                  <Button variant="outline" size="sm" onClick={copyDNABlueprint}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hook Type</label>
                  <Badge className={getHookTypeColor(creativeDNA.hook_type)} variant="outline">
                    {creativeDNA.hook_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Badge variant="secondary">
                    {creativeDNA.tone.charAt(0).toUpperCase() + creativeDNA.tone.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ad Structure</label>
                  <Badge variant="outline">
                    {creativeDNA.ad_structure}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA Style</label>
                  <Badge variant="outline">
                    {creativeDNA.cta_style}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="psychology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Psychological Trigger Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {triggerAnalysis.primaryTriggers.map((triggerScore, index) => (
                    <div key={triggerScore.trigger} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={getTriggerColor(triggerScore.trigger)} 
                          variant="outline"
                        >
                          {index === 0 && '🎯 '}
                          {triggerScore.trigger.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">
                          {Math.round(triggerScore.confidence * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={triggerScore.confidence * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        Detected: {triggerScore.detectedPhrases.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-sm font-medium text-primary mb-1">
                    Dominant Strategy: {triggerAnalysis.dominantTrigger.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {Math.round(triggerAnalysis.overallConfidence * 100)}%
                    {triggerAnalysis.secondaryTrigger && ` • Secondary: ${triggerAnalysis.secondaryTrigger}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            {/* Visual Elements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visual Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Palette
                  </label>
                  <div className="flex gap-2">
                    {creativeDNA.color_palette.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border border-muted"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Visual Elements</label>
                  <div className="flex flex-wrap gap-1">
                    {creativeDNA.visual_elements.map(element => (
                      <Badge key={element} variant="secondary" className="text-xs">
                        {element.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            {/* Psychological Triggers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Psychological Triggers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {creativeDNA.psychological_triggers.map(trigger => (
                    <div key={trigger} className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium text-sm capitalize">
                        {trigger.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Psychological influence
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Target className="w-4 h-4 mr-2" />
                    Generate Counter-Ad
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CreativeDNAAnalyzer;
