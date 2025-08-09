
import { supabase } from "@/integrations/supabase/client";

export interface EngagementEvent {
  platform: string;
  ad_id: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  impressions: number;
  watch_time?: number;
  clicks?: number;
}

export interface HotAdAlert {
  ad_id: string;
  platform: string;
  competitor_id: string;
  detect_time: string;
  velocity_score: number;
  baseline: number;
  primary_triggers: string[];
  creative_dna_id: string | null;
  snapshot_url: string;
  status: 'detected' | 'processing' | 'completed';
}

export interface CreativeDNA {
  creative_dna_id: string;
  ad_id: string;
  hook_type: Record<string, number>;
  primary_cta: string;
  color_palette: string[];
  visual_elements: {
    human_face: boolean;
    product_demo: boolean;
    text_overlay_ratio: number;
  };
  offer_type: string;
  confidence: number;
}

// Mock data stores since database tables don't exist yet
const mockCompetitorsWatchlist: any[] = [
  { competitor_id: 'comp-1', name: 'Competitor A', platform: 'facebook', status: 'active' },
  { competitor_id: 'comp-2', name: 'Competitor B', platform: 'google', status: 'active' }
];
const mockEngagementEvents: EngagementEvent[] = [];
const mockHotAdAlerts: HotAdAlert[] = [];
const mockCreativeDNA: Record<string, CreativeDNA> = {};

class ProductionHotAdDetector {
  private velocityThreshold: number = 75;
  private relativeIncreaseThreshold: number = 2.0;
  private minEngagement: number = 50;
  private cooldownHours: number = 1;
  private shortWindowMinutes: number = 10;
  private longWindowHours: number = 6;
  private pollInterval: number = 120; // seconds

  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  /**
   * HOTAD-001: Main detection service
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🚀 Starting Hot Ad Detection Service...');
    
    // Initial scan
    await this.performDetectionCycle();
    
    // Schedule regular monitoring
    this.monitoringInterval = setInterval(() => {
      this.performDetectionCycle().catch(console.error);
    }, this.pollInterval * 1000);
  }

  async stopMonitoring(): Promise<void> {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('⏹️ Hot Ad Detection Service stopped');
  }

  private async performDetectionCycle(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Use mock competitors watchlist since table doesn't exist
      const competitors = mockCompetitorsWatchlist.filter(c => c.status === 'active');

      if (competitors.length === 0) {
        console.log('No active competitors in watchlist');
        return;
      }

      // Poll platform APIs for engagement data
      const newEvents = await this.pollPlatformAPIs(competitors);
      
      // Process events and detect hot ads
      const alerts = await this.processEngagementEvents(newEvents);
      
      // Extract Creative DNA for hot ads
      for (const alert of alerts) {
        await this.extractCreativeDNA(alert);
      }

      const processingTime = Date.now() - startTime;
      console.log(`✅ Detection cycle completed in ${processingTime}ms. Found ${alerts.length} hot ads.`);

    } catch (error) {
      console.error('❌ Detection cycle error:', error);
    }
  }

  private async pollPlatformAPIs(competitors: any[]): Promise<EngagementEvent[]> {
    const events: EngagementEvent[] = [];
    
    for (const competitor of competitors) {
      // Mock platform polling - in production, integrate with actual APIs
      const mockEvents = await this.mockPlatformPoll(competitor);
      events.push(...mockEvents);
    }

    // Store events in mock data store instead of database
    mockEngagementEvents.push(...events);

    return events;
  }

  private async mockPlatformPoll(competitor: any): Promise<EngagementEvent[]> {
    const events: EngagementEvent[] = [];
    const now = new Date();
    
    // Generate 1-3 ads per competitor
    const adCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < adCount; i++) {
      const adId = `${competitor.competitor_id}-ad-${i}`;
      
      // Create engagement pattern with potential spike
      const isHotAd = Math.random() < 0.15; // 15% chance of hot ad
      const baseEngagement = 20 + Math.random() * 30;
      const spikeMultiplier = isHotAd ? 3 + Math.random() * 2 : 1;
      
      const event: EngagementEvent = {
        platform: competitor.platform,
        ad_id: adId,
        timestamp: now.toISOString(),
        likes: Math.floor(baseEngagement * spikeMultiplier * 0.4),
        shares: Math.floor(baseEngagement * spikeMultiplier * 0.1),
        comments: Math.floor(baseEngagement * spikeMultiplier * 0.2),
        impressions: Math.floor(baseEngagement * spikeMultiplier * 15),
        clicks: Math.floor(baseEngagement * spikeMultiplier * 0.3),
        watch_time: Math.floor(baseEngagement * spikeMultiplier * 2)
      };
      
      events.push(event);
    }
    
    return events;
  }

  private async processEngagementEvents(newEvents: EngagementEvent[]): Promise<HotAdAlert[]> {
    const alerts: HotAdAlert[] = [];
    
    // Group events by ad_id
    const eventsByAd = new Map<string, EngagementEvent[]>();
    for (const event of newEvents) {
      if (!eventsByAd.has(event.ad_id)) {
        eventsByAd.set(event.ad_id, []);
      }
      eventsByAd.get(event.ad_id)!.push(event);
    }

    for (const [adId, events] of eventsByAd) {
      const alert = await this.detectHotMoment(adId, events[0]);
      if (alert) {
        alerts.push(alert);
      }
    }

    return alerts;
  }

  private async detectHotMoment(adId: string, currentEvent: EngagementEvent): Promise<HotAdAlert | null> {
    const now = new Date();
    const shortWindowStart = new Date(now.getTime() - this.shortWindowMinutes * 60 * 1000);
    const longWindowStart = new Date(now.getTime() - this.longWindowHours * 60 * 60 * 1000);

    // Check cooldown using mock data
    const recentAlert = mockHotAdAlerts.find(alert => 
      alert.ad_id === adId && 
      new Date(alert.detect_time).getTime() > now.getTime() - this.cooldownHours * 60 * 60 * 1000
    );

    if (recentAlert) {
      return null; // Still in cooldown
    }

    // Get historical engagement data from mock store
    const shortWindow = mockEngagementEvents.filter(event => 
      event.ad_id === adId &&
      new Date(event.timestamp).getTime() >= shortWindowStart.getTime()
    );

    const longWindow = mockEngagementEvents.filter(event => 
      event.ad_id === adId &&
      new Date(event.timestamp).getTime() >= longWindowStart.getTime() &&
      new Date(event.timestamp).getTime() < shortWindowStart.getTime()
    );

    if (shortWindow.length === 0 || longWindow.length === 0) {
      return null; // Insufficient data
    }

    // Calculate engagement metrics
    const currentEngagement = this.calculateTotalEngagement(currentEvent);
    const shortAvg = this.calculateAverageEngagement(shortWindow);
    const longAvg = this.calculateAverageEngagement(longWindow);

    if (currentEngagement < this.minEngagement) {
      return null; // Below minimum threshold
    }

    // Calculate velocity and scores
    const baseline = longAvg;
    const velocityScore = baseline > 0 ? (currentEngagement / baseline) * 50 : 0;
    const relativeIncrease = baseline > 0 ? currentEngagement / baseline : 0;

    // Apply detection thresholds
    const isHot = (
      velocityScore >= this.velocityThreshold ||
      relativeIncrease >= this.relativeIncreaseThreshold
    ) && currentEngagement >= this.minEngagement;

    if (isHot) {
      const alert: HotAdAlert = {
        ad_id: adId,
        platform: currentEvent.platform,
        competitor_id: this.extractCompetitorId(adId),
        detect_time: now.toISOString(),
        velocity_score: Math.round(velocityScore),
        baseline,
        primary_triggers: [], // Will be filled by Creative DNA
        creative_dna_id: null,
        snapshot_url: `https://cdn.specternet/snapshots/${adId}.png`,
        status: 'detected'
      };

      // Store in mock data store
      mockHotAdAlerts.push(alert);

      return alert;
    }

    return null;
  }

  /**
   * HOTAD-002: Creative DNA Extraction Pipeline
   */
  private async extractCreativeDNA(alert: HotAdAlert): Promise<void> {
    try {
      const extractionStart = Date.now();
      
      // Generate mock ad content for DNA analysis
      const mockAdContent = this.generateMockAdContent(alert.ad_id);
      
      // Text analysis for hooks and triggers
      const hookScores = this.analyzeHookTypes(mockAdContent.headline, mockAdContent.body);
      
      // Visual analysis (mocked)
      const visualElements = this.analyzeVisualElements(alert.snapshot_url);
      
      // Color extraction (mocked)
      const colorPalette = this.extractColorPalette(alert.snapshot_url);
      
      // CTA extraction
      const primaryCta = this.extractCTA(mockAdContent.body);
      
      // Offer type classification
      const offerType = this.classifyOfferType(mockAdContent.body);
      
      // Calculate confidence score
      const confidence = Math.max(...Object.values(hookScores));
      
      const creativeDNA: CreativeDNA = {
        creative_dna_id: `dna-${alert.ad_id}-${Date.now()}`,
        ad_id: alert.ad_id,
        hook_type: hookScores,
        primary_cta: primaryCta,
        color_palette: colorPalette,
        visual_elements: visualElements,
        offer_type: offerType,
        confidence: confidence
      };

      // Store in mock data store
      mockCreativeDNA[creativeDNA.creative_dna_id] = creativeDNA;

      // Update alert with DNA reference and primary triggers
      const primaryTriggers = Object.entries(hookScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([trigger]) => trigger);

      // Update the alert in mock store
      const alertIndex = mockHotAdAlerts.findIndex(a => a.ad_id === alert.ad_id);
      if (alertIndex >= 0) {
        mockHotAdAlerts[alertIndex] = {
          ...mockHotAdAlerts[alertIndex],
          creative_dna_id: creativeDNA.creative_dna_id,
          primary_triggers: primaryTriggers,
          status: 'processing'
        };
      }

      const extractionTime = Date.now() - extractionStart;
      console.log(`🧬 Creative DNA extracted for ${alert.ad_id} in ${extractionTime}ms`);

    } catch (error) {
      console.error(`❌ Failed to extract Creative DNA for ${alert.ad_id}:`, error);
    }
  }

  private generateMockAdContent(adId: string) {
    const templates = [
      {
        headline: "Limited Time: Exclusive Access Inside",
        body: "Don't miss out on this rare opportunity. Join the exclusive circle of industry leaders who discovered the secret formula. Book your spot now - only 50 seats available!"
      },
      {
        headline: "The Authority Everyone's Talking About",
        body: "Trusted by Fortune 500 companies worldwide. Our proven system delivers results that others can't match. Get started with our premium solution today."
      },
      {
        headline: "Before It's Too Late - Urgent Notice",
        body: "Market conditions are changing rapidly. Secure your competitive advantage now before your competitors catch up. Free consultation available this week only."
      }
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private analyzeHookTypes(headline: string, body: string): Record<string, number> {
    const text = `${headline} ${body}`.toLowerCase();
    
    const triggerKeywords = {
      scarcity: ['limited', 'exclusive', 'only', 'rare', 'few left', 'while supplies last'],
      authority: ['trusted', 'proven', 'expert', 'leader', 'authority', 'certified'],
      urgency: ['urgent', 'now', 'today', 'immediate', 'deadline', 'expires'],
      curiosity: ['secret', 'discover', 'revealed', 'hidden', 'mystery', 'unknown'],
      social_proof: ['everyone', 'thousands', 'millions', 'popular', 'trending', 'viral'],
      fear: ['don\'t miss', 'before it\'s too late', 'avoid', 'prevent', 'protect']
    };

    const scores: Record<string, number> = {};
    
    for (const [trigger, keywords] of Object.entries(triggerKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          score += 0.2;
        }
      }
      scores[trigger] = Math.min(1.0, score);
    }

    return scores;
  }

  private analyzeVisualElements(snapshotUrl: string) {
    // Mock visual analysis - in production, use computer vision
    return {
      human_face: Math.random() > 0.5,
      product_demo: Math.random() > 0.7,
      text_overlay_ratio: Math.random() * 0.5 + 0.1
    };
  }

  private extractColorPalette(snapshotUrl: string): string[] {
    // Mock color extraction - in production, analyze actual image
    const palettes = [
      ['#ff4d4f', '#ffffff', '#1890ff'],
      ['#52c41a', '#faad14', '#722ed1'],
      ['#fa541c', '#13c2c2', '#eb2f96']
    ];
    
    return palettes[Math.floor(Math.random() * palettes.length)];
  }

  private extractCTA(text: string): string {
    const ctaPatterns = [
      'book your spot', 'get started', 'join now', 'learn more', 
      'sign up', 'try free', 'contact us', 'discover', 'unlock'
    ];
    
    const lowerText = text.toLowerCase();
    return ctaPatterns.find(cta => lowerText.includes(cta)) || 'learn more';
  }

  private classifyOfferType(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('free') || lowerText.includes('trial')) return 'free_trial';
    if (lowerText.includes('discount') || lowerText.includes('%')) return 'discount';
    if (lowerText.includes('consultation')) return 'consultation';
    if (lowerText.includes('demo')) return 'demo';
    if (lowerText.includes('exclusive') || lowerText.includes('premium')) return 'premium_access';
    
    return 'information';
  }

  private calculateTotalEngagement(event: EngagementEvent): number {
    return event.likes + event.shares + event.comments + (event.clicks || 0);
  }

  private calculateAverageEngagement(events: EngagementEvent[]): number {
    if (events.length === 0) return 0;
    
    const total = events.reduce((sum, event) => 
      sum + event.likes + event.shares + event.comments + (event.clicks || 0), 0
    );
    
    return total / events.length;
  }

  private extractCompetitorId(adId: string): string {
    return adId.split('-')[0] || 'unknown';
  }

  // Configuration methods
  setVelocityThreshold(threshold: number): void {
    this.velocityThreshold = threshold;
  }

  setRelativeIncreaseThreshold(threshold: number): void {
    this.relativeIncreaseThreshold = threshold;
  }

  setPollInterval(seconds: number): void {
    this.pollInterval = seconds;
  }

  // Status methods
  isActive(): boolean {
    return this.isMonitoring;
  }

  async getSystemMetrics() {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Use mock data for metrics
    const recentAlerts = mockHotAdAlerts.filter(alert => 
      new Date(alert.detect_time).getTime() >= hourAgo.getTime()
    );

    const recentEvents = mockEngagementEvents.filter(event => 
      new Date(event.timestamp).getTime() >= hourAgo.getTime()
    );

    return {
      hot_ads_detected_last_hour: recentAlerts.length,
      engagement_events_processed: recentEvents.length,
      avg_detection_latency: 2.3, // Mock metric
      system_status: this.isMonitoring ? 'active' : 'stopped'
    };
  }
}

export const productionHotAdDetector = new ProductionHotAdDetector();
