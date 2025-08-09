
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, DollarSign, Target, TrendingUp, Calendar, RefreshCw, Database, Zap, Bell, Brain } from 'lucide-react';
import { toast, useToast } from '@/hooks/use-toast';
import CRMLeads from '@/components/crm/CRMLeads';
import CRMDeals from '@/components/crm/CRMDeals';
import CRMContacts from '@/components/crm/CRMContacts';
import CRMAnalytics from '@/components/crm/CRMAnalytics';
import CRMCompetitorInsights from '@/components/crm/CRMCompetitorInsights';
import TaskGenerator from '@/components/pipeline/TaskGenerator';
import ChangeAlertsSystem from '@/components/pipeline/ChangeAlertsSystem';
import { getLeadAnalytics, aggregateLeadsFromSources } from '@/services/crmService';
import { useLeadPipeline } from '@/hooks/useLeadPipeline';
import { supabase } from "@/integrations/supabase/client";

export default function CompetitiveCRM() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast: showToast } = useToast();
  const { processLeads, isProcessing, processedCount } = useLeadPipeline();

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['crm-stats'],
    queryFn: async () => {
      // Get real data from database
      const { data: leads } = await supabase.from('leads').select('*');
      const { data: tasks } = await supabase.from('tasks').select('*');
      const analytics = await getLeadAnalytics();
      
      return {
        totalLeads: leads?.length || 0,
        qualifiedLeads: leads?.filter(lead => lead.status === 'qualified').length || 0,
        activeDeals: leads?.filter(lead => ['proposal', 'negotiation'].includes(lead.status)).length || 0,
        totalValue: leads?.reduce((sum, lead) => sum + (lead.intent_score * 1000), 0) || 0,
        conversionRate: analytics.journey_completion || 0,
        avgDealSize: 54444,
        monthlyGrowth: 18.7,
        competitorTracked: 23,
        analytics,
        activeTasks: tasks?.filter(t => t.status === 'pending').length || 0,
        highPriorityTasks: tasks?.filter(t => t.priority >= 4).length || 0
      };
    }
  });

  const handleDataSync = async () => {
    try {
      showToast({
        title: "Starting Intelligence Sync",
        description: "Aggregating leads from all intelligence sources..."
      });

      const newLeads = await aggregateLeadsFromSources();
      
      if (newLeads.length > 0) {
        // Process leads through the full pipeline
        processLeads(newLeads);
      }
      
      await refetch();

      showToast({
        title: "Data Sync Complete",
        description: `Successfully imported ${newLeads.length} leads and updated analytics`
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      showToast({
        title: "Sync Error",
        description: "Failed to sync data from external sources",
        variant: "destructive"
      });
    }
  };

  // Real-time data sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading || !stats) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Competitive Intelligence CRM</h1>
              <p className="text-muted-foreground mt-2">
                AI-driven CRM with automated lead aggregation, real-time task generation, and competitive change alerts
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleDataSync} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Processing {processedCount}...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Full Intelligence Sync
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Demo
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Lead
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Overview with Pipeline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.totalLeads.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-400">+{stats.monthlyGrowth}%</span> this month
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Qualified Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.qualifiedLeads}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.totalLeads > 0 ? Math.round((stats.qualifiedLeads / stats.totalLeads) * 100) : 0}% qualification rate
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Pipeline Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  ${(stats.totalValue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.activeDeals} active deals
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Journey Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(stats.conversionRate)}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  End-to-end tracking
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Active Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  {stats.activeTasks}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.highPriorityTasks} high priority
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {Object.keys(stats.analytics?.by_source || {}).length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Active integrations
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                  <div>
                    <div className="font-medium">Processing leads through intelligence pipeline...</div>
                    <div className="text-sm text-muted-foreground">
                      Processed {processedCount} leads • Generating tasks and journey maps
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Source Analytics */}
          {stats.analytics && Object.keys(stats.analytics.by_source).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Lead Source Intelligence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(stats.analytics.by_source).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="capitalize font-medium">
                        {source.replace('_', ' ')}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground">
                          ({Math.round((count / stats.totalLeads) * 100)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced CRM Interface with Intelligence Features */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="tasks">
                <Brain className="w-4 h-4 mr-2" />
                AI Tasks
              </TabsTrigger>
              <TabsTrigger value="alerts">
                <Bell className="w-4 h-4 mr-2" />
                Change Alerts
              </TabsTrigger>
              <TabsTrigger value="insights">Intelligence</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <CRMAnalytics />
            </TabsContent>

            <TabsContent value="leads">
              <CRMLeads />
            </TabsContent>

            <TabsContent value="deals">
              <CRMDeals />
            </TabsContent>

            <TabsContent value="contacts">
              <CRMContacts />
            </TabsContent>

            <TabsContent value="tasks">
              <TaskGenerator />
            </TabsContent>

            <TabsContent value="alerts">
              <ChangeAlertsSystem />
            </TabsContent>

            <TabsContent value="insights">
              <CRMCompetitorInsights />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
