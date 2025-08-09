
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Wand2, Copy, Send, TrendingUp, Target, Mail, Phone, MessageSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GeneratedPitch {
  id: string;
  leadName: string;
  company: string;
  industry: string;
  subject: string;
  opening: string;
  painPoint: string;
  solution: string;
  cta: string;
  personalizedTokens: Record<string, string>;
  engagementScore: number;
  createdAt: string;
  status: 'draft' | 'sent' | 'opened' | 'replied';
}

const mockPitches: GeneratedPitch[] = [
  {
    id: '1',
    leadName: 'Sarah Chen',
    company: 'TechFlow Solutions',
    industry: 'SaaS',
    subject: 'Sarah, quick question about TechFlow\'s competitive analysis strategy',
    opening: 'Hi Sarah, I noticed TechFlow Solutions has been actively hiring for marketing roles...',
    painPoint: 'Like many fast-growing SaaS companies, you\'re probably dealing with the challenge of staying ahead of competitors while scaling your marketing efforts.',
    solution: 'We\'ve helped 200+ SaaS companies gain competitive intelligence that directly informed their $10M+ marketing decisions. Our clients typically see 40% faster time-to-market with new campaigns.',
    cta: 'Worth a 15-minute conversation to see how this could work for TechFlow?',
    personalizedTokens: {
      '{first_name}': 'Sarah',
      '{company}': 'TechFlow Solutions',
      '{industry}': 'SaaS',
      '{pain_point}': 'competitive analysis gaps',
      '{location}': 'San Francisco, CA'
    },
    engagementScore: 88,
    createdAt: '2 hours ago',
    status: 'draft'
  },
  {
    id: '2',
    leadName: 'Marcus Rodriguez',
    company: 'HealthTech Innovations',
    industry: 'Healthcare',
    subject: 'How similar HealthTech companies cut acquisition costs by 35%',
    opening: 'Hi Marcus, saw that HealthTech Innovations is expanding operations...',
    painPoint: 'The healthcare technology space is incredibly competitive, and understanding what your competitors are doing with their marketing spend can make or break your growth trajectory.',
    solution: 'We specialize in healthcare competitive intelligence - companies like MedDevice Corp and HealthFlow Pro use our insights to optimize their marketing spend and reduce CAC by 35% on average.',
    cta: 'Should I send you a quick case study from a similar healthcare tech company?',
    personalizedTokens: {
      '{first_name}': 'Marcus',
      '{company}': 'HealthTech Innovations',
      '{industry}': 'Healthcare Technology',
      '{pain_point}': 'competitive marketing intelligence',
      '{location}': 'Austin, TX'
    },
    engagementScore: 92,
    createdAt: '5 hours ago',
    status: 'sent'
  },
  {
    id: '3',
    leadName: 'Jennifer Kim',
    company: 'Real Estate Pro',
    industry: 'Real Estate',
    subject: 'Jennifer, noticed Real Estate Pro\'s recent market expansion',
    opening: 'Hi Jennifer, I came across Real Estate Pro\'s LinkedIn post about expanding into new markets...',
    painPoint: 'Market expansion in real estate requires deep competitive intelligence - knowing what marketing strategies work in different regions and what your competitors are spending.',
    solution: 'We\'ve helped real estate companies like PropertyFlow and Urban Realty gain market intelligence that directly contributed to successful expansions, with 60% higher lead generation in new markets.',
    cta: 'Quick call to discuss your expansion strategy?',
    personalizedTokens: {
      '{first_name}': 'Jennifer',
      '{company}': 'Real Estate Pro',
      '{industry}': 'Real Estate',
      '{pain_point}': 'market expansion intelligence',
      '{location}': 'Miami, FL'
    },
    engagementScore: 85,
    createdAt: '1 day ago',
    status: 'opened'
  }
];

const pitchTemplates = [
  { name: 'Pain Point + Solution', category: 'Problem Solving' },
  { name: 'Social Proof + Case Study', category: 'Trust Building' },
  { name: 'Industry Trend + Opportunity', category: 'Market Insight' },
  { name: 'Competitor Analysis + Advantage', category: 'Competitive Edge' },
  { name: 'ROI Focused + Quick Wins', category: 'Value Proposition' }
];

export default function AutoPitchGenerator() {
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPitches, setGeneratedPitches] = useState<GeneratedPitch[]>(mockPitches);

  const generatePitch = async () => {
    setIsGenerating(true);
    
    // Simulate AI pitch generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPitch: GeneratedPitch = {
      id: Date.now().toString(),
      leadName: 'David Thompson',
      company: 'E-Commerce Plus',
      industry: 'E-Commerce',
      subject: 'David, quick question about E-Commerce Plus\' competitive positioning',
      opening: 'Hi David, I noticed E-Commerce Plus has been actively optimizing its marketing stack...',
      painPoint: 'E-commerce companies often struggle with understanding competitor pricing strategies and promotional tactics that could impact their market share.',
      solution: 'Our competitive intelligence platform helped companies like ShopFlow and RetailEdge increase their market share by 25% through better understanding of competitor strategies.',
      cta: 'Would a 10-minute demo showing competitor insights be valuable?',
      personalizedTokens: {
        '{first_name}': 'David',
        '{company}': 'E-Commerce Plus',
        '{industry}': 'E-Commerce',
        '{pain_point}': 'competitive positioning',
        '{location}': 'Seattle, WA'
      },
      engagementScore: 87,
      createdAt: 'Just now',
      status: 'draft'
    };

    setGeneratedPitches([newPitch, ...generatedPitches]);
    setIsGenerating(false);
  };

  const copyPitch = (pitchId: string) => {
    const pitch = generatedPitches.find(p => p.id === pitchId);
    if (pitch) {
      const fullPitch = `Subject: ${pitch.subject}\n\n${pitch.opening}\n\n${pitch.painPoint}\n\n${pitch.solution}\n\n${pitch.cta}`;
      navigator.clipboard.writeText(fullPitch);
    }
  };

  const sendPitch = (pitchId: string) => {
    setGeneratedPitches(pitches => 
      pitches.map(p => p.id === pitchId ? { ...p, status: 'sent' as const } : p)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'opened': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalPitches = generatedPitches.length;
  const sentPitches = generatedPitches.filter(p => p.status === 'sent').length;
  const openRate = generatedPitches.filter(p => p.status === 'opened').length;
  const avgEngagement = Math.round(generatedPitches.reduce((sum, p) => sum + p.engagementScore, 0) / generatedPitches.length);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pitches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalPitches}</div>
            <div className="text-sm text-muted-foreground">Generated this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent Pitches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{sentPitches}</div>
            <div className="text-sm text-muted-foreground">Active outreach campaigns</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{Math.round((openRate / sentPitches) * 100)}%</div>
            <div className="text-sm text-muted-foreground">Above industry average</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{avgEngagement}</div>
            <div className="text-sm text-muted-foreground">AI confidence score</div>
          </CardContent>
        </Card>
      </div>

      {/* Pitch Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Pitch Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Lead</label>
              <Select value={selectedLead} onValueChange={setSelectedLead}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a warm lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Chen - TechFlow Solutions</SelectItem>
                  <SelectItem value="marcus">Marcus Rodriguez - HealthTech</SelectItem>
                  <SelectItem value="jennifer">Jennifer Kim - Real Estate Pro</SelectItem>
                  <SelectItem value="david">David Thompson - E-Commerce Plus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Pitch Template</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent>
                  {pitchTemplates.map((template, index) => (
                    <SelectItem key={index} value={template.name}>
                      {template.name} ({template.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generatePitch} 
                disabled={isGenerating || !selectedLead}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Pitch
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Custom Instructions (Optional)</label>
            <Textarea
              placeholder="Add specific talking points, recent company news, or personalization details..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="min-h-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generated Pitches */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Generated Pitches</h3>
        
        {generatedPitches.map((pitch) => (
          <Card key={pitch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{pitch.leadName} - {pitch.company}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{pitch.industry} • {pitch.createdAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(pitch.status)}>
                    {pitch.status.charAt(0).toUpperCase() + pitch.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                    {pitch.engagementScore}% AI Score
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject Line</label>
                <div className="mt-1 p-3 bg-muted/20 rounded-lg">
                  <p className="text-sm">{pitch.subject}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Body</label>
                <div className="mt-1 p-4 bg-muted/20 rounded-lg space-y-3">
                  <p className="text-sm">{pitch.opening}</p>
                  <p className="text-sm">{pitch.painPoint}</p>
                  <p className="text-sm">{pitch.solution}</p>
                  <p className="text-sm font-medium">{pitch.cta}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Engagement Prediction</label>
                <div className="flex items-center gap-3">
                  <Progress value={pitch.engagementScore} className="flex-1" />
                  <span className="text-sm font-medium">{pitch.engagementScore}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" variant="outline" onClick={() => copyPitch(pitch.id)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                {pitch.status === 'draft' && (
                  <Button size="sm" onClick={() => sendPitch(pitch.id)}>
                    <Send className="w-3 h-3 mr-1" />
                    Send
                  </Button>
                )}
                {pitch.status !== 'draft' && (
                  <Button size="sm" variant="outline">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
