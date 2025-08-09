
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLiveAds, SearchFilters, AdItem, fetchAnalytics } from '@/services/adSignal';
import { useToast } from '@/hooks/use-toast';

export function useAdSignalData() {
  const [filters, setFilters] = useState<SearchFilters>({ platforms: ["meta"] });
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [ads, setAds] = useState<AdItem[]>([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isFetching, refetch, isError, error } = useQuery({
    queryKey: ["ad-feed", filters, cursor],
    queryFn: async () => {
      if (!hasApplied) return { ads: [], nextCursor: undefined };
      
      console.log('Fetching ads with filters:', filters);
      const res = await fetchLiveAds(filters, cursor);
      
      setAds((prev) => {
        const newAds = cursor ? [...prev, ...res.ads] : res.ads;
        // Remove duplicates based on ID
        const uniqueAds = newAds.filter((ad, index, arr) => 
          arr.findIndex(a => a.id === ad.id) === index
        );
        return uniqueAds;
      });
      
      if (res.nextCursor) setCursor(res.nextCursor);
      return res;
    },
    enabled: false,
    refetchInterval: isRealTimeEnabled ? 30000 : false, // Auto-refresh every 30 seconds when real-time is enabled
  });

  const analyticsQuery = useQuery({
    queryKey: ["ad-analytics", filters],
    queryFn: () => fetchAnalytics(filters),
    enabled: hasApplied,
    refetchInterval: isRealTimeEnabled ? 60000 : false, // Auto-refresh analytics every minute
  });

  const applyFilters = useCallback((newFilters: SearchFilters) => {
    console.log('Applying new filters:', newFilters);
    setCursor(undefined);
    setAds([]);
    setFilters(newFilters);
    setHasApplied(true);
    queryClient.invalidateQueries({ queryKey: ["ad-analytics"] });
    
    toast({
      title: "Filters applied",
      description: "Searching for ads with new criteria..."
    });
    
    void refetch();
  }, [refetch, queryClient, toast]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasApplied && cursor) {
      console.log('Loading more ads with cursor:', cursor);
      void refetch();
    }
  }, [isFetching, hasApplied, cursor, refetch]);

  const refreshData = useCallback(() => {
    if (hasApplied) {
      console.log('Refreshing ad data...');
      setCursor(undefined);
      setAds([]);
      queryClient.invalidateQueries({ queryKey: ["ad-feed"] });
      queryClient.invalidateQueries({ queryKey: ["ad-analytics"] });
      
      toast({
        title: "Refreshing data",
        description: "Fetching latest ads and analytics..."
      });
      
      void refetch();
    }
  }, [hasApplied, refetch, queryClient, toast]);

  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled(prev => {
      const newState = !prev;
      toast({
        title: newState ? "Real-time enabled" : "Real-time disabled",
        description: newState 
          ? "Data will refresh automatically" 
          : "Manual refresh required"
      });
      return newState;
    });
  }, [toast]);

  return {
    ads,
    filters,
    isLoading: isFetching,
    isError,
    error,
    hasApplied,
    analytics: analyticsQuery.data,
    analyticsLoading: analyticsQuery.isFetching,
    isRealTimeEnabled,
    applyFilters,
    loadMore,
    refreshData,
    toggleRealTime
  };
}
