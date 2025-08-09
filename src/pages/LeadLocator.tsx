
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Target, TrendingUp, Plus, Download, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  email?: string;
  location: string;
  intentScore: number;
  keywords: string[];
  source: string;
  lastActivity: string;
  companySize: string;
  industry: string;
  revenue?: string;
  status: 'new' | 'qualified' | 'contacted' | 'converted';
}

interface SearchFilters {
  industry: string;
  location: string;
  minIntentScore: number;
  companySize: string;
  keywords: string;
}

const fetchLeads = async (filters: SearchFilters): Promise<Lead[]> => {
  // Simulate API call with realistic data
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechFlow Solutions',
      title: 'VP of Marketing',
      email: 's.chen@techflow.com',
      location: 'San Francisco, CA',
      intentScore: 94,
      keywords: ['marketing automation', 'lead generation', 'conversion optimization'],
      source: 'LinkedIn + Website Activity',
      lastActivity: '2 hours ago',
      companySize: '50-200',
      industry: 'SaaS',
      revenue: '$5-10M',
      status: 'new'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      company: 'DataDriven Corp',
      title: 'Chief Marketing Officer',
      email: 'm.rodriguez@datadriven.co',
      location: 'Austin, TX',
      intentScore: 91,
      keywords: ['competitive intelligence', 'market analysis', 'growth hacking'],
      source: 'Search Behavior + Content Downloads',
      lastActivity: '4 hours ago',
      companySize: '200-500',
      industry: 'Analytics',
      revenue: '$10-25M',
      status: 'qualified'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      company: 'GrowthLabs',
      title: 'Growth Director',
      location: 'New York, NY',
      intentScore: 88,
      keywords: ['ad optimization', 'funnel analysis', 'performance marketing'],
      source: 'Website Tracking + Email Engagement',
      lastActivity: '1 day ago',
      companySize: '10-50',
      industry: 'Marketing Agency',
      revenue: '$1-5M',
      status: 'new'
    },
    {
      id: '4',
      name: 'David Kumar',
      company: 'ScaleUp Ventures',
      title: 'Head of Digital Marketing',
      email: 'd.kumar@scaleup.vc',
      location: 'Seattle, WA',
      intentScore: 85,
      keywords: ['competitor analysis', 'market research', 'strategic planning'],
      source: 'Social Media + Search Activity',
      lastActivity: '6 hours ago',
      companySize: '100-200',
      industry: 'Venture Capital',
      revenue: '$25M+',
      status: 'contacted'
    },
    {
      id: '5',
      name: 'Lisa Park',
      company: 'InnovateNow',
      title: 'Marketing Manager',
      location: 'Boston, MA',
      intentScore: 82,
      keywords: ['lead scoring', 'customer insights', 'data analytics'],
      source: 'Content Engagement + Webinar Attendance',
      lastActivity: '3 hours ago',
      companySize: '50-100',
      industry: 'Technology',
      revenue: '$5-10M',
      status: 'new'
    }
  ];

  // Filter based on search criteria
  return mockLeads.filter(lead => {
    if (filters.industry && !lead.industry.toLowerCase().includes(filters.industry.toLowerCase())) return false;
    if (filters.location && !lead.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.minIntentScore && lead.intentScore < filters.minIntentScore) return false;
    if (filters.companySize && lead.companySize !== filters.companySize) return false;
    if (filters.keywords && !lead.keywords.some(k => k.toLowerCase().includes(filters.keywords.toLowerCase()))) return false;
    return true;
  });
};

export default function LeadLocator() {
  const [filters, setFilters] = useState<SearchFilters>({
    industry: '',
    location: '',
    minIntentScore: 70,
    companySize: '',
    keywords: ''
  });

  const { data: leads = [], isLoading, refetch } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => fetchLeads(filters),
    enabled: false
  });

  const handleSearch = () => {
    refetch();
  };

  const handleAddToCRM = (lead: Lead) => {
    toast({
      title: "Lead Added to CRM",
      description: `${lead.name} from ${lead.company} has been added to your pipeline.`
    });
  };

  const getIntentScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'qualified': return 'bg-green-500';
      case 'contacted': return 'bg-yellow-500';
      case 'converted': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lead Locator</h1>
              <p className="text-muted-foreground mt-2">Identify high-intent prospects with AI-powered scoring</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Manual Lead
              </Button>
            </div>
          </div>

          {/* Search Filters */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <Input
                placeholder="Industry or keyword"
                value={filters.keywords}
                onChange={(e) => setFilters(prev => ({ ...prev, keywords: e.target.value }))}
              />
              <Input
                placeholder="Location (city, state)"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
              <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.companySize} onValueChange={(value) => setFilters(prev => ({ ...prev, companySize: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="10-50">10-50 employees</SelectItem>
                  <SelectItem value="50-100">50-100 employees</SelectItem>
                  <SelectItem value="50-200">50-200 employees</SelectItem>
                  <SelectItem value="200-500">200-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Target className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Find Leads
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Min Intent Score:</span>
                <Select 
                  value={filters.minIntentScore.toString()} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minIntentScore: parseInt(value) }))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60+</SelectItem>
                    <SelectItem value="70">70+</SelectItem>
                    <SelectItem value="80">80+</SelectItem>
                    <SelectItem value="90">90+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold">{leads.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">High Intent (90+)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">
                    {leads.filter(l => l.intentScore >= 90).length}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Intent Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold">
                    {leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.intentScore, 0) / leads.length) : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ready to Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">
                    {leads.filter(l => l.intentScore >= 85 && l.status === 'new').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          {leads.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Lead Results</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Intent Score</TableHead>
                      <TableHead>Keywords</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-muted-foreground">{lead.title}</div>
                            <div className="text-sm text-muted-foreground">{lead.location}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.company}</div>
                            <div className="text-sm text-muted-foreground">{lead.companySize} employees</div>
                            {lead.revenue && (
                              <div className="text-sm text-muted-foreground">{lead.revenue} revenue</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getIntentScoreColor(lead.intentScore)} text-white`}>
                            {lead.intentScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {lead.keywords.slice(0, 2).map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {lead.keywords.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{lead.keywords.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{lead.source}</div>
                          <div className="text-muted-foreground">{lead.lastActivity}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(lead.status)} text-white capitalize`}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCRM(lead)}
                            disabled={lead.status === 'converted'}
                          >
                            Add to CRM
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!isLoading && leads.length === 0 && filters.keywords && (
            <Card className="p-12 text-center">
              <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leads found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or lowering the minimum intent score
              </p>
              <Button variant="outline" onClick={() => setFilters({ industry: '', location: '', minIntentScore: 60, companySize: '', keywords: '' })}>
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
