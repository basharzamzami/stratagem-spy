
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  MousePointer, 
  Target, 
  Clock, 
  ArrowRight, 
  Plus,
  TrendingUp 
} from 'lucide-react';
import { getLeadJourney, addJourneyStage, LeadJourneyStage } from '@/services/crmService';

interface LeadJourneyProps {
  leadId: string;
  onStageAdd?: (stage: LeadJourneyStage) => void;
}

const stageIcons = {
  keyword: Search,
  touchpoint: MousePointer,
  conversion: Target
};

const stageColors = {
  keyword: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  touchpoint: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  conversion: 'bg-green-500/20 text-green-400 border-green-500/30'
};

export default function LeadJourney({ leadId, onStageAdd }: LeadJourneyProps) {
  const [journey, setJourney] = useState<LeadJourneyStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingStage, setAddingStage] = useState(false);

  useEffect(() => {
    loadJourney();
  }, [leadId]);

  const loadJourney = async () => {
    try {
      setLoading(true);
      const data = await getLeadJourney(leadId);
      setJourney(data);
    } catch (error) {
      console.error('Error loading lead journey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = async (stage: 'keyword' | 'touchpoint' | 'conversion', stageData: Record<string, any>) => {
    try {
      setAddingStage(true);
      const newStage = await addJourneyStage({
        lead_id: leadId,
        stage,
        stage_data: stageData,
        sequence_order: journey.length + 1
      });
      
      setJourney([...journey, newStage]);
      onStageAdd?.(newStage);
    } catch (error) {
      console.error('Error adding journey stage:', error);
    } finally {
      setAddingStage(false);
    }
  };

  const getCompletionPercentage = () => {
    if (journey.length === 0) return 0;
    const hasKeyword = journey.some(stage => stage.stage === 'keyword');
    const hasTouchpoint = journey.some(stage => stage.stage === 'touchpoint');
    const hasConversion = journey.some(stage => stage.stage === 'conversion');
    
    let completion = 0;
    if (hasKeyword) completion += 33;
    if (hasTouchpoint) completion += 33;
    if (hasConversion) completion += 34;
    
    return completion;
  };

  const getStagesByType = (stageType: 'keyword' | 'touchpoint' | 'conversion') => {
    return journey.filter(stage => stage.stage === stageType);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Lead Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Lead Journey
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {getCompletionPercentage()}% Complete
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Journey Progress</span>
            <span>{journey.length} stages</span>
          </div>
          <Progress value={getCompletionPercentage()} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Journey Stages */}
        <div className="space-y-4">
          {(['keyword', 'touchpoint', 'conversion'] as const).map((stageType, index) => {
            const stages = getStagesByType(stageType);
            const StageIcon = stageIcons[stageType];
            
            return (
              <div key={stageType} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${stageColors[stageType]}`}>
                      <StageIcon className="w-4 h-4" />
                    </div>
                    <h4 className="font-medium capitalize">{stageType}</h4>
                    <Badge variant="outline" className="text-xs">
                      {stages.length}
                    </Badge>
                  </div>
                  
                  {index < 2 && stages.length > 0 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {stages.length > 0 ? (
                  <div className="ml-12 space-y-2">
                    {stages.map((stage, idx) => (
                      <div key={stage.id} className="p-3 bg-muted/20 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">
                            Stage {stage.sequence_order}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(stage.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {stage.stage_data.description || 
                           `${stageType.charAt(0).toUpperCase() + stageType.slice(1)} stage data`}
                        </div>

                        {stage.stage_data.keywords && (
                          <div className="flex gap-1 flex-wrap mt-2">
                            {stage.stage_data.keywords.map((keyword: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {stage.stage_data.touchpoint_type && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {stage.stage_data.touchpoint_type}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ml-12 p-4 border-2 border-dashed border-muted rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">
                        No {stageType} stages yet
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const stageData = {
                            description: `New ${stageType} stage`,
                            timestamp: new Date().toISOString(),
                            ...(stageType === 'keyword' && { keywords: ['competitive analysis'] }),
                            ...(stageType === 'touchpoint' && { touchpoint_type: 'website visit' }),
                            ...(stageType === 'conversion' && { conversion_type: 'lead qualification' })
                          };
                          handleAddStage(stageType, stageData);
                        }}
                        disabled={addingStage}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add {stageType}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Journey Summary */}
        {journey.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Journey started: {new Date(journey[0]?.timestamp).toLocaleDateString()}</div>
              {journey.length > 1 && (
                <div>Latest activity: {new Date(journey[journey.length - 1]?.timestamp).toLocaleDateString()}</div>
              )}
              <div>Total stages: {journey.length}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
