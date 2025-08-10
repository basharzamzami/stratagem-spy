
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Globe, Zap } from 'lucide-react';
import DataCollectionDashboard from '@/components/data-collection/DataCollectionDashboard';

export default function DataCollectionPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              Specter Net Data Collection
            </h1>
            <p className="text-muted-foreground mt-2">
              Automated competitive intelligence gathering from multiple sources
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-8 h-8 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">API Integration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Direct access to Meta Ads Library, Google Ads Transparency, YouTube Data API, 
                and major SEO/review platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-foreground">Smart Crawling</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ethical web crawling with rate limiting, robots.txt compliance, 
                and intelligent data extraction.
              </p>
            </CardContent>
          </Card>

          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-8 h-8 text-success" />
                <h3 className="text-lg font-semibold text-foreground">Data Pipeline</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automated ETL processes with raw data storage, structured processing, 
                and real-time analytics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <DataCollectionDashboard />
      </div>
    </div>
  );
}
