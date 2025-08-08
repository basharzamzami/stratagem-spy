
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, Copy, TrendingUp } from 'lucide-react';

interface AdCardProps {
  competitor: string;
  platform: string;
  headline: string;
  description: string;
  cta: string;
  status: string;
  spend: string;
  impressions: string;
  engagement: string;
}

const AdCard = ({ 
  competitor, 
  platform, 
  headline, 
  description, 
  cta, 
  status, 
  spend, 
  impressions, 
  engagement 
}: AdCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{competitor}</h3>
              <p className="text-sm text-muted-foreground">{platform}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Ad Preview */}
        <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
          <h4 className="font-semibold text-foreground mb-2">{headline}</h4>
          <p className="text-sm text-foreground/80 mb-3">{description}</p>
          <Button size="sm" variant="outline" className="text-xs">
            {cta}
          </Button>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Daily Spend</p>
            <p className="font-semibold text-foreground">{spend}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Impressions</p>
            <p className="font-semibold text-foreground">{impressions}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="font-semibold text-foreground">{engagement}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View Full Ad
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy Strategy
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdCard;
