
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { DollarSign, Calendar, User, Building, Target } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  company: string;
  contact: string;
  value: number;
  probability: number;
  stage: 'Discovery' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost';
  closeDate: string;
  lastActivity: string;
  competitorThreats: string[];
}

const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'TechFlow Solutions Enterprise',
    company: 'TechFlow Solutions',
    contact: 'Sarah Chen',
    value: 75000,
    probability: 85,
    stage: 'Negotiation',
    closeDate: '2024-02-15',
    lastActivity: '2 hours ago',
    competitorThreats: ['SimilarWeb']
  },
  {
    id: '2',
    name: 'DataDriven Analytics Platform',
    company: 'DataDriven Corp',
    contact: 'Marcus Rodriguez',
    value: 120000,
    probability: 70,
    stage: 'Proposal',
    closeDate: '2024-02-28',
    lastActivity: '1 day ago',
    competitorThreats: ['Ahrefs', 'SEMrush']
  }
];

const stages = [
  { id: 'Discovery', name: 'Discovery', color: 'bg-blue-500' },
  { id: 'Qualification', name: 'Qualification', color: 'bg-yellow-500' },
  { id: 'Proposal', name: 'Proposal', color: 'bg-orange-500' },
  { id: 'Negotiation', name: 'Negotiation', color: 'bg-purple-500' },
  { id: 'Closed-Won', name: 'Closed-Won', color: 'bg-green-500' },
  { id: 'Closed-Lost', name: 'Closed-Lost', color: 'bg-red-500' }
];

export default function CRMDeals() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newStage = result.destination.droppableId as Deal['stage'];
    const dealId = result.draggableId;

    setDeals(deals.map(deal => 
      deal.id === dealId 
        ? { ...deal, stage: newStage }
        : deal
    ));
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getTotalValueByStage = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {deals.length} active deals
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weighted Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${Math.round(deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Based on probability
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              ${Math.round(deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Across all stages
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {stages.map((stage) => (
                <div key={stage.id} className="min-w-80 flex-shrink-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{stage.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getDealsByStage(stage.id).length}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${getTotalValueByStage(stage.id).toLocaleString()}
                    </div>
                  </div>
                  
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-96 p-3 rounded-lg border-2 border-dashed transition-colors ${
                          snapshot.isDraggingOver 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border bg-muted/20'
                        }`}
                      >
                        <div className="space-y-3">
                          {getDealsByStage(stage.id).map((deal, index) => (
                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 bg-card rounded-lg border shadow-sm cursor-grab ${
                                    snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                  }`}
                                >
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="font-medium text-card-foreground text-sm">
                                        {deal.name}
                                      </h4>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-xs text-card-foreground/70">
                                      <div className="flex items-center gap-1">
                                        <Building className="w-3 h-3" />
                                        {deal.company}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {deal.contact}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1 text-sm font-medium text-card-foreground">
                                        <DollarSign className="w-3 h-3" />
                                        ${deal.value.toLocaleString()}
                                      </div>
                                      <div className="text-xs text-card-foreground/70">
                                        {deal.probability}% prob.
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-card-foreground/70">Probability</span>
                                        <span className="font-medium text-card-foreground">{deal.probability}%</span>
                                      </div>
                                      <Progress value={deal.probability} className="h-2" />
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-xs text-card-foreground/70">
                                      <Calendar className="w-3 h-3" />
                                      Close: {new Date(deal.closeDate).toLocaleDateString()}
                                    </div>
                                    
                                    {deal.competitorThreats.length > 0 && (
                                      <div className="flex gap-1 flex-wrap">
                                        {deal.competitorThreats.map((competitor, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs bg-red-500/10 text-red-400">
                                            <Target className="w-2 h-2 mr-1" />
                                            {competitor}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
}
