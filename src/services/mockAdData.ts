
export const mockCompetitors = [
  { id: 'hubspot', name: 'HubSpot', industry: 'Marketing Automation' },
  { id: 'salesforce', name: 'Salesforce', industry: 'CRM' },
  { id: 'marketo', name: 'Marketo', industry: 'Marketing Automation' },
  { id: 'activecampaign', name: 'ActiveCampaign', industry: 'Email Marketing' },
  { id: 'pardot', name: 'Pardot', industry: 'B2B Marketing' },
  { id: 'mailchimp', name: 'Mailchimp', industry: 'Email Marketing' },
  { id: 'constant-contact', name: 'Constant Contact', industry: 'Email Marketing' },
  { id: 'convertkit', name: 'ConvertKit', industry: 'Creator Marketing' }
];

export const mockHotAds = [
  {
    id: '1',
    competitor: 'HubSpot',
    platform: 'Meta',
    headline: 'Stop Losing Leads to Bad Follow-Up',
    description: 'Our CRM automatically nurtures every lead so you never miss a sale. See 40% more conversions in 30 days.',
    cta: 'Start Free Trial',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    engagementSpike: 340,
    spendIncrease: 85,
    velocity: 'critical',
    firstSeen: '2 hours ago',
    metrics: {
      likes: 2847,
      shares: 423,
      comments: 156,
      clicks: 1890,
      impressions: 45000
    },
    psychTriggers: ['fear', 'social_proof', 'urgency'],
    targetAudience: 'Business owners, 25-55, interested in CRM'
  },
  {
    id: '2',
    competitor: 'Salesforce',
    platform: 'Google',
    headline: 'Why 150,000+ Companies Choose Salesforce',
    description: 'The world\'s #1 CRM trusted by Fortune 500 companies. Close more deals, faster.',
    cta: 'Get Demo',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    engagementSpike: 280,
    spendIncrease: 65,
    velocity: 'high',
    firstSeen: '4 hours ago',
    metrics: {
      impressions: 67000,
      clicks: 2340,
      conversions: 89
    },
    psychTriggers: ['authority', 'social_proof', 'status'],
    targetAudience: 'Enterprise decision makers, 35-65'
  },
  {
    id: '3',
    competitor: 'Marketo',
    platform: 'LinkedIn',
    headline: 'Marketing Automation That Actually Works',
    description: 'Generate 3x more qualified leads with AI-powered nurturing. Used by 5,000+ B2B companies.',
    cta: 'See How It Works',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    engagementSpike: 195,
    spendIncrease: 45,
    velocity: 'medium',
    firstSeen: '6 hours ago',
    metrics: {
      impressions: 28000,
      clicks: 890,
      leads: 34
    },
    psychTriggers: ['curiosity', 'social_proof', 'results'],
    targetAudience: 'Marketing directors, B2B companies'
  },
  {
    id: '4',
    competitor: 'ActiveCampaign',
    platform: 'YouTube',
    headline: 'This Email Mistake is Killing Your Sales',
    description: 'Most businesses lose 70% of potential revenue due to poor email automation. Here\'s how to fix it.',
    cta: 'Watch Now',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    engagementSpike: 420,
    spendIncrease: 120,
    velocity: 'critical',
    firstSeen: '1 hour ago',
    metrics: {
      views: 15600,
      likes: 890,
      comments: 234,
      subscribers: 67
    },
    psychTriggers: ['fear', 'curiosity', 'problem_agitation'],
    targetAudience: 'Small business owners, ecommerce'
  },
  {
    id: '5',
    competitor: 'Mailchimp',
    platform: 'TikTok',
    headline: 'POV: You Just Automated Your Entire Email Marketing',
    description: 'When you realize you can set up email sequences that sell while you sleep 💰',
    cta: 'Try Free',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    engagementSpike: 850,
    spendIncrease: 200,
    velocity: 'viral',
    firstSeen: '30 minutes ago',
    metrics: {
      views: 127000,
      likes: 8900,
      shares: 2300,
      comments: 567
    },
    psychTriggers: ['relatability', 'aspiration', 'ease'],
    targetAudience: 'Creators, small business, 18-35'
  }
];

export const mockWarmLeads = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'TechScale Solutions',
    title: 'VP Marketing',
    location: 'San Francisco, CA',
    intentKeywords: ['marketing automation', 'lead generation', 'crm software'],
    searchPattern: 'alternatives to HubSpot pricing 2025',
    urgencyScore: 94,
    lastActivity: '12 minutes ago',
    source: 'Google Trends',
    competitorMentioned: ['HubSpot', 'Salesforce'],
    email: 'sarah.chen@techscale.com',
    phone: '+1-555-0123',
    companySize: '100-500',
    industry: 'SaaS',
    signals: [
      'Visited HubSpot pricing page 3x this week',
      'Downloaded "CRM comparison guide"',
      'Searched "marketing automation ROI calculator"'
    ]
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    company: 'Growth Dynamics',
    title: 'CEO',
    location: 'Austin, TX',
    intentKeywords: ['competitive analysis', 'market research', 'business intelligence'],
    searchPattern: 'best competitive intelligence tools 2025',
    urgencyScore: 89,
    lastActivity: '27 minutes ago',
    source: 'LinkedIn Search',
    competitorMentioned: ['SimilarWeb', 'Ahrefs'],
    email: 'michael@growthdynamics.com',
    phone: '+1-555-0124',
    companySize: '50-200',
    industry: 'Marketing Agency',
    signals: [
      'Job posting for "Competitive Intelligence Analyst"',
      'LinkedIn search for "competitor tracking tools"',
      'Visited 5 competitor analysis tool websites'
    ]
  },
  {
    id: '3',
    name: 'Emily Foster',
    company: 'Apex Marketing',
    title: 'Marketing Director',
    location: 'New York, NY',
    intentKeywords: ['ad tracking', 'competitor monitoring', 'facebook ads spy'],
    searchPattern: 'how to spy on competitor facebook ads',
    urgencyScore: 85,
    lastActivity: '45 minutes ago',
    source: 'Reddit Forums',
    competitorMentioned: ['AdSpy', 'BigSpy'],
    email: 'emily.foster@apexmarketing.com',
    phone: '+1-555-0125',
    companySize: '25-100',
    industry: 'Digital Marketing',
    signals: [
      'Posted in r/PPC about ad research tools',
      'Googled "facebook ad library alternatives"',
      'Visited AdSpy trial page'
    ]
  },
  {
    id: '4',
    name: 'David Kim',
    company: 'InnovateTech',
    title: 'Growth Manager',
    location: 'Seattle, WA',
    intentKeywords: ['lead qualification', 'sales automation', 'pipeline management'],
    searchPattern: 'best lead scoring software for B2B',
    urgencyScore: 78,
    lastActivity: '1 hour ago',
    source: 'Google Search',
    competitorMentioned: ['Pardot', 'Marketo'],
    email: 'david.kim@innovatetech.com',
    phone: '+1-555-0126',
    companySize: '200-1000',
    industry: 'Technology',
    signals: [
      'Downloaded lead scoring whitepaper',
      'Attended webinar on sales automation',
      'Compared 4 different CRM solutions'
    ]
  }
];

export const mockRealTimeActivities = [
  {
    id: '1',
    type: 'lead_detected',
    message: 'New warm lead detected: "marketing automation pricing" search from Austin, TX',
    timestamp: '2 seconds ago',
    priority: 'high',
    data: { lead_id: '1', intent_score: 94 }
  },
  {
    id: '2',
    type: 'competitor_ad',
    message: 'HubSpot increased ad spend by 40% in San Francisco market',
    timestamp: '1 minute ago',
    priority: 'medium',
    data: { competitor: 'HubSpot', spend_increase: 40, location: 'San Francisco' }
  },
  {
    id: '3',
    type: 'conversion',
    message: 'Campaign "HubSpot Alternative" generated qualified lead from hijacked traffic',
    timestamp: '3 minutes ago',
    priority: 'high',
    data: { campaign_id: 'hubspot-alt-001', lead_value: 2500 }
  },
  {
    id: '4',
    type: 'campaign_update',
    message: 'Auto-bid adjustment: Increased CPC to $3.20 for high-intent keywords',
    timestamp: '5 minutes ago',
    priority: 'low',
    data: { old_cpc: 2.80, new_cpc: 3.20, keywords: ['marketing automation', 'crm software'] }
  },
  {
    id: '5',
    type: 'engagement_spike',
    message: 'Mailchimp TikTok ad showing 850% engagement spike - viral potential detected',
    timestamp: '8 minutes ago',
    priority: 'critical',
    data: { competitor: 'Mailchimp', platform: 'TikTok', spike_percentage: 850 }
  }
];

export const mockCampaignMetrics = [
  { name: 'Warm Leads', current: 147, previous: 134, unit: '', trend: 'up' },
  { name: 'CTR', current: 4.2, previous: 3.8, unit: '%', trend: 'up' },
  { name: 'CPC', current: 2.40, previous: 2.80, unit: '$', trend: 'down' },
  { name: 'Conversions', current: 12, previous: 8, unit: '', trend: 'up' },
  { name: 'ROAS', current: 4.8, previous: 3.9, unit: 'x', trend: 'up' },
  { name: 'Quality Score', current: 8.7, previous: 8.2, unit: '/10', trend: 'up' }
];

export const mockCompetitorInsights = [
  {
    competitor: 'HubSpot',
    totalAds: 234,
    activeAds: 89,
    estimatedSpend: '$45,000/month',
    topKeywords: ['marketing automation', 'crm software', 'lead generation'],
    avgEngagement: 2.4,
    dominantPlatforms: ['Meta', 'Google', 'LinkedIn'],
    recentChanges: [
      'Launched new "Small Business" campaign targeting',
      'Increased video ad spend by 60%',
      'Updated messaging to emphasize AI features'
    ]
  },
  {
    competitor: 'Salesforce',
    totalAds: 189,
    activeAds: 67,
    estimatedSpend: '$67,000/month',
    topKeywords: ['enterprise crm', 'sales automation', 'customer success'],
    avgEngagement: 1.8,
    dominantPlatforms: ['Google', 'LinkedIn', 'YouTube'],
    recentChanges: [
      'Shifted focus to mid-market companies',
      'Launched Slack integration campaign',
      'Increased demo-focused CTAs by 40%'
    ]
  },
  {
    competitor: 'Marketo',
    totalAds: 156,
    activeAds: 45,
    estimatedSpend: '$32,000/month',
    topKeywords: ['b2b marketing', 'lead nurturing', 'marketing ops'],
    avgEngagement: 2.1,
    dominantPlatforms: ['LinkedIn', 'Google', 'Meta'],
    recentChanges: [
      'Emphasizing Adobe integration benefits',
      'Targeting marketing operations roles',
      'Reduced campaign diversity, focusing on core message'
    ]
  }
];

export const mockAlerts = [
  {
    id: '1',
    type: 'competitor_change',
    competitor: 'HubSpot',
    summary: 'Launched new "Zero-Trust Security" campaign targeting our keywords',
    description: 'HubSpot started running high-budget ads on "enterprise security" with 40% higher bid than our current strategy.',
    severity: 'high',
    timestamp: '2025-08-05T08:30:00Z',
    dismissed: false,
    recommendedActions: [
      'Increase bid on "enterprise security" keyword cluster',
      'Launch counter-campaign highlighting superior features',
      'Monitor their landing page for messaging changes'
    ]
  },
  {
    id: '2',
    type: 'keyword_loss',
    competitor: 'Salesforce',
    summary: 'Lost position #3 for "cloud data protection" - now ranking #7',
    description: 'Organic ranking dropped significantly for primary keyword. Competitor increased content marketing efforts.',
    severity: 'medium',
    timestamp: '2025-08-04T15:45:00Z',
    dismissed: false,
    recommendedActions: [
      'Audit content for "cloud data protection" keyword',
      'Create comprehensive guide on data protection',
      'Build high-authority backlinks to relevant pages'
    ]
  },
  {
    id: '3',
    type: 'ad_change',
    competitor: 'Marketo',
    summary: 'Updated ad creative with new AI-focused messaging',
    description: 'Competitor shifted messaging from "business intelligence" to "AI-powered insights" - potential trend shift.',
    severity: 'medium',
    timestamp: '2025-08-03T11:20:00Z',
    dismissed: true,
    actionTaken: 'Updated our messaging to emphasize AI capabilities',
    recommendedActions: [
      'A/B test AI-focused ad copy',
      'Update landing pages with AI terminology',
      'Monitor market response to AI messaging'
    ]
  },
  {
    id: '4',
    type: 'market_shift',
    competitor: 'Multiple',
    summary: 'Increased activity in financial services vertical',
    description: 'Three major competitors launched campaigns targeting financial compliance keywords. Market opportunity or saturation?',
    severity: 'critical',
    timestamp: '2025-08-02T16:00:00Z',
    dismissed: false,
    recommendedActions: [
      'Research financial services market opportunity',
      'Develop fintech-specific value propositions',
      'Create industry-specific landing pages'
    ]
  }
];

export const mockTasks = [
  {
    id: '1',
    title: 'Deploy counter-offer targeting "cloud security" stolen by HubSpot',
    status: 'In Progress',
    assignedTo: 'Sarah Chen',
    priority: 1,
    notes: 'Focus on SEO keyword: "enterprise cloud security" - high intent cluster',
    estimatedImpact: 'high',
    effortHours: 8,
    progress: 65,
    steps: [
      { task: 'Analyze competitor\'s landing page structure', completed: true },
      { task: 'Create improved value proposition', completed: true },
      { task: 'Launch A/B test campaign', completed: false },
      { task: 'Monitor performance and optimize', completed: false }
    ],
    linkedEntities: [{ type: 'competitor', id: 'hubspot' }],
    createdAt: '2025-08-05T10:00:00Z',
    dueDate: '2025-08-07T17:00:00Z'
  },
  {
    id: '2',
    title: 'Launch Google Ads campaign in Austin targeting "enterprise SaaS" intent cluster',
    status: 'To Do',
    assignedTo: 'Mark Rodriguez',
    priority: 2,
    notes: 'Budget approved $5k/month, targeting manufacturing vertical',
    estimatedImpact: 'medium',
    effortHours: 6,
    progress: 0,
    steps: [
      { task: 'Define audience segments', completed: false },
      { task: 'Create responsive search ads', completed: false },
      { task: 'Set up conversion tracking', completed: false }
    ],
    linkedEntities: [{ type: 'location', zip: '73301' }],
    createdAt: '2025-08-04T14:30:00Z',
    dueDate: '2025-08-08T12:00:00Z'
  },
  {
    id: '3',
    title: 'Optimize landing page CTA to match competitor "Start Free Trial"',
    status: 'Completed',
    assignedTo: 'Lena Park',
    priority: 3,
    notes: 'Completed A/B test - 23% improvement in conversions',
    estimatedImpact: 'medium',
    effortHours: 4,
    progress: 100,
    steps: [
      { task: 'Analyze competitor CTA performance', completed: true },
      { task: 'Design new CTA variants', completed: true },
      { task: 'Implement and test', completed: true }
    ],
    linkedEntities: [],
    createdAt: '2025-08-01T09:00:00Z',
    completedAt: '2025-08-03T16:30:00Z'
  },
  {
    id: '4',
    title: 'Research Mailchimp\'s TikTok viral campaign strategy',
    status: 'Urgent',
    assignedTo: 'Alex Thompson',
    priority: 1,
    notes: 'Viral campaign detected - need to understand and adapt quickly',
    estimatedImpact: 'high',
    effortHours: 12,
    progress: 25,
    steps: [
      { task: 'Analyze viral video elements', completed: true },
      { task: 'Identify target demographics', completed: false },
      { task: 'Create similar content strategy', completed: false },
      { task: 'Test and launch adaptation', completed: false }
    ],
    linkedEntities: [{ type: 'competitor', id: 'mailchimp' }],
    createdAt: '2025-08-05T14:00:00Z',
    dueDate: '2025-08-06T12:00:00Z'
  }
];

export const mockAnalyticsData = {
  angles: {
    emotional: 65,
    logical: 35
  },
  offers: {
    'Free Trial': 45,
    'Demo Request': 28,
    'Consultation': 15,
    'Download Guide': 12
  },
  formats: {
    'Single Image': 40,
    'Video': 35,
    'Carousel': 20,
    'Collection': 5
  },
  trends: [
    { date: '2025-08-01', count: 23 },
    { date: '2025-08-02', count: 31 },
    { date: '2025-08-03', count: 28 },
    { date: '2025-08-04', count: 45 },
    { date: '2025-08-05', count: 52 },
    { date: '2025-08-06', count: 38 },
    { date: '2025-08-07', count: 41 },
    { date: '2025-08-08', count: 47 },
    { date: '2025-08-09', count: 59 },
    { date: '2025-08-10', count: 73 }
  ]
};
