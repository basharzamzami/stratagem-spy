
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Map, TrendingUp, Target, Users, MapPin, BarChart3, Zap } from 'lucide-react';

interface RegionData {
  region: string;
  leadCount: number;
  conversionRate: number;
  averageValue: number;
  topIndustries: string[];
  growthTrend: number;
  color: string;
}

const mockRegionData: RegionData[] = [
  {
    region: 'San Francisco Bay Area',
    leadCount: 95,
    conversionRate: 34,
    averageValue: 8500,
    topIndustries: ['SaaS', 'FinTech', 'HealthTech'],
    growthTrend: 23,
    color: 'bg-red-500'
  },
  {
    region: 'Austin Metro',
    leadCount: 75,
    conversionRate: 28,
    averageValue: 6200,
    topIndustries: ['Technology', 'Real Estate', 'Healthcare'],
    growthTrend: 31,
    color: 'bg-orange-500'
  },
  {
    region: 'New York Metropolitan',
    leadCount: 60,
    conversionRate: 25,
    averageValue: 7800,
    topIndustries: ['Finance', 'Media', 'Real Estate'],
    growthTrend: 15,
    color: 'bg-yellow-500'
  },
  {
    region: 'Miami-Dade',
    leadCount: 45,
    conversionRate: 22,
    averageValue: 5400,
    topIndustries: ['Real Estate', 'Tourism', 'Healthcare'],
    growthTrend: 42,
    color: 'bg-green-500'
  },
  {
    region: 'Denver Metro',
    leadCount: 38,
    conversionRate: 30,
    averageValue: 6800,
    topIndustries: ['Technology', 'Energy', 'Aerospace'],
    growthTrend: 28,
    color: 'bg-blue-500'
  }
];

const topPerformingZones = [
  { name: 'Bay Area (SF, Oakland, San Jose)', leads: 95, conversion: 34, revenue: '$807,000' },
  { name: 'Dallas-Fort Worth Metroplex', leads: 68, conversion: 29, revenue: '$445,000' },
  { name: 'Miami Beach & Downtown', leads: 52, conversion: 31, revenue: '$380,000' }
];

const growthOpportunities = [
  { name: 'Austin Downtown & Domain', potential: 'High', estimate: '+45 leads', investment: '$15K' },
  { name: 'Denver Tech Center', potential: 'Medium', estimate: '+32 leads', investment: '$12K' },
  { name: 'Raleigh Research Triangle', potential: 'High', estimate: '+38 leads', investment: '$18K' }
];

export default function LeadFlowVisualization() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'flow'>('heatmap');

  const analyzeRegion = (region: string) => {
    setSelectedRegion(region);
    console.log(`Analyzing region: ${region}`);
    // Here you would typically fetch detailed analytics for the region
  };

  const compareRegions = () => {
    console.log('Comparing selected regions...');
    // Here you would open a comparison modal or navigate to comparison view
  };

  const totalLeads = mockRegionData.reduce((sum, region) => sum + region.leadCount, 0);
  const avgConversion = Math.round(mockRegionData.reduce((sum, region) => sum + region.conversionRate, 0) / mockRegionData.length);
  const totalRevenue = mockRegionData.reduce((sum, region) => sum + (region.leadCount * region.averageValue), 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalLeads}</div>
            <div className="text-sm text-muted-foreground">Across all regions</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Avg Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{avgConversion}%</div>
            <div className="text-sm text-muted-foreground">Conversion rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">${(totalRevenue / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">From warm leads</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">+27%</div>
            <div className="text-sm text-muted-foreground">Month over month</div>
          </CardContent>
        </Card>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={viewMode === 'heatmap' ? 'default' : 'outline'}
            onClick={() => setViewMode('heatmap')}
            className="flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            Heatmap View
          </Button>
          <Button
            variant={viewMode === 'flow' ? 'default' : 'outline'}
            onClick={() => setViewMode('flow')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Flow Analysis
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={compareRegions}>
            Compare Regions
          </Button>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Heatmap */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Lead Density Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRegionData.map((region, index) => (
                  <div 
                    key={region.region}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-lg ${
                      selectedRegion === region.region ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => analyzeRegion(region.region)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${region.color}`} />
                        <h4 className="font-semibold text-foreground">{region.region}</h4>
                      </div>
                      <Button size="sm" variant="outline">
                        Analyze
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Leads</div>
                        <div className="text-lg font-bold text-foreground">{region.leadCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Conversion</div>
                        <div className="text-lg font-bold text-green-400">{region.conversionRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg Value</div>
                        <div className="text-lg font-bold text-blue-400">${region.averageValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Growth</div>
                        <div className="text-lg font-bold text-purple-400">+{region.growthTrend}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">Lead Density:</span>
                      <Progress value={(region.leadCount / 95) * 100} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round((region.leadCount / 95) * 100)}%</span>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {region.topIndustries.map((industry, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Top Performing Zones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Top Performing Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPerformingZones.map((zone, index) => (
                <div key={index} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{zone.name}</h4>
                    <Badge className="bg-green-500/20 text-green-400">#{index + 1}</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Leads:</span>
                      <span className="font-medium">{zone.leads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion:</span>
                      <span className="font-medium">{zone.conversion}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-medium">{zone.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Growth Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {growthOpportunities.map((opportunity, index) => (
                <div key={index} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{opportunity.name}</h4>
                    <Badge className={opportunity.potential === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {opportunity.potential}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Potential:</span>
                      <span className="font-medium">{opportunity.estimate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment:</span>
                      <span className="font-medium">{opportunity.investment}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-2" variant="outline">
                    Explore Opportunity
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
