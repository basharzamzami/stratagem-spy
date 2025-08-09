
import ProductionHotAdDetector from '@/components/ad-signal-hijack/ProductionHotAdDetector';
import WatchlistManager from '@/components/ad-signal-hijack/WatchlistManager';
import RealTimeEngagementSpikes from '@/components/ad-signal-hijack/RealTimeEngagementSpikes';
import PageHeader from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Target, TrendingUp } from 'lucide-react';

const HotAdWarRoom = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="🔥 Hot Ad War Room"
        subtitle="Production-grade hot ad detection and counter-campaign system"
      />
      
      <Tabs defaultValue="detector" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detector" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Hot Ad Detector
          </TabsTrigger>
          <TabsTrigger value="spikes" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Live Engagement Spikes
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Watchlist Manager
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detector">
          <ProductionHotAdDetector />
        </TabsContent>

        <TabsContent value="spikes">
          <RealTimeEngagementSpikes />
        </TabsContent>

        <TabsContent value="watchlist">
          <WatchlistManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotAdWarRoom;
