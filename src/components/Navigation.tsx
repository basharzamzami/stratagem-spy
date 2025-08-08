
import { Shield, Target, Map, Bell, TrendingUp, Users, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Navigation = () => {
  const modules = [
    { name: "Dashboard", icon: Shield, active: true, path: "/" },
    { name: "Ad Signals", icon: Target, active: false, path: "/signals" },
    { name: "Dominance Map", icon: Map, active: false, path: "/map" },
    { name: "Prospects", icon: Users, active: false, path: "/prospects" },
    { name: "Campaigns", icon: TrendingUp, active: false, path: "/campaigns" },
    { name: "Alerts", icon: Bell, active: false, path: "/alerts" },
    { name: "Settings", icon: Settings, active: false, path: "/settings" }
  ];

  return (
    <Card className="glass-panel w-64 h-screen p-6 border-r border-border/50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gradient-primary flex items-center">
          <Shield className="w-8 h-8 mr-2" />
          Stratagem
        </h1>
        <p className="text-xs text-foreground-secondary mt-1">Competitive Intelligence</p>
      </div>
      
      <nav className="space-y-2">
        {modules.map((module, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
              module.active 
                ? 'bg-gradient-primary text-primary-foreground shadow-lg' 
                : 'hover:bg-background-secondary text-foreground-secondary hover:text-foreground'
            }`}
          >
            <module.icon className="w-5 h-5" />
            <span className="font-medium">{module.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 rounded-lg bg-background-secondary/50 border border-border/50">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">System Status</span>
          </div>
          <p className="text-xs text-foreground-secondary">
            Last sync: 2 minutes ago
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Navigation;
