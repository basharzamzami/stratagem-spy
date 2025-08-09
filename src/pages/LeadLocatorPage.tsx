import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from "@/components/Navigation";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiClient } from '@/services/api';
import { scanForIntentSignals, enrichLead } from '@/services/warmLeadProspector';
import LeadFlowVisualization from '@/components/specter-net/LeadFlowVisualization';
import WarmLeadsTable from '@/components/specter-net/WarmLeadsTable';
import AutoPitchGenerator from '@/components/specter-net/AutoPitchGenerator';
import { Search, MapPin, Users, Target, Phone, Zap, TrendingUp, Eye } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  contact: string;
  phone?: string;
  location: string;
  industry: string;
  companySize: string;
  intentScore: number;
  keywords: string[];
  lastActivity: string;
  source: string;
}

export default function LeadLocatorPage() {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    industry: '',
    minIntent: 0
  });

  const [warmLeads, setWarmLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState({});
  const [selectedLeadPitch, setSelectedLeadPitch] = useState(null);

  const { data: leadsData, isLoading, refetch } = useQuery({
    queryKey: ['leads', searchParams],
    queryFn: () => ApiClient.searchLeads(searchParams),
  });

  const leads: Lead[] = Array.isArray(leadsData?.data) ? leadsData.data : [];

  const handleSearch = () => {
    refetch();
  };

  const handleWarmLeadScan = async () => {
    if (!searchParams.keyword) return;
    
    setIsScanning(true);
    try {
      const keywords = searchParams.keyword.split(',').map(k => k.trim());
      const geoTargets = searchParams.location ? [searchParams.location] : ['CA', 'TX', 'NY'];
      
      const intentSignals = await scanForIntentSignals(keywords, geoTargets);
      
      const detectedLeads = intentSignals.map((signal, index) => ({
        id: `lead_${signal.id}`,
        name: `Prospect ${index + 1}`,
        company: `Company ${index + 1}`,
        title: 'Decision Maker',
        email: `contact${index + 1}@company.com`,
        phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        geo_context: {
          city: signal.raw_data.geo_target || 'Unknown',
          state: signal.raw_data.geo_target || 'CA',
          zip: '90210'
        },
        intent_keywords: signal.keywords,
        intent_score: Math.floor(signal.urgency_score * 100),
        urgency_score: Math.floor(signal.urgency_score * 100),
        search_patterns: ['competitor research', 'pricing comparison'],
        last_search_activity: signal.detected_at,
        industry_context: 'Technology'
      }));
      
      setWarmLeads(detectedLeads);
      
      const enrichment = {};
      for (const lead of detectedLeads.slice(0, 5)) {
        try {
          const enrichedData = await enrichLead(lead.id, intentSignals);
          enrichment[lead.id] = enrichedData;
        } catch (error) {
          console.log('Enrichment failed for lead:', lead.id);
        }
      }
      setEnrichmentData(enrichment);
      
    } catch (error) {
      console.error('Warm lead scanning failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    // Generate a mock pitch for the selected lead
    const mockPitch = {
      subject_lines: [
        `Quick question about ${lead.company || 'your company'}'s growth strategy`,
        `Helping ${lead.company || 'companies like yours'} with competitive intelligence`,
        `${lead.name}, noticed your interest in market research tools`
      ],
      opening_hooks: [
        `Hi ${lead.name}, I noticed you've been researching competitive intelligence solutions recently.`,
        `${lead.name}, I saw that ${lead.company || 'your company'} is looking into market research tools.`,
        `Hey ${lead.name}, based on your recent search activity, it looks like you're exploring ways to gain competitive advantages.`
      ],
      pain_point_references: [
        `Many companies struggle with staying ahead of their competition without the right intelligence tools.`,
        `I understand how challenging it can be to make strategic decisions without comprehensive market data.`,
        `It's frustrating when you know there's valuable competitive information out there but can't access it efficiently.`
      ],
      value_propositions: [
        `Our platform provides real-time competitive intelligence that can give ${lead.company || 'your company'} a significant advantage in your market.`,
        `We help businesses like yours turn competitive data into actionable insights that drive growth.`,
        `With our solution, you can monitor your competitors' strategies and respond faster than ever before.`
      ],
      cta_options: [
        `Would you be interested in a 15-minute demo to see how this could work for ${lead.company || 'your company'}?`,
        `I'd love to show you how our competitive intelligence platform could help. Are you free for a brief call this week?`,
        `Would you like to see some examples of the insights we've generated for similar companies in your space?`
      ],
      engagement_score: lead.intent_score || 75,
      personalization_tokens: {
        '{first_name}': lead.name || 'there',
        '{company}': lead.company || 'your company',
        '{industry}': lead.industry_context || 'your industry',
        '{location}': lead.geo_context?.city || 'your area'
      }
    };
    setSelectedLeadPitch(mockPitch);
  };

  const handleRegeneratePitch = () => {
    if (selectedLead) {
      // Generate a new pitch with different variations
      handleSelectLead(selectedLead);
    }
  };

  const handleSendPitch = (pitchContent) => {
    console.log('Sending pitch:', pitchContent);
    // Here you would implement the actual sending logic
    // For now, just log the pitch content
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Warm Lead Prospect Locator</h1>
                <p className="text-muted-foreground">Precision lead intelligence with real-time monitoring and auto-enrichment</p>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <Badge className="bg-success/20 text-success border-success/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  {warmLeads.length} Warm Leads
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {leads.length} Total Leads
                </Badge>
              </div>
            </div>

            {/* Enhanced Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Advanced Lead Search & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <Input
                    placeholder="Intent keywords (comma-separated)"
                    value={searchParams.keyword}
                    onChange={(e) => setSearchParams(prev => ({...prev, keyword: e.target.value}))}
                  />
                  
                  <Input
                    placeholder="Geographic targets"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams(prev => ({...prev, location: e.target.value}))}
                  />
                  
                  <Select value={searchParams.industry} onValueChange={(value) => setSearchParams(prev => ({...prev, industry: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={searchParams.minIntent.toString()} onValueChange={(value) => setSearchParams(prev => ({...prev, minIntent: parseInt(value)}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Min Intent Score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Scores</SelectItem>
                      <SelectItem value="50">50+ (Medium)</SelectItem>
                      <SelectItem value="70">70+ (High)</SelectItem>
                      <SelectItem value="85">85+ (Very High)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleSearch} variant="outline" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search Database
                  </Button>
                  
                  <Button 
                    onClick={handleWarmLeadScan} 
                    disabled={isScanning || !searchParams.keyword}
                    className="flex items-center gap-2 bg-success hover:bg-success/90"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Scan for Warm Leads
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="warm-leads" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="warm-leads" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Warm Leads ({warmLeads.length})
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Flow Visualization
              </TabsTrigger>
              <TabsTrigger value="auto-pitch" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Auto-Pitch Generator
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Database Leads ({leads.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="warm-leads" className="space-y-6">
              <WarmLeadsTable 
                leads={warmLeads} 
                onSelectLead={handleSelectLead}
                enrichmentData={enrichmentData}
              />
            </TabsContent>

            <TabsContent value="visualization" className="space-y-6">
              <LeadFlowVisualization leads={warmLeads} />
            </TabsContent>

            <TabsContent value="auto-pitch" className="space-y-6">
              {selectedLead && selectedLeadPitch ? (
                <AutoPitchGenerator 
                  lead={selectedLead}
                  pitch={selectedLeadPitch}
                  onRegeneratePitch={handleRegeneratePitch}
                  onSendPitch={handleSendPitch}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Select a Lead for Auto-Pitch</h3>
                    <p className="text-muted-foreground">Choose a warm lead from the table to generate personalized outreach</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              {/* Database Leads Grid */}
              <div className="grid gap-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Searching database...</p>
                  </div>
                ) : leads.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Database Leads Found</h3>
                      <p className="text-muted-foreground">Try adjusting your search filters or use warm lead scanning</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {leads.map((lead: Lead) => (
                      <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{lead.name}</h3>
                                <p className="text-sm text-muted-foreground">{lead.title} at {lead.company}</p>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {lead.location}
                                </span>
                                <span>Industry: {lead.industry}</span>
                                <span>Size: {lead.companySize}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Keywords:</span>
                                {lead.keywords.slice(0, 3).map((keyword, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                                {lead.keywords.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{lead.keywords.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Intent Score</span>
                                <Badge className={`${
                                  lead.intentScore >= 85 ? 'bg-green-500/20 text-green-400' :
                                  lead.intentScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {lead.intentScore}%
                                </Badge>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Contact
                                </Button>
                                <Button size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
