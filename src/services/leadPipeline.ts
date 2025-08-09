
import { supabase } from "@/integrations/supabase/client";
import { createLead, updateLeadStatus } from './specterNet';
import { createLeadSource, addJourneyStage } from './crmService';
import { createTask } from './specterNet';

export interface EnhancedLead {
  id: string;
  name: string;
  email: string;
  company: string;
  title?: string;
  phone?: string;
  location_city: string;
  location_state: string;
  location_zip?: string;
  intent_score: number;
  keywords: string[];
  source: 'lead_locator' | 'ad_signal_hijack' | 'campaign_manager';
  source_data: Record<string, any>;
  enrichment_data?: Record<string, any>;
  status: string;
}

// Lead intelligence gathering from multiple sources
export async function gatherLeadIntelligence(filters: {
  industry?: string;
  location?: { city?: string; state?: string; zip?: string };
  keywords?: string[];
  minIntentScore?: number;
}) {
  // Simulate gathering leads from different intelligence sources
  const mockLeads: EnhancedLead[] = [
    {
      id: 'lead_1',
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      company: 'TechCorp Solutions',
      title: 'VP of Marketing',
      phone: '(555) 123-4567',
      location_city: filters.location?.city || 'San Francisco',
      location_state: filters.location?.state || 'CA',
      location_zip: filters.location?.zip || '94105',
      intent_score: 92,
      keywords: ['competitive analysis', 'market intelligence', 'growth strategies'],
      source: 'lead_locator',
      source_data: {
        search_keywords: filters.keywords || ['competitive analysis'],
        search_location: filters.location,
        discovery_method: 'keyword_intent_analysis',
        engagement_signals: ['downloaded_whitepaper', 'visited_pricing_page']
      },
      enrichment_data: {
        company_size: '100-500',
        industry: filters.industry || 'Technology',
        revenue_estimate: '$10M-50M',
        tech_stack: ['HubSpot', 'Salesforce', 'Google Analytics']
      },
      status: 'new'
    },
    {
      id: 'lead_2',
      name: 'Michael Rodriguez',
      email: 'mike@growthstartup.com',
      company: 'GrowthStartup Inc',
      title: 'CEO',
      phone: '(555) 987-6543',
      location_city: filters.location?.city || 'Austin',
      location_state: filters.location?.state || 'TX',
      location_zip: filters.location?.zip || '73301',
      intent_score: 88,
      keywords: ['ad intelligence', 'competitor tracking', 'marketing automation'],
      source: 'ad_signal_hijack',
      source_data: {
        competitor_ads_engaged: ['SimilarWeb', 'SEMrush'],
        engagement_type: 'clicked_competitor_ad',
        ad_platform: 'Google Ads',
        discovery_timestamp: new Date().toISOString()
      },
      enrichment_data: {
        company_size: '10-50',
        industry: 'SaaS',
        revenue_estimate: '$1M-10M',
        funding_stage: 'Series A'
      },
      status: 'new'
    },
    {
      id: 'lead_3',
      name: 'Jessica Wang',
      email: 'jessica@enterpriseco.com',
      company: 'Enterprise Solutions Co',
      title: 'Director of Sales',
      phone: '(555) 456-7890',
      location_city: filters.location?.city || 'Seattle',
      location_state: filters.location?.state || 'WA',
      location_zip: filters.location?.zip || '98101',
      intent_score: 85,
      keywords: ['sales intelligence', 'lead generation', 'CRM integration'],
      source: 'campaign_manager',
      source_data: {
        campaign_id: 'camp_456',
        ad_creative_clicked: 'competitive_intelligence_demo',
        landing_page: '/demo-request',
        utm_source: 'google_ads'
      },
      enrichment_data: {
        company_size: '500-1000',
        industry: 'Enterprise Software',
        revenue_estimate: '$50M+',
        existing_tools: ['Salesforce', 'Marketo', 'Outreach']
      },
      status: 'new'
    }
  ];

  // Filter leads based on criteria
  return mockLeads.filter(lead => {
    const matchesIndustry = !filters.industry || 
      lead.enrichment_data?.industry?.toLowerCase().includes(filters.industry.toLowerCase()) ||
      lead.keywords.some(k => k.toLowerCase().includes(filters.industry.toLowerCase()));
    
    const matchesLocation = !filters.location?.city || 
      lead.location_city.toLowerCase().includes(filters.location.city.toLowerCase());
    
    const matchesIntentScore = !filters.minIntentScore || 
      lead.intent_score >= filters.minIntentScore;

    return matchesIndustry && matchesLocation && matchesIntentScore;
  });
}

// Process leads through the full pipeline
export async function processLeadThroughPipeline(leadData: EnhancedLead) {
  try {
    console.log('Processing lead through pipeline:', leadData.name);
    
    // Step 1: Create lead in CRM
    const createdLead = await createLead({
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      title: leadData.title,
      phone: leadData.phone,
      location_city: leadData.location_city,
      location_state: leadData.location_state,
      location_zip: leadData.location_zip,
      intent_score: leadData.intent_score,
      source: leadData.source,
      source_data: leadData.source_data,
      enrichment_data: leadData.enrichment_data,
      status: leadData.status,
      tags: leadData.keywords,
      notes: `Auto-generated lead from ${leadData.source}. Intent score: ${leadData.intent_score}`
    });

    // Step 2: Create lead source record
    await createLeadSource({
      lead_id: createdLead.id,
      source_type: leadData.source,
      source_id: `${leadData.source}_${Date.now()}`,
      source_data: leadData.source_data
    });

    // Step 3: Add initial journey stage
    await addJourneyStage({
      lead_id: createdLead.id,
      stage: 'keyword',
      stage_data: {
        source: leadData.source,
        keywords: leadData.keywords,
        intent_signals: leadData.source_data,
        enrichment: leadData.enrichment_data,
        timestamp: new Date().toISOString()
      },
      sequence_order: 1
    });

    // Step 4: Generate follow-up tasks based on lead profile
    const tasks = await generateLeadTasks(createdLead, leadData);
    
    console.log('Lead processed successfully:', createdLead.id);
    return { lead: createdLead, tasks };

  } catch (error) {
    console.error('Error processing lead through pipeline:', error);
    throw error;
  }
}

// AI-powered task generation based on lead intelligence
export async function generateLeadTasks(lead: any, leadData: EnhancedLead) {
  const tasks = [];
  
  // High intent score leads get immediate outreach tasks
  if (leadData.intent_score >= 85) {
    tasks.push(await createTask({
      title: `High-Intent Outreach: ${lead.name} (${lead.company})`,
      description: `Immediate outreach required for high-intent lead. Keywords: ${leadData.keywords.join(', ')}. Intent score: ${leadData.intent_score}`,
      priority: 5,
      category: 'outreach',
      status: 'pending',
      estimated_impact: 'High - Qualified prospect with strong buying signals',
      execution_steps: {
        steps: [
          'Research company background and recent news',
          'Personalize outreach message based on keywords and intent signals',
          'Send initial connection request with value proposition',
          'Follow up within 24 hours with relevant case study'
        ]
      },
      related_entities: { 
        lead_id: lead.id, 
        intent_score: leadData.intent_score,
        keywords: leadData.keywords 
      },
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }));
  }

  // Create research tasks based on company profile
  if (leadData.enrichment_data?.company_size) {
    tasks.push(await createTask({
      title: `Company Research: ${lead.company}`,
      description: `Deep dive research on ${lead.company} - ${leadData.enrichment_data.company_size} employees, ${leadData.enrichment_data.revenue_estimate} revenue`,
      priority: 3,
      category: 'research',
      status: 'pending',
      estimated_impact: 'Medium - Better qualification and personalization',
      execution_steps: {
        steps: [
          'Review company website and recent press releases',
          'Check LinkedIn for key decision makers',
          'Analyze competitor landscape in their industry',
          'Identify potential pain points and use cases'
        ]
      },
      related_entities: { 
        lead_id: lead.id,
        company_data: leadData.enrichment_data
      },
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
    }));
  }

  // Create nurturing tasks for medium intent leads
  if (leadData.intent_score >= 70 && leadData.intent_score < 85) {
    tasks.push(await createTask({
      title: `Lead Nurturing: ${lead.name}`,
      description: `Nurture medium-intent lead with relevant content. Focus areas: ${leadData.keywords.slice(0, 2).join(', ')}`,
      priority: 2,
      category: 'nurturing',
      status: 'pending',
      estimated_impact: 'Medium - Build relationship and increase intent',
      execution_steps: {
        steps: [
          'Send relevant industry report or whitepaper',
          'Invite to upcoming webinar or demo',
          'Share case study from similar company',
          'Schedule follow-up in 1 week'
        ]
      },
      related_entities: { 
        lead_id: lead.id,
        nurturing_focus: leadData.keywords
      },
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days
    }));
  }

  return tasks;
}

// Real-time lead scoring updates based on activity
export async function updateLeadScore(leadId: string, activityData: {
  activity_type: 'website_visit' | 'email_engagement' | 'content_download' | 'demo_request';
  activity_details: Record<string, any>;
}) {
  try {
    // Get current lead
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead) return;

    // Calculate score adjustment based on activity
    let scoreAdjustment = 0;
    
    switch (activityData.activity_type) {
      case 'website_visit':
        scoreAdjustment = activityData.activity_details.pages_visited > 3 ? 5 : 2;
        break;
      case 'email_engagement':
        scoreAdjustment = activityData.activity_details.clicked ? 8 : 3;
        break;
      case 'content_download':
        scoreAdjustment = 10;
        break;
      case 'demo_request':
        scoreAdjustment = 15;
        break;
    }

    const newScore = Math.min(100, (lead.intent_score || 0) + scoreAdjustment);
    
    // Update lead score
    await updateLeadStatus(leadId, lead.status);
    
    // Add journey stage for the activity
    await addJourneyStage({
      lead_id: leadId,
      stage: 'touchpoint',
      stage_data: {
        activity_type: activityData.activity_type,
        activity_details: activityData.activity_details,
        score_change: scoreAdjustment,
        new_score: newScore,
        timestamp: new Date().toISOString()
      },
      sequence_order: Date.now() // Use timestamp as sequence
    });

    // Generate new tasks if score crosses threshold
    if (newScore >= 85 && (lead.intent_score || 0) < 85) {
      await createTask({
        title: `Score Alert: ${lead.name} reached high intent (${newScore})`,
        description: `Lead score increased to ${newScore} due to ${activityData.activity_type}. Immediate attention required.`,
        priority: 5,
        category: 'alert',
        status: 'pending',
        estimated_impact: 'Critical - Hot lead requires immediate action',
        related_entities: { 
          lead_id: leadId,
          trigger_activity: activityData.activity_type,
          score_change: scoreAdjustment
        },
        due_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
      });
    }

    return newScore;
  } catch (error) {
    console.error('Error updating lead score:', error);
    throw error;
  }
}

// Cross-platform lead matching and deduplication
export async function matchAndDeduplicateLeads(newLead: EnhancedLead) {
  const { data: existingLeads, error } = await supabase
    .from('leads')
    .select('*')
    .or(`email.eq.${newLead.email},phone.eq.${newLead.phone}`);

  if (error || !existingLeads?.length) {
    return { isDuplicate: false, matchedLead: null };
  }

  const matchedLead = existingLeads[0];
  
  // Enhance existing lead with new data
  const enhancedEnrichment = {
    ...matchedLead.enrichment_data,
    ...newLead.enrichment_data,
    sources: [
      ...(matchedLead.enrichment_data?.sources || []),
      newLead.source
    ],
    last_updated: new Date().toISOString()
  };

  // Update lead with enhanced data
  await supabase
    .from('leads')
    .update({ 
      enrichment_data: enhancedEnrichment,
      intent_score: Math.max(matchedLead.intent_score || 0, newLead.intent_score),
      tags: [...new Set([...(matchedLead.tags || []), ...newLead.keywords])],
      updated_at: new Date().toISOString()
    })
    .eq('id', matchedLead.id);

  return { isDuplicate: true, matchedLead: matchedLead };
}
