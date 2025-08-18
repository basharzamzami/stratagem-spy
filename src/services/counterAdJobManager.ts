
import { supabase } from "@/integrations/supabase/client";
import { CreativeDNA } from "./productionHotAdDetector";

export interface TemplateVariant {
  variant_id: string;
  headline: string;
  body: string;
  cta: string;
  tone: 'aggressive' | 'professional' | 'friendly' | 'emotional';
  predicted_ctr_score: number;
  strategy: 'flip' | 'undermine' | 'amplify';
}

export interface CounterAdJob {
  job_id: string;
  original_ad_id: string;
  creative_dna_id: string;
  status: 'pending_approval' | 'scheduled' | 'deploying' | 'deployed' | 'failed';
  variants: TemplateVariant[];
  targeting_spec: {
    demographics: Record<string, any>;
    interests: string[];
    behaviors: string[];
    budget: number;
    platforms: string[];
  };
  launch_mode: 'manual' | 'auto';
  scheduled_time?: string;
  deployed_time?: string;
  estimated_cost: number;
}

// Mock data stores since database tables don't exist yet
const mockCreativeDNA: Record<string, CreativeDNA> = {};
const mockCounterAdJobs: Record<string, CounterAdJob> = {};

class CounterAdJobManager {
  
  /**
   * HOTAD-003: Create counter-ad job from Creative DNA
   */
  async createCounterAdJob(
    originalAdId: string, 
    creativeDnaId: string,
    launchMode: 'manual' | 'auto' = 'manual',
    targetingOverrides?: any
  ): Promise<CounterAdJob> {
    
    // Use mock Creative DNA data since table doesn't exist
    let creativeDNA = mockCreativeDNA[creativeDnaId];
    
    if (!creativeDNA) {
      // Create mock Creative DNA if it doesn't exist
      creativeDNA = {
        creative_dna_id: creativeDnaId,
        ad_id: originalAdId,
        hook_type: { scarcity: 0.8, urgency: 0.6, authority: 0.3 },
        primary_cta: 'learn more',
        color_palette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        visual_elements: {
          human_face: true,
          product_demo: false,
          text_overlay_ratio: 0.3
        },
        offer_type: 'discount',
        confidence: 0.85
      };
      mockCreativeDNA[creativeDnaId] = creativeDNA;
    }

    // Generate template variants
    const variants = await this.generateTemplateVariants(creativeDNA);
    
    // Create targeting specification
    const targetingSpec = this.generateTargetingSpec(creativeDNA, targetingOverrides);
    
    // Calculate estimated cost
    const estimatedCost = this.calculateEstimatedCost(variants, targetingSpec);

    const job: CounterAdJob = {
      job_id: `job-${originalAdId}-${Date.now()}`,
      original_ad_id: originalAdId,
      creative_dna_id: creativeDnaId,
      status: 'pending_approval',
      variants,
      targeting_spec: targetingSpec,
      launch_mode: launchMode,
      estimated_cost: estimatedCost
    };

    // Store in mock data store
    mockCounterAdJobs[job.job_id] = job;

    // Log creation to alerts table for tracking (with auth check)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('alerts')
        .insert({
          type: 'counter_ad_job_created',
          title: 'Counter Ad Job Created',
          message: `New counter-ad job created for ad ${originalAdId}`,
          severity: 'info',
          data: { job_id: job.job_id, original_ad_id: originalAdId },
          user_id: user.id
        });
    }

    return job;
  }

  private async generateTemplateVariants(creativeDNA: CreativeDNA): Promise<TemplateVariant[]> {
    const variants: TemplateVariant[] = [];
    const strategies: Array<'flip' | 'undermine' | 'amplify'> = ['flip', 'undermine', 'amplify'];
    
    // Get primary trigger
    const primaryTrigger = Object.entries(creativeDNA.hook_type)
      .sort(([,a], [,b]) => b - a)[0][0];

    for (const strategy of strategies) {
      const variant = this.createVariantForStrategy(strategy, primaryTrigger, creativeDNA);
      variants.push(variant);
    }

    return variants;
  }

  private createVariantForStrategy(
    strategy: 'flip' | 'undermine' | 'amplify', 
    primaryTrigger: string, 
    creativeDNA: CreativeDNA
  ): TemplateVariant {
    
    const templates = {
      flip: {
        scarcity: {
          headline: "No More FOMO - Get Unlimited Access",
          body: "While others create artificial scarcity, we believe everyone deserves access to the best tools. Join thousands who chose the transparent alternative.",
          tone: 'professional' as const
        },
        authority: {
          headline: "Real Results, Not Just Claims",
          body: "Skip the self-proclaimed experts. Our peer-reviewed approach delivers measurable outcomes that speak for themselves.",
          tone: 'professional' as const
        },
        urgency: {
          headline: "Take Your Time - Quality Over Speed",
          body: "Why rush important decisions? Our consultative approach ensures you make the right choice, not just the fast one.",
          tone: 'friendly' as const
        }
      },
      undermine: {
        scarcity: {
          headline: "See What They're Really Hiding",
          body: "Ever wonder why they limit access? Get the full story and unlimited resources they don't want you to have.",
          tone: 'aggressive' as const
        },
        authority: {
          headline: "The Authority They Fear",
          body: "While others claim expertise, we deliver proven results. See why industry leaders quietly switch to our solution.",
          tone: 'professional' as const
        },
        urgency: {
          headline: "The Pressure-Free Alternative",
          body: "No deadlines, no pressure tactics. Just honest solutions that work on your timeline.",
          tone: 'friendly' as const
        }
      },
      amplify: {
        scarcity: {
          headline: "Even More Exclusive Than They Claim",
          body: "Think their offer was exclusive? Wait until you see our invite-only program for verified professionals only.",
          tone: 'professional' as const
        },
        authority: {
          headline: "Beyond Expert Level - Mastery Tier",
          body: "When experts need experts, they come to us. Join the elite circle of true industry leaders.",
          tone: 'professional' as const
        },
        urgency: {
          headline: "Ultra-Priority Fast Track Available",
          body: "Their deadline too slow? Get instant access with our priority implementation program.",
          tone: 'aggressive' as const
        }
      }
    };

    const template = templates[strategy][primaryTrigger as keyof typeof templates.flip] || 
                    templates[strategy].scarcity;

    return {
      variant_id: `${strategy}-${primaryTrigger}-${Date.now()}`,
      headline: template.headline,
      body: template.body,
      cta: this.generateStrategicCTA(creativeDNA.primary_cta, strategy),
      tone: template.tone,
      predicted_ctr_score: Math.random() * 0.03 + 0.02, // 2-5% CTR
      strategy
    };
  }

  private generateStrategicCTA(originalCta: string, strategy: string): string {
    const strategicCTAs = {
      flip: {
        'book your spot': 'Get Unlimited Access →',
        'get started': 'Start Without Limits →',
        'learn more': 'See Full Transparency →'
      },
      undermine: {
        'book your spot': 'Skip The Line →',
        'get started': 'Get Real Results →', 
        'learn more': 'Discover Truth →'
      },
      amplify: {
        'book your spot': 'Join Elite Circle →',
        'get started': 'Access VIP Program →',
        'learn more': 'Unlock Mastery →'
      }
    };

    return strategicCTAs[strategy as keyof typeof strategicCTAs][originalCta as keyof typeof strategicCTAs.flip] || 
           'Learn More →';
  }

  private generateTargetingSpec(creativeDNA: CreativeDNA, overrides?: any) {
    const baseSpec = {
      demographics: {
        age_range: '25-55',
        income_level: 'middle_to_high',
        job_titles: ['Manager', 'Director', 'VP', 'CEO', 'Founder']
      },
      interests: [
        'Business Software',
        'Marketing Tools', 
        'Professional Development',
        'Industry Publications'
      ],
      behaviors: [
        'Recently searched for business solutions',
        'Engaged with competitor content',
        'Visited comparison websites',
        'Downloaded business whitepapers'
      ],
      budget: 5000,
      platforms: ['facebook', 'google', 'linkedin']
    };

    return { ...baseSpec, ...overrides };
  }

  private calculateEstimatedCost(variants: TemplateVariant[], targetingSpec: any): number {
    const baseCostPerVariant = 250;
    const platformMultipliers = {
      facebook: 1.0,
      google: 1.3,
      linkedin: 1.8
    };

    let totalCost = variants.length * baseCostPerVariant;
    
    // Apply platform multipliers
    const avgMultiplier = targetingSpec.platforms.reduce((sum: number, platform: string) => 
      sum + (platformMultipliers[platform as keyof typeof platformMultipliers] || 1.0), 0
    ) / targetingSpec.platforms.length;

    return Math.round(totalCost * avgMultiplier);
  }

  /**
   * HOTAD-004: Job management API methods
   */
  async approveJob(jobId: string, budget?: number, schedule?: string): Promise<void> {
    const job = mockCounterAdJobs[jobId];
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    job.status = 'scheduled';
    
    if (budget) {
      job.targeting_spec.budget = budget;
    }
    
    if (schedule) {
      job.scheduled_time = schedule;
    }

    mockCounterAdJobs[jobId] = job;

    // Log to alerts (with auth check)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('alerts')
        .insert({
          type: 'counter_ad_job_approved',
          title: 'Counter Ad Job Approved',
          message: `Job ${jobId} has been approved and scheduled`,
          severity: 'info',
          data: { job_id: jobId },
          user_id: user.id
        });
    }
  }

  async deployJob(jobId: string): Promise<{ success: boolean; platformJobIds?: Record<string, string> }> {
    const job = mockCounterAdJobs[jobId];
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    // Mock deployment - in production, integrate with platform APIs
    const mockPlatformIds = {
      facebook: `fb_${Date.now()}`,
      google: `gads_${Date.now()}`,
      linkedin: `li_${Date.now()}`
    };

    job.status = 'deployed';
    job.deployed_time = new Date().toISOString();
    mockCounterAdJobs[jobId] = job;

    // Log to alerts (with auth check)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('alerts')
        .insert({
          type: 'counter_ad_job_deployed',
          title: 'Counter Ad Job Deployed',
          message: `Job ${jobId} has been successfully deployed`,
          severity: 'info',
          data: { job_id: jobId, platform_job_ids: mockPlatformIds },
          user_id: user.id
        });
    }

    return { success: true, platformJobIds: mockPlatformIds };
  }

  async getJob(jobId: string): Promise<CounterAdJob | null> {
    return mockCounterAdJobs[jobId] || null;
  }

  async getActiveJobs(): Promise<CounterAdJob[]> {
    return Object.values(mockCounterAdJobs).filter(job => 
      ['pending_approval', 'scheduled', 'deploying'].includes(job.status)
    );
  }
}

export const counterAdJobManager = new CounterAdJobManager();
