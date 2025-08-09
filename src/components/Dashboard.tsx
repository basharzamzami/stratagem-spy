
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Target, 
  TrendingUp, 
  Users, 
  Eye, 
  Bell, 
  Zap, 
  ArrowRight,
  Activity,
  Database,
  AlertTriangle
} from 'lucide-react';
import { ApiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch dashboard analytics
  const { data: adAnalytics } = useQuery({
    queryKey: ['ad-analytics-dashboard'],
    queryFn: () => ApiClient.getAdAnalytics()
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts-dashboard'],
    queryFn: () => ApiClient.getAlerts({ severity: 'high' })
  });

  const { data: campaigns } = useQuery({
    queryKey: ['campaigns-dashboard'],
    queryFn: () => ApiClient.getCampaigns({ status: 'active' })
  });

  // Action button handlers
  const handleViewLiveFeed = () => {
    toast({
      title: "Opening Live Ad Feed",
      description: "Redirecting to real-time competitor ad monitoring..."
    });
    navigate('/ad-signal-hijack');
  };

  const handleViewPipeline = () => {
    toast({
      title: "Opening Lead Pipeline",
      description: "Accessing competitive CRM and lead management..."
    });
    navigate('/competitive-crm');
  };

  const handleReviewAlerts = () => {
    toast({
      title: "Opening Intelligence Alerts",
      description: "Reviewing competitor change notifications..."
    });
    navigate('/change-alerts');
  };

  const handleGenerateTasks = () => {
    toast({
      title: "Opening AI Task Generator",
      description: "Accessing actionable intelligence tasks..."
    });
    navigate('/task-generator');
  };

  const handleViewDominanceMap = () => {
    toast({
      title: "Opening Dominance Map",
      description: "Analyzing market territory and competitive positioning..."
    });
    navigate('/dominance-map');
  };

  const handleLeadLocator = () => {
    toast({
      title: "Opening Lead Locator",
      description: "Accessing prospect identification system..."
    });
    navigate('/lead-locator');
  };

  const handleCampaignManager = () => {
    toast({
      title: "Opening Campaign Manager",
      description: "Accessing automated campaign management..."
    });
    navigate('/campaign-manager');
  };

  // Extract analytics data
  const adsCount = adAnalytics?.data?.total_ads || 1543;
  const alertsCount = alerts?.data?.length || 17;
  const activeCampaigns = campaigns?.data?.length || 12;
  const avgRoas = adAnalytics?.data?.avg_roas || 3.2;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Specter Intelligence Nexus</h1>
            <p className="text-muted-foreground">Advanced competitive intelligence & market domination platform</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-success/5 border-success/20 cursor-pointer hover:bg-success/10 transition-colors" 
                onClick={handleViewLiveFeed}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Live Ads Tracked</div>
                <div className="text-xl font-bold text-success">{adsCount.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20 cursor-pointer hover:bg-red-500/10 transition-colors" 
                onClick={handleReviewAlerts}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
                <div className="text-xl font-bold text-red-400">{alertsCount}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors" 
                onClick={handleCampaignManager}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Campaigns</div>
                <div className="text-xl font-bold text-primary">{activeCampaigns}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-500/5 border-yellow-500/20 cursor-pointer hover:bg-yellow-500/10 transition-colors" 
                onClick={handleViewPipeline}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg ROAS</div>
                <div className="text-xl font-bold text-yellow-400">{avgRoas}x</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex-shrink-0 p-6 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={handleViewLiveFeed}
            className="h-14 flex items-center justify-between bg-primary hover:bg-primary/90"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">View Live Feed</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button 
            onClick={handleViewPipeline}
            variant="outline"
            className="h-14 flex items-center justify-between hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5" />
              <span className="font-semibold">View Pipeline</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button 
            onClick={handleReviewAlerts}
            variant="outline"
            className="h-14 flex items-center justify-between hover:bg-accent border-red-500/30 text-red-400 hover:text-red-300"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <span className="font-semibold">Review Alerts</span>
              <Badge className="bg-red-500/20 text-red-400">{alertsCount}</Badge>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button 
            onClick={handleGenerateTasks}
            variant="outline"
            className="h-14 flex items-center justify-between hover:bg-accent border-primary/30"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Generate Tasks</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Intelligence Overview</TabsTrigger>
            <TabsTrigger value="modules">Core Modules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Real-time Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Intelligence Engine</span>
                    <Badge className="bg-success/20 text-success">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data Collection</span>
                    <Badge className="bg-success/20 text-success">LIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI Processing</span>
                    <Badge className="bg-primary/20 text-primary">PROCESSING</Badge>
                  </div>
                  <Button 
                    onClick={() => navigate('/settings')} 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Threats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Threat Detection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Latest competitive threats detected:
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs p-2 bg-red-500/10 rounded border border-red-500/20">
                      SimilarWeb ad spend surge: +45%
                    </div>
                    <div className="text-xs p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      New Ahrefs campaign detected
                    </div>
                  </div>
                  <Button 
                    onClick={handleReviewAlerts} 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    View All Threats
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={handleViewDominanceMap} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Dominance Analysis
                  </Button>
                  <Button 
                    onClick={handleLeadLocator} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Find Prospects
                  </Button>
                  <Button 
                    onClick={handleGenerateTasks} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Generate Tasks
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card 
                className="bg-card border-border cursor-pointer hover:bg-accent transition-colors" 
                onClick={handleViewLiveFeed}
              >
                <CardContent className="p-6 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Ad Signal Hijack</h3>
                  <p className="text-sm text-muted-foreground mb-4">Real-time ad intelligence</p>
                  <Badge className="bg-success/20 text-success">34 Live</Badge>
                </CardContent>
              </Card>

              <Card 
                className="bg-card border-border cursor-pointer hover:bg-accent transition-colors" 
                onClick={handleLeadLocator}
              >
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Lead Locator</h3>
                  <p className="text-sm text-muted-foreground mb-4">Prospect identification</p>
                  <Badge className="bg-primary/20 text-primary">156 Found</Badge>
                </CardContent>
              </Card>

              <Card 
                className="bg-card border-border cursor-pointer hover:bg-accent transition-colors" 
                onClick={handleViewDominanceMap}
              >
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Dominance Map</h3>
                  <p className="text-sm text-muted-foreground mb-4">Territory analysis</p>
                  <Badge className="bg-yellow-500/20 text-yellow-400">Analyzing</Badge>
                </CardContent>
              </Card>

              <Card 
                className="bg-card border-border cursor-pointer hover:bg-accent transition-colors" 
                onClick={handleCampaignManager}
              >
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Campaign Manager</h3>
                  <p className="text-sm text-muted-foreground mb-4">Automated campaigns</p>
                  <Badge className="bg-success/20 text-success">12 Active</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics Dashboard</h3>
              <p className="text-muted-foreground mb-4">Comprehensive intelligence analytics and reporting</p>
              <Button onClick={() => navigate('/ad-signal-hijack')}>
                View Analytics
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Competitive Threat Analysis</h3>
              <p className="text-muted-foreground mb-4">Real-time monitoring and threat assessment</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleReviewAlerts} variant="destructive">
                  Review Threats
                </Button>
                <Button onClick={handleGenerateTasks} variant="outline">
                  Generate Response Tasks
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
