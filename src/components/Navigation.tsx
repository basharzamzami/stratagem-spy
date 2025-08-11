
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Target, 
  Map,
  CheckSquare,
  Bell,
  Settings,
  Users,
  BarChart3,
  Zap,
  Sword,
  Flame,
  Brain
} from 'lucide-react';

interface NavigationProps {
  onPanelChange?: (panel: string | null) => void;
  activePanel?: string | null;
}

const Navigation = ({ onPanelChange, activePanel }: NavigationProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      id: 'ad-signal-hijack',
      label: 'Ad Signal Hijack',
      icon: Sword,
      badge: 'HOT',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      isPanel: true
    },
    {
      id: 'hot-ad-war-room',
      label: 'Hot Ad War Room',
      icon: Flame,
      href: '/hot-ad-war-room',
      badge: 'LIVE',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    {
      id: 'lead-locator',
      label: 'Lead Locator',
      icon: Target,
      href: '/lead-locator'
    },
    {
      id: 'dominance-map',
      label: 'Dominance Map',
      icon: Map,
      href: '/dominance-map'
    },
    {
      id: 'task-generator',
      label: 'Task Generator',
      icon: CheckSquare,
      href: '/task-generator',
      badge: 'AI',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'change-alerts',
      label: 'Change Alerts',
      icon: Bell,
      href: '/change-alerts'
    },
    {
      id: 'campaign-manager',
      label: 'Campaign Manager',
      icon: BarChart3,
      href: '/campaign-manager'
    },
    {
      id: 'competitive-crm',
      label: 'Competitive CRM',
      icon: Users,
      href: '/competitive-crm'
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.isPanel) {
      // Toggle panel
      const newPanel = activePanel === item.id ? null : item.id;
      if (onPanelChange) {
        onPanelChange(newPanel);
      }
    }
  };

  const isActive = (item: any) => {
    if (item.isPanel) {
      return activePanel === item.id;
    }
    return location.pathname === item.href;
  };

  const getItemClassName = (item: any) => {
    const baseClasses = "w-full justify-start text-left transition-all duration-200 hover:bg-muted/50";
    const activeClasses = isActive(item) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "text-muted-foreground hover:text-foreground";
    
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <div className="w-64 border-r border-border bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              Specter Insights
            </h1>
            <p className="text-xs text-muted-foreground">Intelligence Hub</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const ItemIcon = item.icon;
            
            if (item.isPanel) {
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={getItemClassName(item)}
                  onClick={() => handleItemClick(item)}
                >
                  <ItemIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge className={`${item.badgeColor} text-xs px-2 py-0.5 ml-2`} variant="outline">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            }

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={getItemClassName(item)}
                asChild
              >
                <Link to={item.href}>
                  <ItemIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge className={`${item.badgeColor} text-xs px-2 py-0.5 ml-2`} variant="outline">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/settings">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
