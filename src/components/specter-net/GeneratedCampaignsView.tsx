
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Users,
  Play,
  Pause,
  Settings,
  Eye
} from 'lucide-react';
import { GeneratedCampaign } from '@/services/specterNetIntegration';

interface GeneratedCampaignsViewProps {
  campaigns: GeneratedCampaign[];
}

const GeneratedCampaignsView = ({ campaigns }: GeneratedCampaignsViewProps) => {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Campaigns Generated</h3>
          <p className="text-muted-foreground">Run the integration to auto-generate hijack campaigns</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'paused': return 'bg-warning/20 text-warning border-warning/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getBudgetUtilization = (campaign: GeneratedCampaign) => {
    const spent = campaign.performance_metrics.cost;
    const budget = campaign.budget_allocation.total_budget;
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {campaigns.map((campaign, index) => (
        <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      Targeting {campaign.target_leads.length} warm leads
                    </div>
                  </div>
                </CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getStatusColor(campaign.status)}>
                  {campaign.status.toUpperCase()}
                </Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campaign Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{campaign.target_leads.length}</div>
                <div className="text-xs text-muted-foreground">Target Leads</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{campaign.ad_variants.length}</div>
                <div className="text-xs text-muted-foreground">Ad Variants</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{campaign.hijacked_competitors.length}</div>
                <div className="text-xs text-muted-foreground">Competitors</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  ${(campaign.budget_allocation.daily_budget).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Daily Budget</div>
              </div>
            </div>

            {/* Budget Utilization */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Budget Utilization</span>
                <span className="text-sm font-medium">
                  ${campaign.performance_metrics.cost.toLocaleString()} / 
                  ${campaign.budget_allocation.total_budget.toLocaleString()}
                </span>
              </div>
              <Progress value={getBudgetUtilization(campaign)} className="h-2" />
            </div>

            {/* Hijacked Competitors */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Hijacked Competitors:</span>
              <div className="flex flex-wrap gap-2">
                {campaign.hijacked_competitors.map((competitor, compIndex) => (
                  <Badge key={compIndex} variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                    <Target className="w-3 h-3 mr-1" />
                    {competitor}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Targeting Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Geographic Targets:</span>
                <div className="flex flex-wrap gap-1">
                  {campaign.targeting_config.geo_targets.slice(0, 3).map((geo, geoIndex) => (
                    <Badge key={geoIndex} variant="secondary" className="text-xs">
                      {geo}
                    </Badge>
                  ))}
                  {campaign.targeting_config.geo_targets.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{campaign.targeting_config.geo_targets.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Intent Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {campaign.targeting_config.intent_keywords.slice(0, 4).map((keyword, keyIndex) => (
                    <Badge key={keyIndex} variant="outline" className="text-xs bg-primary/10 text-primary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Ad Variants Preview */}
            <Tabs defaultValue="variants" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="variants">
                  Ad Variants ({campaign.ad_variants.length})
                </TabsTrigger>
                <TabsTrigger value="performance">
                  Performance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="variants" className="space-y-4">
                {campaign.ad_variants.slice(0, 3).map((variant, varIndex) => (
                  <div key={variant.id} className="p-4 border rounded-lg bg-muted/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <div className="font-medium text-foreground">{variant.headline}</div>
                        <div className="text-sm text-muted-foreground">{variant.primary_text}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {variant.cta}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            vs {variant.competitor_source}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">Expected CTR</div>
                        <div className="font-medium text-foreground">
                          {(variant.expected_ctr * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Strategy:</span>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                        {variant.hijack_strategy.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
                {campaign.ad_variants.length > 3 && (
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-3 h-3 mr-1" />
                    View All {campaign.ad_variants.length} Variants
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">
                      {campaign.performance_metrics.impressions.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Impressions</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="w-6 h-6 text-success mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">
                      {campaign.performance_metrics.clicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="w-6 h-6 text-warning mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">
                      {campaign.performance_metrics.conversions}
                    </div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">
                      {campaign.performance_metrics.roi.toFixed(1)}x
                    </div>
                    <div className="text-xs text-muted-foreground">ROI</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="bg-primary hover:bg-primary/90">
                <Play className="w-4 h-4 mr-2" />
                Launch Campaign
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button variant="ghost">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GeneratedCampaignsView;
