export interface EngagementSnapshot {
  ad_id: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  impressions: number;
  watch_time?: number;
}

export interface HotAdAlert {
  ad_id: string;
  detect_time: string;
  velocity_score: number;
  primary_triggers: string[];
  creative_dna_id: string;
  confidence: number;
  baseline_engagement: number;
  current_engagement: number;
  relative_increase: number;
}

export interface CreativeDNA {
  dna_id: string;
  hook_type: 'curiosity' | 'fear' | 'status' | 'novelty' | 'scarcity' | 'relatability';
  colors: string[];
  tone: 'professional' | 'casual' | 'emotional' | 'aggressive' | 'friendly';
  offer_type: string;
  cta_text: string;
  confidence_scores: Record<string, number>;
}

export interface CounterAdJob {
  job_id: string;
  original_ad_id: string;
  target_audience_spec: {
    demographics: Record<string, any>;
    interests: string[];
    behaviors: string[];
  };
  creative_variants: Array<{
    headline: string;
    primary_text: string;
    cta: string;
    strategy: 'flip' | 'undermine' | 'amplify';
    visual_concept: string;
  }>;
  scheduled_time: string;
  estimated_cost: number;
  status: 'created' | 'approved' | 'launched' | 'paused';
}

class HotAdDetector {
  private engagementHistory: Map<string, EngagementSnapshot[]> = new Map();
  private velocityThreshold: number = 2.5; // k-sigma multiplier
  private relativeIncreaseThreshold: number = 0.5; // 50% increase
  private windowSizeMinutes: number = 10;
  private baselineHours: number = 24;

  /**
   * Process new engagement data and detect hot ads
   */
  async processEngagementData(snapshots: EngagementSnapshot[]): Promise<HotAdAlert[]> {
    const alerts: HotAdAlert[] = [];

    for (const snapshot of snapshots) {
      // Store historical data
      if (!this.engagementHistory.has(snapshot.ad_id)) {
        this.engagementHistory.set(snapshot.ad_id, []);
      }
      
      const history = this.engagementHistory.get(snapshot.ad_id)!;
      history.push(snapshot);
      
      // Keep only relevant history (last 48 hours)
      const cutoffTime = Date.now() - (48 * 60 * 60 * 1000);
      this.engagementHistory.set(
        snapshot.ad_id,
        history.filter(s => new Date(s.timestamp).getTime() > cutoffTime)
      );

      // Calculate velocity and detect hot moment
      const alert = this.detectHotMoment(snapshot.ad_id, history);
      if (alert) {
        alerts.push(alert);
      }
    }

    return alerts;
  }

  /**
   * Core hot ad detection algorithm
   */
  private detectHotMoment(adId: string, history: EngagementSnapshot[]): HotAdAlert | null {
    if (history.length < 10) return null; // Need sufficient data

    const now = Date.now();
    const windowStart = now - (this.windowSizeMinutes * 60 * 1000);
    const baselineStart = now - (this.baselineHours * 60 * 60 * 1000);

    // Get recent window data
    const windowData = history.filter(s => 
      new Date(s.timestamp).getTime() >= windowStart
    );

    // Get baseline data (excluding recent window)
    const baselineData = history.filter(s => {
      const time = new Date(s.timestamp).getTime();
      return time >= baselineStart && time < windowStart;
    });

    if (windowData.length === 0 || baselineData.length === 0) return null;

    // Calculate engagement scores
    const windowEngagement = this.calculateTotalEngagement(windowData);
    const avgBaselineEngagement = this.calculateAverageEngagement(baselineData);
    const baselineStdDev = this.calculateEngagementStdDev(baselineData, avgBaselineEngagement);

    // Velocity calculation: (current - expected) / window_size
    const expectedEngagement = avgBaselineEngagement * (this.windowSizeMinutes / 60);
    const velocity = (windowEngagement - expectedEngagement) / this.windowSizeMinutes;
    
    // Relative increase calculation
    const relativeIncrease = avgBaselineEngagement > 0 
      ? (windowEngagement - expectedEngagement) / expectedEngagement 
      : 0;

    // Detection thresholds
    const velocityThresholdValue = avgBaselineEngagement + (this.velocityThreshold * baselineStdDev);
    const isVelocityHot = velocity >= velocityThresholdValue;
    const isRelativeHot = relativeIncrease >= this.relativeIncreaseThreshold;

    if (isVelocityHot || isRelativeHot) {
      const velocityScore = Math.min(100, (velocity / velocityThresholdValue) * 100);
      
      return {
        ad_id: adId,
        detect_time: new Date().toISOString(),
        velocity_score: Math.round(velocityScore),
        primary_triggers: [], // Will be filled by creative DNA analysis
        creative_dna_id: `dna_${adId}_${Date.now()}`,
        confidence: Math.min(0.95, 0.5 + (velocityScore / 200)),
        baseline_engagement: avgBaselineEngagement,
        current_engagement: windowEngagement,
        relative_increase: Math.round(relativeIncrease * 100) / 100
      };
    }

    return null;
  }

  private calculateTotalEngagement(snapshots: EngagementSnapshot[]): number {
    return snapshots.reduce((sum, s) => 
      sum + s.likes + s.comments + s.shares + s.clicks, 0
    );
  }

  private calculateAverageEngagement(snapshots: EngagementSnapshot[]): number {
    if (snapshots.length === 0) return 0;
    return this.calculateTotalEngagement(snapshots) / snapshots.length;
  }

  private calculateEngagementStdDev(snapshots: EngagementSnapshot[], mean: number): number {
    if (snapshots.length === 0) return 0;
    
    const variance = snapshots.reduce((sum, s) => {
      const engagement = s.likes + s.comments + s.shares + s.clicks;
      return sum + Math.pow(engagement - mean, 2);
    }, 0) / snapshots.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Extract creative DNA from ad content
   */
  async extractCreativeDNA(
    adContent: string, 
    headline?: string, 
    imageUrl?: string
  ): Promise<CreativeDNA> {
    const dnaId = `dna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hook type classification
    const hookScores = this.classifyHookTypes(adContent, headline);
    const dominantHook = Object.entries(hookScores)
      .sort(([,a], [,b]) => b - a)[0][0] as CreativeDNA['hook_type'];

    // Tone analysis
    const tone = this.analyzeTone(adContent);
    
    // Extract CTA and offer
    const ctaText = this.extractCTA(adContent);
    const offerType = this.classifyOfferType(adContent);
    
    // Color analysis (mock - would use actual image processing)
    const colors = this.extractColors(imageUrl);

    return {
      dna_id: dnaId,
      hook_type: dominantHook,
      colors,
      tone,
      offer_type: offerType,
      cta_text: ctaText,
      confidence_scores: hookScores
    };
  }

  private classifyHookTypes(content: string, headline?: string): Record<string, number> {
    const text = `${headline || ''} ${content}`.toLowerCase();
    
    const triggerKeywords = {
      curiosity: ['secret', 'discover', 'hidden', 'revealed', 'what if', 'you won\'t believe'],
      fear: ['don\'t miss', 'before it\'s too late', 'running out', 'limited time', 'urgent'],
      status: ['exclusive', 'premium', 'elite', 'vip', 'luxury', 'professional'],
      novelty: ['new', 'breakthrough', 'revolutionary', 'innovative', 'first-ever'],
      scarcity: ['limited', 'only', 'few left', 'exclusive', 'rare', 'while supplies last'],
      relatability: ['like you', 'understand', 'same situation', 'been there', 'relate']
    };

    const scores: Record<string, number> = {};
    
    for (const [hook, keywords] of Object.entries(triggerKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          score += 1;
        }
      }
      scores[hook] = Math.min(1.0, score / keywords.length);
    }

    return scores;
  }

  private analyzeTone(content: string): CreativeDNA['tone'] {
    const text = content.toLowerCase();
    
    const toneKeywords = {
      professional: ['solution', 'enterprise', 'business', 'industry', 'optimize'],
      casual: ['hey', 'awesome', 'cool', 'fun', 'easy'],
      emotional: ['love', 'hate', 'amazing', 'incredible', 'breakthrough'],
      aggressive: ['dominate', 'crush', 'destroy', 'beat', 'outperform'],
      friendly: ['help', 'support', 'together', 'community', 'friendly']
    };

    for (const [tone, keywords] of Object.entries(toneKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return tone as CreativeDNA['tone'];
      }
    }

    return 'professional';
  }

  private extractCTA(content: string): string {
    const ctaPatterns = [
      'learn more', 'get started', 'sign up', 'try free', 'buy now',
      'contact us', 'download', 'register', 'join', 'discover'
    ];
    
    const lowerContent = content.toLowerCase();
    return ctaPatterns.find(cta => lowerContent.includes(cta)) || 'learn more';
  }

  private classifyOfferType(content: string): string {
    const text = content.toLowerCase();
    
    if (text.includes('free') || text.includes('trial')) return 'free_trial';
    if (text.includes('discount') || text.includes('%')) return 'discount';
    if (text.includes('demo')) return 'demo';
    if (text.includes('consultation')) return 'consultation';
    
    return 'information';
  }

  private extractColors(imageUrl?: string): string[] {
    // Mock implementation - would use actual image analysis
    const colorPalettes = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      ['#96CEB4', '#FFEAA7', '#DDA0DD'],
      ['#74B9FF', '#0984E3', '#FD79A8']
    ];
    
    return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  }

  /**
   * Generate counter-ads based on creative DNA
   */
  async generateCounterAd(
    originalAdId: string,
    creativeDNA: CreativeDNA,
    originalContent: string
  ): Promise<CounterAdJob> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const strategies = ['flip', 'undermine', 'amplify'] as const;
    const variants = strategies.map(strategy => 
      this.createCounterVariant(strategy, creativeDNA, originalContent)
    );

    return {
      job_id: jobId,
      original_ad_id: originalAdId,
      target_audience_spec: this.generateTargetAudience(creativeDNA),
      creative_variants: variants,
      scheduled_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      estimated_cost: this.estimateAdCost(variants.length),
      status: 'created'
    };
  }

  private createCounterVariant(
    strategy: 'flip' | 'undermine' | 'amplify',
    dna: CreativeDNA,
    originalContent: string
  ) {
    const counterStrategies = {
      flip: {
        curiosity: { headline: "The Truth They Don't Want You To Know", opener: "While others hide the facts" },
        fear: { headline: "Don't Fall for Expensive Alternatives", opener: "Skip the overpriced option" },
        status: { headline: "Why Smart Leaders Choose Us Instead", opener: "Join companies who switched" }
      },
      undermine: {
        curiosity: { headline: "No More Guessing - Get Real Results", opener: "Stop wondering, start knowing" },
        fear: { headline: "Peace of Mind Guarantee", opener: "Never worry about" },
        status: { headline: "Success Without the Premium Price", opener: "Get the same results for less" }
      },
      amplify: {
        curiosity: { headline: "Even More Secrets Revealed Here", opener: "Discover what others missed" },
        fear: { headline: "Act Now Before It's Really Too Late", opener: "Last chance to" },
        status: { headline: "The Ultimate Premium Experience", opener: "Beyond exclusive" }
      }
    };

    const strategyMap = counterStrategies[strategy];
    const hookStrategy = strategyMap[dna.hook_type] || strategyMap.curiosity;

    return {
      headline: hookStrategy.headline,
      primary_text: `${hookStrategy.opener}. Our proven solution delivers better results. Join thousands who made the smart switch.`,
      cta: this.generateStrategicCTA(dna.cta_text),
      strategy,
      visual_concept: `${strategy} strategy targeting ${dna.hook_type} with ${dna.tone} tone`
    };
  }

  private generateStrategicCTA(originalCTA: string): string {
    const strategicCTAs = {
      'learn more': 'See Real Results →',
      'get started': 'Start Free Trial →',
      'sign up': 'Get Instant Access →',
      'try free': 'Try Risk-Free →',
      'buy now': 'Get Better Value →'
    };

    return strategicCTAs[originalCTA as keyof typeof strategicCTAs] || 'Learn More →';
  }

  private generateTargetAudience(dna: CreativeDNA) {
    return {
      demographics: {
        age_range: '25-55',
        job_titles: ['Manager', 'Director', 'VP', 'CEO'],
        company_size: '10-1000'
      },
      interests: ['Business Software', 'Marketing Tools', 'Productivity'],
      behaviors: [
        'Recently searched for business solutions',
        'Engaged with competitor content',
        'Visited comparison websites'
      ]
    };
  }

  private estimateAdCost(variantCount: number): number {
    return variantCount * 250; // $250 per variant base cost
  }

  // Configuration methods
  setVelocityThreshold(threshold: number) {
    this.velocityThreshold = threshold;
  }

  setRelativeIncreaseThreshold(threshold: number) {
    this.relativeIncreaseThreshold = threshold;
  }
}

export const hotAdDetector = new HotAdDetector();
