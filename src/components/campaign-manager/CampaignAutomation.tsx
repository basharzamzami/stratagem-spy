
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, Bot, Target, TrendingUp, AlertTriangle, Settings } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  type: 'Budget' | 'Bidding' | 'Targeting' | 'Creative';
  status: 'Active' | 'Paused';
  description: string;
  lastTriggered?: string;
  impact: 'High' | 'Medium' | 'Low';
}

const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Auto Budget Optimization',
    type: 'Budget',
    status: 'Active',
    description: 'Automatically increase budget by 20% when ROAS > 3.0',
    lastTriggered: '2 hours ago',
    impact: 'High'
  },
  {
    id: '2',
    name: 'Bid Adjustment Rules',
    type: 'Bidding',
    status: 'Active',
    description: 'Reduce bids by 15% when CPA exceeds target by 30%',
    lastTriggered: '45 minutes ago',
    impact: 'Medium'
  },
  {
    id: '3',
    name: 'Geo-targeting Optimizer',
    type: 'Targeting',
    status: 'Paused',
    description: 'Exclude low-performing ZIP codes automatically',
    impact: 'Medium'
  },
  {
    id: '4',
    name: 'Creative Rotation',
    type: 'Creative',
    status: 'Active',
    description: 'Pause ads with CTR < 2% after 1000 impressions',
    lastTriggered: '1 day ago',
    impact: 'High'
  }
];

const CampaignAutomation = () => {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules);
  const [masterAutomation, setMasterAutomation] = useState(true);

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'Active' ? 'Paused' : 'Active' }
        : rule
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Budget':
        return TrendingUp;
      case 'Bidding':
        return Target;
      case 'Targeting':
        return Bot;
      case 'Creative':
        return Zap;
      default:
        return Settings;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Low':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Master Control */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-card-foreground">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              Campaign Automation
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-sm text-card-foreground/70">Master Control</span>
              <Switch
                checked={masterAutomation}
                onCheckedChange={setMasterAutomation}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background-secondary rounded-xl">
              <div className="text-2xl font-bold text-foreground mb-1">247</div>
              <div className="text-sm text-muted-foreground">Rules Executed</div>
            </div>
            <div className="text-center p-4 bg-background-secondary rounded-xl">
              <div className="text-2xl font-bold text-success mb-1">$12.4K</div>
              <div className="text-sm text-muted-foreground">Budget Optimized</div>
            </div>
            <div className="text-center p-4 bg-background-secondary rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">18.3%</div>
              <div className="text-sm text-muted-foreground">ROAS Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Automation Rules</CardTitle>
            <Button className="bg-primary hover:bg-primary/90">
              <Zap className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => {
              const IconComponent = getTypeIcon(rule.type);
              return (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-background-secondary rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-card-foreground">{rule.name}</h3>
                        <Badge variant="outline" className={`text-xs ${rule.type === 'Budget' ? 'bg-blue-500/20 text-blue-400' : rule.type === 'Bidding' ? 'bg-green-500/20 text-green-400' : rule.type === 'Targeting' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {rule.type}
                        </Badge>
                        <Badge variant="outline" className={getImpactColor(rule.impact)}>
                          {rule.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-card-foreground/70 mb-2">{rule.description}</p>
                      {rule.lastTriggered && (
                        <p className="text-xs text-muted-foreground">Last triggered: {rule.lastTriggered}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={rule.status === 'Active' ? 'bg-success/20 text-success border-success/30' : 'bg-muted/20 text-muted-foreground border-muted/30'}
                    >
                      {rule.status}
                    </Badge>
                    <Switch
                      checked={rule.status === 'Active'}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <AlertTriangle className="w-5 h-5 text-warning" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-semibold text-warning mb-1">Budget Reallocation Opportunity</h4>
                  <p className="text-sm text-card-foreground/70 mb-3">
                    Move $500 from "YouTube Brand Awareness" (ROAS: 1.8x) to "Facebook Lead Gen" (ROAS: 4.1x) 
                    to potentially increase overall returns by 23%.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-warning hover:bg-warning/90 text-warning-foreground">
                      Apply Recommendation
                    </Button>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary mb-1">Audience Expansion Suggestion</h4>
                  <p className="text-sm text-card-foreground/70 mb-3">
                    Your "Local Service Ads" campaign shows strong performance in Miami. 
                    Consider expanding to Fort Lauderdale and Tampa for similar demographics.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Create Expansion Rule
                    </Button>
                    <Button size="sm" variant="outline">
                      View Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAutomation;
