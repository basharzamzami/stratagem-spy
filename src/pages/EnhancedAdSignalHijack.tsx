
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BarChart3, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdSignalData } from "@/hooks/useAdSignalData";
import EnhancedFilterBar from "@/components/ad-signal-hijack/EnhancedFilterBar";
import EnhancedLiveFeed from "@/components/ad-signal-hijack/EnhancedLiveFeed";
import AnalyticsDashboard from "@/components/ad-signal-hijack/AnalyticsDashboard";
import ExportControls from "@/components/ad-signal-hijack/ExportControls";

export default function EnhancedAdSignalHijack() {
  const {
    ads,
    filters,
    isLoading,
    isError,
    error,
    hasApplied,
    analytics,
    analyticsLoading,
    applyFilters,
    loadMore,
    refreshData
  } = useAdSignalData();

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Ad Signal Hijack
                </h1>
                <p className="text-muted-foreground">
                  Real-time competitor ad tracking & intelligence
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-success">
                  {isLoading ? 'SCANNING' : hasApplied ? 'LIVE' : 'READY'}
                </span>
              </div>
            </div>

            {/* Enhanced Filter Bar */}
            <EnhancedFilterBar
              filters={filters}
              onApplyFilters={applyFilters}
              onRefresh={refreshData}
              isLoading={isLoading}
            />
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Live Feed ({ads.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export & Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <Card className="p-6">
                <CardContent className="p-0">
                  {isError && (
                    <div className="text-center py-8">
                      <div className="text-destructive font-medium mb-2">
                        Failed to load ads
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {(error as Error)?.message || 'Unknown error occurred'}
                      </div>
                    </div>
                  )}
                  
                  <EnhancedLiveFeed
                    ads={ads}
                    isLoading={isLoading}
                    onLoadMore={loadMore}
                    hasMore={ads.length > 0}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard 
                filters={filters}
                data={analytics}
                isLoading={analyticsLoading}
              />
            </TabsContent>

            <TabsContent value="export">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-4">Export & Reporting</h3>
                  <ExportControls filters={filters} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
