
export type EmotionalTrigger = 'curiosity' | 'fear' | 'status' | 'relatability' | 'novelty' | 'fomo';

export interface TriggerScore {
  trigger: EmotionalTrigger;
  confidence: number;
  detectedPhrases: string[];
}

export interface TriggerAnalysis {
  primaryTriggers: TriggerScore[];
  dominantTrigger: EmotionalTrigger;
  secondaryTrigger?: EmotionalTrigger;
  overallConfidence: number;
}

export interface CounterFlipStrategy {
  originalTrigger: EmotionalTrigger;
  counterApproach: string;
  headlineTemplate: string;
  subheadTemplate: string;
  ctaTemplate: string;
  urgencyMultiplier: number;
}

export class PsychTriggerMapper {
  private triggerDetectionRules: Record<EmotionalTrigger, string[]> = {
    curiosity: [
      'nobody\'s talking about', 'the #1 secret', 'what they don\'t want you to know',
      'hidden truth', 'never revealed', 'behind closed doors', 'insider secret',
      'most people don\'t know', 'rarely discussed', 'the real reason'
    ],
    fear: [
      'stop losing', 'don\'t make this mistake', 'before it\'s too late',
      'avoid costly errors', 'protect yourself', 'dangerous mistake',
      'warning signs', 'critical error', 'devastating consequences'
    ],
    status: [
      'fortune 500', 'top 1%', 'elite level', 'exclusive access',
      'industry leaders', 'premium solution', 'executive level',
      'high-performers', 'successful people', 'winners choose'
    ],
    relatability: [
      'i used to struggle', 'i know how frustrating', 'we\'ve all been there',
      'i understand the pain', 'been in your shoes', 'felt the same way',
      'struggled with this too', 'we get it', 'you\'re not alone'
    ],
    novelty: [
      'never before seen', 'breakthrough method', 'revolutionary approach',
      'cutting edge', 'game changer', 'first of its kind',
      'innovative solution', 'next generation', 'brand new'
    ],
    fomo: [
      'limited spots', 'only today', 'expires soon', 'while supplies last',
      'act fast', 'don\'t miss out', 'limited time', 'hurry up',
      'few remaining', 'closing soon'
    ]
  };

  private counterFlipStrategies: Record<EmotionalTrigger, CounterFlipStrategy> = {
    curiosity: {
      originalTrigger: 'curiosity',
      counterApproach: 'Reveal their secret but show yours is simpler/better',
      headlineTemplate: 'The REAL {secret_type} {competitor_topic} (that actually works)',
      subheadTemplate: 'While others complicate {topic}, here\'s the simple truth that delivers {benefit}',
      ctaTemplate: 'Get the Real Solution →',
      urgencyMultiplier: 1.2
    },
    fear: {
      originalTrigger: 'fear',
      counterApproach: 'Acknowledge risk but show competitor increases it',
      headlineTemplate: 'Why {competitor_solution} Actually Makes {problem} Worse',
      subheadTemplate: 'They warned you about {risk}, but their method creates 3 new problems. Here\'s the safe approach.',
      ctaTemplate: 'Choose the Safe Path →',
      urgencyMultiplier: 1.5
    },
    status: {
      originalTrigger: 'status',
      counterApproach: 'Position competitor as outdated elite, yours as new standard',
      headlineTemplate: 'Why Smart {audience} Are Ditching {competitor_approach}',
      subheadTemplate: 'Old-school {industry} methods are failing. The new elite standard delivers {benefit} faster.',
      ctaTemplate: 'Join the New Elite →',
      urgencyMultiplier: 1.1
    },
    relatability: {
      originalTrigger: 'relatability',
      counterApproach: 'Share pain but show competitor is half-fix',
      headlineTemplate: 'I Tried {competitor_solution}... Here\'s What They Don\'t Tell You',
      subheadTemplate: 'Same struggle, but their solution only fixes half the problem. Here\'s what actually works.',
      ctaTemplate: 'Get the Complete Fix →',
      urgencyMultiplier: 1.3
    },
    novelty: {
      originalTrigger: 'novelty',
      counterApproach: 'Call out as remix, yours is real innovation',
      headlineTemplate: '{competitor_solution} Is Just Old {method} Repackaged',
      subheadTemplate: 'While they rebrand yesterday\'s tactics, we built something actually new from scratch.',
      ctaTemplate: 'See Real Innovation →',
      urgencyMultiplier: 1.4
    },
    fomo: {
      originalTrigger: 'fomo',
      counterApproach: 'Match scarcity but add urgency stack',
      headlineTemplate: 'Last Chance: {offer} + {bonus} (Ends {deadline})',
      subheadTemplate: 'Not only limited spots like everyone else - we\'re adding {bonus} but only for {timeframe}.',
      ctaTemplate: 'Claim Before It\'s Gone →',
      urgencyMultiplier: 2.0
    }
  };

  analyzeTriggers(adContent: string, headline?: string): TriggerAnalysis {
    const content = `${headline || ''} ${adContent}`.toLowerCase();
    const triggerScores: TriggerScore[] = [];

    // Analyze each trigger type
    Object.entries(this.triggerDetectionRules).forEach(([trigger, phrases]) => {
      const detectedPhrases = phrases.filter(phrase => 
        content.includes(phrase.toLowerCase())
      );
      
      let confidence = 0;
      if (detectedPhrases.length > 0) {
        // Base confidence from phrase matches
        confidence = Math.min(0.9, detectedPhrases.length * 0.3);
        
        // Boost if in headline
        if (headline && detectedPhrases.some(phrase => 
          headline.toLowerCase().includes(phrase.toLowerCase())
        )) {
          confidence += 0.2;
        }
        
        // Boost for multiple related phrases
        if (detectedPhrases.length > 1) {
          confidence += 0.1;
        }
      }

      if (confidence > 0.1) {
        triggerScores.push({
          trigger: trigger as EmotionalTrigger,
          confidence: Math.min(1, confidence),
          detectedPhrases
        });
      }
    });

    // Sort by confidence
    triggerScores.sort((a, b) => b.confidence - a.confidence);

    const dominantTrigger = triggerScores[0]?.trigger || 'curiosity';
    const secondaryTrigger = triggerScores[1]?.trigger;

    return {
      primaryTriggers: triggerScores.slice(0, 3),
      dominantTrigger,
      secondaryTrigger,
      overallConfidence: triggerScores[0]?.confidence || 0.5
    };
  }

  generateCounterAd(
    triggerAnalysis: TriggerAnalysis,
    competitorContent: string,
    brandAssets: {
      brandName: string;
      mainBenefit: string;
      targetAudience: string;
      usp: string;
    }
  ) {
    const strategy = this.counterFlipStrategies[triggerAnalysis.dominantTrigger];
    const tokens = this.extractContentTokens(competitorContent, brandAssets);

    // Generate headline
    const headline = this.fillTemplate(strategy.headlineTemplate, tokens);
    
    // Generate subhead
    const subhead = this.fillTemplate(strategy.subheadTemplate, tokens);
    
    // Generate CTA
    const cta = this.fillTemplate(strategy.ctaTemplate, tokens);

    return {
      headline,
      subhead,
      cta,
      strategy: strategy.counterApproach,
      urgencyScore: strategy.urgencyMultiplier * triggerAnalysis.overallConfidence,
      confidence: triggerAnalysis.overallConfidence
    };
  }

  private extractContentTokens(competitorContent: string, brandAssets: any) {
    // Extract key terms and context from competitor content
    const tokens: Record<string, string> = {
      secret_type: 'secret',
      competitor_topic: 'strategy',
      topic: brandAssets.mainBenefit.toLowerCase(),
      benefit: brandAssets.mainBenefit,
      competitor_solution: 'their approach',
      problem: 'your challenges',
      risk: 'the risk',
      audience: brandAssets.targetAudience,
      competitor_approach: 'traditional methods',
      industry: 'industry',
      method: 'method',
      offer: brandAssets.usp,
      bonus: 'exclusive bonus',
      deadline: 'tonight',
      timeframe: 'next 24 hours'
    };

    // Try to extract specific terms from competitor content
    if (competitorContent.includes('marketing')) tokens.industry = 'marketing';
    if (competitorContent.includes('sales')) tokens.industry = 'sales';
    if (competitorContent.includes('business')) tokens.industry = 'business';
    
    return tokens;
  }

  private fillTemplate(template: string, tokens: Record<string, string>): string {
    let filled = template;
    Object.entries(tokens).forEach(([key, value]) => {
      filled = filled.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return filled;
  }

  shouldLaunchCounterAd(adVelocity: number, peakVelocity: number): boolean {
    const velocityRatio = adVelocity / peakVelocity;
    return velocityRatio > 0.8; // Launch if above 80% of peak
  }

  calculateDeploymentTiming(velocityRatio: number): number {
    if (velocityRatio > 0.8) return 15; // 15 minutes for hot ads
    if (velocityRatio > 0.6) return 30; // 30 minutes for warm ads
    return 0; // Hold for cold ads
  }
}

export const psychTriggerMapper = new PsychTriggerMapper();
