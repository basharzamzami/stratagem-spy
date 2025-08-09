
export interface CreativeDNA {
  hook_type: 'curiosity' | 'fear' | 'status' | 'urgency' | 'social_proof' | 'scarcity';
  color_palette: string[];
  ad_structure: string;
  tone: 'professional' | 'casual' | 'emotional' | 'aggressive' | 'friendly';
  visual_elements: string[];
  cta_style: string;
  psychological_triggers: string[];
}

export interface AdPreview {
  ad_id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  landing_page_url: string;
  creative_dna: CreativeDNA;
}

class CreativeDNAAnalyzer {
  private mockCreativeDNA: Record<string, CreativeDNA> = {
    'ad_001': {
      hook_type: 'curiosity',
      color_palette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      ad_structure: 'question-based',
      tone: 'casual',
      visual_elements: ['human-faces', 'product-shot', 'text-overlay'],
      cta_style: 'action-oriented',
      psychological_triggers: ['curiosity', 'social_proof']
    },
    'ad_002': {
      hook_type: 'urgency',
      color_palette: ['#FF9800', '#F44336', '#FFEB3B'],
      ad_structure: 'deadline-focused',
      tone: 'aggressive',
      visual_elements: ['countdown-timer', 'bold-text', 'contrast-colors'],
      cta_style: 'urgency-driven',
      psychological_triggers: ['urgency', 'scarcity', 'fear']
    },
    'ad_003': {
      hook_type: 'social_proof',
      color_palette: ['#2196F3', '#4CAF50', '#FFFFFF'],
      ad_structure: 'testimonial-based',
      tone: 'professional',
      visual_elements: ['testimonials', 'ratings', 'logos'],
      cta_style: 'trust-building',
      psychological_triggers: ['authority', 'social_proof', 'consensus']
    },
    'ad_004': {
      hook_type: 'status',
      color_palette: ['#9C27B0', '#673AB7', '#000000'],
      ad_structure: 'benefit-focused',
      tone: 'professional',
      visual_elements: ['luxury-imagery', 'minimal-design', 'premium-fonts'],
      cta_style: 'exclusive',
      psychological_triggers: ['status', 'exclusivity', 'aspiration']
    },
    'ad_005': {
      hook_type: 'fear',
      color_palette: ['#E91E63', '#FF5722', '#795548'],
      ad_structure: 'problem-solution',
      tone: 'emotional',
      visual_elements: ['warning-icons', 'before-after', 'emotional-faces'],
      cta_style: 'solution-focused',
      psychological_triggers: ['fear', 'loss-aversion', 'urgency']
    }
  };

  private mockAdPreviews: Record<string, AdPreview> = {
    'ad_001': {
      ad_id: 'ad_001',
      title: 'Discover the Secret to 10x Growth',
      description: 'What if we told you there\'s a hidden strategy that top companies use to grow 10x faster? Click to uncover the secret.',
      image_url: '/api/placeholder/400/300',
      cta_text: 'Reveal Secret Now',
      landing_page_url: 'https://techflow.com/growth-secrets',
      creative_dna: this.mockCreativeDNA['ad_001']
    },
    'ad_002': {
      ad_id: 'ad_002',
      title: 'Limited Time: 70% Off Analytics Suite',
      description: 'Don\'t miss out! Our premium analytics suite is 70% off for the next 24 hours only. Transform your data insights today.',
      image_url: '/api/placeholder/400/300',
      cta_text: 'Claim Discount Now',
      landing_page_url: 'https://datadriven.com/limited-offer',
      creative_dna: this.mockCreativeDNA['ad_002']
    },
    'ad_003': {
      ad_id: 'ad_003',
      title: 'Trusted by 50,000+ Businesses Worldwide',
      description: 'Join thousands of satisfied customers who have revolutionized their workflow with our proven solution. See why we\'re #1.',
      image_url: '/api/placeholder/400/300',
      cta_text: 'Join Success Stories',
      landing_page_url: 'https://innovatenow.com/testimonials',
      creative_dna: this.mockCreativeDNA['ad_003']
    },
    'ad_004': {
      ad_id: 'ad_004',
      title: 'Enterprise-Grade Solutions for Elite Teams',
      description: 'Elevate your business with premium tools designed for industry leaders. Experience the difference quality makes.',
      image_url: '/api/placeholder/400/300',
      cta_text: 'Get Executive Access',
      landing_page_url: 'https://nextgen.com/enterprise',
      creative_dna: this.mockCreativeDNA['ad_004']
    },
    'ad_005': {
      ad_id: 'ad_005',
      title: 'Are You Making This Critical Mistake?',
      description: '95% of businesses fail because they ignore this one crucial element. Don\'t let your company be next.',
      image_url: '/api/placeholder/400/300',
      cta_text: 'Avoid This Mistake',
      landing_page_url: 'https://digitalpioneers.com/avoid-failure',
      creative_dna: this.mockCreativeDNA['ad_005']
    }
  };

  getCreativeDNA(adId: string): CreativeDNA | null {
    return this.mockCreativeDNA[adId] || null;
  }

  getAdPreview(adId: string): AdPreview | null {
    return this.mockAdPreviews[adId] || null;
  }

  getAllAdPreviews(): AdPreview[] {
    return Object.values(this.mockAdPreviews);
  }
}

export const creativeDNAAnalyzer = new CreativeDNAAnalyzer();
