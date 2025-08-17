
import { supabase } from "@/integrations/supabase/client";

export interface DatabaseAdItem {
  id: string;
  platform: string;
  competitor: string;
  ad_creative_url?: string;
  cta?: string;
  offer?: string;
  engagement?: any; // Changed from Record<string, any> to any to match Supabase Json type
  detected_patterns?: any; // Changed from Record<string, any> to any to match Supabase Json type
  fetched_at: string;
  landing_page_url?: string;
  landing_page_snapshot?: string;
  campaign_type?: string;
  estimated_spend_daily?: number;
  target_audience?: any; // Changed from Record<string, any> to any to match Supabase Json type
  creative_hash?: string;
  status?: string;
  first_seen?: string;
  last_seen?: string;
  // Add missing fields that components are expecting
  headline?: string;
  primary_text?: string;
  active?: boolean;
}

export async function fetchAdsFromDatabase(limit = 50, offset = 0): Promise<DatabaseAdItem[]> {
  console.log('fetchAdsFromDatabase: Starting fetch with limit:', limit, 'offset:', offset);
  
  try {
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

export async function insertAd(ad: Omit<DatabaseAdItem, 'id' | 'fetched_at'>): Promise<DatabaseAdItem> {
  console.log('insertAd: Inserting ad for competitor:', ad.competitor);
  
  try {
    const { data, error } = await supabase
      .from('ads')
      .insert(ad)
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
