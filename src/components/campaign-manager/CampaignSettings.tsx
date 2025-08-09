
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Save, Zap, Bell, Shield, Database } from 'lucide-react';

const CampaignSettings = () => {
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [smartBidding, setSmartBidding] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');

  return (
    <div className="space-y-6">
      {/* Campaign Automation Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Auto Optimization</Label>
                  <p className="text-sm text-card-foreground/70">
                    Automatically optimize campaigns based on performance
                  </p>
                </div>
                <Switch
                  checked={autoOptimization}
                  onCheckedChange={setAutoOptimization}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Smart Bidding</Label>
                  <p className="text-sm text-card-foreground/70">
                    Use AI to adjust bids for better performance
                  </p>
                </div>
                <Switch
                  checked={smartBidding}
                  onCheckedChange={setSmartBidding}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="optimization-frequency" className="text-card-foreground">
                  Optimization Frequency
                </Label>
                <Select defaultValue="hourly">
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="risk-tolerance" className="text-card-foreground">
                  Risk Tolerance
                </Label>
                <Select defaultValue="moderate">
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert & Notification Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-warning-foreground" />
            </div>
            Alert & Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-card-foreground">Enable Alerts</Label>
              <p className="text-sm text-card-foreground/70">
                Receive notifications for campaign performance changes
              </p>
            </div>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </div>

          {alertsEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="spend-threshold" className="text-card-foreground">
                    Daily Spend Threshold (%)
                  </Label>
                  <Input 
                    id="spend-threshold"
                    type="number" 
                    defaultValue="120"
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-card-foreground/70 mt-1">
                    Alert when daily spend exceeds this percentage of budget
                  </p>
                </div>

                <div>
                  <Label htmlFor="roas-threshold" className="text-card-foreground">
                    Minimum ROAS Alert
                  </Label>
                  <Input 
                    id="roas-threshold"
                    type="number" 
                    step="0.1"
                    defaultValue="2.0"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-card-foreground">Notification Channels</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="email" defaultChecked />
                      <Label htmlFor="email" className="text-sm">Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="slack" />
                      <Label htmlFor="slack" className="text-sm">Slack</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="sms" />
                      <Label htmlFor="sms" className="text-sm">SMS</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data & Privacy Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-success-foreground" />
            </div>
            Data & Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="data-retention" className="text-card-foreground">
                Data Retention Period (days)
              </Label>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-card-foreground">Export Format</Label>
              <Select defaultValue="csv">
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="api-keys" className="text-card-foreground">
                Connected Platform APIs
              </Label>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400">Google Ads</Badge>
                <Badge variant="outline" className="bg-blue-600/20 text-blue-400">Meta Business</Badge>
                <Badge variant="outline" className="bg-red-500/20 text-red-400">YouTube</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-destructive-foreground" />
            </div>
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="custom-rules" className="text-card-foreground">
              Custom Automation Rules
            </Label>
            <Textarea 
              id="custom-rules"
              placeholder="Enter custom JavaScript rules for advanced automation..."
              className="bg-background border-border mt-2"
              rows={4}
            />
            <p className="text-xs text-card-foreground/70 mt-1">
              Use JavaScript syntax to create custom automation rules
            </p>
          </div>

          <div>
            <Label htmlFor="webhook-url" className="text-card-foreground">
              Webhook URL
            </Label>
            <Input 
              id="webhook-url"
              type="url" 
              placeholder="https://your-webhook-url.com/campaign-events"
              className="bg-background border-border"
            />
            <p className="text-xs text-card-foreground/70 mt-1">
              Receive campaign events via webhook
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default CampaignSettings;
