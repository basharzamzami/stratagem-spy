
export interface AdSkeleton {
  hook: {
    type: 'curiosity' | 'problem' | 'status' | 'fear' | 'novelty' | 'social_proof';
    text: string;
    position: 'first_line' | 'visual_overlay' | 'opening_seconds';
    psychological_driver: string;
  };
  setup: {
    context_type: 'story' | 'fact' | 'problem' | 'authority';
    pain_points: string[];
    credibility_markers: string[];
  };
  value_stack: {
    benefits: string[];
    emotional_triggers: string[];
    proof_elements: string[];
  };
  cta: {
    text: string;
    placement: 'early' | 'middle' | 'end' | 'multiple';
    urgency_triggers: string[];
    risk_reversal: string[];
  };
  offer_mechanics: {
    core_offer: string;
    value_addons: string[];
    price_position: 'high_ticket' | 'low_entry' | 'free_trial' | 'freemium';
    scarcity_elements: string[];
  };
  targeting_hints: {
    audience_level: 'beginner' | 'intermediate' | 'advanced' | 'enterprise';
    demographic_clues: string[];
    pain_sophistication: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware';
  };
}

export interface PsychologicalTriggers {
  scarcity: { strength: number; elements: string[] };
  social_proof: { strength: number; elements: string[] };
  authority: { strength: number; elements: string[] };
  novelty: { strength: number; elements: string[] };
  relatability: { strength: number; elements: string[] };
  fomo: { strength: number; elements: string[] };
  loss_aversion: { strength: number; elements: string[] };
}

export interface HijackIntelligence {
  ad_skeleton: AdSkeleton;
  psychological_triggers: PsychologicalTriggers;
  creative_analysis: {
    primary_visual: 'human_face' | 'product_demo' | 'pattern_interrupt' | 'text_heavy';
    color_psychology: string[];
    motion_style: 'fast_cuts' | 'slow_zoom' | 'static' | 'kinetic_text';
    text_hierarchy: string[];
    audio_hook?: string;
  };
  funnel_mapping: {
    landing_page_type: string;
    lead_magnet: string;
    upsell_sequence: string[];
    nurture_style: string;
  };
  hijack_opportunities: {
    weakness_gaps: string[];
    amplification_angles: string[];
    counter_positioning: string[];
  };
}

export class AdSkeletonExtractor {
  private hookPatterns = {
    curiosity: [
      'nobody talks about', 'secret that', 'what they don\'t want', 'hidden truth',
      'never revealed', 'insider knowledge', 'behind closed doors', 'rarely discussed'
    ],
    problem: [
      'tired of', 'struggling with', 'frustrated by', 'sick of', 'done with',
      'can\'t figure out', 'failing at', 'losing money on'
    ],
    status: [
      'top ceos', 'industry leaders', 'elite level', 'exclusive access',
      'fortune 500', 'high performers', 'successful people', 'winners choose'
    ],
    fear: [
      'before it\'s too late', 'don\'t make this mistake', 'avoid this error',
      'warning signs', 'dangerous to ignore', 'critical mistake'
    ],
    novelty: [
      'breakthrough method', 'revolutionary approach', 'never before seen',
      'cutting edge', 'game changer', 'first of its kind'
    ],
    social_proof: [
      'trusted by thousands', 'used by', 'recommended by', 'proven by',
      'endorsed by', 'chosen by', 'rated #1 by'
    ]
  };

  private triggerDetectors = {
    scarcity: ['limited', 'only', 'few left', 'expires', 'deadline', 'while supplies last'],
    authority: ['expert', 'certified', 'award winning', 'industry leader', 'proven'],
    social_proof: ['testimonials', 'reviews', 'customers', 'users', 'companies'],
    novelty: ['new', 'breakthrough', 'revolutionary', 'innovative', 'cutting edge'],
    relatability: ['i used to', 'i struggled', 'been there', 'understand', 'like you'],
    fomo: ['missing out', 'opportunity', 'don\'t wait', 'act now', 'join today']
  };

  async extractAdIntelligence(
    adContent: string,
    headline: string,
    imageUrl?: string,
    videoUrl?: string
  ): Promise<HijackIntelligence> {
    const fullContent = `${headline} ${adContent}`.toLowerCase();
    
    return {
      ad_skeleton: this.extractSkeleton(fullContent, headline, adContent),
      psychological_triggers: this.analyzeTriggers(fullContent),
      creative_analysis: await this.analyzeCreative(imageUrl, videoUrl, fullContent),
      funnel_mapping: this.mapFunnel(adContent),
      hijack_opportunities: this.identifyHijackOpportunities(fullContent)
    };
  }

  private extractSkeleton(fullContent: string, headline: string, body: string): AdSkeleton {
    const hookType = this.detectHookType(headline);
    const setupType = this.analyzeSetup(body);
    
    return {
      hook: {
        type: hookType,
        text: headline,
        position: this.determineHookPosition(headline),
        psychological_driver: this.identifyPsychDriver(hookType, headline)
      },
      setup: {
        context_type: setupType,
        pain_points: this.extractPainPoints(body),
        credibility_markers: this.findCredibilityMarkers(body)
      },
      value_stack: {
        benefits: this.extractBenefits(body),
        emotional_triggers: this.identifyEmotionalTriggers(body),
        proof_elements: this.findProofElements(body)
      },
      cta: {
        text: this.extractCTA(body),
        placement: this.determineCTAPlacement(body),
        urgency_triggers: this.findUrgencyTriggers(body),
        risk_reversal: this.findRiskReversal(body)
      },
      offer_mechanics: {
        core_offer: this.identifyCoreOffer(body),
        value_addons: this.extractValueAddons(body),
        price_position: this.determinePricePosition(body),
        scarcity_elements: this.findScarcityElements(body)
      },
      targeting_hints: {
        audience_level: this.determineAudienceLevel(fullContent),
        demographic_clues: this.extractDemographics(fullContent),
        pain_sophistication: this.assessPainSophistication(fullContent)
      }
    };
  }

  private detectHookType(headline: string): AdSkeleton['hook']['type'] {
    const lowerHeadline = headline.toLowerCase();
    
    for (const [type, patterns] of Object.entries(this.hookPatterns)) {
      if (patterns.some(pattern => lowerHeadline.includes(pattern))) {
        return type as AdSkeleton['hook']['type'];
      }
    }
    
    // Secondary analysis based on structure
    if (lowerHeadline.includes('?')) return 'curiosity';
    if (lowerHeadline.includes('stop') || lowerHeadline.includes('quit')) return 'problem';
    if (lowerHeadline.includes('best') || lowerHeadline.includes('top')) return 'status';
    
    return 'curiosity'; // Default
  }

  private analyzeTriggers(content: string): PsychologicalTriggers {
    const triggers: PsychologicalTriggers = {
      scarcity: { strength: 0, elements: [] },
      social_proof: { strength: 0, elements: [] },
      authority: { strength: 0, elements: [] },
      novelty: { strength: 0, elements: [] },
      relatability: { strength: 0, elements: [] },
      fomo: { strength: 0, elements: [] },
      loss_aversion: { strength: 0, elements: [] }
    };

    Object.entries(this.triggerDetectors).forEach(([trigger, patterns]) => {
      const matches = patterns.filter(pattern => content.includes(pattern));
      if (matches.length > 0 && trigger in triggers) {
        triggers[trigger as keyof PsychologicalTriggers] = {
          strength: Math.min(100, matches.length * 25),
          elements: matches
        };
      }
    });

    return triggers;
  }

  private async analyzeCreative(imageUrl?: string, videoUrl?: string, content?: string) {
    // Mock creative analysis - in production would use image/video analysis APIs
    return {
      primary_visual: 'human_face' as const,
      color_psychology: ['trust', 'urgency', 'premium'],
      motion_style: videoUrl ? 'fast_cuts' as const : 'static' as const,
      text_hierarchy: this.analyzeTextHierarchy(content || ''),
      audio_hook: videoUrl ? 'voice_over_start' : undefined
    };
  }

  private identifyHijackOpportunities(content: string) {
    return {
      weakness_gaps: [
        'Generic social proof - no specific numbers',
        'Vague value proposition - lacks specificity',
        'Weak urgency - no real deadline'
      ],
      amplification_angles: [
        'Add concrete ROI numbers',
        'Include specific customer wins',
        'Create genuine scarcity with countdown'
      ],
      counter_positioning: [
        'Position as the simpler alternative',
        'Highlight speed advantage',
        'Emphasize cost efficiency'
      ]
    };
  }

  // Helper methods
  private determineHookPosition(headline: string): AdSkeleton['hook']['position'] {
    return 'first_line'; // Simplified for now
  }

  private identifyPsychDriver(type: AdSkeleton['hook']['type'], text: string): string {
    const drivers = {
      curiosity: 'Information gap exploitation',
      problem: 'Pain amplification',
      status: 'Social positioning desire',
      fear: 'Loss aversion trigger',
      novelty: 'Innovation attraction',
      social_proof: 'Consensus validation'
    };
    return drivers[type];
  }

  private analyzeSetup(body: string): AdSkeleton['setup']['context_type'] {
    if (body.includes('once upon') || body.includes('story')) return 'story';
    if (/\d+%|\d+x|statistics|studies/.test(body)) return 'fact';
    if (body.includes('problem') || body.includes('challenge')) return 'problem';
    return 'authority';
  }

  private extractPainPoints(body: string): string[] {
    const painKeywords = ['struggling', 'frustrated', 'tired', 'difficult', 'challenge', 'problem'];
    return painKeywords.filter(keyword => body.toLowerCase().includes(keyword));
  }

  private findCredibilityMarkers(body: string): string[] {
    const markers = ['years experience', 'certified', 'award', 'featured in', 'trusted by'];
    return markers.filter(marker => body.toLowerCase().includes(marker));
  }

  private extractBenefits(body: string): string[] {
    // Simplified benefit extraction
    const sentences = body.split('.');
    return sentences.filter(s => s.includes('will') || s.includes('get') || s.includes('achieve'));
  }

  private identifyEmotionalTriggers(body: string): string[] {
    const emotions = ['confidence', 'security', 'freedom', 'success', 'peace of mind'];
    return emotions.filter(emotion => body.toLowerCase().includes(emotion));
  }

  private findProofElements(body: string): string[] {
    const proofPatterns = ['testimonial', 'case study', 'result', 'guarantee', 'money back'];
    return proofPatterns.filter(pattern => body.toLowerCase().includes(pattern));
  }

  private extractCTA(body: string): string {
    const ctaPatterns = [
      'get started', 'try free', 'learn more', 'sign up', 'buy now',
      'contact us', 'download', 'register', 'book call', 'claim'
    ];
    
    const foundCTA = ctaPatterns.find(cta => body.toLowerCase().includes(cta));
    return foundCTA || 'learn more';
  }

  private determineCTAPlacement(body: string): AdSkeleton['cta']['placement'] {
    const sentences = body.split('.');
    const totalSentences = sentences.length;
    
    const ctaPatterns = ['get started', 'try free', 'learn more', 'sign up'];
    let ctaPosition = -1;
    
    sentences.forEach((sentence, index) => {
      if (ctaPatterns.some(pattern => sentence.toLowerCase().includes(pattern))) {
        ctaPosition = index;
      }
    });
    
    if (ctaPosition < totalSentences * 0.3) return 'early';
    if (ctaPosition < totalSentences * 0.7) return 'middle';
    return 'end';
  }

  private findUrgencyTriggers(body: string): string[] {
    const urgencyWords = ['limited time', 'expires', 'deadline', 'hurry', 'act now', 'today only'];
    return urgencyWords.filter(word => body.toLowerCase().includes(word));
  }

  private findRiskReversal(body: string): string[] {
    const riskReversals = ['money back', 'guarantee', 'refund', 'risk free', 'no obligation'];
    return riskReversals.filter(reversal => body.toLowerCase().includes(reversal));
  }

  private identifyCoreOffer(body: string): string {
    // Simplified offer identification
    if (body.includes('free trial')) return 'Free trial';
    if (body.includes('consultation')) return 'Free consultation';
    if (body.includes('download')) return 'Lead magnet';
    if (body.includes('course')) return 'Educational product';
    return 'Service/Software';
  }

  private extractValueAddons(body: string): string[] {
    const addons = ['bonus', 'free shipping', 'additional', 'plus', 'included'];
    return addons.filter(addon => body.toLowerCase().includes(addon));
  }

  private determinePricePosition(body: string): AdSkeleton['offer_mechanics']['price_position'] {
    if (body.includes('free')) return 'free_trial';
    if (body.includes('$') && body.includes('000')) return 'high_ticket';
    if (body.includes('starting at') || body.includes('only $')) return 'low_entry';
    return 'freemium';
  }

  private findScarcityElements(body: string): string[] {
    const scarcityWords = ['limited', 'exclusive', 'only', 'spots left', 'while supplies'];
    return scarcityWords.filter(word => body.toLowerCase().includes(word));
  }

  private determineAudienceLevel(content: string): AdSkeleton['targeting_hints']['audience_level'] {
    if (content.includes('beginner') || content.includes('start')) return 'beginner';
    if (content.includes('scale') || content.includes('optimize')) return 'advanced';
    if (content.includes('enterprise') || content.includes('ceo')) return 'enterprise';
    return 'intermediate';
  }

  private extractDemographics(content: string): string[] {
    const demographics = ['entrepreneur', 'business owner', 'marketer', 'ceo', 'founder'];
    return demographics.filter(demo => content.includes(demo));
  }

  private assessPainSophistication(content: string): AdSkeleton['targeting_hints']['pain_sophistication'] {
    if (content.includes('what is') || content.includes('how to')) return 'unaware';
    if (content.includes('problem') || content.includes('struggle')) return 'problem_aware';
    if (content.includes('solution') || content.includes('fix')) return 'solution_aware';
    return 'product_aware';
  }

  private analyzeTextHierarchy(content: string): string[] {
    // Simplified text hierarchy analysis
    return ['headline', 'subheading', 'body', 'cta'];
  }

  private mapFunnel(content: string) {
    return {
      landing_page_type: 'opt-in',
      lead_magnet: 'free guide',
      upsell_sequence: ['consultation', 'course', 'done-for-you'],
      nurture_style: 'educational'
    };
  }
}

export const adSkeletonExtractor = new AdSkeletonExtractor();
