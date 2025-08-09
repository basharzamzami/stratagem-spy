
import { supabase } from "@/integrations/supabase/client";

export interface StrikeWindowPrediction {
  id: string;
  lead_id: string;
  predicted_window_start: string;
  predicted_window_end: string;
  conversion_probability: number;
  optimal_channels: string[];
  behavioral_triggers: string[];
  urgency_score: number;
  historical_pattern_match: number;
  auto_scheduled_actions: AutoScheduledAction[];
}

export interface AutoScheduledAction {
  id: string;
  type: 'email' | 'ad_campaign' | 'phone_call' | 'linkedin_message';
  scheduled_time: string;
  content_preview: string;
  status: 'scheduled' | 'sent' | 'completed';
  channel_config: Record<string, any>;
}

export interface HistoricalConversionData {
  lead_id: string;
  conversion_time: string;
  lead_characteristics: Record<string, any>;
  successful_channels: string[];
  optimal_timing_factors: string[];
}

// Core prediction algorithm
export async function predictStrikeWindows(leadIds: string[]): Promise<StrikeWindowPrediction[]> {
  console.log('🎯 Calculating strike windows for leads:', leadIds);
  
  const predictions: StrikeWindowPrediction[] = [];
  
  for (const leadId of leadIds) {
    const prediction = await calculateIndividualStrikeWindow(leadId);
    predictions.push(prediction);
  }
  
  return predictions.sort((a, b) => b.conversion_probability - a.conversion_probability);
}

async function calculateIndividualStrikeWindow(leadId: string): Promise<StrikeWindowPrediction> {
  // Get lead data
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();
  
  if (!lead) throw new Error(`Lead ${leadId} not found`);
  
  // Analyze behavioral patterns
  const behaviorAnalysis = analyzeBehavioralPatterns(lead);
  
  // Find historical matches
  const historicalMatches = await findSimilarLeadPatterns(lead);
  
  // Calculate optimal timing
  const timingPrediction = calculateOptimalTiming(behaviorAnalysis, historicalMatches);
  
  // Determine best channels
  const optimalChannels = determineOptimalChannels(behaviorAnalysis, historicalMatches);
  
  // Schedule automated actions
  const autoActions = await scheduleAutomatedActions(leadId, timingPrediction, optimalChannels);
  
  const prediction: StrikeWindowPrediction = {
    id: `prediction_${leadId}_${Date.now()}`,
    lead_id: leadId,
    predicted_window_start: timingPrediction.windowStart,
    predicted_window_end: timingPrediction.windowEnd,
    conversion_probability: timingPrediction.probability,
    optimal_channels: optimalChannels,
    behavioral_triggers: behaviorAnalysis.triggers,
    urgency_score: behaviorAnalysis.urgencyScore,
    historical_pattern_match: historicalMatches.matchScore,
    auto_scheduled_actions: autoActions
  };
  
  return prediction;
}

function analyzeBehavioralPatterns(lead: any) {
  const triggers = [];
  let urgencyScore = 50;
  
  // Analyze lead data for behavioral patterns
  if (lead.source_data?.search_keywords) {
    const keywords = lead.source_data.search_keywords;
    
    // Check for urgency indicators
    const urgentKeywords = ['asap', 'urgent', 'immediate', 'need now', 'quickly'];
    const hasUrgency = urgentKeywords.some(keyword => 
      keywords.some((k: string) => k.toLowerCase().includes(keyword))
    );
    
    if (hasUrgency) {
      triggers.push('urgency_language');
      urgencyScore += 30;
    }
    
    // Check for comparison queries
    const comparisonKeywords = ['vs', 'compare', 'alternative', 'better than'];
    const hasComparison = comparisonKeywords.some(keyword =>
      keywords.some((k: string) => k.toLowerCase().includes(keyword))
    );
    
    if (hasComparison) {
      triggers.push('comparison_shopping');
      urgencyScore += 20;
    }
    
    // Check for pricing queries
    const pricingKeywords = ['price', 'cost', 'pricing', 'budget'];
    const hasPricing = pricingKeywords.some(keyword =>
      keywords.some((k: string) => k.toLowerCase().includes(keyword))
    );
    
    if (hasPricing) {
      triggers.push('pricing_research');
      urgencyScore += 25;
    }
  }
  
  // Analyze activity recency
  const lastActivity = new Date(lead.updated_at || lead.created_at).getTime();
  const hoursSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60);
  
  if (hoursSinceActivity < 24) {
    triggers.push('recent_activity');
    urgencyScore += 15;
  }
  
  return {
    triggers,
    urgencyScore: Math.min(100, urgencyScore)
  };
}

async function findSimilarLeadPatterns(lead: any) {
  // Mock historical pattern matching
  // In real implementation, would query historical conversion data
  
  const mockHistoricalData = {
    matchScore: Math.random() * 30 + 70, // 70-100% match
    successfulTimings: [
      { hour: 10, success_rate: 0.85 },
      { hour: 14, success_rate: 0.78 },
      { hour: 16, success_rate: 0.82 }
    ],
    optimalChannels: ['email', 'linkedin', 'phone'],
    avgResponseTime: 18 // hours
  };
  
  return mockHistoricalData;
}

function calculateOptimalTiming(behaviorAnalysis: any, historicalMatches: any) {
  let baseHoursFromNow = historicalMatches.avgResponseTime || 24;
  
  // Adjust based on urgency
  if (behaviorAnalysis.urgencyScore > 80) {
    baseHoursFromNow = Math.max(6, baseHoursFromNow * 0.5);
  } else if (behaviorAnalysis.urgencyScore > 60) {
    baseHoursFromNow = Math.max(12, baseHoursFromNow * 0.75);
  }
  
  // Calculate window start and end times
  const windowStart = new Date(Date.now() + baseHoursFromNow * 60 * 60 * 1000);
  const windowEnd = new Date(windowStart.getTime() + 4 * 60 * 60 * 1000); // 4 hour window
  
  // Calculate conversion probability
  let probability = historicalMatches.matchScore * 0.6; // Base from historical match
  probability += (behaviorAnalysis.urgencyScore / 100) * 0.3; // Urgency factor
  probability += 0.1; // Base probability
  
  return {
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    probability: Math.min(100, Math.round(probability))
  };
}

function determineOptimalChannels(behaviorAnalysis: any, historicalMatches: any) {
  let channels = [...historicalMatches.optimalChannels];
  
  // Adjust channels based on urgency
  if (behaviorAnalysis.urgencyScore > 85) {
    // High urgency - prioritize immediate channels
    channels = ['phone', 'linkedin', 'email'];
  } else if (behaviorAnalysis.urgencyScore > 70) {
    // Medium urgency - balanced approach
    channels = ['email', 'linkedin', 'phone'];
  } else {
    // Lower urgency - nurturing approach
    channels = ['email', 'ads', 'linkedin'];
  }
  
  return channels.slice(0, 3); // Top 3 channels
}

async function scheduleAutomatedActions(
  leadId: string, 
  timingPrediction: any, 
  channels: string[]
): Promise<AutoScheduledAction[]> {
  const actions: AutoScheduledAction[] = [];
  
  const windowStart = new Date(timingPrediction.windowStart);
  
  // Schedule actions slightly before the optimal window
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    const actionTime = new Date(windowStart.getTime() - (30 - i * 15) * 60 * 1000); // Stagger by 15 mins
    
    const action: AutoScheduledAction = {
      id: `action_${leadId}_${channel}_${Date.now()}`,
      type: channel as any,
      scheduled_time: actionTime.toISOString(),
      content_preview: generateActionPreview(channel, leadId),
      status: 'scheduled',
      channel_config: getChannelConfig(channel)
    };
    
    actions.push(action);
  }
  
  return actions;
}

function generateActionPreview(channel: string, leadId: string): string {
  const previews = {
    email: 'Hi {first_name}, noticed your recent search for competitive intelligence solutions...',
    phone: 'Call script: Lead mentioned urgency - focus on immediate availability and quick implementation',
    linkedin: 'LinkedIn connection: "Saw your post about market research challenges. We help companies just like yours..."',
    ads: 'Targeted ad: "Stop Losing Deals to Competitors - See What They\'re Really Doing"'
  };
  
  return previews[channel as keyof typeof previews] || 'Automated outreach scheduled';
}

function getChannelConfig(channel: string): Record<string, any> {
  const configs = {
    email: {
      template: 'warm_lead_initial',
      personalization_level: 'high',
      follow_up_sequence: true
    },
    phone: {
      priority: 'high',
      duration_estimate: 10,
      call_type: 'warm_intro'
    },
    linkedin: {
      connection_note: true,
      message_delay: 24,
      content_type: 'educational'
    },
    ads: {
      platform: 'linkedin',
      audience_type: 'lookalike',
      budget_multiplier: 1.5
    }
  };
  
  return configs[channel as keyof typeof configs] || {};
}

// Real-time monitoring and updates
export async function updateStrikeWindowPredictions(leadId: string, activityData: any) {
  console.log('🔄 Updating strike window for lead activity:', leadId);
  
  // Recalculate prediction based on new activity
  const updatedPrediction = await calculateIndividualStrikeWindow(leadId);
  
  // Check if timing should be adjusted
  if (activityData.urgency_increase) {
    const newWindowStart = new Date(Date.now() + 2 * 60 * 60 * 1000); // Move to 2 hours from now
    updatedPrediction.predicted_window_start = newWindowStart.toISOString();
    updatedPrediction.predicted_window_end = new Date(newWindowStart.getTime() + 3 * 60 * 60 * 1000).toISOString();
  }
  
  return updatedPrediction;
}

// Integration with CRM and outreach tools
export async function syncStrikeWindowsToCRM(predictions: StrikeWindowPrediction[]) {
  for (const prediction of predictions) {
    // Create tasks in CRM for each predicted strike window
    const { error } = await supabase
      .from('tasks')
      .insert({
        title: `Strike Window: Contact lead during optimal timing`,
        description: `Predicted ${prediction.conversion_probability}% conversion probability`,
        category: 'strike_window',
        priority: prediction.conversion_probability > 85 ? 5 : 3,
        status: 'pending',
        due_date: prediction.predicted_window_start,
        related_entities: {
          lead_id: prediction.lead_id,
          strike_window_id: prediction.id,
          optimal_channels: prediction.optimal_channels
        }
      });
    
    if (error) console.error('Error creating strike window task:', error);
  }
}
