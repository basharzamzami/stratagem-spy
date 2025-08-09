
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Eye, 
  AlertTriangle, 
  Brain, 
  Target, 
  Palette,
  Zap
} from 'lucide-react';
import { CreativeDNA } from '@/services/creativeDNAAnalyzer';

interface EnhancedSpikeTooltipProps {
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
  creativeDNA?: CreativeDNA | null;
  onClose: () => void;
  onViewSnapshot: (adId: string) => void;
  onViewFullPreview: (adId: string) => void;
}

const EnhancedSpikeTooltip: React.FC<EnhancedSpikeTooltipProps> = ({ 
  data, 
  creativeDNA,
  onClose, 
  onViewSnapshot,
  onViewFullPreview
}) => {
  const getHookTypeColor = (hookType: CreativeDNA['hook_type']) => {
    const colors = {
      curiosity: 'text-blue-400',
      fear: 'text-red-400',
      status: 'text-purple-400',
      urgency: 'text-orange-400',
      social_proof: 'text-green-400',
      scarcity: 'text-yellow-400'
    };
    return colors[hookType] || 'text-gray-400';
  };

  return (
    <Card className="absolute z-50 bg-card/95 backdrop-blur-sm border-2 border-red-500/50 shadow-xl min-w-[380px] max-w-[420px]">
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

        {creativeDNA && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Brain className="w-4 h-4 text-primary" />
                Creative DNA Insights
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span className="text-muted-foreground">Hook:</span>
                  <span className={getHookTypeColor(creativeDNA.hook_type)}>
                    {creativeDNA.hook_type.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span className="text-muted-foreground">Tone:</span>
                  <span className="text-cyan-400">{creativeDNA.tone}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  <span className="text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    {creativeDNA.color_palette.slice(0, 3).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-muted-foreground">Triggers:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {creativeDNA.psychological_triggers.slice(0, 2).map((trigger, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs h-4 px-1">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewSnapshot(data.ad_id)}
            className="flex-1"
          >
            <Eye className="w-3 h-3 mr-1" />
            Quick View
          </Button>
          <Button 
            size="sm" 
            onClick={() => onViewFullPreview(data.ad_id)}
            className="flex-1"
          >
            <Brain className="w-3 h-3 mr-1" />
            Full Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSpikeTooltip;
