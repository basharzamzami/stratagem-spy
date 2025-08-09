
export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  impressions: number;
  velocity: number;
  timestamp: string;
}

export interface HotAdAlert {
  id: string;
  competitor: string;
  platform: string;
  ad_content: string;
  engagement_velocity: number;
  threshold_exceeded: number;
  detected_at: string;
  status: 'hot' | 'cooling' | 'expired';
  creative_dna?: CreativeDNA;
}

export interface CreativeDNA {
  hook_type: 'curiosity' | 'fear' | 'status' | 'urgency' | 'social_proof' | 'scarcity';
  color_palette: string[];
  ad_structure: string;
  tone: 'professional' | 'casual' | 'emotional' | 'aggressive' | 'friendly';
  visual_elements: string[];
  cta_style: string;
  psychological_triggers: string[];
}

export interface CounterAd {
  id: string;
  original_ad_id: string;
  competitor: string;
  generated_content: {
    headline: string;
    primary_text: string;
    cta: string;
    visual_concept: string;
  };
  target_audience: {
    demographics: Record<string, any>;
    interests: string[];
    behaviors: string[];
  };
  launch_status: 'generating' | 'ready' | 'launched' | 'paused';
  performance_metrics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
    hijacked_traffic: number;
  };
}

class EngagementMonitor {
  private watchlist: string[] = [];
  private alertThreshold: number = 2.5; // 250% velocity increase
  private scanInterval: number = 300000; // 5 minutes

  async scanCompetitorAds(): Promise<HotAdAlert[]> {
    const alerts: HotAdAlert[] = [];
    
    for (const competitor of this.watchlist) {
      const platforms = ['meta', 'google', 'youtube', 'tiktok', 'linkedin'];
      
      for (const platform of platforms) {
        const adData = await this.fetchPlatformAds(competitor, platform);
        const hotAds = this.detectHotMoments(adData, platform);
        alerts.push(...hotAds);
      }
    }
    
    return alerts.filter(alert => alert.engagement_velocity > this.alertThreshold);
  }

  private async fetchPlatformAds(competitor: string, platform: string) {
    // Mock implementation - would integrate with actual APIs
    const mockAds = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      id: `${platform}_${competitor}_${i}`,
      content: `Mock ad content for ${competitor}`,
      current_engagement: {
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 100) + 10,
        clicks: Math.floor(Math.random() * 500) + 50,
        impressions: Math.floor(Math.random() * 10000) + 1000,
      },
      previous_engagement: {
        likes: Math.floor(Math.random() * 800) + 50,
        comments: Math.floor(Math.random() * 150) + 10,
        shares: Math.floor(Math.random() * 80) + 5,
        clicks: Math.floor(Math.random() * 400) + 25,
        impressions: Math.floor(Math.random() * 8000) + 500,
      },
      timestamp: new Date().toISOString()
    }));
    
    return mockAds;
  }

  private detectHotMoments(adData: any[], platform: string): HotAdAlert[] {
    return adData.map(ad => {
      const velocity = this.calculateEngagementVelocity(
        ad.current_engagement,
        ad.previous_engagement
      );
      
      if (velocity > this.alertThreshold) {
        return {
          id: `hot_${ad.id}`,
          competitor: ad.competitor || 'Unknown',
          platform,
          ad_content: ad.content,
          engagement_velocity: velocity,
          threshold_exceeded: ((velocity - this.alertThreshold) / this.alertThreshold) * 100,
          detected_at: new Date().toISOString(),
          status: 'hot' as const
        };
      }
      return null;
    }).filter(Boolean) as HotAdAlert[];
  }

  private calculateEngagementVelocity(current: any, previous: any): number {
    const currentTotal = current.likes + current.comments + current.shares + current.clicks;
    const previousTotal = previous.likes + previous.comments + previous.shares + previous.clicks;
    
    if (previousTotal === 0) return 0;
    return (currentTotal - previousTotal) / previousTotal;
  }

  setWatchlist(competitors: string[]) {
    this.watchlist = competitors;
  }

  setAlertThreshold(threshold: number) {
    this.alertThreshold = threshold;
  }
}

export const engagementMonitor = new EngagementMonitor();
