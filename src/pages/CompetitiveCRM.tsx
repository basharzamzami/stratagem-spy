
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, DollarSign, Target, TrendingUp, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CRMLeads from '@/components/crm/CRMLeads';
import CRMDeals from '@/components/crm/CRMDeals';
import CRMContacts from '@/components/crm/CRMContacts';
import CRMAnalytics from '@/components/crm/CRMAnalytics';
import CRMCompetitorInsights from '@/components/crm/CRMCompetitorInsights';

const fetchCRMStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalLeads: 1247,
    qualifiedLeads: 328,
    activeDeals: 45,
    totalValue: 2450000,
    conversionRate: 24.3,
    avgDealSize: 54444,
    monthlyGrowth: 18.7,
    competitorTracked: 23
  };
};

export default function CompetitiveCRM() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['crm-stats'],
    queryFn: fetchCRMStats,
  });

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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Competitive CRM</h1>
              <p className="text-muted-foreground mt-2">Centralized customer intelligence and relationship management</p>
            </div>
            <div className="flex gap-3">
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

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  {stats.conversionRate}% conversion rate
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
                  ${(stats.totalValue / 1000000).toFixed(1)}M
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
                  Avg Deal Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  ${stats.avgDealSize.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.competitorTracked} competitors tracked
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main CRM Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="insights">Competitive Intelligence</TabsTrigger>
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

            <TabsContent value="insights">
              <CRMCompetitorInsights />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
