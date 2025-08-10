
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Plus } from 'lucide-react';
import { ApiClient } from '@/services/api';
import type { Campaign } from '@/backend/types';
import { useToast } from '@/hooks/use-toast';
import CampaignList from './CampaignList';
import CampaignDetailView from './CampaignDetailView';
import CampaignCreateForm from './CampaignCreateForm';

const CampaignDashboard = () => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch campaigns from the backend
  const { data: campaignsResponse, isLoading, error, refetch } = useQuery({
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
    setShowCreateForm(false);
  };

  const handleCreateCampaign = () => {
    setShowCreateForm(true);
    setSelectedCampaignId(null);
  };

  const handleCampaignCreated = () => {
    setShowCreateForm(false);
    refetch();
  };

  // If showing create form, show that view
  if (showCreateForm) {
    return (
      <CampaignCreateForm 
        onBack={handleBackToList}
        onSuccess={handleCampaignCreated}
      />
    );
  }

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
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{activeCampaigns}</div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
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
                Good
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Button */}
      <div className="flex items-center gap-3">
        <Button 
          className="bg-primary hover:bg-primary/90 text-sm"
          onClick={handleCreateCampaign}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign List */}
      <div className="w-full overflow-hidden">
        <CampaignList 
          onCampaignSelect={handleCampaignSelect}
          onCreateCampaign={handleCreateCampaign}
        />
      </div>
    </div>
  );
};

export default CampaignDashboard;
