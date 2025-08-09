
import { supabase } from "@/integrations/supabase/client";
import { EnhancedLead } from "./specterNetIntegration";

// Lead Source Types
export type LeadSourceType = 'job_boards' | 'forums' | 'review_sites' | 'social_platforms' | 'industry_publications' | 'google_trends';

// Intent Signal Detection
export interface IntentSignal {
  id: string;
  source: LeadSourceType;
  content: string;
  keywords: string[];
  urgency_score: number;
  detected_at: string;
  raw_data: Record<string, any>;
}

// Lead Enrichment Data
export interface LeadEnrichmentData {
  contact_info: {
    email?: string;
    phone?: string;
    linkedin_url?: string;
    company_email_pattern?: string;
  };
  firmographics: {
    company_size: string;
    revenue_estimate: string;
    industry_sector: string;
    tech_stack: string[];
    funding_stage?: string;
  };
  behavioral_data: {
    engagement_history: string[];
    content_preferences: string[];
    communication_style: string;
  };
}

// Auto-Generated Pitch
export interface AutoPitch {
  id: string;
  lead_id: string;
  subject_lines: string[];
  opening_hooks: string[];
  pain_point_references: string[];
  value_propositions: string[];
  cta_options: string[];
  personalization_tokens: Record<string, string>;
  engagement_score: number;
  created_at: string;
}

// Live Keyword & Intent Monitoring
export async function scanForIntentSignals(keywords: string[], geoTargets: string[]): Promise<IntentSignal[]> {
  console.log('🔍 Scanning for intent signals across multiple sources...');
  
  const sources: LeadSourceType[] = [
    'job_boards',
    'forums', 
    'review_sites',
    'social_platforms',
    'industry_publications',
    'google_trends'
  ];
  
  const signals: IntentSignal[] = [];
  
  for (const source of sources) {
    const sourceSignals = await scanSource(source, keywords, geoTargets);
    signals.push(...sourceSignals);
  }
  
  // Sort by urgency score and recency
  return signals.sort((a, b) => {
    const urgencyDiff = b.urgency_score - a.urgency_score;
    if (urgencyDiff !== 0) return urgencyDiff;
    return new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime();
  });
}

async function scanSource(source: LeadSourceType, keywords: string[], geoTargets: string[]): Promise<IntentSignal[]> {
  // Mock implementation - in real app would use specific APIs for each source
  const mockSignals: IntentSignal[] = [];
  
  const sourceConfigs = {
    job_boards: {
      urgency_multiplier: 0.9,
      common_phrases: ['hiring for', 'looking for', 'need someone with', 'seeking candidate']
    },
    forums: {
      urgency_multiplier: 0.7,
      common_phrases: ['help with', 'recommendations for', 'best solution', 'anyone know']
    },
    review_sites: {
      urgency_multiplier: 0.8,
      common_phrases: ['considering', 'comparing', 'reviews of', 'alternatives to']
    },
    social_platforms: {
      urgency_multiplier: 0.6,
      common_phrases: ['thoughts on', 'experience with', 'advice needed', 'suggestions']
    },
    industry_publications: {
      urgency_multiplier: 0.5,
      common_phrases: ['market trends', 'industry analysis', 'vendor comparison']
    },
    google_trends: {
      urgency_multiplier: 0.8,
      common_phrases: ['vs', 'pricing', 'cost of', 'how to choose']
    }
  };
  
  const config = sourceConfigs[source];
  const signalCount = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < signalCount; i++) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const geoTarget = geoTargets[Math.floor(Math.random() * geoTargets.length)];
    const phrase = config.common_phrases[Math.floor(Math.random() * config.common_phrases.length)];
    
    mockSignals.push({
      id: `signal_${source}_${Date.now()}_${i}`,
      source,
      content: `${phrase} ${keyword} in ${geoTarget}`,
      keywords: [keyword],
      urgency_score: (Math.random() * 0.4 + 0.6) * config.urgency_multiplier,
      detected_at: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
      raw_data: {
        geo_target: geoTarget,
        source_url: `https://${source}-example.com/post/${i}`,
        context: `User discussing ${keyword} solutions`
      }
    });
  }
  
  return mockSignals;
}

// Lead Enrichment & Scoring
export async function enrichLead(leadId: string, intentSignals: IntentSignal[]): Promise<LeadEnrichmentData> {
  console.log('📊 Enriching lead with firmographic and behavioral data...');
  
  // Mock enrichment - in real app would use data providers like ZoomInfo, Clearbit, etc.
  const enrichmentData: LeadEnrichmentData = {
    contact_info: {
      email: `contact_${leadId}@company.com`,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      linkedin_url: `https://linkedin.com/in/prospect-${leadId}`,
      company_email_pattern: '@company.com'
    },
    firmographics: {
      company_size: ['10-50', '50-200', '200-1000', '1000+'][Math.floor(Math.random() * 4)],
      revenue_estimate: ['$1M-5M', '$5M-25M', '$25M-100M', '$100M+'][Math.floor(Math.random() * 4)],
      industry_sector: ['Technology', 'Healthcare', 'Finance', 'Manufacturing'][Math.floor(Math.random() * 4)],
      tech_stack: ['Salesforce', 'HubSpot', 'Microsoft Office', 'Slack', 'Zoom'],
      funding_stage: ['Seed', 'Series A', 'Series B', 'Growth'][Math.floor(Math.random() * 4)]
    },
    behavioral_data: {
      engagement_history: [
        'Visited website 3 times this week',
        'Downloaded whitepaper on competitive analysis',
        'Attended industry webinar last month'
      ],
      content_preferences: ['case studies', 'product demos', 'ROI calculators'],
      communication_style: ['professional', 'data-driven', 'results-focused'][Math.floor(Math.random() * 3)]
    }
  };
  
  return enrichmentData;
}

export function calculateLeadScore(lead: EnhancedLead, intentSignals: IntentSignal[], enrichmentData: LeadEnrichmentData): number {
  let score = 0;
  
  // Intent recency (40% weight)
  const mostRecentSignal = intentSignals.reduce((latest, signal) => 
    new Date(signal.detected_at) > new Date(latest.detected_at) ? signal : latest
  );
  const hoursSinceLatest = (Date.now() - new Date(mostRecentSignal.detected_at).getTime()) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 100 - hoursSinceLatest * 2); // Decay over time
  score += recencyScore * 0.4;
  
  // Geographic fit (20% weight)
  const geoScore = lead.geo_context.state ? 100 : 50; // Full score if state matches
  score += geoScore * 0.2;
  
  // Firmographic fit (25% weight)
  let firmographicScore = 0;
  if (enrichmentData.firmographics.company_size === '200-1000' || enrichmentData.firmographics.company_size === '1000+') {
    firmographicScore += 40;
  }
  if (enrichmentData.firmographics.revenue_estimate.includes('25M') || enrichmentData.firmographics.revenue_estimate.includes('100M')) {
    firmographicScore += 35;
  }
  firmographicScore += 25; // Base score
  score += firmographicScore * 0.25;
  
  // Intent signal strength (15% weight)
  const avgUrgency = intentSignals.reduce((sum, signal) => sum + signal.urgency_score, 0) / intentSignals.length;
  score += avgUrgency * 100 * 0.15;
  
  return Math.min(100, Math.max(0, score));
}

// Auto-Pitch Generation
export async function generateAutoPitch(lead: EnhancedLead, intentSignals: IntentSignal[], enrichmentData: LeadEnrichmentData): Promise<AutoPitch> {
  console.log('✍️ Generating personalized pitch for lead...');
  
  const dominantIntent = intentSignals[0]; // Highest priority signal
  const painPoint = extractPainPoint(dominantIntent.content);
  const industry = enrichmentData.firmographics.industry_sector;
  const companySize = enrichmentData.firmographics.company_size;
  
  const pitch: AutoPitch = {
    id: `pitch_${lead.id}_${Date.now()}`,
    lead_id: lead.id,
    subject_lines: generateSubjectLines(lead.name || 'there', painPoint, industry),
    opening_hooks: generateOpeningHooks(dominantIntent, lead.company || 'your company'),
    pain_point_references: generatePainPointReferences(painPoint, intentSignals),
    value_propositions: generateValuePropositions(industry, companySize),
    cta_options: generateCTAOptions(),
    personalization_tokens: {
      '{first_name}': lead.name?.split(' ')[0] || 'there',
      '{company}': lead.company || 'your company',
      '{pain_point}': painPoint,
      '{industry}': industry,
      '{company_size}': companySize,
      '{location}': `${lead.geo_context.city}, ${lead.geo_context.state}`
    },
    engagement_score: calculateEngagementScore(lead, intentSignals),
    created_at: new Date().toISOString()
  };
  
  return pitch;
}

function extractPainPoint(content: string): string {
  const painPoints = [
    'lead generation challenges',
    'competitive intelligence gaps',
    'marketing automation inefficiencies',
    'customer acquisition costs',
    'pipeline visibility issues'
  ];
  
  // Simple keyword matching - in real app would use NLP
  for (const pain of painPoints) {
    if (content.toLowerCase().includes(pain.split(' ')[0])) {
      return pain;
    }
  }
  
  return 'operational efficiency challenges';
}

function generateSubjectLines(name: string, painPoint: string, industry: string): string[] {
  return [
    `${name}, solving ${painPoint} for ${industry} companies`,
    `Quick question about your ${painPoint.split(' ')[0]} strategy`,
    `How [Similar Company] cut ${painPoint} by 40%`,
    `${name}, noticed you're evaluating solutions for ${painPoint}`,
    `5-minute solution to your ${painPoint}`
  ];
}

function generateOpeningHooks(intentSignal: IntentSignal, company: string): string[] {
  return [
    `I noticed your recent interest in ${intentSignal.keywords[0]} solutions...`,
    `Saw that ${company} is exploring options for ${intentSignal.keywords[0]}`,
    `Quick question - are you still evaluating ${intentSignal.keywords[0]} providers?`,
    `I came across your ${intentSignal.source.replace('_', ' ')} post about ${intentSignal.keywords[0]}`,
    `Many ${company} teams are facing similar challenges with ${intentSignal.keywords[0]}`
  ];
}

function generatePainPointReferences(painPoint: string, signals: IntentSignal[]): string[] {
  return [
    `Like many companies, you're probably dealing with ${painPoint}`,
    `The ${painPoint} you mentioned is exactly what we specialize in`,
    `We've helped 200+ companies overcome ${painPoint}`,
    `Your timing is perfect - we just released a solution for ${painPoint}`,
    `I understand how frustrating ${painPoint} can be for growing teams`
  ];
}

function generateValuePropositions(industry: string, companySize: string): string[] {
  return [
    `Specifically built for ${companySize} ${industry} companies`,
    `Reduce implementation time by 70% compared to traditional solutions`,
    `ROI typically seen within 30 days of deployment`,
    `Used by industry leaders like [Similar Company] and [Another Company]`,
    `No lengthy contracts - see results in your first week`
  ];
}

function generateCTAOptions(): string[] {
  return [
    'Worth a 15-minute conversation?',
    'Can I send you a quick case study?',
    'Would a 5-minute demo be helpful?',
    'Should I send over our ROI calculator?',
    'Quick call to discuss your specific situation?'
  ];
}

function calculateEngagementScore(lead: EnhancedLead, signals: IntentSignal[]): number {
  let score = lead.intent_score;
  
  // Boost for multiple signals
  score += signals.length * 5;
  
  // Boost for recent activity
  const recentSignals = signals.filter(s => 
    new Date(s.detected_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
  );
  score += recentSignals.length * 10;
  
  return Math.min(100, score);
}
