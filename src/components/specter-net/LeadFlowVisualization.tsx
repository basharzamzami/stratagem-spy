import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Map, 
  BarChart3, 
  TrendingUp, 
  Filter,
  RefreshCw,
  MapPin,
  Users,
  Target
} from 'lucide-react';
import { EnhancedLead } from '@/services/specterNetIntegration';
import { LeadSourceType } from '@/services/warmLeadProspector';

interface LeadHeatmapData {
  state: string;
  city: string;
  zip: string;
  leadCount: number;
  avgScore: number;
  topSource: LeadSourceType;
  coordinates: [number, number];
}

interface SourcePerformance {
  source: LeadSourceType;
  leadCount: number;
  avgScore: number;
  conversionRate: number;
  growth: number;
}

interface LeadFlowVisualizationProps {
  leads: EnhancedLead[];
}

const LeadFlowVisualization = ({ leads }: LeadFlowVisualizationProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<LeadSourceType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'heatmap' | 'source' | 'timeline'>('heatmap');

  // Generate heatmap data
  const generateHeatmapData = (): LeadHeatmapData[] => {
    const regionMap = new Map<string, LeadHeatmapData>();
    
    leads.forEach(lead => {
      const key = `${lead.geo_context.state}-${lead.geo_context.city}`;
      
      if (regionMap.has(key)) {
        const existing = regionMap.get(key)!;
        existing.leadCount += 1;
        existing.avgScore = (existing.avgScore + lead.intent_score) / 2;
      } else {
        regionMap.set(key, {
          state: lead.geo_context.state,
          city: lead.geo_context.city,
          zip: lead.geo_context.zip || '',
          leadCount: 1,
          avgScore: lead.intent_score,
          topSource: (lead.source as LeadSourceType) || 'job_boards',
          coordinates: getCoordinates(lead.geo_context.state, lead.geo_context.city)
        });
      }
    });
    
    const result: LeadHeatmapData[] = [];
    regionMap.forEach((value) => {
      result.push(value);
    });
    
    return result.sort((a, b) => b.leadCount - a.leadCount);
  };

  // Generate source performance data
  const generateSourcePerformance = (): SourcePerformance[] => {
    const sourceMap = new Map<LeadSourceType, SourcePerformance>();
    const sources: LeadSourceType[] = ['job_boards', 'forums', 'review_sites', 'social_platforms', 'industry_publications', 'google_trends'];
    
    sources.forEach(source => {
      const sourceLeads = leads.filter(lead => lead.source === source);
      if (sourceLeads.length > 0) {
        const avgScore = sourceLeads.reduce((sum, lead) => sum + lead.intent_score, 0) / sourceLeads.length;
        
        sourceMap.set(source, {
          source,
          leadCount: sourceLeads.length,
          avgScore,
          conversionRate: Math.random() * 0.3 + 0.1, // Mock conversion rate
          growth: (Math.random() - 0.5) * 0.6 // Mock growth rate
        });
      }
    });
    
    const result: SourcePerformance[] = [];
    sourceMap.forEach((value) => {
      result.push(value);
    });
    
    return result.sort((a, b) => b.leadCount - a.leadCount);
  };

  const getCoordinates = (state: string, city: string): [number, number] => {
    // Mock coordinates - in real app would use geocoding service
    const coords: Record<string, [number, number]> = {
      'CA-San Francisco': [37.7749, -122.4194],
      'TX-Austin': [30.2672, -97.7431],
      'NY-New York': [40.7128, -74.0060],
      'WA-Seattle': [47.6062, -122.3321],
      'FL-Miami': [25.7617, -80.1918]
    };
    
    return coords[`${state}-${city}`] || [39.8283, -98.5795]; // Default to US center
  };

  const getSourceColor = (source: LeadSourceType): string => {
    const colors = {
      job_boards: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      forums: 'bg-green-500/20 text-green-400 border-green-500/30',
      review_sites: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      social_platforms: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      industry_publications: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      google_trends: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[source] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const heatmapData = generateHeatmapData();
  const sourcePerformance = generateSourcePerformance();
  const totalLeads = leads.length;
  const avgScore = totalLeads > 0 ? leads.reduce((sum, lead) => sum + lead.intent_score, 0) / totalLeads : 0;

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Lead Flow Visualization
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {heatmapData.map(region => (
                    <SelectItem key={`${region.state}-${region.city}`} value={`${region.state}-${region.city}`}>
                      {region.city}, {region.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalLeads}</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{avgScore.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Avg Lead Score</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{heatmapData.length}</div>
                <div className="text-sm text-muted-foreground">Active Regions</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold text-info">{sourcePerformance.length}</div>
                <div className="text-sm text-muted-foreground">Lead Sources</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Regional Heatmap
          </TabsTrigger>
          <TabsTrigger value="source" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Source Performance
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Timeline View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Data */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Regional Lead Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {heatmapData.slice(0, 10).map((region, index) => (
                  <div key={`${region.state}-${region.city}`} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{region.city}, {region.state}</div>
                        <div className="text-sm text-muted-foreground">Avg Score: {region.avgScore.toFixed(0)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getSourceColor(region.topSource)}>
                        {region.topSource.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary">{region.leadCount} leads</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mock Map Placeholder */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Geographic Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-dashed border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground">Interactive map visualization</p>
                    <p className="text-sm text-muted-foreground">showing lead density by region</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="source">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Lead Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sourcePerformance.map((source) => (
                  <div key={source.source} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getSourceColor(source.source)}>
                          {source.source.replace('_', ' ')}
                        </Badge>
                        <div>
                          <div className="font-medium text-foreground">{source.leadCount} Leads</div>
                          <div className="text-sm text-muted-foreground">Avg Score: {source.avgScore.toFixed(0)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-foreground">{(source.conversionRate * 100).toFixed(1)}%</div>
                        <div className={`text-sm ${source.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                          {source.growth > 0 ? '+' : ''}{(source.growth * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300" 
                        style={{ width: `${Math.min(100, (source.leadCount / Math.max(...sourcePerformance.map(s => s.leadCount))) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Lead Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-dashed border-success/20 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">Timeline visualization</p>
                  <p className="text-sm text-muted-foreground">showing lead activity over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadFlowVisualization;
