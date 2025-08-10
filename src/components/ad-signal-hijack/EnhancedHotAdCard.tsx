
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Zap, 
  Eye, 
  Clock, 
  Target,
  BarChart3,
  ExternalLink,
  Copy,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HotAd {
  id: string;
  competitor: string;
  platform: string;
  headline: string;
  description: string;
  cta: string;
  image: string;
  engagementSpike: number;
  spendIncrease: number;
  velocity: string;
  firstSeen: string;
  metrics: Record<string, number>;
  psychTriggers: string[];
  targetAudience: string;
}

interface EnhancedHotAdCardProps {
  ad: HotAd;
}

export default function EnhancedHotAdCard({ ad }: EnhancedHotAdCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'viral': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getVelocityIcon = (velocity: string) => {
    if (velocity === 'viral') return <Flame className="w-4 h-4" />;
    if (velocity === 'critical') return <AlertTriangle className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Meta': return 'bg-blue-500/20 text-blue-400';
      case 'Google': return 'bg-green-500/20 text-green-400';
      case 'YouTube': return 'bg-red-500/20 text-red-400';
      case 'LinkedIn': return 'bg-blue-600/20 text-blue-300';
      case 'TikTok': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const copyAdContent = () => {
    const content = `${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "Ad Content Copied",
      description: "Ad text copied to clipboard for analysis"
    });
  };

  const formatMetricValue = (key: string, value: number) => {
    if (key === 'impressions' || key === 'views') {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={ad.image} 
                alt={`${ad.competitor} ad`}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="absolute -top-1 -right-1">
                <Badge className={`${getVelocityColor(ad.velocity)} text-xs px-1 py-0.5`}>
                  {getVelocityIcon(ad.velocity)}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{ad.competitor}</h3>
                <Badge className={getPlatformColor(ad.platform)} variant="outline">
                  {ad.platform}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                First seen: {ad.firstSeen} • {ad.velocity.toUpperCase()} velocity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getVelocityColor(ad.velocity)} variant="outline">
              +{ad.engagementSpike}% engagement
            </Badge>
            {ad.spendIncrease > 100 && (
              <Badge className="bg-red-500/20 text-red-400" variant="outline">
                +{ad.spendIncrease}% spend
              </Badge>
            )}
          </div>
        </div>

        {/* Engagement Spike Visual */}
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Engagement Velocity</span>
            <span className="font-medium">{ad.engagementSpike}% above baseline</span>
          </div>
          <Progress 
            value={Math.min(ad.engagementSpike / 10, 100)} 
            className="h-2"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ad Content Preview */}
        <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-l-accent">
          <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
            {ad.headline}
          </h4>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {ad.description}
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              CTA: {ad.cta}
            </Badge>
            <Button size="sm" variant="ghost" onClick={copyAdContent}>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        {/* Psychological Triggers */}
        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Psychological Triggers
          </div>
          <div className="flex flex-wrap gap-1">
            {ad.psychTriggers.map((trigger, index) => (
              <Badge key={index} variant="outline" className="text-xs capitalize">
                {trigger.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(ad.metrics).slice(0, 4).map(([key, value]) => (
            <div key={key} className="text-center p-2 bg-muted/20 rounded">
              <div className="text-sm font-semibold">
                {formatMetricValue(key, value)}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {key}
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <div className="text-sm font-medium mb-1">Target Audience</div>
              <p className="text-xs text-muted-foreground">{ad.targetAudience}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium">Spend Increase:</span> +{ad.spendIncrease}%
              </div>
              <div>
                <span className="font-medium">Platform:</span> {ad.platform}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <Zap className="w-3 h-3 mr-1" />
            Counter-Attack
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="w-3 h-3 mr-1" />
            Analyze
          </Button>
          <Button size="sm" variant="outline">
            <BarChart3 className="w-3 h-3 mr-1" />
            Track
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
