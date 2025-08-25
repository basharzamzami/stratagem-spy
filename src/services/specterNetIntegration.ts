import { supabase } from "@/integrations/supabase/client";

export interface EnhancedLead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  location_city: string;
  location_state: string;
  location_zip: string;
  intent_score: number;
  source: string;
  source_data: Record<string, any>;
  enrichment_data: Record<string, any>;
  status: string;
  tags: string[];
  notes: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Extended properties for Specter Net functionality
  intent_keywords?: string[];
  geo_context?: {
    market_size: string;
    competition_level: string;
    local_trends: string[];
    city?: string;
    state?: string;
    zip?: string;
  };
  urgency_score?: number;
  last_search_activity?: string;
  search_patterns?: string[];
}

export interface CompetitorAdIntel {
  competitor: string;
  performance_score: number;
  ad_frequency: number;
  bid_intensity: number;
  winning_hooks: string[];
  common_ctas: string[];
  offer_patterns: string[];
  creative_angles: string[];
}

export interface GeneratedCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  target_leads: string[];
  hijacked_competitors: string[];
  ad_variants: AdVariant[];
  targeting_config: {
    geo_targets: string[];
    intent_keywords: string[];
    audience_segments: string[];
  };
  budget_allocation: {
    total_budget: number;
    daily_budget: number;
    platform_distribution: Record<string, number>;
  };
  performance_metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
    roi: number;
  };
  created_at: string;
}

export interface AdVariant {
  id: string;
  headline: string;
  primary_text: string;
  cta: string;
  competitor_source: string;
  hijack_strategy: 'direct_comparison' | 'feature_superiority' | 'price_advantage' | 'social_proof';
  expected_ctr: number;
}

// Updated interface for integration results
export interface SpecterNetIntegrationResult {
  intel: CompetitorAdIntel[];
  campaigns: GeneratedCampaign[];
  leads: EnhancedLead[];
  warmLeads?: EnhancedLead[];
  competitorIntel?: CompetitorAdIntel[];
  generatedCampaigns?: GeneratedCampaign[];
}

export const getLeads = async (): Promise<EnhancedLead[]> => {
  console.log('Fetching leads');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return (data || []).map(lead => ({
    ...lead,
    source_data: lead.source_data as Record<string, any> || {},
    enrichment_data: lead.enrichment_data as Record<string, any> || {},
    tags: lead.tags || [],
    name: lead.name || '',
    email: lead.email || '',
    company: lead.company || '',
    title: lead.title || '',
    phone: lead.phone || '',
    notes: lead.notes || ''
  })) as EnhancedLead[];
};

export const getLeadById = async (leadId: string): Promise<EnhancedLead | null> => {
  console.log(`Fetching lead with ID: ${leadId}`);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error(`Error fetching lead with ID ${leadId}:`, error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    source_data: data.source_data as Record<string, any> || {},
    enrichment_data: data.enrichment_data as Record<string, any> || {},
    tags: data.tags || [],
    name: data.name || '',
    email: data.email || '',
    company: data.company || '',
    title: data.title || '',
    phone: data.phone || '',
    notes: data.notes || ''
  } as EnhancedLead;
};

export const createLead = async (lead: Omit<EnhancedLead, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<EnhancedLead | null> => {
  console.log('Creating lead:', lead);
  
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
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    source_data: data.source_data as Record<string, any> || {},
    enrichment_data: data.enrichment_data as Record<string, any> || {},
    tags: data.tags || [],
    name: data.name || '',
    email: data.email || '',
    company: data.company || '',
    title: data.title || '',
    phone: data.phone || '',
    notes: data.notes || ''
  } as EnhancedLead;
};

export const updateLead = async (leadId: string, updates: Partial<EnhancedLead>): Promise<EnhancedLead | null> => {
  console.log(`Updating lead with ID ${leadId}:`, updates);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating lead with ID ${leadId}:`, error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    source_data: data.source_data as Record<string, any> || {},
    enrichment_data: data.enrichment_data as Record<string, any> || {},
    tags: data.tags || [],
    name: data.name || '',
    email: data.email || '',
    company: data.company || '',
    title: data.title || '',
    phone: data.phone || '',
    notes: data.notes || ''
  } as EnhancedLead;
};

export const deleteLead = async (leadId: string): Promise<boolean> => {
  console.log(`Deleting lead with ID: ${leadId}`);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)
    .eq('user_id', user.id);

  if (error) {
    console.error(`Error deleting lead with ID ${leadId}:`, error);
    return false;
  }

  return true;
};

import { getMockEnhancedLeadsWithUserId } from './mockEnhancedLeads';

export const getEnhancedLeads = async (): Promise<EnhancedLead[]> => {
  console.log('Fetching enhanced leads');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Return mock data with the authenticated user's ID and extended properties
  const mockLeads = getMockEnhancedLeadsWithUserId(user.id);
  return mockLeads.map(lead => ({
    ...lead,
    intent_keywords: ['competitive intelligence', 'market analysis'],
    geo_context: {
      market_size: 'Large',
      competition_level: 'High',
      local_trends: ['SaaS growth', 'Digital transformation'],
      city: lead.location_city,
      state: lead.location_state,
      zip: lead.location_zip
    },
    urgency_score: Math.floor(Math.random() * 100),
    last_search_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    search_patterns: ['pricing comparison', 'feature analysis', 'competitor research']
  }));
};

// Updated function signature to match component expectations
export const runSpecterNetIntegration = async (config: {
  geo_targets: string[];
  business_goals: string[];
  competitor_focus: string[];
}): Promise<SpecterNetIntegrationResult> => {
  console.log('Running Specter Net integration with config:', config);
  
  // Simulate integration process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const intel: CompetitorAdIntel[] = [
    {
      competitor: 'SimilarWeb',
      performance_score: 85,
      ad_frequency: 12,
      bid_intensity: 78,
      winning_hooks: [
        'Get complete competitive intelligence in 60 seconds',
        'See what your competitors don\'t want you to know'
      ],
      common_ctas: ['Try Free', 'Get Started', 'See Demo'],
      offer_patterns: ['Free trial', '50% off first month'],
      creative_angles: ['data-driven', 'competitive-advantage', 'time-saving', 'enterprise-ready']
    }
  ];
  
  const campaigns: GeneratedCampaign[] = [
    {
      id: '1',
      name: 'SimilarWeb Hijack Campaign',
      status: 'draft',
      target_leads: ['lead1', 'lead2'],
      hijacked_competitors: ['SimilarWeb'],
      ad_variants: [
        {
          id: 'var1',
          headline: 'Better than SimilarWeb - Real-time competitive intelligence',
          primary_text: 'While SimilarWeb gives you outdated data, we provide live competitor insights that actually help you win.',
          cta: 'Try Free Now',
          competitor_source: 'SimilarWeb',
          hijack_strategy: 'feature_superiority',
          expected_ctr: 0.045
        }
      ],
      targeting_config: {
        geo_targets: config.geo_targets,
        intent_keywords: ['competitive intelligence', 'market analysis'],
        audience_segments: ['B2B marketers', 'Growth teams']
      },
      budget_allocation: {
        total_budget: 5000,
        daily_budget: 200,
        platform_distribution: { 'Google': 60, 'Facebook': 40 }
      },
      performance_metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        roi: 0
      },
      created_at: new Date().toISOString()
    }
  ];
  
  const leads = await getEnhancedLeads();
  
  return { 
    intel, 
    campaigns, 
    leads,
    warmLeads: leads,
    competitorIntel: intel,
    generatedCampaigns: campaigns
  };
};
