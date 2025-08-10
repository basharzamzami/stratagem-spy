
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Mail, 
  Clock, 
  Users, 
  Target, 
  Play,
  Settings,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface EmailStep {
  id: string;
  subject: string;
  content: string;
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
  conditions?: string[];
}

export default function EmailSequenceBuilder() {
  const [sequenceName, setSequenceName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('signup');
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<EmailStep[]>([
    {
      id: '1',
      subject: 'Welcome to Specter Insights!',
      content: 'Thanks for joining us. Here\'s what you can expect...',
      delay: 0,
      delayUnit: 'minutes'
    }
  ]);
  const [expandedStep, setExpandedStep] = useState<string>('1');

  const addStep = () => {
    const newStep: EmailStep = {
      id: Date.now().toString(),
      subject: '',
      content: '',
      delay: 1,
      delayUnit: 'days'
    };
    setSteps([...steps, newStep]);
    setExpandedStep(newStep.id);
  };

  const updateStep = (stepId: string, field: keyof EmailStep, value: any) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const duplicateStep = (stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (stepToDuplicate) {
      const duplicatedStep = {
        ...stepToDuplicate,
        id: Date.now().toString(),
        subject: `${stepToDuplicate.subject} (Copy)`
      };
      const stepIndex = steps.findIndex(step => step.id === stepId);
      const newSteps = [...steps];
      newSteps.splice(stepIndex + 1, 0, duplicatedStep);
      setSteps(newSteps);
    }
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? '' : stepId);
  };

  return (
    <div className="space-y-6">
      {/* Sequence Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Sequence Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sequence Name</label>
              <Input
                placeholder="e.g., Welcome Series"
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Trigger</label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signup">New Signup</SelectItem>
                  <SelectItem value="trial">Trial Started</SelectItem>
                  <SelectItem value="purchase">Purchase Made</SelectItem>
                  <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                  <SelectItem value="inactive">User Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Describe what this sequence is designed to achieve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
            <div>
              <div className="font-medium">Activate Sequence</div>
              <div className="text-sm text-muted-foreground">
                Start sending emails immediately when trigger conditions are met
              </div>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>

      {/* Email Steps */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Sequence ({steps.length} emails)
            </div>
            <Button onClick={addStep} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Email
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="border rounded-lg">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleStepExpansion(step.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {step.subject || `Email ${index + 1}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {index === 0 ? 'Sent immediately' : `Sent ${step.delay} ${step.delayUnit} after previous email`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateStep(step.id);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {steps.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStep(step.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  {expandedStep === step.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {expandedStep === step.id && (
                <div className="p-4 border-t bg-muted/20 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject Line</label>
                    <Input
                      placeholder="Email subject..."
                      value={step.subject}
                      onChange={(e) => updateStep(step.id, 'subject', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Content</label>
                    <Textarea
                      placeholder="Write your email content here..."
                      value={step.content}
                      onChange={(e) => updateStep(step.id, 'content', e.target.value)}
                      rows={6}
                    />
                  </div>

                  {index > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Delay</label>
                        <Input
                          type="number"
                          min="0"
                          value={step.delay}
                          onChange={(e) => updateStep(step.id, 'delay', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Unit</label>
                        <Select 
                          value={step.delayUnit} 
                          onValueChange={(value) => updateStep(step.id, 'delayUnit', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview & Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Sequence Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>Trigger: {triggerType.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-success" />
                <span>{steps.length} emails</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Total duration: ~{steps.reduce((total, step, index) => 
                  index === 0 ? 0 : total + step.delay, 0)} days</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button>
                <Play className="w-4 h-4 mr-2" />
                {isActive ? 'Update Sequence' : 'Save & Activate'}
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button variant="outline">
                Test Sequence
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
