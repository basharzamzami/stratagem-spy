
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, CheckSquare, FolderOpen, Users, Settings, Play, Pause } from 'lucide-react';
import CampaignOverview from './CampaignOverview';
import CampaignTasks from './CampaignTasks';
import CampaignAssets from './CampaignAssets';
import CampaignLeads from './CampaignLeads';

interface CampaignDetailViewProps {
  campaignId: string;
  onBack: () => void;
}

// Mock campaign data
const mockCampaignData = {
  '1': {
    id: '1',
    name: 'Local Service Ads - Miami',
    platform: 'Google',
    status: 'Active' as const,
    budget: 2500,
    spend: 1847,
    impressions: 45230,
    clicks: 892,
    conversions: 47,
    roas: 3.2,
    description: 'Targeting local Miami homeowners for HVAC services with geo-specific messaging.'
  },
  '2': {
    id: '2',
    name: 'Facebook Lead Gen Campaign',
    platform: 'Meta',
    status: 'Active' as const,
    budget: 1800,
    spend: 1654,
    impressions: 67450,
    clicks: 1234,
    conversions: 89,
    roas: 4.1,
    description: 'Lead generation campaign targeting high-intent homeowners in South Florida.'
  },
  '3': {
    id: '3',
    name: 'YouTube Brand Awareness',
    platform: 'YouTube',
    status: 'Paused' as const,
    budget: 3000,
    spend: 987,
    impressions: 125600,
    clicks: 445,
    conversions: 12,
    roas: 1.8,
    description: 'Brand awareness video campaign showcasing expertise and testimonials.'
  }
};

const CampaignDetailView = ({ campaignId, onBack }: CampaignDetailViewProps) => {
  const campaign = mockCampaignData[campaignId as keyof typeof mockCampaignData];
  
  if (!campaign) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Campaign not found</h2>
        <Button onClick={onBack}>Back to Campaigns</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success/20 text-success border-success/30';
      case 'Paused':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Google':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Meta':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'YouTube':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-card-foreground">{campaign.name}</h1>
                <Badge variant="outline" className={getPlatformColor(campaign.platform)}>
                  {campaign.platform}
                </Badge>
                <Badge variant="outline" className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <p className="text-card-foreground/70">{campaign.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button>
                {campaign.status === 'Active' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">${campaign.budget.toLocaleString()}</div>
              <div className="text-sm text-card-foreground/70">Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">${campaign.spend.toLocaleString()}</div>
              <div className="text-sm text-card-foreground/70">Spend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">{campaign.impressions.toLocaleString()}</div>
              <div className="text-sm text-card-foreground/70">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">{campaign.conversions}</div>
              <div className="text-sm text-card-foreground/70">Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">{campaign.roas}x</div>
              <div className="text-sm text-card-foreground/70">ROAS</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Detail Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CampaignOverview campaign={campaign} />
        </TabsContent>

        <TabsContent value="tasks">
          <CampaignTasks campaignId={campaignId} />
        </TabsContent>

        <TabsContent value="assets">
          <CampaignAssets campaignId={campaignId} />
        </TabsContent>

        <TabsContent value="leads">
          <CampaignLeads campaignId={campaignId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetailView;
