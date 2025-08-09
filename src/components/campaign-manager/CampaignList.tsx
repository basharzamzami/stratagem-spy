
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, MoreHorizontal, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ApiClient } from '@/services/api';
import type { Campaign } from '@/backend/types';
import { useState } from 'react';

interface CampaignListProps {
  onCampaignSelect?: (campaignId: string) => void;
}

const CampaignList = ({ onCampaignSelect }: CampaignListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

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
      case 'completed':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'google ads':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'facebook':
        return 'bg-blue-600/20 text-blue-600 border-blue-600/30';
      case 'linkedin':
        return 'bg-blue-700/20 text-blue-700 border-blue-700/30';
      case 'email':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
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
    <div className="w-full max-w-full space-y-4 overflow-hidden">
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
                  <SelectItem value="google ads">Google Ads</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
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
                  <TableHead className="text-card-foreground font-medium text-right">Leads</TableHead>
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
                      <div className="text-xs text-card-foreground/60">{campaign.channel} Campaign</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getChannelColor(campaign.channel)}>
                        {campaign.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${(campaign.spent || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {campaign.kpis?.roas ? `${campaign.kpis.roas.toFixed(1)}x` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {campaign.kpis?.leads || 0}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Start Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
              <Button>
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
