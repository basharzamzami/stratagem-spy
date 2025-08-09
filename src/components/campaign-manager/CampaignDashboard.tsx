
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Settings, BarChart3, Play, Pause, Plus } from 'lucide-react';
import { ApiClient } from '@/services/api';
import CampaignList from './CampaignList';
import CampaignAutomation from './CampaignAutomation';
import CampaignAnalytics from './CampaignAnalytics';
import CampaignSettings from './CampaignSettings';
import CampaignDetailView from './CampaignDetailView';

const CampaignDashboard = () => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  // Fetch campaigns from the backend
  const { data: campaignsResponse, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => ApiClient.getCampaigns(),
  });

  // Calculate metrics from the actual data
  const campaigns = campaignsResponse?.data || [];
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
  const totalSpend = campaigns.reduce((sum: number, c: any) => sum + (c.spent || 0), 0);
  const averageRoas = campaigns.length > 0 
    ? campaigns.reduce((sum: number, c: any) => sum + (c.kpis?.roas || 0), 0) / campaigns.length 
    : 0;

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  const handleBackToList = () => {
    setSelectedCampaignId(null);
  };

  // If a campaign is selected, show the detail view
  if (selectedCampaignId) {
    return (
      <CampaignDetailView 
        campaignId={selectedCampaignId} 
        onBack={handleBackToList}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-card-foreground/70">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive font-medium mb-2">Failed to load campaigns</div>
        <p className="text-card-foreground/70 mb-4">There was an error connecting to the campaign management system.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{activeCampaigns}</div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">${totalSpend.toLocaleString()}</div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                This Month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Average ROAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{averageRoas.toFixed(1)}x</div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Automation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-success/20 text-success border-success/30">
                <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                Active
              </Badge>
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-4">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
        <Button variant="outline">
          <Play className="w-4 h-4 mr-2" />
          Start Automation
        </Button>
        <Button variant="outline">
          <Pause className="w-4 h-4 mr-2" />
          Pause All
        </Button>
      </div>

      {/* Main Content Tabs */}
      <div className="flex-1">
        <Tabs defaultValue="campaigns" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="campaigns" className="h-full">
              <CampaignList onCampaignSelect={handleCampaignSelect} />
            </TabsContent>

            <TabsContent value="automation" className="h-full">
              <CampaignAutomation />
            </TabsContent>

            <TabsContent value="analytics" className="h-full">
              <CampaignAnalytics />
            </TabsContent>

            <TabsContent value="settings" className="h-full">
              <CampaignSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignDashboard;
