import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  RefreshCw, 
  Send, 
  Copy, 
  TrendingUp, 
  Target, 
  Zap,
  Mail,
  Phone,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedLead } from '@/services/specterNetIntegration';
import { AutoPitch } from '@/services/warmLeadProspector';

export interface AutoPitchGeneratorProps {
  lead: EnhancedLead;
  pitch: AutoPitch;
  onRegeneratePitch: () => void;
  onSendPitch: (pitchContent: string) => void;
}

const AutoPitchGenerator: React.FC<AutoPitchGeneratorProps> = ({ 
  lead, 
  pitch, 
  onRegeneratePitch, 
  onSendPitch 
}) => {
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [selectedOpening, setSelectedOpening] = useState(0);
  const [selectedPainPoint, setSelectedPainPoint] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedCTA, setSelectedCTA] = useState(0);
  const [customPitch, setCustomPitch] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const { toast } = useToast();

  // Mock pitch data if none provided
  const mockPitch: AutoPitch = useMemo(() => {
    if (pitch && pitch.subject_lines) return pitch;
    
    return {
      id: `pitch-${Date.now()}`,
      lead_id: lead.id || `lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      subject_lines: [
        `Quick question about ${lead.company || 'your company'}'s growth strategy`,
        `Helping ${lead.company || 'companies like yours'} with competitive intelligence`,
        `${lead.name}, noticed your interest in market research tools`,
        `${lead.name}, transform your competitive strategy in 30 days`
      ],
      opening_hooks: [
        `Hi ${lead.name}, I noticed you've been researching competitive intelligence solutions recently.`,
        `${lead.name}, I saw that ${lead.company || 'your company'} is looking into market research tools.`,
        `Hey ${lead.name}, based on your recent search activity, it looks like you're exploring ways to gain competitive advantages.`,
        `${lead.name}, I came across your company while researching businesses that are actively improving their market positioning.`
      ],
      pain_point_references: [
        `Many companies struggle with staying ahead of their competition without the right intelligence tools.`,
        `I understand how challenging it can be to make strategic decisions without comprehensive market data.`,
        `It's frustrating when you know there's valuable competitive information out there but can't access it efficiently.`,
        `Most businesses miss crucial market opportunities because they don't have real-time competitive insights.`
      ],
      value_propositions: [
        `Our platform provides real-time competitive intelligence that can give ${lead.company || 'your company'} a significant advantage in your market.`,
        `We help businesses like yours turn competitive data into actionable insights that drive growth.`,
        `With our solution, you can monitor your competitors' strategies and respond faster than ever before.`,
        `Our clients typically see a 40% improvement in market positioning within the first 90 days.`
      ],
      cta_options: [
        `Would you be interested in a 15-minute demo to see how this could work for ${lead.company || 'your company'}?`,
        `I'd love to show you how our competitive intelligence platform could help. Are you free for a brief call this week?`,
        `Would you like to see some examples of the insights we've generated for similar companies in your space?`,
        `How about a quick screen share to show you exactly what competitive data we can uncover for your industry?`
      ],
      engagement_score: Math.floor(Math.random() * 25) + 75, // 75-100
      personalization_tokens: {
        '{first_name}': lead.name || 'there',
        '{company}': lead.company || 'your company',
        '{industry}': lead.intent_keywords?.[0] || 'your industry',
        '{location}': lead.geo_context?.city || 'your area'
      }
    };
  }, [pitch, lead]);

  const generateFullPitch = () => {
    const subject = mockPitch.subject_lines[selectedSubject];
    const opening = mockPitch.opening_hooks[selectedOpening];
    const painPoint = mockPitch.pain_point_references[selectedPainPoint];
    const value = mockPitch.value_propositions[selectedValue];
    const cta = mockPitch.cta_options[selectedCTA];

    return {
      subject,
      body: `${opening}\n\n${painPoint}\n\n${value}\n\n${cta}\n\nBest regards,\nYour Name`
    };
  };

  const fullPitch = generateFullPitch();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Pitch content copied successfully"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleSendPitch = () => {
    const pitchToSend = isCustomMode ? customPitch : fullPitch.body;
    onSendPitch(pitchToSend);
    toast({
      title: "Pitch sent successfully",
      description: `Outreach sent to ${lead.name} at ${lead.company}`
    });
  };

  const getEngagementColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Lead Context Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{lead.name}</h3>
                <p className="text-muted-foreground">{lead.title} at {lead.company}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {lead.email}
                </span>
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {lead.phone}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {lead.intent_keywords?.slice(0, 3).map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Target className="w-3 h-3 mr-1" />
                {lead.intent_score}% Intent
              </Badge>
              <div className="text-sm text-muted-foreground">
                Urgency: {lead.urgency_score}%
              </div>
              <Badge className={`${getEngagementColor(mockPitch.engagement_score)}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {mockPitch.engagement_score}% Engagement
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pitch Generator */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              AI-Powered Pitch Generator
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {isCustomMode ? 'Use Templates' : 'Custom Mode'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRegeneratePitch}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isCustomMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Custom Pitch Content
                </label>
                <Textarea
                  placeholder="Write your personalized pitch here..."
                  value={customPitch}
                  onChange={(e) => setCustomPitch(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          ) : (
            <Tabs defaultValue="components" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="components">Build Components</TabsTrigger>
                <TabsTrigger value="preview">Preview & Send</TabsTrigger>
              </TabsList>
              
              <TabsContent value="components" className="space-y-6">
                {/* Subject Lines */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Subject Line Options</h4>
                  <div className="grid gap-2">
                    {mockPitch.subject_lines.map((subject, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedSubject === index
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-muted/30 border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedSubject(index)}
                      >
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opening Hooks */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Opening Hook</h4>
                  <div className="grid gap-2">
                    {mockPitch.opening_hooks.map((opening, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedOpening === index
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-muted/30 border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedOpening(index)}
                      >
                        {opening}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pain Point References */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Pain Point Reference</h4>
                  <div className="grid gap-2">
                    {mockPitch.pain_point_references.map((painPoint, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedPainPoint === index
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-muted/30 border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedPainPoint(index)}
                      >
                        {painPoint}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value Propositions */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Value Proposition</h4>
                  <div className="grid gap-2">
                    {mockPitch.value_propositions.map((value, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedValue === index
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-muted/30 border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedValue(index)}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Call to Action</h4>
                  <div className="grid gap-2">
                    {mockPitch.cta_options.map((cta, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedCTA === index
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-muted/30 border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedCTA(index)}
                      >
                        {cta}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Subject Line</h4>
                    <div className="p-3 bg-muted/30 rounded-lg border">
                      {fullPitch.subject}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Email Body</h4>
                    <div className="p-4 bg-muted/30 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm text-foreground">
                        {fullPitch.body}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <Button
              onClick={() => copyToClipboard(isCustomMode ? customPitch : fullPitch.body)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Pitch
            </Button>
            <Button
              onClick={handleSendPitch}
              disabled={isCustomMode && !customPitch.trim()}
              className="flex items-center gap-2 bg-success hover:bg-success/90"
            >
              <Send className="w-4 h-4" />
              Send Pitch
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Schedule Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoPitchGenerator;
