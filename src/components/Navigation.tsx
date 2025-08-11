
import { Shield, Target, Map, Bell, TrendingUp, Users, Settings, Zap, Database } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/services/api';

interface NavigationProps {
  onModuleSelect?: (module: string) => void;
  activeModule?: string;
}

const Navigation = ({ onModuleSelect, activeModule }: NavigationProps) => {
  const location = useLocation();

  // Fetch data for dynamic badges
  const { data: adsResponse } = useQuery({
    queryKey: ['ads'],
    queryFn: () => ApiClient.getAds(),
  });

  const { data: leadsResponse } = useQuery({
    queryKey: ['leads'],
    queryFn: () => ApiClient.searchLeads({}),
  });

  const { data: alertsResponse } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => ApiClient.getAlerts(),
  });

  // Safely extract counts
  const adsCount = Array.isArray(adsResponse?.data) ? adsResponse.data.length : 0;
  const leadsCount = Array.isArray(leadsResponse?.data) ? leadsResponse.data.length : 0;
  const alertsCount = Array.isArray(alertsResponse?.data) 
    ? alertsResponse.data.filter((alert: any) => !alert.dismissed).length 
    : 0;

  const modules = [
    { 
      name: "Specter Net", 
      icon: Shield, 
      active: location.pathname === '/' && activeModule === 'specter-net', 
      badge: "NEW",
      description: "Intelligence dashboard",
      key: "specter-net"
    },
    { 
      name: "Ad Signal Hijack", 
      icon: Zap, 
      active: location.pathname === '/' && activeModule === 'ad-signal-hijack', 
      badge: adsCount > 0 ? adsCount.toString() : null,
      description: "Competitor ad tracking",
      key: "ad-signal-hijack"
    },
    { 
      name: "Lead Locator", 
      icon: Users, 
      active: location.pathname === '/lead-locator', 
      badge: leadsCount > 0 ? leadsCount.toString() : null,
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
      active: location.pathname === '/task-generator', 
      badge: null,
      description: "Action recommendations",
      path: "/task-generator"
    },
    { 
      name: "Change Alerts", 
      icon: Bell, 
      active: location.pathname === '/change-alerts', 
      badge: alertsCount > 0 ? alertsCount.toString() : null,
      description: "Real-time monitoring",
      path: "/change-alerts"
    },
    { 
      name: "Campaign Manager", 
      icon: TrendingUp, 
      active: location.pathname === '/campaign-manager', 
      badge: null,
      description: "Campaign automation",
      path: "/campaign-manager"
    },
    { 
      name: "Competitive CRM", 
      icon: Database, 
      active: location.pathname === '/competitive-crm', 
      badge: null,
      description: "Lead management",
      path: "/competitive-crm"
    }
  ];

  const handleModuleClick = (module: any) => {
    if (module.key && location.pathname === '/') {
      // For dashboard modules, use the callback
      onModuleSelect?.(module.key);
    } else if (module.path) {
      // For external pages, navigate normally
      window.location.href = module.path;
    }
  };

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
            onClick={() => handleModuleClick(module)}
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
        <button 
          onClick={() => window.location.href = '/settings'}
          className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            location.pathname === '/settings'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
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
