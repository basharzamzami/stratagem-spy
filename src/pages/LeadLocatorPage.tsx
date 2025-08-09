
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from "@/components/Navigation";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiClient } from '@/services/api';
import { Search, MapPin, Users, Target, Phone } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  contact: string;
  phone?: string;
  location: string;
  industry: string;
  companySize: string;
  intentScore: number;
  keywords: string[];
  lastActivity: string;
  source: string;
}

export default function LeadLocatorPage() {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    industry: '',
    minIntent: 0
  });

  const { data: leadsData, isLoading, refetch } = useQuery({
    queryKey: ['leads', searchParams],
    queryFn: () => ApiClient.searchLeads(searchParams),
  });

  const leads = leadsData?.data || [];

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Lead Locator</h1>
                <p className="text-muted-foreground">Discover warm leads actively searching for your services</p>
              </div>
              <div className="ml-auto">
                <Badge className="bg-success/20 text-success border-success/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  {leads.length} Active Leads
                </Badge>
              </div>
            </div>

            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Lead Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input
                    placeholder="Search keywords"
                    value={searchParams.keyword}
                    onChange={(e) => setSearchParams(prev => ({...prev, keyword: e.target.value}))}
                  />
                  
                  <Input
                    placeholder="Location (city, state)"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams(prev => ({...prev, location: e.target.value}))}
                  />
                  
                  <Select value={searchParams.industry} onValueChange={(value) => setSearchParams(prev => ({...prev, industry: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Industries</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={searchParams.minIntent.toString()} onValueChange={(value) => setSearchParams(prev => ({...prev, minIntent: parseInt(value)}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Min Intent Score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Scores</SelectItem>
                      <SelectItem value="50">50+ (Medium)</SelectItem>
                      <SelectItem value="70">70+ (High)</SelectItem>
                      <SelectItem value="85">85+ (Very High)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search Leads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leads Grid */}
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Searching for leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Leads Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search filters to find more leads</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {leads.map((lead: Lead) => (
                  <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{lead.name}</h3>
                            <p className="text-sm text-muted-foreground">{lead.title} at {lead.company}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {lead.location}
                            </span>
                            <span>Industry: {lead.industry}</span>
                            <span>Size: {lead.companySize}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Keywords:</span>
                            {lead.keywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {lead.keywords.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{lead.keywords.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Intent Score</span>
                            <Badge className={`${
                              lead.intentScore >= 85 ? 'bg-green-500/20 text-green-400' :
                              lead.intentScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {lead.intentScore}%
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
