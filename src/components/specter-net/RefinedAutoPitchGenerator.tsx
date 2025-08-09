import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { generateRefinedPitch } from '@/services/specterNet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Rocket, User, Mail, Phone, MapPin, Briefcase, MessageSquare, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RefinedAutoPitchGenerator() {
  const [leadDetails, setLeadDetails] = useState<any>(null);
  const [pitchType, setPitchType] = useState<string>('introductory');
  const [generatedPitch, setGeneratedPitch] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching lead details
    const mockLead = {
      id: "lead-1",
      name: "Sarah Chen",
      email: "sarah@innovatech.com", 
      company: "InnovaTech Solutions",
      title: "VP of Marketing",
      intent_score: 87.5,
      geo_context: {
        city: "San Francisco",
        state: "CA", 
        zip: "94105"
      },
      intent_keywords: ["marketing automation", "lead generation", "competitor analysis"],
      search_patterns: ["best marketing automation tools", "competitor analysis software"],
      competitor_references: ["HubSpot", "Salesforce", "Marketo"],
      urgency_score: 92.3,
      source: "google_ads",
      source_data: {
        ad_platform: "Google Ads",
        campaign_name: "Marketing Automation Tools",
        click_timestamp: "2024-01-15T14:30:00Z"
      },
      last_search_activity: "2024-01-15T14:30:00Z",
      status: "active" as const,
      created_at: "2024-01-15T14:30:00Z",
      updated_at: "2024-01-15T14:30:00Z"
    };
    setLeadDetails(mockLead);
  }, []);

  const handleGeneratePitch = async () => {
    if (!leadDetails) {
      toast({
        title: "Error",
        description: "Lead details not available.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const pitch = await generateRefinedPitch(leadDetails, pitchType);
      setGeneratedPitch(pitch);
      toast({
        title: "Pitch Generated",
        description: "Your refined pitch is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate pitch.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPitch);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Pitch copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Lead Details Card */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5" /> Lead Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Company
              </p>
              <p className="text-foreground">{leadDetails?.company || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </p>
              <a href={`mailto:${leadDetails?.email}`} className="text-foreground hover:underline">
                {leadDetails?.email || 'N/A'}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Name
              </p>
              <p className="text-foreground">{leadDetails?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Link className="w-4 h-4" /> Title
              </p>
              <p className="text-foreground">{leadDetails?.title || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </p>
              <p className="text-foreground">
                {(leadDetails?.geo_context?.city && leadDetails?.geo_context?.state) ? `${leadDetails.geo_context.city}, ${leadDetails.geo_context.state}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Intent Keywords
              </p>
              <p className="text-foreground">{leadDetails?.intent_keywords?.join(', ') || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pitch Type Selection */}
      <div className="space-y-2">
        <h4 className="text-md font-semibold">Select Pitch Type</h4>
        <Select onValueChange={setPitchType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Introductory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="introductory">Introductory</SelectItem>
            <SelectItem value="follow_up">Follow Up</SelectItem>
            <SelectItem value="personalized">Personalized</SelectItem>
            <SelectItem value="competitive">Competitive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Generate Pitch Button */}
      <Button onClick={handleGeneratePitch} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating Pitch...
          </>
        ) : (
          <>
            Generate Pitch <Rocket className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {/* Generated Pitch Textarea */}
      {generatedPitch && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Generated Pitch</h4>
          <Textarea
            value={generatedPitch}
            readOnly
            className="resize-none h-48"
          />
          <Button
            variant="secondary"
            onClick={handleCopyToClipboard}
            disabled={isCopied}
            className="w-full"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
