
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <div className="h-screen flex flex-col overflow-hidden">
      <ScrollArea className="h-full">
        <div className="min-h-full">
          {/* Header Section - Fixed at top */}
          <div className="p-6 border-b border-border bg-background sticky top-0 z-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Ad Signal Intelligence</h1>
                <p className="text-muted-foreground text-lg">Real-time competitor ad tracking & decoding</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-success/20 text-success border-success/30 px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                  Live Monitoring
                </Badge>
              </div>
            </div>

            {/* Search Component */}
            <AdSignalSearch 
              onSearchResults={handleSearchResults}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Competitor Metrics - Full width */}
          <div className="p-6 bg-background">
            <h2 className="text-xl font-semibold text-foreground mb-4">Competitor Intelligence Overview</h2>
            <CompetitorMetrics />
          </div>

          {/* Main Content Tabs - Full width and height */}
          <div className="p-6">
            <Tabs defaultValue="feed" className="w-full">
              <div className="mb-6">
                <TabsList className="grid w-full grid-cols-4 h-12">
                  <TabsTrigger value="feed" className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    Live Ad Feed
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4" />
                    Export & Reports
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4" />
                    AI Insights
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="feed" className="w-full">
                <LiveAdFeed />
              </TabsContent>

              <TabsContent value="analytics" className="w-full">
                <AdAnalyticsDashboard />
              </TabsContent>

              <TabsContent value="export" className="w-full">
                <AdExportTools />
              </TabsContent>

              <TabsContent value="insights" className="w-full">
                <div className="flex items-center justify-center py-24">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-foreground mb-4">AI-Powered Insights</h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">Advanced competitive intelligence and strategy recommendations</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdSignalDashboard;
