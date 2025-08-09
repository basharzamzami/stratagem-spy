
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Zap,
  Target,
  Brain,
  Users,
  Activity,
  BarChart3,
  MessageSquare,
  Briefcase,
  Heart,
  DollarSign
} from 'lucide-react';

interface ForensicLead {
  id: string;
  name: string;
  company: string;
  title: string;
  location: string;
  
  // Intent Signals
  intentSignals: {
    urgencyLanguage: string[];
    painPoints: string[];
    comparisonQueries: string[];
    pricingQuestions: string[];
  };
  
  // Behavioral Analysis
  behaviorProfile: {
    emotionalTriggers: ('frustration' | 'fear' | 'ambition' | 'urgency')[];
    rationalCriteria: string[];
    buyingStage: 'awareness' | 'consideration' | 'decision';
    engagementHistory: string[];
  };
  
  // Scoring & Prioritization
  scores: {
    intentScore: number;
    urgencyScore: number;
    fitScore: number;
    engagementScore: number;
    overallScore: number;
  };
  
  // Context Data
  context: {
    industry: string;
    companySize: string;
    decisionMakingPower: 'high' | 'medium' | 'low';
    budget: string;
    timeline: string;
  };
  
  // Activity Tracking
  activity: {
    lastSignal: string;
    signalFrequency: number;
    platformsActive: string[];
    coolingOffRisk: boolean;
  };
}

export default function LeadLocatorForensic() {
  const [searchFilters, setSearchFilters] = useState({
    keywords: '',
    location: '',
    industry: '',
    buyingStage: 'all',
    minUrgency: 70
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [forensicLeads, setForensicLeads] = useState<ForensicLead[]>([]);
  const [selectedView, setSelectedView] = useState<'list' | 'heatmap' | 'journey'>('list');

  const mockForensicLeads: ForensicLead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechFlow Solutions',
      title: 'VP of Marketing',
      location: 'San Francisco, CA',
      intentSignals: {
        urgencyLanguage: ['need ASAP', 'looking to switch by Q1', 'urgent requirement'],
        painPoints: ['current tool is failing us', 'losing leads daily', 'team productivity down'],
        comparisonQueries: ['HubSpot vs Salesforce pricing', 'best CRM for growing teams'],
        pricingQuestions: ['enterprise pricing', 'volume discounts', 'implementation costs']
      },
      behaviorProfile: {
        emotionalTriggers: ['frustration', 'urgency'],
        rationalCriteria: ['ROI within 90 days', 'easy integration', 'team training support'],
        buyingStage: 'decision',
        engagementHistory: ['downloaded ROI calculator', 'attended demo webinar', 'viewed pricing page 5x']
      },
      scores: {
        intentScore: 94,
        urgencyScore: 89,
        fitScore: 92,
        engagementScore: 88,
        overallScore: 91
      },
      context: {
        industry: 'SaaS Technology',
        companySize: '100-500 employees',
        decisionMakingPower: 'high',
        budget: '$50K-100K annually',
        timeline: '30-60 days'
      },
      activity: {
        lastSignal: '8 minutes ago',
        signalFrequency: 12,
        platformsActive: ['LinkedIn', 'G2 Reviews', 'Company Forums'],
        coolingOffRisk: false
      }
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      company: 'GrowthLabs Inc',
      title: 'Head of Sales',
      location: 'Austin, TX',
      intentSignals: {
        urgencyLanguage: ['evaluating options', 'need better solution'],
        painPoints: ['manual processes killing productivity', 'missing revenue opportunities'],
        comparisonQueries: ['sales automation tools comparison', 'lead scoring platforms'],
        pricingQuestions: ['startup pricing tiers', 'scalability costs']
      },
      behaviorProfile: {
        emotionalTriggers: ['ambition', 'frustration'],
        rationalCriteria: ['proven ROI metrics', 'integration capabilities', 'scalability'],
        buyingStage: 'consideration',
        engagementHistory: ['read 3 case studies', 'joined industry webinar', 'downloaded whitepaper']
      },
      scores: {
        intentScore: 82,
        urgencyScore: 75,
        fitScore: 88,
        engagementScore: 79,
        overallScore: 81
      },
      context: {
        industry: 'Digital Marketing',
        companySize: '25-100 employees',
        decisionMakingPower: 'medium',
        budget: '$20K-50K annually',
        timeline: '60-90 days'
      },
      activity: {
        lastSignal: '2 hours ago',
        signalFrequency: 8,
        platformsActive: ['Reddit', 'Industry Forums', 'YouTube'],
        coolingOffRisk: false
      }
    }
  ];

  const runForensicAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const steps = [
      'Scanning job posts for urgent language...',
      'Analyzing forum discussions for pain points...',
      'Processing review sites for comparison signals...',
      'Extracting emotional triggers from social data...',
      'Mapping buying journey stages...',
      'Calculating forensic scores...',
      'Generating lead insights...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(((i + 1) / steps.length) * 100);
    }
    
    setForensicLeads(mockForensicLeads);
    setIsAnalyzing(false);
  };

  const getBuyingStageColor = (stage: string) => {
    switch (stage) {
      case 'decision': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'consideration': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'awareness': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getEmotionalTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'frustration': return <AlertTriangle className="w-3 h-3 text-red-400" />;
      case 'fear': return <Eye className="w-3 h-3 text-orange-400" />;
      case 'ambition': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'urgency': return <Zap className="w-3 h-3 text-yellow-400" />;
      default: return <Heart className="w-3 h-3 text-pink-400" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lead Locator: Forensic Warm Prospect Analysis
          </h1>
          <p className="text-muted-foreground">
            Decode true buying signals and understand leads at a forensic level
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedView === 'list' ? 'default' : 'outline'}
            onClick={() => setSelectedView('list')}
            size="sm"
          >
            <Users className="w-4 h-4 mr-2" />
            List View
          </Button>
          <Button
            variant={selectedView === 'heatmap' ? 'default' : 'outline'}
            onClick={() => setSelectedView('heatmap')}
            size="sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Heatmap
          </Button>
          <Button
            variant={selectedView === 'journey' ? 'default' : 'outline'}
            onClick={() => setSelectedView('journey')}
            size="sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            Journey
          </Button>
        </div>
      </div>

      {/* Search & Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Forensic Analysis Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Target Keywords</Label>
              <Input
                id="keywords"
                placeholder="CRM, sales automation, lead gen"
                value={searchFilters.keywords}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, keywords: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Geographic Focus</Label>
              <Input
                id="location"
                placeholder="San Francisco, Austin, NYC"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry Filter</Label>
              <Select value={searchFilters.industry} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS Technology</SelectItem>
                  <SelectItem value="marketing">Digital Marketing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Financial Services</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Buying Stage</Label>
              <Select value={searchFilters.buyingStage} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, buyingStage: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="decision">Decision Ready</SelectItem>
                  <SelectItem value="consideration">Consideration</SelectItem>
                  <SelectItem value="awareness">Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={runForensicAnalysis} disabled={isAnalyzing} className="flex items-center gap-2">
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Run Forensic Analysis
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deep analyzing prospect behavior across platforms...</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forensic Leads Results */}
      {forensicLeads.length > 0 && (
        <div className="space-y-6">
          {forensicLeads.map((lead) => (
            <Card key={lead.id} className="overflow-hidden">
              <CardContent className="p-6">
                {/* Lead Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">{lead.title} at {lead.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{lead.location}</span>
                      <Badge className="ml-2 text-xs">
                        {lead.context.industry}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getBuyingStageColor(lead.behaviorProfile.buyingStage)}>
                      {lead.behaviorProfile.buyingStage.toUpperCase()}
                    </Badge>
                    <Badge className="bg-primary/20 text-primary">
                      Score: {lead.scores.overallScore}
                    </Badge>
                  </div>
                </div>

                {/* Intent Signals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  {/* Urgency Signals */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-400" />
                      Urgency Signals ({lead.scores.urgencyScore}%)
                    </h4>
                    <div className="space-y-1">
                      {lead.intentSignals.urgencyLanguage.slice(0, 2).map((signal, idx) => (
                        <div key={idx} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">
                          "{signal}"
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      Pain Points
                    </h4>
                    <div className="space-y-1">
                      {lead.intentSignals.painPoints.slice(0, 2).map((pain, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          • {pain}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emotional Triggers */}
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-purple-400" />
                      Emotional Profile
                    </h4>
                    <div className="flex gap-1 flex-wrap">
                      {lead.behaviorProfile.emotionalTriggers.map((trigger, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                          {getEmotionalTriggerIcon(trigger)}
                          {trigger}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Context & Engagement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Company Context
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Size: {lead.context.companySize}</div>
                      <div>Budget: {lead.context.budget}</div>
                      <div>Timeline: {lead.context.timeline}</div>
                      <div>Authority: {lead.context.decisionMakingPower}</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Recent Activity
                    </h4>
                    <div className="space-y-1">
                      {lead.behaviorProfile.engagementHistory.slice(0, 2).map((activity, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Generate Auto-Pitch
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Full Profile
                  </Button>
                  <Button variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
