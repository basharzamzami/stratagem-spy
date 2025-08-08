
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchFilters {
  businessName: string;
  industry: string;
  location: string;
  platforms: string[];
  dateRange: string;
  adFormat: string;
  spendRange: string;
}

interface AdSignalSearchProps {
  onSearchResults?: (results: any[]) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
}

const AdSignalSearch = ({ onSearchResults, onFiltersChange }: AdSignalSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    businessName: '',
    industry: '',
    location: '',
    platforms: [],
    dateRange: 'last7days',
    adFormat: 'all',
    spendRange: 'all'
  });

  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const platforms = [
    { id: 'meta', name: 'Meta Ads', count: 234 },
    { id: 'google', name: 'Google Ads', count: 156 },
    { id: 'youtube', name: 'YouTube Ads', count: 89 },
    { id: 'tiktok', name: 'TikTok Ads', count: 67 }
  ];

  const handlePlatformToggle = (platformId: string) => {
    const newFilters = {
      ...filters,
      platforms: filters.platforms.includes(platformId)
        ? filters.platforms.filter(p => p !== platformId)
        : [...filters.platforms, platformId]
    };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSearch = async () => {
    if (!filters.businessName && !filters.industry && !filters.location) {
      toast({
        title: "Search criteria required",
        description: "Please enter at least one search parameter",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate API call for now - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = [
        {
          id: '1',
          competitor: filters.businessName || 'Sample Competitor',
          platform: filters.platforms[0] || 'meta',
          adCount: Math.floor(Math.random() * 100) + 1,
          totalSpend: `$${Math.floor(Math.random() * 50000) + 1000}`,
          dateFound: new Date().toISOString()
        }
      ];

      onSearchResults?.(mockResults);
      
      toast({
        title: "Search completed",
        description: `Found ${mockResults.length} results matching your criteria`
      });
      
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to fetch ad data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      businessName: '',
      industry: '',
      location: '',
      platforms: [],
      dateRange: 'last7days',
      adFormat: 'all',
      spendRange: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
    
    toast({
      title: "Filters cleared",
      description: "All search filters have been reset"
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== 'all' && value !== 'last7days';
  }).length;

  return (
    <div className="space-y-4">
      <Card className="sticky top-0 z-10 bg-background/95 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Competitor Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Business name or competitor"
              value={filters.businessName}
              onChange={(e) => handleFilterChange('businessName', e.target.value)}
            />
            <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS & Technology</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="realestate">Real Estate</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location (City, State, ZIP)"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Platforms:</span>
              <Badge variant="secondary">{filters.platforms.length} selected</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <Button
                  key={platform.id}
                  variant={filters.platforms.includes(platform.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePlatformToggle(platform.id)}
                  className="text-xs"
                >
                  {platform.name}
                  <Badge variant="secondary" className="ml-2">
                    {platform.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Filters Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.adFormat} onValueChange={(value) => handleFilterChange('adFormat', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ad Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="image">Image Ads</SelectItem>
                <SelectItem value="video">Video Ads</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.spendRange} onValueChange={(value) => handleFilterChange('spendRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Spend Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="low">$0 - $1K/day</SelectItem>
                <SelectItem value="medium">$1K - $10K/day</SelectItem>
                <SelectItem value="high">$10K+ /day</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              className="w-full" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Ads
                </>
              )}
            </Button>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{activeFiltersCount} active filters</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSignalSearch;
