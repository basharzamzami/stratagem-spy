export interface IntentSignal {
  id: string;
  type: 'search' | 'content_engagement' | 'competitor_mention' | 'pricing_inquiry' | 'demo_request';
  keywords: string[];
  strength: number; // 0-100
  timestamp: string;
  source: string;
  context: Record<string, any>;
}

export interface LeadEnrichmentData {
  social_profiles: {
    linkedin?: string;
    twitter?: string;
  };
  company_data: {
    employee_count?: number;
    industry?: string;
    revenue_range?: string;
    tech_stack?: string[];
  };
  behavioral_data: {
    page_views: number;
    time_on_site: number;
    downloads: number;
    email_opens: number;
  };
  competitor_intelligence: {
    current_tools: string[];
    pain_points: string[];
    buying_timeline: string;
  };
}

export interface AutoPitch {
  id: string;
  lead_id: string;
  subject_line: string;
  opening_hook: string;
  pain_point_reference: string;
  solution_positioning: string;
  social_proof: string;
  call_to_action: string;
  personalization_score: number;
  expected_response_rate: number;
  generated_at: string;
}

// Mock functions for warm lead prospecting
export const scanForIntentSignals = async (
  keywords: string[],
  geoTargets: string[]
): Promise<IntentSignal[]> => {
  console.log('Scanning for intent signals:', { keywords, geoTargets });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockSignals: IntentSignal[] = [
    {
      id: 'signal_1',
      type: 'search',
      keywords: ['marketing automation', 'competitor analysis'],
      strength: 85,
      timestamp: new Date().toISOString(),
      source: 'google_ads',
      context: {
        query: 'best marketing automation with competitor tracking',
        location: 'Miami, FL',
        device: 'desktop'
      }
    },
    {
      id: 'signal_2',
      type: 'competitor_mention',
      keywords: ['hubspot alternative', 'salesforce competitor'],
      strength: 92,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: 'social_listening',
      context: {
        platform: 'twitter',
        mention: 'Looking for a HubSpot alternative that does better competitor analysis',
        engagement: 15
      }
    },
    {
      id: 'signal_3',
      type: 'pricing_inquiry',
      keywords: ['competitive intelligence pricing', 'market analysis cost'],
      strength: 78,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: 'website_behavior',
      context: {
        pages: ['/pricing', '/compare', '/features'],
        time_spent: 320,
        downloads: ['pricing-guide.pdf']
      }
    }
  ];
  
  return mockSignals;
};

export const enrichLead = async (
  leadId: string,
  intentSignals: IntentSignal[]
): Promise<LeadEnrichmentData> => {
  console.log(`Enriching lead ${leadId} with ${intentSignals.length} intent signals`);
  
  // Simulate enrichment API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const enrichmentData: LeadEnrichmentData = {
    social_profiles: {
      linkedin: 'https://linkedin.com/in/sarah-chen-marketing',
      twitter: '@sarahchen_mktg'
    },
    company_data: {
      employee_count: 150,
      industry: 'SaaS',
      revenue_range: '$10M-50M',
      tech_stack: ['HubSpot', 'Salesforce', 'Google Analytics', 'Mixpanel']
    },
    behavioral_data: {
      page_views: 12,
      time_on_site: 420,
      downloads: 3,
      email_opens: 8
    },
    competitor_intelligence: {
      current_tools: ['HubSpot', 'SimilarWeb'],
      pain_points: ['Limited real-time data', 'Expensive pricing', 'Poor competitor insights'],
      buying_timeline: 'Next 30 days'
    }
  };
  
  return enrichmentData;
};

export const calculateLeadScore = (
  lead: any,
  intentSignals: IntentSignal[],
  enrichmentData: LeadEnrichmentData
): number => {
  let score = lead.intent_score || 50;
  
  // Boost score based on intent signals
  const avgSignalStrength = intentSignals.reduce((sum, signal) => sum + signal.strength, 0) / intentSignals.length;
  score += (avgSignalStrength - 50) * 0.3;
  
  // Boost score based on behavioral data
  if (enrichmentData.behavioral_data.page_views > 10) score += 10;
  if (enrichmentData.behavioral_data.downloads > 2) score += 15;
  if (enrichmentData.behavioral_data.email_opens > 5) score += 8;
  
  // Boost score based on buying timeline
  if (enrichmentData.competitor_intelligence.buying_timeline === 'Next 30 days') score += 20;
  else if (enrichmentData.competitor_intelligence.buying_timeline === 'Next 90 days') score += 10;
  
  return Math.min(100, Math.max(0, Math.round(score)));
};

export const generateAutoPitch = async (
  lead: any,
  intentSignals: IntentSignal[],
  enrichmentData: LeadEnrichmentData
): Promise<AutoPitch> => {
  console.log(`Generating auto-pitch for lead ${lead.id}`);
  
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentTools = enrichmentData.competitor_intelligence.current_tools.join(', ');
  const painPoints = enrichmentData.competitor_intelligence.pain_points.join(', ');
  const city = lead.geo_context?.city || lead.location_city;
  const state = lead.geo_context?.state || lead.location_state;
  
  const autoPitch: AutoPitch = {
    id: `pitch_${lead.id}_${Date.now()}`,
    lead_id: lead.id,
    subject_line: `${lead.name}, spotted you researching ${currentTools} alternatives in ${city}`,
    opening_hook: `Hi ${lead.name.split(' ')[0]}, I noticed ${lead.company} has been actively researching competitive intelligence solutions.`,
    pain_point_reference: `I see you're currently using ${currentTools}. Based on recent industry feedback, many ${lead.title}s mention challenges with ${painPoints.toLowerCase()}.`,
    solution_positioning: `That's exactly why we built Specter Insights differently. While ${currentTools.split(',')[0]} gives you outdated snapshots, we provide real-time competitor intelligence that actually drives revenue.`,
    social_proof: `Companies like TechCorp and GrowthLabs in ${city} switched to us and saw 40% better campaign performance within their first month.`,
    call_to_action: `Worth a 15-minute demo this week to show you live competitor data for your industry? I can even pull up what your competitors are doing right now in the ${state} market.`,
    personalization_score: 87,
    expected_response_rate: 23.5,
    generated_at: new Date().toISOString()
  };
  
  return autoPitch;
};
