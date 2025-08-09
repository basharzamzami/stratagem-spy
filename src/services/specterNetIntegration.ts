
import { supabase } from "@/integrations/supabase/client";
import { fetchLiveAds, SearchFilters } from "./adSignal";
import { fetchHighIntentLeads, createLead, Lead } from "./specterNet";

// Enhanced Lead with Intent Signals
export interface EnhancedLead extends Lead {
  intent_keywords: string[];
  search_patterns: string[];
  competitor_references: string[];
  urgency_score: number;
  last_search_activity: string;
  geo_context: {
    city: string;
    state: string;
    zip: string;
  };
}

// Competitor Ad Intelligence
export interface CompetitorAdIntel {
  competitor: string;
  winning_hooks: string[];
  common_ctas: string[];
  offer_patterns: string[];
  bid_intensity: number;
  ad_frequency: number;
  performance_score: number;
  target_keywords: string[];
  creative_angles: string[];
}

// Auto-Generated Campaign
export interface GeneratedCampaign {
  id: string;
  name: string;
  target_leads: EnhancedLead[];
  hijacked_competitors: string[];
  ad_variants: CampaignAdVariant[];
  targeting_config: TargetingConfig;
  budget_allocation: BudgetAllocation;
  performance_metrics: CampaignMetrics;
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
}

export interface CampaignAdVariant {
  id: string;
  headline: string;
  primary_text: string;
  cta: string;
  creative_url?: string;
  competitor_source: string;
  intent_keywords: string[];
  hijack_strategy: string;
  expected_ctr: number;
}

export interface TargetingConfig {
  geo_targets: string[];
  demographic_filters: Record<string, any>;
  intent_keywords: string[];
  competitor_audiences: string[];
  budget_bid_strategy: 'aggressive' | 'balanced' | 'conservative';
}

export interface BudgetAllocation {
  total_budget: number;
  daily_budget: number;
  keyword_bids: Record<string, number>;
  competitor_hijack_multiplier: number;
  intent_score_weighting: number;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
  roi: number;
}

// Real-time Lead Detection
export async function scanForWarmLeads(keywords: string[], geoTargets: string[]) {
  console.log('Scanning for warm leads with keywords:', keywords);
  
  // Simulate real-time lead detection from multiple sources
  const leadSources = [
    'google_trends',
    'job_boards', 
    'review_sites',
    'social_platforms',
    'forums',
    'industry_publications'
  ];

  const detectedLeads: EnhancedLead[] = [];

  for (const geo of geoTargets) {
    // Mock lead detection - in real implementation would use APIs
    const mockLeads = await generateMockWarmLeads(keywords, geo);
    detectedLeads.push(...mockLeads);
  }

  return detectedLeads.sort((a, b) => b.urgency_score - a.urgency_score);
}

async function generateMockWarmLeads(keywords: string[], geo: string): Promise<EnhancedLead[]> {
  const mockLeads: EnhancedLead[] = [];
  
  for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
    const lead: EnhancedLead = {
      id: `lead_${Date.now()}_${i}`,
      name: `Prospect ${i + 1}`,
      email: `prospect${i + 1}@company.com`,
      company: `${geo} Solutions Inc`,
      title: ['VP Marketing', 'Director Sales', 'CMO', 'Head of Growth'][Math.floor(Math.random() * 4)],
      phone: `(${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
      location_city: geo.split(',')[0],
      location_state: geo.split(',')[1]?.trim(),
      location_zip: `${Math.floor(Math.random() * 90000) + 10000}`,
      intent_score: Math.floor(Math.random() * 40) + 60, // 60-100 for warm leads
      source: 'intent_detection',
      source_data: {
        detection_method: 'keyword_scanning',
        confidence_score: Math.random() * 0.4 + 0.6
      },
      enrichment_data: {},
      status: 'active',
      tags: ['warm_lead', 'intent_detected'],
      notes: `Detected via ${keywords[Math.floor(Math.random() * keywords.length)]} search activity`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      intent_keywords: keywords.slice(0, Math.floor(Math.random() * 3) + 1),
      search_patterns: [
        'pricing comparison',
        'vs competitor',
        'best solution for',
        'alternatives to'
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      competitor_references: ['CompetitorA', 'CompetitorB'][Math.floor(Math.random() * 2)] ? ['CompetitorA'] : [],
      urgency_score: Math.floor(Math.random() * 30) + 70,
      last_search_activity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      geo_context: {
        city: geo.split(',')[0],
        state: geo.split(',')[1]?.trim() || '',
        zip: `${Math.floor(Math.random() * 90000) + 10000}`
      }
    };
    
    mockLeads.push(lead);
  }
  
  return mockLeads;
}

// Competitor Ad Intelligence Analysis
export async function analyzeCompetitorAdIntel(competitors: string[], keywords: string[]): Promise<CompetitorAdIntel[]> {
  console.log('Analyzing competitor ad intelligence for:', competitors);
  
  const filters: SearchFilters = {
    platforms: ['meta', 'google'],
    dateRange: { from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
  };

  const adData = await fetchLiveAds(filters);
  const competitorIntel: CompetitorAdIntel[] = [];

  for (const competitor of competitors) {
    const competitorAds = adData.ads.filter(ad => 
      ad.competitor_name.toLowerCase().includes(competitor.toLowerCase())
    );

    if (competitorAds.length > 0) {
      const intel: CompetitorAdIntel = {
        competitor,
        winning_hooks: extractWinningHooks(competitorAds),
        common_ctas: extractCommonCTAs(competitorAds),
        offer_patterns: extractOfferPatterns(competitorAds),
        bid_intensity: calculateBidIntensity(competitorAds),
        ad_frequency: competitorAds.length,
        performance_score: calculatePerformanceScore(competitorAds),
        target_keywords: keywords,
        creative_angles: extractCreativeAngles(competitorAds)
      };
      
      competitorIntel.push(intel);
    }
  }

  return competitorIntel;
}

function extractWinningHooks(ads: any[]): string[] {
  return ads.map(ad => ad.headline || ad.primary_text)
    .filter(Boolean)
    .slice(0, 5);
}

function extractCommonCTAs(ads: any[]): string[] {
  return [...new Set(ads.map(ad => ad.cta).filter(Boolean))];
}

function extractOfferPatterns(ads: any[]): string[] {
  const patterns = ['free trial', 'discount', 'demo', 'consultation', 'guarantee'];
  return patterns.filter(pattern => 
    ads.some(ad => 
      (ad.headline?.toLowerCase().includes(pattern) || 
       ad.primary_text?.toLowerCase().includes(pattern))
    )
  );
}

function calculateBidIntensity(ads: any[]): number {
  return Math.min(ads.length / 10, 1) * 100;
}

function calculatePerformanceScore(ads: any[]): number {
  return Math.floor(Math.random() * 40) + 60; // Mock score 60-100
}

function extractCreativeAngles(ads: any[]): string[] {
  return ['problem-solution', 'competitor-comparison', 'social-proof', 'urgency', 'value-proposition'];
}

// Campaign Generation
export async function generateHijackCampaigns(
  leads: EnhancedLead[],
  competitorIntel: CompetitorAdIntel[],
  budget: number
): Promise<GeneratedCampaign[]> {
  console.log('Generating hijack campaigns for', leads.length, 'leads');
  
  const campaigns: GeneratedCampaign[] = [];
  
  // Group leads by geographic and intent similarity
  const leadGroups = groupLeadsByContext(leads);
  
  for (const [groupKey, groupLeads] of Object.entries(leadGroups)) {
    const campaign: GeneratedCampaign = {
      id: `campaign_${Date.now()}_${groupKey}`,
      name: `Hijack Campaign - ${groupKey}`,
      target_leads: groupLeads,
      hijacked_competitors: competitorIntel.map(c => c.competitor),
      ad_variants: generateAdVariants(groupLeads, competitorIntel),
      targeting_config: generateTargetingConfig(groupLeads, competitorIntel),
      budget_allocation: generateBudgetAllocation(budget / Object.keys(leadGroups).length, groupLeads),
      performance_metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        ctr: 0,
        cpc: 0,
        conversion_rate: 0,
        roi: 0
      },
      status: 'draft',
      created_at: new Date().toISOString()
    };
    
    campaigns.push(campaign);
  }
  
  return campaigns;
}

function groupLeadsByContext(leads: EnhancedLead[]): Record<string, EnhancedLead[]> {
  const groups: Record<string, EnhancedLead[]> = {};
  
  for (const lead of leads) {
    const key = `${lead.geo_context.state}_${lead.intent_keywords[0]}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(lead);
  }
  
  return groups;
}

function generateAdVariants(leads: EnhancedLead[], competitorIntel: CompetitorAdIntel[]): CampaignAdVariant[] {
  const variants: CampaignAdVariant[] = [];
  
  for (const intel of competitorIntel.slice(0, 3)) {
    for (const hook of intel.winning_hooks.slice(0, 2)) {
      const variant: CampaignAdVariant = {
        id: `variant_${Date.now()}_${variants.length}`,
        headline: hijackHeadline(hook, leads[0]?.intent_keywords[0]),
        primary_text: generatePersonalizedText(leads, intel),
        cta: intel.common_ctas[0] || 'Learn More',
        competitor_source: intel.competitor,
        intent_keywords: [...new Set(leads.flatMap(l => l.intent_keywords))],
        hijack_strategy: 'competitor_hook_twist',
        expected_ctr: Math.random() * 0.05 + 0.02
      };
      
      variants.push(variant);
    }
  }
  
  return variants;
}

function hijackHeadline(competitorHook: string, keyword: string): string {
  const hijackPrefixes = [
    'The Better Alternative to',
    'Why Smart Companies Choose Us Over',
    'Skip the Expensive Option -',
    'Finally, A Real Solution to'
  ];
  
  const prefix = hijackPrefixes[Math.floor(Math.random() * hijackPrefixes.length)];
  return `${prefix} ${keyword}`;
}

function generatePersonalizedText(leads: EnhancedLead[], intel: CompetitorAdIntel): string {
  const commonPain = leads[0]?.search_patterns[0] || 'finding the right solution';
  const uniqueValue = 'our proven track record';
  
  return `Tired of ${commonPain}? While others promise, we deliver ${uniqueValue}. Join ${leads.length}+ companies who switched and never looked back.`;
}

function generateTargetingConfig(leads: EnhancedLead[], competitorIntel: CompetitorAdIntel[]): TargetingConfig {
  return {
    geo_targets: [...new Set(leads.map(l => `${l.geo_context.city}, ${l.geo_context.state}`))],
    demographic_filters: {
      job_titles: [...new Set(leads.map(l => l.title).filter(Boolean))],
      company_sizes: ['50-200', '200-1000', '1000+']
    },
    intent_keywords: [...new Set(leads.flatMap(l => l.intent_keywords))],
    competitor_audiences: competitorIntel.map(c => c.competitor),
    budget_bid_strategy: 'aggressive'
  };
}

function generateBudgetAllocation(totalBudget: number, leads: EnhancedLead[]): BudgetAllocation {
  const avgIntentScore = leads.reduce((sum, l) => sum + l.intent_score, 0) / leads.length;
  const intentMultiplier = avgIntentScore / 100;
  
  return {
    total_budget: totalBudget,
    daily_budget: totalBudget / 30,
    keyword_bids: leads.flatMap(l => l.intent_keywords).reduce((acc, keyword) => {
      acc[keyword] = Math.floor(Math.random() * 10) + 5;
      return acc;
    }, {} as Record<string, number>),
    competitor_hijack_multiplier: 1.5,
    intent_score_weighting: intentMultiplier
  };
}

// Real-time Performance Tracking
export async function trackCampaignPerformance(campaignId: string): Promise<CampaignMetrics> {
  // Simulate real-time performance data
  return {
    impressions: Math.floor(Math.random() * 10000) + 1000,
    clicks: Math.floor(Math.random() * 500) + 50,
    conversions: Math.floor(Math.random() * 50) + 5,
    cost: Math.floor(Math.random() * 5000) + 500,
    ctr: Math.random() * 0.1 + 0.02,
    cpc: Math.random() * 20 + 5,
    conversion_rate: Math.random() * 0.2 + 0.05,
    roi: Math.random() * 5 + 1
  };
}

// Integration Orchestrator
export async function runSpecterNetIntegration(
  targetKeywords: string[],
  geoTargets: string[],
  competitors: string[],
  budget: number
): Promise<{
  warmLeads: EnhancedLead[];
  competitorIntel: CompetitorAdIntel[];
  generatedCampaigns: GeneratedCampaign[];
}> {
  console.log('🎯 Starting Specter Net Integration...');
  
  // Step 1: Real-time lead detection
  const warmLeads = await scanForWarmLeads(targetKeywords, geoTargets);
  console.log(`✅ Detected ${warmLeads.length} warm leads`);
  
  // Step 2: Competitor ad intelligence
  const competitorIntel = await analyzeCompetitorAdIntel(competitors, targetKeywords);
  console.log(`🔍 Analyzed ${competitorIntel.length} competitors`);
  
  // Step 3: Generate hijack campaigns
  const generatedCampaigns = await generateHijackCampaigns(warmLeads, competitorIntel, budget);
  console.log(`🚀 Generated ${generatedCampaigns.length} hijack campaigns`);
  
  return {
    warmLeads,
    competitorIntel,
    generatedCampaigns
  };
}
