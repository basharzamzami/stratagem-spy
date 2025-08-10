
export interface CompetitorActivity {
  id: string;
  competitor_name: string;
  activity_type: 'ad_change' | 'pricing_update' | 'content_change' | 'product_launch' | 'seo_ranking_change';
  description: string;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  detected_at: string;
  data: {
    before?: any;
    after?: any;
    url?: string;
    platform?: string;
    keywords?: string[];
    metrics?: Record<string, number>;
  };
  auto_response_generated?: boolean;
  playbook_id?: string;
}

export interface AutoPlaybook {
  id: string;
  title: string;
  competitor_name: string;
  activity_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_time: string;
  estimated_impact: string;
  actions: PlaybookAction[];
  created_at: string;
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
}

export interface PlaybookAction {
  id: string;
  title: string;
  description: string;
  type: 'ad_campaign' | 'content_creation' | 'seo_optimization' | 'pricing_adjustment' | 'product_update';
  priority: number;
  estimated_hours: number;
  assigned_to?: string;
  resources_needed: string[];
  success_metrics: string[];
  deadline?: string;
}

class RealTimeCompetitorMonitor {
  private activities: CompetitorActivity[] = [];
  private playbooks: AutoPlaybook[] = [];
  private listeners: ((activity: CompetitorActivity) => void)[] = [];

  // Mock real-time monitoring - in production this would connect to actual data sources
  startMonitoring() {
    // Simulate periodic competitor activity detection
    setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every check
        this.simulateCompetitorActivity();
      }
    }, 10000); // Check every 10 seconds

    console.log('🔍 Real-time competitor monitoring activated');
  }

  private simulateCompetitorActivity() {
    const mockActivities: Partial<CompetitorActivity>[] = [
      {
        competitor_name: 'HubSpot',
        activity_type: 'ad_change',
        description: 'Launched new "AI-Powered CRM" campaign with 40% higher bid on "marketing automation" keywords',
        impact_level: 'high',
        data: {
          platform: 'Google Ads',
          keywords: ['marketing automation', 'crm software', 'lead generation'],
          metrics: { estimated_daily_spend: 5000, bid_increase: 40 }
        }
      },
      {
        competitor_name: 'Salesforce',
        activity_type: 'pricing_update',
        description: 'Reduced Professional plan pricing by 25% and added free trial extension',
        impact_level: 'critical',
        data: {
          before: { price: 150, trial_days: 14 },
          after: { price: 112.50, trial_days: 30 },
          url: 'https://salesforce.com/pricing'
        }
      },
      {
        competitor_name: 'Marketo',
        activity_type: 'content_change',
        description: 'Published comprehensive "B2B Lead Scoring Guide" targeting our primary keywords',
        impact_level: 'medium',
        data: {
          url: 'https://marketo.com/resources/lead-scoring-guide',
          keywords: ['lead scoring', 'b2b marketing', 'marketing qualified leads'],
          metrics: { estimated_traffic: 12000 }
        }
      }
    ];

    const activity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
    
    const fullActivity: CompetitorActivity = {
      id: `activity_${Date.now()}`,
      detected_at: new Date().toISOString(),
      auto_response_generated: false,
      ...activity
    } as CompetitorActivity;

    this.activities.unshift(fullActivity);
    
    // Auto-generate playbook for high/critical impact activities
    if (fullActivity.impact_level === 'high' || fullActivity.impact_level === 'critical') {
      const playbook = this.generateAutoPlaybook(fullActivity);
      fullActivity.auto_response_generated = true;
      fullActivity.playbook_id = playbook.id;
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(fullActivity));
    
    console.log(`🚨 New competitor activity detected: ${fullActivity.competitor_name} - ${fullActivity.description}`);
  }

  private generateAutoPlaybook(activity: CompetitorActivity): AutoPlaybook {
    const playbookTemplates = {
      ad_change: {
        title: `Counter ${activity.competitor_name}'s New Ad Campaign`,
        actions: [
          {
            title: 'Analyze competitor ad creative and messaging',
            description: 'Deep-dive into competitor\'s new ad copy, visuals, and targeting strategy',
            type: 'ad_campaign' as const,
            priority: 1,
            estimated_hours: 3,
            resources_needed: ['Ad intelligence tools', 'Creative team'],
            success_metrics: ['Competitor analysis completed', 'Key messaging identified']
          },
          {
            title: 'Launch competing ad campaign with superior value proposition',
            description: 'Create and launch ads that directly compete for the same keywords with better messaging',
            type: 'ad_campaign' as const,
            priority: 2,
            estimated_hours: 8,
            resources_needed: ['Ad budget ($2000)', 'Creative assets', 'Campaign manager'],
            success_metrics: ['CTR > competitor +20%', 'CPC < competitor -15%']
          },
          {
            title: 'Implement defensive SEO strategy',
            description: 'Optimize content and landing pages for targeted keywords to maintain organic visibility',
            type: 'seo_optimization' as const,
            priority: 3,
            estimated_hours: 6,
            resources_needed: ['SEO team', 'Content writer'],
            success_metrics: ['Maintain top 3 rankings', 'Increase organic CTR by 10%']
          }
        ]
      },
      pricing_update: {
        title: `Respond to ${activity.competitor_name} Pricing Changes`,
        actions: [
          {
            title: 'Competitive pricing analysis',
            description: 'Analyze the impact of competitor pricing changes on market positioning',
            type: 'pricing_adjustment' as const,
            priority: 1,
            estimated_hours: 4,
            resources_needed: ['Pricing team', 'Market research'],
            success_metrics: ['Pricing impact assessment completed', 'Recommendations provided']
          },
          {
            title: 'Evaluate pricing strategy adjustment',
            description: 'Determine if we need to adjust our pricing or enhance value proposition',
            type: 'pricing_adjustment' as const,
            priority: 2,
            estimated_hours: 6,
            resources_needed: ['Leadership approval', 'Finance team'],
            success_metrics: ['Pricing strategy updated', 'Customer retention maintained']
          },
          {
            title: 'Launch value-focused campaign',
            description: 'Create marketing campaign emphasizing unique value over price competition',
            type: 'ad_campaign' as const,
            priority: 3,
            estimated_hours: 10,
            resources_needed: ['Marketing budget', 'Creative team'],
            success_metrics: ['Campaign launched within 48h', 'Value perception improved']
          }
        ]
      }
    };

    const template = playbookTemplates[activity.activity_type] || playbookTemplates.ad_change;
    
    const playbook: AutoPlaybook = {
      id: `playbook_${Date.now()}`,
      title: template.title,
      competitor_name: activity.competitor_name,
      activity_type: activity.activity_type,
      priority: activity.impact_level === 'critical' ? 'urgent' : 
               activity.impact_level === 'high' ? 'high' : 'medium',
      estimated_time: '24-48 hours',
      estimated_impact: activity.impact_level === 'critical' ? 'High revenue protection' : 'Market share defense',
      actions: template.actions.map((action, index) => ({
        ...action,
        id: `action_${Date.now()}_${index}`,
        deadline: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString() // Staggered deadlines
      })),
      created_at: new Date().toISOString(),
      status: 'draft'
    };

    this.playbooks.unshift(playbook);
    console.log(`📋 Auto-generated playbook: ${playbook.title}`);
    
    return playbook;
  }

  getRecentActivities(limit: number = 20): CompetitorActivity[] {
    return this.activities.slice(0, limit);
  }

  getActivePlaybooks(): AutoPlaybook[] {
    return this.playbooks.filter(p => p.status !== 'completed');
  }

  getAllPlaybooks(): AutoPlaybook[] {
    return this.playbooks;
  }

  updatePlaybookStatus(playbookId: string, status: AutoPlaybook['status']) {
    const playbook = this.playbooks.find(p => p.id === playbookId);
    if (playbook) {
      playbook.status = status;
    }
  }

  onActivity(listener: (activity: CompetitorActivity) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const realTimeCompetitorMonitor = new RealTimeCompetitorMonitor();
