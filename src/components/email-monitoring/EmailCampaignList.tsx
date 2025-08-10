
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Mail,
  TrendingUp
} from 'lucide-react';

interface EmailSequence {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  emails_count: number;
  subscribers: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  created_at: string;
  last_sent: string;
}

interface EmailCampaignListProps {
  sequences: EmailSequence[];
}

export default function EmailCampaignList({ sequences }: EmailCampaignListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'paused': return 'bg-warning/20 text-warning border-warning/30';
      case 'draft': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'completed': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const filteredSequences = sequences.filter((sequence) => {
    const matchesSearch = sequence.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sequence.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSequenceAction = (sequenceId: string, action: string) => {
    console.log(`${action} sequence ${sequenceId}`);
    // Implement actual actions here
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Email Sequences ({filteredSequences.length})
            </CardTitle>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search sequences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sequences Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-card-foreground font-medium">Sequence</TableHead>
                  <TableHead className="text-card-foreground font-medium">Status</TableHead>
                  <TableHead className="text-card-foreground font-medium text-right">Subscribers</TableHead>
                  <TableHead className="text-card-foreground font-medium text-right">Open Rate</TableHead>
                  <TableHead className="text-card-foreground font-medium text-right">Click Rate</TableHead>
                  <TableHead className="text-card-foreground font-medium text-right">Conversion</TableHead>
                  <TableHead className="text-card-foreground font-medium">Last Sent</TableHead>
                  <TableHead className="text-card-foreground font-medium w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSequences.map((sequence) => (
                  <TableRow 
                    key={sequence.id} 
                    className="cursor-pointer hover:bg-muted/50 border-border"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-card-foreground">{sequence.name}</div>
                          <div className="text-xs text-card-foreground/60">
                            {sequence.emails_count} emails in sequence
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sequence.status)}>
                        {sequence.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono">{sequence.subscribers.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono">{sequence.open_rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono">{sequence.click_rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {sequence.conversion_rate}%
                    </TableCell>
                    <TableCell className="text-sm text-card-foreground/60">
                      {sequence.last_sent}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSequenceAction(sequence.id, 'view')}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSequenceAction(sequence.id, 'edit')}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Sequence
                          </DropdownMenuItem>
                          {sequence.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleSequenceAction(sequence.id, 'pause')}>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Sequence
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleSequenceAction(sequence.id, 'start')}>
                              <Play className="w-4 h-4 mr-2" />
                              Start Sequence
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleSequenceAction(sequence.id, 'delete')}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Sequence
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
