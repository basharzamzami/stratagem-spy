
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js for browser use
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface AdSkeleton {
  ad_id: string;
  hook: string;
  hook_type: 'curiosity' | 'problem' | 'status' | 'fear' | 'novelty' | 'social_proof';
  setup: string;
  value_stack: string[];
  cta: {
    text: string;
    position: 'early' | 'mid' | 'late';
    urgency: 'high' | 'medium' | 'low';
  };
}

export interface PsychTriggers {
  ad_id: string;
  scarcity: boolean;
  social_proof: {
    present: boolean;
    elements: string[];
  };
  authority: boolean;
  novelty: boolean;
  relatability: boolean;
  fomo: boolean;
}

export interface OfferMechanics {
  ad_id: string;
  core_offer: string;
  bonuses: string[];
  pricing_model: 'high_ticket' | 'low_entry' | 'upsell' | 'free_trial';
  risk_reversal: string[];
}

export interface CreativeAnalysis {
  ad_id: string;
  primary_visual: 'human_face' | 'product_demo' | 'pattern_interrupt' | 'text_heavy';
  motion_style: 'fast_cuts' | 'text_overlay' | 'zoom' | 'static';
  color_palette: 'bold' | 'soft' | 'contrast' | 'minimal';
  audio_hook: string;
}

export interface AudienceProfile {
  ad_id: string;
  language_style: 'beginner' | 'pro' | 'ceo' | 'casual';
  cultural_references: string[];
  pain_points: string[];
  platform_fit: 'tiktok' | 'youtube' | 'facebook' | 'instagram' | 'linkedin';
}

export interface ParsedAdData {
  skeleton: AdSkeleton;
  triggers: PsychTriggers;
  offer: OfferMechanics;
  creative: CreativeAnalysis;
  audience: AudienceProfile;
  confidence_score: number;
}

class AdContentParser {
  private textClassifier: any = null;
  private sentimentAnalyzer: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing NLP models...');
      
      // Initialize text classification pipeline
      this.textClassifier = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-emotion',
        { device: 'webgpu' }
      );

      // Initialize sentiment analysis
      this.sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { device: 'webgpu' }
      );

      this.isInitialized = true;
      console.log('NLP models initialized successfully');
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      try {
        this.textClassifier = await pipeline(
          'text-classification',
          'cardiffnlp/twitter-roberta-base-emotion'
        );
        this.sentimentAnalyzer = await pipeline(
          'sentiment-analysis',
          'cardiffnlp/twitter-roberta-base-sentiment-latest'
        );
        this.isInitialized = true;
      } catch (fallbackError) {
        console.error('Failed to initialize NLP models:', fallbackError);
        throw new Error('Unable to initialize NLP models');
      }
    }
  }

  async parseAdContent(
    adId: string,
    headline: string,
    bodyText: string,
    imageUrl?: string,
    platform: string = 'unknown'
  ): Promise<ParsedAdData> {
    await this.initialize();

    const fullContent = `${headline} ${bodyText}`.trim();
    
    // Parse different components in parallel
    const [
      skeleton,
      triggers,
      offer,
      creative,
      audience
    ] = await Promise.all([
      this.extractAdSkeleton(adId, headline, bodyText, fullContent),
      this.analyzePsychTriggers(adId, fullContent),
      this.extractOfferMechanics(adId, fullContent),
      this.analyzeCreativeElements(adId, fullContent, imageUrl),
      this.profileAudience(adId, fullContent, platform)
    ]);

    // Calculate overall confidence score
    const confidence_score = this.calculateConfidenceScore(
      skeleton, triggers, offer, creative, audience
    );

    return {
      skeleton,
      triggers,
      offer,
      creative,
      audience,
      confidence_score
    };
  }

  private async extractAdSkeleton(
    adId: string,
    headline: string,
    bodyText: string,
    fullContent: string
  ): Promise<AdSkeleton> {
    // Detect hook type using keyword patterns and NLP
    const hookType = await this.detectHookType(headline, fullContent);
    
    // Extract value propositions
    const valueStack = this.extractValueStack(bodyText);
    
    // Analyze CTA
    const cta = this.extractCTA(fullContent);

    return {
      ad_id: adId,
      hook: headline,
      hook_type: hookType,
      setup: this.extractSetup(bodyText),
      value_stack: valueStack,
      cta
    };
  }

  private async detectHookType(
    headline: string,
    content: string
  ): Promise<AdSkeleton['hook_type']> {
    const lowerContent = content.toLowerCase();
    
    // Pattern matching for hook types
    const patterns = {
      curiosity: [
        'secret', 'hidden', 'revealed', 'discover', 'what if', 'nobody knows',
        'insider', 'behind the scenes', 'truth about', 'real reason'
      ],
      problem: [
        'tired of', 'struggling with', 'frustrated', 'sick of', 'problem with',
        'difficult', 'hard to', 'can\'t seem', 'failing at'
      ],
      status: [
        'ceo', 'executive', 'elite', 'exclusive', 'premium', 'professional',
        'industry leader', 'top performers', 'successful', 'winner'
      ],
      fear: [
        'before it\'s too late', 'warning', 'danger', 'risk', 'mistake',
        'avoid', 'don\'t let', 'prevent', 'protect'
      ],
      novelty: [
        'new', 'breakthrough', 'revolutionary', 'innovative', 'cutting edge',
        'first time', 'never before', 'game changer'
      ],
      social_proof: [
        'thousands', 'millions', 'trusted by', 'used by', 'recommended',
        'testimonial', 'reviews', 'rated', 'proven'
      ]
    };

    // Score each hook type
    const scores: Record<string, number> = {};
    for (const [hookType, keywords] of Object.entries(patterns)) {
      scores[hookType] = keywords.reduce((score, keyword) => {
        return score + (lowerContent.includes(keyword) ? 1 : 0);
      }, 0);
    }

    // Return the highest scoring hook type
    const topHook = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];

    return topHook as AdSkeleton['hook_type'];
  }

  private extractValueStack(bodyText: string): string[] {
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const benefits: string[] = [];

    // Look for benefit indicators
    const benefitPatterns = [
      /you\s+(get|receive|gain|achieve|obtain)/i,
      /helps?\s+you/i,
      /will\s+(save|make|earn|improve)/i,
      /guaranteed\s+to/i,
      /proven\s+to/i
    ];

    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (benefitPatterns.some(pattern => pattern.test(trimmed))) {
        benefits.push(trimmed);
      }
    });

    return benefits.slice(0, 5); // Limit to top 5 benefits
  }

  private extractSetup(bodyText: string): string {
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    // Return first meaningful sentence as setup
    return sentences.length > 0 ? sentences[0].trim() : '';
  }

  private extractCTA(content: string): AdSkeleton['cta'] {
    const lowerContent = content.toLowerCase();
    
    // Common CTA patterns
    const ctaPatterns = [
      'click here', 'get started', 'try free', 'sign up', 'learn more',
      'buy now', 'order now', 'contact us', 'call now', 'download',
      'register', 'join', 'subscribe', 'book', 'schedule'
    ];

    const foundCTA = ctaPatterns.find(pattern => lowerContent.includes(pattern));
    
    // Determine urgency based on language
    const urgencyIndicators = {
      high: ['now', 'today', 'limited time', 'expires', 'hurry', 'urgent'],
      medium: ['soon', 'this week', 'don\'t wait', 'act fast'],
      low: ['when ready', 'at your convenience', 'whenever']
    };

    let urgency: 'high' | 'medium' | 'low' = 'low';
    for (const [level, indicators] of Object.entries(urgencyIndicators)) {
      if (indicators.some(indicator => lowerContent.includes(indicator))) {
        urgency = level as 'high' | 'medium' | 'low';
        break;
      }
    }

    // Determine position (simplified)
    const position = content.indexOf(foundCTA || '') < content.length * 0.5 ? 'early' : 'late';

    return {
      text: foundCTA || 'learn more',
      position,
      urgency
    };
  }

  private async analyzePsychTriggers(adId: string, content: string): Promise<PsychTriggers> {
    const lowerContent = content.toLowerCase();

    // Pattern-based trigger detection
    const scarcity = /limited|exclusive|only \d+|few left|while supplies|expires|deadline/i.test(content);
    
    const socialProofElements: string[] = [];
    if (/testimonial|review|rating/i.test(content)) socialProofElements.push('testimonial');
    if (/trusted by|used by \d+/i.test(content)) socialProofElements.push('stats');
    if (/logo|brand|company/i.test(content)) socialProofElements.push('logo');

    const authority = /expert|certified|award|leader|professional|proven/i.test(content);
    const novelty = /new|breakthrough|revolutionary|innovative|cutting edge/i.test(content);
    const relatability = /like you|understand|been there|struggled|similar/i.test(content);
    const fomo = /missing out|opportunity|don't wait|join|everyone/i.test(content);

    return {
      ad_id: adId,
      scarcity,
      social_proof: {
        present: socialProofElements.length > 0,
        elements: socialProofElements
      },
      authority,
      novelty,
      relatability,
      fomo
    };
  }

  private async extractOfferMechanics(adId: string, content: string): Promise<OfferMechanics> {
    const lowerContent = content.toLowerCase();

    // Extract core offer
    let coreOffer = 'Service/Product';
    if (lowerContent.includes('course')) coreOffer = 'Online Course';
    else if (lowerContent.includes('consultation')) coreOffer = 'Consultation';
    else if (lowerContent.includes('software')) coreOffer = 'Software';
    else if (lowerContent.includes('book')) coreOffer = 'Book/Guide';

    // Extract bonuses
    const bonuses: string[] = [];
    const bonusPatterns = /bonus|free|included|plus|additional|extra/gi;
    const matches = content.match(bonusPatterns);
    if (matches) {
      bonuses.push(...matches.slice(0, 3));
    }

    // Determine pricing model
    let pricingModel: OfferMechanics['pricing_model'] = 'low_entry';
    if (/\$\d{4,}|expensive|premium|high.?end/i.test(content)) {
      pricingModel = 'high_ticket';
    } else if (/free trial|try free|no cost/i.test(content)) {
      pricingModel = 'free_trial';
    } else if (/upsell|upgrade|premium version/i.test(content)) {
      pricingModel = 'upsell';
    }

    // Extract risk reversal
    const riskReversal: string[] = [];
    if (/money.?back|refund/i.test(content)) riskReversal.push('refund');
    if (/guarantee/i.test(content)) riskReversal.push('guarantee');
    if (/trial|try/i.test(content)) riskReversal.push('trial_period');

    return {
      ad_id: adId,
      core_offer: coreOffer,
      bonuses,
      pricing_model: pricingModel,
      risk_reversal: riskReversal
    };
  }

  private async analyzeCreativeElements(
    adId: string,
    content: string,
    imageUrl?: string
  ): Promise<CreativeAnalysis> {
    // For now, this is pattern-based. In full implementation, 
    // this would use computer vision models
    const lowerContent = content.toLowerCase();

    let primaryVisual: CreativeAnalysis['primary_visual'] = 'text_heavy';
    if (imageUrl) {
      // Would analyze image here with CV models
      primaryVisual = 'human_face'; // Default assumption
    }

    const motionStyle: CreativeAnalysis['motion_style'] = 
      lowerContent.includes('video') ? 'fast_cuts' : 'static';

    const colorPalette: CreativeAnalysis['color_palette'] = 
      lowerContent.includes('bold') || lowerContent.includes('urgent') ? 'bold' : 'minimal';

    return {
      ad_id: adId,
      primary_visual: primaryVisual,
      motion_style: motionStyle,
      color_palette: colorPalette,
      audio_hook: 'none'
    };
  }

  private async profileAudience(
    adId: string,
    content: string,
    platform: string
  ): Promise<AudienceProfile> {
    const lowerContent = content.toLowerCase();

    // Determine language sophistication
    let languageStyle: AudienceProfile['language_style'] = 'casual';
    if (/ceo|executive|enterprise|professional/i.test(content)) {
      languageStyle = 'ceo';
    } else if (/expert|advanced|professional/i.test(content)) {
      languageStyle = 'pro';
    } else if (/beginner|start|learn|new/i.test(content)) {
      languageStyle = 'beginner';
    }

    // Extract pain points
    const painPoints: string[] = [];
    const painPatterns = [
      /struggling with ([^.!?]+)/gi,
      /tired of ([^.!?]+)/gi,
      /frustrated by ([^.!?]+)/gi,
      /problem with ([^.!?]+)/gi
    ];

    painPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        painPoints.push(...matches.slice(0, 2));
      }
    });

    // Platform fit analysis
    const platformFit = this.determinePlatformFit(content, platform);

    return {
      ad_id: adId,
      language_style: languageStyle,
      cultural_references: [], // Would extract with more advanced NLP
      pain_points: painPoints,
      platform_fit: platformFit
    };
  }

  private determinePlatformFit(
    content: string,
    platform: string
  ): AudienceProfile['platform_fit'] {
    const lowerContent = content.toLowerCase();
    
    // Platform-specific indicators
    if (platform.toLowerCase().includes('linkedin') || /professional|business|b2b/i.test(content)) {
      return 'linkedin';
    } else if (platform.toLowerCase().includes('tiktok') || /viral|trending|gen z/i.test(content)) {
      return 'tiktok';
    } else if (/video|watch|youtube/i.test(content)) {
      return 'youtube';
    } else if (/instagram|insta|photo/i.test(content)) {
      return 'instagram';
    }

    return 'facebook'; // Default
  }

  private calculateConfidenceScore(
    skeleton: AdSkeleton,
    triggers: PsychTriggers,
    offer: OfferMechanics,
    creative: CreativeAnalysis,
    audience: AudienceProfile
  ): number {
    let score = 0;
    let maxScore = 0;

    // Skeleton completeness (30%)
    maxScore += 30;
    if (skeleton.hook.length > 10) score += 10;
    if (skeleton.value_stack.length > 0) score += 10;
    if (skeleton.cta.text !== 'learn more') score += 10;

    // Trigger detection (25%)
    maxScore += 25;
    const triggerCount = [
      triggers.scarcity,
      triggers.social_proof.present,
      triggers.authority,
      triggers.novelty,
      triggers.relatability,
      triggers.fomo
    ].filter(Boolean).length;
    score += Math.min(25, triggerCount * 4);

    // Offer analysis (25%)
    maxScore += 25;
    if (offer.core_offer !== 'Service/Product') score += 8;
    if (offer.bonuses.length > 0) score += 8;
    if (offer.risk_reversal.length > 0) score += 9;

    // Audience profiling (20%)
    maxScore += 20;
    if (audience.pain_points.length > 0) score += 10;
    if (audience.language_style !== 'casual') score += 10;

    return Math.round((score / maxScore) * 100);
  }
}

export const adContentParser = new AdContentParser();
