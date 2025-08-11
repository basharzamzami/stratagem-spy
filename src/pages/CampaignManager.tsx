
import Navigation from "@/components/Navigation";
import PageHeader from "@/components/PageHeader";
import CampaignDashboard from "@/components/campaign-manager/CampaignDashboard";

export default function CampaignManager() {
  return (
    <div className="min-h-screen w-full bg-background flex overflow-hidden">
      <Navigation activePanel="campaign-manager" />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 border-b border-border">
          <PageHeader 
            title="Campaign Manager" 
            subtitle="Automated campaign management and optimization" 
          />
        </div>
        <div className="flex-1 min-h-0 overflow-auto p-4">
          <CampaignDashboard />
        </div>
      </div>
    </div>
  );
}
