
-- Create table for storing raw collection data from various sources
CREATE TABLE public.raw_collection_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id TEXT NOT NULL,
  source TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.raw_collection_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is competitive intelligence data)
CREATE POLICY "Public read access" 
  ON public.raw_collection_data 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public insert access" 
  ON public.raw_collection_data 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_raw_collection_data_job_id ON public.raw_collection_data(job_id);
CREATE INDEX idx_raw_collection_data_source ON public.raw_collection_data(source);
CREATE INDEX idx_raw_collection_data_collected_at ON public.raw_collection_data(collected_at);
