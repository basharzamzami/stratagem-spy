
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  User, 
  CheckCircle, 
  Play, 
  Pause,
  Target,
  Zap,
  TrendingUp,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { AutoPlaybook, PlaybookAction } from '@/services/realTimeCompetitorMonitor';

interface AutoPlaybookManagerProps {
  playbooks: AutoPlaybook[];
  onUpdateStatus: (id: string, status: AutoPlaybook['status']) => void;
}

export default function AutoPlaybookManager({ playbooks, onUpdateStatus }: AutoPlaybookManagerProps) {
  const [selectedPlaybook, setSelectedPlaybook] = useState<AutoPlaybook | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'approved': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case 'ad_campaign': return <Target className="w-4 h-4" />;
      case 'content_creation': return <FileText className="w-4 h-4" />;
      case 'seo_optimization': return <TrendingUp className="w-4 h-4" />;
      case 'pricing_adjustment': return <TrendingUp className="w-4 h-4" />;
      case 'product_update': return <Zap className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const calculateProgress = (playbook: AutoPlaybook) => {
    const completedActions = playbook.actions.filter(a => a.assigned_to).length;
    return (completedActions / playbook.actions.length) * 100;
  };

  const activePlaybooks = playbooks.filter(p => p.status !== 'completed');
  const completedPlaybooks = playbooks.filter(p => p.status === 'completed');

  if (playbooks.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Playbooks Generated</h3>
          <p className="text-muted-foreground">
            Playbooks will be automatically generated when high-impact competitor activities are detected
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active ({activePlaybooks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedPlaybooks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-6 md:grid-cols-2">
            {activePlaybooks.map((playbook) => (
              <Card key={playbook.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{playbook.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        vs {playbook.competitor_name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className={getPriorityColor(playbook.priority)}>
                        {playbook.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(playbook.status)}>
                        {playbook.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(calculateProgress(playbook))}%</span>
                    </div>
                    <Progress value={calculateProgress(playbook)} className="h-2" />
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">ETA:</span>
                      <span className="font-medium">{playbook.estimated_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="font-medium">{playbook.estimated_impact}</span>
                    </div>
                  </div>

                  {/* Action Summary */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Actions ({playbook.actions.length})</div>
                    <div className="space-y-1">
                      {playbook.actions.slice(0, 3).map((action, index) => (
                        <div key={action.id} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                            {getActionTypeIcon(action.type)}
                          </div>
                          <span className="flex-1 text-muted-foreground truncate">
                            {action.title}
                          </span>
                          {action.assigned_to && (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                        </div>
                      ))}
                      {playbook.actions.length > 3 && (
                        <div className="text-xs text-muted-foreground ml-8">
                          +{playbook.actions.length - 3} more actions
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedPlaybook(playbook)}
                      className="flex-1"
                    >
                      View Details
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                    {playbook.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => onUpdateStatus(playbook.id, 'approved')}
                        className="bg-primary"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    {playbook.status === 'approved' && (
                      <Button 
                        size="sm" 
                        onClick={() => onUpdateStatus(playbook.id, 'in_progress')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            {completedPlaybooks.map((playbook) => (
              <Card key={playbook.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{playbook.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {playbook.competitor_name} • Completed {new Date(playbook.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor('completed')}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        COMPLETED
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Playbook Detail Modal would go here */}
      {selectedPlaybook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedPlaybook.title}</CardTitle>
                  <p className="text-muted-foreground">vs {selectedPlaybook.competitor_name}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedPlaybook(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedPlaybook.actions.map((action, index) => (
                <div key={action.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getActionTypeIcon(action.type)}
                      </div>
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">Priority {action.priority}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {action.estimated_hours}h estimated
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{action.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-2">Resources Needed:</div>
                      <ul className="space-y-1">
                        {action.resources_needed.map((resource, i) => (
                          <li key={i} className="text-muted-foreground">• {resource}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium mb-2">Success Metrics:</div>
                      <ul className="space-y-1">
                        {action.success_metrics.map((metric, i) => (
                          <li key={i} className="text-muted-foreground">• {metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
