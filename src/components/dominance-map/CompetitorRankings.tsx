
import { MarketDominance } from '@/services/specterNet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Crown, TrendingUp, Eye } from 'lucide-react';

interface CompetitorRankingsProps {
  data: MarketDominance[];
}

export default function CompetitorRankings({ data }: CompetitorRankingsProps) {
  // Mock competitor data based on dominance zones
  const competitorData = [
    {
      id: '1',
      name: 'TechFlow Solutions',
      dominatedZones: data.filter(item => item.dominance_score >= 70 && item.zip_code.endsWith('1')).length,
      avgDominance: 78.5,
      trend: 'up',
      marketShare: 24.3
    },
    {
      id: '2', 
      name: 'InnovateNow Corp',
      dominatedZones: data.filter(item => item.dominance_score >= 60 && item.zip_code.endsWith('2')).length,
      avgDominance: 65.2,
      trend: 'down',
      marketShare: 18.7
    },
    {
      id: '3',
      name: 'NextGen Dynamics',
      dominatedZones: data.filter(item => item.dominance_score >= 50 && item.zip_code.endsWith('3')).length,
      avgDominance: 52.8,
      trend: 'up',
      marketShare: 15.1
    },
    {
      id: '4',
      name: 'Digital Pioneers',
      dominatedZones: data.filter(item => item.dominance_score >= 40 && item.zip_code.endsWith('4')).length,
      avgDominance: 41.9,
      trend: 'neutral',
      marketShare: 12.4
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Competitor Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitorData.map((competitor, index) => (
            <div key={competitor.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                    <span className="font-semibold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{competitor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {competitor.dominatedZones} zones dominated
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(competitor.trend)}
                  <span className={`text-xs font-medium ${getTrendColor(competitor.trend)}`}>
                    {competitor.avgDominance.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center p-2 bg-muted/20 rounded">
                  <div className="text-xs text-muted-foreground">Market Share</div>
                  <div className="font-semibold text-sm">{competitor.marketShare}%</div>
                </div>
                <div className="text-center p-2 bg-muted/20 rounded">
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                  <div className="font-semibold text-sm">{competitor.avgDominance.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Analyze
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button className="w-full" variant="outline">
            View Full Competitor Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
