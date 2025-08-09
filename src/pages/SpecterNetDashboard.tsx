
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CompetitorDashboard from "@/components/specter-net/CompetitorDashboard";
import IntelligenceAlerts from "@/components/specter-net/IntelligenceAlerts";
import TaskGenerator from "@/components/specter-net/TaskGenerator";
import DatabaseLiveFeed from "@/components/ad-signal-hijack/DatabaseLiveFeed";
import { Shield, Target, Bell, Zap, Eye, TrendingUp } from "lucide-react";

export default function SpecterNetDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Specter Net Intelligence</h1>
                <p className="text-muted-foreground">Advanced competitive intelligence & AI-powered analytics platform</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-success/5 border-success/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Targets</div>
                    <div className="text-xl font-bold text-success">247</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Live Ads</div>
                    <div className="text-xl font-bold text-primary">1,543</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-500/5 border-yellow-500/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">New Alerts</div>
                    <div className="text-xl font-bold text-yellow-400">17</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Threat Level</div>
                    <div className="text-xl font-bold text-red-400">HIGH</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Intelligence Tabs */}
          <Tabs defaultValue="competitors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="competitors" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Competitors
              </TabsTrigger>
              <TabsTrigger value="ads" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Ad Intelligence
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Alerts
                <Badge className="bg-red-500/20 text-red-400 ml-1">17</Badge>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="competitors" className="space-y-6">
              <CompetitorDashboard />
            </TabsContent>

            <TabsContent value="ads" className="space-y-6">
              <DatabaseLiveFeed />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <IntelligenceAlerts />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <TaskGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
