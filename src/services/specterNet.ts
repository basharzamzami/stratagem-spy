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
}

// Enhanced Ad Database Operations
export async function fetchEnhancedAds(limit = 50, offset = 0) {
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

export async function insertEnhancedAd(ad: Omit<EnhancedAdItem, 'id' | 'fetched_at'>) {
  const { data, error } = await supabase
    .from('ads')
    .insert(ad)
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

export async function createCompetitor(competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('competitors')
    .insert(competitor)
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

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
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

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
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

export async function createAlert(alert: Omit<Alert, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
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

// Refined Auto Pitch Generator
export async function generateRefinedPitch(leadDetails: any, pitchType: string): Promise<string> {
  // Simulate AI-powered pitch generation based on lead details and type
  const { name, company, title, intent_keywords, geo_context, competitor_references } = leadDetails;
  
  let pitch = '';
  
  switch (pitchType) {
    case 'introductory':
      pitch = `Hi ${name},\n\nI noticed ${company} has been researching ${intent_keywords?.[0] || 'marketing solutions'}. As ${title}, you're probably looking for ways to stay ahead of competitors like ${competitor_references?.[0] || 'industry leaders'}.\n\nOur competitive intelligence platform has helped similar companies in ${geo_context?.city || 'your area'} increase their market share by 40% on average.\n\nWould you be interested in a 15-minute demo to see how we can help ${company} dominate your local market?\n\nBest regards,\nYour Marketing Intelligence Team`;
      break;
      
    case 'follow_up':
      pitch = `Hi ${name},\n\nFollowing up on our previous conversation about ${company}'s competitive positioning. I've been tracking your competitors' latest moves in ${geo_context?.city || 'your market'}.\n\nJust this week, ${competitor_references?.[0] || 'a key competitor'} launched a new campaign targeting ${intent_keywords?.[0] || 'your keywords'}. This could impact your market share if not addressed quickly.\n\nI'd love to show you exactly what they're doing and how you can counter it. Are you available for a quick call this week?\n\nBest,\nYour Competitive Intelligence Team`;
      break;
      
    case 'personalized':
      pitch = `${name},\n\nI've been analyzing the ${geo_context?.city || 'local'} market for ${intent_keywords?.[0] || 'your industry'} and noticed some concerning trends for ${company}.\n\nYour competitors are investing heavily in ${intent_keywords?.[1] || 'digital marketing'}, with ${competitor_references?.[0] || 'the market leader'} increasing their ad spend by 150% in the last quarter.\n\nAs ${title}, I'm sure you're aware of how quickly market dynamics can shift. Our platform can give you real-time insights into their strategies before they impact your bottom line.\n\nWould you like to see a personalized competitive analysis for ${company}?\n\nRegards,\nSpecter Insights Team`;
      break;
      
    case 'competitive':
      pitch = `${name},\n\nYour competitors don't want you to see this...\n\nI've been tracking ${competitor_references?.join(', ') || 'your key competitors'} and discovered they're using tactics that could be costing ${company} significant market share in ${geo_context?.city || 'your area'}.\n\nSpecifically, they're targeting ${intent_keywords?.[0] || 'your keywords'} with strategies that most ${title}s aren't aware of.\n\nI can show you exactly what they're doing and how to counter it in the next 24 hours. This intelligence is time-sensitive.\n\nInterested in staying ahead?\n\nUrgently,\nCompetitive Intelligence Team`;
      break;
      
    default:
      pitch = `Hi ${name},\n\nI hope this message finds you well. I wanted to reach out regarding ${company}'s competitive positioning in the ${geo_context?.city || 'current'} market.\n\nBest regards,\nSpecter Insights Team`;
  }
  
  return pitch;
}
