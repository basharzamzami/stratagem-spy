
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, MoreHorizontal, Play, Pause, Edit, Trash2, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ApiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Campaign } from '@/backend/types';

interface CampaignListProps {
  onCampaignSelect: (campaignId: string) => void;
}

export default function CampaignList({ onCampaignSelect }: CampaignListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const { toast } = useToast();

  const { data: campaignsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['campaigns', statusFilter, channelFilter],
    queryFn: () => ApiClient.getCampaigns({
      status: statusFilter === 'all' ? undefined : statusFilter,
      channel: channelFilter === 'all' ? undefined : channelFilter
    }),
  });

  const campaigns: Campaign[] = Array.isArray(campaignsResponse?.data) 
    ? (campaignsResponse.data as Campaign[])
    : [];

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.channel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Campaign action handlers
  const handleCreateCampaign = () => {
    toast({
      title: "Creating New Campaign",
      description: "Opening campaign creation wizard..."
    });
    // In a real app, this would open a modal or navigate to a creation form
  };

  const handlePlayCampaign = async (campaignId: number, campaignName: string) => {
    try {
      toast({
        title: "Starting Campaign",
        description: `Activating campaign: ${campaignName}`
      });
      // In a real app, this would make an API call to start the campaign
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      refetch();
      toast({
        title: "Campaign Started",
        description: `${campaignName} is now active`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start campaign",
        variant: "destructive"
      });
    }
  };

  const handlePauseCampaign = async (campaignId: number, campaignName: string) => {
    try {
      toast({
        title: "Pausing Campaign",
        description: `Pausing campaign: ${campaignName}`
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      refetch();
      toast({
        title: "Campaign Paused",
        description: `${campaignName} has been paused`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pause campaign",
        variant: "destructive"
      });
    }
  };

  const handleEditCampaign = (campaignId: number, campaignName: string) => {
    toast({
      title: "Opening Campaign Editor",
      description: `Editing campaign: ${campaignName}`
    });
    onCampaignSelect(String(campaignId));
  };

  const handleDeleteCampaign = async (campaignId: number, campaignName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${campaignName}"?`);
    if (confirmed) {
      try {
        toast({
          title: "Deleting Campaign",
          description: `Removing campaign: ${campaignName}`
        });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        refetch();
        toast({
          title: "Campaign Deleted",
          description: `${campaignName} has been deleted`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete campaign",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completed</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-muted-foreground">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive font-medium mb-2">Failed to load campaigns</div>
        <p className="text-muted-foreground mb-4">There was an error connecting to the campaign management system.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-card-foreground">Campaign Management</CardTitle>
            <Button onClick={handleCreateCampaign} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="meta">Facebook</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-card-foreground font-medium">Campaign</TableHead>
                  <TableHead className="text-card-foreground font-medium">Status</TableHead>
                  <TableHead className="text-card-foreground font-medium">Channel</TableHead>
                  <TableHead className="text-card-foreground font-medium text-right">Spent</TableHead>
                  <TableHead className="text-card-foreground font-medium text-right">ROAS</TableHead>
                  <TableHead className="text-card-foreground font-medium text-right">Conversions</TableHead>
                  <TableHead className="text-card-foreground font-medium w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell colSpan={7}>
                        <div className="flex items-center space-x-4">
                          <div className="h-4 bg-muted rounded animate-pulse flex-1"></div>
                          <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                          <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' || channelFilter !== 'all' 
                        ? 'No campaigns match your filters' 
                        : 'No campaigns created yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <TableRow 
                      key={campaign.id} 
                      className="border-border cursor-pointer hover:bg-muted/30"
                      onClick={() => onCampaignSelect(String(campaign.id))}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-card-foreground">{campaign.name}</div>
                          {campaign.description && (
                            <div className="text-sm text-card-foreground/70 truncate max-w-md">
                              {campaign.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell className="text-card-foreground/70 capitalize">
                        {campaign.channel || '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${(campaign.spent || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {campaign.kpis?.roas ? `${campaign.kpis.roas.toFixed(1)}x` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {campaign.kpis?.conversions || 0}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            {campaign.status === 'active' ? (
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePauseCampaign(campaign.id, campaign.name);
                                }}
                                className="hover:bg-accent"
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                Pause Campaign
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayCampaign(campaign.id, campaign.name);
                                }}
                                className="hover:bg-accent"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Start Campaign
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCampaign(campaign.id, campaign.name);
                              }}
                              className="hover:bg-accent"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCampaign(campaign.id, campaign.name);
                              }}
                              className="hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Campaign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
