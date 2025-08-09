import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Settings, BarChart3, Play, Pause, Plus } from 'lucide-react';
import { ApiClient } from '@/services/api';
import type { Campaign } from '@/backend/types';
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

  // Calculate metrics from the actual data with proper type checking
  const campaigns: Campaign[] = Array.isArray(campaignsResponse?.data) 
    ? (campaignsResponse.data as Campaign[])
    : [];
  const activeCampaigns = campaigns.filter((c: Campaign) => c.status === 'active').length;
  const totalSpend = campaigns.reduce((sum: number, c: Campaign) => sum + (c.spent || 0), 0);
  const averageRoas = campaigns.length > 0 
    ? campaigns.reduce((sum: number, c: Campaign) => sum + (c.kpis?.roas || 0), 0) / campaigns.length 
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
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
      <div className="flex flex-wrap items-center gap-3">
        <Button className="bg-primary hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
        <Button variant="outline" size="sm">
          <Play className="w-4 h-4 mr-2" />
          Start Automation
        </Button>
        <Button variant="outline" size="sm">
          <Pause className="w-4 h-4 mr-2" />
          Pause All
        </Button>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns" className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2 text-xs">
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Automation</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs">
            <BarChart3 className="w-3 h-3" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 text-xs">
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 w-full overflow-hidden">
          <TabsContent value="campaigns" className="mt-0 w-full">
            <div className="w-full overflow-hidden">
              <CampaignList onCampaignSelect={handleCampaignSelect} />
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-0 w-full">
            <div className="w-full overflow-hidden">
              <CampaignAutomation />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 w-full">
            <div className="w-full overflow-hidden">
              <CampaignAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 w-full">
            <div className="w-full overflow-hidden">
              <CampaignSettings />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CampaignDashboard;
