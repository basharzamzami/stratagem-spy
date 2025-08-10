
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Zap, 
  Brain, 
  Sword,
  Rocket,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdHijackIntelligence from './AdHijackIntelligence';
import CreativeDNAAnalyzer from './CreativeDNAAnalyzer';
import CounterAdLauncher from './CounterAdLauncher';
import { HotAd } from '@/services/mockAdData';

interface CounterAttackOrchestratorProps {
  targetAd: HotAd;
  onClose?: () => void;
}

const CounterAttackOrchestrator = ({ targetAd, onClose }: CounterAttackOrchestratorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [processData, setProcessData] = useState<any>({});
  const { toast } = useToast();

  const counterAttackSteps = [
    {
      id: 'skeleton',
      title: 'Extract Ad Skeleton',
      description: 'Analyze structure, flow & persuasion sequence',
      icon: Target,
      component: 'intelligence'
    },
    {
      id: 'psychology', 
      title: 'Decode Psychology',
      description: 'Identify triggers, emotions & persuasion tactics',
      icon: Brain,
      component: 'dna'
    },
    {
      id: 'weaponize',
      title: 'Generate Counter-Weapon',
      description: 'Build superior ads with amplified messaging',
      icon: Sword,
      component: 'launcher'
    },
    {
      id: 'deploy',
      title: 'Deploy & Launch',
      description: 'Launch counter-attack campaign',
      icon: Rocket,
      component: 'launcher'
    }
  ];

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
      
      if (stepIndex === currentStep && stepIndex < counterAttackSteps.length - 1) {
        setCurrentStep(stepIndex + 1);
      }
      
      toast({
        title: `✅ ${counterAttackSteps[stepIndex].title} Complete`,
        description: "Moving to next phase of counter-attack"
      });
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return 'complete';
    if (stepIndex === currentStep) return 'active';
    if (stepIndex < currentStep) return 'accessible';
    return 'locked';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'active': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'accessible': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const renderCurrentComponent = () => {
    const currentStepData = counterAttackSteps[currentStep];
    
    switch (currentStepData.component) {
      case 'intelligence':
        return (
          <AdHijackIntelligence 
            initialData={{
              headline: targetAd.headline,
              content: targetAd.copy,
              competitor: targetAd.competitor
            }}
            onAnalysisComplete={() => markStepComplete(0)}
          />
        );
      case 'dna':
        return (
          <CreativeDNAAnalyzer 
            initialData={{
              headline: targetAd.headline,
              content: targetAd.copy,
              imageUrl: targetAd.imageUrl
            }}
            onAnalysisComplete={() => markStepComplete(1)}
          />
        );
      case 'launcher':
        return (
          <CounterAdLauncher 
            originalAdId={targetAd.id}
            competitor={targetAd.competitor}
            originalContent={targetAd.copy}
            onLaunchComplete={() => markStepComplete(currentStep)}
          />
        );
      default:
        return <div>Component not found</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/5 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Sword className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Counter-Attack Orchestrator</h2>
                <p className="text-sm text-muted-foreground">
                  Targeting: {targetAd.competitor} • {targetAd.platform}
                </p>
              </div>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Target Ad Preview */}
          <div className="bg-background/50 p-4 rounded-lg border-l-4 border-l-red-500 mb-4">
            <h3 className="font-semibold text-sm mb-2">Target Ad:</h3>
            <p className="text-sm font-medium mb-1">{targetAd.headline}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{targetAd.copy}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {targetAd.engagementRate}% CTR
              </Badge>
              <Badge variant="outline" className="text-xs">
                ${targetAd.estimatedSpend}/day
              </Badge>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {counterAttackSteps.map((step, index) => {
              const status = getStepStatus(index);
              const Icon = step.icon;
              
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${getStepColor(status)}`}
                  onClick={() => status !== 'locked' && jumpToStep(index)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">Step {index + 1}</span>
                    {status === 'complete' && <CheckCircle className="w-3 h-3 ml-auto" />}
                    {status === 'active' && <Zap className="w-3 h-3 ml-auto animate-pulse" />}
                    {status === 'locked' && <AlertTriangle className="w-3 h-3 ml-auto" />}
                  </div>
                  <div className="text-xs font-medium mb-1">{step.title}</div>
                  <div className="text-xs opacity-90">{step.description}</div>
                </div>
              );
            })}
          </div>

          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Counter-Attack Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps.length} / {counterAttackSteps.length} Complete
              </span>
            </div>
            <Progress 
              value={(completedSteps.length / counterAttackSteps.length) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Step Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(counterAttackSteps[currentStep].icon, { className: "w-5 h-5" })}
            {counterAttackSteps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentComponent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          Previous Step
        </Button>
        
        <Button
          onClick={() => currentStep < counterAttackSteps.length - 1 && setCurrentStep(currentStep + 1)}
          disabled={currentStep === counterAttackSteps.length - 1}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CounterAttackOrchestrator;
