import { useEffect, useRef } from "react";
import { AdItem } from "@/services/adSignal";
import AdCard from "./AdCard";

export default function LiveFeed({ ads, onLoadMore, loading }: { ads: AdItem[]; onLoadMore: () => void; loading: boolean }) {
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || ads.length === 0) return; // don't start IO until we have initial results
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) onLoadMore();
    }, { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loading, onLoadMore, ads.length]);

  if (loading && ads.length === 0) {
    return <div className="text-sm text-muted-foreground">Loading ads…</div>;
  }

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
      <div ref={sentinel} />
    </div>
  );
}
