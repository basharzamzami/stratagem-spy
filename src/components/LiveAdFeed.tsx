
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  Play, 
  Pause, 
  Eye, 
  ExternalLink, 
  Copy, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Target,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchAdsFromDatabase, DatabaseAdItem } from '@/services/adDatabase';

const LiveAdFeed = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLive, setIsLive] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const { toast } = useToast();

  console.log('LiveAdFeed: Component mounted, fetching ads...');

  const { data: ads, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['live-ads-feed'],
    queryFn: async () => {
      console.log('LiveAdFeed: Fetching ads from database...');
      try {
        const result = await fetchAdsFromDatabase(20);
        console.log('LiveAdFeed: Successfully fetched ads:', result);
        return result;
      } catch (err) {
        console.error('LiveAdFeed: Error fetching ads:', err);
        throw err;
      }
    },
    refetchInterval: isLive ? 30000 : false, // Auto-refresh every 30 seconds when live
    retry: 3,
    retryDelay: 1000,
  });

  const platformColors = {
    Meta: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    Google: 'bg-green-500/20 text-green-700 border-green-500/30',
    YouTube: 'bg-red-500/20 text-red-700 border-red-500/30',
    TikTok: 'bg-pink-500/20 text-pink-700 border-pink-500/30',
    LinkedIn: 'bg-blue-600/20 text-blue-600 border-blue-600/30'
  };

  const handleLiveToggle = () => {
    setIsLive(!isLive);
    toast({
      title: isLive ? "Live monitoring paused" : "Live monitoring resumed",
      description: isLive ? "Ad feed will no longer update automatically" : "Ad feed will now update in real-time"
    });
  };

  const handleAnalyzeAd = async (adId: string) => {
    setIsAnalyzing(adId);
    
    try {
      // Simulate analysis API call
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

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    setCurrentPage(newPage);
    
    toast({
      title: `Loading page ${newPage}`,
      description: "Fetching more ads..."
    });
  };

  const getFilteredAds = () => {
    if (!ads) return [];
    if (selectedTab === 'all') return ads;
    return ads.filter(ad => ad.platform.toLowerCase() === selectedTab);
  };

  const filteredAds = getFilteredAds();

  console.log('LiveAdFeed: Current state - isLoading:', isLoading, 'ads:', ads?.length || 0, 'filtered:', filteredAds.length);

  if (isError) {
    console.error('LiveAdFeed: Query error:', error);
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Feed Error</h3>
            <p className="text-muted-foreground mb-4">
              {(error as Error)?.message || 'Failed to load live ad feed'}
            </p>
            <Button onClick={() => refetch()}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Live Ad Feed
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={handleLiveToggle}
            >
              {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isLive ? 'Live' : 'Paused'}
            </Button>
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
              {filteredAds.length} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({ads?.length || 0})</TabsTrigger>
            <TabsTrigger value="meta">Meta ({ads?.filter(ad => ad.platform.toLowerCase() === 'meta').length || 0})</TabsTrigger>
            <TabsTrigger value="google">Google ({ads?.filter(ad => ad.platform.toLowerCase() === 'google').length || 0})</TabsTrigger>
            <TabsTrigger value="youtube">YouTube ({ads?.filter(ad => ad.platform.toLowerCase() === 'youtube').length || 0})</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok ({ads?.filter(ad => ad.platform.toLowerCase() === 'tiktok').length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {/* Debug Info */}
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded text-xs">
              Debug: isLoading={String(isLoading)}, totalAds={ads?.length || 0}, filteredAds={filteredAds.length}, error={error ? 'yes' : 'no'}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="ml-2 text-muted-foreground">Loading live ads...</span>
              </div>
            )}

            {/* No Ads State */}
            {!isLoading && filteredAds.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No ads found</h3>
                <p className="text-muted-foreground">
                  {selectedTab === 'all' 
                    ? 'The live feed appears empty. Check the connection.' 
                    : `No ${selectedTab} ads available in the current feed.`
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  className="mt-4"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Refresh Feed
                </Button>
              </div>
            )}

            {/* Ads Display */}
            {!isLoading && filteredAds.length > 0 && (
              <>
                {filteredAds.map((ad) => (
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
                              <Badge className={platformColors[ad.platform as keyof typeof platformColors] || 'bg-gray-500/20 text-gray-700'}>
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

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredAds.length} live ads
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePageChange('next')}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveAdFeed;
