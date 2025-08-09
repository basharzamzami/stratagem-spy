
import Navigation from "@/components/Navigation";
import PageHeader from "@/components/PageHeader";
import CampaignDashboard from "@/components/campaign-manager/CampaignDashboard";

export default function CampaignManager() {
  return (
    <div className="min-h-screen w-screen bg-background flex overflow-hidden">
      <Navigation />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-shrink-0 p-6 border-b border-border">
          <PageHeader 
            title="Campaign Manager" 
            subtitle="Automated campaign management and optimization" 
          />
        </div>
        <div className="flex-1 overflow-auto p-6">
          <CampaignDashboard />
        </div>
      </div>
    </div>
  );
}
