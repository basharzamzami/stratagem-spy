
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MoreVertical, Play, Pause, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApiClient } from '@/services/api';
import type { Campaign } from '@/backend/types';

interface CampaignListProps {
  onCampaignSelect?: (campaignId: string) => void;
}

const CampaignList = ({ onCampaignSelect }: CampaignListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: campaignsResponse, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => ApiClient.getCampaigns(),
  });

  // Ensure campaigns is always an array
  const campaigns: Campaign[] = Array.isArray(campaignsResponse?.data) 
    ? (campaignsResponse.data as Campaign[])
    : [];

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

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.channel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-card-foreground/70">Loading campaigns...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">Error loading campaigns</div>
            <p className="text-card-foreground/70">Failed to fetch campaign data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!campaigns.length) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-card-foreground font-medium mb-2">No campaigns found</div>
            <p className="text-card-foreground/70 mb-4">Get started by creating your first campaign</p>
            <Button className="bg-primary hover:bg-primary/90">
              Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Active Campaigns ({campaigns.length})
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0 p-0">
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-card-foreground/70">Campaign</TableHead>
                <TableHead className="text-card-foreground/70">Status</TableHead>
                <TableHead className="text-card-foreground/70">Platform</TableHead>
                <TableHead className="text-card-foreground/70 text-right">Spent</TableHead>
                <TableHead className="text-card-foreground/70 text-right">ROAS</TableHead>
                <TableHead className="text-card-foreground/70 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign: Campaign) => (
                <TableRow 
                  key={campaign.id} 
                  className="cursor-pointer hover:bg-muted/50 border-border"
                  onClick={() => onCampaignSelect?.(campaign.id.toString())}
                >
                  <TableCell>
                    <div className="font-medium text-card-foreground">{campaign.name}</div>
                    <div className="text-xs text-card-foreground/60">{campaign.channel} Campaign</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(campaign.channel)}>
                      {campaign.channel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(campaign.spent || 0)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {campaign.kpis?.roas?.toFixed(1) || '0.0'}x
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                          {campaign.status === 'active' ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignList;
