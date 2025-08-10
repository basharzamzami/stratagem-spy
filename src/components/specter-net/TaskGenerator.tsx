
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchTasks, createTask, Task } from '@/services/specterNet';
import { Plus, Target, Clock, TrendingUp, CheckCircle, Play, AlertCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const REALISTIC_TASKS = [
  {
    title: "Analyze Competitor's Q1 Video Ad Campaign Performance",
    description: "Deep dive into main competitor's video advertising strategy across Meta, YouTube, and TikTok",
    priority: 5,
    category: 'ad_creative',
    status: 'pending' as const,
    estimated_impact: 'high',
    execution_steps: {
      steps: [
        "Extract all video ads from Meta Ads Library (target: 50+ creatives)",
        "Analyze video hooks, CTAs, and messaging patterns",
        "Identify audience targeting signals and demographics", 
        "Create counter-campaign strategy with improved messaging"
      ]
    }
  },
  {
    title: "Target High-Intent SaaS Leads in Chicago Metro Area",
    description: "Identify and engage warm B2B SaaS prospects showing purchase intent signals",
    priority: 4,
    category: 'lead_gen',
    status: 'pending' as const,
    estimated_impact: 'high',
    execution_steps: {
      steps: [
        "Query CRM for leads with intent_score > 85 in target ZIP codes",
        "Enrich 200+ profiles using Apollo and LinkedIn Sales Navigator",
        "Generate personalized outreach sequences (email + LinkedIn)",
        "Launch multi-touch campaign with 48hr follow-up cadence"
      ]
    }
  },
  {
    title: "SEO Content Gap Analysis for 'Marketing Automation' Keywords",
    description: "Identify high-volume keywords where competitors rank on page 1 but we're absent",
    priority: 3,
    category: 'seo',
    status: 'pending' as const,
    estimated_impact: 'medium',
    execution_steps: {
      steps: [
        "Audit competitor rankings for 500+ marketing automation terms",
        "Identify gap keywords with >1000 monthly searches",
        "Create content calendar targeting top 20 opportunity keywords",
        "Build topic cluster content around 'workflow automation'"
      ]
    }
  }
];

export default function TaskGenerator() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', selectedStatus],
    queryFn: () => fetchTasks(selectedStatus === 'all' ? undefined : selectedStatus),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Created",
        description: "New intelligence task added successfully"
      });
    },
  });

  const generateRealisticTask = () => {
    const randomTask = REALISTIC_TASKS[Math.floor(Math.random() * REALISTIC_TASKS.length)];
    createTaskMutation.mutate(randomTask);
  };

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-400 bg-red-500/10';
    if (priority === 3) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 4) return 'HIGH';
    if (priority === 3) return 'MEDIUM';
    return 'LOW';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in_progress': return <Play className="w-4 h-4 text-primary" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'ad_creative': return 'bg-purple-500/20 text-purple-400';
      case 'seo': return 'bg-green-500/20 text-green-400';
      case 'lead_gen': return 'bg-blue-500/20 text-blue-400';
      case 'competitor_analysis': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const taskStatusCounts = {
    pending: tasks?.filter(t => t.status === 'pending').length || 0,
    in_progress: tasks?.filter(t => t.status === 'in_progress').length || 0,
    completed: tasks?.filter(t => t.status === 'completed').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2 text-muted-foreground">Loading intelligence tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Task Generator</h2>
          <p className="text-muted-foreground">Actionable intelligence tasks prioritized by impact</p>
        </div>
        
        <Button onClick={generateRealisticTask} disabled={createTaskMutation.isPending}>
          <Plus className="w-4 h-4 mr-2" />
          Generate AI Task
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <Button
          variant={selectedStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('all')}
        >
          All ({tasks?.length || 0})
        </Button>
        <Button
          variant={selectedStatus === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('pending')}
        >
          Pending ({taskStatusCounts.pending})
        </Button>
        <Button
          variant={selectedStatus === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('in_progress')}
        >
          In Progress ({taskStatusCounts.in_progress})
        </Button>
        <Button
          variant={selectedStatus === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStatus('completed')}
        >
          Completed ({taskStatusCounts.completed})
        </Button>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Generate AI-powered intelligence tasks to get started'}
              </p>
              {!searchTerm && (
                <Button onClick={generateRealisticTask} disabled={createTaskMutation.isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate First Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      {task.title}
                    </CardTitle>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(task.priority)} text-xs font-medium`}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Task Metadata */}
                <div className="flex items-center gap-4 text-sm">
                  {task.category && (
                    <Badge className={`${getCategoryColor(task.category)} text-xs`}>
                      {task.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                  )}
                  
                  {task.estimated_impact && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Impact: {task.estimated_impact}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Priority: {task.priority}/5</span>
                  </div>
                </div>

                {/* Execution Steps */}
                {task.execution_steps && task.execution_steps.steps && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-foreground mb-2">Execution Plan:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {task.execution_steps.steps.slice(0, 3).map((step: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">{step}</li>
                      ))}
                      {task.execution_steps.steps.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          +{task.execution_steps.steps.length - 3} more steps...
                        </li>
                      )}
                    </ol>
                  </div>
                )}

                {/* Task Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(task.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
