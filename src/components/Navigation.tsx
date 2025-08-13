
import { Shield, Target, Map, Bell, TrendingUp, Users, Settings, Zap, Database } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import UserMenu from '@/components/UserMenu';

interface NavigationProps {
  onModuleSelect?: (module: string) => void;
  activeModule?: string;
}

const Navigation = ({ onModuleSelect, activeModule }: NavigationProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const modules = [
    { 
      name: "Specter Net", 
      icon: Shield, 
      active: location.pathname === '/' && activeModule === 'specter-net', 
      badge: null,
      description: "Main intelligence hub",
      key: "specter-net"
    },
    { 
      name: "Ad Signal Hijack", 
      icon: Zap, 
      active: location.pathname === '/' && activeModule === 'ad-signal-hijack', 
      badge: null,
      description: "Enhanced hijacking tools",
      key: "ad-signal-hijack"
    },
    { 
      name: "Lead Locator", 
      icon: Users, 
      active: location.pathname === '/lead-locator', 
      badge: null,
      description: "Prospect identification",
      path: "/lead-locator"
    },
    { 
      name: "Dominance Map", 
      icon: Map, 
      active: location.pathname === '/dominance-map', 
      badge: null,
      description: "Market positioning",
      path: "/dominance-map"
    },
    { 
      name: "Target Analysis", 
      icon: Target, 
      active: location.pathname === '/target-analysis', 
      badge: null,
      description: "Campaign optimization",
      path: "/target-analysis"
    },
    { 
      name: "Change Alerts", 
      icon: Bell, 
      active: location.pathname === '/change-alerts', 
      badge: null,
      description: "Real-time monitoring",
      path: "/change-alerts"
    },
    { 
      name: "Campaign Manager", 
      icon: TrendingUp, 
      active: location.pathname === '/campaign-manager', 
      badge: null,
      description: "Campaign orchestration",
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
    if (module.path) {
      window.location.href = module.path;
    } else if (module.key && onModuleSelect) {
      onModuleSelect(module.key);
    }
  };

  return (
    <div className="w-80 min-h-screen bg-card border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Specter Insights</h1>
              <p className="text-xs text-muted-foreground">Intelligence Dashboard</p>
            </div>
          </div>
          {user && <UserMenu />}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <button
              key={index}
              onClick={() => handleModuleClick(module)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 group ${
                module.active 
                  ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                  : 'bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${
                    module.active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  }`} />
                  <div>
                    <div className={`font-medium text-sm ${
                      module.active ? 'text-primary' : 'text-foreground'
                    }`}>
                      {module.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {module.description}
                    </div>
                  </div>
                </div>
                {module.badge && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                    {module.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Signed in as {user.email}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
