
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, MessageSquare, Save } from 'lucide-react';
import { useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  description: string;
}

interface CampaignOverviewProps {
  campaign: Campaign;
}

const mockPerformanceData = [
  { date: '01/08', spend: 245, conversions: 12, clicks: 156 },
  { date: '01/09', spend: 289, conversions: 18, clicks: 203 },
  { date: '01/10', spend: 267, conversions: 15, clicks: 178 },
  { date: '01/11', spend: 312, conversions: 22, clicks: 234 },
  { date: '01/12', spend: 298, conversions: 19, clicks: 198 },
  { date: '01/13', spend: 356, conversions: 28, clicks: 267 },
  { date: '01/14', spend: 334, conversions: 24, clicks: 245 }
];

const CampaignOverview = ({ campaign }: CampaignOverviewProps) => {
  const [notes, setNotes] = useState('Campaign is performing well. Consider increasing budget for weekend targeting.');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Daily Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Daily Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Bar 
                  dataKey="spend" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Top Performing Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-card-foreground">Saturday</span>
                <Badge className="bg-success/20 text-success">28 conversions</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-card-foreground">Sunday</span>
                <Badge className="bg-success/20 text-success">24 conversions</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-card-foreground">Friday</span>
                <Badge className="bg-primary/20 text-primary">22 conversions</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Audience Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-card-foreground">Age 35-44</span>
                <span className="text-sm text-card-foreground/70">42%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-card-foreground">Age 45-54</span>
                <span className="text-sm text-card-foreground/70">31%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-card-foreground">Miami Metro</span>
                <span className="text-sm text-card-foreground/70">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm text-card-foreground">ROAS increased 15%</p>
                  <p className="text-xs text-card-foreground/70">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-card-foreground">Budget 73% spent</p>
                  <p className="text-xs text-card-foreground/70">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Notes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <MessageSquare className="w-5 h-5" />
              Campaign Notes
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                'Edit'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add campaign notes and observations..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-card-foreground whitespace-pre-wrap">{notes}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignOverview;
