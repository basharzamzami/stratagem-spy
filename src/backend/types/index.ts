
export interface AdItem {
  id: number;
  platform: 'Meta' | 'Google' | 'YouTube' | 'TikTok';
  competitor: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  date: string;
  engagement: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  creative_type: 'image' | 'video' | 'carousel';
  active: boolean;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  contact: string;
  phone?: string;
  location: string;
  industry: string;
  companySize: string;
  intentScore: number;
  keywords: string[];
  lastActivity: string;
  source: string;
  enrichment?: any;
}

export interface DominanceData {
  zip: string;
  city: string;
  state: string;
  seoRank: number;
  adPresence: number;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  marketShare: number;
  competitorCount: number;
}

export interface Task {
  id: number;
  title: string;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedTo: string;
  priority: 1 | 2 | 3 | 4 | 5;
  notes: string;
  estimatedImpact: 'low' | 'medium' | 'high';
  effortHours: number;
  steps: string[];
  linkedEntities: any[];
  createdAt: string;
  dueDate?: string;
}

export interface Alert {
  id: number;
  type: 'competitor_change' | 'market_shift' | 'keyword_loss' | 'ad_change';
  competitor: string;
  summary: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  dismissed: boolean;
  actionTaken?: string;
}

export interface Campaign {
  id: number;
  name: string;
  channel: 'google' | 'meta' | 'youtube' | 'tiktok';
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  kpis: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  targeting: {
    locations: string[];
    demographics: string[];
    interests: string[];
  };
}

export interface CRMData {
  id: string;
  type: 'contact' | 'deal' | 'company';
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  value?: number;
  stage?: string;
  probability?: number;
  lastContact: string;
  notes: string[];
  tags: string[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
