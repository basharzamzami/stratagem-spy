import { supabase } from "@/integrations/supabase/client";

export interface CollectionJob {
  id: string;
  type: 'ad_scraping' | 'competitor_analysis' | 'lead_enrichment' | 'market_intelligence';
  source: string;
  config: {
    target_url?: string;
    keywords?: string[];
    competitors?: string[];
    location?: {
      city?: string;
      state?: string;
      zip?: string;
    };
    depth?: number;
    frequency?: string;
  };
  status: 'pending' | 'running' | 'completed' | 'failed';
  results_count?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CollectionResult {
  id: string;
  job_id: string;
  type: string;
  source: string;
  data: Record<string, any>;
  collected_at: string;
  user_id: string;
}

export interface CollectionConfig {
  type: 'ad_scraping' | 'competitor_analysis' | 'lead_enrichment' | 'market_intelligence';
  source: string;
  config: CollectionJob['config'];
}

export class SpecterDataCollector {
  private static instance: SpecterDataCollector;

  static getInstance(): SpecterDataCollector {
    if (!SpecterDataCollector.instance) {
      SpecterDataCollector.instance = new SpecterDataCollector();
    }
    return SpecterDataCollector.instance;
  }

  async startCollection(config: CollectionConfig): Promise<CollectionJob> {
    const jobData: Omit<CollectionJob, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      type: config.type,
      source: config.source,
      config: config.config,
      status: 'pending'
    };
    
    return this.createCollectionJob(jobData);
  }

  async getAllJobs(): Promise<CollectionJob[]> {
    return this.getCollectionJobs();
  }

  async cancelJob(jobId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    await supabase
      .from('raw_collection_data')
      .update({ 
        data: { 
          status: 'failed', 
          error_message: 'Cancelled by user',
          updated_at: new Date().toISOString() 
        } 
      })
      .eq('type', 'job_config')
      .match({ 'data->>id': jobId, user_id: user.id });
  }

  async createCollectionJob(job: Omit<CollectionJob, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<CollectionJob> {
    console.log('Creating collection job:', job);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newJob: CollectionJob = {
      id: crypto.randomUUID(),
      ...job,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id
    };

    // Store in raw_collection_data table
    await this.storeCollectionResult({
      job_id: newJob.id,
      type: 'job_config',
      source: job.source,
      data: newJob,
      collected_at: new Date().toISOString(),
      user_id: user.id
    });

    // Start the collection process
    this.processJob(newJob);

    return newJob;
  }

  async getCollectionJobs(): Promise<CollectionJob[]> {
    console.log('Fetching collection jobs');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('raw_collection_data')
      .select('*')
      .eq('type', 'job_config')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching collection jobs:', error);
      return [];
    }

    return (data || []).map(row => {
      if (typeof row.data === 'object' && row.data !== null) {
        return row.data as CollectionJob;
      }
      throw new Error('Invalid job data format');
    });
  }

  private async storeCollectionResult(result: Omit<CollectionResult, 'id'>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('raw_collection_data')
      .insert({
        job_id: result.job_id,
        type: result.type,
        source: result.source,
        data: result.data,
        collected_at: result.collected_at,
        user_id: user.id
      });

    if (error) {
      console.error('Error storing collection result:', error);
      throw error;
    }
  }

  private async processJob(job: CollectionJob): Promise<void> {
    console.log(`Processing job ${job.id} of type ${job.type}`);

    switch (job.type) {
      case 'ad_scraping':
        await this.collectAdsData(job);
        break;
      case 'competitor_analysis':
        await this.collectCompetitorData(job);
        break;
      case 'lead_enrichment':
        await this.collectLeadData(job);
        break;
      case 'market_intelligence':
        await this.collectMarketData(job);
        break;
      default:
        console.warn(`Unknown job type: ${job.type}`);
    }
  }

  private async collectAdsData(job: CollectionJob): Promise<void> {
    console.log(`Collecting ads data for job ${job.id}`);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Mock ad data collection
    const mockAdsData = [
      {
        platform: 'Facebook',
        competitor: 'Competitor A',
        ad_creative_url: 'https://example.com/ad1.png',
        cta: 'Shop Now',
        offer: '50% off',
        engagement: { likes: 120, comments: 30 },
        detected_patterns: { keyword: 'sale', discount: '50%' },
        landing_page_url: 'https://example.com/landing1',
        campaign_type: 'Discount Campaign',
        estimated_spend_daily: 50,
        target_audience: { age: '25-34', location: 'USA' },
        creative_hash: 'hash123',
        status: 'active',
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString()
      },
      {
        platform: 'Google',
        competitor: 'Competitor B',
        ad_creative_url: 'https://example.com/ad2.png',
        cta: 'Learn More',
        offer: 'Free Trial',
        engagement: { clicks: 250, impressions: 5000 },
        detected_patterns: { keyword: 'free', trial: '30 days' },
        landing_page_url: 'https://example.com/landing2',
        campaign_type: 'Free Trial Campaign',
        estimated_spend_daily: 75,
        target_audience: { age: '35-44', location: 'Canada' },
        creative_hash: 'hash456',
        status: 'active',
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString()
      }
    ];

    for (const adData of mockAdsData) {
      await this.storeCollectionResult({
        job_id: job.id,
        type: 'ad_data',
        source: job.source,
        data: adData,
        collected_at: new Date().toISOString(),
        user_id: user.id
      });
    }

    // Update job status
    await supabase
      .from('raw_collection_data')
      .update({ data: { ...job, status: 'completed', results_count: mockAdsData.length } })
      .eq('type', 'job_config')
      .match({ 'data->>id': job.id, user_id: user.id });
  }

  private async collectCompetitorData(job: CollectionJob): Promise<void> {
    console.log(`Collecting competitor data for job ${job.id}`);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Mock competitor data collection
    const mockCompetitorData = [
      {
        name: 'Competitor A',
        domain: 'https://competitorA.com',
        industry: 'E-commerce',
        location_city: 'New York',
        location_state: 'NY',
        dominance_score: 85,
        total_ads_count: 500,
        estimated_monthly_spend: 10000,
        last_activity: new Date().toISOString()
      },
      {
        name: 'Competitor B',
        domain: 'https://competitorB.com',
        industry: 'Software',
        location_city: 'San Francisco',
        location_state: 'CA',
        dominance_score: 92,
        total_ads_count: 750,
        estimated_monthly_spend: 15000,
        last_activity: new Date().toISOString()
      }
    ];

    for (const competitorData of mockCompetitorData) {
      await this.storeCollectionResult({
        job_id: job.id,
        type: 'competitor_data',
        source: job.source,
        data: competitorData,
        collected_at: new Date().toISOString(),
        user_id: user.id
      });
    }

    // Update job status
    await supabase
      .from('raw_collection_data')
      .update({ data: { ...job, status: 'completed', results_count: mockCompetitorData.length } })
      .eq('type', 'job_config')
      .match({ 'data->>id': job.id, user_id: user.id });
  }

  private async collectLeadData(job: CollectionJob): Promise<void> {
    console.log(`Collecting lead data for job ${job.id}`);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Mock lead data collection
    const mockLeadData = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Example Inc',
        title: 'CEO',
        phone: '123-456-7890',
        location_city: 'Los Angeles',
        location_state: 'CA',
        intent_score: 90,
        source_data: { linkedin_profile: 'https://linkedin.com/john.doe' }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        company: 'Sample Corp',
        title: 'Marketing Manager',
        phone: '987-654-3210',
        location_city: 'Chicago',
        location_state: 'IL',
        intent_score: 80,
        source_data: { website_activity: 'Visited pricing page' }
      }
    ];

    for (const leadData of mockLeadData) {
      await this.storeCollectionResult({
        job_id: job.id,
        type: 'lead_data',
        source: job.source,
        data: leadData,
        collected_at: new Date().toISOString(),
        user_id: user.id
      });
    }

    // Update job status
    await supabase
      .from('raw_collection_data')
      .update({ data: { ...job, status: 'completed', results_count: mockLeadData.length } })
      .eq('type', 'job_config')
      .match({ 'data->>id': job.id, user_id: user.id });
  }

  private async collectMarketData(job: CollectionJob): Promise<void> {
    console.log(`Collecting market data for job ${job.id}`);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Mock market data collection
    const mockMarketData = [
      {
        zip_code: '90210',
        city: 'Beverly Hills',
        state: 'CA',
        competitor_id: 'competitor123',
        dominance_score: 75,
        seo_rank_average: 3,
        ad_presence_score: 80,
        review_score: 90
      },
      {
        zip_code: '10001',
        city: 'New York',
        state: 'NY',
        competitor_id: 'competitor456',
        dominance_score: 80,
        seo_rank_average: 2,
        ad_presence_score: 85,
        review_score: 85
      }
    ];

    for (const marketData of mockMarketData) {
      await this.storeCollectionResult({
        job_id: job.id,
        type: 'market_data',
        source: job.source,
        data: marketData,
        collected_at: new Date().toISOString(),
        user_id: user.id
      });
    }

    // Update job status
    await supabase
      .from('raw_collection_data')
      .update({ data: { ...job, status: 'completed', results_count: mockMarketData.length } })
      .eq('type', 'job_config')
      .match({ 'data->>id': job.id, user_id: user.id });
  }
}

export const specterDataCollector = SpecterDataCollector.getInstance();
