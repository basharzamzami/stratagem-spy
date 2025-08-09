
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Target, 
  Users, 
  MapPin, 
  Clock,
  DollarSign,
  Zap,
  Eye,
  Activity
} from 'lucide-react';

interface WarmLead {
  id: string;
  name: string;
  company: string;
  location: string;
  intentScore: number;
  lastActivity: string;
  searchQuery: string;
  estimatedBudget: string;
}

export default function PrecisionTargeting() {
  const [bidStrategy, setBidStrategy] = useState<'auto' | 'manual'>('auto');
  const [budgetRange, setBudgetRange] = useState([1000]);
  const [audienceSize, setAudienceSize] = useState(147);

  const warmLeads: WarmLead[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechStart Inc',
      location: 'San Francisco, CA',
      intentScore: 94,
      lastActivity: '2 hours ago',
      searchQuery: 'affordable marketing automation software',
      estimatedBudget: '$500-2000/month'
    },
    {
      id: '2',
      name: 'Mike Chen',
      company: 'Growth Labs',
      location: 'Austin, TX',
      intentScore: 87,
      lastActivity: '4 hours ago',
      searchQuery: 'HubSpot alternative small business',
      estimatedBudget: '$200-800/month'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Targeting Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Precision Targeting Control Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{audienceSize}</div>
              <div className="text-sm text-muted-foreground">Active Warm Leads</div>
            </div>
            
            <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
              <Activity className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">23</div>
              <div className="text-sm text-muted-foreground">High Intent (>80%)</div>
            </div>
            
            <div className="text-center p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
              <MapPin className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">8</div>
              <div className="text-sm text-muted-foreground">Target Geos</div>
            </div>
            
            <div className="text-center p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">$2.40</div>
              <div className="text-sm text-muted-foreground">Avg. CPC</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Targeting Configuration */}
      <Tabs defaultValue="audience" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="geo" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Geography
          </TabsTrigger>
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timing
          </TabsTrigger>
          <TabsTrigger value="bidding" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Bidding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Warm Lead Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warmLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{lead.name}</span>
                        <Badge variant="outline" className="text-xs">{lead.company}</Badge>
                        <Badge 
                          variant={lead.intentScore > 90 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {lead.intentScore}% Intent
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        📍 {lead.location} • 🔍 "{lead.searchQuery}"
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        💰 {lead.estimatedBudget} • ⏰ {lead.lastActivity}
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-muted/20 rounded-lg border">
                <div className="text-sm font-medium mb-2">Audience Expansion</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include lookalike audiences (1%)</span>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Primary Markets</h4>
                  <div className="space-y-2">
                    {['San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA'].map((city) => (
                      <div key={city} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{city}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Warm Lead Density Heatmap</h4>
                  <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg h-48 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Peak Activity Windows</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-sm font-medium text-success">9:00 AM - 11:00 AM PST</div>
                      <div className="text-xs text-muted-foreground">Highest warm lead activity</div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-sm font-medium text-primary">2:00 PM - 4:00 PM PST</div>
                      <div className="text-xs text-muted-foreground">Secondary peak window</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Competitor Ad Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>HubSpot: Heavy 8AM-12PM</span>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                        Hijack Opportunity
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Salesforce: Consistent all day</span>
                      <Badge variant="outline">Monitor</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bidding" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Bid Strategy</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Auto</span>
                      <Switch 
                        checked={bidStrategy === 'auto'}
                        onCheckedChange={(checked) => setBidStrategy(checked ? 'auto' : 'manual')}
                      />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {bidStrategy === 'auto' 
                        ? 'AI optimizes bids based on warm lead intent scores and competitor activity'
                        : 'Manual bid control with custom CPC targets'
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Daily Budget</span>
                    <span className="text-sm font-bold">${budgetRange[0]}</span>
                  </div>
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    max={5000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$100</span>
                    <span>$5,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-sm font-medium">Max CPC</div>
                    <div className="text-lg font-bold text-primary">$3.50</div>
                    <div className="text-xs text-muted-foreground">For high-intent leads</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg border">
                    <div className="text-sm font-medium">Target CPA</div>
                    <div className="text-lg font-bold">$45</div>
                    <div className="text-xs text-muted-foreground">Based on warm lead data</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Launch Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Ready to Launch Precision Campaign</div>
              <div className="text-sm text-muted-foreground">
                Targeting {audienceSize} warm leads with optimized bidding
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Zap className="w-4 h-4 mr-2" />
                Launch Campaign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
