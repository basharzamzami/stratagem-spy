import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveAds, SearchFilters, AdItem } from "@/services/adSignal";
import { FilterBar, LiveFeed, ExportControls } from "@/components/ad-signal-hijack";
import AnalyticsDashboard from "@/components/ad-signal-hijack/AnalyticsDashboard";
import PageHeader from "@/components/PageHeader";

export default function AdSignalHijack() {
  const [filters, setFilters] = useState<SearchFilters>({ platforms: ["meta"] });
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [ads, setAds] = useState<AdItem[]>([]);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const f = params.get("filters");
      if (f) {
        const parsed = JSON.parse(decodeURIComponent(f));
        setFilters(parsed);
        setHasApplied(true);
      }
    } catch {}
  }, []);

  const { isFetching, refetch, isError, error } = useQuery({
    queryKey: ["ad-feed", filters, cursor],
    queryFn: async () => {
      if (!hasApplied) return { ads: [], nextCursor: undefined };
      const res = await fetchLiveAds(filters, cursor);
      setAds((prev) => (cursor ? [...prev, ...res.ads] : res.ads));
      if (res.nextCursor) setCursor(res.nextCursor);
      return res;
    },
    enabled: false,
  });

  const handleApplyFilters = useCallback((f: SearchFilters) => {
    setCursor(undefined);
    setAds([]);
    setFilters(f);
    setHasApplied(true);
    void refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasApplied) void refetch();
  }, [isFetching, hasApplied, refetch]);

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 sticky top-0 bg-background z-10 border-b border-border">
            <PageHeader title="Ad Signal Hijack" subtitle="Real-time competitor ad tracking & decoding" />
            <FilterBar onChange={handleApplyFilters} />
          </div>

          <div className="space-y-6">
            <Card className="saas-card p-6">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Live Ad Feed</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-success">{isFetching ? 'LOADING' : hasApplied ? 'READY' : 'IDLE'}</span>
                  </div>
                </div>

                {!hasApplied && (
                  <div className="text-sm text-muted-foreground">Set filters and click Apply to load ads.</div>
                )}
                {isError && (
                  <div className="text-sm text-destructive">{(error as Error)?.message || 'Failed to load ads'}</div>
                )}

                <LiveFeed ads={ads} onLoadMore={loadMore} loading={isFetching} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AnalyticsDashboard filters={filters} />
              </div>
              <div>
                <Card className="saas-card p-6">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-4">Export & Reporting</h3>
                    <ExportControls filters={filters} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
