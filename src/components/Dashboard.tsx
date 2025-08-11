import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdSignalHijackDashboard from './AdSignalHijackDashboard';
import AdSignalDashboard from './AdSignalDashboard';
import EnhancedAdSignalHijack from '@/pages/EnhancedAdSignalHijack';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Zap, 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Shield,
  Brain
} from 'lucide-react';

interface DashboardProps {
  activePanel?: string;
  onPanelChange?: (panel: string) => void;
}

const Dashboard = ({ activePanel = "specter-net", onPanelChange }: DashboardProps) => {
  const handleTabChange = (value: string) => {
    onPanelChange?.(value);
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-background">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Specter Insights Dashboard Nexus
            </h1>
            <p className="text-sm text-muted-foreground">
              Competitive intelligence & reverse engineering platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
              Live Intelligence Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex">
          {/* Main Dashboard Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Tabs value={activePanel} onValueChange={handleTabChange} className="h-full flex flex-col">
              {/* Tabs List - Fixed */}
              <div className="flex-shrink-0 px-6 py-3 bg-background border-b border-border">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="specter-net" className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4" />
                    <span className="hidden md:inline">Specter Net</span>
                    <span className="md:hidden">Net</span>
                  </TabsTrigger>
                  <TabsTrigger value="ad-signal-hijack" className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4" />
                    <span className="hidden md:inline">Ad Signal Hijack</span>
                    <span className="md:hidden">Hijack</span>
                  </TabsTrigger>
                  <TabsTrigger value="enhanced-hijack" className="flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4" />
                    <span className="hidden md:inline">Enhanced Hijack</span>
                    <span className="md:hidden">Enhanced</span>
                  </TabsTrigger>
                  <TabsTrigger value="ad-signal" className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" />
                    <span className="hidden md:inline">Ad Signal</span>
                    <span className="md:hidden">Signal</span>
                  </TabsTrigger>
                  <TabsTrigger value="market-intel" className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden md:inline">Market Intel</span>
                    <span className="md:hidden">Intel</span>
                  </TabsTrigger>
                  <TabsTrigger value="leads" className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span className="hidden md:inline">Leads</span>
                    <span className="md:hidden">Leads</span>
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden md:inline">Performance</span>
                    <span className="md:hidden">Perf</span>
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="hidden md:inline">Alerts</span>
                    <span className="md:hidden">Alerts</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content - Fills remaining space */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <TabsContent value="specter-net" className="h-full m-0 p-0">
                  <div className="h-full flex items-center justify-center p-6">
                    <Card className="w-full max-w-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Specter Net Intelligence Dashboard
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Real-time competitive intelligence monitoring and analysis platform.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <Brain className="w-8 h-8 text-primary mb-2" />
                            <h3 className="font-semibold mb-1">Intelligence Gathering</h3>
                            <p className="text-sm text-muted-foreground">Real-time competitor monitoring</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <Activity className="w-8 h-8 text-primary mb-2" />
                            <h3 className="font-semibold mb-1">Analysis Engine</h3>
                            <p className="text-sm text-muted-foreground">Advanced pattern recognition</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="ad-signal-hijack" className="h-full m-0 p-0">
                  <div className="h-full overflow-hidden">
                    <AdSignalHijackDashboard />
                  </div>
                </TabsContent>

                <TabsContent value="enhanced-hijack" className="h-full m-0 p-0">
                  <div className="h-full overflow-hidden">
                    <div className="h-full overflow-auto">
                      <EnhancedAdSignalHijack />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ad-signal" className="h-full m-0 p-0">
                  <div className="h-full overflow-hidden">
                    <AdSignalDashboard />
                  </div>
                </TabsContent>

                <TabsContent value="market-intel" className="h-full m-0 p-0">
                  <div className="h-full flex items-center justify-center p-6">
                    <Card className="w-full max-w-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Market Intelligence Hub
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Advanced competitive intelligence and market analysis tools for strategic advantage.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <Brain className="w-8 h-8 text-primary mb-2" />
                            <h3 className="font-semibold mb-1">Intelligence Gathering</h3>
                            <p className="text-sm text-muted-foreground">Real-time competitor monitoring</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <BarChart3 className="w-8 h-8 text-primary mb-2" />
                            <h3 className="font-semibold mb-1">Market Analysis</h3>
                            <p className="text-sm text-muted-foreground">Deep market insights & trends</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="leads" className="h-full m-0 p-0">
                  <div className="h-full flex items-center justify-center p-6">
                    <Card className="w-full max-w-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Lead Management System
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Warm lead detection and prospect management with AI-powered insights.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <Target className="w-8 h-8 text-success mb-2" />
                            <h3 className="font-semibold mb-1">Warm Detection</h3>
                            <p className="text-sm text-muted-foreground">AI-powered lead scoring</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <Activity className="w-8 h-8 text-success mb-2" />
                            <h3 className="font-semibold mb-1">Pipeline Management</h3>
                            <p className="text-sm text-muted-foreground">Automated prospect tracking</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="h-full m-0 p-0">
                  <div className="h-full flex items-center justify-center p-6">
                    <Card className="w-full max-w-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary" />
                          Performance Operations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Real-time business KPI dashboard and comprehensive performance tracking.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
                            <h3 className="font-semibold mb-1">KPI Monitoring</h3>
                            <p className="text-sm text-muted-foreground">Real-time metrics tracking</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
                            <h3 className="font-semibold mb-1">Analytics Suite</h3>
                            <p className="text-sm text-muted-foreground">Performance insights & reports</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="alerts" className="h-full m-0 p-0">
                  <div className="h-full flex items-center justify-center p-6">
                    <Card className="w-full max-w-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                          Intelligence Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Real-time competitive intelligence alerts and strategic notifications.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <AlertTriangle className="w-8 h-8 text-orange-500 mb-2" />
                            <h3 className="font-semibold mb-1">Threat Detection</h3>
                            <p className="text-sm text-muted-foreground">Competitive threat monitoring</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <Zap className="w-8 h-8 text-orange-500 mb-2" />
                            <h3 className="font-semibold mb-1">Instant Alerts</h3>
                            <p className="text-sm text-muted-foreground">Real-time notifications</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
