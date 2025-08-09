
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  BarChart3, 
  Download, 
  Eye,
  RefreshCw,
  Filter
} from "lucide-react";
import { useState, useEffect } from "react";
import { ApiClient } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

interface AdItem {
  id: number;
  platform: string;
  competitor: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  date: string;
  engagement: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  active: boolean;
}

interface AdAnalytics {
  totalAds: number;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  avgCTR: number;
  byPlatform: Record<string, number>;
}

export default function AdSignalHijack() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [analytics, setAnalytics] = useState<AdAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all');
  const { toast } = useToast();

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const params = {
        ...(selectedPlatform !== 'all' && { platform: selectedPlatform }),
        ...(selectedCompetitor !== 'all' && { competitor: selectedCompetitor })
      };
      
      const response = await ApiClient.getAds(params);
      if (response.status === 'success' && response.data) {
        setAds(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch ads",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error);
      toast({
        title: "Error",
        description: "Failed to connect to API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await ApiClient.getAdAnalytics();
      if (response.status === 'success' && response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchAnalytics();
  }, [selectedPlatform, selectedCompetitor]);

  const handleRefresh = () => {
    fetchAds();
    fetchAnalytics();
    toast({
      title: "Refreshed",
      description: "Data updated successfully"
    });
  };

  const platforms = ['all', 'Meta', 'Google', 'YouTube', 'TikTok'];
  const competitors = ['all', ...Array.from(new Set(ads.map(ad => ad.competitor)))];

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 sticky top-0 bg-background z-10 border-b border-border pb-4">
            <PageHeader title="Ad Signal Hijack" subtitle="Real-time competitor ad tracking & decoding" />
            
            {/* Filters and Controls */}
            <div className="flex items-center gap-4 mt-4">
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform === 'all' ? 'All Platforms' : platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Competitor" />
                </SelectTrigger>
                <SelectContent>
                  {competitors.map(competitor => (
                    <SelectItem key={competitor} value={competitor}>
                      {competitor === 'all' ? 'All Competitors' : competitor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-success">
                  {isLoading ? 'LOADING' : 'LIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Analytics Overview */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Ads</div>
                  <div className="text-2xl font-bold text-primary">{analytics.totalAds}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Spend</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${analytics.totalSpend.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Impressions</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {analytics.totalImpressions.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-500/5 border-yellow-500/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Clicks</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {analytics.totalClicks.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-500/5 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Avg CTR</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {analytics.avgCTR.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Ad Feed ({ads.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <Card className="p-6">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : ads.length === 0 ? (
                    <div className="text-center py-12">
                      <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No ads found</h3>
                      <p className="text-muted-foreground">Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {ads.map(ad => (
                        <Card key={ad.id} className="p-4 hover:bg-muted/20 transition-colors">
                          <div className="flex gap-4">
                            <img 
                              src={ad.image} 
                              alt={ad.title}
                              className="w-20 h-20 rounded object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{ad.title}</h3>
                                  <p className="text-sm text-muted-foreground">{ad.description}</p>
                                </div>
                                <Badge variant="secondary">{ad.platform}</Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{ad.competitor}</span>
                                <span>•</span>
                                <span>{ad.engagement.toLocaleString()} engagements</span>
                                <span>•</span>
                                <span>${ad.spend.toLocaleString()} spent</span>
                                <span>•</span>
                                <span>{ad.ctr}% CTR</span>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline">{ad.cta}</Button>
                                <Button size="sm" variant="ghost">Analyze</Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-4">Platform Distribution</h3>
                  {analytics && (
                    <div className="space-y-3">
                      {Object.entries(analytics.byPlatform).map(([platform, count]) => (
                        <div key={platform} className="flex items-center justify-between p-3 bg-muted/20 rounded">
                          <span className="font-medium">{platform}</span>
                          <span className="text-lg font-bold">{count} ads</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-4">Export Data</h3>
                  <div className="space-y-4">
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
