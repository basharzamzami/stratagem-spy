
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { fetchCompetitors, generateCompetitorInsights } from '@/services/specterNet';
import { Target, Shield, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CompetitorCard from './CompetitorCard';
import MarketIntelligencePanel from './MarketIntelligencePanel';

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
      setInsights(null);
      setSelectedCompetitor('');
      
      const competitorInsights = await generateCompetitorInsights(competitorName);
      setInsights(competitorInsights);
      setSelectedCompetitor(competitorName);
      
      toast({
        title: "Intelligence Analysis Complete",
        description: `Generated comprehensive market intelligence for ${competitorName}`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not generate competitor intelligence",
        variant: "destructive"
      });
    }
  };

  // Calculate market overview stats
  const totalCompetitors = competitors?.length || 0;
  const highThreatCompetitors = competitors?.filter(c => c.dominance_score >= 70).length || 0;
  const totalMarketSpend = competitors?.reduce((sum, c) => sum + c.estimated_monthly_spend, 0) || 0;
  const avgDominanceScore = competitors?.length 
    ? competitors.reduce((sum, c) => sum + c.dominance_score, 0) / competitors.length 
    : 0;

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
      {/* Intelligence Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Competitor Intelligence Hub</h2>
          <p className="text-muted-foreground">Comprehensive competitive analysis and market positioning</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/20 text-primary flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {totalCompetitors} Tracked
          </Badge>
          {highThreatCompetitors > 0 && (
            <Badge className="bg-red-500/20 text-red-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {highThreatCompetitors} High Threat
            </Badge>
          )}
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Competitors</div>
              <div className="text-2xl font-bold text-primary">{totalCompetitors}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 rounded-lg p-4 border border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">High Threat</div>
              <div className="text-2xl font-bold text-red-400">{highThreatCompetitors}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Market Spend</div>
              <div className="text-2xl font-bold text-green-400">${(totalMarketSpend/1000).toFixed(0)}K/mo</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Dominance</div>
              <div className="text-2xl font-bold text-blue-400">{avgDominanceScore.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Intelligence Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {competitors?.map((competitor) => (
          <CompetitorCard
            key={competitor.id}
            competitor={competitor}
            onAnalyze={handleAnalyzeCompetitor}
          />
        ))}
      </div>

      {/* Market Intelligence Panel */}
      <MarketIntelligencePanel 
        insights={insights}
        selectedCompetitor={selectedCompetitor}
      />
    </div>
  );
}
