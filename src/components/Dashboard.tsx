
import { Target, Zap, Users, Map, AlertTriangle, TrendingUp, Bell, Activity, ArrowUp, ArrowDown, Shield, Eye } from 'lucide-react';

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

  // Mock data for competitors
  const topCompetitors = [
    {
      name: "TechFlow Solutions",
      threatLevel: "High",
      adCount: 127,
      spend: "$45K/mo",
      dominance: 85,
      change: "+12%"
    },
    {
      name: "DataSync Pro",
      threatLevel: "High",
      adCount: 98,
      spend: "$38K/mo",
      dominance: 78,
      change: "-5%"
    },
    {
      name: "CloudMax Systems",
      threatLevel: "Medium",
      adCount: 67,
      spend: "$22K/mo",
      dominance: 64,
      change: "+8%"
    },
    {
      name: "Innovate Labs",
      threatLevel: "Medium",
      adCount: 45,
      spend: "$18K/mo",
      dominance: 52,
      change: "+3%"
    }
  ];

  // Mock data for ad intelligence
  const recentAds = [
    {
      id: 1,
      competitor: "TechFlow Solutions",
      platform: "Meta",
      headline: "AI-Powered Business Automation",
      cta: "Start Free Trial",
      performance: "High",
      firstSeen: "2 hours ago",
      engagement: 2400
    },
    {
      id: 2,
      competitor: "DataSync Pro",
      platform: "Google",
      headline: "Data Integration Made Simple",
      cta: "Get Demo",
      performance: "Medium",
      firstSeen: "4 hours ago",
      engagement: 1850
    },
    {
      id: 3,
      competitor: "CloudMax Systems",
      platform: "YouTube",
      headline: "Cloud Solutions for Healthcare",
      cta: "Watch Demo",
      performance: "High",
      firstSeen: "6 hours ago",
      engagement: 3200
    },
    {
      id: 4,
      competitor: "Innovate Labs",
      platform: "Meta",
      headline: "Transform Your Workflow",
      cta: "Learn More",
      performance: "Low",
      firstSeen: "8 hours ago",
      engagement: 920
    }
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

  const getThreatColor = (level: string) => {
    switch(level) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch(performance) {
      case 'High': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Intelligence Command
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Real-time competitive intelligence dashboard for strategic market dominance
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-success/10 border border-success/20 rounded-xl">
                <Activity className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">Live Monitoring</span>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">3 Critical Alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <metric.icon className="w-7 h-7 text-primary" />
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  {metric.changeType === 'increase' && (
                    <ArrowUp className="w-4 h-4 text-success" />
                  )}
                  {metric.changeType === 'decrease' && (
                    <ArrowDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className={`font-semibold ${
                    metric.changeType === 'increase' ? 'text-success' :
                    metric.changeType === 'decrease' ? 'text-destructive' :
                    metric.changeType === 'warning' ? 'text-warning' :
                    'text-muted-foreground'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <div className="text-base font-semibold text-foreground">{metric.title}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Intelligence Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Bell className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Intelligence Feed</h2>
                </div>
                <div className="flex items-center gap-3 px-3 py-1 bg-success/10 rounded-full border border-success/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></div>
                  <span className="text-sm font-medium text-success">LIVE</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className={`p-5 rounded-xl border-l-4 transition-all duration-200 hover:shadow-sm ${getSeverityStyles(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-foreground text-base leading-relaxed">{alert.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="bg-muted/60 px-3 py-1 rounded-lg font-medium">{alert.confidence}% confidence</span>
                        <span className="font-medium">{alert.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Zap className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
              </div>
              
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full p-5 rounded-xl border border-border hover:border-primary/30 text-left transition-all duration-200 hover:shadow-sm hover:bg-muted/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground text-base">{action.title}</span>
                      <span className={`text-xs px-3 py-1 rounded-lg border font-medium ${getUrgencyStyles(action.urgency)}`}>
                        {action.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.action}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competitors & Ad Intelligence */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Competitors */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Top Competitors</h2>
            </div>
            
            <div className="space-y-4">
              {topCompetitors.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-muted/20 rounded-xl border border-muted/30 hover:border-muted/50 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground text-base">{competitor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {competitor.adCount} ads • {competitor.spend}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right space-y-1">
                      <div className="text-base font-bold text-foreground">{competitor.dominance}%</div>
                      <div className={`text-sm font-medium ${competitor.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {competitor.change}
                      </div>
                    </div>
                    <div className={`text-sm px-3 py-1 rounded-lg border font-medium ${getThreatColor(competitor.threatLevel)}`}>
                      {competitor.threatLevel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Ad Intelligence */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Ad Intelligence</h2>
            </div>
            
            <div className="space-y-4">
              {recentAds.map((ad) => (
                <div key={ad.id} className="p-5 bg-muted/20 rounded-xl border border-muted/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-foreground text-base leading-relaxed">{ad.headline}</div>
                      <div className="text-sm text-muted-foreground">{ad.competitor} • {ad.platform}</div>
                    </div>
                    <div className={`text-sm px-3 py-1 rounded-lg border bg-muted/20 font-medium ${getPerformanceColor(ad.performance)} border-muted`}>
                      {ad.performance}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-lg font-medium hover:bg-primary/30 transition-colors">
                        {ad.cta}
                      </button>
                      <span className="text-sm text-muted-foreground font-medium">{ad.engagement.toLocaleString()} engagement</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{ad.firstSeen}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
