
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket,
  Target, 
  Zap, 
  Eye,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Play,
  Edit,
  CheckCircle
} from 'lucide-react';
import { counterAdGenerator } from '@/services/counterAdGenerator';
import { CounterAd, CreativeDNA } from '@/services/engagementMonitor';
import { useToast } from '@/hooks/use-toast';

interface CounterAdLauncherProps {
  originalAdId?: string;
  competitor?: string;
  creativeDNA?: CreativeDNA;
  originalContent?: string;
}

const CounterAdLauncher = ({ 
  originalAdId = 'demo_001',
  competitor = 'Competitor',
  creativeDNA,
  originalContent = 'Sample ad content'
}: CounterAdLauncherProps) => {
  const [counterAd, setCounterAd] = useState<CounterAd | null>(null);
  const [generating, setGenerating] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<any>({});
  const { toast } = useToast();

  // Mock creative DNA if not provided
  const mockDNA: CreativeDNA = {
    hook_type: 'curiosity',
    color_palette: ['#007bff', '#28a745', '#dc3545'],
    ad_structure: 'question-based',
    tone: 'professional',
    visual_elements: ['product-shot', 'text-overlay'],
    cta_style: 'learn more',
    psychological_triggers: ['authority', 'social_proof']
  };

  const generateCounterAd = async () => {
    setGenerating(true);
    
    try {
      const generated = await counterAdGenerator.generateCounterAd(
        originalAdId,
        competitor,
        creativeDNA || mockDNA,
        originalContent
      );
      
      setCounterAd(generated);
      setEditedContent(generated.generated_content);
      
      toast({
        title: "🎯 Counter-Ad Generated",
        description: "Ready for review and launch"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to create counter-ad",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const launchCounterAd = async () => {
    if (!counterAd) return;
    
    setLaunching(true);
    setLaunchProgress(0);

    // Simulate launch process
    const launchSteps = [
      { progress: 20, step: "Creating ad assets..." },
      { progress: 40, step: "Setting up targeting..." },
      { progress: 60, step: "Configuring placements..." },
      { progress: 80, step: "Deploying to platforms..." },
      { progress: 100, step: "Ad live and running!" }
    ];

    for (const step of launchSteps) {
      setTimeout(() => {
        setLaunchProgress(step.progress);
      }, step.progress * 50);
    }

    try {
      // Simulate API call to ad platforms
      setTimeout(() => {
        setCounterAd(prev => prev ? { ...prev, launch_status: 'launched' } : null);
        toast({
          title: "🚀 Counter-Ad Launched!",
          description: "Your hijack campaign is now live"
        });
        setLaunching(false);
        setLaunchProgress(0);
      }, 5000);
    } catch (error) {
      toast({
        title: "Launch Failed",
        description: "Unable to deploy counter-ad",
        variant: "destructive"
      });
      setLaunching(false);
    }
  };

  const saveEdits = () => {
    if (counterAd) {
      setCounterAd({ ...counterAd, generated_content: editedContent });
      setEditMode(false);
      toast({
        title: "Changes saved",
        description: "Counter-ad updated successfully"
      });
    }
  };

  const getLaunchStatusColor = (status: string) => {
    switch (status) {
      case 'launched': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ready': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'generating': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/5 border-orange-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Counter-Ad Launcher
            </div>
            <div className="flex items-center gap-2">
              {counterAd && (
                <Badge className={getLaunchStatusColor(counterAd.launch_status)} variant="outline">
                  {counterAd.launch_status.toUpperCase()}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={generateCounterAd}
              disabled={generating}
              variant={counterAd ? "outline" : "default"}
            >
              {generating ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  {counterAd ? 'Regenerate' : 'Generate Counter-Ad'}
                </>
              )}
            </Button>

            {counterAd && counterAd.launch_status === 'ready' && (
              <Button
                onClick={launchCounterAd}
                disabled={launching}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {launching ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Now (15min)
                  </>
                )}
              </Button>
            )}
          </div>

          {launching && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Launch Progress</span>
                <span className="text-sm text-muted-foreground">{launchProgress}%</span>
              </div>
              <Progress value={launchProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Counter-Ad Preview */}
      {counterAd && (
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="targeting" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Targeting
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ad Preview</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? <CheckCircle className="w-3 h-3 mr-1" /> : <Edit className="w-3 h-3 mr-1" />}
                    {editMode ? 'Save' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/20 p-6 rounded-lg border-l-4 border-l-orange-500">
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Headline</label>
                        <Input
                          value={editedContent.headline || ''}
                          onChange={(e) => setEditedContent({...editedContent, headline: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Primary Text</label>
                        <Textarea
                          value={editedContent.primary_text || ''}
                          onChange={(e) => setEditedContent({...editedContent, primary_text: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Call to Action</label>
                        <Input
                          value={editedContent.cta || ''}
                          onChange={(e) => setEditedContent({...editedContent, cta: e.target.value})}
                        />
                      </div>
                      <Button onClick={saveEdits} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {counterAd.generated_content.headline}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {counterAd.generated_content.primary_text}
                      </p>
                      <Button className="bg-primary hover:bg-primary/90">
                        {counterAd.generated_content.cta}
                      </Button>
                    </>
                  )}
                </div>

                <div className="bg-muted/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Visual Concept:</h4>
                  <p className="text-sm text-muted-foreground">
                    {counterAd.generated_content.visual_concept}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Targeting Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Demographics</h4>
                    <div className="space-y-2">
                      {Object.entries(counterAd.target_audience.demographics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm capitalize">{key.replace('_', ' ')}:</span>
                          <span className="text-sm font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {counterAd.target_audience.interests.map(interest => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Behavioral Targeting</h4>
                  <div className="grid gap-2">
                    {counterAd.target_audience.behaviors.map(behavior => (
                      <div key={behavior} className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{behavior}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {counterAd.performance_metrics && Object.entries(counterAd.performance_metrics).map(([key, value]) => (
                <Card key={key}>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace('_', ' ')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Daily Budget:</span>
                      <span className="font-medium">$500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated CPC:</span>
                      <span className="font-medium">$2.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected CTR:</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Projected Impressions:</span>
                      <span className="font-medium">15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Clicks:</span>
                      <span className="font-medium">480</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI Projection:</span>
                      <span className="font-medium text-success">+240%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CounterAdLauncher;
