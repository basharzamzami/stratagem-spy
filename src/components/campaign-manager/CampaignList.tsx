
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Pause, Edit, MoreHorizontal, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApiClient } from '@/services/api';

interface CampaignListProps {
  onCampaignSelect?: (campaignId: string) => void;
}

const CampaignList = ({ onCampaignSelect }: CampaignListProps) => {
  // Fetch campaigns from backend
  const { data: campaignsResponse, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => ApiClient.getCampaigns(),
  });

  const campaigns = campaignsResponse?.data || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success/20 text-success border-success/30';
      case 'paused':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'draft':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getPlatformColor = (channel: string) => {
    switch (channel?.toLowerCase()) {
      case 'google':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'meta':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'youtube':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'tiktok':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-destructive font-medium mb-2">Failed to load campaigns</div>
            <p className="text-card-foreground/70">Unable to fetch campaign data from server.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Active Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-card-foreground/70">No campaigns found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>ROAS</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign: any) => (
                <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium text-card-foreground">{campaign.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPlatformColor(campaign.channel)}>
                      {campaign.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {formatCurrency(campaign.budget)}
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {formatCurrency(campaign.spent)}
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {campaign.kpis?.impressions?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {campaign.kpis?.clicks?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {campaign.kpis?.conversions || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-card-foreground">
                        {campaign.kpis?.roas?.toFixed(1) || '0.0'}x
                      </span>
                      {campaign.kpis?.roas > 3 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : campaign.kpis?.roas < 2 ? (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onCampaignSelect && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onCampaignSelect(campaign.id.toString())}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                            {campaign.status === 'active' ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Campaign
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Start Campaign
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignList;
