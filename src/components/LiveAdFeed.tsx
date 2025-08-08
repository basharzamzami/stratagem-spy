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
  ChevronRight
} from 'lucide-react';

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
              onClick={() => setIsLive(!isLive)}
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
        <Tabs defaultValue="all" className="space-y-4">
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
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Strategy
                    </Button>
                    <Button size="sm" variant="outline">
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
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveAdFeed;
