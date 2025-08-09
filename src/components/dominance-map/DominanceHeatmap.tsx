
import { useState } from 'react';
import { MarketDominance } from '@/services/specterNet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, TrendingUp, Shield, AlertTriangle } from 'lucide-react';

interface DominanceHeatmapProps {
  data: MarketDominance[];
  isLoading: boolean;
  deviceFilter: string;
}

export default function DominanceHeatmap({ data, isLoading, deviceFilter }: DominanceHeatmapProps) {
  const [selectedZone, setSelectedZone] = useState<MarketDominance | null>(null);
  const [hoveredZone, setHoveredZone] = useState<MarketDominance | null>(null);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading market dominance data...</p>
        </div>
      </div>
    );
  }

  // Mock heatmap grid visualization (in production, this would use Mapbox GL)
  const getHeatmapColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getHeatmapOpacity = (score: number) => {
    return Math.max(0.3, score / 100);
  };

  return (
    <div className="relative h-96 bg-muted/10 rounded-lg overflow-hidden">
      {/* Mock Map Grid */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 p-4">
        {data.slice(0, 48).map((zone, index) => (
          <div
            key={zone.id}
            className={`relative cursor-pointer rounded-sm transition-all duration-200 ${getHeatmapColor(zone.dominance_score)} hover:scale-110 hover:z-10`}
            style={{ opacity: getHeatmapOpacity(zone.dominance_score) }}
            onMouseEnter={() => setHoveredZone(zone)}
            onMouseLeave={() => setHoveredZone(null)}
            onClick={() => setSelectedZone(zone)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow">
                {zone.zip_code}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Device Filter Indicator */}
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
          {deviceFilter === 'all' ? 'All Devices' : deviceFilter.charAt(0).toUpperCase() + deviceFilter.slice(1)}
        </Badge>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur rounded-lg p-3 space-y-2">
        <div className="text-sm font-semibold text-foreground mb-2">Dominance Score</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs text-muted-foreground">80-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-xs text-muted-foreground">60-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-xs text-muted-foreground">40-59%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs text-muted-foreground">0-39%</span>
          </div>
        </div>
      </div>

      {/* Tooltip for Hovered Zone */}
      {hoveredZone && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <Card className="bg-background/95 backdrop-blur shadow-lg border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {hoveredZone.city}, {hoveredZone.state} {hoveredZone.zip_code}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dominance Score:</span>
                  <Badge className={`${hoveredZone.dominance_score >= 70 ? 'bg-green-500/20 text-green-400' : 
                    hoveredZone.dominance_score >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'}`}>
                    {hoveredZone.dominance_score.toFixed(1)}%
                  </Badge>
                </div>
                
                {hoveredZone.seo_rank_average && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">SEO Rank:</span>
                    <span className="text-sm font-medium">#{hoveredZone.seo_rank_average.toFixed(1)}</span>
                  </div>
                )}
                
                {hoveredZone.ad_presence_score && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ad Presence:</span>
                    <span className="text-sm font-medium">{hoveredZone.ad_presence_score.toFixed(1)}%</span>
                  </div>
                )}
                
                {hoveredZone.review_score && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Review Score:</span>
                    <span className="text-sm font-medium">{hoveredZone.review_score.toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Zone Details */}
      {selectedZone && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <Card className="bg-background/95 backdrop-blur shadow-lg border w-80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    {selectedZone.city}, {selectedZone.state} {selectedZone.zip_code}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm text-muted-foreground">Dominance</div>
                  <div className="text-lg font-bold text-foreground">
                    {selectedZone.dominance_score.toFixed(1)}%
                  </div>
                </div>
                
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-sm text-muted-foreground">SEO Rank</div>
                  <div className="text-lg font-bold text-foreground">
                    #{selectedZone.seo_rank_average?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(selectedZone.last_calculated).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
