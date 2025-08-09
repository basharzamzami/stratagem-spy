
import { CreativeDNA } from './engagementMonitor';

export class CreativeDNAExtractor {
  async analyzeAd(adContent: string, adImageUrl?: string): Promise<CreativeDNA> {
    // Simulate AI analysis of ad content
    const hookTypes = ['curiosity', 'fear', 'status', 'urgency', 'social_proof', 'scarcity'] as const;
    const tones = ['professional', 'casual', 'emotional', 'aggressive', 'friendly'] as const;
    
    const analyzedDNA: CreativeDNA = {
      hook_type: this.detectHookType(adContent),
      color_palette: this.extractColors(adImageUrl),
      ad_structure: this.analyzeStructure(adContent),
      tone: this.detectTone(adContent),
      visual_elements: this.extractVisualElements(adImageUrl),
      cta_style: this.analyzeCTA(adContent),
      psychological_triggers: this.identifyTriggers(adContent)
    };
    
    return analyzedDNA;
  }

  private detectHookType(content: string): CreativeDNA['hook_type'] {
    const hooks = {
      curiosity: ['secret', 'discover', 'hidden', 'revealed', 'what if', 'you won\'t believe'],
      fear: ['don\'t miss', 'before it\'s too late', 'running out', 'limited time', 'urgent'],
      status: ['exclusive', 'premium', 'elite', 'VIP', 'luxury', 'professional'],
      urgency: ['now', 'today', 'hurry', 'act fast', 'deadline', 'expires'],
      social_proof: ['trusted by', 'thousands', 'reviews', 'testimonials', 'rated', 'endorsed'],
      scarcity: ['limited', 'only', 'few left', 'exclusive', 'rare', 'while supplies last']
    };
    
    const lowerContent = content.toLowerCase();
    
    for (const [hookType, keywords] of Object.entries(hooks)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return hookType as CreativeDNA['hook_type'];
      }
    }
    
    return 'curiosity'; // Default
  }

  private extractColors(imageUrl?: string): string[] {
    // Mock color extraction - would use actual image analysis
    const commonPalettes = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      ['#96CEB4', '#FFEAA7', '#DDA0DD'],
      ['#74B9FF', '#0984E3', '#FD79A8'],
      ['#00B894', '#00CEC9', '#6C5CE7'],
      ['#FDCB6E', '#E17055', '#A29BFE']
    ];
    
    return commonPalettes[Math.floor(Math.random() * commonPalettes.length)];
  }

  private analyzeStructure(content: string): string {
    if (content.includes('?')) return 'question-based';
    if (content.match(/\d+/)) return 'stat-driven';
    if (content.includes('!')) return 'exclamation-heavy';
    if (content.split(' ').length > 20) return 'story-format';
    return 'direct-statement';
  }

  private detectTone(content: string): CreativeDNA['tone'] {
    const toneKeywords = {
      professional: ['solution', 'enterprise', 'business', 'industry', 'optimize'],
      casual: ['hey', 'awesome', 'cool', 'fun', 'easy'],
      emotional: ['love', 'hate', 'amazing', 'incredible', 'breakthrough'],
      aggressive: ['dominate', 'crush', 'destroy', 'beat', 'outperform'],
      friendly: ['help', 'support', 'together', 'community', 'friendly']
    };
    
    const lowerContent = content.toLowerCase();
    
    for (const [tone, keywords] of Object.entries(toneKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return tone as CreativeDNA['tone'];
      }
    }
    
    return 'professional';
  }

  private extractVisualElements(imageUrl?: string): string[] {
    // Mock visual analysis
    const elements = ['human-faces', 'product-shot', 'text-overlay', 'logo', 'charts'];
    return elements.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private analyzeCTA(content: string): string {
    const ctaPatterns = [
      'learn more', 'get started', 'sign up', 'try free', 'buy now', 
      'contact us', 'download', 'register', 'join', 'discover'
    ];
    
    const lowerContent = content.toLowerCase();
    const foundCTA = ctaPatterns.find(cta => lowerContent.includes(cta));
    
    return foundCTA || 'generic';
  }

  private identifyTriggers(content: string): string[] {
    const triggers = {
      authority: ['expert', 'leader', 'trusted', 'certified', 'proven'],
      reciprocity: ['free', 'gift', 'bonus', 'included', 'no cost'],
      commitment: ['guarantee', 'promise', 'ensure', 'commit', 'pledge'],
      liking: ['like you', 'similar', 'understand', 'relate', 'same'],
      consensus: ['popular', 'trending', 'most', 'everyone', 'majority']
    };
    
    const lowerContent = content.toLowerCase();
    const identifiedTriggers: string[] = [];
    
    for (const [trigger, keywords] of Object.entries(triggers)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        identifiedTriggers.push(trigger);
      }
    }
    
    return identifiedTriggers;
  }
}

export const creativeDNAExtractor = new CreativeDNAExtractor();
