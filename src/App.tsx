
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdSignalHijack from "./pages/AdSignalHijack";
import SpecterNetDashboard from "./pages/SpecterNetDashboard";
import LeadLocator from "./pages/LeadLocator";

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
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
