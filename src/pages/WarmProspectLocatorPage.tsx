
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StrikeWindowPredictor from '@/components/lead-locator/StrikeWindowPredictor';
import WarmProspectLocator from '@/components/lead-locator/WarmProspectLocator';
import LeadFlowVisualization from '@/components/lead-locator/LeadFlowVisualization';
import AutoPitchGenerator from '@/components/lead-locator/AutoPitchGenerator';
import { 
  Target, 
  Users, 
  MapPin, 
  MessageSquare,
  Zap
} from 'lucide-react';

export default function WarmProspectLocatorPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Warm Prospect Locator
          </h1>
          <p className="text-muted-foreground">
            Precision lead intelligence with conversion timing optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-success rounded-full inline-block mr-2"></div>
            Live Monitoring Active
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="strike-windows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strike-windows" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Strike Windows
          </TabsTrigger>
          <TabsTrigger value="warm-leads" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Warm Leads
          </TabsTrigger>
          <TabsTrigger value="flow-map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Flow Map
          </TabsTrigger>
          <TabsTrigger value="auto-pitch" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Auto-Pitch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strike-windows" className="space-y-6">
          <StrikeWindowPredictor />
        </TabsContent>

        <TabsContent value="warm-leads" className="space-y-6">
          <WarmProspectLocator />
        </TabsContent>

        <TabsContent value="flow-map" className="space-y-6">
          <LeadFlowVisualization />
        </TabsContent>

        <TabsContent value="auto-pitch" className="space-y-6">
          <AutoPitchGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
