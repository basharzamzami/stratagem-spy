import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, Zap, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useLeadPipeline } from '@/hooks/useLeadPipeline';
import {
  gatherLeadIntelligence,
  processLeadThroughPipeline,
  updateLeadScore,
  matchAndDeduplicateLeads,
  EnhancedLead
} from '@/services/leadPipeline';

interface LeadFilters {
  industry: string;
  location: {
    city: string;
    state: string;
    zip: string;
  };
  companySize: string;
  minIntentScore: number;
}

interface MockLead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  companySize: string;
  intentScore: number;
  keywords: string[];
  lastActivity: string;
}

export default function LeadLocator() {
  const [filters, setFilters] = useState<LeadFilters>({
    industry: '',
    location: { city: '', state: '', zip: '' },
    companySize: '',
    minIntentScore: 70
  });
  const [mockData, setMockData] = useState<MockLead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { gatherLeads, processLeads, isProcessing, processedCount } = useLeadPipeline();
  const { toast } = useToast();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationKey = name.split('.')[1];
      setFilters(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationKey]: value
        }
      }));
    } else if (name === 'minIntentScore') {
      setFilters(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    }
    else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const filteredData = mockData.filter(lead => {
    const matchesIndustry = !filters.industry || lead.industry.toLowerCase().includes(filters.industry.toLowerCase());
    const matchesLocation = !filters.location.city || lead.location.toLowerCase().includes(filters.location.city.toLowerCase());
    return matchesIndustry && matchesLocation;
  });

  const handleIntelligenceSearch = async () => {
    console.log('Starting intelligence search with filters:', filters);
    setIsLoading(true);

    try {
      const leads = await gatherLeads({
        industry: filters.industry,
        location: filters.location,
        keywords: filters.industry ? [filters.industry] : undefined,
        minIntentScore: filters.minIntentScore
      });

      setMockData(leads.map(lead => ({
        id: lead.id,
        name: lead.name,
        company: lead.company,
        title: lead.title || '',
        email: lead.email,
        phone: lead.phone || '',
        location: `${lead.location_city}, ${lead.location_state}`,
        industry: lead.enrichment_data?.industry || filters.industry || 'Technology',
        companySize: lead.enrichment_data?.company_size || '50-200',
        intentScore: lead.intent_score,
        keywords: lead.keywords,
        lastActivity: '2024-01-15'
      })));

      setHasSearched(true);
    } catch (error) {
      console.error("Error during intelligence search:", error);
      toast({
        title: "Search Error",
        description: "Failed to gather lead intelligence. Please check your filters and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessSelectedLeads = () => {
    const leadsToProcess = mockData
      .filter(lead => selectedLeads.includes(lead.id))
      .map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        title: lead.title,
        phone: lead.phone,
        location_city: lead.location.split(',')[0]?.trim() || '',
        location_state: lead.location.split(',')[1]?.trim() || '',
        intent_score: lead.intentScore,
        keywords: lead.keywords,
        source: 'lead_locator' as const,
        source_data: {
          search_filters: filters,
          discovery_method: 'intelligence_search',
          search_timestamp: new Date().toISOString()
        },
        enrichment_data: {
          industry: lead.industry,
          company_size: lead.companySize
        },
        status: 'new'
      }));

    if (leadsToProcess.length > 0) {
      processLeads(leadsToProcess);
      setSelectedLeads([]);
      toast({
        title: "Processing Leads",
        description: `Processing ${leadsToProcess.length} leads through intelligence pipeline`
      });
    }
  };

  const mockIndustries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing"
  ];

  const mockCompanySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501+"
  ];

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Lead Intelligence Locator</h1>
              <p className="text-muted-foreground mt-2">
                Advanced lead discovery using competitive intelligence and intent signals
              </p>
            </div>
            <div className="flex gap-3">
              {selectedLeads.length > 0 && (
                <Button onClick={handleProcessSelectedLeads} disabled={isProcessing}>
                  <Zap className="w-4 h-4 mr-2" />
                  Process {selectedLeads.length} Leads
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                  <div>
                    <div className="font-medium">Processing leads through AI pipeline...</div>
                    <div className="text-sm text-muted-foreground">
                      Processed {processedCount} leads • Creating journey maps and generating tasks
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Stats with Intelligence Metrics */}
          {hasSearched && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Prospects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{filteredData.length}</div>
                  <div className="text-sm text-muted-foreground">Intelligence-verified</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">High Intent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {filteredData.filter(lead => lead.intentScore >= 80).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Strong buying signals</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Intent Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {filteredData.length > 0 ? Math.round(filteredData.reduce((sum, lead) => sum + lead.intentScore, 0) / filteredData.length) : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall lead quality</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Top Industry</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    {filters.industry || 'Technology'}
                  </div>
                  <div className="text-sm text-muted-foreground">Dominant segment</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Selected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{selectedLeads.length}</div>
                  <div className="text-sm text-muted-foreground">Ready for processing</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Intelligence Search Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select name="industry" value={filters.industry} onValueChange={(value) => handleFilterChange({ target: { name: 'industry', value } } as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockIndustries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location.city">City</Label>
                  <Input
                    type="text"
                    name="location.city"
                    id="location.city"
                    value={filters.location.city}
                    onChange={handleFilterChange}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label htmlFor="location.state">State</Label>
                  <Input
                    type="text"
                    name="location.state"
                    id="location.state"
                    value={filters.location.state}
                    onChange={handleFilterChange}
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <Label htmlFor="location.zip">Zip Code</Label>
                  <Input
                    type="text"
                    name="location.zip"
                    id="location.zip"
                    value={filters.location.zip}
                    onChange={handleFilterChange}
                    placeholder="Enter zip code"
                  />
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select name="companySize" value={filters.companySize} onValueChange={(value) => handleFilterChange({ target: { name: 'companySize', value } } as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCompanySizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minIntentScore">Min. Intent Score</Label>
                  <Input
                    type="number"
                    name="minIntentScore"
                    id="minIntentScore"
                    value={filters.minIntentScore}
                    onChange={handleFilterChange}
                    placeholder="Enter minimum score"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  onClick={handleIntelligenceSearch}
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Start Intelligence Search
                    </>
                  )}
                </Button>

                <Button variant="outline" size="lg">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Results Table with Selection */}
          {hasSearched && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Intelligence Search Results</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allIds = filteredData.map(lead => lead.id);
                        setSelectedLeads(selectedLeads.length === allIds.length ? [] : allIds);
                      }}
                    >
                      {selectedLeads.length === filteredData.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Company Size</TableHead>
                      <TableHead>Intent Score</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLeads([...selectedLeads, lead.id]);
                              } else {
                                setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>{lead.title}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.location}</TableCell>
                        <TableCell>{lead.industry}</TableCell>
                        <TableCell>{lead.companySize}</TableCell>
                        <TableCell>{lead.intentScore}</TableCell>
                        <TableCell>{lead.lastActivity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
