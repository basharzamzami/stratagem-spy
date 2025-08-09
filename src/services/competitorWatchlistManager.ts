
import { supabase } from "@/integrations/supabase/client";

export interface CompetitorWatchlistEntry {
  id: string;
  competitor_id: string;
  name: string;
  platform: 'facebook' | 'google' | 'youtube' | 'tiktok' | 'linkedin';
  status: 'active' | 'paused' | 'inactive';
  poll_interval: number; // seconds
  created_at: string;
  updated_at: string;
}

class CompetitorWatchlistManager {
  
  async addCompetitor(
    competitorId: string,
    name: string,
    platform: CompetitorWatchlistEntry['platform'],
    pollInterval: number = 120
  ): Promise<CompetitorWatchlistEntry> {
    
    const { data, error } = await supabase
      .from('competitors_watchlist')
      .insert({
        competitor_id: competitorId,
        name,
        platform,
        poll_interval: pollInterval,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      competitor_id: data.competitor_id,
      name: data.name,
      platform: data.platform,
      status: data.status,
      poll_interval: data.poll_interval,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  async getActiveCompetitors(): Promise<CompetitorWatchlistEntry[]> {
    const { data, error } = await supabase
      .from('competitors_watchlist')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  }

  async getAllCompetitors(): Promise<CompetitorWatchlistEntry[]> {
    const { data, error } = await supabase
      .from('competitors_watchlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  }

  async updateCompetitorStatus(
    competitorId: string, 
    status: CompetitorWatchlistEntry['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('competitors_watchlist')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('competitor_id', competitorId);

    if (error) throw error;
  }

  async updatePollInterval(competitorId: string, pollInterval: number): Promise<void> {
    const { error } = await supabase
      .from('competitors_watchlist')
      .update({ 
        poll_interval: pollInterval,
        updated_at: new Date().toISOString()
      })
      .eq('competitor_id', competitorId);

    if (error) throw error;
  }

  async removeCompetitor(competitorId: string): Promise<void> {
    const { error } = await supabase
      .from('competitors_watchlist')
      .delete()
      .eq('competitor_id', competitorId);

    if (error) throw error;
  }

  async seedDefaultWatchlist(): Promise<void> {
    const defaultCompetitors = [
      { competitor_id: 'hubspot', name: 'HubSpot', platform: 'facebook' as const },
      { competitor_id: 'salesforce', name: 'Salesforce', platform: 'facebook' as const },
      { competitor_id: 'marketo', name: 'Marketo', platform: 'google' as const },
      { competitor_id: 'activecampaign', name: 'ActiveCampaign', platform: 'linkedin' as const },
      { competitor_id: 'pardot', name: 'Pardot', platform: 'google' as const }
    ];

    for (const competitor of defaultCompetitors) {
      try {
        await this.addCompetitor(
          competitor.competitor_id,
          competitor.name,
          competitor.platform
        );
      } catch (error) {
        console.log(`Competitor ${competitor.competitor_id} already exists or failed to add`);
      }
    }
  }
}

export const competitorWatchlistManager = new CompetitorWatchlistManager();
