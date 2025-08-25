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

  return data || [];
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

  return data || null;
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

  return data || null;
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

  return data || null;
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
  
  // Return mock data with the authenticated user's ID
  return getMockEnhancedLeadsWithUserId(user.id);
};
