
import React, { createContext, useContext, useState } from 'react';
import { 
  mockHotAds, 
  mockWarmLeads, 
  mockRealTimeActivities, 
  mockCampaignMetrics,
  mockCompetitorInsights,
  mockAlerts,
  mockTasks,
  mockAnalyticsData
} from '@/services/mockAdData';

interface MockDataContextType {
  hotAds: typeof mockHotAds;
  warmLeads: typeof mockWarmLeads;
  realTimeActivities: typeof mockRealTimeActivities;
  campaignMetrics: typeof mockCampaignMetrics;
  competitorInsights: typeof mockCompetitorInsights;
  alerts: typeof mockAlerts;
  tasks: typeof mockTasks;
  analyticsData: typeof mockAnalyticsData;
  refreshData: () => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const value: MockDataContextType = {
    hotAds: mockHotAds,
    warmLeads: mockWarmLeads,
    realTimeActivities: mockRealTimeActivities,
    campaignMetrics: mockCampaignMetrics,
    competitorInsights: mockCompetitorInsights,
    alerts: mockAlerts,
    tasks: mockTasks,
    analyticsData: mockAnalyticsData,
    refreshData
  };

  return (
    <MockDataContext.Provider value={value} key={refreshKey}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
