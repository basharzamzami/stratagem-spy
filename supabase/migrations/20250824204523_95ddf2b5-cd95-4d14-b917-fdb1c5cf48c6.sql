
-- Phase 1: Remove public access and add user isolation to sensitive tables

-- 1. Drop existing public policies on sensitive tables
DROP POLICY IF EXISTS "Public read access" ON public.ads;
DROP POLICY IF EXISTS "Public insert access" ON public.ads;
DROP POLICY IF EXISTS "Public read access" ON public.lead_journey;
DROP POLICY IF EXISTS "Public insert access" ON public.lead_journey;
DROP POLICY IF EXISTS "Public update access" ON public.lead_journey;
DROP POLICY IF EXISTS "Public read access" ON public.lead_sources;
DROP POLICY IF EXISTS "Public insert access" ON public.lead_sources;
DROP POLICY IF EXISTS "Public update access" ON public.lead_sources;
DROP POLICY IF EXISTS "Public read access" ON public.external_crm_sync;
DROP POLICY IF EXISTS "Public insert access" ON public.external_crm_sync;
DROP POLICY IF EXISTS "Public update access" ON public.external_crm_sync;
DROP POLICY IF EXISTS "Public read access" ON public.follow_up_tasks;
DROP POLICY IF EXISTS "Public insert access" ON public.follow_up_tasks;
DROP POLICY IF EXISTS "Public update access" ON public.follow_up_tasks;
DROP POLICY IF EXISTS "Public read access" ON public.raw_collection_data;
DROP POLICY IF EXISTS "Public insert access" ON public.raw_collection_data;
DROP POLICY IF EXISTS "Public read access" ON public.market_dominance;
DROP POLICY IF EXISTS "Public insert access" ON public.market_dominance;
DROP POLICY IF EXISTS "Public update access" ON public.market_dominance;

-- 2. Add user_id columns to tables that don't have them
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.lead_journey ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.lead_sources ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.external_crm_sync ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.follow_up_tasks ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.raw_collection_data ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.market_dominance ADD COLUMN IF NOT EXISTS user_id UUID;

-- 3. Create a system user for existing data (using a fixed UUID)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'system@specterinsights.com',
  '$2a$10$placeholder',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System User"}',
  false
) ON CONFLICT (id) DO NOTHING;

-- 4. Update existing records to use system user
UPDATE public.ads SET user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE user_id IS NULL;
UPDATE public.lead_journey SET user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE user_id IS NULL;
UPDATE public.lead_sources SET user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE user_id IS NULL;
UPDATE public.external_crm_sync SET user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE user_id IS NULL;
UPDATE public.follow_up_tasks SET user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE user_id IS NULL;
UPDATE public.raw_collection_data SET user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE user_id IS NULL;
UPDATE public.market_dominance SET user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE user_id IS NULL;

-- 5. Make user_id NOT NULL
ALTER TABLE public.ads ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.lead_journey ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.lead_sources ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.external_crm_sync ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.follow_up_tasks ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.raw_collection_data ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.market_dominance ALTER COLUMN user_id SET NOT NULL;

-- 6. Create secure RLS policies for ads table
CREATE POLICY "Users can view their own ads" ON public.ads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ads" ON public.ads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ads" ON public.ads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ads" ON public.ads
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Create secure RLS policies for lead_journey table
CREATE POLICY "Users can view their own lead journey" ON public.lead_journey
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lead journey" ON public.lead_journey
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead journey" ON public.lead_journey
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead journey" ON public.lead_journey
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Create secure RLS policies for lead_sources table
CREATE POLICY "Users can view their own lead sources" ON public.lead_sources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lead sources" ON public.lead_sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead sources" ON public.lead_sources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead sources" ON public.lead_sources
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Create secure RLS policies for external_crm_sync table
CREATE POLICY "Users can view their own crm sync" ON public.external_crm_sync
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crm sync" ON public.external_crm_sync
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crm sync" ON public.external_crm_sync
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crm sync" ON public.external_crm_sync
  FOR DELETE USING (auth.uid() = user_id);

-- 10. Create secure RLS policies for follow_up_tasks table
CREATE POLICY "Users can view their own follow up tasks" ON public.follow_up_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own follow up tasks" ON public.follow_up_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own follow up tasks" ON public.follow_up_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own follow up tasks" ON public.follow_up_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- 11. Create secure RLS policies for raw_collection_data table
CREATE POLICY "Users can view their own collection data" ON public.raw_collection_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collection data" ON public.raw_collection_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collection data" ON public.raw_collection_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collection data" ON public.raw_collection_data
  FOR DELETE USING (auth.uid() = user_id);

-- 12. Create secure RLS policies for market_dominance table
CREATE POLICY "Users can view their own market dominance" ON public.market_dominance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own market dominance" ON public.market_dominance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own market dominance" ON public.market_dominance
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own market dominance" ON public.market_dominance
  FOR DELETE USING (auth.uid() = user_id);

-- Phase 2: Secure the database function
CREATE OR REPLACE FUNCTION public.generate_follow_up_tasks()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Generate follow-up task when lead status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.tasks (
      title,
      description,
      category,
      priority,
      status,
      related_entities,
      user_id
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
      jsonb_build_object('lead_id', NEW.id, 'trigger_type', 'status_change'),
      NEW.user_id
    );
    
    -- Link the task to follow_up_tasks
    INSERT INTO public.follow_up_tasks (
      lead_id,
      task_id,
      trigger_type,
      trigger_condition,
      user_id
    ) SELECT 
      NEW.id,
      t.id,
      'status_change',
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status),
      NEW.user_id
    FROM public.tasks t 
    WHERE t.related_entities->>'lead_id' = NEW.id::text 
    AND t.created_at > NOW() - INTERVAL '1 minute'
    AND t.user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_generate_follow_up_tasks ON public.leads;
CREATE TRIGGER trigger_generate_follow_up_tasks
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_follow_up_tasks();
