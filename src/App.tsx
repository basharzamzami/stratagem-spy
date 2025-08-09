
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Index from "./pages/Index";
import AdSignalHijack from "./pages/AdSignalHijack";
import EnhancedAdSignalHijack from "./pages/EnhancedAdSignalHijack";
import HotAdWarRoom from "./pages/HotAdWarRoom";
import LeadLocator from "./pages/LeadLocator";
import DominanceMap from "./pages/DominanceMap";
import TaskGenerator from "./pages/TaskGenerator";
import ChangeAlerts from "./pages/ChangeAlerts";
import CampaignManager from "./pages/CampaignManager";
import CompetitiveCRM from "./pages/CompetitiveCRM";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen min-w-full bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ad-signal-hijack" element={<EnhancedAdSignalHijack />} />
            <Route path="/hot-ad-war-room" element={<HotAdWarRoom />} />
            <Route path="/lead-locator" element={<LeadLocator />} />
            <Route path="/dominance-map" element={<DominanceMap />} />
            <Route path="/task-generator" element={<TaskGenerator />} />
            <Route path="/change-alerts" element={<ChangeAlerts />} />
            <Route path="/campaign-manager" element={<CampaignManager />} />
            <Route path="/competitive-crm" element={<CompetitiveCRM />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
