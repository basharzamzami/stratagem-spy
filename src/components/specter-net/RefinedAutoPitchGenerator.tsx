
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Target, 
  Copy, 
  RefreshCw, 
  Eye, 
  ThumbsUp, 
  ThumbsDown,
  Zap,
  BarChart3,
  MessageSquare,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { EnhancedLead } from '@/services/specterNetIntegration';

interface AutoPitch {
  id: string;
  lead_id: string;
  subject_lines: string[];
  opening_hooks: string[];
  pain_point_references: string[];
  value_propositions: string[];
  cta_options: string[];
  personalization_tokens: Record<string, string>;
  engagement_score: number;
  created_at: string;
  channel: 'email' | 'linkedin' | 'phone' | 'ad';
  tone: 'professional' | 'casual' | 'urgent' | 'friendly';
}

interface PitchPerformanceData {
  subject_line: string;
  open_rate: number;
  response_rate: number;
  samples: number;
}

export default function RefinedAutoPitchGenerator() {
  const [selectedLead, setSelectedLead] = useState<EnhancedLead | null>(null);
  const [generatedPitches, setGeneratedPitches] = useState<AutoPitch[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'linkedin' | 'phone' | 'ad'>('email');
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'urgent' | 'friendly'>('professional');
  const [customPrompt, setCustomPrompt] = useState('');

  const mockLeads: EnhancedLead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@techflow.com',
      company: 'TechFlow Solutions',
      title: 'VP of Marketing',
      intent_score: 94,
      geo_context: { city: 'San Francisco', state: 'CA', zip: '94105' },
      intent_keywords: ['competitive intelligence', 'market analysis', 'competitor tracking'],
      search_patterns: ['researching competitor tools', 'comparing analytics platforms'],
      competitor_references: ['Similarweb', 'SEMrush', 'Ahrefs'],
      urgency_score: 0.85,
      last_activity: '2024-01-08T10:30:00Z',
      source: 'linkedin_intent',
      source_data: {
        recent_activity: 'Liked posts about competitive intelligence',
        engagement_history: ['Downloaded whitepaper on market analysis']
      }
    }
  ];

  const performanceData: PitchPerformanceData[] = [
    { subject_line: "Quick question about {company}'s growth strategy", open_rate: 34, response_rate: 12, samples: 150 },
    { subject_line: "How {similar_company} increased leads by 40%", open_rate: 28, response_rate: 9, samples: 200 },
    { subject_line: "{first_name}, solving {pain_point} for {industry} teams", open_rate: 42, response_rate: 15, samples: 120 },
    { subject_line: "5-minute solution to your {pain_point}", open_rate: 38, response_rate: 11, samples: 180 }
  ];

  useEffect(() => {
    if (mockLeads.length > 0) {
      setSelectedLead(mockLeads[0]);
    }
  }, []);

  const generatePitch = async () => {
    if (!selectedLead) return;

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPitch: AutoPitch = {
        id: `pitch_${Date.now()}`,
        lead_id: selectedLead.id,
        channel: selectedChannel,
        tone: selectedTone,
        engagement_score: Math.floor(Math.random() * 30) + 70,
        created_at: new Date().toISOString(),
        personalization_tokens: {
          '{first_name}': selectedLead.name?.split(' ')[0] || 'there',
          '{company}': selectedLead.company || 'your company',
          '{industry}': 'Technology', // Default industry
          '{pain_point}': 'operational challenges', // Default pain point
          '{location}': `${selectedLead.geo_context?.city}, ${selectedLead.geo_context?.state}`,
          '{similar_company}': 'TechCorp'
        },
        subject_lines: generateSubjectLines(selectedLead, selectedTone, selectedChannel),
        opening_hooks: generateOpeningHooks(selectedLead, selectedTone),
        pain_point_references: generatePainPointRefs(selectedLead),
        value_propositions: generateValueProps(selectedLead),
        cta_options: generateCTAs(selectedChannel, selectedTone)
      };

      setGeneratedPitches([newPitch, ...generatedPitches.slice(0, 4)]);
      setIsGenerating(false);
    }, 2000);
  };

  const generateSubjectLines = (lead: EnhancedLead, tone: string, channel: string): string[] => {
    const company = lead.company || 'your company';
    const name = lead.name?.split(' ')[0] || 'there';
    const industry = 'Technology'; // Default since business_context doesn't exist
    
    if (channel === 'email') {
      switch (tone) {
        case 'professional':
          return [
            `Strategic intelligence opportunity for ${company}`,
            `${name}, competitive insights for ${industry} leaders`,
            `Market intelligence solution - ${company}`,
            `Enhancing ${company}'s competitive advantage`
          ];
        case 'casual':
          return [
            `Hey ${name}, quick question about ${company}`,
            `${name} - saw your recent activity on competitive analysis`,
            `Quick chat about ${company}'s market position?`,
            `${name}, this might interest you`
          ];
        case 'urgent':
          return [
            `URGENT: ${company} competitors gaining ground`,
            `${name}, your competitors are making moves`,
            `Time-sensitive: ${company} market opportunity`,
            `Action needed: ${company} competitive gap`
          ];
        case 'friendly':
          return [
            `${name}, exciting opportunity for ${company}`,
            `Hope you're doing well, ${name}`,
            `${name}, thought you'd find this valuable`,
            `Great to connect with ${industry} leaders like you`
          ];
        default:
          return [`Professional opportunity for ${company}`];
      }
    }
    return [`LinkedIn message for ${company}`];
  };

  const generateOpeningHooks = (lead: EnhancedLead, tone: string): string[] => {
    return [
      `I noticed ${lead.company} is in a competitive space...`,
      `Many companies like ${lead.company} are facing similar challenges...`,
      `Your recent activity suggests you're exploring competitive intelligence solutions...`,
      `${lead.company} has impressive growth, but I noticed a potential blind spot...`
    ];
  };

  const generatePainPointRefs = (lead: EnhancedLead): string[] => {
    return [
      `The lead generation challenges you're likely experiencing...`,
      `Competitor analysis gaps that many companies face...`,
      `Market intelligence blind spots affecting growth...`,
      `The difficulty in tracking competitor moves in real-time...`
    ];
  };

  const generateValueProps = (lead: EnhancedLead): string[] => {
    return [
      `Specifically built for growing companies like ${lead.company}`,
      `ROI typically seen within 30 days of deployment`,
      `Reduce competitive research time by 80%`,
      `Used by industry leaders in ${lead.geo_context?.city}`
    ];
  };

  const generateCTAs = (channel: string, tone: string): string[] => {
    if (channel === 'email') {
      switch (tone) {
        case 'professional':
          return [
            'Worth a 15-minute strategic conversation?',
            'Should I send our competitive analysis framework?',
            'Would you like to see how similar companies benefit?',
            'Interested in a brief demonstration?'
          ];
        case 'casual':
          return [
            'Want to hop on a quick call?',
            'Should I send you some examples?',
            'Interested in learning more?',
            'Worth a chat?'
          ];
        case 'urgent':
          return [
            'Can we schedule an emergency briefing?',
            'Immediate action recommended - call today?',
            'Time-critical opportunity - respond ASAP',
            'Urgent consultation needed'
          ];
        case 'friendly':
          return [
            'Would love to chat about this!',
            'Happy to share more details',
            'Let me know if you\'d like to connect',
            'Would be great to discuss further'
          ];
        default:
          return ['Worth discussing?'];
      }
    }
    return ['Connect on this?'];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const replacePlaceholders = (text: string, tokens: Record<string, string>): string => {
    let result = text;
    Object.entries(tokens).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value);
    });
    return result;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Pitch Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Lead</label>
              <Select value={selectedLead?.id} onValueChange={(id) => setSelectedLead(mockLeads.find(l => l.id === id) || null)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockLeads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Channel</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel as any}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="phone">Phone Script</SelectItem>
                  <SelectItem value="ad">Ad Copy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone as any}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Generate</label>
              <Button 
                onClick={generatePitch} 
                disabled={isGenerating || !selectedLead}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Pitch
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Instructions (Optional)</label>
            <Textarea 
              placeholder="e.g., Focus on ROI, mention recent funding, emphasize urgency..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Generated Pitches */}
      {generatedPitches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {generatedPitches.map((pitch) => (
            <Card key={pitch.id} className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedChannel === 'email' && <Mail className="w-4 h-4" />}
                    {selectedChannel === 'linkedin' && <MessageSquare className="w-4 h-4" />}
                    {selectedChannel === 'phone' && <Phone className="w-4 h-4" />}
                    {selectedChannel === 'ad' && <Globe className="w-4 h-4" />}
                    {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)} Pitch
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {pitch.tone}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      <span className="text-xs font-medium">{pitch.engagement_score}%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="subject-lines">
                  <TabsList className="grid grid-cols-4 w-full text-xs">
                    <TabsTrigger value="subject-lines">Subjects</TabsTrigger>
                    <TabsTrigger value="hooks">Hooks</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="ctas">CTAs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="subject-lines" className="space-y-3 mt-4">
                    {pitch.subject_lines.map((subject, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-sm font-medium flex-1">
                            {replacePlaceholders(subject, pitch.personalization_tokens)}
                          </span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(replacePlaceholders(subject, pitch.personalization_tokens))}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        {/* Performance prediction */}
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Est. Open Rate: 32%</span>
                          <span>Est. Response: 8%</span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="hooks" className="space-y-3 mt-4">
                    {pitch.opening_hooks.map((hook, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm flex-1">
                            {replacePlaceholders(hook, pitch.personalization_tokens)}
                          </span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(replacePlaceholders(hook, pitch.personalization_tokens))}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="body" className="space-y-3 mt-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Pain Point References</h4>
                        {pitch.pain_point_references.slice(0, 2).map((pain, idx) => (
                          <div key={idx} className="p-2 bg-red-500/10 rounded text-xs mb-1">
                            {replacePlaceholders(pain, pitch.personalization_tokens)}
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Value Propositions</h4>
                        {pitch.value_propositions.slice(0, 2).map((value, idx) => (
                          <div key={idx} className="p-2 bg-green-500/10 rounded text-xs mb-1">
                            {replacePlaceholders(value, pitch.personalization_tokens)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ctas" className="space-y-3 mt-4">
                    {pitch.cta_options.map((cta, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm flex-1">
                            {replacePlaceholders(cta, pitch.personalization_tokens)}
                          </span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(replacePlaceholders(cta, pitch.personalization_tokens))}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Pitch Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.map((perf, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    {replacePlaceholders(perf.subject_line, {'{company}': 'TechCorp', '{similar_company}': 'GrowthCo', '{first_name}': 'John', '{pain_point}': 'lead generation', '{industry}': 'SaaS'})}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {perf.samples} samples
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">{perf.open_rate}%</div>
                  <div className="text-xs text-muted-foreground">open rate</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-success">{perf.response_rate}%</div>
                  <div className="text-xs text-muted-foreground">response</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
