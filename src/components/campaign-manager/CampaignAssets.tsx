
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image, FileText, Plus, Copy, Edit, Trash, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'copy' | 'video';
  url?: string;
  content?: string;
  size?: string;
  createdAt: string;
  status: 'Active' | 'Draft' | 'Archived';
}

interface CampaignAssetsProps {
  campaignId: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Hero Image - HVAC Service',
    type: 'image',
    url: '/placeholder.svg',
    size: '1200x628',
    createdAt: '2024-01-10',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Emergency Service Ad Copy',
    type: 'copy',
    content: 'Need HVAC repair now? 24/7 emergency service in Miami. Licensed & insured technicians. Call now for same-day service!',
    createdAt: '2024-01-12',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Weekend Special Copy',
    type: 'copy',
    content: 'Weekend HVAC emergency? We\'re here! Special weekend rates for Miami homeowners. Fast, reliable service you can trust.',
    createdAt: '2024-01-14',
    status: 'Draft'
  }
];

const CampaignAssets = ({ campaignId }: CampaignAssetsProps) => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [showNewAssetForm, setShowNewAssetForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'copy' as const,
    content: ''
  });
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success/20 text-success border-success/30';
      case 'Draft':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Archived':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleAddAsset = () => {
    if (!newAsset.name.trim() || !newAsset.content.trim()) return;

    const asset: Asset = {
      id: Date.now().toString(),
      ...newAsset,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };

    setAssets([asset, ...assets]);
    setNewAsset({ name: '', type: 'copy', content: '' });
    setShowNewAssetForm(false);
    
    toast({
      title: "Asset created",
      description: "Your new asset has been saved as a draft."
    });
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Asset content copied successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content to clipboard",
        variant: "destructive"
      });
    }
  };

  const importFromAdSignal = () => {
    // Mock importing from Ad Signal Hijack
    const importedAsset: Asset = {
      id: Date.now().toString(),
      name: 'Imported from Ad Signal - Competitor Copy',
      type: 'copy',
      content: 'AC repair Miami - Same day service guaranteed! Licensed professionals, upfront pricing. Call now!',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };

    setAssets([importedAsset, ...assets]);
    toast({
      title: "Asset imported",
      description: "Competitor ad copy imported from Ad Signal Hijack"
    });
  };

  const imageAssets = assets.filter(a => a.type === 'image');
  const copyAssets = assets.filter(a => a.type === 'copy');
  const videoAssets = assets.filter(a => a.type === 'video');

  return (
    <div className="space-y-6">
      {/* Asset Manager Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Campaign Assets</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={importFromAdSignal}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Import from Ad Signal
              </Button>
              <Button onClick={() => setShowNewAssetForm(!showNewAssetForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
        </CardHeader>
        {showNewAssetForm && (
          <CardContent className="border-t border-border pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Asset name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                />
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as any })}
                >
                  <option value="copy">Ad Copy</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              {newAsset.type === 'copy' ? (
                <Textarea
                  placeholder="Enter your ad copy content..."
                  value={newAsset.content}
                  onChange={(e) => setNewAsset({ ...newAsset, content: e.target.value })}
                  className="min-h-[100px]"
                />
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload {newAsset.type} files (drag & drop or click to browse)
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleAddAsset}>Create Asset</Button>
                <Button variant="outline" onClick={() => setShowNewAssetForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Asset Tabs */}
      <Tabs defaultValue="copy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="copy" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Ad Copy ({copyAssets.length})
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images ({imageAssets.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Videos ({videoAssets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copy" className="space-y-4">
          {copyAssets.map((asset) => (
            <Card key={asset.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-card-foreground">{asset.name}</h3>
                    <Badge variant="outline" className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(asset.content || '')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground whitespace-pre-wrap mb-4">{asset.content}</p>
                <div className="flex justify-between items-center text-sm text-card-foreground/70">
                  <span>Created: {asset.createdAt}</span>
                  <span>{asset.content?.length || 0} characters</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageAssets.map((asset) => (
              <Card key={asset.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-card-foreground text-sm">{asset.name}</h3>
                    <Badge variant="outline" className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    {asset.url ? (
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-card-foreground/70">
                    <span>{asset.size}</span>
                    <span>{asset.createdAt}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No video assets yet</h3>
            <p className="text-card-foreground/70 mb-4">Upload your first video asset to get started</p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignAssets;
