
import { Shield, Target, Map, Bell, TrendingUp, Users, Settings, Zap, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Navigation = () => {
  const modules = [
    { 
      name: "Command Center", 
      icon: Shield, 
      active: true, 
      badge: null
    },
    { 
      name: "Ad Signal Hijack", 
      icon: Zap, 
      active: false, 
      badge: "34"
    },
    { 
      name: "Lead Locator", 
      icon: Users, 
      active: false, 
      badge: "156"
    },
    { 
      name: "Dominance Map", 
      icon: Map, 
      active: false, 
      badge: null
    },
    { 
      name: "Task Generator", 
      icon: Target, 
      active: false, 
      badge: null
    },
    { 
      name: "Change Alerts", 
      icon: Bell, 
      active: false, 
      badge: "3"
    },
    { 
      name: "Campaign Manager", 
      icon: TrendingUp, 
      active: false, 
      badge: null
    },
    { 
      name: "Competitive CRM", 
      icon: Database, 
      active: false, 
      badge: null
    },
    { 
      name: "Settings", 
      icon: Settings, 
      active: false, 
      badge: null
    }
  ];

  return (
    <Card className="w-64 h-screen border-r border-border bg-card/50 backdrop-blur-sm">
      <div className="p-6 space-y-8">
        {/* Clean Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-gradient">Specter Nexus</h1>
          </div>
          <div className="p-3 rounded-lg bg-background-secondary border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">Targets</span>
              <span className="font-mono text-primary">847</span>
            </div>
          </div>
        </div>
        
        {/* Clean Navigation */}
        <nav className="space-y-1">
          {modules.map((module, index) => (
            <button
              key={index}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                module.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-background-secondary text-foreground-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <module.icon className="w-5 h-5" />
                <span className="font-medium">{module.name}</span>
              </div>
              {module.badge && (
                <span className="text-xs px-2 py-1 rounded bg-background-secondary text-foreground-secondary">
                  {module.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Clean Status */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 rounded-lg bg-background-secondary border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="status-dot bg-success animate-pulse"></div>
            <span className="text-sm font-medium">System Status</span>
          </div>
          
          <div className="space-y-2 text-xs text-foreground-secondary">
            <div className="flex justify-between">
              <span>Last Sync</span>
              <span className="font-mono">32s ago</span>
            </div>
            <div className="flex justify-between">
              <span>Health</span>
              <span className="text-success">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span>Data Points</span>
              <span className="font-mono text-primary">2.3M</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Navigation;
