
import { Shield, Target, Map, Bell, TrendingUp, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const metrics = [
    {
      title: "Active Competitors",
      value: "23",
      change: "+3",
      icon: Target,
      status: "success"
    },
    {
      title: "New Signals",
      value: "147",
      change: "+12",
      icon: Activity,
      status: "primary"
    },
    {
      title: "Market Coverage",
      value: "78%",
      change: "+5%",
      icon: Map,
      status: "warning"
    },
    {
      title: "Threat Level",
      value: "Medium",
      change: "↑ High",
      icon: Shield,
      status: "danger"
    }
  ];

  const recentAlerts = [
    {
      type: "ad-change",
      competitor: "TechFlow Solutions",
      action: "New campaign launched targeting 'AI automation'",
      time: "2m ago",
      severity: "high"
    },
    {
      type: "pricing",
      competitor: "DataSync Pro",
      action: "Reduced pricing by 15% on enterprise tier",
      time: "1h ago",
      severity: "medium"
    },
    {
      type: "content",
      competitor: "CloudMax",
      action: "Published new case study in healthcare",
      time: "3h ago",
      severity: "low"
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Command Center
          </h1>
          <p className="text-foreground-secondary">
            Real-time competitive intelligence dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="status-indicator bg-success"></div>
          <span className="text-sm text-foreground-secondary">All systems operational</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="command-grid">
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card animate-fadeInUp" style={{animationDelay: `${index * 100}ms`}}>
            <div className="flex items-start justify-between">
              <div>
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

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Intelligence</h2>
            <Bell className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-background-secondary/50 hover:bg-background-secondary transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'high' ? 'bg-danger animate-pulse' :
                  alert.severity === 'medium' ? 'bg-warning' :
                  'bg-success'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{alert.competitor}</h4>
                    <span className="text-xs text-foreground-secondary">{alert.time}</span>
                  </div>
                  <p className="text-sm text-foreground-secondary">{alert.action}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { title: "Launch Counter-Campaign", desc: "Deploy response to competitor move", variant: "primary" },
              { title: "Update Pricing Strategy", desc: "Adjust based on market analysis", variant: "warning" },
              { title: "Expand Territory", desc: "Target competitor weak zones", variant: "success" },
              { title: "Alert Team", desc: "Notify stakeholders of threats", variant: "danger" }
            ].map((action, index) => (
              <button
                key={index}
                className={`w-full p-4 rounded-lg text-left transition-all hover:scale-105 ${
                  action.variant === 'primary' ? 'bg-gradient-primary hover:shadow-lg hover:shadow-primary/25' :
                  action.variant === 'warning' ? 'bg-warning/10 hover:bg-warning/20 border border-warning/20' :
                  action.variant === 'success' ? 'bg-success/10 hover:bg-success/20 border border-success/20' :
                  'bg-danger/10 hover:bg-danger/20 border border-danger/20'
                }`}
              >
                <h4 className="font-medium mb-1">{action.title}</h4>
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
