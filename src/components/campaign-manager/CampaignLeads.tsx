
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Download,
  UserPlus
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  value: number;
  createdAt: string;
  lastContact: string;
  interests: string[];
}

interface CampaignLeadsProps {
  campaignId: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Maria Rodriguez',
    email: 'maria.r@email.com',
    phone: '+1 (305) 123-4567',
    location: 'Miami, FL',
    source: 'Google Ads',
    status: 'qualified',
    score: 85,
    value: 2400,
    createdAt: '2024-01-14',
    lastContact: '2024-01-14',
    interests: ['HVAC Repair', 'Emergency Service']
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'j.wilson@email.com',
    phone: '+1 (305) 987-6543',
    location: 'Coral Gables, FL',
    source: 'Facebook Ads',
    status: 'new',
    score: 72,
    value: 1800,
    createdAt: '2024-01-13',
    lastContact: '2024-01-13',
    interests: ['AC Installation', 'Maintenance Plan']
  },
  {
    id: '3',
    name: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '+1 (305) 555-0123',
    location: 'Aventura, FL',
    source: 'Google Ads',
    status: 'converted',
    score: 95,
    value: 3200,
    createdAt: '2024-01-12',
    lastContact: '2024-01-13',
    interests: ['System Replacement', 'Energy Efficiency']
  },
  {
    id: '4',
    name: 'Robert Martinez',
    email: 'r.martinez@email.com',
    phone: '+1 (305) 444-7890',
    location: 'Homestead, FL',
    source: 'YouTube Ads',
    status: 'contacted',
    score: 68,
    value: 1500,
    createdAt: '2024-01-11',
    lastContact: '2024-01-12',
    interests: ['Duct Cleaning', 'Air Quality']
  }
];

const CampaignLeads = ({ campaignId }: CampaignLeadsProps) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'qualified':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'converted':
        return 'bg-success/20 text-success border-success/30';
      case 'lost':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <div className="space-y-6">
      {/* Lead Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground/70">Total Leads</p>
                <p className="text-2xl font-bold text-card-foreground">{totalLeads}</p>
              </div>
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground/70">Converted</p>
                <p className="text-2xl font-bold text-card-foreground">{convertedLeads}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground/70">Conversion Rate</p>
                <p className="text-2xl font-bold text-card-foreground">{conversionRate}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground/70">Total Value</p>
                <p className="text-2xl font-bold text-card-foreground">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-xs font-bold text-success">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Campaign Leads</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{lead.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.interests.slice(0, 2).map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-card-foreground">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-card-foreground">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-card-foreground">
                      <MapPin className="w-3 h-3" />
                      {lead.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-card-foreground">{lead.source}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(lead.score)}`}>
                      {lead.score}/100
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-card-foreground">
                      ${lead.value.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-card-foreground/70">
                      <Calendar className="w-3 h-3" />
                      {lead.createdAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground">Lead Details</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedLead(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-card-foreground mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-card-foreground">{selectedLead.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-card-foreground">{selectedLead.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-card-foreground">{selectedLead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-card-foreground">{selectedLead.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-card-foreground mb-3">Lead Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className={getStatusColor(selectedLead.status)}>
                        {selectedLead.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score:</span>
                      <span className={`font-medium ${getScoreColor(selectedLead.score)}`}>
                        {selectedLead.score}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Potential Value:</span>
                      <span className="font-medium text-card-foreground">
                        ${selectedLead.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="text-card-foreground">{selectedLead.source}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Contact Lead</Button>
                <Button variant="outline">Add Note</Button>
                <Button variant="outline">Update Status</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampaignLeads;
