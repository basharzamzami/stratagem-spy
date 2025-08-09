
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
  
  // Using mock data since the competitors_watchlist table doesn't exist yet
  private mockData: CompetitorWatchlistEntry[] = [
    {
      id: '1',
      competitor_id: 'hubspot',
      name: 'HubSpot',
      platform: 'facebook',
      status: 'active',
      poll_interval: 120,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      competitor_id: 'salesforce',
      name: 'Salesforce',
      platform: 'facebook',
      status: 'active',
      poll_interval: 120,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  async addCompetitor(
    competitorId: string,
    name: string,
    platform: CompetitorWatchlistEntry['platform'],
    pollInterval: number = 120
  ): Promise<CompetitorWatchlistEntry> {
    
    // Mock implementation - in production this would use Supabase
    const newEntry: CompetitorWatchlistEntry = {
      id: Math.random().toString(36).substr(2, 9),
      competitor_id: competitorId,
      name,
      platform,
      poll_interval: pollInterval,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.mockData.push(newEntry);
    return newEntry;
  }

  async getActiveCompetitors(): Promise<CompetitorWatchlistEntry[]> {
    // Mock implementation
    return this.mockData.filter(entry => entry.status === 'active');
  }

  async getAllCompetitors(): Promise<CompetitorWatchlistEntry[]> {
    // Mock implementation
    return [...this.mockData];
  }

  async updateCompetitorStatus(
    competitorId: string, 
    status: CompetitorWatchlistEntry['status']
  ): Promise<void> {
    // Mock implementation
    const entry = this.mockData.find(e => e.competitor_id === competitorId);
    if (entry) {
      entry.status = status;
      entry.updated_at = new Date().toISOString();
    }
  }

  async updatePollInterval(competitorId: string, pollInterval: number): Promise<void> {
    // Mock implementation
    const entry = this.mockData.find(e => e.competitor_id === competitorId);
    if (entry) {
      entry.poll_interval = pollInterval;
      entry.updated_at = new Date().toISOString();
    }
  }

  async removeCompetitor(competitorId: string): Promise<void> {
    // Mock implementation
    const index = this.mockData.findIndex(e => e.competitor_id === competitorId);
    if (index > -1) {
      this.mockData.splice(index, 1);
    }
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
        // Check if already exists
        const exists = this.mockData.some(e => e.competitor_id === competitor.competitor_id);
        if (!exists) {
          await this.addCompetitor(
            competitor.competitor_id,
            competitor.name,
            competitor.platform
          );
        }
      } catch (error) {
        console.log(`Competitor ${competitor.competitor_id} already exists or failed to add`);
      }
    }
  }
}

export const competitorWatchlistManager = new CompetitorWatchlistManager();
