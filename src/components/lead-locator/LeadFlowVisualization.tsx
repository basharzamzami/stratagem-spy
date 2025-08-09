
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  Zap,
  Eye
} from 'lucide-react';

interface GeographicZone {
  id: string;
  name: string;
  state: string;
  total_leads: number;
  warm_leads: number;
  conversion_rate: number;
  avg_deal_size: number;
  competition_level: 'low' | 'medium' | 'high';
  opportunity_score: number;
  top_industries: string[];
  growth_trend: 'up' | 'down' | 'stable';
}

export default function LeadFlowVisualization() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const mockZones: GeographicZone[] = [
    {
      id: '1',
      name: 'San Francisco Bay Area',
      state: 'CA',
      total_leads: 247,
      warm_leads: 89,
      conversion_rate: 24.5,
      avg_deal_size: 125000,
      competition_level: 'high',
      opportunity_score: 92,
      top_industries: ['SaaS', 'Fintech', 'Healthcare Tech'],
      growth_trend: 'up'
    },
    {
      id: '2',
      name: 'Austin Metro',
      state: 'TX',
      total_leads: 156,
      warm_leads: 67,
      conversion_rate: 31.2,
      avg_deal_size: 87000,
      competition_level: 'medium',
      opportunity_score: 88,
      top_industries: ['Tech Startups', 'Digital Marketing', 'E-commerce'],
      growth_trend: 'up'
    },
    {
      id: '3',
      name: 'Seattle Region',
      state: 'WA',
      total_leads: 134,
      warm_leads: 45,
      conversion_rate: 28.7,
      avg_deal_size: 105000,
      competition_level: 'medium',
      opportunity_score: 76,
      top_industries: ['Enterprise Software', 'Cloud Services', 'AI/ML'],
      growth_trend: 'stable'
    },
    {
      id: '4',
      name: 'Denver Area',
      state: 'CO',
      total_leads: 89,
      warm_leads: 38,
      conversion_rate: 35.1,
      avg_deal_size: 67000,
      competition_level: 'low',
      opportunity_score: 84,
      top_industries: ['Outdoor Tech', 'Marketing Agencies', 'Consulting'],
      growth_trend: 'up'
    }
  ];

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
    return <BarChart3 className="w-3 h-3 text-muted-foreground" />;
  };

  const getOpportunityLevel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Moderate';
    return 'Limited';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lead Flow Visualization</h2>
          <p className="text-muted-foreground">Geographic and demographic opportunity mapping</p>
        </div>
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockZones.map((zone) => (
          <Card 
            key={zone.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedZone === zone.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {zone.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{zone.state}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">
                    {getOpportunityLevel(zone.opportunity_score)}
                  </Badge>
                  {getTrendIcon(zone.growth_trend)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{zone.warm_leads}</div>
                  <div className="text-xs text-muted-foreground">Warm Leads</div>
                  <div className="text-xs text-primary">of {zone.total_leads} total</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{zone.conversion_rate}%</div>
                  <div className="text-xs text-muted-foreground">Conversion Rate</div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Avg Deal:</span>
                  <div className="font-semibold">${zone.avg_deal_size.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Competition:</span>
                  <Badge className={`${getCompetitionColor(zone.competition_level)} text-xs mt-1`}>
                    {zone.competition_level.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Top Industries */}
              <div>
                <h4 className="text-sm font-medium mb-2">Top Industries</h4>
                <div className="flex flex-wrap gap-1">
                  {zone.top_industries.map((industry, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Opportunity Score */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div>
                  <div className="text-sm font-medium">Opportunity Score</div>
                  <div className="text-xs text-muted-foreground">Growth potential vs competition</div>
                </div>
                <div className="text-2xl font-bold text-primary">{zone.opportunity_score}</div>
              </div>

              {/* Action Buttons */}
              {selectedZone === zone.id && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Target className="w-4 h-4 mr-2" />
                    Analyze
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Panel */}
      {selectedZone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Detailed Zone Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Lead Density Trends</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>This Week:</span>
                    <span className="font-medium text-green-400">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-medium text-green-400">+28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarter:</span>
                    <span className="font-medium text-green-400">+45%</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Competitor Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Ad Spend:</span>
                    <span className="font-medium">$45K/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Competitor:</span>
                    <span className="font-medium">CompetitorA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Share:</span>
                    <span className="font-medium">23%</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Recommended Actions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Increase ad spend by 30%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Target SaaS companies 50-200 employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Focus on decision-stage leads</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
