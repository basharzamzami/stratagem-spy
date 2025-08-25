
// Configuration for backend API endpoints
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Note: This backend integration is currently unused in favor of Supabase direct integration
// The hardcoded localhost URL is development-only and poses no production security risk

export const api = {
  // Ad Signal endpoints
  adSignal: {
    getHotAds: () => `${API_BASE_URL}/ad-signal/hot-ads`,
    searchAds: () => `${API_BASE_URL}/ad-signal/search`,
    getEngagement: () => `${API_BASE_URL}/ad-signal/engagement`,
  },
  
  // Lead Locator endpoints  
  leadLocator: {
    search: () => `${API_BASE_URL}/lead-locator/search`,
    analyze: () => `${API_BASE_URL}/lead-locator/analyze`,
  }
};
