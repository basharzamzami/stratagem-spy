import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Import all pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdSignalHijack from "./pages/AdSignalHijack";
import LeadLocator from "./pages/LeadLocator";
import DominanceMap from "./pages/DominanceMap";
import TargetAnalysisPage from "./pages/TargetAnalysisPage";
import ChangeAlerts from "./pages/ChangeAlerts";
import CampaignManager from "./pages/CampaignManager";
import CompetitiveCRM from "./pages/CompetitiveCRM";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/ad-signal-hijack" element={
              <ProtectedRoute>
                <AdSignalHijack />
              </ProtectedRoute>
            } />
            <Route path="/lead-locator" element={
              <ProtectedRoute>
                <LeadLocator />
              </ProtectedRoute>
            } />
            <Route path="/dominance-map" element={
              <ProtectedRoute>
                <DominanceMap />
              </ProtectedRoute>
            } />
            <Route path="/target-analysis" element={
              <ProtectedRoute>
                <TargetAnalysisPage />
              </ProtectedRoute>
            } />
            <Route path="/change-alerts" element={
              <ProtectedRoute>
                <ChangeAlerts />
              </ProtectedRoute>
            } />
            <Route path="/campaign-manager" element={
              <ProtectedRoute>
                <CampaignManager />
              </ProtectedRoute>
            } />
            <Route path="/competitive-crm" element={
              <ProtectedRoute>
                <CompetitiveCRM />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
