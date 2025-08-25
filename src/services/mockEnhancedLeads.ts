
import type { EnhancedLead } from './specterNetIntegration';

export const getMockEnhancedLeadsWithUserId = (userId: string): EnhancedLead[] => [
  {
    id: 'lead-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techstartup.com',
    company: 'TechStartup Inc',
    title: 'Marketing Director',
    phone: '+1-555-0123',
    location_city: 'San Francisco',
    location_state: 'CA',
    location_zip: '94105',
    intent_score: 85,
    source: 'website_form',
    source_data: {
      utm_source: 'google',
      utm_medium: 'cpc',
      landing_page: '/competitive-analysis'
    },
    enrichment_data: {
      company_size: '50-200',
      industry: 'SaaS',
      funding_stage: 'Series A'
    },
    status: 'qualified',
    tags: ['high-intent', 'competitor-research'],
    notes: 'Actively researching competitive intelligence tools',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: userId,
    intent_keywords: ['competitive analysis', 'market research'],
    geo_context: {
      market_size: 'Large',
      competition_level: 'High',
      local_trends: ['AI/ML adoption', 'Remote work tools'],
      city: 'San Francisco',
      state: 'CA',
      zip: '94105'
    },
    urgency_score: 92,
    last_search_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    search_patterns: ['competitor pricing', 'feature comparison', 'user reviews']
  },
  {
    id: 'lead-2',
    name: 'Michael Rodriguez',
    email: 'mike@growthagency.co',
    company: 'Growth Agency Co',
    title: 'Head of Growth',
    phone: '+1-555-0124',
    location_city: 'Austin',
    location_state: 'TX',
    location_zip: '78701',
    intent_score: 78,
    source: 'linkedin_outreach',
    source_data: {
      campaign_id: 'linkedin_001',
      message_thread: 'thread_456'
    },
    enrichment_data: {
      company_size: '10-50',
      industry: 'Digital Marketing',
      annual_revenue: '$1M-5M'
    },
    status: 'nurturing',
    tags: ['warm-lead', 'agency'],
    notes: 'Interested in white-label solutions',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: userId,
    intent_keywords: ['white label', 'agency tools'],
    geo_context: {
      market_size: 'Medium',
      competition_level: 'Medium',
      local_trends: ['Tech hub growth', 'Startup ecosystem'],
      city: 'Austin',
      state: 'TX',
      zip: '78701'
    },
    urgency_score: 65,
    last_search_activity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    search_patterns: ['white label solutions', 'API documentation', 'pricing tiers']
  }
];

// Updated AutoPitch interface to match component usage
export interface AutoPitch {
  id: string;
  lead_id: string;
  created_at: string;
  subject_line: string;
  opening_hook: string;
  pain_point_reference: string;
  solution_positioning: string;
  social_proof: string;
  cta: string;
  personalization_tokens: {
    company_name: string;
    industry: string;
    pain_points: string[];
    competitors: string[];
  };
  engagement_score: number;
  // Legacy plural versions for backwards compatibility
  subject_lines: string[];
  opening_hooks: string[];
  pain_point_references: string[];
  value_propositions: string[];
  cta_options: string[];
}

export const getMockAutoPitchWithUserId = (leadId: string, userId: string): AutoPitch => ({
  id: `pitch-${leadId}`,
  lead_id: leadId,
  created_at: new Date().toISOString(),
  subject_line: 'Quick question about your competitive analysis workflow',
  opening_hook: 'Hi {company_name}, I noticed you\'ve been researching competitive intelligence tools...',
  pain_point_reference: 'Most marketing teams struggle with getting real-time competitor insights',
  solution_positioning: 'Our platform provides live competitor tracking that updates every hour',
  social_proof: 'Companies like TechCorp increased their market share by 23% using our intel',
  cta: 'Would you be interested in a 15-minute demo this week?',
  personalization_tokens: {
    company_name: 'TechStartup Inc',
    industry: 'SaaS',
    pain_points: ['Manual competitor research', 'Outdated data', 'Time-consuming analysis'],
    competitors: ['SimilarWeb', 'SEMrush', 'Ahrefs']
  },
  engagement_score: 87,
  // Legacy plural versions for backwards compatibility
  subject_lines: ['Quick question about your competitive analysis workflow'],
  opening_hooks: ['Hi {company_name}, I noticed you\'ve been researching competitive intelligence tools...'],
  pain_point_references: ['Most marketing teams struggle with getting real-time competitor insights'],
  value_propositions: ['Our platform provides live competitor tracking that updates every hour'],
  cta_options: ['Would you be interested in a 15-minute demo this week?']
});
