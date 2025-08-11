
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Activity, 
  Zap,
  Eye,
  BarChart3,
  Download,
  Brain,
  Sword,
  X
} from 'lucide-react';
import AdSignalHijackDashboard from './AdSignalHijackDashboard';
import { MockDataProvider } from './ad-signal-hijack/MockDataProvider';

interface DashboardProps {
  activePanel?: string;
  onPanelClose?: () => void;
}

const Dashboard = ({ activePanel, onPanelClose }: DashboardProps) => {
  const [localActivePanel, setLocalActivePanel] = useState<string | null>(activePanel || null);

  const handlePanelClose = () => {
    setLocalActivePanel(null);
    if (onPanelClose) {
      onPanelClose();
    }
  };

  // If Ad Signal Hijack panel is active, show it instead of the default dashboard
  if (localActivePanel === 'ad-signal-hijack' || activePanel === 'ad-signal-hijack') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Panel Header */}
        <div className="flex-shrink-0 p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Sword className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Ad Signal Hijack</h1>
                <p className="text-sm text-muted-foreground">
                  Real-time competitive intelligence & counter-attack deployment
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePanelClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 min-h-0 overflow-hidden animate-fade-in">
          <MockDataProvider>
            <AdSignalHijackDashboard />
          </MockDataProvider>
        </div>
      </div>
    );
  }

  // Default dashboard content
  return (
    <ScrollArea className="h-full">
      <div className="p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Specter Insights Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced competitive intelligence platform for real-time market analysis and strategic advantage
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover-scale">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Competitors</p>
                  <p className="text-3xl font-bold text-foreground">127</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% this week
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20 hover-scale">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hot Ads Detected</p>
                  <p className="text-3xl font-bold text-foreground">43</p>
                  <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3" />
                    Real-time monitoring
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20 hover-scale">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Campaigns Generated</p>
                  <p className="text-3xl font-bold text-foreground">89</p>
                  <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                    <Brain className="w-3 h-3" />
                    AI-powered
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20 hover-scale">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ROI Improvement</p>
                  <p className="text-3xl font-bold text-foreground">284%</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Average uplift
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="h-24 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700"
                onClick={() => setLocalActivePanel('ad-signal-hijack')}
              >
                <Sword className="w-6 h-6" />
                <span className="text-sm">Launch Ad Hijack</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Eye className="w-6 h-6" />
                <span className="text-sm">Monitor Competitors</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Download className="w-6 h-6" />
                <span className="text-sm">Export Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Collection</span>
                <Badge className="bg-success/20 text-success border-success/30">
                  <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Processing</span>
                <Badge className="bg-success/20 text-success border-success/30">
                  <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Monitoring</span>
                <Badge className="bg-success/20 text-success border-success/30">
                  <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                  Operational
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>New hot ad detected from TechCorp</span>
                  <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Campaign generated for SaaS vertical</span>
                  <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Counter-attack deployed successfully</span>
                  <span className="text-xs text-muted-foreground ml-auto">12m ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Dashboard;
