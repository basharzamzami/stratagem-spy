
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdItem } from "@/services/adSignal";
import { Eye, ExternalLink, Copy, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { memo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface OptimizedAdCardProps {
  ad: AdItem;
  onAnalyze?: (id: string) => void;
  onViewOriginal?: (ad: AdItem) => void;
  isAnalyzing?: boolean;
}

const OptimizedAdCard = memo(function OptimizedAdCard({ 
  ad, 
  onAnalyze, 
  onViewOriginal,
  isAnalyzing = false
}: OptimizedAdCardProps) {
  const { toast } = useToast();

  const handleCopyText = useCallback(async () => {
    const text = `${ad.headline || ''}\n${ad.primary_text || ''}`.trim();
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Ad text copied successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive"
      });
    }
  }, [ad.headline, ad.primary_text, toast]);

  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }, []);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              {ad.creative_url ? (
                <img 
                  src={ad.creative_url} 
                  alt="Ad creative" 
                  className="w-full h-full object-cover rounded-lg" 
                  loading="lazy"
                />
              ) : (
                <Eye className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground truncate max-w-48">
                {ad.competitor_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {ad.platform.toUpperCase()}
                </Badge>
                {ad.active && (
                  <Badge className="bg-success/10 text-success text-xs">
                    Live
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(ad.first_seen)}
            </div>
          </div>
        </div>

        {/* Creative Preview */}
        <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary mb-4">
          <h4 className="font-medium text-foreground mb-2 line-clamp-2">
            {ad.headline || 'No headline'}
          </h4>
          {ad.primary_text && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {ad.primary_text}
            </p>
          )}
          {ad.cta && (
            <Badge variant="outline" className="text-xs">
              {ad.cta}
            </Badge>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Spend</span>
            </div>
            <div className="text-sm font-medium">
              ${Math.floor(Math.random() * 5000) + 500}/day
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Reach</span>
            </div>
            <div className="text-sm font-medium">
              {Math.floor(Math.random() * 500) + 50}K
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">CTR</span>
            </div>
            <div className="text-sm font-medium">
              {(Math.random() * 5 + 1).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onAnalyze && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onAnalyze(ad.id)}
              disabled={isAnalyzing}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleCopyText}>
            <Copy className="w-4 h-4" />
          </Button>
          {onViewOriginal && (
            <Button size="sm" variant="outline" onClick={() => onViewOriginal(ad)}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default OptimizedAdCard;
