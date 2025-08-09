
import { CreativeDNA, CounterAd } from './engagementMonitor';

export class CounterAdGenerator {
  private brandAssets = {
    colors: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
    logoUrl: '/api/brand/logo.png',
    brandVoice: 'professional',
    valueProps: [
      'Better ROI',
      'Faster Implementation', 
      'Superior Support',
      'Proven Results',
      '24/7 Service'
    ]
  };

  async generateCounterAd(
    originalAdId: string,
    competitor: string,
    creativeDNA: CreativeDNA,
    originalContent: string
  ): Promise<CounterAd> {
    
    const counterContent = await this.createCounterContent(creativeDNA, originalContent);
    const targetAudience = this.generateTargetingStrategy(creativeDNA);
    
    return {
      id: `counter_${originalAdId}_${Date.now()}`,
      original_ad_id: originalAdId,
      competitor,
      generated_content: counterContent,
      target_audience: targetAudience,
      launch_status: 'ready'
    };
  }

  private async createCounterContent(dna: CreativeDNA, originalContent: string) {
    const counterHooks = this.generateCounterHook(dna.hook_type, originalContent);
    const enhancedOffer = this.createSuperiorOffer(dna.psychological_triggers);
    const strategicCTA = this.generateStrategicCTA(dna.cta_style);

    return {
      headline: counterHooks.headline,
      primary_text: this.buildPrimaryText(counterHooks.opener, enhancedOffer, dna.tone),
      cta: strategicCTA,
      visual_concept: this.createVisualConcept(dna)
    };
  }

  private generateCounterHook(hookType: CreativeDNA['hook_type'], originalContent: string) {
    const counterStrategies = {
      curiosity: {
        headline: "The Better Alternative Everyone's Talking About",
        opener: "While others promise, we deliver"
      },
      fear: {
        headline: "Don't Fall for Expensive Alternatives", 
        opener: "Skip the overpriced option"
      },
      status: {
        headline: "Why Smart Leaders Choose Us Instead",
        opener: "Join the companies who switched and never looked back"
      },
      urgency: {
        headline: "Get Results 10x Faster Than The Competition",
        opener: "Stop waiting for slow solutions"
      },
      social_proof: {
        headline: "5,000+ Companies Can't Be Wrong",
        opener: "See why industry leaders prefer us over"
      },
      scarcity: {
        headline: "Unlimited Access. No Limits. No Waiting.",
        opener: "While others restrict, we deliver unlimited"
      }
    };

    return counterStrategies[hookType];
  }

  private createSuperiorOffer(triggers: string[]) {
    const offers = [];
    
    if (triggers.includes('reciprocity')) {
      offers.push('Free setup + migration');
    }
    if (triggers.includes('authority')) {
      offers.push('Industry-certified experts');
    }
    if (triggers.includes('commitment')) {
      offers.push('60-day money-back guarantee');
    }
    
    const valueProp = this.brandAssets.valueProps[
      Math.floor(Math.random() * this.brandAssets.valueProps.length)
    ];
    
    return offers.length > 0 
      ? `${valueProp}: ${offers.join(' + ')}`
      : valueProp;
  }

  private generateStrategicCTA(originalCTAStyle: string): string {
    const strategicCTAs = {
      'learn more': 'See Real Results →',
      'get started': 'Start Free Trial →',
      'sign up': 'Get Instant Access →',
      'try free': 'Try Risk-Free →',
      'buy now': 'Get Better Value →',
      'contact us': 'Talk to Expert →',
      'generic': 'See The Difference →'
    };

    return strategicCTAs[originalCTAStyle as keyof typeof strategicCTAs] || 'Learn More →';
  }

  private buildPrimaryText(opener: string, offer: string, tone: CreativeDNA['tone']): string {
    const toneModifiers = {
      professional: 'Our proven solution delivers',
      casual: 'Here\'s what makes us different:',
      emotional: 'Experience the breakthrough difference with',
      aggressive: 'Outperform the competition with',
      friendly: 'Let us help you achieve'
    };

    return `${opener}. ${toneModifiers[tone]} ${offer}. Join thousands who made the smart switch.`;
  }

  private createVisualConcept(dna: CreativeDNA): string {
    const concepts = [
      `Side-by-side comparison highlighting superior ${this.brandAssets.valueProps[0].toLowerCase()}`,
      `Customer success story format with ${dna.tone} testimonial`,
      `Product demo showcasing key differentiator`,
      `Before/after transformation using brand colors ${this.brandAssets.colors[0]}`
    ];

    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  private generateTargetingStrategy(dna: CreativeDNA) {
    return {
      demographics: {
        age_range: '25-55',
        job_titles: ['Manager', 'Director', 'VP', 'CEO', 'Founder'],
        company_size: '10-1000'
      },
      interests: [
        'Business Software',
        'Marketing Tools', 
        'Productivity',
        'Industry Solutions'
      ],
      behaviors: [
        'Recently searched for business solutions',
        'Engaged with competitor content',
        'Visited comparison websites',
        'Downloaded industry reports'
      ]
    };
  }
}

export const counterAdGenerator = new CounterAdGenerator();
