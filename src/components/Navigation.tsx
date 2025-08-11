
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Target, BarChart3, Users, TrendingUp, 
  Database, Activity, AlertTriangle, Settings,
  Search, Zap, Brain, Eye, Mail, Map, Building
} from 'lucide-react';

interface NavigationProps {
  activePanel?: string;
  onPanelChange?: (panel: string) => void;
}

const Navigation = ({ activePanel = 'specter-net', onPanelChange }: NavigationProps) => {
  const [warmLeadsCount] = useState(247);
  const [hotAdsCount] = useState(18);

  const mainFeatures = [
    {
      id: 'specter-net',
      label: 'Specter Net',
      description: 'Core intelligence platform',
      icon: Shield,
      badge: null
    },
    {
      id: 'market-intel',
      label: 'Market Intel',
      description: 'Competitive intelligence hub',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'leads',
      label: 'Leads',
      description: 'Prospect management system',
      icon: Users,
      badge: warmLeadsCount
    },
    {
      id: 'performance',
      label: 'Performance',
      description: 'Real-time KPI dashboard',
      icon: TrendingUp,
      badge: null
    }
  ];

  const handlePanelChange = (panelId: string) => {
    if (onPanelChange) {
      onPanelChange(panelId);
    }
  };

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground text-sm">Navigation</h2>
        <p className="text-xs text-muted-foreground mt-1">Intelligence Modules</p>
      </div>

      {/* Main Features */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground px-2 mb-3">
            CORE MODULES
          </div>
          
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            const isActive = activePanel === feature.id;
            
            return (
              <Button
                key={feature.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isActive ? 'bg-primary/10 border-primary/20' : ''
                }`}
                onClick={() => handlePanelChange(feature.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {feature.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </div>
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* System Status */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground px-2 mb-3">
            SYSTEM STATUS
          </div>
          
          <div className="px-2 py-2 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-xs font-medium text-success">Live Intelligence</span>
            </div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Navigation;
