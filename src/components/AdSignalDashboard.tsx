
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdSignalSearch from '@/components/AdSignalSearch';
import LiveAdFeed from '@/components/LiveAdFeed';
import AdAnalyticsDashboard from '@/components/AdAnalyticsDashboard';
import AdExportTools from '@/components/AdExportTools';
import CompetitorMetrics from '@/components/CompetitorMetrics';
import { Badge } from '@/components/ui/badge';
import { Eye, Zap, BarChart3, Download } from 'lucide-react';

const AdSignalDashboard = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Ad Signal Hijack</h1>
          <p className="text-muted-foreground">Real-time competitor ad tracking & decoding</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
            Live Monitoring
          </Badge>
        </div>
      </div>

      {/* Search Component - Always Visible */}
      <AdSignalSearch 
        onSearchResults={handleSearchResults}
        onFiltersChange={handleFiltersChange}
      />

      {/* Metrics Overview */}
      <CompetitorMetrics />

      {/* Main Content Tabs */}
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Live Ad Feed
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export & Reports
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <LiveAdFeed />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <AdExportTools />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground">Advanced competitive intelligence and strategy recommendations</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdSignalDashboard;
