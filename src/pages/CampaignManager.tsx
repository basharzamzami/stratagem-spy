
import Navigation from "@/components/Navigation";
import PageHeader from "@/components/PageHeader";
import CampaignDashboard from "@/components/campaign-manager/CampaignDashboard";

export default function CampaignManager() {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <PageHeader 
            title="Campaign Manager" 
            subtitle="Automated campaign management and optimization" 
          />
          <CampaignDashboard />
        </div>
      </div>
    </div>
  );
}
