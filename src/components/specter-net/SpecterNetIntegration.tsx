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
  RefreshCw,
  MessageSquare
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
import LeadFlowVisualization from './LeadFlowVisualization';
import AutoPitchGenerator from './AutoPitchGenerator';
import { 
  scanForIntentSignals, 
  enrichLead, 
  calculateLeadScore, 
  generateAutoPitch,
  AutoPitch,
  IntentSignal,
  LeadEnrichmentData
} from '@/services/warmLeadProspector';

const SpecterNetIntegration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [warmLeads, setWarmLeads] = useState<EnhancedLead[]>([]);
  const [competitorIntel, setCompetitorIntel] = useState<CompetitorAdIntel[]>([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<GeneratedCampaign[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [intentSignals, setIntentSignals] = useState<IntentSignal[]>([]);
  const [leadEnrichments, setLeadEnrichments] = useState<Record<string, LeadEnrichmentData>>({});
  const [autoPitches, setAutoPitches] = useState<Record<string, AutoPitch>>({});
  const [selectedLead, setSelectedLead] = useState<EnhancedLead | null>(null);
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
        description: "Scanning for warm leads with advanced intelligence..."
      });

      // Step 1: Scan for intent signals (20% progress)
      setProgress(20);
      const signals = await scanForIntentSignals(
        config.targetKeywords,
        config.geoTargets
      );
      setIntentSignals(signals);

      // Step 2: Run existing integration (40% progress)
      setProgress(40);
      const results = await runSpecterNetIntegration(
        config.targetKeywords,
        config.geoTargets,
        config.competitors,
        config.budget
      );

      // Step 3: Enrich leads with advanced data (60% progress)
      setProgress(60);
      const enrichments: Record<string, LeadEnrichmentData> = {};
      const pitches: Record<string, AutoPitch> = {};
      
      for (const lead of results.warmLeads) {
        const leadSignals = signals.filter(s => 
          s.keywords.some(k => lead.intent_keywords.includes(k))
        );
        
        const enrichment = await enrichLead(lead.id, leadSignals);
        enrichments[lead.id] = enrichment;
        
        // Recalculate lead score with enrichment data
        lead.intent_score = calculateLeadScore(lead, leadSignals, enrichment);
        
        // Generate auto-pitch
        const pitch = await generateAutoPitch(lead, leadSignals, enrichment);
        pitches[lead.id] = pitch;
        
        setProgress(60 + (Object.keys(enrichments).length / results.warmLeads.length) * 30);
      }
      
      setLeadEnrichments(enrichments);
      setAutoPitches(pitches);

      setProgress(100);
      setWarmLeads(results.warmLeads);
      setCompetitorIntel(results.competitorIntel);
      setGeneratedCampaigns(results.generatedCampaigns);

      toast({
        title: "✅ Advanced Integration Complete",
        description: `Generated ${results.generatedCampaigns.length} campaigns with ${Object.keys(pitches).length} auto-pitches`
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

  const handleRegeneratePitch = async (leadId: string) => {
    const lead = warmLeads.find(l => l.id === leadId);
    const enrichment = leadEnrichments[leadId];
    const leadSignals = intentSignals.filter(s => 
      s.keywords.some(k => lead?.intent_keywords.includes(k))
    );
    
    if (lead && enrichment) {
      const newPitch = await generateAutoPitch(lead, leadSignals, enrichment);
      setAutoPitches(prev => ({ ...prev, [leadId]: newPitch }));
      
      toast({
        title: "Pitch regenerated",
        description: "New personalized pitch created"
      });
    }
  };

  const handleSendPitch = (pitchContent: string) => {
    // Mock implementation - in real app would integrate with email/CRM
    console.log('Sending pitch:', pitchContent);
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

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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

        <Card className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border-indigo-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">{Object.keys(autoPitches).length}</div>
                <div className="text-sm text-muted-foreground">Auto-Pitches</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Content Tabs */}
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Lead Flow Visualization
          </TabsTrigger>
          <TabsTrigger value="pitch" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Auto-Pitch Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <WarmLeadsTable 
            leads={warmLeads} 
            onSelectLead={setSelectedLead}
            enrichmentData={leadEnrichments}
          />
        </TabsContent>

        <TabsContent value="intelligence">
          <CompetitorIntelDashboard intel={competitorIntel} />
        </TabsContent>

        <TabsContent value="campaigns">
          <GeneratedCampaignsView campaigns={generatedCampaigns} />
        </TabsContent>

        <TabsContent value="visualization">
          <LeadFlowVisualization leads={warmLeads} />
        </TabsContent>

        <TabsContent value="pitch">
          {selectedLead && autoPitches[selectedLead.id] ? (
            <AutoPitchGenerator
              lead={selectedLead}
              pitch={autoPitches[selectedLead.id]}
              onRegeneratePitch={() => handleRegeneratePitch(selectedLead.id)}
              onSendPitch={handleSendPitch}
            />
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Lead Selected</h3>
                <p className="text-muted-foreground">Select a lead from the Warm Leads tab to generate personalized pitches</p>
              </CardContent>
            </Card>
          )}
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
