
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Target, 
  Zap, 
  Eye, 
  Users,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adContentParser, ParsedAdData } from '@/services/adContentParser';

export default function AdContentParserComponent() {
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedAdData | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const parseAdContent = async () => {
    if (!headline.trim() && !bodyText.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide at least a headline or body text",
        variant: "destructive"
      });
      return;
    }

    setIsParsing(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const adId = `ad_${Date.now()}`;
      const result = await adContentParser.parseAdContent(
        adId,
        headline,
        bodyText,
        imageUrl || undefined,
        platform
      );

      clearInterval(progressInterval);
      setProgress(100);
      setParsedData(result);

      toast({
        title: "🧠 Parsing Complete",
        description: `Ad analyzed with ${result.confidence_score}% confidence`
      });
    } catch (error) {
      toast({
        title: "Parsing Failed",
        description: "Unable to parse ad content. Please try again.",
        variant: "destructive"
      });
      console.error('Parsing error:', error);
    } finally {
      setIsParsing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTriggerBadgeColor = (active: boolean) => {
    return active 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-muted text-muted-foreground border-muted';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            NLP Ad Content Parser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Headline</label>
              <Input
                placeholder="Enter ad headline..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Body Text</label>
            <Textarea
              placeholder="Paste ad body content here..."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL (Optional)</label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <Button 
            onClick={parseAdContent} 
            disabled={isParsing || (!headline.trim() && !bodyText.trim())}
            className="w-full"
          >
            {isParsing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Parsing with NLP Models...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Parse Ad Content
              </>
            )}
          </Button>

          {isParsing && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {parsedData && (
        <div className="space-y-6">
          {/* Confidence Score */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold text-primary">Analysis Complete</h3>
                    <p className="text-sm text-muted-foreground">
                      Ad structure parsed with machine learning
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getConfidenceColor(parsedData.confidence_score)}`}>
                    {parsedData.confidence_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ad Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ad Skeleton Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hook Type</label>
                    <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {parsedData.skeleton.hook_type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hook</label>
                    <p className="text-sm mt-1 p-2 bg-muted/30 rounded">{parsedData.skeleton.hook}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Setup</label>
                    <p className="text-sm mt-1 p-2 bg-muted/30 rounded">{parsedData.skeleton.setup}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CTA</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{parsedData.skeleton.cta.text}</Badge>
                      <Badge 
                        className={
                          parsedData.skeleton.cta.urgency === 'high' 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : parsedData.skeleton.cta.urgency === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }
                      >
                        {parsedData.skeleton.cta.urgency} urgency
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Value Stack</label>
                    <div className="space-y-1 mt-1">
                      {parsedData.skeleton.value_stack.length > 0 ? (
                        parsedData.skeleton.value_stack.map((benefit, index) => (
                          <p key={index} className="text-sm p-2 bg-muted/30 rounded">
                            • {benefit}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No clear benefits detected</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Psychological Triggers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Psychological Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Badge className={getTriggerBadgeColor(parsedData.triggers.scarcity)} variant="outline">
                  {parsedData.triggers.scarcity && <CheckCircle className="w-3 h-3 mr-1" />}
                  Scarcity
                </Badge>
                
                <Badge className={getTriggerBadgeColor(parsedData.triggers.social_proof.present)} variant="outline">
                  {parsedData.triggers.social_proof.present && <CheckCircle className="w-3 h-3 mr-1" />}
                  Social Proof
                </Badge>
                
                <Badge className={getTriggerBadgeColor(parsedData.triggers.authority)} variant="outline">
                  {parsedData.triggers.authority && <CheckCircle className="w-3 h-3 mr-1" />}
                  Authority
                </Badge>
                
                <Badge className={getTriggerBadgeColor(parsedData.triggers.novelty)} variant="outline">
                  {parsedData.triggers.novelty && <CheckCircle className="w-3 h-3 mr-1" />}
                  Novelty
                </Badge>
                
                <Badge className={getTriggerBadgeColor(parsedData.triggers.relatability)} variant="outline">
                  {parsedData.triggers.relatability && <CheckCircle className="w-3 h-3 mr-1" />}
                  Relatability
                </Badge>
                
                <Badge className={getTriggerBadgeColor(parsedData.triggers.fomo)} variant="outline">
                  {parsedData.triggers.fomo && <CheckCircle className="w-3 h-3 mr-1" />}
                  FOMO
                </Badge>
              </div>

              {parsedData.triggers.social_proof.present && parsedData.triggers.social_proof.elements.length > 0 && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Social Proof Elements:</h4>
                  <div className="flex gap-2">
                    {parsedData.triggers.social_proof.elements.map((element, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {element}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offer & Audience Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Offer Mechanics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Core Offer</label>
                  <p className="text-sm mt-1">{parsedData.offer.core_offer}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pricing Model</label>
                  <Badge className="ml-2" variant="outline">
                    {parsedData.offer.pricing_model.replace('_', ' ')}
                  </Badge>
                </div>

                {parsedData.offer.bonuses.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bonuses</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parsedData.offer.bonuses.map((bonus, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {bonus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {parsedData.offer.risk_reversal.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Risk Reversal</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parsedData.offer.risk_reversal.map((reversal, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {reversal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Audience Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Language Style</label>
                  <Badge className="ml-2" variant="outline">
                    {parsedData.audience.language_style}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Platform Fit</label>
                  <Badge className="ml-2" variant="outline">
                    {parsedData.audience.platform_fit}
                  </Badge>
                </div>

                {parsedData.audience.pain_points.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pain Points</label>
                    <div className="space-y-1 mt-1">
                      {parsedData.audience.pain_points.slice(0, 3).map((pain, index) => (
                        <p key={index} className="text-xs p-2 bg-muted/30 rounded">
                          {pain}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
