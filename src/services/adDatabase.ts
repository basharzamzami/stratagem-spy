
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
}

export async function fetchAdsFromDatabase(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('fetched_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }

  return data as DatabaseAdItem[];
}

export async function insertAdToDatabase(ad: Omit<DatabaseAdItem, 'id' | 'fetched_at'>) {
  const { data, error } = await supabase
    .from('ads')
    .insert(ad)
    .select()
    .single();

  if (error) {
    console.error('Error inserting ad:', error);
    throw error;
  }

  return data as DatabaseAdItem;
}

export async function getAdsByPlatform(platform: string) {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('platform', platform)
    .order('fetched_at', { ascending: false });

  if (error) {
    console.error('Error fetching ads by platform:', error);
    throw error;
  }

  return data as DatabaseAdItem[];
}

export async function getAdsByCompetitor(competitor: string) {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('competitor', competitor)
    .order('fetched_at', { ascending: false });

  if (error) {
    console.error('Error fetching ads by competitor:', error);
    throw error;
  }

  return data as DatabaseAdItem[];
}
