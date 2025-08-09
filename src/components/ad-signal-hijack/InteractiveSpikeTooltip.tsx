
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, AlertTriangle } from 'lucide-react';

interface SpikeTooltipProps {
  data: {
    ad_id: string;
    platform: string;
    competitor: string;
    impressions: number;
    clicks: number;
    likes?: number;
    comments?: number;
    shares?: number;
    timestamp: string;
  };
  onClose: () => void;
  onViewSnapshot: (adId: string) => void;
}

const InteractiveSpikeTooltip: React.FC<SpikeTooltipProps> = ({ 
  data, 
  onClose, 
  onViewSnapshot 
}) => {
  const handleOpenMockUrl = () => {
    const mockUrl = `https://example.com/ads/${data.ad_id}`;
    window.open(mockUrl, '_blank');
    console.log(`Opening mock URL: ${mockUrl}`);
  };

  return (
    <Card className="absolute z-50 bg-card/95 backdrop-blur-sm border-2 border-red-500/50 shadow-xl min-w-[320px]">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Spike Detected
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">
            Ad ID: <span className="text-primary">{data.ad_id}</span>
          </div>
          <div className="text-sm">
            Platform: <span className="text-blue-400">{data.platform}</span>
          </div>
          <div className="text-sm">
            Competitor: <span className="text-orange-400">{data.competitor}</span>
          </div>
          <div className="text-sm">
            Time: <span className="text-muted-foreground">{data.timestamp}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Impressions: <span className="text-blue-400 font-medium">{data.impressions.toLocaleString()}</span></div>
          <div>Clicks: <span className="text-green-400 font-medium">{data.clicks.toLocaleString()}</span></div>
          {data.likes !== undefined && (
            <div>Likes: <span className="text-red-400">{data.likes}</span></div>
          )}
          {data.comments !== undefined && (
            <div>Comments: <span className="text-yellow-400">{data.comments}</span></div>
          )}
          {data.shares !== undefined && (
            <div>Shares: <span className="text-purple-400">{data.shares}</span></div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewSnapshot(data.ad_id)}
            className="flex-1"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Snapshot
          </Button>
          <Button 
            size="sm" 
            onClick={handleOpenMockUrl}
            className="flex-1"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open Ad
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveSpikeTooltip;
