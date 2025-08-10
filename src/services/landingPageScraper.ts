
export interface LandingPageData {
  url: string;
  title: string;
  description: string;
  headlines: string[];
  subheadlines: string[];
  ctas: CallToAction[];
  images: ImageData[];
  forms: FormData[];
  testimonials: TestimonialData[];
  pricing: PricingData[];
  features: string[];
  socialProof: SocialProofData[];
  loadTime: number;
  mobileOptimized: boolean;
  seoScore: number;
  conversionElements: ConversionElement[];
  scrapedAt: string;
}

export interface CallToAction {
  text: string;
  type: 'button' | 'link' | 'form';
  position: 'above-fold' | 'below-fold';
  style: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface ImageData {
  src: string;
  alt: string;
  type: 'hero' | 'product' | 'testimonial' | 'logo' | 'other';
  position: string;
}

export interface FormData {
  fields: string[];
  submitText: string;
  validationRequired: boolean;
  position: string;
  type: 'lead' | 'contact' | 'signup' | 'newsletter';
}

export interface TestimonialData {
  text: string;
  author: string;
  company?: string;
  rating?: number;
  verified: boolean;
}

export interface PricingData {
  plan: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
}

export interface SocialProofData {
  type: 'customer_count' | 'rating' | 'award' | 'certification' | 'trust_badge';
  value: string;
  source: string;
}

export interface ConversionElement {
  type: 'urgency' | 'scarcity' | 'guarantee' | 'free_trial' | 'discount';
  text: string;
  position: string;
}

export interface FunnelStep {
  id: string;
  name: string;
  url: string;
  type: 'landing' | 'form' | 'checkout' | 'confirmation' | 'upsell';
  conversionRate: number;
  avgTimeSpent: number;
  exitRate: number;
  keyElements: string[];
}

export interface FunnelAnalysis {
  funnelId: string;
  totalSteps: number;
  overallConversionRate: number;
  dropOffPoints: DropOffPoint[];
  recommendations: string[];
  competitorComparison: CompetitorFunnelData[];
}

export interface DropOffPoint {
  step: number;
  dropOffRate: number;
  possibleReasons: string[];
  suggestedImprovements: string[];
}

export interface CompetitorFunnelData {
  competitor: string;
  steps: FunnelStep[];
  conversionRate: number;
  strengths: string[];
  weaknesses: string[];
}

export class LandingPageScraper {
  private static instance: LandingPageScraper;

  public static getInstance(): LandingPageScraper {
    if (!LandingPageScraper.instance) {
      LandingPageScraper.instance = new LandingPageScraper();
    }
    return LandingPageScraper.instance;
  }

  async scrapeLandingPage(url: string): Promise<LandingPageData> {
    console.log(`🔍 Scraping landing page: ${url}`);
    
    try {
      const startTime = Date.now();
      
      // In production, this would use a headless browser or scraping service
      // For now, we'll simulate scraping with realistic mock data
      await this.delay(2000); // Simulate scraping time
      
      const mockData: LandingPageData = {
        url,
        title: this.generateMockTitle(url),
        description: this.generateMockDescription(url),
        headlines: this.generateMockHeadlines(),
        subheadlines: this.generateMockSubheadlines(),
        ctas: this.generateMockCTAs(),
        images: this.generateMockImages(),
        forms: this.generateMockForms(),
        testimonials: this.generateMockTestimonials(),
        pricing: this.generateMockPricing(),
        features: this.generateMockFeatures(),
        socialProof: this.generateMockSocialProof(),
        loadTime: Date.now() - startTime,
        mobileOptimized: Math.random() > 0.3,
        seoScore: Math.floor(Math.random() * 40) + 60,
        conversionElements: this.generateMockConversionElements(),
        scrapedAt: new Date().toISOString()
      };

      return mockData;

    } catch (error) {
      console.error('Error scraping landing page:', error);
      throw new Error(`Failed to scrape ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeFunnel(urls: string[]): Promise<FunnelAnalysis> {
    console.log(`📊 Analyzing funnel with ${urls.length} steps`);
    
    try {
      const steps: FunnelStep[] = [];
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const stepData = await this.analyzeStep(url, i + 1);
        steps.push(stepData);
        
        // Brief delay between requests
        await this.delay(500);
      }

      const analysis: FunnelAnalysis = {
        funnelId: `funnel_${Date.now()}`,
        totalSteps: steps.length,
        overallConversionRate: this.calculateOverallConversion(steps),
        dropOffPoints: this.identifyDropOffPoints(steps),
        recommendations: this.generateRecommendations(steps),
        competitorComparison: await this.generateCompetitorComparison(steps)
      };

      return analysis;

    } catch (error) {
      console.error('Error analyzing funnel:', error);
      throw new Error(`Funnel analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async analyzeStep(url: string, stepNumber: number): Promise<FunnelStep> {
    const stepTypes = ['landing', 'form', 'checkout', 'confirmation', 'upsell'] as const;
    const stepType = stepTypes[Math.min(stepNumber - 1, stepTypes.length - 1)];
    
    return {
      id: `step_${stepNumber}`,
      name: `Step ${stepNumber} - ${stepType}`,
      url,
      type: stepType,
      conversionRate: Math.random() * 0.8 + 0.1, // 10-90%
      avgTimeSpent: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
      exitRate: Math.random() * 0.6 + 0.1, // 10-70%
      keyElements: this.generateStepElements(stepType)
    };
  }

  private calculateOverallConversion(steps: FunnelStep[]): number {
    if (steps.length === 0) return 0;
    return steps.reduce((acc, step) => acc * step.conversionRate, 1);
  }

  private identifyDropOffPoints(steps: FunnelStep[]): DropOffPoint[] {
    return steps.map((step, index) => ({
      step: index + 1,
      dropOffRate: step.exitRate,
      possibleReasons: this.generateDropOffReasons(step.type, step.exitRate),
      suggestedImprovements: this.generateImprovements(step.type)
    })).filter(point => point.dropOffRate > 0.3); // Only high drop-off points
  }

  private generateRecommendations(steps: FunnelStep[]): string[] {
    const recommendations = [];
    
    // Check for high exit rates
    const highExitSteps = steps.filter(step => step.exitRate > 0.4);
    if (highExitSteps.length > 0) {
      recommendations.push(`Optimize steps ${highExitSteps.map(s => s.id).join(', ')} - high exit rates detected`);
    }

    // Check for low conversion rates
    const lowConversionSteps = steps.filter(step => step.conversionRate < 0.3);
    if (lowConversionSteps.length > 0) {
      recommendations.push(`Improve conversion elements in steps ${lowConversionSteps.map(s => s.id).join(', ')}`);
    }

    // Check for long time spent (could indicate confusion)
    const slowSteps = steps.filter(step => step.avgTimeSpent > 180);
    if (slowSteps.length > 0) {
      recommendations.push(`Simplify user experience in steps ${slowSteps.map(s => s.id).join(', ')} - users spending too much time`);
    }

    return recommendations;
  }

  private async generateCompetitorComparison(steps: FunnelStep[]): Promise<CompetitorFunnelData[]> {
    const competitors = ['CompetitorA', 'CompetitorB', 'CompetitorC'];
    
    return competitors.map(competitor => ({
      competitor,
      steps: this.generateCompetitorSteps(steps.length),
      conversionRate: Math.random() * 0.4 + 0.1, // 10-50%
      strengths: this.generateCompetitorStrengths(),
      weaknesses: this.generateCompetitorWeaknesses()
    }));
  }

  // Mock data generators
  private generateMockTitle(url: string): string {
    const domain = new URL(url).hostname.replace('www.', '');
    const titles = [
      `${domain} - Transform Your Business Today`,
      `The Ultimate ${domain} Solution for Growth`,
      `${domain}: Leading the Industry Since 2020`,
      `Discover Why Thousands Choose ${domain}`,
      `${domain} - Your Success Partner`
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateMockDescription(url: string): string {
    return `Comprehensive solution for modern businesses. Join thousands of satisfied customers who have transformed their operations with our proven platform.`;
  }

  private generateMockHeadlines(): string[] {
    return [
      'Transform Your Business in 30 Days',
      'The Solution You\'ve Been Waiting For',
      'Join 10,000+ Successful Companies',
      'Increase Revenue by 300%',
      'The Future of Business is Here'
    ];
  }

  private generateMockSubheadlines(): string[] {
    return [
      'Proven results for companies like yours',
      'No setup fees, cancel anytime',
      'Get started in under 5 minutes',
      'Trusted by industry leaders'
    ];
  }

  private generateMockCTAs(): CallToAction[] {
    return [
      { text: 'Start Free Trial', type: 'button', position: 'above-fold', style: 'primary', urgency: 'high' },
      { text: 'Get Demo', type: 'button', position: 'above-fold', style: 'secondary', urgency: 'medium' },
      { text: 'Learn More', type: 'link', position: 'below-fold', style: 'text', urgency: 'low' },
      { text: 'Contact Sales', type: 'button', position: 'below-fold', style: 'outline', urgency: 'medium' }
    ];
  }

  private generateMockImages(): ImageData[] {
    return [
      { src: '/hero-image.jpg', alt: 'Hero Banner', type: 'hero', position: 'above-fold' },
      { src: '/product-screenshot.jpg', alt: 'Product Interface', type: 'product', position: 'above-fold' },
      { src: '/customer-photo.jpg', alt: 'Happy Customer', type: 'testimonial', position: 'below-fold' },
      { src: '/company-logo.svg', alt: 'Company Logo', type: 'logo', position: 'above-fold' }
    ];
  }

  private generateMockForms(): FormData[] {
    return [
      {
        fields: ['email', 'company', 'phone'],
        submitText: 'Get Started',
        validationRequired: true,
        position: 'above-fold',
        type: 'lead'
      }
    ];
  }

  private generateMockTestimonials(): TestimonialData[] {
    return [
      {
        text: 'This solution transformed our business completely. ROI was visible within the first month.',
        author: 'Sarah Johnson',
        company: 'TechCorp Inc.',
        rating: 5,
        verified: true
      },
      {
        text: 'Outstanding support and incredible results. Highly recommended!',
        author: 'Mike Chen',
        company: 'Growth Solutions',
        rating: 5,
        verified: true
      }
    ];
  }

  private generateMockPricing(): PricingData[] {
    return [
      {
        plan: 'Starter',
        price: '$29',
        period: 'month',
        features: ['Feature A', 'Feature B', 'Email Support'],
        highlighted: false
      },
      {
        plan: 'Professional',
        price: '$99',
        period: 'month',
        features: ['Everything in Starter', 'Feature C', 'Priority Support', 'Advanced Analytics'],
        highlighted: true
      }
    ];
  }

  private generateMockFeatures(): string[] {
    return [
      'Advanced Analytics Dashboard',
      'Real-time Collaboration',
      'Automated Workflows',
      'Enterprise Security',
      'API Integration',
      '24/7 Customer Support'
    ];
  }

  private generateMockSocialProof(): SocialProofData[] {
    return [
      { type: 'customer_count', value: '10,000+ Companies', source: 'internal' },
      { type: 'rating', value: '4.9/5 Stars', source: 'G2' },
      { type: 'award', value: 'Best SaaS 2024', source: 'TechReview' },
      { type: 'trust_badge', value: 'SOC 2 Certified', source: 'security' }
    ];
  }

  private generateMockConversionElements(): ConversionElement[] {
    return [
      { type: 'free_trial', text: '14-day free trial, no credit card required', position: 'above-fold' },
      { type: 'guarantee', text: '30-day money-back guarantee', position: 'below-fold' },
      { type: 'urgency', text: 'Limited time offer - 50% off first month', position: 'above-fold' }
    ];
  }

  private generateStepElements(stepType: string): string[] {
    const elements = {
      landing: ['Hero section', 'Value proposition', 'Social proof', 'CTA buttons'],
      form: ['Form fields', 'Validation messages', 'Submit button', 'Progress indicator'],
      checkout: ['Payment form', 'Security badges', 'Order summary', 'Guarantee text'],
      confirmation: ['Success message', 'Next steps', 'Upsell offer', 'Support links'],
      upsell: ['Additional offer', 'Benefits list', 'Limited time discount', 'Skip option']
    };
    return elements[stepType as keyof typeof elements] || ['Generic elements'];
  }

  private generateDropOffReasons(stepType: string, exitRate: number): string[] {
    const baseReasons = [
      'Page loading too slowly',
      'Confusing navigation',
      'Unclear value proposition',
      'Trust concerns'
    ];

    const specificReasons = {
      form: ['Too many required fields', 'Privacy concerns', 'Form validation errors'],
      checkout: ['Unexpected costs', 'Limited payment options', 'Security concerns'],
      landing: ['Poor mobile experience', 'Weak headline', 'No clear CTA']
    };

    const specific = specificReasons[stepType as keyof typeof specificReasons] || [];
    return [...baseReasons, ...specific].slice(0, Math.ceil(exitRate * 6));
  }

  private generateImprovements(stepType: string): string[] {
    const improvements = {
      landing: ['Strengthen headline', 'Add social proof', 'Optimize CTA placement'],
      form: ['Reduce form fields', 'Add progress indicator', 'Improve error messages'],
      checkout: ['Show security badges', 'Offer multiple payment options', 'Add guarantee text']
    };
    return improvements[stepType as keyof typeof improvements] || ['General UX improvements'];
  }

  private generateCompetitorSteps(count: number): FunnelStep[] {
    const steps = [];
    for (let i = 1; i <= count; i++) {
      steps.push({
        id: `competitor_step_${i}`,
        name: `Step ${i}`,
        url: `https://competitor.com/step${i}`,
        type: ['landing', 'form', 'checkout', 'confirmation'][Math.min(i - 1, 3)] as any,
        conversionRate: Math.random() * 0.7 + 0.2,
        avgTimeSpent: Math.floor(Math.random() * 200) + 50,
        exitRate: Math.random() * 0.5 + 0.1,
        keyElements: ['Competitor elements']
      });
    }
    return steps;
  }

  private generateCompetitorStrengths(): string[] {
    const strengths = [
      'Strong social proof',
      'Clear value proposition',
      'Mobile-optimized design',
      'Fast loading times',
      'Multiple payment options',
      'Excellent customer reviews'
    ];
    return strengths.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  private generateCompetitorWeaknesses(): string[] {
    const weaknesses = [
      'Complex checkout process',
      'Limited trial period',
      'Weak guarantee policy',
      'Poor mobile experience',
      'Confusing navigation',
      'High pricing'
    ];
    return weaknesses.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
