
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Globe, 
  Search, 
  Target, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';
import { LandingPageScraper, LandingPageData, FunnelAnalysis } from '@/services/landingPageScraper';
import { useToast } from '@/hooks/use-toast';

export default function LandingPageScraperComponent() {
  const [singleUrl, setSingleUrl] = useState('');
  const [funnelUrls, setFunnelUrls] = useState('');
  const [isScrapingSingle, setIsScrapingSingle] = useState(false);
  const [isAnalyzingFunnel, setIsAnalyzingFunnel] = useState(false);
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);
  const [funnelAnalysis, setFunnelAnalysis] = useState<FunnelAnalysis | null>(null);
  const { toast } = useToast();

  const scraper = LandingPageScraper.getInstance();

  const handleScrapeSingle = async () => {
    if (!singleUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to scrape",
        variant: "destructive"
      });
      return;
    }

    setIsScrapingSingle(true);
    try {
      const data = await scraper.scrapeLandingPage(singleUrl);
      setLandingPageData(data);
      toast({
        title: "Success",
        description: "Landing page scraped successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape page",
        variant: "destructive"
      });
    } finally {
      setIsScrapingSingle(false);
    }
  };

  const handleAnalyzeFunnel = async () => {
    const urls = funnelUrls.split('\n').filter(url => url.trim());
    if (urls.length === 0) {
      toast({
        title: "Error",
        description: "Please enter URLs for funnel analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzingFunnel(true);
    try {
      const analysis = await scraper.analyzeFunnel(urls);
      setFunnelAnalysis(analysis);
      toast({
        title: "Success",
        description: `Funnel analysis completed for ${urls.length} steps`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze funnel",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingFunnel(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scraper" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scraper" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Landing Page Scraper
          </TabsTrigger>
          <TabsTrigger value="funnel" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Funnel Tracker
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scraper">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scraper Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Scrape Landing Page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="singleUrl">Landing Page URL</Label>
                  <Input
                    id="singleUrl"
                    type="url"
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                    placeholder="https://competitor-landing-page.com"
                  />
                </div>
                <Button 
                  onClick={handleScrapeSingle}
                  disabled={isScrapingSingle}
                  className="w-full"
                >
                  {isScrapingSingle ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Scrape Page
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Scraper Results */}
            {landingPageData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Scrape Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {/* Basic Info */}
                      <div>
                        <h4 className="font-medium mb-2">Page Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Title:</strong> {landingPageData.title}</div>
                          <div><strong>Load Time:</strong> {landingPageData.loadTime}ms</div>
                          <div><strong>SEO Score:</strong> {landingPageData.seoScore}/100</div>
                          <div><strong>Mobile Optimized:</strong> 
                            <Badge variant={landingPageData.mobileOptimized ? "default" : "destructive"} className="ml-2">
                              {landingPageData.mobileOptimized ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Headlines */}
                      <div>
                        <h4 className="font-medium mb-2">Headlines ({landingPageData.headlines.length})</h4>
                        <div className="space-y-1">
                          {landingPageData.headlines.map((headline, i) => (
                            <Badge key={i} variant="outline" className="mr-1 mb-1">{headline}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* CTAs */}
                      <div>
                        <h4 className="font-medium mb-2">Call-to-Actions ({landingPageData.ctas.length})</h4>
                        <div className="space-y-2">
                          {landingPageData.ctas.map((cta, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{cta.text}</span>
                              <div className="flex gap-1">
                                <Badge variant="outline">{cta.type}</Badge>
                                <Badge variant={cta.urgency === 'high' ? 'destructive' : cta.urgency === 'medium' ? 'default' : 'secondary'}>
                                  {cta.urgency}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Social Proof */}
                      <div>
                        <h4 className="font-medium mb-2">Social Proof ({landingPageData.socialProof.length})</h4>
                        <div className="space-y-1">
                          {landingPageData.socialProof.map((proof, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span>{proof.value}</span>
                              <Badge variant="outline" className="text-xs">{proof.source}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Conversion Elements */}
                      <div>
                        <h4 className="font-medium mb-2">Conversion Elements ({landingPageData.conversionElements.length})</h4>
                        <div className="space-y-2">
                          {landingPageData.conversionElements.map((element, i) => (
                            <div key={i} className="p-2 bg-primary/5 rounded border-l-2 border-primary">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{element.type}</Badge>
                                <span className="text-xs text-muted-foreground">{element.position}</span>
                              </div>
                              <div className="text-sm">{element.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Analyze Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="funnelUrls">Funnel URLs (one per line)</Label>
                  <textarea
                    id="funnelUrls"
                    value={funnelUrls}
                    onChange={(e) => setFunnelUrls(e.target.value)}
                    placeholder={`https://competitor.com/landing
https://competitor.com/signup
https://competitor.com/checkout
https://competitor.com/confirmation`}
                    className="w-full h-32 p-3 border rounded-lg resize-none"
                  />
                </div>
                <Button 
                  onClick={handleAnalyzeFunnel}
                  disabled={isAnalyzingFunnel}
                  className="w-full"
                >
                  {isAnalyzingFunnel ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Analyze Funnel
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Funnel Results */}
            {funnelAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Funnel Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-6">
                      {/* Overview */}
                      <div>
                        <h4 className="font-medium mb-3">Overview</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-primary/5 rounded">
                            <div className="text-2xl font-bold text-primary">
                              {funnelAnalysis.totalSteps}
                            </div>
                            <div className="text-xs text-muted-foreground">Total Steps</div>
                          </div>
                          <div className="text-center p-3 bg-green-500/5 rounded">
                            <div className="text-2xl font-bold text-green-400">
                              {(funnelAnalysis.overallConversionRate * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Conversion Rate</div>
                          </div>
                        </div>
                      </div>

                      {/* Drop-off Points */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          Drop-off Points ({funnelAnalysis.dropOffPoints.length})
                        </h4>
                        <div className="space-y-3">
                          {funnelAnalysis.dropOffPoints.map((point, i) => (
                            <div key={i} className="p-3 bg-yellow-500/5 rounded border-l-2 border-yellow-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Step {point.step}</span>
                                <Badge variant="destructive">
                                  {(point.dropOffRate * 100).toFixed(1)}% Drop-off
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                <strong>Possible Reasons:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  {point.possibleReasons.map((reason, j) => (
                                    <li key={j}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <strong>Improvements:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  {point.suggestedImprovements.map((improvement, j) => (
                                    <li key={j}>{improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-medium mb-3">Recommendations</h4>
                        <div className="space-y-2">
                          {funnelAnalysis.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-blue-500/5 rounded">
                              <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Competitor Comparison */}
                      <div>
                        <h4 className="font-medium mb-3">Competitor Comparison</h4>
                        <div className="space-y-3">
                          {funnelAnalysis.competitorComparison.map((comp, i) => (
                            <div key={i} className="p-3 bg-muted/20 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{comp.competitor}</span>
                                <Badge variant="outline">
                                  {(comp.conversionRate * 100).toFixed(1)}% CR
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong className="text-green-400">Strengths:</strong>
                                  <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                    {comp.strengths.map((strength, j) => (
                                      <li key={j}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <strong className="text-red-400">Weaknesses:</strong>
                                  <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                    {comp.weaknesses.map((weakness, j) => (
                                      <li key={j}>{weakness}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
