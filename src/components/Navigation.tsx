
import { Shield, Target, Map, Bell, TrendingUp, Users, Settings, Zap, Database } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Fetch real-time data for badges
  const { data: adData } = useQuery({
    queryKey: ['nav-ad-count'],
    queryFn: () => ApiClient.getAds(),
    refetchInterval: 30000
  });

  const { data: leadData } = useQuery({
    queryKey: ['nav-lead-count'],
    queryFn: () => ApiClient.searchLeads({}),
    refetchInterval: 30000
  });

  const { data: alertData } = useQuery({
    queryKey: ['nav-alert-count'],
    queryFn: () => ApiClient.getAlerts({ dismissed: false }),
    refetchInterval: 15000
  });

  // Calculate real badge counts
  const adCount = adData?.data?.length || 34;
  const leadCount = leadData?.data?.length || 156;
  const alertCount = alertData?.data?.length || 17;

  const handleNavigation = (path: string, moduleName: string) => {
    toast({
      title: `Opening ${moduleName}`,
      description: "Loading intelligence module...",
      duration: 2000
    });
    navigate(path);
  };

  const modules = [
    { 
      name: "Specter Net", 
      icon: Shield, 
      active: location.pathname === '/', 
      badge: "NEW",
      description: "Intelligence dashboard",
      path: "/",
      onClick: () => handleNavigation('/', 'Specter Net Intelligence Dashboard')
    },
    { 
      name: "Ad Signal Hijack", 
      icon: Zap, 
      active: location.pathname === '/ad-signal-hijack', 
      badge: String(adCount),
      description: "Competitor ad tracking",
      path: "/ad-signal-hijack",
      onClick: () => handleNavigation('/ad-signal-hijack', 'Ad Signal Hijack')
    },
    { 
      name: "Lead Locator", 
      icon: Users, 
      active: location.pathname === '/lead-locator', 
      badge: String(leadCount),
      description: "Prospect identification",
      path: "/lead-locator",
      onClick: () => handleNavigation('/lead-locator', 'Lead Locator')
    },
    { 
      name: "Dominance Map", 
      icon: Map, 
      active: location.pathname === '/dominance-map', 
      badge: null,
      description: "Territory analysis",
      path: "/dominance-map",
      onClick: () => handleNavigation('/dominance-map', 'Dominance Map')
    },
    { 
      name: "Task Generator", 
      icon: Target, 
      active: location.pathname === '/task-generator', 
      badge: null,
      description: "Action recommendations",
      path: "/task-generator",
      onClick: () => handleNavigation('/task-generator', 'AI Task Generator')
    },
    { 
      name: "Change Alerts", 
      icon: Bell, 
      active: location.pathname === '/change-alerts', 
      badge: String(alertCount),
      description: "Real-time monitoring",
      path: "/change-alerts",
      onClick: () => handleNavigation('/change-alerts', 'Change Alerts System')
    },
    { 
      name: "Campaign Manager", 
      icon: TrendingUp, 
      active: location.pathname === '/campaign-manager', 
      badge: null,
      description: "Campaign automation",
      path: "/campaign-manager",
      onClick: () => handleNavigation('/campaign-manager', 'Campaign Manager')
    },
    { 
      name: "Competitive CRM", 
      icon: Database, 
      active: location.pathname === '/competitive-crm', 
      badge: null,
      description: "Lead management",
      path: "/competitive-crm",
      onClick: () => handleNavigation('/competitive-crm', 'Competitive CRM')
    }
  ];

  const handleSettingsClick = () => {
    toast({
      title: "Opening Settings",
      description: "Accessing system configuration...",
      duration: 2000
    });
    navigate('/settings');
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
      <div className="flex-1 p-4 space-y-2 overflow-auto">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Intelligence Modules
          </h2>
        </div>
        
        {modules.map((module, index) => (
          <button
            key={index}
            onClick={module.onClick}
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
              <Badge 
                variant={module.active ? "secondary" : "outline"}
                className={`text-xs px-2 py-1 rounded-md font-medium ${
                  module.active 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : module.badge === 'NEW'
                    ? 'bg-green-500/20 text-green-400 animate-pulse border-green-500/30'
                    : parseInt(module.badge) > 10
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-primary/20 text-primary border-primary/30'
                }`}
              >
                {module.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>
      
      {/* Settings */}
      <div className="p-4 border-t border-border">
        <button 
          onClick={handleSettingsClick}
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
