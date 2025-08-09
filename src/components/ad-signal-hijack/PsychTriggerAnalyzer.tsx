
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Zap, 
  Target,
  Eye,
  Clock,
  TrendingUp,
  Copy,
  Rocket
} from 'lucide-react';
import { psychTriggerMapper, TriggerAnalysis, EmotionalTrigger } from '@/services/psychTriggerMapper';
import { useToast } from '@/hooks/use-toast';

export default function PsychTriggerAnalyzer() {
  const [adContent, setAdContent] = useState('');
  const [headline, setHeadline] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triggerAnalysis, setTriggerAnalysis] = useState<TriggerAnalysis | null>(null);
  const [counterAd, setCounterAd] = useState<any>(null);
  const { toast } = useToast();

  const mockBrandAssets = {
    brandName: 'Your Brand',
    mainBenefit: 'Better ROI',
    targetAudience: 'business owners',
    usp: 'Proven system that cuts costs by 50%'
  };

  const analyzeTriggers = async () => {
    if (!adContent.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide ad content to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis = psychTriggerMapper.analyzeTriggers(adContent, headline);
      setTriggerAnalysis(analysis);
      
      // Generate counter-ad
      const generated = psychTriggerMapper.generateCounterAd(
        analysis, 
        adContent, 
        mockBrandAssets
      );
      setCounterAd(generated);
      
      toast({
        title: "🧠 Trigger Analysis Complete",
        description: `Detected ${analysis.dominantTrigger} as primary trigger`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze psychological triggers",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTriggerColor = (trigger: EmotionalTrigger) => {
    const colors = {
      curiosity: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      fear: 'bg-red-500/20 text-red-400 border-red-500/30',
      status: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      relatability: 'bg-green-500/20 text-green-400 border-green-500/30',
      novelty: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      fomo: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[trigger];
  };

  const copyCounterAd = () => {
    if (counterAd) {
      const adText = `${counterAd.headline}\n\n${counterAd.subhead}\n\n${counterAd.cta}`;
      navigator.clipboard.writeText(adText);
      toast({
        title: "Copied to clipboard",
        description: "Counter-ad ready for deployment"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Psychological Trigger Analyzer
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
              placeholder="Paste competitor ad content here..."
              value={adContent}
              onChange={(e) => setAdContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={analyzeTriggers} 
            disabled={isAnalyzing || !adContent.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Analyzing Triggers...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze Psychological Triggers
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {triggerAnalysis && (
        <div className="space-y-6">
          {/* Trigger Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Detected Triggers
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

          {/* Generated Counter-Ad */}
          {counterAd && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Generated Counter-Ad
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyCounterAd}>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm">
                      <Rocket className="w-3 h-3 mr-1" />
                      Launch
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ad Preview */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border-l-4 border-l-primary">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {counterAd.headline}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {counterAd.subhead}
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    {counterAd.cta}
                  </Button>
                </div>

                {/* Strategy Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Strategy</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {counterAd.strategy}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium">Urgency Score</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(counterAd.urgencyScore * 100)}% urgency multiplier
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">Confidence</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(counterAd.confidence * 100)}% match accuracy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deployment Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Deployment Timing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="text-lg font-bold text-success">15min</div>
                  <div className="text-sm text-success/80">High Velocity (80%+)</div>
                  <div className="text-xs text-muted-foreground">Launch immediately</div>
                </div>
                
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="text-lg font-bold text-warning">30min</div>
                  <div className="text-sm text-warning/80">Medium Velocity (60-80%)</div>
                  <div className="text-xs text-muted-foreground">Monitor closely</div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                  <div className="text-lg font-bold text-muted-foreground">Hold</div>
                  <div className="text-sm text-muted-foreground">Low Velocity (&lt;60%)</div>
                  <div className="text-xs text-muted-foreground">Wait for spike</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
