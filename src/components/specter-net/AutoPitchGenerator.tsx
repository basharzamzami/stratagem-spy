
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Zap, 
  Copy,
  RefreshCw,
  Send,
  Eye,
  ThumbsUp,
  BarChart3
} from 'lucide-react';
import { AutoPitch } from '@/services/warmLeadProspector';
import { EnhancedLead } from '@/services/specterNetIntegration';
import { useToast } from '@/hooks/use-toast';

interface AutoPitchGeneratorProps {
  lead: EnhancedLead;
  pitch: AutoPitch;
  onRegeneratePitch: () => void;
  onSendPitch: (pitchContent: string) => void;
}

const AutoPitchGenerator = ({ lead, pitch, onRegeneratePitch, onSendPitch }: AutoPitchGeneratorProps) => {
  const [selectedSubject, setSelectedSubject] = useState(pitch.subject_lines[0]);
  const [selectedOpening, setSelectedOpening] = useState(pitch.opening_hooks[0]);
  const [selectedPainPoint, setSelectedPainPoint] = useState(pitch.pain_point_references[0]);
  const [selectedValue, setSelectedValue] = useState(pitch.value_propositions[0]);
  const [selectedCTA, setSelectedCTA] = useState(pitch.cta_options[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [previewMode, setPreviewMode] = useState<'email' | 'linkedin' | 'custom'>('email');
  const { toast } = useToast();

  const generateFinalPitch = () => {
    let message = '';
    
    if (previewMode === 'custom') {
      message = customMessage;
    } else {
      // Apply personalization tokens
      let personalizedOpening = selectedOpening;
      let personalizedPainPoint = selectedPainPoint;
      let personalizedValue = selectedValue;
      
      Object.entries(pitch.personalization_tokens).forEach(([token, value]) => {
        personalizedOpening = personalizedOpening.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
        personalizedPainPoint = personalizedPainPoint.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
        personalizedValue = personalizedValue.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
      });
      
      if (previewMode === 'email') {
        message = `Subject: ${selectedSubject}

Hi ${pitch.personalization_tokens['{first_name}']},

${personalizedOpening}

${personalizedPainPoint}

${personalizedValue}

${selectedCTA}

Best regards,
[Your Name]

P.S. This won't take more than 15 minutes of your time, and I think you'll find the insights valuable for ${pitch.personalization_tokens['{company}']}.`;
      } else if (previewMode === 'linkedin') {
        message = `${personalizedOpening}

${personalizedPainPoint}

${personalizedValue}

${selectedCTA}

Best,
[Your Name]`;
      }
    }
    
    return message;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The pitch has been copied to your clipboard"
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
    const finalPitch = generateFinalPitch();
    onSendPitch(finalPitch);
    toast({
      title: "Pitch sent",
      description: "Your personalized pitch has been sent to the lead"
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Auto-Pitch Generator
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Personalized pitch for {lead.name} at {lead.company}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`${getScoreColor(pitch.engagement_score)} border-current`}>
                <BarChart3 className="w-3 h-3 mr-1" />
                {pitch.engagement_score.toFixed(0)} Score
              </Badge>
              <Button variant="outline" size="sm" onClick={onRegeneratePitch}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pitch Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component Selection */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Pitch Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Lines */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Subject Line</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pitch.subject_lines.map((subject, index) => (
                    <SelectItem key={index} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opening Hooks */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Opening Hook</label>
              <Select value={selectedOpening} onValueChange={setSelectedOpening}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pitch.opening_hooks.map((hook, index) => (
                    <SelectItem key={index} value={hook}>
                      {hook.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pain Point References */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Pain Point Reference</label>
              <Select value={selectedPainPoint} onValueChange={setSelectedPainPoint}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pitch.pain_point_references.map((pain, index) => (
                    <SelectItem key={index} value={pain}>
                      {pain.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value Propositions */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Value Proposition</label>
              <Select value={selectedValue} onValueChange={setSelectedValue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pitch.value_propositions.map((value, index) => (
                    <SelectItem key={index} value={value}>
                      {value.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CTAs */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Call to Action</label>
              <Select value={selectedCTA} onValueChange={setSelectedCTA}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pitch.cta_options.map((cta, index) => (
                    <SelectItem key={index} value={cta}>
                      {cta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Personalization Tokens */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Personalization Data</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(pitch.personalization_tokens).map(([token, value]) => (
                  <Badge key={token} variant="secondary" className="text-xs">
                    {token}: {value}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Pitch Preview
              </CardTitle>
              <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {previewMode === 'custom' ? (
              <div className="space-y-4">
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Write your custom pitch here..."
                  className="min-h-80 resize-none"
                />
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4 min-h-80">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                  {generateFinalPitch()}
                </pre>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(generateFinalPitch())}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" onClick={handleSendPitch}>
                <Send className="w-4 h-4 mr-2" />
                Send Pitch
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoPitchGenerator;
