
import { Target, Zap, Users, Map, AlertTriangle, TrendingUp, Bell, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: "Active Targets",
      value: "847",
      change: "+23",
      changeType: "increase",
      icon: Target,
      description: "Monitored competitors"
    },
    {
      title: "Ad Hijacks Detected",
      value: "34",
      change: "+12",
      changeType: "increase",
      icon: Zap,
      description: "This week"
    },
    {
      title: "Warm Leads",
      value: "156",
      change: "+89",
      changeType: "increase",
      icon: Users,
      description: "High-intent prospects"
    },
    {
      title: "Market Coverage",
      value: "78%",
      change: "+5%",
      changeType: "increase",
      icon: Map,
      description: "Territory dominance"
    },
    {
      title: "Critical Alerts",
      value: "3",
      change: "High Priority",
      changeType: "warning",
      icon: AlertTriangle,
      description: "Requires attention"
    },
    {
      title: "Active Campaigns",
      value: "12",
      change: "8 optimizing",
      changeType: "neutral",
      icon: TrendingUp,
      description: "Campaign status"
    }
  ];

  const alerts = [
    {
      title: "TechFlow Solutions launched AI automation campaign",
      description: "47% CTR spike detected across multiple ad sets",
      time: "14 minutes ago",
      severity: "critical",
      confidence: 94
    },
    {
      title: "DataSync Pro reduced pricing by 25%",
      description: "Added 90-day money-back guarantee",
      time: "2 hours ago",
      severity: "high", 
      confidence: 89
    },
    {
      title: "CloudMax Systems opened Austin office",
      description: "Targeting healthcare vertical with local campaigns",
      time: "6 hours ago",
      severity: "medium",
      confidence: 76
    },
    {
      title: "Innovate Labs bidding on your brand keywords",
      description: "Detected bid increases on 12 branded terms",
      time: "12 hours ago",
      severity: "medium",
      confidence: 82
    }
  ];

  const quickActions = [
    { title: "Deploy Counter Campaign", urgency: "critical", action: "Create response to AI campaign" },
    { title: "Price Analysis", urgency: "high", action: "Compare pricing strategy" },
    { title: "Expand to Austin", urgency: "medium", action: "Evaluate market entry" },
    { title: "Brand Protection", urgency: "low", action: "Increase brand keyword bids" }
  ];

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'critical': return 'border-l-destructive bg-destructive/5';
      case 'high': return 'border-l-warning bg-warning/5';  
      case 'medium': return 'border-l-primary bg-primary/5';
      default: return 'border-l-success bg-success/5';
    }
  };

  const getUrgencyStyles = (urgency: string) => {
    switch(urgency) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-success/10 text-success border-success/20';
    }
  };

  return (
    <div className="flex-1 bg-background-secondary">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Intelligence Command
              </h1>
              <p className="text-muted-foreground">
                Real-time competitive intelligence dashboard
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border">
                <Activity className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Live Monitoring</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/5 border border-destructive/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">3 Critical Alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="metric-card animate-slideInUp"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <metric.icon className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  {metric.changeType === 'increase' && (
                    <ArrowUp className="w-4 h-4 text-success" />
                  )}
                  {metric.changeType === 'decrease' && (
                    <ArrowDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className={`font-medium ${
                    metric.changeType === 'increase' ? 'text-success' :
                    metric.changeType === 'decrease' ? 'text-destructive' :
                    metric.changeType === 'warning' ? 'text-warning' :
                    'text-muted-foreground'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm font-medium text-foreground">{metric.title}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Intelligence Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="saas-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Intelligence Feed</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                  <div className="status-indicator bg-success animate-pulse"></div>
                  <span className="text-xs font-medium text-success">LIVE</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className={`alert-card border-l-4 ${getSeverityStyles(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{alert.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">{alert.confidence}% confidence</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="saas-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full p-4 rounded-lg border border-border hover:border-primary/30 text-left transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{action.title}</span>
                      <span className={`text-xs px-2 py-1 rounded border ${getUrgencyStyles(action.urgency)}`}>
                        {action.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{action.action}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
