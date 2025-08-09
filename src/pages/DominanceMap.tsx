
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from "@/components/Navigation";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { fetchMarketDominance } from '@/services/specterNet';
import { Map, Target, TrendingUp, Shield, Download, Filter, Search } from 'lucide-react';
import DominanceHeatmap from '@/components/dominance-map/DominanceHeatmap';
import CompetitorRankings from '@/components/dominance-map/CompetitorRankings';
import MarketMetrics from '@/components/dominance-map/MarketMetrics';

export default function DominanceMap() {
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchZip, setSearchZip] = useState<string>('');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');

  const { data: dominanceData, isLoading } = useQuery({
    queryKey: ['market-dominance', { state: selectedState, city: selectedCity, zip: searchZip }],
    queryFn: () => fetchMarketDominance(searchZip ? [searchZip] : undefined),
  });

  // Calculate aggregate metrics
  const totalZipCodes = dominanceData?.length || 0;
  const avgDominanceScore = dominanceData?.length 
    ? dominanceData.reduce((sum, item) => sum + item.dominance_score, 0) / dominanceData.length 
    : 0;
  const highDominanceZones = dominanceData?.filter(item => item.dominance_score >= 70).length || 0;
  const competitiveZones = dominanceData?.filter(item => item.dominance_score < 40).length || 0;

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting dominance report...');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Market Dominance Map</h1>
                <p className="text-muted-foreground">Geographic competitive intelligence with heatmap visualization</p>
              </div>
              <div className="ml-auto flex gap-3">
                <Button variant="outline" onClick={handleExportReport} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
                <Badge className="bg-success/20 text-success border-success/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  Live Data
                </Badge>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Coverage Zones</div>
                    <div className="text-xl font-bold text-primary">{totalZipCodes}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">High Dominance</div>
                    <div className="text-xl font-bold text-green-400">{highDominanceZones}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Competitive Zones</div>
                    <div className="text-xl font-bold text-red-400">{competitiveZones}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                    <div className="text-xl font-bold text-blue-400">{avgDominanceScore.toFixed(1)}%</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Market Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="Austin">Austin</SelectItem>
                      <SelectItem value="Miami">Miami</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ZIP code"
                      value={searchZip}
                      onChange={(e) => setSearchZip(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Device Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Reorganized Layout */}
          <div className="space-y-6">
            {/* Top Row - Heatmap with Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Heatmap Visualization */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="w-5 h-5" />
                      Market Dominance Heatmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DominanceHeatmap 
                      data={dominanceData || []}
                      isLoading={isLoading}
                      deviceFilter={deviceFilter}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Market Metrics */}
              <div>
                <MarketMetrics data={dominanceData || []} />
              </div>
            </div>

            {/* Bottom Row - Competitor Rankings (Full Width) */}
            <div className="w-full">
              <CompetitorRankings data={dominanceData || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
