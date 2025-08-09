
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Competitor } from '@/services/specterNet';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  Eye, 
  DollarSign,
  MapPin,
  Globe,
  Calendar
} from 'lucide-react';

interface CompetitorCardProps {
  competitor: Competitor;
  onAnalyze: (name: string) => void;
}

export default function CompetitorCard({ competitor, onAnalyze }: CompetitorCardProps) {
  const getDominanceColor = (score: number) => {
    if (score >= 80) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    if (score >= 40) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const getDominanceLabel = (score: number) => {
    if (score >= 80) return 'DOMINANT';
    if (score >= 60) return 'STRONG';
    if (score >= 40) return 'MODERATE';
    return 'EMERGING';
  };

  const getThreatLevel = (score: number) => {
    if (score >= 70) return { label: 'HIGH', color: 'text-red-400' };
    if (score >= 40) return { label: 'MEDIUM', color: 'text-yellow-400' };
    return { label: 'LOW', color: 'text-green-400' };
  };

  const threatLevel = getThreatLevel(competitor.dominance_score);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{competitor.name}</CardTitle>
              <Badge className={`${getDominanceColor(competitor.dominance_score)} text-xs font-medium border`}>
                {getDominanceLabel(competitor.dominance_score)}
              </Badge>
            </div>
            
            {competitor.domain && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Globe className="w-3 h-3" />
                <span>{competitor.domain}</span>
              </div>
            )}
            
            {competitor.industry && (
              <Badge variant="outline" className="text-xs w-fit">
                {competitor.industry}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dominance Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Market Dominance</span>
            <span className="font-medium">{competitor.dominance_score.toFixed(1)}%</span>
          </div>
          <Progress value={competitor.dominance_score} className="h-2" />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-muted-foreground">Active Ads</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              {competitor.total_ads_count.toLocaleString()}
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3 h-3 text-green-400" />
              <span className="text-xs text-muted-foreground">Monthly Spend</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              ${(competitor.estimated_monthly_spend / 1000).toFixed(0)}K
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-muted-foreground">Threat Level</span>
            </div>
            <div className={`text-sm font-bold ${threatLevel.color}`}>
              {threatLevel.label}
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-muted-foreground">Activity</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              {new Date(competitor.last_activity).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Location & Market Info */}
        {(competitor.location_city || competitor.location_state) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 rounded p-2">
            <MapPin className="w-3 h-3" />
            <span>
              {competitor.location_city}
              {competitor.location_city && competitor.location_state && ', '}
              {competitor.location_state}
              {competitor.location_zip && ` ${competitor.location_zip}`}
            </span>
          </div>
        )}

        {/* Intelligence Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onAnalyze(competitor.name)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Deep Analysis
          </Button>
          <Button size="sm" variant="ghost" className="px-3">
            <Target className="w-4 h-4" />
          </Button>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="w-3 h-3" />
          <span>Updated {new Date(competitor.updated_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
