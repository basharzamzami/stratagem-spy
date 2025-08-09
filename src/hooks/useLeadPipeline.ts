
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  gatherLeadIntelligence, 
  processLeadThroughPipeline, 
  updateLeadScore,
  matchAndDeduplicateLeads,
  EnhancedLead 
} from '@/services/leadPipeline';
import { useToast } from '@/hooks/use-toast';

export function useLeadPipeline() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Lead intelligence gathering
  const gatherLeads = useCallback(async (filters: {
    industry?: string;
    location?: { city?: string; state?: string; zip?: string };
    keywords?: string[];
    minIntentScore?: number;
  }) => {
    try {
      const leads = await gatherLeadIntelligence(filters);
      toast({
        title: "Intelligence Gathered",
        description: `Found ${leads.length} qualified leads matching your criteria`
      });
      return leads;
    } catch (error) {
      console.error('Error gathering leads:', error);
      toast({
        title: "Error",
        description: "Failed to gather lead intelligence",
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);

  // Process leads through pipeline
  const processLeadsMutation = useMutation({
    mutationFn: async (leads: EnhancedLead[]) => {
      setIsProcessing(true);
      setProcessedCount(0);
      const results = [];

      for (const lead of leads) {
        try {
          // Check for duplicates first
          const { isDuplicate, matchedLead } = await matchAndDeduplicateLeads(lead);
          
          if (isDuplicate && matchedLead) {
            toast({
              title: "Duplicate Detected",
              description: `${lead.name} already exists - enhanced with new data`,
              variant: "default"
            });
            results.push({ lead: matchedLead, tasks: [], isDuplicate: true });
          } else {
            const result = await processLeadThroughPipeline(lead);
            results.push({ ...result, isDuplicate: false });
          }
          
          setProcessedCount(prev => prev + 1);
          
          // Brief delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error processing lead ${lead.name}:`, error);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      setIsProcessing(false);
      const newLeads = results.filter(r => !r.isDuplicate).length;
      const enhancedLeads = results.filter(r => r.isDuplicate).length;
      const totalTasks = results.reduce((sum, r) => sum + (r.tasks?.length || 0), 0);

      toast({
        title: "Pipeline Processing Complete",
        description: `Processed ${newLeads} new leads, enhanced ${enhancedLeads} existing leads, generated ${totalTasks} tasks`
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['crm-stats'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: "Some leads failed to process. Check console for details.",
        variant: "destructive"
      });
    }
  });

  // Lead scoring updates
  const updateScoreMutation = useMutation({
    mutationFn: async ({ leadId, activityData }: {
      leadId: string;
      activityData: {
        activity_type: 'website_visit' | 'email_engagement' | 'content_download' | 'demo_request';
        activity_details: Record<string, any>;
      };
    }) => {
      return await updateLeadScore(leadId, activityData);
    },
    onSuccess: (newScore, { leadId }) => {
      toast({
        title: "Lead Score Updated",
        description: `Lead score updated to ${newScore}`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-journey', leadId] });
    }
  });

  return {
    gatherLeads,
    processLeads: processLeadsMutation.mutate,
    updateLeadScore: updateScoreMutation.mutate,
    isProcessing,
    processedCount,
    isUpdatingScore: updateScoreMutation.isPending
  };
}
