
import { EnhancedLead } from './specterNetIntegration';

const baseMockEnhancedLeads = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techstartup.com',
    company: 'TechStartup Inc',
    title: 'VP of Marketing',
    phone: '+1-555-0123',
    location_city: 'Miami',
    location_state: 'FL',
    location_zip: '33101',
    intent_score: 87,
    source: 'organic_search',
    source_data: {
      search_queries: ['marketing automation tools', 'competitor analysis software'],
      pages_visited: ['/pricing', '/features', '/competitors'],
      time_on_site: 420
    },
    enrichment_data: {
      company_size: '50-200',
      industry: 'SaaS',
      tech_stack: ['HubSpot', 'Salesforce', 'Google Analytics']
    },
    status: 'qualified',
    tags: ['high-intent', 'decision-maker', 'budget-confirmed'],
    notes: 'Interested in competitive intelligence features',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    intent_keywords: ['marketing automation', 'competitor analysis'],
    geo_context: {
      market_size: 'Large',
      competition_level: 'High',
      local_trends: ['SaaS growth', 'Digital transformation'],
      city: 'Miami',
      state: 'FL'
    },
    urgency_score: 85,
    last_search_activity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    search_patterns: ['pricing comparison', 'feature analysis', 'competitor research']
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'mrodriguez@growthco.io',
    company: 'GrowthCo',
    title: 'Growth Manager',
    phone: '+1-555-0124',
    location_city: 'Austin',
    location_state: 'TX',
    location_zip: '78701',
    intent_score: 92,
    source: 'paid_search',
    source_data: {
      ad_clicked: 'competitive-intelligence-ad',
      campaign: 'SaaS-Tools-Q4',
      keyword: 'competitor tracking software'
    },
    enrichment_data: {
      company_size: '200-500',
      industry: 'E-commerce',
      annual_revenue: '$10M-50M'
    },
    status: 'hot',
    tags: ['high-intent', 'competitor-mentioned', 'demo-requested'],
    notes: 'Actively comparing solutions, mentioned HubSpot in demo request',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    intent_keywords: ['competitor tracking', 'market intelligence'],
    geo_context: {
      market_size: 'Medium',
      competition_level: 'Medium',
      local_trends: ['E-commerce growth', 'Tech adoption'],
      city: 'Austin',
      state: 'TX'
    },
    urgency_score: 92,
    last_search_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    search_patterns: ['solution comparison', 'pricing research', 'vendor evaluation']
  },
  {
    id: '3',
    name: 'Jessica Thompson',
    email: 'jthompson@marketingpro.com',
    company: 'MarketingPro Agency',
    title: 'Director of Client Services',
    phone: '+1-555-0125',
    location_city: 'Seattle',
    location_state: 'WA',
    location_zip: '98101',
    intent_score: 78,
    source: 'referral',
    source_data: {
      referrer: 'industry_partner',
      referral_code: 'PARTNER2024'
    },
    enrichment_data: {
      company_size: '20-50',
      industry: 'Marketing Agency',
      client_count: '15-25'
    },
    status: 'nurturing',
    tags: ['agency', 'multi-client', 'white-label-interest'],
    notes: 'Looking for white-label competitive intelligence solution',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    intent_keywords: ['white-label', 'agency solutions'],
    geo_context: {
      market_size: 'Large',
      competition_level: 'High',
      local_trends: ['Agency consolidation', 'Tech integration'],
      city: 'Seattle',
      state: 'WA'
    },
    urgency_score: 65,
    last_search_activity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    search_patterns: ['white-label solutions', 'agency tools', 'client reporting']
  }
];

export const getMockEnhancedLeadsWithUserId = (userId: string): EnhancedLead[] => {
  return baseMockEnhancedLeads.map(lead => ({
    ...lead,
    user_id: userId
  }));
};

export const mockEnhancedLeads = baseMockEnhancedLeads;
