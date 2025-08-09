
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  MapPin, 
  Users, 
  DollarSign,
  Activity,
  AlertCircle
} from 'lucide-react';

interface MarketIntelligenceProps {
  insights: any;
  selectedCompetitor: string;
}

export default function MarketIntelligencePanel({ insights, selectedCompetitor }: MarketIntelligenceProps) {
  if (!insights || !selectedCompetitor) return null;

  const spendPerAd = insights.total_ads > 0 ? insights.estimated_spend / insights.total_ads : 0;
  const engagementRate = insights.avg_engagement || 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Market Intelligence: {selectedCompetitor}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Campaign Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Campaigns</span>
            </div>
            <div className="text-2xl font-bold text-primary">{insights.total_ads}</div>
            <div className="text-xs text-muted-foreground">
              {insights.active_ads} currently active
            </div>
          </div>

          <div className="bg-background/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Est. Daily Spend</span>
            </div>
            <div className="text-2xl font-bold text-success">${insights.estimated_spend.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">
              ${spendPerAd.toFixed(2)} per ad
            </div>
          </div>

          <div className="bg-background/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Platform Reach</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{insights.platforms.length}</div>
            <div className="text-xs text-muted-foreground">
              Multi-channel presence
            </div>
          </div>

          <div className="bg-background/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-muted-foreground">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{engagementRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              Average across platforms
            </div>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Platform Distribution
          </h4>
          <div className="grid gap-3">
            {insights.platforms.map((platform: string) => {
              const platformAds = Math.floor(insights.total_ads / insights.platforms.length);
              const percentage = (platformAds / insights.total_ads) * 100;
              
              return (
                <div key={platform} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-secondary/20 text-secondary-foreground">
                      {platform.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{platformAds} ads ({percentage.toFixed(0)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Creative Patterns Analysis */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Top Creative Patterns
          </h4>
          <div className="grid gap-2">
            {insights.common_patterns.slice(0, 5).map((pattern: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                <span className="text-sm text-foreground">{pattern.pattern}</span>
                <Badge variant="outline" className="text-xs">
                  {pattern.count}x used
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-muted/20 rounded-lg p-4 space-y-2">
          <h5 className="font-medium text-foreground">Strategic Assessment</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {insights.active_ads > insights.total_ads * 0.7 ? 'High campaign activity - aggressive market push' : 'Moderate campaign activity - steady presence'}</li>
            <li>• {insights.platforms.length > 2 ? 'Multi-platform strategy - broad audience targeting' : 'Focused platform approach - niche targeting'}</li>
            <li>• {spendPerAd > 50 ? 'High-value campaigns - premium positioning' : 'Cost-efficient campaigns - volume strategy'}</li>
            <li>• {engagementRate > 3 ? 'Strong creative performance - engaging content' : 'Standard performance - optimization opportunity'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
