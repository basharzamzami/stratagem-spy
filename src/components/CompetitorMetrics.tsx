
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Eye, Zap } from 'lucide-react';

const CompetitorMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">847</div>
          <div className="flex items-center text-xs text-success">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% from yesterday
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Ads (24h)</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">156</div>
          <div className="flex items-center text-xs text-success">
            <TrendingUp className="w-3 h-3 mr-1" />
            +34% from yesterday
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ad Spend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">$2.4M</div>
          <div className="flex items-center text-xs text-destructive">
            <TrendingDown className="w-3 h-3 mr-1" />
            -8% from yesterday
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">3.2%</div>
          <div className="flex items-center text-xs text-success">
            <TrendingUp className="w-3 h-3 mr-1" />
            +0.4% from yesterday
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorMetrics;
