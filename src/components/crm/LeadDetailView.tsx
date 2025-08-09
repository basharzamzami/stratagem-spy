
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Sync
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LeadJourney from './LeadJourney';
import {
  aggregateLeadSources,
  getLeadFollowUpTasks,
  createManualFollowUpTask,
  getLeadCRMSyncStatus,
  syncLeadToExternalCRM,
  LeadSource,
  FollowUpTask,
  ExternalCRMSync
} from '@/services/crmService';

interface Lead {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  title?: string;
  phone?: string;
  location_city?: string;
  location_state?: string;
  location_zip?: string;
  intent_score: number;
  source?: string;
  status: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface LeadDetailViewProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (lead: Lead) => void;
}

export default function LeadDetailView({ lead, isOpen, onClose, onUpdate }: LeadDetailViewProps) {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [followUpTasks, setFollowUpTasks] = useState<any[]>([]);
  const [crmSyncStatus, setCrmSyncStatus] = useState<ExternalCRMSync[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 3,
    due_date: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && lead.id) {
      loadLeadData();
    }
  }, [isOpen, lead.id]);

  const loadLeadData = async () => {
    try {
      setLoading(true);
      const [sourcesData, tasksData, crmData] = await Promise.all([
        aggregateLeadSources(lead.id),
        getLeadFollowUpTasks(lead.id),
        getLeadCRMSyncStatus(lead.id)
      ]);
      
      setSources(sourcesData);
      setFollowUpTasks(tasksData);
      setCrmSyncStatus(crmData);
    } catch (error) {
      console.error('Error loading lead data:', error);
      toast({
        title: "Error",
        description: "Failed to load lead details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      await createManualFollowUpTask(lead.id, newTaskData);
      setNewTaskOpen(false);
      setNewTaskData({ title: '', description: '', priority: 3, due_date: '' });
      await loadLeadData();
      
      toast({
        title: "Task Created",
        description: "Follow-up task has been created successfully"
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const handleCRMSync = async (crmType: 'hubspot' | 'pipedrive') => {
    try {
      await syncLeadToExternalCRM(lead.id, crmType);
      await loadLeadData();
      
      toast({
        title: "Sync Started",
        description: `Lead sync to ${crmType} has been initiated`
      });
    } catch (error) {
      console.error('Error syncing to CRM:', error);
      toast({
        title: "Sync Error",
        description: `Failed to sync lead to ${crmType}`,
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'qualified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'proposal': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'negotiation': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'closed-won': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'closed-lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 ${getScoreColor(lead.intent_score)}`} />
                <span>{lead.name || 'Unknown Lead'}</span>
              </div>
              <Badge className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              Score: <span className={`font-bold ${getScoreColor(lead.intent_score)}`}>
                {lead.intent_score}
              </span>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="sync">CRM Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{lead.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-sm text-muted-foreground">{lead.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.location_city}, {lead.location_state}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Source</Label>
                    <Badge variant="outline" className="ml-2">
                      {lead.source}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {lead.tags?.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Updated</Label>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(lead.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {lead.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lead.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="journey">
            <LeadJourney leadId={lead.id} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Follow-up Tasks</h3>
              <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Follow-up Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="task-title">Title</Label>
                      <Input
                        id="task-title"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        value={newTaskData.description}
                        onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="task-priority">Priority (1-5)</Label>
                        <Input
                          id="task-priority"
                          type="number"
                          min="1"
                          max="5"
                          value={newTaskData.priority}
                          onChange={(e) => setNewTaskData({...newTaskData, priority: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="task-due">Due Date</Label>
                        <Input
                          id="task-due"
                          type="date"
                          value={newTaskData.due_date}
                          onChange={(e) => setNewTaskData({...newTaskData, due_date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateTask} className="flex-1">
                        Create Task
                      </Button>
                      <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {followUpTasks.map((taskLink) => (
                <Card key={taskLink.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{taskLink.tasks.title}</h4>
                        <p className="text-sm text-muted-foreground">{taskLink.tasks.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Priority: {taskLink.tasks.priority}
                          </div>
                          {taskLink.tasks.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {new Date(taskLink.tasks.due_date).toLocaleDateString()}
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {taskLink.auto_generated ? 'Auto' : 'Manual'}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={
                        taskLink.tasks.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }>
                        {taskLink.tasks.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {followUpTasks.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      No follow-up tasks yet. Create one to get started.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <h3 className="text-lg font-semibold">Lead Sources</h3>
            <div className="space-y-3">
              {sources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {source.source_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(source.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Source ID: {source.source_id}
                    </div>
                    {source.source_data && (
                      <div className="mt-2 p-2 bg-muted/20 rounded text-xs">
                        <pre>{JSON.stringify(source.source_data, null, 2)}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {sources.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      No source data available for this lead.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">External CRM Sync</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCRMSync('hubspot')}
                  disabled={loading}
                >
                  <Sync className="w-4 h-4 mr-2" />
                  Sync to HubSpot
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCRMSync('pipedrive')}
                  disabled={loading}
                >
                  <Sync className="w-4 h-4 mr-2" />
                  Sync to Pipedrive
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {crmSyncStatus.map((sync) => (
                <Card key={sync.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {sync.crm_type}
                        </Badge>
                        <Badge className={
                          sync.sync_status === 'synced' 
                            ? 'bg-green-500/20 text-green-400' 
                            : sync.sync_status === 'error'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }>
                          {sync.sync_status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(sync.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div>External ID: {sync.external_id}</div>
                      {sync.last_synced && (
                        <div className="text-muted-foreground">
                          Last synced: {new Date(sync.last_synced).toLocaleString()}
                        </div>
                      )}
                      {sync.error_message && (
                        <div className="text-red-400">
                          Error: {sync.error_message}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {crmSyncStatus.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground mb-4">
                      No CRM sync records yet. Start by syncing to your CRM.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
