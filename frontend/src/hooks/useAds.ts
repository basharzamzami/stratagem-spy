import { useInfiniteQuery } from "@tanstack/react-query";
import type { AdsListResponse } from "../types/ad.types";

export function useAds(filters: { accountId: string; competitorId?: string; platform?: string; dateFrom?: string; dateTo?: string; pageSize?: number; }) {
  return useInfiniteQuery<AdsListResponse>({
    queryKey: ["ads", filters],
    staleTime: 1000 * 60 * 30,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("accountId", filters.accountId);
      if (filters.competitorId) params.set("competitorId", filters.competitorId);
      if (filters.platform) params.set("platform", filters.platform);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      params.set("pageSize", String(filters.pageSize || 24));
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/ads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch ads");
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: true,
  });
}

