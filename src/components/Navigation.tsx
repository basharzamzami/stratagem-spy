import { Shield, Target, Map, Bell, TrendingUp, Users, Settings, Zap, Database } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const modules = [
    { name: "Command Center", icon: Shield, path: "/", badge: null, description: "Intelligence dashboard" },
    { name: "Ad Signal Hijack", icon: Zap, path: "/ad-signal-hijack", badge: "34", description: "Competitor ad tracking" },
    { name: "Lead Locator", icon: Users, path: "/lead-locator", badge: "156", description: "Prospect identification" },
    { name: "Dominance Map", icon: Map, path: "/dominance-map", badge: null, description: "Territory analysis" },
    { name: "Task Generator", icon: Target, path: "/task-generator", badge: null, description: "Action recommendations" },
    { name: "Change Alerts", icon: Bell, path: "/change-alerts", badge: "3", description: "Real-time monitoring" },
    { name: "Campaign Manager", icon: TrendingUp, path: "/campaign-manager", badge: null, description: "Campaign automation" },
    { name: "Competitive CRM", icon: Database, path: "/crm", badge: null, description: "Lead management" },
  ];

  return (
    <div className="w-72 h-screen bg-background-secondary border-r border-border flex flex-col">
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
            <span className="font-semibold text-primary">847</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Intelligence Modules</h2>
        </div>

        {modules.map((module, index) => (
          <NavLink key={index} to={module.path} className={({ isActive }) => `w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}>
            <module.icon className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{module.name}</div>
              <div className={`text-xs truncate ${'text-muted-foreground'}`}>{module.description}</div>
            </div>
            {module.badge && (
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${'bg-primary text-primary-foreground'}`}>{module.badge}</span>
            )}
          </NavLink>
        ))}
      </div>

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
              <span className="text-card-foreground">32s ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
