import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Play, 
  Pause,
  BarChart3,
  MousePointer,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { creativeDNAAnalyzer } from '@/services/creativeDNAExtractor';
import EnhancedSpikeTooltip from './EnhancedSpikeTooltip';
import AdPreviewModal from './AdPreviewModal';

interface EngagementDataPoint {
  timestamp: string;
  time: string;
  impressions: number;
  clicks: number;
  ad_id: string;
  platform: string;
  competitor: string;
  isSpike: boolean;
  likes?: number;
  comments?: number;
  shares?: number;
}

interface SpikeEvent {
  timestamp: string;
  ad_id: string;
  platform: string;
  competitor: string;
  impressions: number;
  clicks: number;
  type: 'impressions' | 'clicks' | 'both';
  likes?: number;
  comments?: number;
  shares?: number;
}

const RealTimeEngagementSpikes = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<EngagementDataPoint[]>([]);
  const [spikes, setSpikes] = useState<SpikeEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSpike, setSelectedSpike] = useState<EngagementDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Enhanced mock events data with additional engagement metrics
  const mockEvents = [
    { ad_id: 'ad_001', platform: 'facebook', competitor: 'TechFlow Solutions', impressions: 1200, clicks: 45, likes: 23, comments: 8, shares: 5 },
    { ad_id: 'ad_002', platform: 'google', competitor: 'DataDriven Analytics', impressions: 1800, clicks: 67, likes: 35, comments: 12, shares: 8 },
    { ad_id: 'ad_003', platform: 'youtube', competitor: 'InnovateNow Corp', impressions: 2500, clicks: 120, likes: 89, comments: 25, shares: 18 }, // Spike
    { ad_id: 'ad_004', platform: 'facebook', competitor: 'NextGen Dynamics', impressions: 1400, clicks: 52, likes: 28, comments: 9, shares: 6 },
    { ad_id: 'ad_005', platform: 'google', competitor: 'Digital Pioneers', impressions: 1600, clicks: 58, likes: 31, comments: 11, shares: 7 },
    { ad_id: 'ad_006', platform: 'facebook', competitor: 'TechFlow Solutions', impressions: 3200, clicks: 89, likes: 156, comments: 34, shares: 23 }, // Spike
    { ad_id: 'ad_007', platform: 'youtube', competitor: 'DataDriven Analytics', impressions: 1900, clicks: 71, likes: 42, comments: 15, shares: 9 },
    { ad_id: 'ad_008', platform: 'google', competitor: 'InnovateNow Corp', impressions: 2800, clicks: 145, likes: 78, comments: 28, shares: 19 }, // Spike
    { ad_id: 'ad_009', platform: 'facebook', competitor: 'NextGen Dynamics', impressions: 1300, clicks: 48, likes: 25, comments: 7, shares: 4 },
    { ad_id: 'ad_010', platform: 'youtube', competitor: 'Digital Pioneers', impressions: 2100, clicks: 95, likes: 52, comments: 18, shares: 12 },
    { ad_id: 'ad_011', platform: 'google', competitor: 'TechFlow Solutions', impressions: 4100, clicks: 178, likes: 234, comments: 67, shares: 45 }, // Major spike
    { ad_id: 'ad_012', platform: 'facebook', competitor: 'DataDriven Analytics', impressions: 1500, clicks: 56, likes: 29, comments: 10, shares: 6 }
  ];

  // Spike detection thresholds
  const IMPRESSION_SPIKE_THRESHOLD = 2000;
  const CLICK_SPIKE_THRESHOLD = 100;

  const detectSpike = (impressions: number, clicks: number): 'impressions' | 'clicks' | 'both' | null => {
    const impressionSpike = impressions > IMPRESSION_SPIKE_THRESHOLD;
    const clickSpike = clicks > CLICK_SPIKE_THRESHOLD;
    
    if (impressionSpike && clickSpike) return 'both';
    if (impressionSpike) return 'impressions';
    if (clickSpike) return 'clicks';
    return null;
  };

  const processNextEvent = () => {
    if (currentIndex >= mockEvents.length) {
      stopSimulation();
      return;
    }

    const event = mockEvents[currentIndex];
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    const spikeType = detectSpike(event.impressions, event.clicks);
    const isSpike = spikeType !== null;

    const dataPoint: EngagementDataPoint = {
      timestamp: now.toISOString(),
      time: timeString,
      impressions: event.impressions,
      clicks: event.clicks,
      ad_id: event.ad_id,
      platform: event.platform,
      competitor: event.competitor,
      isSpike,
      likes: event.likes,
      comments: event.comments,
      shares: event.shares
    };

    setData(prev => {
      const newData = [...prev, dataPoint];
      return newData.slice(-20);
    });

    if (isSpike) {
      const spike: SpikeEvent = {
        timestamp: timeString,
        ad_id: event.ad_id,
        platform: event.platform,
        competitor: event.competitor,
        impressions: event.impressions,
        clicks: event.clicks,
        type: spikeType,
        likes: event.likes,
        comments: event.comments,
        shares: event.shares
      };

      setSpikes(prev => [spike, ...prev.slice(0, 4)]);

      toast({
        title: "🚨 Engagement Spike Detected!",
        description: `${event.platform} - ${event.competitor} (${event.ad_id}) - Click spike dot for details`,
        variant: "destructive"
      });
    }

    setCurrentIndex(prev => prev + 1);
  };

  const startSimulation = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(processNextEvent, 2000);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setData([]);
    setSpikes([]);
    setCurrentIndex(0);
    setSelectedSpike(null);
  };

  const handleSpikeClick = (entry: any, event: any) => {
    if (entry && entry.payload && entry.payload.isSpike) {
      setSelectedSpike(entry.payload);
      setTooltipPosition({ 
        x: event.activeLabel || event.chartX || 0, 
        y: event.chartY || 0 
      });
      
      console.log("\n=== AD DETAILS WITH CREATIVE DNA ===");
      console.log(`Ad ID: ${entry.payload.ad_id} | Platform: ${entry.payload.platform} | Competitor: ${entry.payload.competitor}`);
      console.log(`Impressions: ${entry.payload.impressions} | Clicks: ${entry.payload.clicks}`);
      
      const creativeDNA = creativeDNAAnalyzer.getCreativeDNA(entry.payload.ad_id);
      if (creativeDNA) {
        console.log(`Hook Type: ${creativeDNA.hook_type} | Tone: ${creativeDNA.tone}`);
        console.log(`Psychological Triggers: ${creativeDNA.psychological_triggers.join(', ')}`);
      }
      console.log("=====================================\n");
    }
  };

  const handleViewSnapshot = (adId: string) => {
    const mockSnapshotUrl = `https://example.com/snapshots/${adId}`;
    console.log(`Quick view for ad: ${adId}`);
    
    toast({
      title: "Quick Snapshot",
      description: `Opened snapshot for ${adId} - Mock URL: ${mockSnapshotUrl}`,
    });
  };

  const handleViewFullPreview = (adId: string) => {
    setSelectedAdId(adId);
    setPreviewModalOpen(true);
    setSelectedSpike(null); // Close tooltip
    
    console.log(`Opening full creative analysis for: ${adId}`);
    
    toast({
      title: "Creative DNA Analysis",
      description: `Loading comprehensive analysis for ${adId}`,
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const creativeDNA = creativeDNAAnalyzer.getCreativeDNA(data.ad_id);
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Time: ${label}`}</p>
          <p className="text-blue-400">{`Impressions: ${data.impressions.toLocaleString()}`}</p>
          <p className="text-green-400">{`Clicks: ${data.clicks.toLocaleString()}`}</p>
          <p className="text-sm text-muted-foreground">{`${data.platform} - ${data.competitor}`}</p>
          <p className="text-sm text-muted-foreground">{`Ad: ${data.ad_id}`}</p>
          
          {creativeDNA && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium">Creative DNA</span>
              </div>
              <p className="text-xs text-cyan-400">{`Hook: ${creativeDNA.hook_type.replace('_', ' ')}`}</p>
              <p className="text-xs text-purple-400">{`Tone: ${creativeDNA.tone}`}</p>
            </div>
          )}
          
          {data.isSpike && (
            <div className="mt-2">
              <Badge variant="destructive" className="mb-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Spike Detected - Click for full analysis
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MousePointer className="w-3 h-3" />
                Click spike dot for creative DNA insights
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 relative">
      {/* Control Header */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Interactive Engagement Spike Monitor
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isRunning ? stopSimulation : startSimulation}
                variant={isRunning ? "destructive" : "default"}
                size="sm"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Simulation
                  </>
                )}
              </Button>
              <Button onClick={resetSimulation} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {isRunning ? 'Live Monitoring' : 'Stopped'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Events Processed: {currentIndex} / {mockEvents.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Spikes Detected: {spikes.length}
            </div>
            <div className="flex items-center gap-1 text-sm text-blue-400">
              <MousePointer className="w-3 h-3" />
              Click red spike dots for details
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Live Engagement Data (Click Spikes for Details)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                className="text-sm" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-sm" />
              <Tooltip content={customTooltip} />
              
              <ReferenceLine 
                y={IMPRESSION_SPIKE_THRESHOLD} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                label="Impression Spike Threshold"
              />
              
              <Line
                type="monotone"
                dataKey="impressions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, onClick: handleSpikeClick }}
                name="Impressions"
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, onClick: handleSpikeClick }}
                name="Clicks"
              />
              
              {/* Interactive spike dots overlay */}
              <ScatterChart data={data.filter(d => d.isSpike)}>
                <Scatter 
                  dataKey="impressions" 
                  fill="#ef4444"
                  onClick={handleSpikeClick}
                >
                  {data.filter(d => d.isSpike).map((entry, index) => (
                    <Cell key={`spike-${index}`} fill="#ef4444" stroke="#ef4444" strokeWidth={3} r={8} cursor="pointer" />
                  ))}
                </Scatter>
              </ScatterChart>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enhanced Interactive Spike Tooltip */}
      {selectedSpike && (
        <div 
          style={{
            position: 'fixed',
            left: `${Math.min(tooltipPosition.x + 20, window.innerWidth - 420)}px`,
            top: `${Math.max(tooltipPosition.y - 120, 10)}px`,
            zIndex: 1000
          }}
        >
          <EnhancedSpikeTooltip
            data={selectedSpike}
            creativeDNA={creativeDNAAnalyzer.getCreativeDNA(selectedSpike.ad_id)}
            onClose={() => setSelectedSpike(null)}
            onViewSnapshot={handleViewSnapshot}
            onViewFullPreview={handleViewFullPreview}
          />
        </div>
      )}

      {/* Ad Preview Modal */}
      <AdPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        adPreview={creativeDNAAnalyzer.getAdPreview(selectedAdId)}
      />

      {/* Recent Spikes List */}
      {spikes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Recent Spikes ({spikes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spikes.map((spike, index) => (
                <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg cursor-pointer hover:bg-red-500/15 transition-colors"
                     onClick={() => setSelectedSpike({
                       ...spike,
                       time: spike.timestamp,
                       isSpike: true
                     } as EngagementDataPoint)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">
                        {spike.type.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-medium">{spike.competitor}</div>
                        <div className="text-sm text-muted-foreground">
                          {spike.platform} • {spike.ad_id} • {spike.timestamp}
                        </div>
                        {spike.likes && (
                          <div className="text-xs text-muted-foreground">
                            👍 {spike.likes} • 💬 {spike.comments} • 🔄 {spike.shares}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-400">
                        {spike.impressions.toLocaleString()} impressions
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {spike.clicks.toLocaleString()} clicks
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeEngagementSpikes;
