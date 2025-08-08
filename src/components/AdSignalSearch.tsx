
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';

interface SearchFilters {
  businessName: string;
  industry: string;
  location: string;
  platforms: string[];
  dateRange: string;
  adFormat: string;
  spendRange: string;
}

const AdSignalSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    businessName: '',
    industry: '',
    location: '',
    platforms: [],
    dateRange: 'last7days',
    adFormat: 'all',
    spendRange: 'all'
  });

  const [activeFilters, setActiveFilters] = useState(0);

  const platforms = [
    { id: 'meta', name: 'Meta Ads', count: 234 },
    { id: 'google', name: 'Google Ads', count: 156 },
    { id: 'youtube', name: 'YouTube Ads', count: 89 },
    { id: 'tiktok', name: 'TikTok Ads', count: 67 }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
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
              onChange={(e) => setFilters(prev => ({ ...prev, businessName: e.target.value }))}
            />
            <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
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
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
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
            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
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

            <Select value={filters.adFormat} onValueChange={(value) => setFilters(prev => ({ ...prev, adFormat: value }))}>
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

            <Select value={filters.spendRange} onValueChange={(value) => setFilters(prev => ({ ...prev, spendRange: value }))}>
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

            <Button className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search Ads
            </Button>
          </div>

          {/* Active Filters Summary */}
          {activeFilters > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{activeFilters} active filters</span>
              <Button variant="ghost" size="sm" onClick={() => {
                setFilters({
                  businessName: '',
                  industry: '',
                  location: '',
                  platforms: [],
                  dateRange: 'last7days',
                  adFormat: 'all',
                  spendRange: 'all'
                });
                setActiveFilters(0);
              }}>
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
