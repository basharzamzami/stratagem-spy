
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface AdData {
  id: string;
  competitor: string;
  platform: 'Meta' | 'Google' | 'YouTube' | 'TikTok';
  creative: {
    type: 'image' | 'video' | 'carousel';
    thumbnail: string;
    headline: string;
    primaryText: string;
    cta: string;
  };
  metrics: {
    spend: string;
    impressions: string;
    engagement: string;
    startDate: string;
    status: 'active' | 'paused' | 'ended';
  };
  analysis: {
    angle: 'emotional' | 'logical' | 'mixed';
    offerType: string;
    urgency: boolean;
  };
}

const LiveAdFeed = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLive, setIsLive] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const { toast } = useToast();
  
  const mockAds: AdData[] = [
    {
      id: '1',
      competitor: 'TechCorp Solutions',
      platform: 'Meta',
      creative: {
        type: 'video',
        thumbnail: '/placeholder.svg',
        headline: 'Transform Your Business with AI-Powered Analytics',
        primaryText: 'Join 50,000+ companies already using our platform to make data-driven decisions. Get started with our free 14-day trial and see results in 24 hours.',
        cta: 'Start Free Trial'
      },
      metrics: {
        spend: '$12,500/day',
        impressions: '450K',
        engagement: '3.2%',
        startDate: '2024-01-15',
        status: 'active'
      },
      analysis: {
        angle: 'logical',
        offerType: 'Free Trial',
        urgency: true
      }
    },
    {
      id: '2',
      competitor: 'Digital Innovate',
      platform: 'Google',
      creative: {
        type: 'image',
        thumbnail: '/placeholder.svg',
        headline: 'Scale Your Revenue 10x Faster',
        primaryText: 'Stop leaving money on the table. Our proven system helped 1,000+ businesses increase revenue by 300% in 90 days.',
        cta: 'Get Case Studies'
      },
      metrics: {
        spend: '$8,200/day',
        impressions: '320K',
        engagement: '4.1%',
        startDate: '2024-01-12',
        status: 'active'
      },
      analysis: {
        angle: 'emotional',
        offerType: 'Case Studies',
        urgency: false
      }
    }
  ];

  const platformColors = {
    Meta: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    Google: 'bg-green-500/20 text-green-700 border-green-500/30',
    YouTube: 'bg-red-500/20 text-red-700 border-red-500/30',
    TikTok: 'bg-pink-500/20 text-pink-700 border-pink-500/30'
  };

  const statusColors = {
    active: 'bg-success/20 text-success border-success/30',
    paused: 'bg-warning/20 text-warning border-warning/30',
    ended: 'bg-muted text-muted-foreground border-muted'
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
      
      // In real implementation, this would open a detailed analysis modal or navigate to analysis page
      
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

  const handleCopyStrategy = async (ad: AdData) => {
    const strategyText = `
Ad Strategy Analysis:
Competitor: ${ad.competitor}
Platform: ${ad.platform}
Headline: ${ad.creative.headline}
Angle: ${ad.analysis.angle}
Offer: ${ad.analysis.offerType}
CTA: ${ad.creative.cta}
Urgency: ${ad.analysis.urgency ? 'Yes' : 'No'}
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

  const handleViewOriginal = (ad: AdData) => {
    // In real implementation, this would open the original ad in a new tab
    const platformUrl = ad.platform === 'Meta' ? 'facebook.com' : 
                       ad.platform === 'Google' ? 'ads.google.com' : 
                       ad.platform === 'YouTube' ? 'youtube.com' : 'tiktok.com';
    
    toast({
      title: "Opening original ad",
      description: `Redirecting to ${ad.platform} to view the original ad`
    });
    
    // window.open(`https://${platformUrl}`, '_blank');
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    setCurrentPage(newPage);
    
    toast({
      title: `Loading page ${newPage}`,
      description: "Fetching more ads..."
    });
  };

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
              {mockAds.length} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({mockAds.length})</TabsTrigger>
            <TabsTrigger value="meta">Meta (1)</TabsTrigger>
            <TabsTrigger value="google">Google (1)</TabsTrigger>
            <TabsTrigger value="youtube">YouTube (0)</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {mockAds.map((ad) => (
              <Card key={ad.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  {/* Ad Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {ad.creative.type === 'video' ? (
                          <Play className="w-6 h-6 text-primary" />
                        ) : (
                          <img src={ad.creative.thumbnail} alt="Ad thumbnail" className="w-full h-full object-cover rounded" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{ad.competitor}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={platformColors[ad.platform]}>
                            {ad.platform}
                          </Badge>
                          <Badge className={statusColors[ad.metrics.status]}>
                            {ad.metrics.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Launch Date</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(ad.metrics.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Ad Creative Preview */}
                  <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary mb-4">
                    <h4 className="font-semibold text-foreground mb-2">{ad.creative.headline}</h4>
                    <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{ad.creative.primaryText}</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {ad.creative.cta}
                    </Button>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Daily Spend</span>
                      </div>
                      <div className="font-semibold text-foreground">{ad.metrics.spend}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Impressions</span>
                      </div>
                      <div className="font-semibold text-foreground">{ad.metrics.impressions}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Engagement</span>
                      </div>
                      <div className="font-semibold text-foreground">{ad.metrics.engagement}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Analysis</div>
                      <div className="flex justify-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {ad.analysis.angle}
                        </Badge>
                      </div>
                    </div>
                  </div>

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
                Showing {mockAds.length} of 847 ads
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
          </TabsContent>

          {/* Other platform tabs with empty states */}
          <TabsContent value="meta" className="py-8 text-center">
            <div className="text-muted-foreground">Meta ads will appear here when found</div>
          </TabsContent>
          
          <TabsContent value="google" className="py-8 text-center">
            <div className="text-muted-foreground">Google ads will appear here when found</div>
          </TabsContent>
          
          <TabsContent value="youtube" className="py-8 text-center">
            <div className="text-muted-foreground">YouTube ads will appear here when found</div>
          </TabsContent>
          
          <TabsContent value="tiktok" className="py-8 text-center">
            <div className="text-muted-foreground">TikTok ads will appear here when found</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveAdFeed;
