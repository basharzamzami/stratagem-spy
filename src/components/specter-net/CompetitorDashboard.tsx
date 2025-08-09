
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { fetchCompetitors, generateCompetitorInsights } from '@/services/specterNet';
import { Target, Shield, TrendingUp, DollarSign, Building, Users, Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CompetitorCard from './CompetitorCard';
import MarketIntelligencePanel from './MarketIntelligencePanel';

// Mock competitor data
const mockCompetitors = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    domain: 'techflow.com',
    industry: 'Software Development',
    location_city: 'San Francisco',
    location_state: 'CA',
    dominance_score: 87.5,
    total_ads_count: 245,
    estimated_monthly_spend: 45000,
    last_activity: '2024-01-15T14:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'DataDriven Analytics',
    domain: 'datadriven.com',
    industry: 'Analytics',
    location_city: 'Austin',
    location_state: 'TX',
    dominance_score: 92.3,
    total_ads_count: 189,
    estimated_monthly_spend: 38500,
    last_activity: '2024-01-14T09:15:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-14T09:15:00Z'
  },
  {
    id: '3',
    name: 'InnovateNow Corp',
    domain: 'innovatenow.com',
    industry: 'Business Intelligence',
    location_city: 'Seattle',
    location_state: 'WA',
    dominance_score: 78.9,
    total_ads_count: 167,
    estimated_monthly_spend: 28750,
    last_activity: '2024-01-13T16:45:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-13T16:45:00Z'
  },
  {
    id: '4',
    name: 'NextGen Dynamics',
    domain: 'nextgendynamics.com',
    industry: 'Marketing Technology',
    location_city: 'New York',
    location_state: 'NY',
    dominance_score: 84.1,
    total_ads_count: 203,
    estimated_monthly_spend: 52000,
    last_activity: '2024-01-15T11:20:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T11:20:00Z'
  },
  {
    id: '5',
    name: 'Digital Pioneers',
    domain: 'digitalpioneers.com',
    industry: 'Digital Marketing',
    location_city: 'Los Angeles',
    location_state: 'CA',
    dominance_score: 71.2,
    total_ads_count: 134,
    estimated_monthly_spend: 22300,
    last_activity: '2024-01-12T13:10:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-12T13:10:00Z'
  },
  {
    id: '6',
    name: 'ScaleForce Systems',
    domain: 'scaleforce.com',
    industry: 'Enterprise Software',
    location_city: 'Chicago',
    location_state: 'IL',
    dominance_score: 95.7,
    total_ads_count: 278,
    estimated_monthly_spend: 67500,
    last_activity: '2024-01-15T17:25:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T17:25:00Z'
  }
];

export default function CompetitorDashboard() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');
  const [insights, setInsights] = useState<any>(null);
  const { toast } = useToast();

  // Use mock data instead of API call
  const competitors = mockCompetitors;
  const isLoading = false;

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

  // Calculate market overview stats with mock data
  const totalCompetitors = competitors.length;
  const highThreatCompetitors = competitors.filter(c => c.dominance_score >= 85).length;
  const totalMarketSpend = competitors.reduce((sum, c) => sum + c.estimated_monthly_spend, 0);

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
              <AlertTriangle className="w-3 h-3" />
              {highThreatCompetitors} High Threat
            </Badge>
          )}
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Competitors</div>
              <div className="text-3xl font-bold text-primary">{totalCompetitors}</div>
              <div className="text-xs text-primary/70">+2 this month</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">High Threat</div>
              <div className="text-3xl font-bold text-red-400">{highThreatCompetitors}</div>
              <div className="text-xs text-red-400/70">85%+ dominance</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Market Spend</div>
              <div className="text-3xl font-bold text-green-400">${(totalMarketSpend/1000).toFixed(0)}K/mo</div>
              <div className="text-xs text-green-400/70">Combined monthly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Intelligence Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm text-muted-foreground">Industries</div>
              <div className="text-lg font-semibold">6</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-sm text-muted-foreground">Total Ads</div>
              <div className="text-lg font-semibold">{competitors.reduce((sum, c) => sum + c.total_ads_count, 0)}</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-sm text-muted-foreground">Avg Growth</div>
              <div className="text-lg font-semibold">+23%</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-sm text-muted-foreground">Last Update</div>
              <div className="text-lg font-semibold">2h ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Intelligence Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {competitors.map((competitor) => (
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
