
import { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { SearchFilters } from '@/services/adSignal';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface EnhancedFilterBarProps {
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function EnhancedFilterBar({ 
  filters, 
  onApplyFilters, 
  onRefresh, 
  isLoading 
}: EnhancedFilterBarProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const debouncedBusiness = useDebounce(localFilters.business || '', 500);
  const debouncedIndustry = useDebounce(localFilters.industry || '', 500);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.business) count++;
    if (localFilters.industry) count++;
    if (localFilters.location?.city || localFilters.location?.state) count++;
    if (localFilters.platforms?.length) count++;
    if (localFilters.dateRange) count++;
    return count;
  }, [localFilters]);

  const handleInputChange = useCallback((field: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    const parts = value.split(',').map(p => p.trim());
    const location = {
      city: parts[0] || undefined,
      state: parts[1] || undefined,
      zip: parts[2] || undefined
    };
    handleInputChange('location', location);
  }, [handleInputChange]);

  const handlePlatformToggle = useCallback((platform: string) => {
    const current = localFilters.platforms || [];
    const updated = current.includes(platform as any) 
      ? current.filter(p => p !== platform)
      : [...current, platform as any];
    handleInputChange('platforms', updated);
  }, [localFilters.platforms, handleInputChange]);

  const handleApply = useCallback(() => {
    onApplyFilters(localFilters);
  }, [localFilters, onApplyFilters]);

  const handleClear = useCallback(() => {
    const clearedFilters: SearchFilters = { platforms: ["meta"] };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  }, [onApplyFilters]);

  return (
    <div className="space-y-4 p-6 bg-card rounded-xl border">
      {/* Primary Search Row */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Business name or competitor"
            value={localFilters.business || ''}
            onChange={(e) => handleInputChange('business', e.target.value)}
            className="pl-10"
          />
        </div>
        <Select 
          value={localFilters.industry || ''} 
          onValueChange={(value) => handleInputChange('industry', value)}
        >
          <SelectTrigger className="w-48">
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
        <Input
          placeholder="Location (City, State)"
          value={`${localFilters.location?.city || ''}${localFilters.location?.state ? ', ' + localFilters.location.state : ''}`}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="w-48"
        />
      </div>

      {/* Platform Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Platforms</span>
          <Badge variant="secondary">
            {localFilters.platforms?.length || 0} selected
          </Badge>
        </div>
        <div className="flex gap-2">
          {['meta', 'google', 'youtube', 'tiktok'].map(platform => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={platform}
                checked={localFilters.platforms?.includes(platform as any) || false}
                onCheckedChange={() => handlePlatformToggle(platform)}
              />
              <label htmlFor={platform} className="text-sm capitalize">
                {platform}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-muted-foreground"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
        {activeFilterCount > 0 && (
          <Badge variant="outline">{activeFilterCount} active</Badge>
        )}
      </div>

      {showAdvanced && (
        <>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select 
              value={localFilters.dateRange?.from ? 'custom' : '7'} 
              onValueChange={(value) => {
                if (value === '7') {
                  const to = new Date();
                  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
                  handleInputChange('dateRange', { from: from.toISOString(), to: to.toISOString() });
                } else if (value === '30') {
                  const to = new Date();
                  const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
                  handleInputChange('dateRange', { from: from.toISOString(), to: to.toISOString() });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button onClick={handleApply} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={handleClear} size="sm">
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
