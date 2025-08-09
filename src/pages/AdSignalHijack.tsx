
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DatabaseLiveFeed from "@/components/ad-signal-hijack/DatabaseLiveFeed";
import { insertAdToDatabase } from "@/services/adDatabase";

export default function AdSignalHijack() {
  const { toast } = useToast();

  const handleAddSampleData = async () => {
    const sampleAds = [
      {
        platform: "meta",
        competitor: "Example Co.",
        ad_creative_url: "https://via.placeholder.com/300x200.png?text=Meta+Ad",
        cta: "Sign Up Now",
        offer: "50% Off First Month",
        engagement: { likes: 120, comments: 15, shares: 8 },
        detected_patterns: { angle: "Discount urgency", format: "Static image", theme: "Price-focused" }
      },
      {
        platform: "google",
        competitor: "Test Corp",
        ad_creative_url: null,
        cta: "Get Started",
        offer: "Free Trial",
        engagement: { clicks: 250, impressions: 5000 },
        detected_patterns: { angle: "Risk-free trial", format: "Text search ad", strategy: "Lead generation" }
      },
      {
        platform: "youtube",
        competitor: "Demo Inc",
        ad_creative_url: "https://via.placeholder.com/300x200.png?text=YouTube+Ad",
        cta: "Watch Now",
        offer: "Limited Time Offer",
        engagement: { views: 10000, likes: 450, comments: 23 },
        detected_patterns: { angle: "FOMO", format: "Video ad", theme: "Urgency-driven" }
      }
    ];

    try {
      for (const ad of sampleAds) {
        await insertAdToDatabase(ad);
      }
      toast({
        title: "Sample data added",
        description: "Successfully added sample ads to the database"
      });
    } catch (error) {
      toast({
        title: "Error adding data",
        description: "Failed to add sample ads to the database",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Section - Better alignment */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Ad Signal Hijack</h1>
                <p className="text-muted-foreground mt-1">Real-time competitor ad tracking from database</p>
              </div>
              <Button onClick={handleAddSampleData} className="gap-2 w-fit">
                <Plus className="w-4 h-4" />
                Add Sample Data
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Card className="saas-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Database Ad Feed</h2>
                </div>

                <DatabaseLiveFeed />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
