
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database } from 'lucide-react';
import { fetchAdsFromDatabase, DatabaseAdItem } from '@/services/adDatabase';
import { useToast } from '@/hooks/use-toast';
import DatabaseAdCard from './DatabaseAdCard';

interface DatabaseLiveFeedProps {
  onLoadMore?: () => void;
}

export default function DatabaseLiveFeed({ onLoadMore }: DatabaseLiveFeedProps) {
  const [ads, setAds] = useState<DatabaseAdItem[]>([]);
  const { toast } = useToast();

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['database-ads'],
    queryFn: () => fetchAdsFromDatabase(50),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  useEffect(() => {
    if (data) {
      setAds(data);
    }
  }, [data]);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing ads",
      description: "Fetching latest competitor ads from database..."
    });
  };

  const handleAnalyze = (id: string) => {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-success/20 text-success">
            <Database className="w-3 h-3 mr-2" />
            {ads.length} ads in database
          </Badge>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">
              {isLoading ? 'LOADING' : 'LIVE'}
            </span>
          </div>
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

      {/* Ads Grid */}
      {ads.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No ads found</h3>
          <p className="text-muted-foreground">
            The database is empty. Add some sample ads to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ads.map((ad) => (
            <DatabaseAdCard
              key={ad.id}
              ad={ad}
              onAnalyze={handleAnalyze}
              onViewOriginal={handleViewOriginal}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-2 text-muted-foreground">Loading ads from database...</span>
        </div>
      )}
    </div>
  );
}
