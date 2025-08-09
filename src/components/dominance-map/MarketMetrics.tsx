
import { MarketDominance } from '@/services/specterNet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface MarketMetricsProps {
  data: MarketDominance[];
}

export default function MarketMetrics({ data }: MarketMetricsProps) {
  // Calculate metrics
  const strongHolds = data.filter(item => item.dominance_score >= 80).length;
  const opportunities = data.filter(item => item.dominance_score < 40).length;
  const contested = data.filter(item => item.dominance_score >= 40 && item.dominance_score < 70).length;
  
  const avgSeoRank = data.length > 0 
    ? data.reduce((sum, item) => sum + (item.seo_rank_average || 0), 0) / data.length 
    : 0;

  const topPerformingZones = data
    .sort((a, b) => b.dominance_score - a.dominance_score)
    .slice(0, 5);

  const worstPerformingZones = data
    .sort((a, b) => a.dominance_score - b.dominance_score)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Market Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-muted-foreground">Strongholds</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400">{strongHolds}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-muted-foreground">Contested</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400">{contested}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-sm text-muted-foreground">Opportunities</span>
              </div>
              <Badge className="bg-red-500/20 text-red-400">{opportunities}</Badge>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg SEO Rank</span>
              <span className="font-semibold text-foreground">#{avgSeoRank.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="w-5 h-5" />
            Top Performing Zones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformingZones.map((zone, index) => (
              <div key={zone.id} className="flex items-center justify-between p-2 hover:bg-muted/20 rounded-lg">
                <div>
                  <div className="font-medium text-sm">
                    {zone.city}, {zone.state} {zone.zip_code}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rank #{index + 1}
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400">
                  {zone.dominance_score.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="w-5 h-5" />
            Growth Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {worstPerformingZones.map((zone, index) => (
              <div key={zone.id} className="flex items-center justify-between p-2 hover:bg-muted/20 rounded-lg">
                <div>
                  <div className="font-medium text-sm">
                    {zone.city}, {zone.state} {zone.zip_code}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Opportunity #{index + 1}
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400">
                  {zone.dominance_score.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
