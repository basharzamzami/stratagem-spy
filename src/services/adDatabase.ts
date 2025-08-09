
export interface DatabaseAdItem {
  id: string;
  platform: string;
  competitor: string;
  ad_creative_url?: string;
  headline?: string;
  primary_text?: string;
  cta?: string;
  offer?: string;
  engagement?: Record<string, any>;
  detected_patterns?: Record<string, any>;
  fetched_at: string;
  active: boolean;
}

// Sample ads with realistic data and matching images
const sampleAds: DatabaseAdItem[] = [
  {
    id: "1",
    platform: "Meta",
    competitor: "CloudSecure Pro",
    ad_creative_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    headline: "Unlock Your Business Potential",
    primary_text: "See how our enterprise SaaS can double your leads in 30 days. Trusted by Fortune 500 companies.",
    cta: "Start Free Trial",
    offer: "14-day free trial + implementation support",
    engagement: {
      likes: 1250,
      comments: 89,
      shares: 156,
      clicks: 890
    },
    detected_patterns: {
      angle: "logical",
      format: "image",
      theme: "business growth",
      strategy: "social proof + free trial"
    },
    fetched_at: "2025-08-09T10:30:00Z",
    active: true
  },
  {
    id: "2",
    platform: "Google",
    competitor: "SecureFlow Systems",
    ad_creative_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
    headline: "Best Cloud Security Solutions",
    primary_text: "Protect your enterprise data with military-grade encryption. 99.9% uptime guaranteed.",
    cta: "Get Quote",
    offer: "Free security audit worth $2,000",
    engagement: {
      impressions: 38000,
      clicks: 745,
      conversions: 23
    },
    detected_patterns: {
      angle: "fear",
      format: "text",
      theme: "security",
      strategy: "authority + guarantee"
    },
    fetched_at: "2025-08-09T09:45:00Z",
    active: true
  },
  {
    id: "3",
    platform: "YouTube",
    competitor: "MarketMax Solutions",
    ad_creative_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    headline: "Marketing Secrets Revealed",
    primary_text: "Discover how top agencies generate 10x ROI with our proven automation platform. Watch our exclusive demo.",
    cta: "Watch Demo",
    offer: "Free 45-minute strategy session",
    engagement: {
      views: 52000,
      likes: 1800,
      comments: 234,
      subscribers: 45
    },
    detected_patterns: {
      angle: "curiosity",
      format: "video",
      theme: "marketing automation",
      strategy: "exclusivity + demo"
    },
    fetched_at: "2025-08-09T11:15:00Z",
    active: true
  },
  {
    id: "4",
    platform: "Meta",
    competitor: "NextGen Analytics",
    ad_creative_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    headline: "AI-Powered Business Intelligence",
    primary_text: "Transform your data into actionable insights with our revolutionary AI platform. Join 10,000+ businesses already using our solution.",
    cta: "Try Now",
    offer: "30-day money-back guarantee",
    engagement: {
      likes: 2200,
      comments: 167,
      shares: 312,
      clicks: 560
    },
    detected_patterns: {
      angle: "novelty",
      format: "carousel",
      theme: "AI technology",
      strategy: "innovation + social proof"
    },
    fetched_at: "2025-08-09T08:22:00Z",
    active: true
  },
  {
    id: "5",
    platform: "LinkedIn",
    competitor: "DataVault Enterprise",
    ad_creative_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
    headline: "Zero-Trust Security Architecture",
    primary_text: "Implement enterprise-grade security that scales with your business growth. Used by 500+ Fortune companies.",
    cta: "Learn More",
    offer: "Free enterprise consultation",
    engagement: {
      impressions: 41000,
      clicks: 820,
      leads: 34
    },
    detected_patterns: {
      angle: "status",
      format: "image",
      theme: "enterprise security",
      strategy: "authority + scalability"
    },
    fetched_at: "2025-08-09T07:58:00Z",
    active: true
  },
  {
    id: "6",
    platform: "TikTok",
    competitor: "SalesBoost AI",
    ad_creative_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
    headline: "This Sales Hack Doubled My Revenue",
    primary_text: "I was struggling to close deals until I discovered this one simple trick. Now I'm closing 3x more clients every month.",
    cta: "Learn the Trick",
    offer: "Limited-time access to masterclass",
    engagement: {
      views: 125000,
      likes: 8900,
      shares: 445,
      comments: 567
    },
    detected_patterns: {
      angle: "relatability",
      format: "video",
      theme: "sales improvement",
      strategy: "personal story + scarcity"
    },
    fetched_at: "2025-08-09T12:10:00Z",
    active: true
  },
  {
    id: "7",
    platform: "Meta",
    competitor: "GrowthHacker Pro",
    ad_creative_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    headline: "Stop Wasting Money on Ads That Don't Work",
    primary_text: "Most businesses lose $50K+ on failed ad campaigns. Our proven system has generated over $2M in revenue for clients in 90 days.",
    cta: "Get Case Studies",
    offer: "Free ROI calculator + strategy call",
    engagement: {
      likes: 3400,
      comments: 298,
      shares: 189,
      clicks: 1200
    },
    detected_patterns: {
      angle: "fear",
      format: "image",
      theme: "advertising ROI",
      strategy: "problem agitation + proof"
    },
    fetched_at: "2025-08-09T06:35:00Z",
    active: true
  },
  {
    id: "8",
    platform: "Google",
    competitor: "ConvertMax CRM",
    ad_creative_url: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=400&h=200&fit=crop",
    headline: "CRM That Actually Converts Leads",
    primary_text: "Unlike other CRMs that just store data, ours actively helps you close more deals. See 40% increase in conversions.",
    cta: "Start Free Trial",
    offer: "Free setup + migration included",
    engagement: {
      impressions: 45000,
      clicks: 920,
      trials: 67
    },
    detected_patterns: {
      angle: "logical",
      format: "text",
      theme: "CRM optimization",
      strategy: "comparison + results"
    },
    fetched_at: "2025-08-09T05:42:00Z",
    active: true
  }
];

export async function fetchAdsFromDatabase(limit: number = 50): Promise<DatabaseAdItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return sample ads with some randomization
  const shuffled = [...sampleAds].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

export async function getAdById(id: string): Promise<DatabaseAdItem | null> {
  const ad = sampleAds.find(ad => ad.id === id);
  return ad || null;
}

export async function searchAds(query: string): Promise<DatabaseAdItem[]> {
  const filtered = sampleAds.filter(ad => 
    ad.competitor.toLowerCase().includes(query.toLowerCase()) ||
    ad.headline?.toLowerCase().includes(query.toLowerCase()) ||
    ad.primary_text?.toLowerCase().includes(query.toLowerCase())
  );
  return filtered;
}
