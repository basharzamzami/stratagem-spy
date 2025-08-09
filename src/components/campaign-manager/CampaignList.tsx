
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
import type { Campaign } from '@/backend/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CampaignListProps {
  onCampaignSelect?: (campaignId: string) => void;
}

const CampaignList = ({ onCampaignSelect }: CampaignListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: campaignsResponse, isLoading, error, refetch } = useQuery({
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
      case 'completed':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'google':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'meta':
        return 'bg-blue-600/20 text-blue-600 border-blue-600/30';
      case 'youtube':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'tiktok':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleCampaignAction = async (campaignId: number, action: 'play' | 'pause' | 'edit' | 'delete') => {
    try {
      switch (action) {
        case 'play':
          toast({
            title: "Campaign Started",
            description: "Campaign has been activated successfully."
          });
          break;
        case 'pause':
          toast({
            title: "Campaign Paused",
            description: "Campaign has been paused successfully."
          });
          break;
        case 'edit':
          navigate(`/campaign-manager/edit/${campaignId}`);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this campaign?')) {
            toast({
              title: "Campaign Deleted",
              description: "Campaign has been moved to trash."
            });
            await refetch();
          }
          break;
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error performing this action.",
        variant: "destructive"
      });
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-2">Failed to load campaigns</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Campaigns ({filteredCampaigns.length})
            </CardTitle>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="meta">Meta</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Campaign Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
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
                {filteredCampaigns.map((campaign) => (
                  <TableRow 
                    key={campaign.id} 
                    className="cursor-pointer hover:bg-muted/50 border-border"
                    onClick={() => onCampaignSelect?.(campaign.id.toString())}
                  >
                    <TableCell>
                      <div className="font-medium text-card-foreground">{campaign.name}</div>
                      <div className="text-xs text-card-foreground/60">
                        {campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)} Campaign
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getChannelColor(campaign.channel)}>
                        {campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)}
                      </Badge>
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
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'edit')}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'play')}>
                            <Play className="w-4 h-4 mr-2" />
                            Start Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'pause')}>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleCampaignAction(campaign.id, 'delete')}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No campaigns found</p>
              <Button onClick={() => navigate('/campaign-manager/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignList;
