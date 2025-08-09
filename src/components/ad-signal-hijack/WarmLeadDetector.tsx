
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  MapPin, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Zap,
  Target
} from 'lucide-react';

interface WarmLead {
  id: string;
  name: string;
  company: string;
  location: string;
  intentKeywords: string[];
  searchPattern: string;
  urgencyScore: number;
  lastActivity: string;
  source: string;
  competitorMentioned: string[];
}

export default function WarmLeadDetector() {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [geoTargets, setGeoTargets] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [warmLeads, setWarmLeads] = useState<WarmLead[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  const mockWarmLeads: WarmLead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechScale Solutions',
      location: 'San Francisco, CA',
      intentKeywords: ['marketing automation', 'lead generation'],
      searchPattern: 'alternatives to HubSpot pricing',
      urgencyScore: 94,
      lastActivity: '12 minutes ago',
      source: 'Google Trends',
      competitorMentioned: ['HubSpot', 'Salesforce']
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      company: 'Growth Dynamics',
      location: 'Austin, TX',
      intentKeywords: ['competitive analysis', 'market research'],
      searchPattern: 'best competitive intelligence tools 2025',
      urgencyScore: 89,
      lastActivity: '27 minutes ago',
      source: 'LinkedIn Search',
      competitorMentioned: ['SimilarWeb', 'Ahrefs']
    },
    {
      id: '3',
      name: 'Emily Foster',
      company: 'Apex Marketing',
      location: 'New York, NY',
      intentKeywords: ['ad tracking', 'competitor monitoring'],
      searchPattern: 'how to spy on competitor facebook ads',
      urgencyScore: 85,
      lastActivity: '45 minutes ago',
      source: 'Reddit Forums',
      competitorMentioned: ['AdSpy', 'BigSpy']
    }
  ];

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }
    
    setWarmLeads(mockWarmLeads);
    setIsScanning(false);
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 90) return 'text-red-400 bg-red-500/10';
    if (score >= 80) return 'text-orange-400 bg-orange-500/10';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-blue-400 bg-blue-500/10';
  };

  const getUrgencyLabel = (score: number) => {
    if (score >= 90) return 'CRITICAL';
    if (score >= 80) return 'HIGH';
    if (score >= 70) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="space-y-6">
      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Live Intent Signal Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                placeholder="marketing automation, lead generation, CRM software"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geo">Geographic Targets</Label>
              <Input
                id="geo"
                placeholder="San Francisco, Austin, New York"
                value={geoTargets}
                onChange={(e) => setGeoTargets(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={startScan} 
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Start Intent Scan
                </>
              )}
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Sources
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning across platforms...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Monitoring Google Trends, LinkedIn, Reddit, job boards, review sites...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warm Lead Results */}
      {warmLeads.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                Active Warm Leads ({warmLeads.length})
              </CardTitle>
              <Badge className="bg-success/20 text-success">
                Real-time monitoring active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {warmLeads.map((lead) => (
              <div key={lead.id} className="p-4 border rounded-lg space-y-3 hover:shadow-sm transition-shadow">
                {/* Lead Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{lead.location}</span>
                      <Clock className="w-3 h-3 text-muted-foreground ml-2" />
                      <span className="text-xs text-muted-foreground">{lead.lastActivity}</span>
                    </div>
                  </div>
                  <Badge className={`${getUrgencyColor(lead.urgencyScore)} border font-medium`}>
                    {getUrgencyLabel(lead.urgencyScore)} ({lead.urgencyScore})
                  </Badge>
                </div>

                {/* Intent Signals */}
                <div className="bg-muted/30 rounded-lg p-3 border-l-4 border-primary">
                  <div className="text-sm font-medium text-foreground mb-1">Search Pattern:</div>
                  <p className="text-sm text-muted-foreground">"{lead.searchPattern}"</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                    {lead.intentKeywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Competitor Intelligence */}
                {lead.competitorMentioned.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-muted-foreground">Mentioned competitors:</span>
                    {lead.competitorMentioned.map((comp, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-orange-500/30 text-orange-400">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Campaign
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Full Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Track Lead
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
