const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Ad Signal Hijack endpoints
  static async getAds(params?: { platform?: string; competitor?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/ad-signal-hijack${queryString}`);
  }

  static async getAdById(id: number) {
    return this.request(`/ad-signal-hijack/${id}`);
  }

  static async getAdAnalytics() {
    return this.request('/ad-signal-hijack/analytics/summary');
  }

  // Lead Locator endpoints
  static async searchLeads(params: {
    keyword?: string;
    location?: string;
    industry?: string;
    minIntent?: number;
  }) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    return this.request(`/lead-locator/search?${queryString}`);
  }

  static async enrichLead(id: string) {
    return this.request(`/lead-locator/${id}/enrich`, { method: 'POST' });
  }

  // Dominance Map endpoints
  static async getDominanceData(params?: { zip?: string; city?: string; device?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/dominance-map${queryString}`);
  }

  static async getDominanceSummary(params?: { city?: string; state?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/dominance-map/summary${queryString}`);
  }

  // Target Analysis endpoints
  static async getTasks(params?: { status?: string; assignedTo?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/target-analysis/tasks${queryString}`);
  }

  static async generateTasks(context: any) {
    return this.request('/target-analysis/generate', {
      method: 'POST',
      body: JSON.stringify({ context })
    });
  }

  // Change Alerts endpoints
  static async getAlerts(params?: { severity?: string; dismissed?: boolean }) {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    return this.request(`/change-alerts${queryString}`);
  }

  static async dismissAlert(id: number, actionTaken?: string) {
    return this.request(`/change-alerts/${id}/dismiss`, {
      method: 'POST',
      body: JSON.stringify({ actionTaken })
    });
  }

  static async createTaskFromAlert(id: number, taskData: any) {
    return this.request(`/change-alerts/${id}/create-task`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  // Campaign Manager endpoints
  static async getCampaigns(params?: { status?: string; channel?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/campaign-manager${queryString}`);
  }

  static async getCampaignById(id: number) {
    return this.request(`/campaign-manager/${id}`);
  }

  static async createCampaign(campaignData: any) {
    return this.request('/campaign-manager', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  static async updateCampaign(id: number, updateData: any) {
    return this.request(`/campaign-manager/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  static async deleteCampaign(id: number) {
    return this.request(`/campaign-manager/${id}`, {
      method: 'DELETE'
    });
  }

  // CRM endpoints
  static async getCRMData(params?: { type?: string; stage?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/competitive-crm${queryString}`);
  }

  static async getCRMAnalytics() {
    return this.request('/competitive-crm/analytics');
  }

  static async createCRMEntry(data: any) {
    return this.request('/competitive-crm', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
