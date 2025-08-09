
-- Enhance the ads table with more competitive intelligence fields
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS landing_page_url TEXT;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS landing_page_snapshot TEXT; -- Store screenshot URL or base64
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS campaign_type TEXT;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS estimated_spend_daily DECIMAL;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS target_audience JSONB;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS creative_hash TEXT UNIQUE; -- For deduplication
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'; -- active, paused, stopped
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS first_seen TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT now();

-- Create competitors table for tracking competitor profiles
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  dominance_score DECIMAL DEFAULT 0,
  total_ads_count INTEGER DEFAULT 0,
  estimated_monthly_spend DECIMAL DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create leads table for high-intent lead tracking
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  company TEXT,
  title TEXT,
  phone TEXT,
  location_zip TEXT,
  location_city TEXT,
  location_state TEXT,
  intent_score DECIMAL DEFAULT 0,
  source TEXT, -- 'google_trends', 'reddit', 'yelp', etc.
  source_data JSONB, -- Raw signal data
  enrichment_data JSONB, -- Clearbit/Apollo data
  status TEXT DEFAULT 'new', -- new, contacted, qualified, proposal, won, lost
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create market_dominance table for heatmap data
CREATE TABLE IF NOT EXISTS public.market_dominance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zip_code TEXT NOT NULL,
  city TEXT,
  state TEXT,
  competitor_id UUID REFERENCES competitors(id),
  dominance_score DECIMAL DEFAULT 0,
  seo_rank_average DECIMAL,
  ad_presence_score DECIMAL,
  review_score DECIMAL,
  last_calculated TIMESTAMPTZ DEFAULT now(),
  UNIQUE(zip_code, competitor_id)
);

-- Create tasks table for AI-generated actionable tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 1, -- 1-5 scale
  category TEXT, -- 'ad_creative', 'seo', 'lead_gen', 'competitor_analysis'
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  estimated_impact TEXT, -- 'high', 'medium', 'low'
  execution_steps JSONB,
  related_entities JSONB, -- Links to ads, leads, competitors
  assigned_to TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create alerts table for real-time notifications
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'new_ad', 'competitor_change', 'high_intent_lead', 'dominance_shift'
  title TEXT NOT NULL,
  message TEXT,
  severity TEXT DEFAULT 'info', -- info, warning, critical
  data JSONB, -- Alert-specific data
  read BOOLEAN DEFAULT false,
  channels TEXT[], -- 'slack', 'email', 'discord', 'sms'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_dominance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Public access policies (can be restricted later with auth)
CREATE POLICY "Public read access" ON public.competitors FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.competitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.competitors FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.leads FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.market_dominance FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.market_dominance FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.market_dominance FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.tasks FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.alerts FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ads_competitor ON public.ads(competitor);
CREATE INDEX IF NOT EXISTS idx_ads_platform ON public.ads(platform);
CREATE INDEX IF NOT EXISTS idx_ads_status ON public.ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_creative_hash ON public.ads(creative_hash);

CREATE INDEX IF NOT EXISTS idx_leads_intent_score ON public.leads(intent_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_location_zip ON public.leads(location_zip);

CREATE INDEX IF NOT EXISTS idx_market_dominance_zip ON public.market_dominance(zip_code);
CREATE INDEX IF NOT EXISTS idx_market_dominance_score ON public.market_dominance(dominance_score DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON public.alerts(read);
