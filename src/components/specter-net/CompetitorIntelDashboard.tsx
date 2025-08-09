
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { CompetitorAdIntel } from '@/services/specterNetIntegration';

interface CompetitorIntelDashboardProps {
  intel: CompetitorAdIntel[];
}

const CompetitorIntelDashboard = ({ intel }: CompetitorIntelDashboardProps) => {
  if (intel.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Competitor Intelligence</h3>
          <p className="text-muted-foreground">Run Specter Net analysis to gather competitor ad intelligence</p>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 70) return 'text-orange-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBidIntensityLevel = (intensity: number) => {
    if (intensity >= 80) return { label: 'VERY HIGH', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (intensity >= 60) return { label: 'HIGH', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (intensity >= 40) return { label: 'MEDIUM', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { label: 'LOW', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
  };

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="w-10 h-10 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">{intel.length}</div>
                <div className="text-sm text-muted-foreground">Competitors Analyzed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {intel.reduce((sum, i) => sum + i.ad_frequency, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Ads Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Zap className="w-10 h-10 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {intel.reduce((sum, i) => sum + i.winning_hooks.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Winning Hooks Identified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Intelligence Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {intel.map((competitor, index) => {
          const bidLevel = getBidIntensityLevel(competitor.bid_intensity);
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                      {competitor.competitor[0]}
                    </div>
                    {competitor.competitor}
                  </CardTitle>
                  <Badge variant="outline" className={bidLevel.color}>
                    {bidLevel.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Performance Score</span>
                    <span className={`font-medium ${getPerformanceColor(competitor.performance_score)}`}>
                      {competitor.performance_score}/100
                    </span>
                  </div>
                  <Progress value={competitor.performance_score} className="h-2" />
                </div>

                {/* Ad Frequency */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Ads</span>
                  <Badge variant="secondary">{competitor.ad_frequency}</Badge>
                </div>

                {/* Bid Intensity */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bid Intensity</span>
                    <span className="font-medium">{competitor.bid_intensity}%</span>
                  </div>
                  <Progress value={competitor.bid_intensity} className="h-2" />
                </div>

                {/* Winning Hooks */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Top Hooks:</span>
                  <div className="space-y-1">
                    {competitor.winning_hooks.slice(0, 2).map((hook, hookIndex) => (
                      <div key={hookIndex} className="text-xs bg-muted/50 p-2 rounded border-l-2 border-primary/50">
                        "{hook.substring(0, 60)}{hook.length > 60 ? '...' : ''}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Common CTAs:</span>
                  <div className="flex flex-wrap gap-1">
                    {competitor.common_ctas.slice(0, 3).map((cta, ctaIndex) => (
                      <Badge key={ctaIndex} variant="outline" className="text-xs">
                        {cta}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Offer Patterns */}
                {competitor.offer_patterns.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Offer Patterns:</span>
                    <div className="flex flex-wrap gap-1">
                      {competitor.offer_patterns.map((pattern, patternIndex) => (
                        <Badge key={patternIndex} variant="secondary" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Creative Angles */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Creative Angles:</span>
                  <div className="grid grid-cols-2 gap-1">
                    {competitor.creative_angles.slice(0, 4).map((angle, angleIndex) => (
                      <div key={angleIndex} className="text-xs bg-primary/10 px-2 py-1 rounded text-primary">
                        {angle.replace('-', ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View Ads
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitorIntelDashboard;
