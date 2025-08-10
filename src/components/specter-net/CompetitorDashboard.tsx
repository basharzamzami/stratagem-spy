
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchCompetitors, Competitor } from '@/services/specterNet';
import { Search, TrendingUp, Target, Eye, Building } from 'lucide-react';

export default function CompetitorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: fetchCompetitors,
  });

  const filteredCompetitors = competitors?.filter(competitor =>
    competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2 text-muted-foreground">Loading competitors...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Competitor Intelligence</h2>
          <p className="text-muted-foreground">Monitor and analyze competitor activities</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search competitors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">{competitors?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Competitors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {competitors?.filter(c => c.dominance_score > 70).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">High Threat</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {competitors?.reduce((sum, c) => sum + c.total_ads_count, 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Ads Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  ${competitors?.reduce((sum, c) => sum + c.estimated_monthly_spend, 0).toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Est. Monthly Spend</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitors List */}
      <div className="grid gap-4">
        {filteredCompetitors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No competitors found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search criteria' : 'No competitors are currently being monitored'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCompetitors.map((competitor) => (
            <Card key={competitor.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{competitor.name}</CardTitle>
                    {competitor.domain && (
                      <p className="text-sm text-muted-foreground">{competitor.domain}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={competitor.dominance_score > 70 ? "destructive" : 
                               competitor.dominance_score > 40 ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {competitor.dominance_score}/100 Dominance
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Location</div>
                    <div className="font-medium">
                      {competitor.location_city ? `${competitor.location_city}, ${competitor.location_state}` : 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Industry</div>
                    <div className="font-medium">{competitor.industry || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Ads</div>
                    <div className="font-medium">{competitor.total_ads_count}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Monthly Spend</div>
                    <div className="font-medium">${competitor.estimated_monthly_spend.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Last Activity: {new Date(competitor.last_activity).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
