
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdSignalHijack from "./pages/AdSignalHijack";
import SpecterNetDashboard from "./pages/SpecterNetDashboard";
import LeadLocator from "./pages/LeadLocator";
import DominanceMap from "./pages/DominanceMap";
import TaskGeneratorPage from "./pages/TaskGenerator";
import ChangeAlerts from "./pages/ChangeAlerts";
import CampaignManager from "./pages/CampaignManager";
import CompetitiveCRM from "./pages/CompetitiveCRM";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpecterNetDashboard />} />
          <Route path="/ad-signal-hijack" element={<AdSignalHijack />} />
          <Route path="/lead-locator" element={<LeadLocator />} />
          <Route path="/dominance-map" element={<DominanceMap />} />
          <Route path="/task-generator" element={<TaskGeneratorPage />} />
          <Route path="/change-alerts" element={<ChangeAlerts />} />
          <Route path="/campaign-manager" element={<CampaignManager />} />
          <Route path="/competitive-crm" element={<CompetitiveCRM />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
