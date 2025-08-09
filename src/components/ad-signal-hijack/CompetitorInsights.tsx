
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Target, 
  ExternalLink,
  AlertTriangle
} from "lucide-react";

interface CompetitorData {
  name: string;
  adCount: number;
  estimatedSpend: number;
  platforms: string[];
  dominantStrategy: string;
  trend: 'up' | 'down' | 'stable';
}

interface CompetitorInsightsProps {
  competitors?: CompetitorData[];
}

export default function CompetitorInsights({ competitors = [] }: CompetitorInsightsProps) {
  const mockCompetitors: CompetitorData[] = [
    {
      name: "TechCorp Solutions",
      adCount: 156,
      estimatedSpend: 12500,
      platforms: ["Meta", "Google"],
      dominantStrategy: "Free Trial",
      trend: 'up'
    },
    {
      name: "Digital Innovate",
      adCount: 89,
      estimatedSpend: 8200,
      platforms: ["Meta", "YouTube"],
      dominantStrategy: "Case Studies",
      trend: 'down'
    },
    {
      name: "SaaS Masters",
      adCount: 234,
      estimatedSpend: 18900,
      platforms: ["Google", "Meta", "YouTube"],
      dominantStrategy: "Demo Booking",
      trend: 'up'
    }
  ];

  const displayCompetitors = competitors.length > 0 ? competitors : mockCompetitors;
  const maxSpend = Math.max(...displayCompetitors.map(c => c.estimatedSpend));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-success" />;
      case 'down': return <AlertTriangle className="w-3 h-3 text-destructive" />;
      default: return <Target className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Top Competitors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayCompetitors.map((competitor, index) => (
          <div key={competitor.name} className="space-y-3 p-4 border rounded-lg hover:shadow-sm transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-medium text-foreground">{competitor.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {competitor.adCount} ads • {competitor.platforms.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(competitor.trend)}
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Spend Visualization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Est. Daily Spend</span>
                <span className={`font-medium ${getTrendColor(competitor.trend)}`}>
                  ${competitor.estimatedSpend.toLocaleString()}/day
                </span>
              </div>
              <Progress 
                value={(competitor.estimatedSpend / maxSpend) * 100} 
                className="h-2"
              />
            </div>

            {/* Strategy & Platforms */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {competitor.dominantStrategy}
                </Badge>
              </div>
              <div className="flex gap-1">
                {competitor.platforms.map(platform => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t text-center">
              <div>
                <div className="text-sm font-medium">{competitor.adCount}</div>
                <div className="text-xs text-muted-foreground">Active Ads</div>
              </div>
              <div>
                <div className="text-sm font-medium">
                  ${Math.round(competitor.estimatedSpend / competitor.adCount)}
                </div>
                <div className="text-xs text-muted-foreground">Cost/Ad</div>
              </div>
              <div>
                <div className="text-sm font-medium">{competitor.platforms.length}</div>
                <div className="text-xs text-muted-foreground">Platforms</div>
              </div>
            </div>
          </div>
        ))}

        {/* View All Button */}
        <Button variant="outline" className="w-full" size="sm">
          View All Competitors
        </Button>
      </CardContent>
    </Card>
  );
}
