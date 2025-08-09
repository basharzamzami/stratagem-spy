
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Brain,
  ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/services/specterNet';

export default function TaskGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetchTasks(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const generateIntelligenceTasks = async () => {
    setIsGenerating(true);
    
    // Simulate AI task generation
    const mockGeneratedTasks = [
      {
        id: 'gen_1',
        title: 'Analyze SimilarWeb Q1 Strategy Shift',
        description: 'Recent ad spend increase detected. Analyze new messaging and target audience changes.',
        priority: 4,
        category: 'competitive_analysis',
        estimated_impact: 'High - Could reveal new market opportunity',
        execution_steps: {
          steps: [
            'Collect all SimilarWeb ads from Q1',
            'Compare messaging vs Q4 previous year',
            'Identify new targeting parameters',
            'Document strategic implications'
          ]
        },
        ai_confidence: 92,
        trigger_source: 'change_alert_system'
      },
      {
        id: 'gen_2',
        title: 'High-Intent Lead Outreach Campaign',
        description: 'Multiple leads showing strong buying signals in enterprise segment.',
        priority: 5,
        category: 'outreach',
        estimated_impact: 'Critical - $150K+ pipeline opportunity',
        execution_steps: {
          steps: [
            'Segment leads by company size and intent score',
            'Create personalized outreach sequences',
            'Prepare demo materials for enterprise use cases',
            'Schedule follow-up cadence'
          ]
        },
        ai_confidence: 88,
        trigger_source: 'lead_scoring_system'
      },
      {
        id: 'gen_3',
        title: 'Competitor Landing Page Analysis',
        description: 'New competitor landing pages detected with innovative value props.',
        priority: 3,
        category: 'research',
        estimated_impact: 'Medium - Inform our messaging strategy',
        execution_steps: {
          steps: [
            'Screenshot and catalog new landing pages',
            'Extract value propositions and messaging',
            'Compare pricing and feature positioning',
            'Identify differentiation opportunities'
          ]
        },
        ai_confidence: 85,
        trigger_source: 'ad_signal_hijack'
      }
    ];

    // Simulate generation delay
    for (let i = 0; i < mockGeneratedTasks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGeneratedTasks(prev => [...prev, mockGeneratedTasks[i]]);
    }

    setIsGenerating(false);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-400 bg-red-500/20';
    if (priority >= 3) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-blue-400 bg-blue-500/20';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'competitive_analysis': return Target;
      case 'outreach': return TrendingUp;
      case 'research': return Brain;
      default: return Clock;
    }
  };

  const activeTasksCount = tasks.filter(t => t.status === 'pending').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Task Generation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeTasksCount}</div>
            <div className="text-sm text-muted-foreground">
              {generatedTasks.length} AI-generated today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{Math.round(taskCompletionRate)}%</div>
            <Progress value={taskCompletionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {tasks.filter(t => t.priority >= 4).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Require immediate attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">94%</div>
            <div className="text-sm text-muted-foreground">
              Average task accuracy
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Generation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Task Generator
            </CardTitle>
            <Button onClick={generateIntelligenceTasks} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Tasks
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedTasks.map((task, index) => {
              const CategoryIcon = getCategoryIcon(task.category);
              
              return (
                <div key={task.id} className="p-4 bg-muted/20 rounded-lg border animate-fade-in" 
                     style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        Priority {task.priority}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                        AI: {task.ai_confidence}%
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="font-medium">Impact:</span> {task.estimated_impact}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Source:</span> {task.trigger_source.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Execution Steps:</div>
                    <div className="space-y-1">
                      {task.execution_steps.steps.map((step: string, stepIndex: number) => (
                        <div key={stepIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                            {stepIndex + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="default">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Accept & Assign
                    </Button>
                    <Button size="sm" variant="outline">
                      Modify
                    </Button>
                    <Button size="sm" variant="outline">
                      Add to Campaign
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {generatedTasks.length === 0 && !isGenerating && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>AI Task Generator ready. Click "Generate Tasks" to analyze current intelligence and create actionable tasks.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
