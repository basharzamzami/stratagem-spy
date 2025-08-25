import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Target, 
  MessageSquare, 
  Copy, 
  RefreshCw, 
  Zap,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  TrendingUp
} from 'lucide-react';
import type { EnhancedLead } from '@/services/specterNetIntegration';

interface RefinedPitch {
  id: string;
  subject_line: string;
  opening_hook: string;
  pain_point_reference: string;
  value_proposition: string;
  social_proof: string;
  call_to_action: string;
  personalization_score: number;
  estimated_response_rate: number;
}

export default function RefinedAutoPitchGenerator() {
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [pitchType, setPitchType] = useState<string>('');
  const [generatedPitch, setGeneratedPitch] = useState<RefinedPitch | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock leads data with complete EnhancedLead properties
  const mockLeads: EnhancedLead[] = [
    {
      id: 'lead_1',
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      company: 'TechCorp Solutions',
      title: 'VP of Marketing',
      phone: '(555) 123-4567',
      location_city: 'San Francisco',
      location_state: 'CA',
      location_zip: '94105',
      intent_score: 92,
      source: 'lead_locator',
      source_data: {
        recent_activity: 'Downloaded competitive analysis whitepaper',
        engagement_history: ['website_visit', 'whitepaper_download', 'pricing_page_view']
      },
      enrichment_data: {
        company_size: '100-500 employees',
        industry: 'Technology',
        revenue_estimate: '$10M-50M'
      },
      status: 'new',
      tags: ['high-intent', 'competitive-analysis'],
      notes: 'Strong buying signals detected',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'mock-user-id',
      intent_keywords: ['competitive analysis', 'market intelligence', 'growth strategies'],
      search_patterns: ['pricing comparison', 'competitor research', 'market analysis tools'],
      competitor_references: ['SimilarWeb', 'SEMrush'],
      urgency_score: 88,
      last_search_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      geo_context: {
        market_size: 'Large',
        competition_level: 'High',
        local_trends: ['AI/ML adoption', 'Remote work tools'],
        city: 'San Francisco',
        state: 'CA',
        zip: '94105'
      }
    }
  ];

  const pitchTypes = [
    { value: 'cold_outreach', label: 'Cold Outreach' },
    { value: 'warm_follow_up', label: 'Warm Follow-up' },
    { value: 'competitor_hijack', label: 'Competitor Hijack' },
    { value: 'urgency_based', label: 'Urgency-Based' },
    { value: 'value_focused', label: 'Value-Focused' }
  ];

  const generatePitch = async () => {
    if (!selectedLead || !pitchType) return;

    setIsGenerating(true);
    
    // Simulate AI pitch generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const lead = mockLeads.find(l => l.id === selectedLead);
    if (!lead) return;

    const mockPitch: RefinedPitch = {
      id: `pitch_${Date.now()}`,
      subject_line: `${lead.name}, quick question about ${lead.company}'s competitive strategy`,
      opening_hook: `Hi ${lead.name?.split(' ')[0]}, I noticed ${lead.company} has been researching competitive analysis solutions...`,
      pain_point_reference: `Like many ${lead.enrichment_data?.industry} companies, you're probably dealing with fragmented market intelligence`,
      value_proposition: `We've helped 200+ companies like ${lead.company} increase their competitive advantage by 40% within 30 days`,
      social_proof: `Companies like TechFlow and GrowthLabs saw immediate ROI improvements after switching to our platform`,
      call_to_action: `Worth a 15-minute conversation to see how this applies to ${lead.company}?`,
      personalization_score: Math.floor(Math.random() * 20) + 80,
      estimated_response_rate: Math.floor(Math.random() * 15) + 15
    };

    setGeneratedPitch(mockPitch);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectedLeadData = mockLeads.find(l => l.id === selectedLead);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Pitch Generator</h2>
            <p className="text-sm text-muted-foreground">Generate personalized outreach messages</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Lead Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Select Lead
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedLead} onValueChange={setSelectedLead}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lead..." />
                </SelectTrigger>
                <SelectContent>
                  {mockLeads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">{lead.company}</div>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          {lead.intent_score}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedLeadData && (
                <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-3 h-3" />
                    {selectedLeadData.name} - {selectedLeadData.title}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-3 h-3" />
                    {selectedLeadData.company}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-3 h-3" />
                    {selectedLeadData.geo_context?.city || selectedLeadData.location_city}, {selectedLeadData.geo_context?.state || selectedLeadData.location_state}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-3 h-3" />
                    Intent Score: {selectedLeadData.intent_score}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pitch Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Pitch Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={pitchType} onValueChange={setPitchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pitch type..." />
                </SelectTrigger>
                <SelectContent>
                  {pitchTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            onClick={generatePitch}
            disabled={!selectedLead || !pitchType || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Pitch...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate AI Pitch
              </>
            )}
          </Button>
        </div>

        {/* Generated Pitch */}
        <div className="space-y-6">
          {generatedPitch ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Generated Pitch
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {generatedPitch.personalization_score}% Personalized
                    </Badge>
                    <Badge variant="outline">
                      {generatedPitch.estimated_response_rate}% Response Rate
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject Line */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Subject Line</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedPitch.subject_line)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={generatedPitch.subject_line}
                    readOnly
                    className="resize-none"
                    rows={1}
                  />
                </div>

                {/* Opening Hook */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Opening Hook</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedPitch.opening_hook)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={generatedPitch.opening_hook}
                    readOnly
                    className="resize-none"
                    rows={2}
                  />
                </div>

                {/* Pain Point Reference */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Pain Point Reference</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedPitch.pain_point_reference)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={generatedPitch.pain_point_reference}
                    readOnly
                    className="resize-none"
                    rows={2}
                  />
                </div>

                {/* Value Proposition */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Value Proposition</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedPitch.value_proposition)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={generatedPitch.value_proposition}
                    readOnly
                    className="resize-none"
                    rows={2}
                  />
                </div>

                {/* Social Proof */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Social Proof</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedPitch.social_proof)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={generatedPitch.social_proof}
                    readOnly
                    className="resize-none"
                    rows={2}
                  />
                </div>

                {/* Call to Action */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Call to Action</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedPitch.call_to_action)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={generatedPitch.call_to_action}
                    readOnly
                    className="resize-none"
                    rows={1}
                  />
                </div>

                {/* Full Pitch */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Complete Pitch</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const fullPitch = `Subject: ${generatedPitch.subject_line}

${generatedPitch.opening_hook}

${generatedPitch.pain_point_reference}

${generatedPitch.value_proposition}

${generatedPitch.social_proof}

${generatedPitch.call_to_action}`;
                        copyToClipboard(fullPitch);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={`${generatedPitch.opening_hook}\n\n${generatedPitch.pain_point_reference}\n\n${generatedPitch.value_proposition}\n\n${generatedPitch.social_proof}\n\n${generatedPitch.call_to_action}`}
                    readOnly
                    className="resize-none"
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Pitch Generated</h3>
                <p className="text-sm text-muted-foreground">
                  Select a lead and pitch type, then click "Generate AI Pitch" to create a personalized outreach message.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
