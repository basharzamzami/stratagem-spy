
import { supabase } from "@/integrations/supabase/client";

export interface DataCollectionJob {
  id: string;
  type: 'api' | 'crawler';
  source: string;
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  config: Record<string, any>;
  created_at: string;
  completed_at?: string;
  results?: any;
  error?: string;
}

export interface CollectionConfig {
  competitors: string[];
  keywords: string[];
  geoTargets: string[];
  sources: {
    metaAds: boolean;
    googleAds: boolean;
    youtubeAds: boolean;
    seoData: boolean;
    reviews: boolean;
    socialListening: boolean;
  };
  scheduleInterval: number; // minutes
}

export class SpecterDataCollector {
  private static instance: SpecterDataCollector;
  private activeJobs: Map<string, DataCollectionJob> = new Map();

  public static getInstance(): SpecterDataCollector {
    if (!SpecterDataCollector.instance) {
      SpecterDataCollector.instance = new SpecterDataCollector();
    }
    return SpecterDataCollector.instance;
  }

  async startCollection(config: CollectionConfig): Promise<string[]> {
    console.log('🚀 Starting Specter Net data collection...');
    const jobIds: string[] = [];

    // Create collection jobs for each enabled source
    if (config.sources.metaAds) {
      const metaJob = await this.createJob('api', 'meta_ads', config);
      jobIds.push(metaJob.id);
    }

    if (config.sources.googleAds) {
      const googleJob = await this.createJob('api', 'google_ads', config);
      jobIds.push(googleJob.id);
    }

    if (config.sources.youtubeAds) {
      const youtubeJob = await this.createJob('api', 'youtube_ads', config);
      jobIds.push(youtubeJob.id);
    }

    if (config.sources.seoData) {
      const seoJob = await this.createJob('crawler', 'seo_data', config);
      jobIds.push(seoJob.id);
    }

    if (config.sources.reviews) {
      const reviewsJob = await this.createJob('api', 'reviews', config);
      jobIds.push(reviewsJob.id);
    }

    if (config.sources.socialListening) {
      const socialJob = await this.createJob('api', 'social_listening', config);
      jobIds.push(socialJob.id);
    }

    // Execute jobs asynchronously
    jobIds.forEach(jobId => {
      this.executeJob(jobId);
    });

    return jobIds;
  }

  private async createJob(type: 'api' | 'crawler', source: string, config: CollectionConfig): Promise<DataCollectionJob> {
    const job: DataCollectionJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      source,
      target: config.competitors.join(','),
      status: 'pending',
      config: {
        competitors: config.competitors,
        keywords: config.keywords,
        geoTargets: config.geoTargets
      },
      created_at: new Date().toISOString()
    };

    this.activeJobs.set(job.id, job);
    return job;
  }

  private async executeJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) return;

    try {
      console.log(`🔄 Executing job: ${job.source}`);
      job.status = 'running';

      let results;
      switch (job.source) {
        case 'meta_ads':
          results = await this.collectMetaAds(job.config);
          break;
        case 'google_ads':
          results = await this.collectGoogleAds(job.config);
          break;
        case 'youtube_ads':
          results = await this.collectYouTubeAds(job.config);
          break;
        case 'seo_data':
          results = await this.collectSEOData(job.config);
          break;
        case 'reviews':
          results = await this.collectReviews(job.config);
          break;
        case 'social_listening':
          results = await this.collectSocialListening(job.config);
          break;
        default:
          throw new Error(`Unknown source: ${job.source}`);
      }

      job.status = 'completed';
      job.completed_at = new Date().toISOString();
      job.results = results;

      // Store results in Supabase
      await this.storeResults(job);

      console.log(`✅ Job completed: ${job.source} - ${results.length} items collected`);

    } catch (error) {
      console.error(`❌ Job failed: ${job.source}`, error);
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.completed_at = new Date().toISOString();
    }

    this.activeJobs.set(jobId, job);
  }

  private async collectMetaAds(config: any): Promise<any[]> {
    // Use existing Meta Ads integration from supabase functions
    const { data, error } = await supabase.functions.invoke('ad-signal-search', {
      body: {
        filters: {
          platforms: ['meta'],
          business: config.competitors[0],
          location: { city: config.geoTargets[0]?.split(',')[0] }
        }
      }
    });

    if (error) throw error;
    return data?.ads || [];
  }

  private async collectGoogleAds(config: any): Promise<any[]> {
    // Mock Google Ads collection - in production would use Google Ads API
    console.log('Collecting Google Ads data...');
    return this.generateMockData('google_ads', config.competitors, 10);
  }

  private async collectYouTubeAds(config: any): Promise<any[]> {
    // Mock YouTube Ads collection - in production would use YouTube Data API
    console.log('Collecting YouTube Ads data...');
    return this.generateMockData('youtube_ads', config.competitors, 5);
  }

  private async collectSEOData(config: any): Promise<any[]> {
    // Mock SEO data collection - in production would use Ahrefs/SEMrush APIs or crawlers
    console.log('Collecting SEO data...');
    const seoData = [];
    
    for (const competitor of config.competitors) {
      for (const keyword of config.keywords.slice(0, 5)) {
        seoData.push({
          competitor,
          keyword,
          rank: Math.floor(Math.random() * 20) + 1,
          volume: Math.floor(Math.random() * 10000) + 1000,
          difficulty: Math.floor(Math.random() * 100),
          collected_at: new Date().toISOString()
        });
      }
    }
    
    return seoData;
  }

  private async collectReviews(config: any): Promise<any[]> {
    // Mock reviews collection - in production would use Google My Business, Yelp APIs
    console.log('Collecting reviews data...');
    const reviews = [];
    
    for (const competitor of config.competitors) {
      for (let i = 0; i < 10; i++) {
        reviews.push({
          competitor,
          platform: ['google', 'yelp', 'trustpilot'][Math.floor(Math.random() * 3)],
          rating: Math.floor(Math.random() * 5) + 1,
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
          text: `Sample review text for ${competitor}...`,
          collected_at: new Date().toISOString()
        });
      }
    }
    
    return reviews;
  }

  private async collectSocialListening(config: any): Promise<any[]> {
    // Mock social listening - in production would use Twitter API, Reddit API
    console.log('Collecting social listening data...');
    return this.generateMockData('social_mentions', config.competitors, 15);
  }

  private generateMockData(type: string, competitors: string[], count: number): any[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: `${type}_${Date.now()}_${i}`,
        competitor: competitors[i % competitors.length],
        type,
        content: `Mock ${type} data for competitive intelligence`,
        engagement: Math.floor(Math.random() * 1000),
        collected_at: new Date().toISOString()
      });
    }
    return data;
  }

  private async storeResults(job: DataCollectionJob): Promise<void> {
    try {
      // Store in raw_data table for audit trail - now the table exists
      const { error: rawDataError } = await supabase
        .from('raw_collection_data')
        .insert({
          job_id: job.id,
          source: job.source,
          type: job.type,
          data: job.results,
          collected_at: job.completed_at
        });

      if (rawDataError) {
        console.error('Error storing raw data:', rawDataError);
        throw rawDataError;
      }

      // Process and store in appropriate structured tables
      await this.processAndStoreStructuredData(job);

    } catch (error) {
      console.error('Error storing results:', error);
    }
  }

  private async processAndStoreStructuredData(job: DataCollectionJob): Promise<void> {
    if (!job.results) return;

    try {
      switch (job.source) {
        case 'meta_ads':
          // Store in ads table
          for (const ad of job.results) {
            const { error } = await supabase.from('ads').upsert({
              id: ad.id,
              platform: 'meta',
              competitor: ad.competitor_name || ad.competitor,
              ad_creative_url: ad.creative_url,
              cta: ad.cta,
              first_seen: ad.first_seen,
              last_seen: ad.last_seen,
              status: ad.active ? 'active' : 'inactive',
              fetched_at: new Date().toISOString()
            });
            
            if (error) {
              console.error('Error storing ad:', error);
            }
          }
          break;

        case 'seo_data':
          // Store in competitors table with SEO metrics (with auth check)
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            for (const seoItem of job.results) {
              await supabase.from('competitors').upsert({
                name: seoItem.competitor,
                domain: `${seoItem.competitor.toLowerCase().replace(/\s+/g, '')}.com`,
                industry: 'unknown',
                last_activity: new Date().toISOString(),
                user_id: user.id
              });
            }
          }
          break;

        case 'reviews':
          // Could create a reviews table or store in competitors table
          console.log('Processing reviews data...');
          break;

        default:
          console.log(`No structured storage defined for: ${job.source}`);
      }
    } catch (error) {
      console.error('Error processing structured data:', error);
    }
  }

  async getJobStatus(jobId: string): Promise<DataCollectionJob | null> {
    return this.activeJobs.get(jobId) || null;
  }

  async getAllJobs(): Promise<DataCollectionJob[]> {
    return Array.from(this.activeJobs.values());
  }

  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.activeJobs.get(jobId);
    if (job && job.status === 'running') {
      job.status = 'failed';
      job.error = 'Cancelled by user';
      job.completed_at = new Date().toISOString();
      return true;
    }
    return false;
  }
}
