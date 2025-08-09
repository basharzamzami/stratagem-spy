import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchTasks, createTask, Task } from '@/services/specterNet';
import { Plus, Target, Clock, TrendingUp, CheckCircle, Play, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const REALISTIC_TASKS = [
  {
    title: "Analyze Competitor's Q1 Video Ad Campaign Performance",
    description: "Deep dive into main competitor's video advertising strategy across Meta, YouTube, and TikTok - they've increased spend 40% this quarter",
    priority: 5,
    category: 'ad_creative',
    status: 'pending' as const,
    estimated_impact: 'high',
    execution_steps: {
      steps: [
        "Extract all video ads from Meta Ads Library (target: 50+ creatives)",
        "Analyze video hooks, CTAs, and messaging patterns",
        "Identify audience targeting signals and demographics", 
        "Create counter-campaign strategy with improved messaging",
        "A/B test 3 alternative video concepts based on findings"
      ]
    }
  },
  {
    title: "Target High-Intent SaaS Leads in Chicago Metro Area",
    description: "Identify and engage warm B2B SaaS prospects showing purchase intent signals in Chicago, Naperville, and Evanston ZIP codes",
    priority: 4,
    category: 'lead_gen',
    status: 'pending' as const,
    estimated_impact: 'high',
    execution_steps: {
      steps: [
        "Query CRM for leads with intent_score > 85 in target ZIP codes",
        "Enrich 200+ profiles using Apollo and LinkedIn Sales Navigator",
        "Generate personalized outreach sequences (email + LinkedIn)",
        "Launch multi-touch campaign with 48hr follow-up cadence",
        "Track conversion rates and optimize messaging weekly"
      ]
    }
  },
  {
    title: "SEO Content Gap Analysis for 'Marketing Automation' Keywords",
    description: "Identify high-volume keywords where competitors rank on page 1 but we're absent - focus on commercial intent terms",
    priority: 3,
    category: 'seo',
    status: 'in_progress' as const,
    estimated_impact: 'medium',
    execution_steps: {
      steps: [
        "Audit competitor rankings for 500+ marketing automation terms",
        "Identify gap keywords with >1000 monthly searches",
        "Create content calendar targeting top 20 opportunity keywords",
        "Optimize 5 existing pages for secondary keyword clusters",
        "Build topic cluster content around 'workflow automation'"
      ]
    }
  },
  {
    title: "Monitor Competitor Pricing Changes and Market Response",
    description: "Track competitor pricing updates and analyze market reaction through review sentiment and ad spend changes",
    priority: 4,
    category: 'competitor_analysis',
    status: 'pending' as const,
    estimated_impact: 'high',
    execution_steps: {
      steps: [
        "Set up automated pricing monitoring for top 5 competitors",
        "Analyze review sentiment before/after pricing changes",
        "Track ad spend fluctuations using Meta Ads Library",
        "Identify optimal pricing response strategies",
        "Create alert system for significant market movements"
      ]
    }
  },
  {
    title: "Launch Retargeting Campaign for Website Visitors 90+ Days",
    description: "Re-engage cold website traffic with personalized offers based on their previous page visits and behavior patterns",
    priority: 3,
    category: 'ad_creative',
    status: 'completed' as const,
    estimated_impact: 'medium',
    execution_steps: {
      steps: [
        "Segment 10K+ visitors by page history and engagement depth",
        "Create 6 personalized ad creatives based on interest signals",
        "Set up Facebook and Google retargeting audiences",
        "Launch campaign with $2000 daily budget allocation",
        "Achieved 3.2% CTR and $45 CAC (23% improvement)"
      ]
    }
  },
  {
    title: "Analyze Local Search Rankings for 'Digital Marketing Agency'",
    description: "Comprehensive local SEO audit to improve Google My Business rankings in target cities",
    priority: 2,
    category: 'seo',
    status: 'cancelled' as const,
    estimated_impact: 'low',
    execution_steps: {
      steps: [
        "Audit GMB listings in Chicago, Milwaukee, Detroit markets",
        "Analyze competitor citation profiles and review strategies",
        "Optimize NAP consistency across 50+ local directories",
        "Launch review generation campaign for existing clients"
      ]
    }
  },
  {
    title: "Develop AI-Powered Lead Scoring Model",
    description: "Build predictive model to identify prospects most likely to convert based on engagement patterns and firmographic data",
    priority: 5,
    category: 'lead_gen',
    status: 'in_progress' as const,
    estimated_impact: 'high',
    execution_steps: {
      steps: [
        "Collect 12 months of conversion data (3,000+ records)",
        "Engineer features: email engagement, website behavior, company size",
        "Train Random Forest model with 85%+ accuracy threshold",
        "Implement real-time scoring in CRM workflow",
        "A/B test against current manual qualification process"
      ]
    }
  },
  {
    title: "Competitor Social Media Strategy Deep Dive",
    description: "Analyze top 3 competitors' social media performance, content themes, and engagement patterns across all platforms",
    priority: 3,
    category: 'competitor_analysis',
    status: 'pending' as const,
    estimated_impact: 'medium',
    execution_steps: {
      steps: [
        "Extract 6 months of social posts from LinkedIn, Twitter, Facebook",
        "Identify top-performing content themes and formats",
        "Analyze posting frequency and optimal timing strategies",
        "Map competitor influencer partnerships and collaborations",
        "Create content strategy to outperform in key metrics"
      ]
    }
  }
];

export default function TaskGenerator() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
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
    
    // Add some randomization to make each generated task unique
    const variations = [
      " - Q4 Focus",
      " - Priority Initiative", 
      " - Seasonal Campaign",
      " - Market Expansion",
      " - Competitive Response"
    ];
    
    const modifiedTask = {
      ...randomTask,
      title: randomTask.title + (Math.random() > 0.7 ? variations[Math.floor(Math.random() * variations.length)] : ""),
      status: 'pending' as const // Always create as pending
    };
    
    createTaskMutation.mutate(modifiedTask);
  };

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
    cancelled: tasks?.filter(t => t.status === 'cancelled').length || 0,
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
        {tasks?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Generate AI-powered intelligence tasks to get started
              </p>
              <Button onClick={generateRealisticTask} disabled={createTaskMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Generate First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          tasks?.map((task) => (
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
                    <div className="flex items-center gap-1">
                      <Badge className={`${getCategoryColor(task.category)} text-xs`}>
                        {task.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
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
                      {task.execution_steps.steps.map((step: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Task Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(task.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {task.assigned_to && (
                      <Badge variant="outline" className="text-xs">
                        Assigned to {task.assigned_to}
                      </Badge>
                    )}
                    <Button size="sm" variant="outline">
                      <Play className="w-3 h-3 mr-1" />
                      Start Task
                    </Button>
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
