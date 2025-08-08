
import { Shield, Target, Map, Bell, TrendingUp, Users, Settings, Zap, Eye, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Navigation = () => {
  const modules = [
    { 
      name: "Command Center", 
      icon: Shield, 
      active: true, 
      path: "/",
      description: "Real-time intelligence hub"
    },
    { 
      name: "Ad Signal Hijack", 
      icon: Zap, 
      active: false, 
      path: "/ad-signals",
      description: "Competitor ad intelligence",
      badge: "34 new"
    },
    { 
      name: "Lead Locator", 
      icon: Users, 
      active: false, 
      path: "/prospects",
      description: "Warm prospect identification",
      badge: "156 found"
    },
    { 
      name: "Dominance Map", 
      icon: Map, 
      active: false, 
      path: "/territory",
      description: "Geographic market control"
    },
    { 
      name: "Task Generator", 
      icon: Target, 
      active: false, 
      path: "/tasks",
      description: "Action item prioritization"
    },
    { 
      name: "Change Alerts", 
      icon: Bell, 
      active: false, 
      path: "/alerts",
      description: "Competitor movement tracking",
      badge: "3 critical"
    },
    { 
      name: "Campaign Manager", 
      icon: TrendingUp, 
      active: false, 
      path: "/campaigns",
      description: "Intelligence-driven campaigns"
    },
    { 
      name: "Competitive CRM", 
      icon: Database, 
      active: false, 
      path: "/crm",
      description: "Strategic relationship mgmt"
    },
    { 
      name: "Settings", 
      icon: Settings, 
      active: false, 
      path: "/settings",
      description: "System configuration"
    }
  ];

  const systemStats = {
    targetsMonitored: 847,
    lastSync: "32 seconds ago",
    apiHealth: "optimal",
    dataPoints: "2.3M today"
  };

  return (
    <Card className="glass-panel w-80 h-screen p-6 border-r border-border/50">
      {/* Enhanced Brand Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gradient-primary flex items-center">
          <Shield className="w-8 h-8 mr-2" />
          Specter Nexus
        </h1>
        <p className="text-xs text-foreground-secondary mt-1">Competitive Intelligence Platform</p>
        <div className="mt-3 p-2 rounded-lg bg-background-secondary/30 border border-border/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-secondary">Targets Monitored</span>
            <span className="font-mono text-primary">{systemStats.targetsMonitored}</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Navigation */}
      <nav className="space-y-2 mb-8">
        {modules.map((module, index) => (
          <button
            key={index}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left group ${
              module.active 
                ? 'bg-gradient-primary text-primary-foreground shadow-lg' 
                : 'hover:bg-background-secondary text-foreground-secondary hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-3">
              <module.icon className={`w-5 h-5 ${
                module.active ? 'text-primary-foreground' : 'text-foreground-secondary group-hover:text-primary'
              }`} />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{module.name}</span>
                <span className={`text-xs ${
                  module.active ? 'text-primary-foreground/70' : 'text-foreground-secondary/70'
                }`}>
                  {module.description}
                </span>
              </div>
            </div>
            {module.badge && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                module.badge.includes('critical') 
                  ? 'bg-danger/20 text-danger border border-danger/30' 
                  : module.badge.includes('new') || module.badge.includes('found')
                  ? 'bg-success/20 text-success border border-success/30'
                  : 'bg-primary/20 text-primary border border-primary/30'
              }`}>
                {module.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      {/* Enhanced System Status */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 rounded-lg bg-background-secondary/50 border border-border/50">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">System Status</span>
            <span className="text-xs text-success ml-auto">OPERATIONAL</span>
          </div>
          
          <div className="space-y-2 text-xs text-foreground-secondary">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                Last Sync
              </span>
              <span className="font-mono">{systemStats.lastSync}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>API Health</span>
              <span className="text-success capitalize">{systemStats.apiHealth}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Data Points</span>
              <span className="font-mono text-primary">{systemStats.dataPoints}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-border/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-secondary">Next scan in:</span>
              <span className="font-mono text-primary">00:24</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Navigation;
