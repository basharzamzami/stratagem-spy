
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Radar, 
  Target, 
  Zap, 
  Globe, 
  MessageSquare, 
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Clock,
  MapPin
} from 'lucide-react';

interface ScanSource {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'active' | 'idle' | 'error';
  lastScan: string;
  leadsFound: number;
  scanProgress: number;
}

interface LiveLead {
  id: string;
  name: string;
  company: string;
  source: string;
  intentScore: number;
  keywords: string[];
  location: string;
  timestamp: string;
  urgency: 'high' | 'medium' | 'low';
}

export default function EnhancedRealTimeScanner() {
  const [isScanning, setIsScanning] = useState(true);
  const [totalScanned, setTotalScanned] = useState(0);
  const [newLeads, setNewLeads] = useState<LiveLead[]>([]);
  const scannerRef = useRef<NodeJS.Timeout>();

  const scanSources: ScanSource[] = [
    {
      id: 'job_boards',
      name: 'Job Boards',
      icon: <Briefcase className="w-4 h-4" />,
      status: 'active',
      lastScan: '12 seconds ago',
      leadsFound: 247,
      scanProgress: 78
    },
    {
      id: 'forums',
      name: 'Forums & Communities',
      icon: <MessageSquare className="w-4 h-4" />,
      status: 'active',
      lastScan: '8 seconds ago',
      leadsFound: 156,
      scanProgress: 92
    },
    {
      id: 'review_sites',
      name: 'Review Sites',
      icon: <Target className="w-4 h-4" />,
      status: 'active',
      lastScan: '15 seconds ago',
      leadsFound: 89,
      scanProgress: 65
    },
    {
      id: 'social_platforms',
      name: 'Social Platforms',
      icon: <Globe className="w-4 h-4" />,
      status: 'active',
      lastScan: '5 seconds ago',
      leadsFound: 324,
      scanProgress: 88
    },
    {
      id: 'google_trends',
      name: 'Google Trends',
      icon: <TrendingUp className="w-4 h-4" />,
      status: 'idle',
      lastScan: '2 minutes ago',
      leadsFound: 67,
      scanProgress: 100
    }
  ];

  const mockLeads: LiveLead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechFlow Solutions',
      source: 'LinkedIn',
      intentScore: 94,
      keywords: ['competitive analysis', 'market research'],
      location: 'San Francisco, CA',
      timestamp: '3 seconds ago',
      urgency: 'high'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      company: 'DataDriven Corp',
      source: 'Job Board',
      intentScore: 87,
      keywords: ['business intelligence', 'competitor tracking'],
      location: 'Austin, TX',
      timestamp: '12 seconds ago',
      urgency: 'high'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      company: 'GrowthLabs',
      source: 'Reddit',
      intentScore: 72,
      keywords: ['lead generation', 'sales tools'],
      location: 'New York, NY',
      timestamp: '28 seconds ago',
      urgency: 'medium'
    }
  ];

  useEffect(() => {
    if (isScanning) {
      scannerRef.current = setInterval(() => {
        setTotalScanned(prev => prev + Math.floor(Math.random() * 15) + 5);
        
        // Randomly add new leads
        if (Math.random() > 0.7) {
          const randomLead = mockLeads[Math.floor(Math.random() * mockLeads.length)];
          const newLead = {
            ...randomLead,
            id: `${randomLead.id}_${Date.now()}`,
            timestamp: 'just now'
          };
          setNewLeads(prev => [newLead, ...prev.slice(0, 9)]);
        }
      }, 3000);
    }

    return () => {
      if (scannerRef.current) {
        clearInterval(scannerRef.current);
      }
    };
  }, [isScanning]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'idle': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Scanner Status */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-primary" />
                Real-Time Intelligence Scanner
                {isScanning && <div className="w-2 h-2 rounded-full bg-success animate-pulse" />}
              </CardTitle>
              <Button 
                variant={isScanning ? "destructive" : "default"}
                onClick={() => setIsScanning(!isScanning)}
              >
                {isScanning ? 'Stop Scanning' : 'Start Scanning'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalScanned.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Sources Scanned</div>
              </div>
              <div className="text-center p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-success">{newLeads.length}</div>
                <div className="text-sm text-muted-foreground">New Leads Found</div>
              </div>
              <div className="text-center p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {newLeads.filter(l => l.urgency === 'high').length}
                </div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Scan Sources Status</h3>
              {scanSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-primary/10 ${getStatusColor(source.status)}`}>
                      {source.icon}
                    </div>
                    <div>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Last scan: {source.lastScan} • {source.leadsFound} leads found
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress value={source.scanProgress} className="h-2" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(source.status)}
                    >
                      {source.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Leads Feed */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Live Leads Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {newLeads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No new leads detected</p>
                  <p className="text-xs">Scanner will detect leads automatically</p>
                </div>
              ) : (
                newLeads.map((lead) => (
                  <div key={lead.id} className="p-3 bg-card border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.company}</div>
                      </div>
                      <Badge className={getUrgencyColor(lead.urgency)}>
                        {lead.urgency}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span className="font-medium">{lead.intentScore}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{lead.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {lead.keywords.slice(0, 2).map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>via {lead.source}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lead.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" className="w-full" variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Set Alert Keywords
            </Button>
            <Button size="sm" className="w-full" variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Configure Filters
            </Button>
            <Button size="sm" className="w-full" variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Add Source
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
