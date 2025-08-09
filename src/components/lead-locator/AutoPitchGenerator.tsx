
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Zap, 
  Copy,
  RefreshCw,
  Send,
  Eye,
  Target,
  Heart,
  Brain
} from 'lucide-react';

interface AutoPitch {
  id: string;
  lead_name: string;
  company: string;
  subject_lines: string[];
  opening_hooks: string[];
  pain_point_references: string[];
  value_propositions: string[];
  cta_options: string[];
  emotional_triggers: string[];
  personalization_tokens: Record<string, string>;
  generated_email: string;
  engagement_score: number;
}

export default function AutoPitchGenerator() {
  const [selectedLead, setSelectedLead] = useState<string>('lead_1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState<AutoPitch | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');

  const mockPitch: AutoPitch = {
    id: 'pitch_1',
    lead_name: 'Sarah Chen',
    company: 'TechFlow Solutions',
    subject_lines: [
      'Quick question about your competitive analysis strategy',
      'How TechFlow can cut lead generation costs by 40%',
      'Sarah, solving lead intelligence gaps for SaaS companies',
      'Noticed you\'re evaluating market research solutions',
      '5-minute solution to your competitor tracking needs'
    ],
    opening_hooks: [
      'I noticed your recent LinkedIn post about finding better competitive intelligence tools...',
      'Saw that TechFlow is exploring options for market analysis',
      'Quick question - are you still evaluating lead generation providers?',
      'Many TechFlow teams are facing similar challenges with competitor tracking'
    ],
    pain_point_references: [
      'Like many SaaS companies, you\'re probably dealing with lead intelligence gaps',
      'The manual competitor research you mentioned is exactly what we specialize in',
      'We\'ve helped 200+ companies overcome lead generation challenges',
      'Your timing is perfect - we just released a solution for competitive analysis'
    ],
    value_propositions: [
      'Specifically built for 100-500 employee SaaS companies like TechFlow',
      'Reduce implementation time by 70% compared to traditional solutions',
      'ROI typically seen within 30 days of deployment',
      'Used by industry leaders like Slack and Zoom',
      'No lengthy contracts - see results in your first week'
    ],
    cta_options: [
      'Worth a 15-minute conversation?',
      'Can I send you a quick case study?',
      'Would a 5-minute demo be helpful?',
      'Should I send over our ROI calculator?',
      'Quick call to discuss your specific situation?'
    ],
    emotional_triggers: [
      'frustration with current tools',
      'fear of missing opportunities',
      'ambition for growth',
      'urgency to solve problems'
    ],
    personalization_tokens: {
      '{first_name}': 'Sarah',
      '{company}': 'TechFlow Solutions',
      '{title}': 'VP of Marketing',
      '{pain_point}': 'competitive intelligence gaps',
      '{industry}': 'SaaS Technology',
      '{location}': 'San Francisco, CA'
    },
    generated_email: `Subject: Quick question about your competitive analysis strategy

Hi Sarah,

I noticed your recent LinkedIn post about finding better competitive intelligence tools for TechFlow Solutions.

Like many SaaS companies, you're probably dealing with competitive intelligence gaps that slow down your marketing decisions.

We've helped 200+ companies overcome lead generation challenges, specifically built for 100-500 employee SaaS companies like TechFlow.

ROI typically seen within 30 days of deployment - no lengthy contracts, see results in your first week.

Worth a 15-minute conversation?

Best regards,
[Your Name]`,
    engagement_score: 89
  };

  const generatePitch = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedPitch(mockPitch);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getEngagementColor = (score: number) => {
    if (score >= 85) return 'text-green-400 bg-green-500/10';
    if (score >= 75) return 'text-orange-400 bg-orange-500/10';
    return 'text-yellow-400 bg-yellow-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Auto-Pitch Generator</h2>
          <p className="text-muted-foreground">AI-powered personalized outreach creation</p>
        </div>
        <Button onClick={generatePitch} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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

      {/* Custom Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Custom Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add specific messaging guidelines, company voice, or special offers to include in the pitch..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Generated Pitch */}
      {generatedPitch && (
        <div className="space-y-6">
          {/* Pitch Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Generated Pitch for {generatedPitch.lead_name}
                </CardTitle>
                <Badge className={`${getEngagementColor(generatedPitch.engagement_score)} border`}>
                  Engagement Score: {generatedPitch.engagement_score}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Final Email */}
              <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Generated Email</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedPitch.generated_email)}>
                      <Copy className="w-3 h-3 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="w-3 h-3 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
                <pre className="text-sm whitespace-pre-wrap font-mono bg-background/50 p-4 rounded border">
                  {generatedPitch.generated_email}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Pitch Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Lines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject Line Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedPitch.subject_lines.map((subject, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded hover:bg-muted/50">
                      <span className="text-sm">{subject}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(subject)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opening Hooks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opening Hooks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedPitch.opening_hooks.map((hook, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded hover:bg-muted/50">
                      <span className="text-sm">{hook}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(hook)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Value Propositions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Value Propositions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedPitch.value_propositions.map((value, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded hover:bg-muted/50">
                      <span className="text-sm">{value}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(value)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Call-to-Action Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedPitch.cta_options.map((cta, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded hover:bg-muted/50">
                      <span className="text-sm">{cta}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(cta)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotional Triggers & Personalization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  Emotional Triggers Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {generatedPitch.emotional_triggers.map((trigger, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Personalization Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(generatedPitch.personalization_tokens).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="font-mono text-muted-foreground">{key}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card>
            <CardContent className="flex gap-2 pt-6">
              <Button className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send via Email
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                LinkedIn Message
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
