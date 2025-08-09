
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLiveAds, SearchFilters, AdItem, fetchAnalytics } from '@/services/adSignal';
import { useToast } from '@/hooks/use-toast';

export function useAdSignalData() {
  const [filters, setFilters] = useState<SearchFilters>({ platforms: ["meta"] });
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [ads, setAds] = useState<AdItem[]>([]);
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const analyticsQuery = useQuery({
    queryKey: ["ad-analytics", filters],
    queryFn: () => fetchAnalytics(filters),
    enabled: hasApplied,
  });

  const applyFilters = useCallback((newFilters: SearchFilters) => {
    setCursor(undefined);
    setAds([]);
    setFilters(newFilters);
    setHasApplied(true);
    queryClient.invalidateQueries({ queryKey: ["ad-analytics"] });
    void refetch();
  }, [refetch, queryClient]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasApplied && cursor) {
      void refetch();
    }
  }, [isFetching, hasApplied, cursor, refetch]);

  const refreshData = useCallback(() => {
    if (hasApplied) {
      setCursor(undefined);
      setAds([]);
      queryClient.invalidateQueries({ queryKey: ["ad-feed"] });
      queryClient.invalidateQueries({ queryKey: ["ad-analytics"] });
      void refetch();
    }
  }, [hasApplied, refetch, queryClient]);

  return {
    ads,
    filters,
    isLoading: isFetching,
    isError,
    error,
    hasApplied,
    analytics: analyticsQuery.data,
    analyticsLoading: analyticsQuery.isFetching,
    applyFilters,
    loadMore,
    refreshData
  };
}
