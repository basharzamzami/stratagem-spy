
import { useMemo } from 'react';
import { EnhancedLead } from '@/services/specterNetIntegration';

export const useMockLeads = (leads: EnhancedLead[]): EnhancedLead[] => {
  return useMemo(() => {
    if (leads.length > 0) return leads;
    
    return [
      {
        id: 'lead_1',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        company: 'TechCorp Solutions',
        title: 'VP of Marketing',
        phone: '(555) 123-4567',
        location_city: 'San Francisco',
        location_state: 'CA',
        location_zip: '94105',
        intent_score: 92,
        source: 'intent_detection',
        source_data: { detection_method: 'keyword_scanning', confidence_score: 0.89 },
        enrichment_data: {},
        status: 'active',
        tags: ['warm_lead', 'high_intent'],
        notes: 'Actively researching marketing automation tools',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'mock-user-id',
        intent_keywords: ['marketing automation', 'lead scoring', 'crm integration'],
        search_patterns: ['vs competitor', 'pricing comparison', 'free trial'],
        competitor_references: ['HubSpot', 'Marketo'],
        urgency_score: 88,
        last_search_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        geo_context: {
          market_size: 'Large',
          competition_level: 'High',
          local_trends: ['SaaS growth', 'Digital transformation'],
          city: 'San Francisco',
          state: 'CA',
          zip: '94105'
        }
      },
      {
        id: 'lead_2',
        name: 'Michael Rodriguez',
        email: 'm.rodriguez@healthplus.com',
        company: 'HealthPlus Medical',
        title: 'Director of Operations',
        phone: '(555) 987-6543',
        location_city: 'Austin',
        location_state: 'TX',
        location_zip: '78701',
        intent_score: 85,
        source: 'intent_detection',
        source_data: { detection_method: 'social_listening', confidence_score: 0.82 },
        enrichment_data: {},
        status: 'active',
        tags: ['warm_lead', 'healthcare'],
        notes: 'Looking for patient management solutions',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'mock-user-id',
        intent_keywords: ['patient management', 'healthcare crm', 'appointment scheduling'],
        search_patterns: ['best healthcare software', 'patient engagement tools'],
        competitor_references: ['Epic'],
        urgency_score: 79,
        last_search_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        geo_context: {
          market_size: 'Medium',
          competition_level: 'Medium',
          local_trends: ['Healthcare tech', 'Patient experience'],
          city: 'Austin',
          state: 'TX',
          zip: '78701'
        }
      },
      {
        id: 'lead_3',
        name: 'Amanda Foster',
        email: 'a.foster@realestatepro.com',
        company: 'RealEstate Pro',
        title: 'Sales Manager',
        phone: '(555) 456-7890',
        location_city: 'Miami',
        location_state: 'FL',
        location_zip: '33101',
        intent_score: 78,
        source: 'intent_detection',
        source_data: { detection_method: 'web_tracking', confidence_score: 0.75 },
        enrichment_data: {},
        status: 'active',
        tags: ['warm_lead', 'real_estate'],
        notes: 'Researching lead generation tools for real estate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'mock-user-id',
        intent_keywords: ['real estate leads', 'property management', 'client tracking'],
        search_patterns: ['real estate crm', 'lead generation'],
        competitor_references: ['Zillow'],
        urgency_score: 72,
        last_search_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        geo_context: {
          market_size: 'Large',
          competition_level: 'High',
          local_trends: ['Real estate boom', 'PropTech growth'],
          city: 'Miami',
          state: 'FL',
          zip: '33101'
        }
      }
    ];
  }, [leads]);
};
