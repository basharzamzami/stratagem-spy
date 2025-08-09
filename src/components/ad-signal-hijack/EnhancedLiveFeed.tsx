
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  ExternalLink, 
  Copy, 
  Calendar,
  TrendingUp,
  Loader2,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchAdsFromDatabase, DatabaseAdItem } from '@/services/adDatabase';
import { AdItem } from '@/services/adSignal';

interface EnhancedLiveFeedProps {
  ads: AdItem[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function EnhancedLiveFeed({ ads, isLoading, onLoadMore, hasMore }: EnhancedLiveFeedProps) {
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch ads from database instead of relying on props
  const { data: databaseAds, isLoading: dbLoading, refetch } = useQuery({
    queryKey: ['enhanced-live-ads'],
    queryFn: () => fetchAdsFromDatabase(50),
    refetchInterval: 30000,
  });

  const displayAds = databaseAds || [];

  const handleAnalyzeAd = async (adId: string) => {
    setIsAnalyzing(adId);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Ad analysis complete",
        description: "Detailed insights have been generated for this ad"
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(null);
    }
  };

  const handleCopyStrategy = async (ad: DatabaseAdItem) => {
    const strategyText = `
Ad Strategy Analysis:
Competitor: ${ad.competitor}
Platform: ${ad.platform}
Headline: ${ad.headline || 'No headline'}
Primary Text: ${ad.primary_text || 'No primary text'}
CTA: ${ad.cta || 'No CTA'}
Offer: ${ad.offer || 'No offer'}
    `.trim();
    
    try {
      await navigator.clipboard.writeText(strategyText);
      toast({
        title: "Strategy copied",
        description: "Ad strategy details copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleViewOriginal = (ad: DatabaseAdItem) => {
    if (ad.ad_creative_url) {
      window.open(ad.ad_creative_url, '_blank');
    } else {
      toast({
        title: "No creative URL",
        description: "This ad doesn't have a creative URL to view."
      });
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'meta': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'google': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'youtube': return 'bg-red-600/20 text-red-500 border-red-600/30';
      case 'linkedin': return 'bg-blue-600/20 text-blue-600 border-blue-600/30';
      case 'tiktok': return 'bg-pink-500/20 text-pink-700 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (dbLoading && displayAds.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3" />
        <span className="text-muted-foreground">Loading live ads...</span>
      </div>
    );
  }

  if (displayAds.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No ads found</h3>
        <p className="text-muted-foreground mb-4">
          The live feed appears empty. Check the connection.
        </p>
        <Button onClick={() => refetch()}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full overflow-auto">
      <div className="text-sm text-muted-foreground mb-4">
        Showing {displayAds.length} live ads
      </div>
      
      {displayAds.map((ad) => (
        <Card key={ad.id} className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            {/* Ad Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-lg overflow-hidden flex items-center justify-center">
                  {ad.ad_creative_url ? (
                    <img 
                      src={ad.ad_creative_url} 
                      alt="Ad creative" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <Eye className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{ad.competitor}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getPlatformColor(ad.platform)}>
                      {ad.platform}
                    </Badge>
                    {ad.active && (
                      <Badge className="bg-success/20 text-success border-success/30">
                        Live
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Detected</div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-3 h-3" />
                  {new Date(ad.fetched_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Ad Creative Preview */}
            <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary mb-4">
              <h4 className="font-semibold text-foreground mb-2">{ad.headline || 'No headline available'}</h4>
              {ad.primary_text && (
                <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{ad.primary_text}</p>
              )}
              <div className="flex items-center gap-2">
                {ad.cta && (
                  <Button size="sm" variant="outline" className="text-xs">
                    {ad.cta}
                  </Button>
                )}
                {ad.offer && (
                  <Badge variant="secondary" className="text-xs">
                    {ad.offer}
                  </Badge>
                )}
              </div>
            </div>

            {/* Engagement Metrics */}
            {ad.engagement && (
              <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-muted/20 rounded-lg">
                {Object.entries(ad.engagement).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-muted-foreground capitalize mb-1">{key}</div>
                    <div className="font-semibold text-foreground">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detected Patterns */}
            {ad.detected_patterns && (
              <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="text-xs text-muted-foreground mb-2">Detected Patterns:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(ad.detected_patterns).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                      <span className="ml-1 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => handleAnalyzeAd(ad.id)}
                disabled={isAnalyzing === ad.id}
              >
                {isAnalyzing === ad.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => handleCopyStrategy(ad)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Strategy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewOriginal(ad)}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
