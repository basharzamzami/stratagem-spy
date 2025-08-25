
-- Add missing DELETE policies for user data management
-- This ensures users can delete their own records, improving data quality and GDPR compliance

-- Add DELETE policy for leads table
CREATE POLICY "Users can delete their own leads" 
  ON public.leads 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add DELETE policy for competitors table  
CREATE POLICY "Users can delete their own competitors" 
  ON public.competitors 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add DELETE policy for tasks table
CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add DELETE policy for alerts table
CREATE POLICY "Users can delete their own alerts" 
  ON public.alerts 
  FOR DELETE 
  USING (auth.uid() = user_id);
