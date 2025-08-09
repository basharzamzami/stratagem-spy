
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Target,
  Phone,
  Mail
} from 'lucide-react';
import { EnhancedLead } from '@/services/specterNetIntegration';

interface WarmLeadsTableProps {
  leads: EnhancedLead[];
}

const WarmLeadsTable = ({ leads }: WarmLeadsTableProps) => {
  const getUrgencyColor = (score: number) => {
    if (score >= 90) return 'text-red-400';
    if (score >= 80) return 'text-orange-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getIntentScoreColor = (score: number) => {
    if (score >= 85) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (score >= 75) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (score >= 65) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Warm Leads Detected</h3>
          <p className="text-muted-foreground">Launch Specter Net to start detecting high-intent prospects</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          High-Intent Warm Leads
          <Badge className="bg-success/20 text-success border-success/30 ml-2">
            {leads.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Intent Keywords</TableHead>
              <TableHead>Urgency Score</TableHead>
              <TableHead>Intent Score</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.title} at {lead.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">
                      {lead.geo_context.city}, {lead.geo_context.state}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ZIP: {lead.geo_context.zip}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {lead.intent_keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  {lead.search_patterns.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Patterns: {lead.search_patterns.join(', ')}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={lead.urgency_score} className="h-2 w-16" />
                    <span className={`text-sm font-medium ${getUrgencyColor(lead.urgency_score)}`}>
                      {lead.urgency_score}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getIntentScoreColor(lead.intent_score)}>
                    {lead.intent_score}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {new Date(lead.last_search_activity).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - new Date(lead.last_search_activity).getTime()) / (1000 * 60 * 60))}h ago
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                    <Button size="sm" variant="ghost">
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
  );
};

export default WarmLeadsTable;
