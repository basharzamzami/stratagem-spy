
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Shield, TrendingUp, AlertTriangle, Eye, Users, DollarSign } from 'lucide-react';

const competitorInsights = [
  {
    id: '1',
    name: 'SimilarWeb',
    threatLevel: 'High',
    mentions: 45,
    dealsLost: 3,
    dealsWon: 8,
    avgDealImpact: -15000,
    commonObjections: ['Price point', 'Feature gaps', 'Support quality'],
    strengths: ['Brand recognition', 'Enterprise features'],
    weaknesses: ['Complex UI', 'High cost', 'Poor onboarding'],
    battleCard: {
      pricing: 'Premium pricing model, 3x our cost',
      features: 'Limited real-time data, no ad intelligence',
      target: 'Enterprise only, no SMB focus'
    }
  },
  {
    id: '2',
    name: 'SEMrush',
    threatLevel: 'Medium',
    mentions: 38,
    dealsLost: 2,
    dealsWon: 6,
    avgDealImpact: -8000,
    commonObjections: ['All-in-one solution', 'SEO focus'],
    strengths: ['SEO tools', 'Content marketing'],
    weaknesses: ['Limited competitive intel', 'No lead scoring'],
    battleCard: {
      pricing: '2x our pricing, limited competitive analysis',
      features: 'SEO-focused, weak on competitive intelligence',
      target: 'Marketing agencies, not sales teams'
    }
  },
  {
    id: '3',
    name: 'Ahrefs',
    threatLevel: 'Low',
    mentions: 32,
    dealsLost: 1,
    dealsWon: 5,
    avgDealImpact: -5000,
    commonObjections: ['SEO expertise', 'Backlink data'],
    strengths: ['SEO data', 'Technical users'],
    weaknesses: ['No CRM integration', 'Technical complexity'],
    battleCard: {
      pricing: 'Similar pricing, SEO-only focus',
      features: 'No lead intelligence, no campaign management',
      target: 'SEO specialists, not business teams'
    }
  }
];

const getThreatColor = (level: string) => {
  switch (level) {
    case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
};

const winRateData = competitorInsights.map(comp => ({
  name: comp.name,
  winRate: (comp.dealsWon / (comp.dealsWon + comp.dealsLost)) * 100,
  totalDeals: comp.dealsWon + comp.dealsLost
}));

export default function CRMCompetitorInsights() {
  return (
    <div className="space-y-6">
      {/* Competitive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Active Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {competitorInsights.filter(c => c.threatLevel === 'High').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">High priority competitors</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {competitorInsights.reduce((sum, c) => sum + c.mentions, 0)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">In deal conversations</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {Math.round(
                (competitorInsights.reduce((sum, c) => sum + c.dealsWon, 0) / 
                 competitorInsights.reduce((sum, c) => sum + c.dealsWon + c.dealsLost, 0)) * 100
              )}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Against all competitors</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              ${Math.abs(competitorInsights.reduce((sum, c) => sum + c.avgDealImpact, 0)).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Lost to competition</div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Battle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {competitorInsights.map((competitor) => (
          <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getThreatColor(competitor.threatLevel)}>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {competitor.threatLevel} Threat
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {competitor.mentions} mentions
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Win/Loss Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Deals Won</div>
                  <div className="text-lg font-bold text-green-400">{competitor.dealsWon}</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Deals Lost</div>
                  <div className="text-lg font-bold text-red-400">{competitor.dealsLost}</div>
                </div>
              </div>

              {/* Win Rate */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="font-medium">
                    {Math.round((competitor.dealsWon / (competitor.dealsWon + competitor.dealsLost)) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(competitor.dealsWon / (competitor.dealsWon + competitor.dealsLost)) * 100} 
                  className="h-2" 
                />
              </div>

              {/* Battle Card Info */}
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Strengths</div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.strengths.map((strength, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-blue-500/10 text-blue-400">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Weaknesses</div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.weaknesses.map((weakness, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-red-500/10 text-red-400">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Common Objections</div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.commonObjections.map((objection, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400">
                        {objection}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Battle Card Details */}
              <div className="bg-muted/10 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-foreground">Quick Battle Card</div>
                <div className="space-y-1 text-xs">
                  <div><span className="text-muted-foreground">Pricing:</span> {competitor.battleCard.pricing}</div>
                  <div><span className="text-muted-foreground">Features:</span> {competitor.battleCard.features}</div>
                  <div><span className="text-muted-foreground">Target:</span> {competitor.battleCard.target}</div>
                </div>
              </div>

              <Button variant="outline" className="w-full text-xs">
                <Eye className="w-3 h-3 mr-2" />
                View Full Battle Card
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitive Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Competitive Win Rate Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {winRateData
              .sort((a, b) => b.winRate - a.winRate)
              .map((competitor, idx) => (
              <div key={competitor.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-foreground">
                      #{idx + 1} {competitor.name}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {competitor.totalDeals} deals
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {Math.round(competitor.winRate)}% win rate
                  </div>
                </div>
                <Progress value={competitor.winRate} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
