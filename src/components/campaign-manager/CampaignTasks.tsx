
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Calendar, Flag } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

interface CampaignTasksProps {
  campaignId: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Update ad copy for weekend targeting',
    description: 'Modify headlines to emphasize weekend emergency services',
    priority: 'High',
    status: 'To Do',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-01-16',
    createdAt: '2024-01-14'
  },
  {
    id: '2',
    title: 'Analyze competitor pricing changes',
    description: 'Review competitor ads from Ad Signal Hijack for pricing updates',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Mike Chen',
    dueDate: '2024-01-18',
    createdAt: '2024-01-13'
  },
  {
    id: '3',
    title: 'Create new landing page variants',
    description: 'A/B test different value propositions based on dominance map insights',
    priority: 'Medium',
    status: 'Done',
    assignedTo: 'Alex Rivera',
    dueDate: '2024-01-15',
    createdAt: '2024-01-10'
  }
];

const CampaignTasks = ({ campaignId }: CampaignTasksProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as const,
    assignedTo: '',
    dueDate: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Low':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-success/20 text-success border-success/30';
      case 'In Progress':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'To Do':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'To Do',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      priority: 'Medium',
      assignedTo: '',
      dueDate: ''
    });
    setShowNewTaskForm(false);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* Add Task Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Campaign Tasks</CardTitle>
            <Button onClick={() => setShowNewTaskForm(!showNewTaskForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        {showNewTaskForm && (
          <CardContent className="border-t border-border pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-4">
                <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Assigned to"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                />
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTask}>Create Task</Button>
                <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['To Do', 'In Progress', 'Done'] as const).map((status) => (
          <Card key={status} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Badge variant="outline" className={getStatusColor(status)}>
                  {status}
                </Badge>
                <span className="text-sm text-card-foreground/70">
                  ({tasks.filter(t => t.status === status).length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks
                  .filter(task => task.status === status)
                  .map((task) => (
                    <div key={task.id} className="p-4 bg-background-secondary rounded-lg border border-border">
                      <div className="flex items-start gap-3 mb-3">
                        <Checkbox 
                          checked={task.status === 'Done'}
                          onCheckedChange={(checked) => {
                            updateTaskStatus(task.id, checked ? 'Done' : 'To Do');
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-card-foreground mb-1">{task.title}</h4>
                          <p className="text-sm text-card-foreground/70 mb-3">{task.description}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              <Flag className="w-3 h-3 mr-1" />
                              {task.priority}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-card-foreground/70">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {task.assignedTo}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {task.dueDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {task.status !== 'Done' && (
                        <div className="flex gap-2">
                          {task.status === 'To Do' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            >
                              Start Task
                            </Button>
                          )}
                          {task.status === 'In Progress' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => updateTaskStatus(task.id, 'Done')}
                            >
                              Mark Done
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignTasks;
