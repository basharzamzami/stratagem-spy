
import { Shield, Target, Map, Bell, TrendingUp, Users, Settings, Zap, Database } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const modules = [
    { 
      name: "Specter Net", 
      icon: Shield, 
      active: location.pathname === '/', 
      badge: "NEW",
      description: "Intelligence dashboard",
      path: "/"
    },
    { 
      name: "Ad Signal Hijack", 
      icon: Zap, 
      active: location.pathname === '/ad-signal-hijack', 
      badge: "34",
      description: "Competitor ad tracking",
      path: "/ad-signal-hijack"
    },
    { 
      name: "Lead Locator", 
      icon: Users, 
      active: location.pathname === '/lead-locator', 
      badge: "156",
      description: "Prospect identification",
      path: "/lead-locator"
    },
    { 
      name: "Dominance Map", 
      icon: Map, 
      active: location.pathname === '/dominance-map', 
      badge: null,
      description: "Territory analysis",
      path: "/dominance-map"
    },
    { 
      name: "Task Generator", 
      icon: Target, 
      active: false, 
      badge: null,
      description: "Action recommendations",
      path: "/task-generator"
    },
    { 
      name: "Change Alerts", 
      icon: Bell, 
      active: false, 
      badge: "17",
      description: "Real-time monitoring",
      path: "/change-alerts"
    },
    { 
      name: "Campaign Manager", 
      icon: TrendingUp, 
      active: false, 
      badge: null,
      description: "Campaign automation",
      path: "/campaign-manager"
    },
    { 
      name: "Competitive CRM", 
      icon: Database, 
      active: false, 
      badge: null,
      description: "Lead management",
      path: "/competitive-crm"
    }
  ];

  return (
    <div className="w-72 h-screen bg-background-secondary border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Specter Nexus</h1>
            <p className="text-xs text-muted-foreground">Intelligence Platform</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-card-foreground/70">Active Targets</span>
            <span className="font-semibold text-primary">247</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Intelligence Modules
          </h2>
        </div>
        
        {modules.map((module, index) => (
          <button
            key={index}
            onClick={() => navigate(module.path)}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              module.active 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <module.icon className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{module.name}</div>
              <div className={`text-xs truncate ${
                module.active 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
              }`}>
                {module.description}
              </div>
            </div>
            {module.badge && (
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                module.active 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : module.badge === 'NEW'
                  ? 'bg-green-500/20 text-green-400 animate-pulse'
                  : 'bg-primary text-primary-foreground'
              }`}>
                {module.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Settings */}
      <div className="p-4 border-t border-border">
        <button className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        
        <div className="mt-4 bg-card border border-border rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-medium text-card-foreground">System Status</span>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-card-foreground/70">Uptime</span>
              <span className="text-success font-medium">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-card-foreground/70">Last Sync</span>
              <span className="text-card-foreground">12s ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-card-foreground/70">Intelligence</span>
              <span className="text-primary font-medium">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
