
import { supabase } from "@/integrations/supabase/client";

// Enhanced Ad Intelligence with user authentication
export interface EnhancedAdItem {
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
}

// Competitor Profile with user isolation
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

// High-Intent Lead with user isolation
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
  source_data?: any;
  enrichment_data?: any;
  status: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// AI-Generated Tasks with user isolation
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: number;
  category?: string;
  status: string;
  estimated_impact?: string;
  execution_steps?: any;
  related_entities?: any;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Real-time Alerts with user isolation
export interface Alert {
  id: string;
  type: string;
  title: string;
  message?: string;
  severity: string;
  data?: any;
  read: boolean;
  channels?: string[];
  created_at: string;
  user_id: string;
}

// Enhanced Ad Database Operations (shared data, authenticated access only)
export async function fetchEnhancedAds(limit = 50, offset = 0): Promise<EnhancedAdItem[]> {
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

  return (data || []) as EnhancedAdItem[];
}

// Competitor Intelligence Operations (user-specific)
export async function fetchUserCompetitors(): Promise<Competitor[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('user_id', user.id)
    .order('dominance_score', { ascending: false });

  if (error) {
    console.error('Error fetching competitors:', error);
    throw error;
  }

  return (data || []) as Competitor[];
}

export async function createUserCompetitor(competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Competitor> {
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

// Lead Intelligence Operations (user-specific)
export async function fetchUserHighIntentLeads(minIntentScore = 70): Promise<Lead[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .gte('intent_score', minIntentScore)
    .order('intent_score', { ascending: false });

  if (error) {
    console.error('Error fetching high-intent leads:', error);
    throw error;
  }

  return (data || []) as Lead[];
}

export async function createUserLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Lead> {
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

export async function updateUserLeadStatus(id: string, status: string): Promise<Lead> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }

  return data as Lead;
}

// Task Generation Operations (user-specific)
export async function fetchUserTasks(status?: string): Promise<Task[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
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

  return (data || []) as Task[];
}

export async function createUserTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Task> {
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

// Alert System Operations (user-specific)
export async function fetchUserAlerts(unreadOnly = false): Promise<Alert[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('alerts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }

  return (data || []) as Alert[];
}

export async function createUserAlert(alert: Omit<Alert, 'id' | 'created_at' | 'user_id'>): Promise<Alert> {
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

export async function markUserAlertAsRead(id: string): Promise<Alert> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('alerts')
    .update({ read: true })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error marking alert as read:', error);
    throw error;
  }

  return data as Alert;
}
