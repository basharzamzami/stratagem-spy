import { supabase } from "@/integrations/supabase/client";

export interface RawData {
  id: string;
  type: string;
  source: string;
  data: Record<string, any>;
  created_at: string;
  user_id: string;
}

export interface CollectionConfig {
  type: string;
  source: string;
  query: string;
  limit?: number;
  fields?: string[];
}

interface CollectionJob {
  id: string;
  type: string;
  source: string;
  config: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: any;
  created_at: string;
  updated_at: string;
}

export const submitDataCollectionJob = async (config: CollectionConfig): Promise<RawData | null> => {
  console.log('Submitting data collection job with config:', config);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('raw_collection_data')
      .insert({
        type: 'collection_job',
        source: config.source,
        data: config,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting data collection job:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error submitting data collection job:', error);
    return null;
  }
};

export const processCollectionJobs = async (): Promise<CollectionJob[]> => {
  console.log('Processing collection jobs');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('raw_collection_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'collection_job')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching collection jobs:', error);
      return [];
    }

    return (data || []).map(item => {
      const jobData = item.data as any;
      return {
        id: item.id,
        type: jobData?.type || 'unknown',
        source: item.source,
        config: jobData?.config || {},
        status: jobData?.status || 'pending',
        results: jobData?.results,
        created_at: item.created_at,
        updated_at: item.created_at
      } as CollectionJob;
    });
  } catch (error) {
    console.error('Error processing collection jobs:', error);
    return [];
  }
};

export const updateCollectionJobStatus = async (jobId: string, status: 'pending' | 'running' | 'completed' | 'failed', results?: any): Promise<boolean> => {
  console.log(`Updating collection job ${jobId} status to ${status}`);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('raw_collection_data')
      .update({
        data: { status, results }
      })
      .eq('id', jobId)
      .eq('user_id', user.id);

    if (error) {
      console.error(`Error updating collection job ${jobId} status:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error updating collection job ${jobId} status:`, error);
    return false;
  }
};

export const getRawData = async (source: string, query: string, limit: number = 50): Promise<RawData[]> => {
  console.log(`Fetching raw data from source ${source} with query ${query} and limit ${limit}`);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('raw_collection_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('source', source)
      .like('data', `%${query}%`)
      .limit(limit);

    if (error) {
      console.error(`Error fetching raw data from source ${source}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching raw data from source ${source}:`, error);
    return [];
  }
};
