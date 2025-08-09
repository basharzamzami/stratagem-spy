
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Database, 
  Shield, 
  CreditCard, 
  Zap,
  Globe,
  Key,
  Target,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    newLeads: true,
    competitorAlerts: true,
    campaignResults: true,
    systemUpdates: false
  });
  const [apiKeys, setApiKeys] = useState({
    meta: "••••••••••••••••",
    google: "••••••••••••••••",
    linkedin: "",
    hubspot: ""
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Configure your Specter Net platform</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Intelligence
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="Your Company" defaultValue="Specter Intelligence Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select defaultValue="marketing">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                          <SelectItem value="saas">SaaS & Technology</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc-8">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="utc+0">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="realtime">Real-time Scanning</Label>
                        <p className="text-sm text-muted-foreground">Enable continuous lead and competitor monitoring</p>
                      </div>
                      <Switch 
                        id="realtime"
                        checked={realTimeEnabled}
                        onCheckedChange={setRealTimeEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scan-frequency">Scan Frequency</Label>
                      <Select defaultValue="5min">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1min">Every Minute</SelectItem>
                          <SelectItem value="5min">Every 5 Minutes</SelectItem>
                          <SelectItem value="15min">Every 15 Minutes</SelectItem>
                          <SelectItem value="30min">Every 30 Minutes</SelectItem>
                          <SelectItem value="1hour">Every Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data-retention">Data Retention</Label>
                      <Select defaultValue="90days">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">30 Days</SelectItem>
                          <SelectItem value="90days">90 Days</SelectItem>
                          <SelectItem value="180days">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Intelligence Settings */}
            <TabsContent value="intelligence">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="intent-threshold">Intent Score Threshold</Label>
                      <Select defaultValue="70">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50 - Low Threshold</SelectItem>
                          <SelectItem value="70">70 - Medium Threshold</SelectItem>
                          <SelectItem value="80">80 - High Threshold</SelectItem>
                          <SelectItem value="90">90 - Very High Threshold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="geo-priority">Geographic Priority</Label>
                      <Input id="geo-priority" placeholder="US, CA, UK" defaultValue="US, CA" />
                      <p className="text-xs text-muted-foreground">Comma-separated country codes</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Priority Keywords</Label>
                      <Input 
                        id="keywords" 
                        placeholder="competitive analysis, market research" 
                        defaultValue="competitive intelligence, market analysis, competitor monitoring"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Competitor Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="competitors">Tracked Competitors</Label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        <Badge variant="outline">SimilarWeb</Badge>
                        <Badge variant="outline">Ahrefs</Badge>
                        <Badge variant="outline">SEMrush</Badge>
                        <Badge variant="outline">SpyFu</Badge>
                      </div>
                      <Input id="competitors" placeholder="Add competitor domain" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ad-platforms">Ad Platforms to Monitor</Label>
                      <div className="space-y-2">
                        {['Meta/Facebook', 'Google Ads', 'LinkedIn', 'Twitter/X', 'TikTok', 'YouTube'].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Switch id={platform.toLowerCase()} defaultChecked={['Meta/Facebook', 'Google Ads'].includes(platform)} />
                            <Label htmlFor={platform.toLowerCase()}>{platform}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Integrations */}
            <TabsContent value="integrations">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(apiKeys).map(([platform, key]) => (
                      <div key={platform} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={platform} className="capitalize">{platform} API Key</Label>
                          {key && key !== "" && !key.includes('•') ? 
                            <CheckCircle className="w-4 h-4 text-success" /> : 
                            <AlertCircle className="w-4 h-4 text-muted-foreground" />
                          }
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            id={platform}
                            type="password"
                            placeholder={`Enter ${platform} API key`}
                            value={key}
                            onChange={(e) => setApiKeys(prev => ({...prev, [platform]: e.target.value}))}
                          />
                          <Button variant="outline" size="sm">
                            <Key className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>CRM Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="crm-platform">CRM Platform</Label>
                      <Select defaultValue="hubspot">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hubspot">HubSpot</SelectItem>
                          <SelectItem value="salesforce">Salesforce</SelectItem>
                          <SelectItem value="pipedrive">Pipedrive</SelectItem>
                          <SelectItem value="zoho">Zoho CRM</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-sync Leads</Label>
                        <p className="text-sm text-muted-foreground">Automatically sync new leads to your CRM</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sync Deal Updates</Label>
                        <p className="text-sm text-muted-foreground">Keep deal stages synchronized</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Database className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Email Notifications</h3>
                      {Object.entries(notifications).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                            <p className="text-sm text-muted-foreground">
                              {key === 'newLeads' && 'Get notified when new qualified leads are found'}
                              {key === 'competitorAlerts' && 'Alert when competitors make significant changes'}
                              {key === 'campaignResults' && 'Updates on campaign performance'}
                              {key === 'systemUpdates' && 'Platform updates and maintenance notices'}
                            </p>
                          </div>
                          <Switch 
                            checked={enabled}
                            onCheckedChange={(checked) => 
                              setNotifications(prev => ({...prev, [key]: checked}))
                            }
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Alert Frequency</h3>
                      <div className="space-y-2">
                        <Label htmlFor="alert-frequency">High Priority Alerts</Label>
                        <Select defaultValue="immediate">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                            <SelectItem value="daily">Daily Summary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="digest-frequency">Weekly Digest</Label>
                        <Select defaultValue="monday">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Notification Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">Encrypt stored lead and competitor data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Activity Logging</Label>
                        <p className="text-sm text-muted-foreground">Track platform usage and changes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      View Security Log
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Billing */}
            <TabsContent value="billing">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-primary/5 rounded-lg border">
                      <h3 className="text-2xl font-bold text-primary">Enterprise Pro</h3>
                      <p className="text-3xl font-bold mt-2">$299<span className="text-base font-normal text-muted-foreground">/month</span></p>
                      <Badge className="mt-2" variant="outline">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>API Calls</span>
                        <span>24,567 / 100,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Leads Tracked</span>
                        <span>1,247 / 5,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Competitors Monitored</span>
                        <span>12 / 25</span>
                      </div>
                    </div>
                    <Button className="w-full">Upgrade Plan</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-email">Billing Email</Label>
                      <Input id="billing-email" type="email" defaultValue="billing@specterintel.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>•••• •••• •••• 4242</span>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Next Billing Date</Label>
                      <p className="text-sm text-muted-foreground">February 15, 2025</p>
                    </div>
                    <Button variant="outline" className="w-full">View Billing History</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
