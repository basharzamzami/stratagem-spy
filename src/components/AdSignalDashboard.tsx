
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
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
      <ResizablePanelGroup direction="vertical" className="h-full">
        {/* Top Panel - Header, Search & Metrics */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
          <div className="h-full flex flex-col overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-4 border-b border-border bg-background">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Ad Signal Intelligence</h1>
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
            </div>

            {/* Metrics Overview - Scrollable */}
            <div className="flex-1 overflow-auto p-4 bg-background border-b border-border">
              <CompetitorMetrics />
            </div>
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="h-2 bg-border hover:bg-primary/20 transition-colors cursor-row-resize" />

        {/* Bottom Panel - Main Content Tabs */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col overflow-hidden">
            <Tabs defaultValue="feed" className="h-full flex flex-col overflow-hidden">
              <div className="flex-shrink-0 px-4 pt-4 bg-background border-b border-border">
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
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="feed" className="h-full m-0 p-0 overflow-hidden">
                  <LiveAdFeed />
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0 p-0 overflow-hidden">
                  <div className="h-full overflow-auto p-4">
                    <AdAnalyticsDashboard />
                  </div>
                </TabsContent>

                <TabsContent value="export" className="h-full m-0 p-0 overflow-hidden">
                  <div className="h-full overflow-auto p-4">
                    <AdExportTools />
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="h-full m-0 p-0 overflow-hidden">
                  <div className="h-full flex items-center justify-center p-4">
                    <div className="text-center">
                      <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Insights</h3>
                      <p className="text-muted-foreground">Advanced competitive intelligence and strategy recommendations</p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AdSignalDashboard;
