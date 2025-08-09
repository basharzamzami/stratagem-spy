
import { useState } from 'react';
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

interface Campaign {
  id: string;
  name: string;
  platform: 'Google' | 'Meta' | 'YouTube' | 'TikTok';
  status: 'Active' | 'Paused' | 'Draft';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  trend: 'up' | 'down' | 'stable';
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Local Service Ads - Miami',
    platform: 'Google',
    status: 'Active',
    budget: 2500,
    spend: 1847,
    impressions: 45230,
    clicks: 892,
    conversions: 47,
    roas: 3.2,
    trend: 'up'
  },
  {
    id: '2',
    name: 'Facebook Lead Gen Campaign',
    platform: 'Meta',
    status: 'Active',
    budget: 1800,
    spend: 1654,
    impressions: 67450,
    clicks: 1234,
    conversions: 89,
    roas: 4.1,
    trend: 'up'
  },
  {
    id: '3',
    name: 'YouTube Brand Awareness',
    platform: 'YouTube',
    status: 'Paused',
    budget: 3000,
    spend: 987,
    impressions: 125600,
    clicks: 445,
    conversions: 12,
    roas: 1.8,
    trend: 'down'
  }
];

interface CampaignListProps {
  onCampaignSelect?: (campaignId: string) => void;
}

const CampaignList = ({ onCampaignSelect }: CampaignListProps) => {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success/20 text-success border-success/30';
      case 'Paused':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Draft':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
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
      case 'TikTok':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Active Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
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
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="font-medium text-card-foreground">{campaign.name}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPlatformColor(campaign.platform)}>
                    {campaign.platform}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-card-foreground">
                  ${campaign.budget.toLocaleString()}
                </TableCell>
                <TableCell className="text-card-foreground">
                  ${campaign.spend.toLocaleString()}
                </TableCell>
                <TableCell className="text-card-foreground">
                  {campaign.impressions.toLocaleString()}
                </TableCell>
                <TableCell className="text-card-foreground">
                  {campaign.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="text-card-foreground">
                  {campaign.conversions}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-card-foreground">{campaign.roas}x</span>
                    {campaign.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                    {campaign.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onCampaignSelect && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onCampaignSelect(campaign.id)}
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
                          {campaign.status === 'Active' ? (
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
      </CardContent>
    </Card>
  );
};

export default CampaignList;
