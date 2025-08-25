
import type { EnhancedLead } from './specterNet';

export const getMockEnhancedLeads = (): EnhancedLead[] => [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    company: 'TechCorp Solutions',
    title: 'VP Marketing',
    phone: '+1 (555) 123-4567',
    location_city: 'San Francisco',
    location_state: 'CA',
    location_zip: '94105',
    intent_score: 92,
    source: 'ad_signal_hijack',
    source_data: {
      competitor_ad_engagement: 'high',
      ad_platform: 'Facebook',
      engagement_type: 'click_through'
    },
    enrichment_data: {
      company_size: '500-1000',
      industry: 'Technology',
      annual_revenue: '$50M-$100M',
      technologies_used: ['HubSpot', 'Salesforce', 'Google Analytics']
    },
    status: 'qualified',
    tags: ['high-intent', 'enterprise', 'competitor-engaged'],
    notes: 'Engaged with competitor Facebook ad, showing strong buying signals',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T14:45:00Z',
    user_id: 'system-user-id'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'mrodriguez@growthstartup.io',
    company: 'GrowthStartup Inc',
    title: 'CEO & Founder',
    phone: '+1 (555) 987-6543',
    location_city: 'Austin',
    location_state: 'TX',
    location_zip: '78701',
    intent_score: 87,
    source: 'lead_locator',
    source_data: {
      search_keywords: ['competitive intelligence', 'market analysis'],
      website_behavior: 'pricing_page_visit',
      session_duration: '8m 32s'
    },
    enrichment_data: {
      company_size: '50-100',
      industry: 'SaaS',
      annual_revenue: '$5M-$10M',
      technologies_used: ['Stripe', 'Intercom', 'Mixpanel']
    },
    status: 'contacted',
    tags: ['startup', 'saas', 'high-growth'],
    notes: 'Visited pricing page multiple times, requested demo',
    created_at: '2025-01-14T16:20:00Z',
    updated_at: '2025-01-15T09:15:00Z',
    user_id: 'system-user-id'
  }
];

export const getMockEnhancedLeadsWithUserId = (userId: string): EnhancedLead[] => {
  return getMockEnhancedLeads().map(lead => ({
    ...lead,
    user_id: userId
  }));
};
