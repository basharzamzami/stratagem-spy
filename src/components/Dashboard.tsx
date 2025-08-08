
import { Shield, Target, Map, Bell, TrendingUp, Activity, Eye, Zap, Users, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const metrics = [
    {
      title: "Active Targets",
      value: "847",
      change: "+23 today",
      icon: Target,
      status: "success"
    },
    {
      title: "Ad Hijacks Detected",
      value: "34",
      change: "+12 this week",
      icon: Zap,
      status: "primary"
    },
    {
      title: "Warm Leads Located",
      value: "156",
      change: "+89 this week",
      icon: Users,
      status: "warning"
    },
    {
      title: "Territory Coverage",
      value: "78.3%",
      change: "+5.2% growth",
      icon: Map,
      status: "success"
    },
    {
      title: "Threat Level",
      value: "HIGH",
      change: "3 new moves",
      icon: AlertTriangle,
      status: "danger"
    },
    {
      title: "Campaign Pipeline",
      value: "12",
      change: "8 ready to deploy",
      icon: TrendingUp,
      status: "primary"
    }
  ];

  const intelligenceAlerts = [
    {
      type: "ad-hijack",
      competitor: "TechFlow Solutions",
      action: "Launched new campaign targeting 'AI automation' - 47% CTR spike detected",
      location: "San Francisco Bay Area",
      time: "14m ago",
      severity: "critical",
      confidence: 94
    },
    {
      type: "pricing-war",
      competitor: "DataSync Pro", 
      action: "Reduced enterprise pricing by 25% + added 90-day guarantee",
      location: "Nationwide",
      time: "2h ago",
      severity: "high",
      confidence: 89
    },
    {
      type: "territory-invasion",
      competitor: "CloudMax Systems",
      action: "Opened new office in Austin TX - targeting healthcare vertical",
      location: "Austin, TX",
      time: "6h ago",
      severity: "medium",
      confidence: 76
    },
    {
      type: "lead-poach",
      competitor: "Innovate Labs",
      action: "Stealing leads from 'project management software' keyword cluster",
      location: "Denver, CO",
      time: "12h ago", 
      severity: "medium",
      confidence: 82
    },
    {
      type: "creative-theft",
      competitor: "NextGen Solutions",
      action: "Copied our 'seamless integration' angle - using similar visuals",
      location: "Seattle, WA",
      time: "1d ago",
      severity: "low",
      confidence: 67
    }
  ];

  const quickActions = [
    { 
      title: "Deploy Counter-Strike",
      desc: "Launch response campaign to TechFlow's AI automation push",
      variant: "danger",
      urgency: "critical"
    },
    { 
      title: "Price Match Protocol", 
      desc: "Analyze DataSync's pricing strategy + recommend counter-move",
      variant: "warning",
      urgency: "high"
    },
    { 
      title: "Territory Defense",
      desc: "Secure Austin healthcare leads before CloudMax establishes dominance", 
      variant: "primary",
      urgency: "medium"
    },
    { 
      title: "Creative Protection",
      desc: "File takedown notice + develop new differentiated angles",
      variant: "success", 
      urgency: "low"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-danger border-danger/50 bg-danger/5';
      case 'high': return 'text-warning border-warning/50 bg-warning/5';  
      case 'medium': return 'text-primary border-primary/50 bg-primary/5';
      case 'low': return 'text-success border-success/50 bg-success/5';
      default: return 'text-foreground-secondary border-border bg-background-secondary/30';
    }
  };

  const getActionVariant = (variant: string, urgency: string) => {
    const baseClasses = 'w-full p-4 rounded-lg text-left transition-all hover:scale-105 relative overflow-hidden';
    const urgencyIndicator = urgency === 'critical' ? 'before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-danger before:animate-pulse' : '';
    
    switch(variant) {
      case 'danger': return `${baseClasses} ${urgencyIndicator} bg-gradient-danger hover:shadow-lg hover:shadow-danger/25`;
      case 'warning': return `${baseClasses} ${urgencyIndicator} bg-warning/10 hover:bg-warning/20 border border-warning/20`;
      case 'primary': return `${baseClasses} ${urgencyIndicator} bg-gradient-primary hover:shadow-lg hover:shadow-primary/25`;
      case 'success': return `${baseClasses} ${urgencyIndicator} bg-success/10 hover:bg-success/20 border border-success/20`;
      default: return `${baseClasses} ${urgencyIndicator} bg-background-secondary/50 hover:bg-background-secondary`;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Intelligence Command Center
          </h1>
          <p className="text-foreground-secondary flex items-center space-x-4">
            <span>Real-time competitive surveillance & market domination</span>
            <span className="flex items-center space-x-2">
              <Eye className="w-4 h-4 animate-pulse" />
              <span className="text-xs">847 targets monitored</span>
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="status-indicator bg-success"></div>
            <span className="text-sm text-foreground-secondary">All systems operational</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/20">
            <AlertTriangle className="w-4 h-4 text-danger animate-pulse" />
            <span className="text-xs text-danger font-medium">3 CRITICAL ALERTS</span>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card animate-fadeInUp" style={{animationDelay: `${index * 100}ms`}}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-foreground-secondary mb-1">{metric.title}</p>
                <h3 className="text-3xl font-bold mb-2">{metric.value}</h3>
                <div className={`flex items-center text-sm ${
                  metric.status === 'success' ? 'text-success' :
                  metric.status === 'danger' ? 'text-danger' :
                  metric.status === 'warning' ? 'text-warning' :
                  'text-primary'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${
                metric.status === 'success' ? 'bg-success/10' :
                metric.status === 'danger' ? 'bg-danger/10' :
                metric.status === 'warning' ? 'bg-warning/10' :
                'bg-primary/10'
              }`}>
                <metric.icon className={`w-6 h-6 ${
                  metric.status === 'success' ? 'text-success' :
                  metric.status === 'danger' ? 'text-danger' :
                  metric.status === 'warning' ? 'text-warning' :
                  'text-primary'
                }`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Intelligence Feed & Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Bell className="w-5 h-5 text-primary animate-pulse mr-2" />
              Live Intelligence Feed
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success">LIVE</span>
            </div>
          </div>
          <div className="space-y-4">
            {intelligenceAlerts.map((alert, index) => (
              <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg border transition-all hover:scale-[1.02] ${getSeverityColor(alert.severity)}`}>
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.severity === 'critical' ? 'bg-danger animate-pulse' :
                    alert.severity === 'high' ? 'bg-warning animate-pulse' :
                    alert.severity === 'medium' ? 'bg-primary' :
                    'bg-success'
                  }`}></div>
                  <div className="text-xs text-foreground-secondary mt-1">{alert.confidence}%</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      {alert.competitor}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-foreground-secondary">{alert.location}</span>
                      <span className="text-xs text-foreground-secondary">{alert.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground-secondary mb-2">{alert.action}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alert.severity === 'critical' ? 'bg-danger/20 text-danger' :
                      alert.severity === 'high' ? 'bg-warning/20 text-warning' :
                      alert.severity === 'medium' ? 'bg-primary/20 text-primary' :
                      'bg-success/20 text-success'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-foreground-secondary">#{alert.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Zap className="w-5 h-5 text-primary mr-2" />
            Rapid Response
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={getActionVariant(action.variant, action.urgency)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    action.urgency === 'critical' ? 'bg-danger/20 text-danger' :
                    action.urgency === 'high' ? 'bg-warning/20 text-warning' :
                    action.urgency === 'medium' ? 'bg-primary/20 text-primary' :
                    'bg-success/20 text-success'
                  }`}>
                    {action.urgency}
                  </span>
                </div>
                <p className="text-sm text-foreground-secondary">{action.desc}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
