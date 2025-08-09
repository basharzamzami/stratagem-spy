
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Phone, Mail, MapPin, Calendar, MessageSquare, Users } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  location: string;
  lastContact: string;
  dealCount: number;
  totalValue: number;
  tags: string[];
  notes: string;
  status: 'Active' | 'Prospect' | 'Customer' | 'Inactive';
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'VP of Marketing',
    company: 'TechFlow Solutions',
    email: 'sarah.chen@techflow.com',
    phone: '(415) 555-0123',
    location: 'San Francisco, CA',
    lastContact: '2 hours ago',
    dealCount: 2,
    totalValue: 95000,
    tags: ['Decision Maker', 'Tech Savvy', 'Budget Holder'],
    notes: 'Very responsive, interested in competitive intelligence features',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Chief Marketing Officer',
    company: 'DataDriven Corp',
    email: 'm.rodriguez@datadriven.co',
    phone: '(512) 555-0456',
    location: 'Austin, TX',
    lastContact: '1 day ago',
    dealCount: 1,
    totalValue: 120000,
    tags: ['Enterprise', 'Analytics Focus'],
    notes: 'Needs advanced reporting capabilities for client reporting',
    status: 'Prospect'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    title: 'Growth Director',
    company: 'GrowthLabs',
    email: 'emma.thompson@growthlabs.io',
    location: 'New York, NY',
    lastContact: '3 days ago',
    dealCount: 0,
    totalValue: 0,
    tags: ['Growth Hacking', 'Startup'],
    notes: 'Looking for affordable competitive analysis tools',
    status: 'Prospect'
  }
];

export default function CRMContacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Prospect': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Customer': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <div className="text-2xl font-bold">{contacts.length}</div>
                <div className="text-sm text-muted-foreground">Total Contacts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {contacts.filter(c => c.status === 'Active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Contacts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {contacts.reduce((sum, c) => sum + c.dealCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Deals</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  ${contacts.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search contacts..."
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Contacts Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.title}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4" />
                  {contact.company}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {contact.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {contact.location}
                  </div>
                </div>
                
                <div className="flex gap-1 flex-wrap">
                  {contact.tags.slice(0, 2).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{contact.tags.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Deals</div>
                    <div className="font-semibold">{contact.dealCount}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Value</div>
                    <div className="font-semibold">${contact.totalValue.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last contact: {contact.lastContact}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Contact List ({filteredContacts.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="p-4 hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-card-foreground">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.title} at {contact.company}</div>
                        <div className="text-sm text-muted-foreground">{contact.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-sm font-medium">{contact.dealCount} deals</div>
                        <div className="text-sm text-muted-foreground">${contact.totalValue.toLocaleString()}</div>
                      </div>
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
