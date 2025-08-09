
import { useCallback, useRef, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdItem } from '@/services/adSignal';
import OptimizedAdCard from './OptimizedAdCard';
import { Play, Pause, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLiveFeedProps {
  ads: AdItem[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore?: boolean;
}

export default function EnhancedLiveFeed({ 
  ads, 
  isLoading, 
  onLoadMore, 
  hasMore = true 
}: EnhancedLiveFeedProps) {
  const [isLive, setIsLive] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'engagement' | 'spend'>('recent');
  const sentinel = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!sentinel.current || !hasMore || isLoading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: '100px' }
    );
    
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  const handleLiveToggle = useCallback(() => {
    setIsLive(!isLive);
    toast({
      title: !isLive ? "Live monitoring enabled" : "Live monitoring paused",
      description: !isLive 
        ? "Feed will now update automatically" 
        : "Feed updates are paused"
    });
  }, [isLive, toast]);

  const handleAnalyze = useCallback(async (id: string) => {
    setAnalyzingId(id);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzingId(null);
    toast({
      title: "Analysis complete",
      description: "Detailed insights generated for this ad"
    });
  }, [toast]);

  const handleViewOriginal = useCallback((ad: AdItem) => {
    toast({
      title: "Opening original ad",
      description: `Redirecting to ${ad.platform} to view the source`
    });
    // In production, this would open the actual ad URL
  }, [toast]);

  const sortedAds = [...ads].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.first_seen || 0).getTime() - new Date(a.first_seen || 0).getTime();
      case 'engagement':
        return Math.random() - 0.5; // Mock sorting
      case 'spend':
        return Math.random() - 0.5; // Mock sorting
      default:
        return 0;
    }
  });

  if (ads.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No ads found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feed Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={handleLiveToggle}
          >
            {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Badge variant="secondary" className="bg-success/20 text-success">
            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
            {ads.length} ads found
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm bg-background border border-border rounded px-2 py-1"
          >
            <option value="recent">Most Recent</option>
            <option value="engagement">Engagement</option>
            <option value="spend">Ad Spend</option>
          </select>
        </div>
      </div>

      {/* Ad Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedAds.map((ad) => (
          <OptimizedAdCard
            key={ad.id}
            ad={ad}
            onAnalyze={handleAnalyze}
            onViewOriginal={handleViewOriginal}
            isAnalyzing={analyzingId === ad.id}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-2 text-muted-foreground">Loading more ads...</span>
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && !isLoading && <div ref={sentinel} className="h-4" />}

      {/* No More Results */}
      {!hasMore && ads.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>That's all the ads we found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
