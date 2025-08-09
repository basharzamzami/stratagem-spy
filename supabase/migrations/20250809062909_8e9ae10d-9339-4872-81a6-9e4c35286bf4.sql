
-- Create lead_sources table to track aggregated sources
CREATE TABLE IF NOT EXISTS public.lead_sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  source_type text NOT NULL, -- 'lead_locator', 'campaign_manager', 'ad_signal_hijack'
  source_id text NOT NULL,
  source_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create lead_journey table for keyword → touchpoint → conversion tracking
CREATE TABLE IF NOT EXISTS public.lead_journey (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  stage text NOT NULL, -- 'keyword', 'touchpoint', 'conversion'
  stage_data jsonb NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  sequence_order integer DEFAULT 0
);

-- Create follow_up_tasks table for auto-generated tasks
CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  trigger_type text NOT NULL, -- 'status_change', 'time_based', 'score_change'
  trigger_condition jsonb,
  auto_generated boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create external_crm_sync table for HubSpot/Pipedrive integration
CREATE TABLE IF NOT EXISTS public.external_crm_sync (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  crm_type text NOT NULL, -- 'hubspot', 'pipedrive'
  external_id text NOT NULL,
  sync_status text DEFAULT 'pending', -- 'pending', 'synced', 'error'
  last_synced timestamp with time zone,
  sync_data jsonb,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_crm_sync ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (matching existing pattern)
CREATE POLICY "Public read access" ON public.lead_sources FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.lead_sources FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.lead_sources FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.lead_journey FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.lead_journey FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.lead_journey FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.follow_up_tasks FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.follow_up_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.follow_up_tasks FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.external_crm_sync FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.external_crm_sync FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.external_crm_sync FOR UPDATE USING (true);

-- Create indexes for performance
CREATE INDEX idx_lead_sources_lead_id ON public.lead_sources(lead_id);
CREATE INDEX idx_lead_sources_type ON public.lead_sources(source_type);
CREATE INDEX idx_lead_journey_lead_id ON public.lead_journey(lead_id);
CREATE INDEX idx_lead_journey_stage ON public.lead_journey(stage);
CREATE INDEX idx_follow_up_tasks_lead_id ON public.follow_up_tasks(lead_id);
CREATE INDEX idx_external_crm_sync_lead_id ON public.external_crm_sync(lead_id);
CREATE INDEX idx_external_crm_sync_type ON public.external_crm_sync(crm_type);

-- Add trigger function for auto follow-up task generation
CREATE OR REPLACE FUNCTION generate_follow_up_tasks()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate follow-up task when lead status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.tasks (
      title,
      description,
      category,
      priority,
      status,
      related_entities
    ) VALUES (
      'Follow up on ' || NEW.name || ' - Status: ' || NEW.status,
      'Automated follow-up task for lead status change from ' || OLD.status || ' to ' || NEW.status,
      'follow_up',
      CASE 
        WHEN NEW.status = 'qualified' THEN 5
        WHEN NEW.status = 'contacted' THEN 3
        ELSE 2
      END,
      'pending',
      jsonb_build_object('lead_id', NEW.id, 'trigger_type', 'status_change')
    );
    
    -- Link the task to follow_up_tasks
    INSERT INTO public.follow_up_tasks (
      lead_id,
      task_id,
      trigger_type,
      trigger_condition
    ) SELECT 
      NEW.id,
      t.id,
      'status_change',
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    FROM public.tasks t 
    WHERE t.related_entities->>'lead_id' = NEW.id::text 
    AND t.created_at > NOW() - INTERVAL '1 minute';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto follow-up task generation
DROP TRIGGER IF EXISTS trigger_generate_follow_up_tasks ON public.leads;
CREATE TRIGGER trigger_generate_follow_up_tasks
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION generate_follow_up_tasks();
