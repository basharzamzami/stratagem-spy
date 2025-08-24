
import { supabase } from "@/integrations/supabase/client";

// Enhanced Ad Intelligence
export interface EnhancedAdItem {
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
  user_id: string;
}

// Competitor Profile
export interface Competitor {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  location_city?: string;
  location_state?: string;
  location_zip?: string;
  dominance_score: number;
  total_ads_count: number;
  estimated_monthly_spend: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// High-Intent Lead
export interface Lead {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  title?: string;
  phone?: string;
  location_zip?: string;
  location_city?: string;
  location_state?: string;
  intent_score: number;
  source?: string;
  source_data?: Record<string, any>;
  enrichment_data?: Record<string, any>;
  status: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Market Dominance Data
export interface MarketDominance {
  id: string;
  zip_code: string;
  city?: string;
  state?: string;
  competitor_id?: string;
  dominance_score: number;
  seo_rank_average?: number;
  ad_presence_score?: number;
  review_score?: number;
  last_calculated: string;
  user_id: string;
}

// AI-Generated Tasks
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: number;
  category?: string;
  status: string;
  estimated_impact?: string;
  execution_steps?: Record<string, any>;
  related_entities?: Record<string, any>;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Real-time Alerts
export interface Alert {
  id: string;
  type: string;
  title: string;
  message?: string;
  severity: string;
  data?: Record<string, any>;
  read: boolean;
  channels?: string[];
  created_at: string;
  user_id: string;
}

// Enhanced Ad Database Operations
export async function fetchEnhancedAds(limit = 50, offset = 0) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('last_seen', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching enhanced ads:', error);
    throw error;
  }

  return data as EnhancedAdItem[];
}

export async function insertEnhancedAd(ad: Omit<EnhancedAdItem, 'id' | 'fetched_at' | 'user_id'>) {
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
    console.error('Error inserting enhanced ad:', error);
    throw error;
  }

  return data as EnhancedAdItem;
}

// Competitor Intelligence Operations
export async function fetchCompetitors() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .order('dominance_score', { ascending: false });

  if (error) {
    console.error('Error fetching competitors:', error);
    throw error;
  }

  return data as Competitor[];
}

export async function createCompetitor(competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('competitors')
    .insert({ ...competitor, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating competitor:', error);
    throw error;
  }

  return data as Competitor;
}

export async function updateCompetitorDominanceScore(id: string, score: number) {
  const { data, error } = await supabase
    .from('competitors')
    .update({ dominance_score: score, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating competitor score:', error);
    throw error;
  }

  return data as Competitor;
}

// Lead Intelligence Operations
export async function fetchHighIntentLeads(minIntentScore = 70) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .gte('intent_score', minIntentScore)
    .order('intent_score', { ascending: false });

  if (error) {
    console.error('Error fetching high-intent leads:', error);
    throw error;
  }

  return data as Lead[];
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({ ...lead, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }

  return data as Lead;
}

export async function updateLeadStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }

  return data as Lead;
}

// Market Dominance Operations
export async function fetchMarketDominance(zipCodes?: string[]) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('market_dominance')
    .select('*')
    .order('dominance_score', { ascending: false });

  if (zipCodes && zipCodes.length > 0) {
    query = query.in('zip_code', zipCodes);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching market dominance:', error);
    throw error;
  }

  return data as MarketDominance[];
}

// Task Generation Operations
export async function fetchTasks(status?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('tasks')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...task, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data as Task;
}

// Alert System Operations
export async function fetchAlerts(unreadOnly = false) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }

  return data as Alert[];
}

export async function createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('alerts')
    .insert({ ...alert, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating alert:', error);
    throw error;
  }

  return data as Alert;
}

export async function markAlertAsRead(id: string) {
  const { data, error } = await supabase
    .from('alerts')
    .update({ read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error marking alert as read:', error);
    throw error;
  }

  return data as Alert;
}

// Intelligence Analytics
export async function generateCompetitorInsights(competitorName: string) {
  const ads = await fetchEnhancedAds(100);
  const competitorAds = ads.filter(ad => ad.competitor.toLowerCase() === competitorName.toLowerCase());
  
  const insights = {
    total_ads: competitorAds.length,
    active_ads: competitorAds.filter(ad => ad.status === 'active').length,
    platforms: [...new Set(competitorAds.map(ad => ad.platform))],
    common_patterns: extractPatterns(competitorAds),
    estimated_spend: competitorAds.reduce((sum, ad) => sum + (ad.estimated_spend_daily || 0), 0),
    avg_engagement: calculateAverageEngagement(competitorAds)
  };

  return insights;
}

function extractPatterns(ads: EnhancedAdItem[]) {
  const patterns: Record<string, number> = {};
  
  ads.forEach(ad => {
    if (ad.detected_patterns) {
      Object.values(ad.detected_patterns).forEach(pattern => {
        if (typeof pattern === 'string') {
          patterns[pattern] = (patterns[pattern] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(patterns)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([pattern, count]) => ({ pattern, count }));
}

function calculateAverageEngagement(ads: EnhancedAdItem[]) {
  const validEngagements = ads
    .map(ad => ad.engagement)
    .filter(Boolean)
    .map(eng => Object.values(eng || {}).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0));
  
  return validEngagements.length > 0 
    ? validEngagements.reduce((sum, val) => sum + val, 0) / validEngagements.length 
    : 0;
}
