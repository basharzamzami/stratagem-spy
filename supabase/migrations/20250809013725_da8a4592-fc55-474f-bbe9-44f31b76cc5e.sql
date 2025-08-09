
-- Create ads table for storing competitor ad data
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- e.g., 'facebook', 'google', 'youtube'
  competitor TEXT NOT NULL,
  ad_creative_url TEXT,
  cta TEXT,
  offer TEXT,
  engagement JSONB, -- likes, comments, shares, views
  detected_patterns JSONB, -- extracted creative/offer patterns
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Allow public read access for now (can be adjusted later for auth)
CREATE POLICY "Public read access" ON public.ads
  FOR SELECT
  USING (true);

-- Allow public insert access for workers/scrapers
CREATE POLICY "Public insert access" ON public.ads
  FOR INSERT
  WITH CHECK (true);
