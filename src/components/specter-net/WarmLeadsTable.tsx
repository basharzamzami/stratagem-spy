
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Star, Building2, MapPin, Phone, Mail, Eye } from 'lucide-react';

interface WarmLead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  qualityScore: number;
  intentScore: number;
  lastActivity: string;
  source: string;
  status: 'Hot' | 'Warm' | 'Cold';
}

const mockWarmLeads: WarmLead[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'TechFlow Solutions',
    title: 'VP of Marketing',
    email: 'sarah.chen@techflow.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    industry: 'SaaS',
    qualityScore: 95,
    intentScore: 88,
    lastActivity: '2 hours ago',
    source: 'LinkedIn Signal',
    status: 'Hot'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    company: 'HealthTech Innovations',
    title: 'Director of Operations',
    email: 'marcus@healthtech.com',
    phone: '(555) 987-6543',
    location: 'Austin, TX',
    industry: 'Healthcare',
    qualityScore: 92,
    intentScore: 85,
    lastActivity: '5 hours ago',
    source: 'Job Board Activity',
    status: 'Hot'
  },
  {
    id: '3',
    name: 'Jennifer Kim',
    company: 'Real Estate Pro',
    title: 'Head of Sales',
    email: 'jkim@repro.com',
    phone: '(555) 456-7890',
    location: 'Miami, FL',
    industry: 'Real Estate',
    qualityScore: 87,
    intentScore: 82,
    lastActivity: '1 day ago',
    source: 'Content Download',
    status: 'Warm'
  },
  {
    id: '4',
    name: 'David Thompson',
    company: 'E-Commerce Plus',
    title: 'Marketing Manager',
    email: 'dthompson@ecomplus.com',
    phone: '(555) 321-9876',
    location: 'Seattle, WA',
    industry: 'E-Commerce',
    qualityScore: 84,
    intentScore: 79,
    lastActivity: '2 days ago',
    source: 'Social Media',
    status: 'Warm'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    company: 'Manufacturing Corp',
    title: 'Operations Director',
    email: 'lwang@mfgcorp.com',
    phone: '(555) 654-3210',
    location: 'Chicago, IL',
    industry: 'Manufacturing',
    qualityScore: 81,
    intentScore: 76,
    lastActivity: '3 days ago',
    source: 'Website Visit',
    status: 'Cold'
  }
];

export default function WarmLeadsTable() {
  const [leads, setLeads] = useState<WarmLead[]>(mockWarmLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Warm': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Cold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || lead.industry === selectedIndustry;
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'Hot').length;
  const warmLeads = leads.filter(l => l.status === 'Warm').length;
  const avgQualityScore = Math.round(leads.reduce((sum, lead) => sum + lead.qualityScore, 0) / leads.length);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Warm Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalLeads}</div>
            <div className="text-sm text-muted-foreground">+12% from last week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{hotLeads}</div>
            <div className="text-sm text-muted-foreground">Requiring immediate attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warm Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{warmLeads}</div>
            <div className="text-sm text-muted-foreground">Ready for nurturing</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{avgQualityScore}</div>
            <div className="text-sm text-muted-foreground">Out of 100</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Lead Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warm Leads Database</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Scores</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.title}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {lead.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{lead.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                      {lead.industry}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className={`text-sm font-medium ${getScoreColor(lead.qualityScore)}`}>
                          Q: {lead.qualityScore}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-purple-400" />
                        <span className={`text-sm font-medium ${getScoreColor(lead.intentScore)}`}>
                          I: {lead.intentScore}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm text-foreground">{lead.lastActivity}</div>
                      <div className="text-xs text-muted-foreground">{lead.source}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-3 h-3 mr-1" />
                        Contact
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
}
