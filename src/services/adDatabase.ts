
import { supabase } from "@/integrations/supabase/client";

export interface DatabaseAdItem {
  id: string;
  platform: string;
  competitor: string;
  ad_creative_url?: string;
  cta?: string;
  offer?: string;
  engagement?: Record<string, any>;
  detected_patterns?: Record<string, any>;
  fetched_at: string;
  landing_page_url?: string;
  landing_page_snapshot?: string;
  campaign_type?: string;
  estimated_spend_daily?: number;
  target_audience?: Record<string, any>;
  creative_hash?: string;
  status?: string;
  first_seen?: string;
  last_seen?: string;
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
    return data || [];
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
    return data || [];
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
    return data;
  } catch (error) {
    console.error('insertAd: Unexpected error:', error);
    throw error;
  }
}
