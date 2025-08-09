
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image, 
  FileText, 
  Video, 
  Download, 
  Eye, 
  Edit,
  Trash2,
  Plus,
  Search
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'creative';
  size: string;
  uploadDate: string;
  status: 'active' | 'draft' | 'archived';
  url: string;
  dimensions?: string;
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
}

interface CampaignAssetsProps {
  campaignId: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Miami HVAC Hero Banner.jpg',
    type: 'image',
    size: '2.4 MB',
    uploadDate: '2024-01-14',
    status: 'active',
    url: '/placeholder.svg',
    dimensions: '1920x1080',
    performance: {
      impressions: 15420,
      clicks: 342,
      ctr: 2.22
    }
  },
  {
    id: '2',
    name: 'Emergency Service Video Ad.mp4',
    type: 'video',
    size: '15.7 MB',
    uploadDate: '2024-01-12',
    status: 'active',
    url: '/placeholder.svg',
    dimensions: '1280x720',
    performance: {
      impressions: 8950,
      clicks: 267,
      ctr: 2.98
    }
  },
  {
    id: '3',
    name: 'Service Area Map.pdf',
    type: 'document',
    size: '1.1 MB',
    uploadDate: '2024-01-10',
    status: 'draft',
    url: '/placeholder.svg'
  }
];

const CampaignAssets = ({ campaignId }: CampaignAssetsProps) => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success border-success/30';
      case 'draft':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'archived':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Upload */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Campaign Assets</CardTitle>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-card border-border overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {asset.type === 'image' ? (
                <img 
                  src={asset.url} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {getTypeIcon(asset.type)}
                  <span className="text-sm text-muted-foreground">{asset.type.toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-card-foreground truncate">{asset.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-card-foreground/70">
                    <span>{asset.size}</span>
                    {asset.dimensions && (
                      <>
                        <span>•</span>
                        <span>{asset.dimensions}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                  <span className="text-xs text-card-foreground/70">{asset.uploadDate}</span>
                </div>

                {asset.performance && (
                  <div className="space-y-2">
                    <div className="text-xs text-card-foreground/70">Performance</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-card-foreground font-medium">
                          {asset.performance.impressions.toLocaleString()}
                        </div>
                        <div className="text-card-foreground/70">Impressions</div>
                      </div>
                      <div>
                        <div className="text-card-foreground font-medium">
                          {asset.performance.clicks}
                        </div>
                        <div className="text-card-foreground/70">Clicks</div>
                      </div>
                      <div>
                        <div className="text-card-foreground font-medium">
                          {asset.performance.ctr}%
                        </div>
                        <div className="text-card-foreground/70">CTR</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Upload New Asset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-card-foreground mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-card-foreground/70">Supports images, videos, and documents</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Asset Name</label>
                <Input placeholder="Enter asset name..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Description</label>
                <Textarea placeholder="Asset description..." rows={3} />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Upload Asset</Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampaignAssets;
