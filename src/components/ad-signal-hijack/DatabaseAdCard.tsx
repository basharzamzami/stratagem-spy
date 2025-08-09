
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, TrendingUp } from "lucide-react";
import { DatabaseAdItem } from "@/services/adDatabase";

interface DatabaseAdCardProps {
  ad: DatabaseAdItem;
  onAnalyze?: (id: string) => void;
  onViewOriginal?: (ad: DatabaseAdItem) => void;
}

export default function DatabaseAdCard({ ad, onAnalyze, onViewOriginal }: DatabaseAdCardProps) {
  const formatEngagement = (engagement: Record<string, any> | undefined) => {
    if (!engagement) return null;
    
    return Object.entries(engagement).map(([key, value]) => (
      <span key={key} className="text-xs text-muted-foreground">
        {key}: {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    ));
  };

  const formatPatterns = (patterns: Record<string, any> | undefined) => {
    if (!patterns) return "No patterns detected";
    
    const patternTexts: string[] = [];
    if (patterns.angle) patternTexts.push(`Angle: ${patterns.angle}`);
    if (patterns.format) patternTexts.push(`Format: ${patterns.format}`);
    if (patterns.theme) patternTexts.push(`Theme: ${patterns.theme}`);
    if (patterns.strategy) patternTexts.push(`Strategy: ${patterns.strategy}`);
    
    return patternTexts.length > 0 ? patternTexts.join(" • ") : "No patterns detected";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
      case 'meta': return 'bg-blue-500/10 text-blue-400';
      case 'google': return 'bg-red-500/10 text-red-400';
      case 'youtube': return 'bg-red-600/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20 h-full flex flex-col">
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge className={`${getPlatformColor(ad.platform)} capitalize`}>
            {ad.platform}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(ad.fetched_at)}
          </span>
        </div>

        {/* Competitor */}
        <div>
          <h3 className="font-semibold text-foreground truncate">{ad.competitor}</h3>
        </div>

        {/* Creative */}
        {ad.ad_creative_url && (
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={ad.ad_creative_url}
              alt="Ad Creative"
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}

        {/* CTA and Offer */}
        <div className="space-y-2 flex-1">
          {ad.cta && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">CTA:</span>
              <Badge variant="outline" className="text-xs">
                {ad.cta}
              </Badge>
            </div>
          )}
          {ad.offer && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Offer:</span>
              <span className="text-xs text-foreground font-medium">{ad.offer}</span>
            </div>
          )}
        </div>

        {/* Engagement */}
        {ad.engagement && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Engagement:</span>
            <div className="flex flex-wrap gap-2">
              {formatEngagement(ad.engagement)}
            </div>
          </div>
        )}

        {/* Patterns - Fixed display */}
        {ad.detected_patterns && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Patterns:</span>
            <div className="text-xs text-foreground leading-relaxed">
              {formatPatterns(ad.detected_patterns)}
            </div>
          </div>
        )}

        {/* Actions - Push to bottom */}
        <div className="flex gap-2 pt-2 border-t mt-auto">
          {onAnalyze && (
            <Button size="sm" variant="outline" onClick={() => onAnalyze(ad.id)}>
              <TrendingUp className="w-3 h-3 mr-1" />
              Analyze
            </Button>
          )}
          {onViewOriginal && (
            <Button size="sm" variant="outline" onClick={() => onViewOriginal(ad)}>
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
