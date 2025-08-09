
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Users, 
  Pause, 
  Play, 
  Trash2, 
  Settings,
  Facebook,
  Search,
  Youtube,
  Linkedin
} from 'lucide-react';
import { competitorWatchlistManager, CompetitorWatchlistEntry } from '@/services/competitorWatchlistManager';
import { useToast } from '@/hooks/use-toast';

const WatchlistManager = () => {
  const [competitors, setCompetitors] = useState<CompetitorWatchlistEntry[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    competitor_id: '',
    name: '',
    platform: 'facebook' as CompetitorWatchlistEntry['platform'],
    poll_interval: 120
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    try {
      const data = await competitorWatchlistManager.getAllCompetitors();
      setCompetitors(data);
    } catch (error) {
      console.error('Failed to load competitors:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load competitor watchlist",
        variant: "destructive"
      });
    }
  };

  const handleAddCompetitor = async () => {
    try {
      if (!newCompetitor.competitor_id || !newCompetitor.name) {
        toast({
          title: "Validation Error",
          description: "Competitor ID and name are required",
          variant: "destructive"
        });
        return;
      }

      await competitorWatchlistManager.addCompetitor(
        newCompetitor.competitor_id,
        newCompetitor.name,
        newCompetitor.platform,
        newCompetitor.poll_interval
      );

      await loadCompetitors();
      setIsAddDialogOpen(false);
      setNewCompetitor({
        competitor_id: '',
        name: '',
        platform: 'facebook',
        poll_interval: 120
      });

      toast({
        title: "✅ Competitor Added",
        description: `${newCompetitor.name} added to watchlist`
      });

    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add competitor to watchlist",
        variant: "destructive"
      });
    }
  };

  const toggleCompetitorStatus = async (competitor: CompetitorWatchlistEntry) => {
    try {
      const newStatus = competitor.status === 'active' ? 'paused' : 'active';
      await competitorWatchlistManager.updateCompetitorStatus(
        competitor.competitor_id,
        newStatus
      );
      
      await loadCompetitors();
      
      toast({
        title: newStatus === 'active' ? "🟢 Activated" : "⏸️ Paused",
        description: `${competitor.name} monitoring ${newStatus}`
      });

    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update competitor status",
        variant: "destructive"
      });
    }
  };

  const removeCompetitor = async (competitor: CompetitorWatchlistEntry) => {
    try {
      await competitorWatchlistManager.removeCompetitor(competitor.competitor_id);
      await loadCompetitors();
      
      toast({
        title: "🗑️ Removed",
        description: `${competitor.name} removed from watchlist`
      });

    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Failed to remove competitor",
        variant: "destructive"
      });
    }
  };

  const seedDefaultWatchlist = async () => {
    try {
      await competitorWatchlistManager.seedDefaultWatchlist();
      await loadCompetitors();
      
      toast({
        title: "✅ Watchlist Seeded",
        description: "Default competitors added to watchlist"
      });

    } catch (error) {
      toast({
        title: "Seed Failed",
        description: "Failed to seed default watchlist",
        variant: "destructive"
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'google': return <Search className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const activeCount = competitors.filter(c => c.status === 'active').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Competitor Watchlist ({activeCount}/{competitors.length})
          </div>
          <div className="flex gap-2">
            {competitors.length === 0 && (
              <Button variant="outline" size="sm" onClick={seedDefaultWatchlist}>
                🌱 Seed Defaults
              </Button>
            )}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Competitor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Competitor to Watchlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="competitor-id">Competitor ID</Label>
                    <Input
                      id="competitor-id"
                      placeholder="e.g., hubspot, salesforce"
                      value={newCompetitor.competitor_id}
                      onChange={(e) => setNewCompetitor(prev => ({ 
                        ...prev, 
                        competitor_id: e.target.value 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="competitor-name">Company Name</Label>
                    <Input
                      id="competitor-name"
                      placeholder="e.g., HubSpot, Salesforce"
                      value={newCompetitor.name}
                      onChange={(e) => setNewCompetitor(prev => ({ 
                        ...prev, 
                        name: e.target.value 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={newCompetitor.platform} 
                      onValueChange={(value) => setNewCompetitor(prev => ({ 
                        ...prev, 
                        platform: value as CompetitorWatchlistEntry['platform']
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="poll-interval">Poll Interval (seconds)</Label>
                    <Input
                      id="poll-interval"
                      type="number"
                      value={newCompetitor.poll_interval}
                      onChange={(e) => setNewCompetitor(prev => ({ 
                        ...prev, 
                        poll_interval: parseInt(e.target.value) || 120
                      }))}
                    />
                  </div>
                  <Button onClick={handleAddCompetitor} className="w-full">
                    Add to Watchlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {competitors.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No competitors in watchlist
            </p>
            <Button onClick={seedDefaultWatchlist}>
              🌱 Add Default Competitors
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {competitors.map(competitor => (
              <div 
                key={competitor.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getPlatformIcon(competitor.platform)}
                  <div>
                    <div className="font-medium">{competitor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {competitor.competitor_id} • {competitor.poll_interval}s interval
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(competitor.status)}
                  >
                    {competitor.status.toUpperCase()}
                  </Badge>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleCompetitorStatus(competitor)}
                  >
                    {competitor.status === 'active' ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeCompetitor(competitor)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistManager;
