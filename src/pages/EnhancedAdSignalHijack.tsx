
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
  Target,
  Activity,
  Brain
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
import LiveEngagementPulse from "@/components/ad-signal-hijack/LiveEngagementPulse";
import WatchlistManager from "@/components/ad-signal-hijack/WatchlistManager";
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
      <div className="flex-1 min-h-screen w-full overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-6 border-b border-border bg-background">
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

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full flex">
              {/* Main Content - Left Side */}
              <div className="flex-1 min-h-0 overflow-auto p-6">
                <div className="space-y-6">
                  {/* Metrics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                  {/* Main Dashboard Tabs */}
                  <Tabs defaultValue="feed" className="h-full">
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

                    <TabsContent value="feed" className="mt-6">
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
                            ads={[]}
                            isLoading={isLoading}
                            onLoadMore={loadMore}
                            hasMore={actualAds.length > 0}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-6">
                      <AnalyticsDashboard />
                    </TabsContent>

                    <TabsContent value="export" className="mt-6">
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

              {/* Right Insight Rail - Fixed Width */}
              <div className="flex-shrink-0 w-80 min-h-0 overflow-auto bg-muted/30 border-l border-border p-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Intelligence Rail</h3>
                  </div>

                  {/* Quick Actions Panel */}
                  <QuickActionsPanel
                    totalAds={actualAds.length}
                    onRefresh={refreshData}
                    onExport={handleExport}
                    isRefreshing={isLoading}
                  />

                  {/* Live Engagement Pulse */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-orange-500" />
                        <h4 className="font-medium">Live Pulse Monitor</h4>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Real-time engagement spike detection
                      </div>
                      <LiveEngagementPulse />
                    </CardContent>
                  </Card>

                  {/* Competitor Watchlist */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium">Watchlist Manager</h4>
                      </div>
                      <WatchlistManager />
                    </CardContent>
                  </Card>

                  {/* Competitor Insights */}
                  <CompetitorInsights />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
