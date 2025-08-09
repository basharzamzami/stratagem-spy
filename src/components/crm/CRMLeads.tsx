
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Phone, Mail, MapPin, Star, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  title: string;
  location: string;
  source: string;
  score: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost';
  value: number;
  lastActivity: string;
  notes: string;
  competitorMentions: string[];
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techflow.com',
    phone: '(415) 555-0123',
    company: 'TechFlow Solutions',
    title: 'VP of Marketing',
    location: 'San Francisco, CA',
    source: 'Website + LinkedIn',
    score: 94,
    status: 'Qualified',
    value: 75000,
    lastActivity: '2 hours ago',
    notes: 'Very interested in competitive analysis features. Currently using basic tools.',
    competitorMentions: ['SimilarWeb', 'SEMrush']
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'm.rodriguez@datadriven.co',
    phone: '(512) 555-0456',
    company: 'DataDriven Corp',
    title: 'Chief Marketing Officer',
    location: 'Austin, TX',
    source: 'Campaign Manager Import',
    score: 88,
    status: 'Proposal',
    value: 120000,
    lastActivity: '1 day ago',
    notes: 'Needs advanced reporting and white-label options for clients.',
    competitorMentions: ['Ahrefs', 'BuzzSumo']
  }
];

export default function CRMLeads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Qualified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Proposal': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Negotiation': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Closed-Won': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Closed-Lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastActivity: 'Just now' }
        : lead
    ));

    toast({
      title: "Lead Status Updated",
      description: `Status changed to ${newStatus}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4 flex-1">
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
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Closed-Won">Closed-Won</SelectItem>
              <SelectItem value="Closed-Lost">Closed-Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter name" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company name" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@company.com" />
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="campaign">Campaign Manager</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setIsNewLeadOpen(false)}>
                  Add Lead
                </Button>
                <Button variant="outline" onClick={() => setIsNewLeadOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.title}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.company}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {lead.location}
                      </div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {lead.source}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className={`w-4 h-4 ${getScoreColor(lead.score)}`} />
                      <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${lead.value.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={lead.status} 
                      onValueChange={(value: Lead['status']) => updateLeadStatus(lead.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Closed-Won">Closed-Won</SelectItem>
                        <SelectItem value="Closed-Lost">Closed-Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.lastActivity}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedLead(lead)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Star className={`w-5 h-5 ${getScoreColor(selectedLead.score)}`} />
                  {selectedLead.name} - {selectedLead.company}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Contact Information</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      <div>{selectedLead.email}</div>
                      <div>{selectedLead.phone}</div>
                      <div>{selectedLead.location}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Deal Information</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      <div>Value: ${selectedLead.value.toLocaleString()}</div>
                      <div>Score: {selectedLead.score}</div>
                      <div>Source: {selectedLead.source}</div>
                    </div>
                  </div>
                </div>
                
                {selectedLead.competitorMentions.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Competitor Mentions</Label>
                    <div className="flex gap-2 mt-2">
                      {selectedLead.competitorMentions.map((competitor, idx) => (
                        <Badge key={idx} variant="outline" className="bg-red-500/10 text-red-400">
                          {competitor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <div className="mt-2 p-3 bg-muted/20 rounded-lg text-sm">
                    {selectedLead.notes}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
