
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Zap, 
  Download, 
  Share, 
  Bell, 
  Filter,
  RefreshCw,
  Bookmark,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsPanelProps {
  totalAds: number;
  onRefresh: () => void;
  onExport: () => void;
  isRefreshing?: boolean;
}

export default function QuickActionsPanel({ 
  totalAds, 
  onRefresh, 
  onExport, 
  isRefreshing = false 
}: QuickActionsPanelProps) {
  const [alertFrequency, setAlertFrequency] = useState('realtime');
  const { toast } = useToast();

  const handleSetAlert = () => {
    toast({
      title: "Alert configured",
      description: `You'll receive ${alertFrequency} notifications for new ads`
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Dashboard link copied to clipboard"
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Filters saved",
      description: "Current search filters have been bookmarked"
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Total Ads Tracked</div>
            <div className="text-xl font-bold">{totalAds.toLocaleString()}</div>
          </div>
          <Badge className="bg-success/20 text-success">
            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
            Live
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share className="w-4 h-4" />
            Share
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBookmark}
            className="flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            Save
          </Button>
        </div>

        {/* Alert Configuration */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bell className="w-4 h-4" />
            Alert Frequency
          </div>
          <Select value={alertFrequency} onValueChange={setAlertFrequency}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSetAlert}
            className="w-full"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Set Alert
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Recent Activity</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>New Meta ad detected</span>
              <span>2m ago</span>
            </div>
            <div className="flex justify-between">
              <span>Filter applied: SaaS</span>
              <span>5m ago</span>
            </div>
            <div className="flex justify-between">
              <span>Export completed</span>
              <span>12m ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
