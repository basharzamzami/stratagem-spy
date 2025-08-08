
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Share2, 
  Calendar, 
  Mail,
  Link,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdExportTools = () => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'competitor', 'platform', 'headline', 'spend', 'engagement'
  ]);
  const [reportType, setReportType] = useState('current');
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  const exportFields = [
    { id: 'competitor', label: 'Competitor Name' },
    { id: 'platform', label: 'Platform' },
    { id: 'headline', label: 'Ad Headline' },
    { id: 'description', label: 'Ad Description' },
    { id: 'cta', label: 'Call to Action' },
    { id: 'spend', label: 'Daily Spend' },
    { id: 'impressions', label: 'Impressions' },
    { id: 'engagement', label: 'Engagement Rate' },
    { id: 'startDate', label: 'Launch Date' },
    { id: 'status', label: 'Status' },
    { id: 'analysis', label: 'AI Analysis' }
  ];

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to export",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const fileName = `ad-intelligence-export-${Date.now()}.${selectedFormat}`;
      
      // In real implementation, this would trigger actual file download
      toast({
        title: "Export successful",
        description: `Report "${fileName}" has been generated and downloaded`
      });
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      // link.click(); // Uncomment for actual download
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = async () => {
    setIsScheduling(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report scheduled",
        description: "Weekly reports will be generated and sent automatically"
      });
      
    } catch (error) {
      toast({
        title: "Scheduling failed",
        description: "Unable to schedule report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleShareView = async () => {
    try {
      const shareUrl = `${window.location.origin}/ad-signal-hijack/shared/${Date.now()}`;
      
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Share link created",
        description: "Shareable link copied to clipboard"
      });
      
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to create share link",
        variant: "destructive"
      });
    }
  };

  const handleEmailReport = async () => {
    try {
      // In real implementation, this would open email modal or send directly
      toast({
        title: "Email report",
        description: "Opening email dialog to send report to team members"
      });
      
    } catch (error) {
      toast({
        title: "Email failed",
        description: "Unable to send email report",
        variant: "destructive"
      });
    }
  };

  const handleCustomReport = () => {
    toast({
      title: "Custom report builder",
      description: "Opening advanced report builder interface"
    });
    // In real implementation, this would navigate to report builder
  };

  const handleDownloadRecent = (exportName: string) => {
    toast({
      title: "Downloading export",
      description: `"${exportName}" is being downloaded`
    });
    // In real implementation, this would trigger actual download
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export & Reporting Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Configuration */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Report Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Search Results (847 ads)</SelectItem>
                  <SelectItem value="competitor">Competitor-Specific Report</SelectItem>
                  <SelectItem value="industry">Industry Overview</SelectItem>
                  <SelectItem value="trending">Trending Ads Report</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Format */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                  <SelectItem value="xlsx">Excel Workbook</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Include Fields</label>
              <Badge variant="secondary">{selectedFields.length} selected</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {exportFields.map(field => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <label htmlFor={field.id} className="text-sm">
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleExport} 
              className="flex-1"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={handleScheduleReport}
              disabled={isScheduling}
            >
              {isScheduling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Share View</h4>
                <p className="text-sm text-muted-foreground">Generate shareable link</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3"
              onClick={handleShareView}
            >
              <Link className="w-4 h-4 mr-2" />
              Create Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Email Report</h4>
                <p className="text-sm text-muted-foreground">Send to team members</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3"
              onClick={handleEmailReport}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Custom Report</h4>
                <p className="text-sm text-muted-foreground">Build detailed analysis</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3"
              onClick={handleCustomReport}
            >
              <FileText className="w-4 h-4 mr-2" />
              Build Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'SaaS Competitors Analysis', date: '2 hours ago', format: 'PDF', size: '2.4 MB' },
              { name: 'Meta Ads Export', date: '1 day ago', format: 'CSV', size: '1.8 MB' },
              { name: 'Weekly Intelligence Report', date: '3 days ago', format: 'Excel', size: '4.2 MB' }
            ].map((export_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{export_.name}</div>
                    <div className="text-xs text-muted-foreground">{export_.date} • {export_.format} • {export_.size}</div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDownloadRecent(export_.name)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdExportTools;
