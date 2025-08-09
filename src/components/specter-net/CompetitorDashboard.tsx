
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchCompetitors, generateCompetitorInsights, Competitor } from '@/services/specterNet';
import { Target, TrendingUp, Zap, AlertTriangle, Eye, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CompetitorDashboard() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');
  const [insights, setInsights] = useState<any>(null);
  const { toast } = useToast();

  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: fetchCompetitors,
  });

  const handleAnalyzeCompetitor = async (competitorName: string) => {
    try {
      const competitorInsights = await generateCompetitorInsights(competitorName);
      setInsights(competitorInsights);
      setSelectedCompetitor(competitorName);
      
      toast({
        title: "Analysis Complete",
        description: `Generated insights for ${competitorName}`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not generate competitor insights",
        variant: "destructive"
      });
    }
  };

  const getDominanceColor = (score: number) => {
    if (score >= 80) return 'text-red-400 bg-red-500/10';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/10';
    if (score >= 40) return 'text-blue-400 bg-blue-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const getDominanceLabel = (score: number) => {
    if (score >= 80) return 'DOMINANT';
    if (score >= 60) return 'STRONG';
    if (score >= 40) return 'MODERATE';
    return 'EMERGING';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2 text-muted-foreground">Loading competitive intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Competitor Intelligence</h2>
          <p className="text-muted-foreground">Real-time competitive analysis and threat assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary">
            <Target className="w-3 h-3 mr-1" />
            {competitors?.length || 0} Tracked
          </Badge>
        </div>
      </div>

      {/* Competitor Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {competitors?.map((competitor) => (
          <Card key={competitor.id} className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">{competitor.name}</CardTitle>
                  {competitor.domain && (
                    <p className="text-sm text-muted-foreground">{competitor.domain}</p>
                  )}
                </div>
                <Badge className={`${getDominanceColor(competitor.dominance_score)} text-xs font-medium`}>
                  {getDominanceLabel(competitor.dominance_score)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Dominance</span>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {competitor.dominance_score.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">Active Ads</span>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {competitor.total_ads_count}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-muted-foreground">Est. Spend</span>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    ${(competitor.estimated_monthly_spend / 1000).toFixed(0)}K/mo
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-muted-foreground">Threat Level</span>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {competitor.dominance_score >= 70 ? 'HIGH' : 
                     competitor.dominance_score >= 40 ? 'MEDIUM' : 'LOW'}
                  </div>
                </div>
              </div>

              {/* Location Info */}
              {(competitor.location_city || competitor.location_state) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-3 h-3" />
                  <span>
                    {competitor.location_city}
                    {competitor.location_city && competitor.location_state && ', '}
                    {competitor.location_state}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleAnalyzeCompetitor(competitor.name)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Deep Analysis
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitor Insights Panel */}
      {insights && selectedCompetitor && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Intelligence Report: {selectedCompetitor}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground mb-1">Total Ads</div>
                <div className="text-xl font-bold text-primary">{insights.total_ads}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground mb-1">Active Campaigns</div>
                <div className="text-xl font-bold text-success">{insights.active_ads}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground mb-1">Daily Spend</div>
                <div className="text-xl font-bold text-yellow-400">${insights.estimated_spend.toFixed(0)}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground mb-1">Platforms</div>
                <div className="text-xl font-bold text-blue-400">{insights.platforms.length}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Top Creative Patterns</h4>
              <div className="flex flex-wrap gap-2">
                {insights.common_patterns.map((pattern: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {pattern.pattern} ({pattern.count}x)
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {insights.platforms.map((platform: string) => (
                <Badge key={platform} className="bg-secondary/20 text-secondary-foreground">
                  {platform.toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
