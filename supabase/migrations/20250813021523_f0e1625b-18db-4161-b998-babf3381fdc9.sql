
-- Phase 1: Emergency Database Security - Replace open policies with proper authentication

-- First, let's add user_id columns to tables that need user-specific access
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.competitors ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update existing data to have a placeholder user_id (you'll need to assign real users later)
-- For now, we'll use a system user approach
UPDATE public.leads SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;
UPDATE public.tasks SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;
UPDATE public.alerts SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;
UPDATE public.competitors SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;

-- Make user_id columns NOT NULL after populating them
ALTER TABLE public.leads ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.alerts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.competitors ALTER COLUMN user_id SET NOT NULL;

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Public read access" ON public.ads;
DROP POLICY IF EXISTS "Public insert access" ON public.ads;
DROP POLICY IF EXISTS "Public update access" ON public.ads;

DROP POLICY IF EXISTS "Public read access" ON public.leads;
DROP POLICY IF EXISTS "Public insert access" ON public.leads;
DROP POLICY IF EXISTS "Public update access" ON public.leads;

DROP POLICY IF EXISTS "Public read access" ON public.tasks;
DROP POLICY IF EXISTS "Public insert access" ON public.tasks;
DROP POLICY IF EXISTS "Public update access" ON public.tasks;

DROP POLICY IF EXISTS "Public read access" ON public.alerts;
DROP POLICY IF EXISTS "Public insert access" ON public.alerts;
DROP POLICY IF EXISTS "Public update access" ON public.alerts;

DROP POLICY IF EXISTS "Public read access" ON public.competitors;
DROP POLICY IF EXISTS "Public insert access" ON public.competitors;
DROP POLICY IF EXISTS "Public update access" ON public.competitors;

DROP POLICY IF EXISTS "Public read access" ON public.market_dominance;
DROP POLICY IF EXISTS "Public insert access" ON public.market_dominance;
DROP POLICY IF EXISTS "Public update access" ON public.market_dominance;

-- Create secure RLS policies for leads (user-specific access)
CREATE POLICY "Users can view their own leads" 
  ON public.leads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads" 
  ON public.leads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" 
  ON public.leads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" 
  ON public.leads 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create secure RLS policies for tasks (user-specific access)
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create secure RLS policies for alerts (user-specific access)
CREATE POLICY "Users can view their own alerts" 
  ON public.alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts" 
  ON public.alerts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
  ON public.alerts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" 
  ON public.alerts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create secure RLS policies for competitors (user-specific access)
CREATE POLICY "Users can view their own competitors" 
  ON public.competitors 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own competitors" 
  ON public.competitors 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own competitors" 
  ON public.competitors 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own competitors" 
  ON public.competitors 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Ads table: Read-only access for authenticated users (shared data)
CREATE POLICY "Authenticated users can view ads" 
  ON public.ads 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert ads" 
  ON public.ads 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update ads" 
  ON public.ads 
  FOR UPDATE 
  USING (true);

-- Market dominance: Read-only access for authenticated users (shared data)
CREATE POLICY "Authenticated users can view market dominance" 
  ON public.market_dominance 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert market dominance" 
  ON public.market_dominance 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update market dominance" 
  ON public.market_dominance 
  FOR UPDATE 
  USING (true);

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the existing trigger function to be more secure
CREATE OR REPLACE FUNCTION public.generate_follow_up_tasks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS leads_status_change_trigger ON public.leads;
CREATE TRIGGER leads_status_change_trigger
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_follow_up_tasks();
