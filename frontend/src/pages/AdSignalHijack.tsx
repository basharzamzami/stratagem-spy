import React, { useMemo, useState } from "react";
import { useAds } from "../hooks/useAds";
import AdCard from "../components/AdCard";
import AdDetailModal from "../components/AdDetailModal";
import FilterToolbar, { FiltersState } from "../components/FilterToolbar";
import "../styles/adSignalHijack.css";

export default function AdSignalHijackPage() {
  const [filters, setFilters] = useState<FiltersState>({ accountId: "demo" });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useAds({ ...filters, pageSize: 24 });
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) || [], [data]);

  const onClear = () => setFilters({ accountId: filters.accountId });

  return (
    <div className="min-h-screen adsh-bg text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold">Ad Signal Hijack</h1>
        <p className="text-white/70 mt-1">Monitor competitor advertising and capture insights.</p>

        <div className="mt-4">
          <FilterToolbar value={filters} onChange={setFilters} onClear={onClear} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/10 animate-pulse rounded" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 text-red-300">Failed to load ads</div>
        ) : (
          <>
            {items.length === 0 ? (
              <div className="mt-24 text-center">
                <img src="/empty_state.svg" alt="No ads" className="mx-auto w-48 opacity-80" />
                <div className="mt-4 text-white/80">No ads found for the selected filters.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                {items.map((ad) => (
                  <AdCard key={ad.id} ad={ad} onClick={() => setSelectedAdId(ad.id)} />
                ))}
              </div>
            )}

            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} className="bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded">
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedAdId && <AdDetailModal adId={selectedAdId} onClose={() => setSelectedAdId(null)} />}
    </div>
  );
}

