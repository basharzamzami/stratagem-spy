
import { supabase } from "@/integrations/supabase/client";

// Enhanced interfaces for the new functionality
export interface LeadSource {
  id: string;
  lead_id: string;
  source_type: 'lead_locator' | 'campaign_manager' | 'ad_signal_hijack';
  source_id: string;
  source_data: Record<string, any>;
  created_at: string;
}

export interface LeadJourneyStage {
  id: string;
  lead_id: string;
  stage: 'keyword' | 'touchpoint' | 'conversion';
  stage_data: Record<string, any>;
  timestamp: string;
  sequence_order: number;
}

export interface FollowUpTask {
  id: string;
  lead_id: string;
  task_id: string;
  trigger_type: 'status_change' | 'time_based' | 'score_change';
  trigger_condition: Record<string, any>;
  auto_generated: boolean;
  created_at: string;
}

export interface ExternalCRMSync {
  id: string;
  lead_id: string;
  crm_type: 'hubspot' | 'pipedrive';
  external_id: string;
  sync_status: 'pending' | 'synced' | 'error';
  last_synced?: string;
  sync_data?: Record<string, any>;
  error_message?: string;
  created_at: string;
}

// Lead Aggregation from multiple sources
export async function aggregateLeadSources(leadId: string) {
  const { data, error } = await supabase
    .from('lead_sources')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lead sources:', error);
    throw error;
  }

  return data as LeadSource[];
}

export async function createLeadSource(source: Omit<LeadSource, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('lead_sources')
    .insert(source)
    .select()
    .single();

  if (error) {
    console.error('Error creating lead source:', error);
    throw error;
  }

  return data as LeadSource;
}

// Lead Journey Mapping
export async function getLeadJourney(leadId: string) {
  const { data, error } = await supabase
    .from('lead_journey')
    .select('*')
    .eq('lead_id', leadId)
    .order('sequence_order', { ascending: true });

  if (error) {
    console.error('Error fetching lead journey:', error);
    throw error;
  }

  return data as LeadJourneyStage[];
}

export async function addJourneyStage(stage: Omit<LeadJourneyStage, 'id' | 'timestamp'>) {
  const { data, error } = await supabase
    .from('lead_journey')
    .insert(stage)
    .select()
    .single();

  if (error) {
    console.error('Error adding journey stage:', error);
    throw error;
  }

  return data as LeadJourneyStage;
}

// Follow-up Tasks
export async function getLeadFollowUpTasks(leadId: string) {
  const { data, error } = await supabase
    .from('follow_up_tasks')
    .select(`
      *,
      tasks (
        id,
        title,
        description,
        priority,
        status,
        due_date,
        created_at
      )
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching follow-up tasks:', error);
    throw error;
  }

  return data;
}

export async function createManualFollowUpTask(leadId: string, taskData: {
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
}) {
  // First create the task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      category: 'follow_up',
      status: 'pending',
      related_entities: { lead_id: leadId, trigger_type: 'manual' }
    })
    .select()
    .single();

  if (taskError) {
    console.error('Error creating task:', taskError);
    throw taskError;
  }

  // Then link it to follow_up_tasks
  const { data: followUp, error: followUpError } = await supabase
    .from('follow_up_tasks')
    .insert({
      lead_id: leadId,
      task_id: task.id,
      trigger_type: 'manual' as const,
      auto_generated: false,
      trigger_condition: { created_manually: true }
    })
    .select()
    .single();

  if (followUpError) {
    console.error('Error creating follow-up task link:', followUpError);
    throw followUpError;
  }

  return { task, followUp };
}

// External CRM Sync
export async function getLeadCRMSyncStatus(leadId: string) {
  const { data, error } = await supabase
    .from('external_crm_sync')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching CRM sync status:', error);
    throw error;
  }

  return data as ExternalCRMSync[];
}

export async function syncLeadToExternalCRM(leadId: string, crmType: 'hubspot' | 'pipedrive') {
  // Get lead data
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead not found');
  }

  // Prepare sync record
  const syncRecord = {
    lead_id: leadId,
    crm_type: crmType,
    external_id: `temp_${Date.now()}`, // Will be updated after actual sync
    sync_status: 'pending' as const,
    sync_data: {
      lead_data: lead,
      sync_initiated_at: new Date().toISOString()
    }
  };

  const { data, error } = await supabase
    .from('external_crm_sync')
    .insert(syncRecord)
    .select()
    .single();

  if (error) {
    console.error('Error creating CRM sync record:', error);
    throw error;
  }

  // TODO: Implement actual CRM API calls here
  // For now, simulate sync process
  setTimeout(async () => {
    await supabase
      .from('external_crm_sync')
      .update({
        sync_status: 'synced',
        last_synced: new Date().toISOString(),
        external_id: `${crmType}_${Math.random().toString(36).substring(7)}`
      })
      .eq('id', data.id);
  }, 2000);

  return data as ExternalCRMSync;
}

// Lead Aggregation from all sources
export async function aggregateLeadsFromSources() {
  // Simulate fetching from different sources
  const mockSourceData = {
    lead_locator: [
      {
        name: 'Alex Johnson',
        email: 'alex@techstartup.com',
        company: 'TechStartup Inc',
        location_city: 'Seattle',
        location_state: 'WA',
        intent_score: 85,
        source_data: { search_keywords: ['competitive analysis', 'market research'] }
      }
    ],
    campaign_manager: [
      {
        name: 'Lisa Brown',
        email: 'lisa@growthco.com',
        company: 'GrowthCo',
        location_city: 'Austin',
        location_state: 'TX',
        intent_score: 78,
        source_data: { campaign_id: 'camp_123', ad_clicked: 'competitive-intel-ad' }
      }
    ],
    ad_signal_hijack: [
      {
        name: 'Mike Davis',
        email: 'mike@scalecorp.com',
        company: 'ScaleCorp',
        location_city: 'Denver',
        location_state: 'CO',
        intent_score: 92,
        source_data: { competitor_ad_engaged: 'SimilarWeb', engagement_type: 'click' }
      }
    ]
  };

  const aggregatedLeads = [];

  for (const [sourceType, leads] of Object.entries(mockSourceData)) {
    for (const leadData of leads) {
      // Create lead
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          source: sourceType,
          status: 'new'
        })
        .select()
        .single();

      if (!error && newLead) {
        // Create lead source record
        await createLeadSource({
          lead_id: newLead.id,
          source_type: sourceType as 'lead_locator' | 'campaign_manager' | 'ad_signal_hijack',
          source_id: `${sourceType}_${Date.now()}`,
          source_data: leadData.source_data
        });

        // Create initial journey stage
        await addJourneyStage({
          lead_id: newLead.id,
          stage: 'keyword',
          stage_data: {
            source: sourceType,
            initial_touchpoint: leadData.source_data,
            timestamp: new Date().toISOString()
          },
          sequence_order: 1
        });

        aggregatedLeads.push(newLead);
      }
    }
  }

  return aggregatedLeads;
}

// Enhanced lead analytics
export async function getLeadAnalytics() {
  const { data: leads } = await supabase.from('leads').select('*');
  const { data: sources } = await supabase.from('lead_sources').select('*');
  const { data: journey } = await supabase.from('lead_journey').select('*');

  const analytics = {
    total_leads: leads?.length || 0,
    by_source: {} as Record<string, number>,
    by_status: {} as Record<string, number>,
    journey_completion: 0,
    avg_intent_score: 0
  };

  if (leads) {
    // Calculate by status
    leads.forEach(lead => {
      analytics.by_status[lead.status] = (analytics.by_status[lead.status] || 0) + 1;
    });

    // Calculate average intent score
    analytics.avg_intent_score = leads.reduce((sum, lead) => sum + (lead.intent_score || 0), 0) / leads.length;
  }

  if (sources) {
    // Calculate by source
    sources.forEach(source => {
      analytics.by_source[source.source_type] = (analytics.by_source[source.source_type] || 0) + 1;
    });
  }

  if (journey) {
    // Calculate journey completion rate
    const conversions = journey.filter(stage => stage.stage === 'conversion').length;
    const totalJourneys = new Set(journey.map(stage => stage.lead_id)).size;
    analytics.journey_completion = totalJourneys > 0 ? (conversions / totalJourneys) * 100 : 0;
  }

  return analytics;
}
