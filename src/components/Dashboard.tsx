
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdSignalHijackDashboard from './AdSignalHijackDashboard';
import AdSignalDashboard from './AdSignalDashboard';
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
  Shield
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-background">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Specter Insights Dashboard Nexus
            </h1>
            <p className="text-muted-foreground">
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
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="h-full">
          <Tabs defaultValue="ad-hijack" className="h-full flex flex-col">
            {/* Tabs List - Fixed */}
            <div className="flex-shrink-0 px-6 pt-4 bg-background">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="ad-hijack" className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4" />
                  <span className="hidden md:inline">Ad Hijack Fusion</span>
                  <span className="md:hidden">Hijack</span>
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
            <div className="flex-1 min-h-0 overflow-auto">
              <TabsContent value="ad-hijack" className="h-full m-0 p-0">
                <div className="h-full overflow-auto">
                  <AdSignalHijackDashboard />
                </div>
              </TabsContent>

              <TabsContent value="ad-signal" className="h-full m-0 p-0">
                <div className="h-full overflow-auto">
                  <AdSignalDashboard />
                </div>
              </TabsContent>

              <TabsContent value="market-intel" className="h-full m-0 p-0">
                <div className="h-full flex items-center justify-center">
                  <Card className="w-full max-w-md mx-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Market Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Advanced competitive intelligence and market analysis tools
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="leads" className="h-full m-0 p-0">
                <div className="h-full flex items-center justify-center">
                  <Card className="w-full max-w-md mx-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Lead Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Warm lead detection and prospect management system
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="h-full m-0 p-0">
                <div className="h-full flex items-center justify-center">
                  <Card className="w-full max-w-md mx-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Performance Operations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Real-time business KPI dashboard and performance tracking
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="h-full m-0 p-0">
                <div className="h-full flex items-center justify-center">
                  <Card className="w-full max-w-md mx-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                        Intelligence Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Real-time competitive intelligence alerts and notifications
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
