
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Eye, Bell, Zap, Users, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="h-full w-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Specter Insights Dashboard</h1>
        <p className="text-muted-foreground">Competitive intelligence & reverse engineering platform</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Active Targets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">247</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Live Ads Tracked</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">1,543</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1 text-primary" />
              Real-time monitoring
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Warm Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">89</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              +23% conversion rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Revenue Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">$124K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              +45% this quarter
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground">Ad Signal Hijack</CardTitle>
              <Badge className="bg-success/20 text-success border-success/30">
                <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Real-time competitor ad tracking & reverse engineering. Decode winning creative hooks and offers.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ads Analyzed Today:</span>
              <span className="font-medium text-card-foreground">342</span>
            </div>
            <Button className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View Live Feed
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground">Lead Locator</CardTitle>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              AI-powered warm lead detection from multiple intent signals and behavioral patterns.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New Leads Today:</span>
              <span className="font-medium text-card-foreground">23</span>
            </div>
            <Button className="w-full" variant="outline">
              <Target className="w-4 h-4 mr-2" />
              View Pipeline
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground">Change Alerts</CardTitle>
              <Badge className="bg-warning/20 text-warning border-warning/30">
                <Bell className="w-3 h-3 mr-1" />
                17 New
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Real-time notifications when competitors change strategies, pricing, or launch new campaigns.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Critical Alerts:</span>
              <span className="font-medium text-warning">3</span>
            </div>
            <Button className="w-full" variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Review Alerts
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground">Task Generator</CardTitle>
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Automatically generate prioritized marketing tasks based on competitive intelligence insights.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending Tasks:</span>
              <span className="font-medium text-card-foreground">12</span>
            </div>
            <Button className="w-full" variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Generate Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">Recent Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm text-card-foreground">New competitor ad detected: "50% Off Holiday Sale"</span>
              </div>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-card-foreground">Warm lead identified: High-intent search behavior</span>
              </div>
              <span className="text-xs text-muted-foreground">8 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span className="text-sm text-card-foreground">Competitor changed pricing structure</span>
              </div>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
