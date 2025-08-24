
import { supabase } from "@/integrations/supabase/client";

export interface DatabaseAdItem {
  id: string;
  platform: string;
  competitor: string;
  ad_creative_url?: string;
  cta?: string;
  offer?: string;
  engagement?: any;
  detected_patterns?: any;
  fetched_at: string;
  landing_page_url?: string;
  landing_page_snapshot?: string;
  campaign_type?: string;
  estimated_spend_daily?: number;
  target_audience?: any;
  creative_hash?: string;
  status?: string;
  first_seen?: string;
  last_seen?: string;
  user_id: string;
  // Add missing fields that components are expecting
  headline?: string;
  primary_text?: string;
  active?: boolean;
}

export async function fetchAdsFromDatabase(limit = 50, offset = 0): Promise<DatabaseAdItem[]> {
  console.log('fetchAdsFromDatabase: Starting fetch with limit:', limit, 'offset:', offset);
  
  try {
    // Check authentication first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('fetchAdsFromDatabase: User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('last_seen', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('fetchAdsFromDatabase: Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('fetchAdsFromDatabase: Successfully fetched', data?.length || 0, 'ads');
    
    // Transform the data to include missing fields
    const transformedData = (data || []).map(ad => ({
      ...ad,
      headline: ad.cta || 'No headline available',
      primary_text: ad.offer || 'No description available',
      active: ad.status === 'active'
    }));
    
    return transformedData as DatabaseAdItem[];
  } catch (error) {
    console.error('fetchAdsFromDatabase: Unexpected error:', error);
    throw error;
  }
}

export async function searchAds(query: string): Promise<DatabaseAdItem[]> {
  console.log('searchAds: Searching for:', query);
  
  try {
    // Check authentication first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('searchAds: User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .or(`competitor.ilike.%${query}%,cta.ilike.%${query}%,offer.ilike.%${query}%`)
      .order('last_seen', { ascending: false })
      .limit(50);

    if (error) {
      console.error('searchAds: Supabase error:', error);
      throw new Error(`Search error: ${error.message}`);
    }

    console.log('searchAds: Found', data?.length || 0, 'ads matching query');
    
    // Transform the data to include missing fields
    const transformedData = (data || []).map(ad => ({
      ...ad,
      headline: ad.cta || 'No headline available',
      primary_text: ad.offer || 'No description available',
      active: ad.status === 'active'
    }));
    
    return transformedData as DatabaseAdItem[];
  } catch (error) {
    console.error('searchAds: Unexpected error:', error);
    throw error;
  }
}

export async function insertAd(ad: Omit<DatabaseAdItem, 'id' | 'fetched_at' | 'user_id'>): Promise<DatabaseAdItem> {
  console.log('insertAd: Inserting ad for competitor:', ad.competitor);
  
  try {
    // Check authentication and get user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('ads')
      .insert({ ...ad, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('insertAd: Supabase error:', error);
      throw new Error(`Insert error: ${error.message}`);
    }

    console.log('insertAd: Successfully inserted ad with id:', data.id);
    
    // Transform the data to include missing fields
    const transformedData = {
      ...data,
      headline: data.cta || 'No headline available',
      primary_text: data.offer || 'No description available',
      active: data.status === 'active'
    };
    
    return transformedData as DatabaseAdItem;
  } catch (error) {
    console.error('insertAd: Unexpected error:', error);
    throw error;
  }
}
