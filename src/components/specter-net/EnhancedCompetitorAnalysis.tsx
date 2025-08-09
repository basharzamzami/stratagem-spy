
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Eye, 
  DollarSign, 
  Users, 
  BarChart3,
  Zap,
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface CompetitorAd {
  id: string;
  competitor: string;
  platform: string;
  headline: string;
  primaryText: string;
  cta: string;
  firstSeen: string;
  lastSeen: string;
  estimatedBudget: string;
  engagementRate: number;
  impressions: number;
  adType: string;
  targetKeywords: string[];
}

interface CompetitorMetrics {
  name: string;
  logo: string;
  totalAds: number;
  activeCampaigns: number;
  estimatedSpend: string;
  avgEngagement: number;
  topPlatforms: string[];
  growthTrend: 'up' | 'down' | 'stable';
  threatLevel: 'high' | 'medium' | 'low';
}

export default function EnhancedCompetitorAnalysis() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('similarweb');
  const [timeRange, setTimeRange] = useState('30d');

  const competitors: CompetitorMetrics[] = [
    {
      name: 'SimilarWeb',
      logo: '🌐',
      totalAds: 247,
      activeCampaigns: 18,
      estimatedSpend: '$125K',
      avgEngagement: 3.2,
      topPlatforms: ['Google', 'LinkedIn', 'Facebook'],
      growthTrend: 'up',
      threatLevel: 'high'
    },
    {
      name: 'Ahrefs',
      logo: '🔍',
      totalAds: 189,
      activeCampaigns: 12,
      estimatedSpend: '$89K',
      avgEngagement: 2.8,
      topPlatforms: ['Google', 'YouTube', 'Twitter'],
      growthTrend: 'stable',
      threatLevel: 'medium'
    },
    {
      name: 'SEMrush',
      logo: '📊',
      totalAds: 156,
      activeCampaigns: 9,
      estimatedSpend: '$67K',
      avgEngagement: 2.4,
      topPlatforms: ['Facebook', 'LinkedIn', 'Google'],
      growthTrend: 'down',
      threatLevel: 'medium'
    },
    {
      name: 'SpyFu',
      logo: '🕵️',
      totalAds: 98,
      activeCampaigns: 6,
      estimatedSpend: '$34K',
      avgEngagement: 2.1,
      topPlatforms: ['Google', 'Bing', 'Facebook'],
      growthTrend: 'up',
      threatLevel: 'low'
    }
  ];

  const liveAds: CompetitorAd[] = [
    {
      id: '1',
      competitor: 'SimilarWeb',
      platform: 'Google',
      headline: 'Unlock Website Traffic Secrets',
      primaryText: 'See exactly where your competitors get their traffic from. Free trial includes 3 months of competitive intelligence.',
      cta: 'Start Free Trial',
      firstSeen: '2 hours ago',
      lastSeen: '12 minutes ago',
      estimatedBudget: '$2,500/day',
      engagementRate: 3.4,
      impressions: 45000,
      adType: 'Search',
      targetKeywords: ['competitive analysis', 'website traffic', 'market research']
    },
    {
      id: '2',
      competitor: 'Ahrefs',
      platform: 'LinkedIn',
      headline: 'Beat Your Competition with SEO Data',
      primaryText: 'The most comprehensive SEO toolset for analyzing competitors and improving your rankings.',
      cta: 'Try Ahrefs',
      firstSeen: '4 hours ago',
      lastSeen: '8 minutes ago',
      estimatedBudget: '$1,800/day',
      engagementRate: 2.9,
      impressions: 32000,
      adType: 'Sponsored Content',
      targetKeywords: ['seo tools', 'keyword research', 'backlink analysis']
    },
    {
      id: '3',
      competitor: 'SEMrush',
      platform: 'Facebook',
      headline: 'Digital Marketing Made Simple',
      primaryText: 'Everything you need to outrank competitors and grow your online presence in one toolkit.',
      cta: 'Get Started',
      firstSeen: '6 hours ago',
      lastSeen: '15 minutes ago',
      estimatedBudget: '$1,200/day',
      engagementRate: 2.7,
      impressions: 28000,
      adType: 'Image Ad',
      targetKeywords: ['digital marketing', 'competitor analysis', 'ppc tools']
    }
  ];

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-success" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-destructive" />;
      case 'stable': return <Minus className="w-3 h-3 text-muted-foreground" />;
      default: return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Competitor Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitors.map((competitor) => (
          <Card 
            key={competitor.name} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCompetitor === competitor.name.toLowerCase() 
                ? 'ring-2 ring-primary' 
                : ''
            }`}
            onClick={() => setSelectedCompetitor(competitor.name.toLowerCase())}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{competitor.logo}</span>
                  <span className="font-medium text-sm">{competitor.name}</span>
                </div>
                {getTrendIcon(competitor.growthTrend)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Active Ads</span>
                  <span className="font-medium">{competitor.totalAds}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Est. Spend</span>
                  <span className="font-medium">{competitor.estimatedSpend}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-medium">{competitor.avgEngagement}%</span>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div className="flex gap-1">
                  {competitor.topPlatforms.slice(0, 2).map((platform, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0.5">
                      {platform}
                    </Badge>
                  ))}
                </div>
                <Badge className={getThreatColor(competitor.threatLevel)}>
                  {competitor.threatLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="live-ads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-ads">Live Ads</TabsTrigger>
          <TabsTrigger value="strategies">Ad Strategies</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Intel</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="live-ads">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Live Competitor Ads
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Monitoring {liveAds.length} active ads
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveAds.map((ad) => (
                  <div key={ad.id} className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{ad.competitor}</Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                          {ad.platform}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                          {ad.adType}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active for {ad.firstSeen}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <h4 className="font-semibold text-sm">{ad.headline}</h4>
                      <p className="text-sm text-muted-foreground">{ad.primaryText}</p>
                      <div className="inline-block px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium">
                        {ad.cta}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-muted-foreground">Budget</div>
                        <div className="font-medium">{ad.estimatedBudget}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Engagement</div>
                        <div className="font-medium">{ad.engagementRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Impressions</div>
                        <div className="font-medium">{ad.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Update</div>
                        <div className="font-medium">{ad.lastSeen}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex gap-1 flex-wrap">
                      {ad.targetKeywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Ad Creative Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emotional Appeals</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-20 h-2" />
                      <span className="text-xs font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data-Driven Claims</span>
                    <div className="flex items-center gap-2">
                      <Progress value={68} className="w-20 h-2" />
                      <span className="text-xs font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Proof</span>
                    <div className="flex items-center gap-2">
                      <Progress value={54} className="w-20 h-2" />
                      <span className="text-xs font-medium">54%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Urgency/Scarcity</span>
                    <div className="flex items-center gap-2">
                      <Progress value={42} className="w-20 h-2" />
                      <span className="text-xs font-medium">42%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Platform Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Google Ads</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-xs font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LinkedIn</span>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-20 h-2" />
                      <span className="text-xs font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Facebook</span>
                    <div className="flex items-center gap-2">
                      <Progress value={18} className="w-20 h-2" />
                      <span className="text-xs font-medium">18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">YouTube</span>
                    <div className="flex items-center gap-2">
                      <Progress value={9} className="w-20 h-2" />
                      <span className="text-xs font-medium">9%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Competitor Keyword Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { keyword: 'competitive analysis', volume: '12K', difficulty: 'high', trend: 'up' },
                  { keyword: 'market research tools', volume: '8.5K', difficulty: 'medium', trend: 'up' },
                  { keyword: 'website traffic analysis', volume: '6.7K', difficulty: 'high', trend: 'stable' },
                  { keyword: 'competitor monitoring', volume: '4.2K', difficulty: 'medium', trend: 'up' },
                  { keyword: 'business intelligence', volume: '15K', difficulty: 'high', trend: 'stable' },
                  { keyword: 'seo competitor analysis', volume: '3.8K', difficulty: 'medium', trend: 'down' }
                ].map((kw, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{kw.keyword}</span>
                      {getTrendIcon(kw.trend)}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume</span>
                        <span>{kw.volume}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty</span>
                        <Badge 
                          variant="outline" 
                          className={
                            kw.difficulty === 'high' 
                              ? 'bg-red-500/10 text-red-400' 
                              : 'bg-yellow-500/10 text-yellow-400'
                          }
                        >
                          {kw.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Strategic Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="font-medium text-sm text-success mb-1">Gap Opportunity</div>
                  <p className="text-sm text-muted-foreground">
                    Competitors are under-targeting "AI-powered analytics" - high volume, low competition
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="font-medium text-sm text-yellow-600 mb-1">Threat Alert</div>
                  <p className="text-sm text-muted-foreground">
                    SimilarWeb increased ad spend by 40% targeting your primary keywords
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="font-medium text-sm text-blue-600 mb-1">Creative Insight</div>
                  <p className="text-sm text-muted-foreground">
                    Video ads showing 2.3x higher engagement than static images across all competitors
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Launch counter-campaign for "AI analytics"
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Increase video ad production
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Set alert for SimilarWeb budget changes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Expand to LinkedIn advertising
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
