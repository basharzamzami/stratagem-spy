
import Navigation from "@/components/Navigation";
import PageHeader from "@/components/PageHeader";
import CampaignDashboard from "@/components/campaign-manager/CampaignDashboard";

export default function CampaignManager() {
  return (
    <div className="min-h-screen w-screen bg-background flex">
      <Navigation />
      <div className="flex-1 min-h-screen w-full overflow-auto">
        <div className="p-8 h-full flex flex-col">
          <PageHeader 
            title="Campaign Manager" 
            subtitle="Automated campaign management and optimization" 
          />
          <div className="flex-1">
            <CampaignDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
