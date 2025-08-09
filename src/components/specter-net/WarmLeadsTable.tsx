
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Phone, Mail, TrendingUp, Clock, Target } from 'lucide-react';
import { EnhancedLead } from '@/services/specterNetIntegration';
import { LeadEnrichmentData } from '@/services/warmLeadProspector';

interface WarmLeadsTableProps {
  leads: EnhancedLead[];
  onSelectLead: (lead: EnhancedLead) => void;
  enrichmentData: Record<string, LeadEnrichmentData>;
}

const WarmLeadsTable: React.FC<WarmLeadsTableProps> = ({ leads, onSelectLead, enrichmentData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('urgency_score');
  const [filterBy, setFilterBy] = useState('all');

  // Mock warm leads data if none provided
  const mockLeads: EnhancedLead[] = useMemo(() => {
    if (leads.length > 0) return leads;
    
    return [
      {
        id: 'lead_1',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        company: 'TechCorp Solutions',
        title: 'VP of Marketing',
        phone: '(555) 123-4567',
        location_city: 'San Francisco',
        location_state: 'CA',
        location_zip: '94105',
        intent_score: 92,
        source: 'intent_detection',
        source_data: { detection_method: 'keyword_scanning', confidence_score: 0.89 },
        enrichment_data: {},
        status: 'active',
        tags: ['warm_lead', 'high_intent'],
        notes: 'Actively researching marketing automation tools',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        intent_keywords: ['marketing automation', 'lead scoring', 'crm integration'],
        search_patterns: ['vs competitor', 'pricing comparison', 'free trial'],
        competitor_references: ['HubSpot', 'Marketo'],
        urgency_score: 88,
        last_search_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        geo_context: {
          city: 'San Francisco',
          state: 'CA',
          zip: '94105'
        }
      },
      {
        id: 'lead_2',
        name: 'Michael Rodriguez',
        email: 'm.rodriguez@healthplus.com',
        company: 'HealthPlus Medical',
        title: 'Director of Operations',
        phone: '(555) 987-6543',
        location_city: 'Austin',
        location_state: 'TX',
        location_zip: '78701',
        intent_score: 85,
        source: 'intent_detection',
        source_data: { detection_method: 'social_listening', confidence_score: 0.82 },
        enrichment_data: {},
        status: 'active',
        tags: ['warm_lead', 'healthcare'],
        notes: 'Looking for patient management solutions',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        intent_keywords: ['patient management', 'healthcare crm', 'appointment scheduling'],
        search_patterns: ['best healthcare software', 'patient engagement tools'],
        competitor_references: ['Epic'],
        urgency_score: 79,
        last_search_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        geo_context: {
          city: 'Austin',
          state: 'TX',
          zip: '78701'
        }
      },
      {
        id: 'lead_3',
        name: 'Amanda Foster',
        email: 'a.foster@realestatepro.com',
        company: 'RealEstate Pro',
        title: 'Sales Manager',
        phone: '(555) 456-7890',
        location_city: 'Miami',
        location_state: 'FL',
        location_zip: '33101',
        intent_score: 78,
        source: 'intent_detection',
        source_data: { detection_method: 'web_tracking', confidence_score: 0.75 },
        enrichment_data: {},
        status: 'active',
        tags: ['warm_lead', 'real_estate'],
        notes: 'Researching lead generation tools for real estate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        intent_keywords: ['real estate leads', 'property management', 'client tracking'],
        search_patterns: ['real estate crm', 'lead generation'],
        competitor_references: ['Zillow'],
        urgency_score: 72,
        last_search_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        geo_context: {
          city: 'Miami',
          state: 'FL',
          zip: '33101'
        }
      }
    ];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let filtered = mockLeads;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.intent_keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(lead => {
        switch (filterBy) {
          case 'high_intent':
            return lead.intent_score >= 85;
          case 'medium_intent':
            return lead.intent_score >= 70 && lead.intent_score < 85;
          case 'recent':
            return new Date(lead.last_search_activity) > new Date(Date.now() - 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'urgency_score':
          return b.urgency_score - a.urgency_score;
        case 'intent_score':
          return b.intent_score - a.intent_score;
        case 'recent':
          return new Date(b.last_search_activity).getTime() - new Date(a.last_search_activity).getTime();
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return b.urgency_score - a.urgency_score;
      }
    });

    return filtered;
  }, [mockLeads, searchTerm, filterBy, sortBy]);

  const getIntentBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Warm Leads Database ({filteredLeads.length})
        </CardTitle>
        
        {/* Enhanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads, companies, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgency_score">Urgency Score</SelectItem>
              <SelectItem value="intent_score">Intent Score</SelectItem>
              <SelectItem value="recent">Most Recent Activity</SelectItem>
              <SelectItem value="company">Company Name</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="high_intent">High Intent (85+)</SelectItem>
              <SelectItem value="medium_intent">Medium Intent (70-84)</SelectItem>
              <SelectItem value="recent">Recent Activity (24h)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Lead Details</TableHead>
                <TableHead>Intent Signals</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Scores</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="space-y-2">
                      <div>
                        <div className="font-semibold text-foreground">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.title}</div>
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {lead.intent_keywords.slice(0, 2).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {lead.intent_keywords.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lead.intent_keywords.length - 2}
                          </Badge>
                        )}
                      </div>
                      {lead.search_patterns.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Pattern: {lead.search_patterns[0]}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {lead.geo_context.city}, {lead.geo_context.state}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getIntentBadgeColor(lead.intent_score)}>
                        <Target className="w-3 h-3 mr-1" />
                        {lead.intent_score}%
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Urgency: {lead.urgency_score}%
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(lead.last_search_activity)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectLead(lead)}
                        className="flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Contact
                      </Button>
                      <Button size="sm" variant="default">
                        View Profile
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Warm Leads Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarmLeadsTable;
