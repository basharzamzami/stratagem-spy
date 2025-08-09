
import { HijackIntelligence, AdSkeleton } from './adSkeletonExtractor';

export interface CounterAdWeapon {
  id: string;
  original_ad_intelligence: HijackIntelligence;
  hijacked_skeleton: AdSkeleton;
  counter_creative: {
    headline: string;
    hook_amplification: string;
    body_text: string;
    cta: string;
    visual_concept: string;
  };
  psychological_amplifiers: {
    trigger: string;
    original_strength: number;
    amplified_strength: number;
    amplification_method: string;
  }[];
  targeting_jujitsu: {
    original_audience: string;
    hijacked_audience: string;
    positioning_flip: string;
  };
  deployment_strategy: {
    platform_priority: string[];
    budget_allocation: Record<string, number>;
    timing_strategy: string;
    creative_variants: number;
  };
}

export class CounterAdWeaponizer {
  private brandAssets = {
    name: 'Your Brand',
    positioning: 'The Simpler Alternative',
    unique_advantages: [
      '70% lower cost',
      '3x faster implementation',
      'No long-term contracts',
      'White-glove migration',
      '24/7 human support'
    ],
    proof_points: [
      '2,500+ companies switched',
      '47% average cost savings',
      '14-day average setup time',
      '99.9% uptime guarantee'
    ]
  };

  private hijackTemplates = {
    curiosity: {
      counter_hook: "The {competitor_topic} Secret {competitor} Doesn't Want You To Know",
      amplifier: "While {competitor} hides this, we're making it public",
      positioning: "transparent alternative"
    },
    problem: {
      counter_hook: "Why {competitor} Makes {problem} Worse (And What Actually Works)",
      amplifier: "They caused the problem they claim to solve",
      positioning: "root cause solver"
    },
    status: {
      counter_hook: "Why Smart {audience} Are Ditching {competitor} For This",
      amplifier: "The new status symbol is efficiency, not expense",
      positioning: "intelligent choice"
    },
    fear: {
      counter_hook: "{competitor} Creates The Exact Risk They Warn About",
      amplifier: "The real danger is vendor lock-in",
      positioning: "safe harbor"
    },
    novelty: {
      counter_hook: "{competitor}'s 'Innovation' Is Just Old {method} Repackaged",
      amplifier: "Here's actual innovation from the ground up",
      positioning: "genuine innovation"
    },
    social_proof: {
      counter_hook: "2,500+ Companies Left {competitor} For This Alternative",
      amplifier: "The migration trend is accelerating",
      positioning: "exodus leader"
    }
  };

  async weaponizeAd(
    originalIntelligence: HijackIntelligence,
    competitorName: string,
    targetAudience?: string
  ): Promise<CounterAdWeapon> {
    
    const hookType = originalIntelligence.ad_skeleton.hook.type;
    const template = this.hijackTemplates[hookType];
    
    const counterWeapon: CounterAdWeapon = {
      id: `weapon_${Date.now()}`,
      original_ad_intelligence: originalIntelligence,
      hijacked_skeleton: this.buildHijackedSkeleton(originalIntelligence),
      counter_creative: this.generateCounterCreative(originalIntelligence, competitorName, template),
      psychological_amplifiers: this.amplifyTriggers(originalIntelligence.psychological_triggers),
      targeting_jujitsu: this.flipTargeting(originalIntelligence, targetAudience),
      deployment_strategy: this.buildDeploymentStrategy(originalIntelligence)
    };

    return counterWeapon;
  }

  private buildHijackedSkeleton(original: HijackIntelligence): AdSkeleton {
    // Create a stronger version of their skeleton
    return {
      ...original.ad_skeleton,
      hook: {
        ...original.ad_skeleton.hook,
        psychological_driver: 'Direct counter-positioning with superior proof'
      },
      value_stack: {
        benefits: this.brandAssets.unique_advantages,
        emotional_triggers: ['confidence', 'smart_choice', 'cost_savings', 'speed'],
        proof_elements: this.brandAssets.proof_points
      },
      offer_mechanics: {
        ...original.ad_skeleton.offer_mechanics,
        value_addons: [
          'Free migration service',
          'Personal onboarding',
          '90-day money-back guarantee',
          'Price match + 10% discount'
        ]
      }
    };
  }

  private generateCounterCreative(
    intelligence: HijackIntelligence,
    competitor: string,
    template: any
  ) {
    const originalHook = intelligence.ad_skeleton.hook;
    const audience = intelligence.ad_skeleton.targeting_hints.demographic_clues[0] || 'business owners';
    
    // Generate weaponized headline
    const headline = template.counter_hook
      .replace('{competitor}', competitor)
      .replace('{competitor_topic}', this.extractTopic(originalHook.text))
      .replace('{problem}', this.extractProblem(intelligence))
      .replace('{audience}', audience)
      .replace('{method}', 'approach');

    // Build amplified body text
    const bodyText = this.buildWeaponizedBody(intelligence, competitor, template);
    
    // Create stronger CTA
    const cta = this.generateWeaponizedCTA(intelligence.ad_skeleton.cta);

    return {
      headline,
      hook_amplification: template.amplifier.replace('{competitor}', competitor),
      body_text: bodyText,
      cta,
      visual_concept: this.generateVisualConcept(intelligence, competitor)
    };
  }

  private buildWeaponizedBody(intelligence: HijackIntelligence, competitor: string, template: any): string {
    const originalPain = intelligence.ad_skeleton.setup.pain_points[0] || 'expensive solutions';
    const ourSolution = this.brandAssets.unique_advantages[0];
    const proof = this.brandAssets.proof_points[0];
    
    return `${template.amplifier.replace('{competitor}', competitor)}. 

While they charge premium prices for basic features, we deliver ${ourSolution}.

${proof} - because when you remove the bloat, everything becomes simpler and more affordable.

Stop overpaying for overcomplicated solutions. Get the same results for 70% less.`;
  }

  private generateWeaponizedCTA(originalCTA: AdSkeleton['cta']): string {
    const powerCTAs = {
      'learn more': 'See The Real Alternative →',
      'get started': 'Start Saving Today →',
      'try free': 'Try Risk-Free (No Card Required) →',
      'sign up': 'Make The Switch →',
      'contact us': 'Get Your Migration Plan →'
    };
    
    return powerCTAs[originalCTA.text as keyof typeof powerCTAs] || 'Get Started Free →';
  }

  private amplifyTriggers(originalTriggers: HijackIntelligence['psychological_triggers']) {
    return Object.entries(originalTriggers).map(([trigger, data]) => ({
      trigger,
      original_strength: data.strength,
      amplified_strength: Math.min(100, data.strength + 30),
      amplification_method: this.getTriggerAmplification(trigger)
    }));
  }

  private getTriggerAmplification(trigger: string): string {
    const amplifiers = {
      scarcity: 'Create genuine urgency with limited-time migration bonus',
      social_proof: 'Show specific competitor switchers with real names/companies',
      authority: 'Position as the choice of industry insiders',
      novelty: 'Highlight breakthrough simplification approach',
      relatability: 'Address the exact frustrations with current solution',
      fomo: 'Emphasize the cost of staying with expensive alternative'
    };
    
    return amplifiers[trigger as keyof typeof amplifiers] || 'Generic amplification';
  }

  private flipTargeting(intelligence: HijackIntelligence, targetAudience?: string) {
    const originalAudience = intelligence.ad_skeleton.targeting_hints.demographic_clues[0] || 'business users';
    
    return {
      original_audience: originalAudience,
      hijacked_audience: targetAudience || `Cost-conscious ${originalAudience}`,
      positioning_flip: 'Smart alternative for budget-aware decision makers'
    };
  }

  private buildDeploymentStrategy(intelligence: HijackIntelligence) {
    const originalTriggers = intelligence.psychological_triggers;
    const highestTrigger = Object.entries(originalTriggers)
      .sort(([,a], [,b]) => b.strength - a.strength)[0];

    return {
      platform_priority: ['Google Ads', 'LinkedIn', 'Facebook'],
      budget_allocation: {
        'search': 40,
        'display': 25,
        'social': 35
      },
      timing_strategy: 'Launch 48 hours after competitor ad spike',
      creative_variants: 5
    };
  }

  private extractTopic(hookText: string): string {
    // Simple topic extraction
    const words = hookText.toLowerCase().split(' ');
    const topicWords = words.filter(word => 
      !['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'your'].includes(word)
    );
    return topicWords[0] || 'solution';
  }

  private extractProblem(intelligence: HijackIntelligence): string {
    return intelligence.ad_skeleton.setup.pain_points[0] || 'high costs';
  }

  private generateVisualConcept(intelligence: HijackIntelligence, competitor: string): string {
    const concepts = [
      `Side-by-side price comparison showing 70% savings vs ${competitor}`,
      `Migration timeline: 14 days vs ${competitor}'s 90+ day implementation`,
      `Customer testimonial: "Why I switched from ${competitor}"`,
      `Feature comparison chart with simplicity emphasis`
    ];
    
    return concepts[Math.floor(Math.random() * concepts.length)];
  }
}

export const counterAdWeaponizer = new CounterAdWeaponizer();
