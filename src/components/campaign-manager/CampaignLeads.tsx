
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Phone, Mail, MapPin, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  score: number;
  value: number;
  createdAt: string;
  lastContact: string;
}

interface CampaignLeadsProps {
  campaignId: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Martinez',
    email: 'john.martinez@email.com',
    phone: '(305) 555-0123',
    location: 'Miami, FL 33101',
    source: 'Google Ads',
    status: 'Qualified',
    score: 85,
    value: 1250,
    createdAt: '2024-01-14',
    lastContact: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '(305) 555-0456',
    location: 'Miami, FL 33142',
    source: 'Facebook Ads',
    status: 'New',
    score: 72,
    value: 890,
    createdAt: '2024-01-15',
    lastContact: '2024-01-15'
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@email.com',
    phone: '(305) 555-0789',
    location: 'Miami, FL 33145',
    source: 'Google Ads',
    status: 'Converted',
    score: 95,
    value: 2100,
    createdAt: '2024-01-12',
    lastContact: '2024-01-14'
  },
  {
    id: '4',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '(305) 555-0321',
    location: 'Miami, FL 33133',
    source: 'Facebook Ads',
    status: 'Contacted',
    score: 68,
    value: 750,
    createdAt: '2024-01-13',
    lastContact: '2024-01-14'
  }
];

const CampaignLeads = ({ campaignId }: CampaignLeadsProps) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Converted':
        return 'bg-success/20 text-success border-success/30';
      case 'Qualified':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Contacted':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'New':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Lost':
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
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const syncWithCRM = () => {
    toast({
      title: "CRM Sync Started",
      description: "Syncing leads with Competitive CRM system..."
    });

    // Mock sync process
    setTimeout(() => {
      toast({
        title: "CRM Sync Complete",
        description: `${leads.length} leads synchronized successfully`
      });
    }, 2000);
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] }
        : lead
    ));

    toast({
      title: "Lead status updated",
      description: `Lead status changed to ${newStatus}`
    });
  };

  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = (filteredLeads.filter(l => l.status === 'Converted').length / filteredLeads.length * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Lead Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{filteredLeads.length}</div>
              <Users className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">{conversionRate}%</div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">${totalValue.toLocaleString()}</div>
              <Badge className="bg-success/20 text-success">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground/70">Avg Lead Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-card-foreground">
                {Math.round(filteredLeads.reduce((sum, l) => sum + l.score, 0) / filteredLeads.length)}
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                High Quality
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Campaign Leads</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={syncWithCRM}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync with CRM
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lead Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-card-foreground">{lead.name}</div>
                      <div className="flex items-center gap-4 text-sm text-card-foreground/70 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-card-foreground">
                      <MapPin className="w-3 h-3" />
                      {lead.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/20 text-primary">
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    ${lead.value.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={lead.status} 
                      onValueChange={(value: Lead['status']) => updateLeadStatus(lead.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignLeads;
