
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Settings, BarChart3, Play, Pause, Plus } from 'lucide-react';
import CampaignList from './CampaignList';
import CampaignAutomation from './CampaignAutomation';
import CampaignAnalytics from './CampaignAnalytics';
import CampaignSettings from './CampaignSettings';
import CampaignDetailView from './CampaignDetailView';

const CampaignDashboard = () => {
  const [activeCampaigns, setActiveCampaigns] = useState(12);
  const [totalSpend, setTotalSpend] = useState(24850);
  const [averageRoas, setAverageRoas] = useState(3.2);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
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
              <div className="text-2xl font-bold text-card-foreground">{averageRoas}x</div>
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
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
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

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignList onCampaignSelect={handleCampaignSelect} />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <CampaignAutomation />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <CampaignAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <CampaignSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDashboard;
