
import Navigation from "@/components/Navigation";
import IntelligenceAlerts from "@/components/specter-net/IntelligenceAlerts";
import { Shield } from "lucide-react";

export default function ChangeAlerts() {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Competitor Change Alerts</h1>
                <p className="text-muted-foreground">Real-time monitoring of competitor strategic changes</p>
              </div>
            </div>
          </div>

          {/* Intelligence Alerts Component */}
          <IntelligenceAlerts />
        </div>
      </div>
    </div>
  );
}
