
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  BarChart3, 
  Download, 
  Users, 
  Eye,
  DollarSign,
  TrendingUp,
  Target
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { fetchAdsFromDatabase } from '@/services/adDatabase';
import EnhancedFilterBar from "@/components/ad-signal-hijack/EnhancedFilterBar";
import EnhancedLiveFeed from "@/components/ad-signal-hijack/EnhancedLiveFeed";
import AnalyticsDashboard from "@/components/ad-signal-hijack/AnalyticsDashboard";
import ExportControls from "@/components/ad-signal-hijack/ExportControls";
import AdMetricsCard from "@/components/ad-signal-hijack/AdMetricsCard";
import QuickActionsPanel from "@/components/ad-signal-hijack/QuickActionsPanel";
import CompetitorInsights from "@/components/ad-signal-hijack/CompetitorInsights";
import { useAdSignalData } from "@/hooks/useAdSignalData";

export default function EnhancedAdSignalHijack() {
  const {
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

  // Fetch actual ads data to get real count
  const { data: actualAds = [] } = useQuery({
    queryKey: ['active-ads-count'],
    queryFn: () => fetchAdsFromDatabase(50),
    refetchInterval: 30000,
  });

  const handleExport = () => {
    console.log('Exporting data...');
  };

  return (
    <div className="min-h-screen w-screen bg-background flex">
      <Navigation />
      <div className="flex-1 min-h-screen w-full overflow-auto">
        <div className="p-8 space-y-6 min-h-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Ad Signal Hijack
                </h1>
                <p className="text-muted-foreground">
                  Advanced competitive intelligence & real-time ad tracking
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

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <AdMetricsCard
              title="Active Ads Tracked"
              value={actualAds.length}
              change={12}
              trend="up"
              icon={<Eye className="w-5 h-5 text-primary" />}
            />
            <AdMetricsCard
              title="Total Ad Spend"
              value="$2.4M"
              change={8}
              trend="up"
              subtitle="Last 30 days"
              icon={<DollarSign className="w-5 h-5 text-success" />}
            />
            <AdMetricsCard
              title="Competitors"
              value={new Set(actualAds.map(ad => ad.competitor)).size}
              change={3}
              trend="up"
              icon={<Users className="w-5 h-5 text-blue-500" />}
            />
            <AdMetricsCard
              title="Avg. Engagement"
              value="3.2%"
              change={-2}
              trend="down"
              icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
            />
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              <Tabs defaultValue="feed" className="space-y-6 h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="feed" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Live Feed ({actualAds.length})
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

                <TabsContent value="feed" className="h-full">
                  <Card className="p-6 h-full">
                    <CardContent className="p-0 h-full">
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
                        ads={[]}
                        isLoading={isLoading}
                        onLoadMore={loadMore}
                        hasMore={actualAds.length > 0}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="h-full">
                  <AnalyticsDashboard />
                </TabsContent>

                <TabsContent value="export" className="h-full">
                  <Card className="p-6 h-full">
                    <CardContent>
                      <h3 className="text-xl font-semibold mb-4">Export & Reporting</h3>
                      <ExportControls filters={filters} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              <QuickActionsPanel
                totalAds={actualAds.length}
                onRefresh={refreshData}
                onExport={handleExport}
                isRefreshing={isLoading}
              />
              
              <CompetitorInsights />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
