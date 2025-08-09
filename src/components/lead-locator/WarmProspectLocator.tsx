
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  MapPin, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Zap,
  Target,
  Users,
  BarChart3,
  Mail,
  Activity,
  Briefcase,
  DollarSign
} from 'lucide-react';

interface WarmLead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  location: string;
  industry: string;
  company_size: string;
  revenue_estimate: string;
  intent_score: number;
  urgency_score: number;
  recency_score: number;
  fit_score: number;
  multi_signal_score: number;
  overall_score: number;
  intent_keywords: string[];
  pain_points: string[];
  buying_stage: 'awareness' | 'consideration' | 'decision';
  signal_sources: string[];
  last_activity: string;
  time_to_strike: number; // hours
  predicted_channels: string[];
}

export default function WarmProspectLocator() {
  const [searchFilters, setSearchFilters] = useState({
    industry: '',
    location: '',
    keywords: '',
    minScore: 70,
    buyingStage: 'all'
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [warmLeads, setWarmLeads] = useState<WarmLead[]>([]);
  const [selectedView, setSelectedView] = useState<'list' | 'heatmap'>('list');

  const mockWarmLeads: WarmLead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechFlow Solutions',
      title: 'VP of Marketing',
      email: 'sarah.chen@techflow.com',
      location: 'San Francisco, CA',
      industry: 'SaaS Technology',
      company_size: '100-500',
      revenue_estimate: '$10M-50M',
      intent_score: 94,
      urgency_score: 89,
      recency_score: 95,
      fit_score: 92,
      multi_signal_score: 88,
      overall_score: 92,
      intent_keywords: ['competitive analysis', 'market intelligence', 'lead generation'],
      pain_points: ['losing leads to competitors', 'manual processes'],
      buying_stage: 'decision',
      signal_sources: ['LinkedIn', 'G2 Reviews', 'Industry Forums'],
      last_activity: '8 minutes ago',
      time_to_strike: 18,
      predicted_channels: ['email', 'linkedin', 'phone']
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      company: 'GrowthLabs Inc',
      title: 'Head of Sales',
      email: 'mike@growthlabs.com',
      location: 'Austin, TX',
      industry: 'Digital Marketing',
      company_size: '50-200',
      revenue_estimate: '$5M-25M',
      intent_score: 87,
      urgency_score: 75,
      recency_score: 82,
      fit_score: 90,
      multi_signal_score: 85,
      overall_score: 84,
      intent_keywords: ['sales automation', 'CRM integration', 'lead scoring'],
      pain_points: ['pipeline visibility', 'lead qualification'],
      buying_stage: 'consideration',
      signal_sources: ['Reddit', 'YouTube', 'Job Boards'],
      last_activity: '2 hours ago',
      time_to_strike: 30,
      predicted_channels: ['email', 'ads']
    },
    {
      id: '3',
      name: 'Jessica Wang',
      company: 'Enterprise Solutions Co',
      title: 'Director of Operations',
      email: 'jessica@enterpriseco.com',
      location: 'Seattle, WA',
      industry: 'Enterprise Software',
      company_size: '500-1000',
      revenue_estimate: '$50M+',
      intent_score: 91,
      urgency_score: 82,
      recency_score: 88,
      fit_score: 94,
      multi_signal_score: 87,
      overall_score: 88,
      intent_keywords: ['enterprise integration', 'workflow automation'],
      pain_points: ['system inefficiencies', 'data silos'],
      buying_stage: 'decision',
      signal_sources: ['LinkedIn', 'Industry Publications', 'Webinars'],
      last_activity: '45 minutes ago',
      time_to_strike: 12,
      predicted_channels: ['phone', 'email', 'linkedin']
    }
  ];

  const runLiveMonitoring = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const steps = [
      'Scanning job boards for intent signals...',
      'Analyzing forum discussions...',
      'Processing social media mentions...',
      'Enriching lead profiles...',
      'Calculating strike windows...',
      'Generating auto-pitches...',
      'Syncing to CRM...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanProgress(((i + 1) / steps.length) * 100);
    }
    
    setWarmLeads(mockWarmLeads);
    setIsScanning(false);
  };

  const getBuyingStageColor = (stage: string) => {
    switch (stage) {
      case 'decision': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'consideration': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'awareness': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10';
    if (score >= 80) return 'text-orange-400 bg-orange-500/10';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-blue-400 bg-blue-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Warm Prospect Locator</h2>
          <p className="text-muted-foreground">Precision lead intelligence with conversion timing</p>
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
        </div>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Live Intent Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={searchFilters.industry} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS Technology</SelectItem>
                  <SelectItem value="marketing">Digital Marketing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Financial Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State or ZIP"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Intent Keywords</Label>
              <Input
                id="keywords"
                placeholder="CRM, automation, analytics"
                value={searchFilters.keywords}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, keywords: e.target.value }))}
              />
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
            <Button onClick={runLiveMonitoring} disabled={isScanning} className="flex items-center gap-2">
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Start Live Monitoring
                </>
              )}
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing real-time intent signals across platforms...</span>
                <span>{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {warmLeads.length > 0 && (
        <div className="space-y-4">
          {warmLeads.map((lead) => (
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
                      <Badge className="ml-2 text-xs">{lead.industry}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getBuyingStageColor(lead.buying_stage)}>
                      {lead.buying_stage.toUpperCase()}
                    </Badge>
                    <Badge className={`${getScoreColor(lead.overall_score)} border`}>
                      Score: {lead.overall_score}
                    </Badge>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{lead.intent_score}</div>
                    <div className="text-xs text-muted-foreground">Intent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{lead.urgency_score}</div>
                    <div className="text-xs text-muted-foreground">Urgency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{lead.fit_score}</div>
                    <div className="text-xs text-muted-foreground">Fit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{lead.recency_score}</div>
                    <div className="text-xs text-muted-foreground">Recency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{lead.time_to_strike}h</div>
                    <div className="text-xs text-muted-foreground">Strike Window</div>
                  </div>
                </div>

                {/* Intent Signals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Intent Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {lead.intent_keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      Pain Points
                    </h4>
                    <div className="space-y-1">
                      {lead.pain_points.map((pain, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          • {pain}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Company Context */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Company Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Size: {lead.company_size}</div>
                      <div>Revenue: {lead.revenue_estimate}</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Signal Sources
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {lead.signal_sources.map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Generate Pitch
                  </Button>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Schedule Outreach
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Timeline
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
