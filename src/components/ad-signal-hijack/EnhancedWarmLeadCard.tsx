
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MapPin, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Eye,
  Zap,
  Target,
  Building,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WarmLead {
  id: string;
  name: string;
  company: string;
  title: string;
  location: string;
  intentKeywords: string[];
  searchPattern: string;
  urgencyScore: number;
  lastActivity: string;
  source: string;
  competitorMentioned: string[];
  email: string;
  phone: string;
  companySize: string;
  industry: string;
  signals: string[];
}

interface EnhancedWarmLeadCardProps {
  lead: WarmLead;
}

export default function EnhancedWarmLeadCard({ lead }: EnhancedWarmLeadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const getUrgencyColor = (score: number) => {
    if (score >= 90) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (score >= 80) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const getUrgencyLabel = (score: number) => {
    if (score >= 90) return 'CRITICAL';
    if (score >= 80) return 'HIGH';
    if (score >= 70) return 'MEDIUM';
    return 'LOW';
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'google trends': return 'bg-green-500/20 text-green-400';
      case 'linkedin search': return 'bg-blue-500/20 text-blue-400';
      case 'reddit forums': return 'bg-orange-500/20 text-orange-400';
      case 'google search': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const generateCampaign = () => {
    toast({
      title: "🚀 Campaign Generated",
      description: `Personalized campaign created for ${lead.name} at ${lead.company}`
    });
  };

  const viewFullProfile = () => {
    toast({
      title: "Profile Loading",
      description: `Loading detailed profile for ${lead.name}`
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-success/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <Badge className={getUrgencyColor(lead.urgencyScore)} variant="outline">
                  {getUrgencyLabel(lead.urgencyScore)} ({lead.urgencyScore})
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{lead.title}</span>
                  <span className="text-muted-foreground">at</span>
                  <span className="font-medium">{lead.company}</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {lead.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lead.lastActivity}
                  </div>
                  <Badge className={getSourceColor(lead.source)} variant="outline" className="text-xs">
                    {lead.source}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intent Score Visual */}
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Intent Score</span>
            <span className="font-medium">{lead.urgencyScore}/100</span>
          </div>
          <Progress value={lead.urgencyScore} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Intent */}
        <div className="bg-muted/30 rounded-lg p-3 border-l-4 border-l-primary">
          <div className="text-sm font-medium text-foreground mb-1">Recent Search Pattern:</div>
          <p className="text-sm text-muted-foreground italic">"{lead.searchPattern}"</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {lead.intentKeywords.slice(0, 3).map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {lead.intentKeywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lead.intentKeywords.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Industry:</span>
            <div className="font-medium">{lead.industry}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Company Size:</span>
            <div className="font-medium">{lead.companySize}</div>
          </div>
        </div>

        {/* Competitor Intelligence */}
        {lead.competitorMentioned.length > 0 && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-muted-foreground">Researching:</span>
            {lead.competitorMentioned.map((comp, idx) => (
              <Badge key={idx} variant="outline" className="text-xs border-orange-500/30 text-orange-400">
                {comp}
              </Badge>
            ))}
          </div>
        )}

        {/* Intent Signals - Expandable */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Intent Signals
              </div>
              <div className="space-y-1">
                {lead.signals.map((signal, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-success mt-2 flex-shrink-0" />
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{lead.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" onClick={generateCampaign}>
            <Zap className="w-3 h-3 mr-1" />
            Generate Campaign
          </Button>
          <Button size="sm" variant="outline" onClick={viewFullProfile}>
            <Eye className="w-3 h-3 mr-1" />
            Full Profile
          </Button>
          <Button size="sm" variant="outline">
            <TrendingUp className="w-3 h-3 mr-1" />
            Track
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
