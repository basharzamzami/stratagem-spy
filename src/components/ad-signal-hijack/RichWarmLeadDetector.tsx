
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Zap,
  Target,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useMockData } from './MockDataProvider';
import EnhancedWarmLeadCard from './EnhancedWarmLeadCard';

export default function RichWarmLeadDetector() {
  const [searchKeywords, setSearchKeywords] = useState('marketing automation, crm software, lead generation');
  const [geoTargets, setGeoTargets] = useState('San Francisco, Austin, New York');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [filterUrgency, setFilterUrgency] = useState('all');
  const { warmLeads, refreshData } = useMockData();

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setScanProgress(i);
    }
    
    refreshData();
    setIsScanning(false);
  };

  const filteredLeads = warmLeads.filter(lead => {
    if (filterUrgency === 'all') return true;
    if (filterUrgency === 'critical') return lead.urgencyScore >= 90;
    if (filterUrgency === 'high') return lead.urgencyScore >= 80 && lead.urgencyScore < 90;
    if (filterUrgency === 'medium') return lead.urgencyScore >= 70 && lead.urgencyScore < 80;
    return lead.urgencyScore < 70;
  });

  const avgUrgencyScore = filteredLeads.reduce((sum, lead) => sum + lead.urgencyScore, 0) / filteredLeads.length || 0;
  const criticalLeads = filteredLeads.filter(lead => lead.urgencyScore >= 90).length;
  const recentLeads = filteredLeads.filter(lead => lead.lastActivity.includes('minutes')).length;

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
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning across platforms...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>✓ Google Trends</div>
                <div>✓ LinkedIn</div>
                <div>✓ Reddit</div>
                <div>✓ Job Boards</div>
                <div>✓ Review Sites</div>
                <div>✓ Social Media</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{filteredLeads.length}</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">{criticalLeads}</div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-success">{avgUrgencyScore.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Avg. Intent</div>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-400">{recentLeads}</div>
                <div className="text-sm text-muted-foreground">Recent</div>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-success" />
              Active Warm Leads ({filteredLeads.length})
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-success/20 text-success">
                Real-time monitoring active
              </Badge>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilterUrgency('all')}>
                  All ({warmLeads.length})
                </TabsTrigger>
                <TabsTrigger value="critical" onClick={() => setFilterUrgency('critical')}>
                  Critical ({warmLeads.filter(l => l.urgencyScore >= 90).length})
                </TabsTrigger>
                <TabsTrigger value="high" onClick={() => setFilterUrgency('high')}>
                  High ({warmLeads.filter(l => l.urgencyScore >= 80 && l.urgencyScore < 90).length})
                </TabsTrigger>
                <TabsTrigger value="medium" onClick={() => setFilterUrgency('medium')}>
                  Medium ({warmLeads.filter(l => l.urgencyScore >= 70 && l.urgencyScore < 80).length})
                </TabsTrigger>
              </TabsList>
              
              <Button size="sm" variant="outline">
                <Filter className="w-3 h-3 mr-1" />
                More Filters
              </Button>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No leads found. Try adjusting your search criteria.</p>
                  <Button onClick={startScan} className="mt-4">
                    <Search className="w-4 h-4 mr-2" />
                    Start New Scan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => (
                    <EnhancedWarmLeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
