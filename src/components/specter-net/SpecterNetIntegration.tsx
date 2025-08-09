
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Zap, 
  TrendingUp, 
  Users, 
  Eye, 
  DollarSign,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  runSpecterNetIntegration,
  EnhancedLead,
  CompetitorAdIntel,
  GeneratedCampaign
} from '@/services/specterNetIntegration';
import WarmLeadsTable from './WarmLeadsTable';
import CompetitorIntelDashboard from './CompetitorIntelDashboard';
import GeneratedCampaignsView from './GeneratedCampaignsView';

const SpecterNetIntegration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [warmLeads, setWarmLeads] = useState<EnhancedLead[]>([]);
  const [competitorIntel, setCompetitorIntel] = useState<CompetitorAdIntel[]>([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<GeneratedCampaign[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const { toast } = useToast();

  // Mock configuration - in real app, this would come from user settings
  const config = {
    targetKeywords: ['marketing automation', 'lead generation', 'CRM software', 'sales funnel'],
    geoTargets: ['Miami, FL', 'Austin, TX', 'Seattle, WA', 'Denver, CO'],
    competitors: ['HubSpot', 'Salesforce', 'Marketo', 'Pardot'],
    budget: 50000
  };

  const runIntegration = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast({
        title: "🎯 Specter Net Activated",
        description: "Scanning for warm leads and analyzing competitor intelligence..."
      });

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const results = await runSpecterNetIntegration(
        config.targetKeywords,
        config.geoTargets,
        config.competitors,
        config.budget
      );

      setWarmLeads(results.warmLeads);
      setCompetitorIntel(results.competitorIntel);
      setGeneratedCampaigns(results.generatedCampaigns);

      toast({
        title: "✅ Integration Complete",
        description: `Generated ${results.generatedCampaigns.length} hijack campaigns targeting ${results.warmLeads.length} warm leads`
      });

    } catch (error) {
      toast({
        title: "❌ Integration Failed",
        description: "Unable to complete Specter Net integration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const toggleRealTimeMode = () => {
    setIsRealTimeActive(!isRealTimeActive);
    toast({
      title: isRealTimeActive ? "🔄 Real-time Disabled" : "🚀 Real-time Enabled",
      description: isRealTimeActive 
        ? "Switched to manual scanning mode" 
        : "Continuous monitoring activated"
    });
  };

  // Auto-refresh in real-time mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRealTimeActive) {
      interval = setInterval(() => {
        runIntegration();
      }, 60000); // Refresh every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTimeActive]);

  const totalLeadValue = warmLeads.reduce((sum, lead) => sum + (lead.intent_score * 100), 0);
  const avgUrgencyScore = warmLeads.length > 0 
    ? warmLeads.reduce((sum, lead) => sum + lead.urgency_score, 0) / warmLeads.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Specter Net Intelligence</h2>
          <p className="text-muted-foreground">AI-powered lead hijacking & competitor campaign automation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isRealTimeActive ? "default" : "outline"}
            onClick={toggleRealTimeMode}
            className="flex items-center gap-2"
          >
            {isRealTimeActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRealTimeActive ? "Real-time ON" : "Real-time OFF"}
          </Button>
          <Button 
            onClick={runIntegration} 
            disabled={isRunning}
            className="bg-primary hover:bg-primary/90"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Launch Specter Net
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      {isRunning && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary">Integration Progress</span>
                  <span className="text-sm text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Zap className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{warmLeads.length}</div>
                <div className="text-sm text-muted-foreground">Warm Leads Detected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{competitorIntel.length}</div>
                <div className="text-sm text-muted-foreground">Competitors Analyzed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{generatedCampaigns.length}</div>
                <div className="text-sm text-muted-foreground">Hijack Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  ${(totalLeadValue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-muted-foreground">Pipeline Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Warm Leads ({warmLeads.length})
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Competitor Intel ({competitorIntel.length})
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Generated Campaigns ({generatedCampaigns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <WarmLeadsTable leads={warmLeads} />
        </TabsContent>

        <TabsContent value="intelligence">
          <CompetitorIntelDashboard intel={competitorIntel} />
        </TabsContent>

        <TabsContent value="campaigns">
          <GeneratedCampaignsView campaigns={generatedCampaigns} />
        </TabsContent>
      </Tabs>

      {/* Real-time Status */}
      {isRealTimeActive && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-success font-medium">
                Real-time monitoring active - scanning every 60 seconds
              </span>
              <Badge variant="outline" className="bg-success/20 text-success border-success/30 ml-auto">
                <TrendingUp className="w-3 h-3 mr-1" />
                Avg Urgency: {avgUrgencyScore.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpecterNetIntegration;
