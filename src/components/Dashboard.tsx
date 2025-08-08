
import { Target, Zap, Users, Map, AlertTriangle, TrendingUp, Bell, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const metrics = [
    {
      title: "Active Targets",
      value: "847",
      change: "+23",
      icon: Target,
      trend: "up"
    },
    {
      title: "Ad Hijacks",
      value: "34",
      change: "+12",
      icon: Zap,
      trend: "up"
    },
    {
      title: "Warm Leads",
      value: "156",
      change: "+89",
      icon: Users,
      trend: "up"
    },
    {
      title: "Coverage",
      value: "78%",
      change: "+5",
      icon: Map,
      trend: "up"
    },
    {
      title: "Threats",
      value: "3",
      change: "HIGH",
      icon: AlertTriangle,
      trend: "critical"
    },
    {
      title: "Campaigns",
      value: "12",
      change: "8 ready",
      icon: TrendingUp,
      trend: "neutral"
    }
  ];

  const alerts = [
    {
      competitor: "TechFlow Solutions",
      action: "New AI automation campaign - 47% CTR spike",
      time: "14m ago",
      severity: "critical",
      confidence: 94
    },
    {
      competitor: "DataSync Pro", 
      action: "25% price reduction + 90-day guarantee",
      time: "2h ago",
      severity: "high",
      confidence: 89
    },
    {
      competitor: "CloudMax Systems",
      action: "Austin office opened - targeting healthcare",
      time: "6h ago",
      severity: "medium",
      confidence: 76
    },
    {
      competitor: "Innovate Labs",
      action: "Lead theft from project management keywords",
      time: "12h ago",
      severity: "medium",
      confidence: 82
    }
  ];

  const actions = [
    { 
      title: "Counter AI Campaign",
      urgency: "critical"
    },
    { 
      title: "Price Match Analysis", 
      urgency: "high"
    },
    { 
      title: "Austin Defense",
      urgency: "medium"
    },
    { 
      title: "Keyword Protection",
      urgency: "low"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'border-l-destructive bg-destructive/5';
      case 'high': return 'border-l-warning bg-warning/5';  
      case 'medium': return 'border-l-primary bg-primary/5';
      default: return 'border-l-success bg-success/5';
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'critical': return 'text-destructive';
      case 'up': return 'text-success';
      default: return 'text-foreground-secondary';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Clean Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">
          Intelligence Command
        </h1>
        <div className="flex items-center gap-6 text-sm text-foreground-secondary">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>847 targets monitored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-dot bg-success animate-pulse"></div>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-medium">3 Critical</span>
          </div>
        </div>
      </div>

      {/* Clean Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card animate-fadeIn" style={{animationDelay: `${index * 50}ms`}}>
            <div className="flex items-start justify-between mb-4">
              <metric.icon className="w-5 h-5 text-primary" />
              <span className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                {metric.change}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-foreground-secondary">{metric.title}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Clean Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Intelligence Feed */}
        <Card className="lg:col-span-2 clean-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Intelligence Feed</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-dot bg-success animate-pulse"></div>
              <span className="text-xs text-success">LIVE</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`alert-item border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{alert.competitor}</h4>
                  <div className="flex items-center gap-3 text-xs text-foreground-secondary">
                    <span>{alert.confidence}%</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground-secondary">{alert.action}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="clean-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            {actions.map((action, index) => (
              <button
                key={index}
                className="w-full p-4 rounded-lg border border-border hover:border-primary/20 text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{action.title}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    action.urgency === 'critical' ? 'bg-destructive/10 text-destructive' :
                    action.urgency === 'high' ? 'bg-warning/10 text-warning' :
                    action.urgency === 'medium' ? 'bg-primary/10 text-primary' :
                    'bg-success/10 text-success'
                  }`}>
                    {action.urgency}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
