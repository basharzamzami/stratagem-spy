
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, ExternalLink, TrendingUp, AlertTriangle } from 'lucide-react';
import AdCard from '@/components/AdCard';
import CompetitorMetrics from '@/components/CompetitorMetrics';

const AdSignalDashboard = () => {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Ad Signal Hijack</h1>
          <p className="text-muted-foreground">Track and analyze competitor advertising campaigns in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
            Live Monitoring
          </Badge>
          <Button variant="default">
            <Eye className="w-4 h-4 mr-2" />
            Watch New Ads
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ad Intelligence Filters</CardTitle>
          <CardDescription>Search and filter competitor ads by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search by competitor, keyword, or ad copy..." 
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <CompetitorMetrics />

      {/* Ad Tracking Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Campaigns</TabsTrigger>
          <TabsTrigger value="new">New Ads (24h)</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            <AdCard 
              competitor="TechCorp Solutions"
              platform="Google Ads"
              headline="Revolutionary Software Solutions"
              description="Transform your business with cutting-edge technology. 50% off first month!"
              cta="Get Started Now"
              status="active"
              spend="$12,500/day"
              impressions="450K"
              engagement="3.2%"
            />
            <AdCard 
              competitor="Digital Innovate"
              platform="Meta Ads"
              headline="Scale Your Business Fast"
              description="Join 10,000+ companies using our platform. Free trial available."
              cta="Try Free Today"
              status="active"
              spend="$8,200/day"
              impressions="320K"
              engagement="4.1%"
            />
            <AdCard 
              competitor="Growth Masters"
              platform="LinkedIn Ads"
              headline="B2B Lead Generation Experts"
              description="Generate quality leads with our proven system. Book a free consultation."
              cta="Book Consultation"
              status="active"
              spend="$5,800/day"
              impressions="180K"
              engagement="2.8%"
            />
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">New Ads in Last 24 Hours</h3>
            <p className="text-muted-foreground">34 new competitor ads detected and analyzed</p>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Trending Ad Strategies</h3>
            <p className="text-muted-foreground">Discover what's working in your industry right now</p>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Alerts</h3>
            <p className="text-muted-foreground">3 new alerts require your attention</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdSignalDashboard;
