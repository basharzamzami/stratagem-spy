
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { fetchAdsFromDatabase, searchAds, DatabaseAdItem } from '@/services/adDatabase';
import { useToast } from '@/hooks/use-toast';
import DatabaseAdCard from './DatabaseAdCard';

interface DatabaseLiveFeedProps {
  onLoadMore?: () => void;
}

export default function DatabaseLiveFeed({ onLoadMore }: DatabaseLiveFeedProps) {
  const [ads, setAds] = useState<DatabaseAdItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  console.log('DatabaseLiveFeed: Component mounted');

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['database-ads', searchQuery],
    queryFn: async () => {
      console.log('DatabaseLiveFeed: Fetching ads with query:', searchQuery);
      try {
        const result = searchQuery ? await searchAds(searchQuery) : await fetchAdsFromDatabase(50);
        console.log('DatabaseLiveFeed: Successfully fetched ads:', result);
        return result;
      } catch (err) {
        console.error('DatabaseLiveFeed: Error fetching ads:', err);
        throw err;
      }
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log('DatabaseLiveFeed: Setting ads data:', data);
      setAds(data);
    } else if (data) {
      console.warn('DatabaseLiveFeed: Data is not an array:', data);
      setAds([]);
    }
  }, [data]);

  useEffect(() => {
    console.log('DatabaseLiveFeed: Current ads state:', ads);
  }, [ads]);

  const handleRefresh = () => {
    console.log('DatabaseLiveFeed: Manual refresh triggered');
    refetch();
    toast({
      title: "Refreshing ads",
      description: "Fetching latest competitor ads from database..."
    });
  };

  const handleSearch = (query: string) => {
    console.log('DatabaseLiveFeed: Search query changed:', query);
    setSearchQuery(query);
  };

  const handleAnalyze = (id: string) => {
    console.log('DatabaseLiveFeed: Analyzing ad:', id);
    toast({
      title: "Analyzing ad",
      description: "Generating insights for this ad..."
    });
  };

  const handleViewOriginal = (ad: DatabaseAdItem) => {
    if (ad.ad_creative_url) {
      window.open(ad.ad_creative_url, '_blank');
    } else {
      toast({
        title: "No creative URL",
        description: "This ad doesn't have a creative URL to view."
      });
    }
  };

  if (isError) {
    console.error('DatabaseLiveFeed: Query error:', error);
    return (
      <div className="text-center py-12">
        <Database className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Database Error</h3>
        <p className="text-muted-foreground mb-4">
          {(error as Error)?.message || 'Failed to fetch ads from database'}
        </p>
        <Button onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feed Controls */}
      <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-success/20 text-success">
            <Database className="w-3 h-3 mr-2" />
            {ads.length} ads tracked
          </Badge>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">
              {isLoading ? 'LOADING' : 'LIVE'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 w-48"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Platform Filter Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Platforms:</span>
        {['Meta', 'Google', 'YouTube', 'LinkedIn', 'TikTok'].map(platform => {
          const count = ads.filter(ad => ad.platform === platform).length;
          return (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform} ({count})
            </Badge>
          );
        })}
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded text-xs">
        Debug: isLoading={String(isLoading)}, ads.length={ads.length}, error={error ? 'yes' : 'no'}
      </div>

      {/* Loading State */}
      {isLoading && ads.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-2 text-muted-foreground">Loading ads from database...</span>
        </div>
      )}

      {/* Ads Grid */}
      {!isLoading && ads.length === 0 ? (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No ads match your search' : 'No ads found'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `Try searching for different keywords`
              : 'The database appears empty. Check the service connection.'
            }
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
          <div className="mt-4 text-xs text-muted-foreground">
            Debug: This component is trying to fetch ads from the database service.
          </div>
        </div>
      ) : ads.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {ads.map((ad) => (
            <DatabaseAdCard
              key={ad.id}
              ad={ad}
              onAnalyze={handleAnalyze}
              onViewOriginal={handleViewOriginal}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
