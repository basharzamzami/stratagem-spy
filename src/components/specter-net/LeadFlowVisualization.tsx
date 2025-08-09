
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, Users, Target, Zap } from 'lucide-react';
import { EnhancedLead } from '@/services/specterNetIntegration';

interface LeadFlowVisualizationProps {
  leads: EnhancedLead[];
}

const LeadFlowVisualization: React.FC<LeadFlowVisualizationProps> = ({ leads }) => {
  const visualizationData = useMemo(() => {
    // If no leads provided, use comprehensive mock data
    if (leads.length === 0) {
      return {
        heatmapRegions: [
          {
            region: "San Francisco Bay Area",
            lead_density: 95,
            total_leads: 47,
            avg_intent_score: 89,
            color_code: "red",
            growth_trend: "+12%"
          },
          {
            region: "Austin Metro",
            lead_density: 85,
            total_leads: 34,
            avg_intent_score: 84,
            color_code: "orange",
            growth_trend: "+18%"
          },
          {
            region: "New York City",
            lead_density: 75,
            total_leads: 28,
            avg_intent_score: 82,
            color_code: "yellow",
            growth_trend: "+8%"
          },
          {
            region: "Miami Beach",
            lead_density: 65,
            total_leads: 22,
            avg_intent_score: 78,
            color_code: "yellow-green",
            growth_trend: "+25%"
          },
          {
            region: "Denver Metro",
            lead_density: 55,
            total_leads: 18,
            avg_intent_score: 74,
            color_code: "green",
            growth_trend: "+30%"
          },
          {
            region: "Seattle",
            lead_density: 45,
            total_leads: 15,
            avg_intent_score: 71,
            color_code: "light-green",
            growth_trend: "+15%"
          }
        ],
        topPerformingZones: [
          {
            zone: "Bay Area (SF, Oakland, San Jose)",
            performance_score: 94,
            total_value: "$2.8M",
            conversion_rate: "31%"
          },
          {
            zone: "Dallas-Fort Worth Metro",
            performance_score: 89,
            total_value: "$2.1M",
            conversion_rate: "28%"
          },
          {
            zone: "Miami-Dade County",
            performance_score: 86,
            total_value: "$1.9M",
            conversion_rate: "26%"
          }
        ],
        growthOpportunities: [
          {
            city: "Austin",
            opportunity_score: 92,
            projected_growth: "+45%",
            market_saturation: "Low",
            competition_level: "Medium"
          },
          {
            city: "Denver",
            opportunity_score: 88,
            projected_growth: "+38%",
            market_saturation: "Very Low",
            competition_level: "Low"
          },
          {
            city: "Raleigh",
            opportunity_score: 84,
            projected_growth: "+42%",
            market_saturation: "Low",
            competition_level: "Low"
          }
        ],
        industryBreakdown: {
          "SaaS & Technology": 35,
          "Healthcare": 24,
          "Real Estate": 18,
          "E-commerce": 12,
          "Finance": 8,
          "Others": 3
        },
        intentSignalFlow: [
          { stage: "Search Activity Detected", count: 347, conversion: "100%" },
          { stage: "Intent Keywords Matched", count: 284, conversion: "82%" },
          { stage: "High-Quality Filtered", count: 189, conversion: "54%" },
          { stage: "Enrichment Complete", count: 156, conversion: "45%" },
          { stage: "Ready for Outreach", count: 123, conversion: "35%" }
        ]
      };
    }

    // Process real leads data
    const regionMap = new Map();
    leads.forEach(lead => {
      const key = `${lead.geo_context.city}, ${lead.geo_context.state}`;
      if (!regionMap.has(key)) {
        regionMap.set(key, {
          region: key,
          leads: [],
          total_leads: 0,
          avg_intent_score: 0
        });
      }
      const region = regionMap.get(key);
      region.leads.push(lead);
      region.total_leads++;
    });

    const heatmapRegions = Array.from(regionMap.values()).map(region => ({
      ...region,
      lead_density: Math.min((region.total_leads / leads.length) * 100, 100),
      avg_intent_score: region.leads.reduce((sum, lead) => sum + lead.intent_score, 0) / region.leads.length,
      color_code: region.total_leads > 10 ? "red" : region.total_leads > 5 ? "orange" : "yellow"
    }));

    return {
      heatmapRegions,
      topPerformingZones: heatmapRegions.slice(0, 3),
      growthOpportunities: heatmapRegions.slice(-3),
      industryBreakdown: {},
      intentSignalFlow: []
    };
  }, [leads]);

  const getHeatmapColor = (colorCode: string) => {
    switch (colorCode) {
      case "red":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      case "orange":
        return "bg-orange-500/20 border-orange-500/30 text-orange-400";
      case "yellow":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
      case "yellow-green":
        return "bg-lime-500/20 border-lime-500/30 text-lime-400";
      case "green":
        return "bg-green-500/20 border-green-500/30 text-green-400";
      case "light-green":
        return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Regional Heatmap */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Lead Density Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visualizationData.heatmapRegions.map((region, index) => (
              <Card key={index} className={`transition-all hover:scale-105 ${getHeatmapColor(region.color_code)}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{region.region}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {region.growth_trend}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Density</div>
                        <div className="font-bold">{region.lead_density}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Leads</div>
                        <div className="font-bold">{region.total_leads}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Intent</div>
                        <div className="font-bold">{Math.round(region.avg_intent_score)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Growth</div>
                        <div className="font-bold text-success">{region.growth_trend}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Zones */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Top Performing Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visualizationData.topPerformingZones.map((zone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-semibold text-foreground">{zone.zone}</div>
                    <div className="text-sm text-muted-foreground">
                      Performance: {zone.performance_score}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-success">{zone.total_value}</div>
                    <div className="text-sm text-muted-foreground">
                      {zone.conversion_rate} conversion
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Opportunities */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              High-Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visualizationData.growthOpportunities.map((opportunity, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-foreground">{opportunity.city}</div>
                    <Badge className="bg-warning/20 text-warning border-warning/30">
                      {opportunity.opportunity_score}% Score
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Growth</div>
                      <div className="font-bold text-success">{opportunity.projected_growth}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Saturation</div>
                      <div className="font-bold">{opportunity.market_saturation}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Competition</div>
                      <div className="font-bold">{opportunity.competition_level}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intent Signal Flow */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Lead Intent Signal Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            {visualizationData.intentSignalFlow.map((stage, index) => (
              <div key={index} className="flex-1 min-w-[150px]">
                <div className="text-center p-4 bg-muted/30 rounded-lg relative">
                  <div className="text-2xl font-bold text-primary">{stage.count}</div>
                  <div className="text-sm text-muted-foreground mb-1">{stage.stage}</div>
                  <Badge variant="secondary" className="text-xs">
                    {stage.conversion}
                  </Badge>
                  
                  {index < visualizationData.intentSignalFlow.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border transform -translate-y-1/2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Breakdown */}
      {Object.keys(visualizationData.industryBreakdown).length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Industry Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(visualizationData.industryBreakdown).map(([industry, percentage]) => (
                <div key={industry} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">{industry}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadFlowVisualization;
