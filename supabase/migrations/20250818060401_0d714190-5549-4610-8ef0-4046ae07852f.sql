-- EMERGENCY SECURITY FIX: Secure leads table with user isolation

-- Step 1: Add user_id column to leads table if it doesn't exist
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Update existing records to set a placeholder user_id (for migration)
-- Note: In production, you'd want to properly assign these to actual users
UPDATE public.leads 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL after updating existing records
ALTER TABLE public.leads ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Drop existing insecure public policies
DROP POLICY IF EXISTS "Public read access" ON public.leads;
DROP POLICY IF EXISTS "Public insert access" ON public.leads;
DROP POLICY IF EXISTS "Public update access" ON public.leads;

-- Step 5: Create secure user-specific RLS policies
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 6: Secure other tables similarly
-- Add user_id to competitors table
ALTER TABLE public.competitors ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE public.competitors 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

ALTER TABLE public.competitors ALTER COLUMN user_id SET NOT NULL;

-- Update competitors policies
DROP POLICY IF EXISTS "Public read access" ON public.competitors;
DROP POLICY IF EXISTS "Public insert access" ON public.competitors;
DROP POLICY IF EXISTS "Public update access" ON public.competitors;

CREATE POLICY "Users can view own competitors" ON public.competitors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competitors" ON public.competitors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitors" ON public.competitors
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 7: Secure tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE public.tasks 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

ALTER TABLE public.tasks ALTER COLUMN user_id SET NOT NULL;

-- Update tasks policies
DROP POLICY IF EXISTS "Public read access" ON public.tasks;
DROP POLICY IF EXISTS "Public insert access" ON public.tasks;
DROP POLICY IF EXISTS "Public update access" ON public.tasks;

CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 8: Secure alerts table
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE public.alerts 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

ALTER TABLE public.alerts ALTER COLUMN user_id SET NOT NULL;

-- Update alerts policies
DROP POLICY IF EXISTS "Public read access" ON public.alerts;
DROP POLICY IF EXISTS "Public insert access" ON public.alerts;
DROP POLICY IF EXISTS "Public update access" ON public.alerts;

CREATE POLICY "Users can view own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON public.alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);