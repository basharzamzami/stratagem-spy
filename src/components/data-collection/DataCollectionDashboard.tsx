
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Database, 
  Globe, 
  Search,
  Star,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  SpecterDataCollector, 
  CollectionConfig, 
  DataCollectionJob 
} from '@/services/dataCollection/specterDataCollector';
import { WebCrawler } from '@/services/dataCollection/webCrawler';

export default function DataCollectionDashboard() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [jobs, setJobs] = useState<DataCollectionJob[]>([]);
  const [collectionProgress, setCollectionProgress] = useState(0);
  const { toast } = useToast();

  const defaultConfig: CollectionConfig = {
    competitors: ['hubspot.com', 'salesforce.com', 'marketo.com'],
    keywords: ['marketing automation', 'lead generation', 'CRM software'],
    geoTargets: ['Miami, FL', 'Austin, TX', 'Seattle, WA'],
    sources: {
      metaAds: true,
      googleAds: true,
      youtubeAds: false,
      seoData: true,
      reviews: true,
      socialListening: false
    },
    scheduleInterval: 60
  };

  const startCollection = async () => {
    setIsCollecting(true);
    setCollectionProgress(0);
    
    try {
      const collector = SpecterDataCollector.getInstance();
      const jobIds = await collector.startCollection(defaultConfig);
      
      toast({
        title: "🚀 Data Collection Started",
        description: `Launched ${jobIds.length} collection jobs`
      });

      // Poll for job updates
      const pollInterval = setInterval(async () => {
        const allJobs = await collector.getAllJobs();
        setJobs(allJobs);
        
        const completedJobs = allJobs.filter(job => 
          job.status === 'completed' || job.status === 'failed'
        );
        
        const progress = allJobs.length > 0 ? (completedJobs.length / allJobs.length) * 100 : 0;
        setCollectionProgress(progress);
        
        if (progress === 100) {
          clearInterval(pollInterval);
          setIsCollecting(false);
          
          const successfulJobs = allJobs.filter(job => job.status === 'completed');
          toast({
            title: "✅ Collection Complete",
            description: `${successfulJobs.length}/${allJobs.length} jobs completed successfully`
          });
        }
      }, 2000);

    } catch (error) {
      console.error('Collection failed:', error);
      toast({
        title: "❌ Collection Failed",
        description: "Unable to start data collection",
        variant: "destructive"
      });
      setIsCollecting(false);
    }
  };

  const stopCollection = async () => {
    const collector = SpecterDataCollector.getInstance();
    const runningJobs = jobs.filter(job => job.status === 'running');
    
    for (const job of runningJobs) {
      await collector.cancelJob(job.id);
    }
    
    setIsCollecting(false);
    toast({
      title: "Collection Stopped",
      description: "All running jobs have been cancelled"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <X className="w-4 h-4 text-destructive" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'meta_ads':
        return <Globe className="w-4 h-4" />;
      case 'google_ads':
        return <Search className="w-4 h-4" />;
      case 'seo_data':
        return <TrendingUp className="w-4 h-4" />;
      case 'reviews':
        return <Star className="w-4 h-4" />;
      case 'social_listening':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Specter Net Data Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Collect competitive intelligence from {Object.values(defaultConfig.sources).filter(Boolean).length} sources
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Monitoring: {defaultConfig.competitors.join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isCollecting && (
                <div className="flex items-center gap-2">
                  <Progress value={collectionProgress} className="w-32" />
                  <span className="text-sm text-primary">{Math.round(collectionProgress)}%</span>
                </div>
              )}
              <Button
                onClick={isCollecting ? stopCollection : startCollection}
                disabled={isCollecting && collectionProgress === 0}
                className={isCollecting ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}
              >
                {isCollecting ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Collection
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Collection
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection Status */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Active Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="results">Collection Results</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <div className="grid gap-4">
            {jobs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Active Jobs</h3>
                  <p className="text-muted-foreground">Start data collection to see job status</p>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getSourceIcon(job.source)}
                        <div>
                          <h4 className="font-medium text-foreground">
                            {job.source.replace('_', ' ').toUpperCase()}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Target: {job.target}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={job.status === 'completed' ? 'default' : 
                                 job.status === 'failed' ? 'destructive' : 'secondary'}
                        >
                          {getStatusIcon(job.status)}
                          {job.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(job.created_at).toLocaleTimeString()}
                          </p>
                          {job.completed_at && (
                            <p className="text-xs text-muted-foreground">
                              Completed: {new Date(job.completed_at).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {job.error && (
                      <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded">
                        <p className="text-sm text-destructive">{job.error}</p>
                      </div>
                    )}
                    {job.results && (
                      <div className="mt-3 p-2 bg-success/10 border border-success/20 rounded">
                        <p className="text-sm text-success">
                          Collected {Array.isArray(job.results) ? job.results.length : 'N/A'} items
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="sources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(defaultConfig.sources).map(([source, enabled]) => (
              <Card key={source} className={enabled ? "border-primary/20" : "border-muted"}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSourceIcon(source)}
                      <div>
                        <h4 className="font-medium text-foreground">
                          {source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {source === 'metaAds' && 'Facebook & Instagram ads transparency'}
                          {source === 'googleAds' && 'Google Ads transparency center'}
                          {source === 'youtubeAds' && 'YouTube video ads metadata'}
                          {source === 'seoData' && 'Keyword rankings & backlinks'}
                          {source === 'reviews' && 'Customer reviews & ratings'}
                          {source === 'socialListening' && 'Social mentions & sentiment'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={enabled ? "default" : "secondary"}>
                      {enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Collection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {jobs.filter(j => j.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {jobs.reduce((sum, job) => 
                      sum + (Array.isArray(job.results) ? job.results.length : 0), 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Items Collected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {defaultConfig.competitors.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Competitors Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {jobs.filter(j => j.status === 'failed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed Jobs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
