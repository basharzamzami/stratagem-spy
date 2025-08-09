
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Eye, 
  Palette, 
  Brain, 
  Target, 
  Zap,
  TrendingUp,
  Users,
  Clock,
  Shield
} from 'lucide-react';
import { AdPreview, CreativeDNA } from '@/services/creativeDNAAnalyzer';

interface AdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  adPreview: AdPreview | null;
}

const AdPreviewModal: React.FC<AdPreviewModalProps> = ({ isOpen, onClose, adPreview }) => {
  if (!adPreview) return null;

  const { creative_dna } = adPreview;

  const getHookTypeColor = (hookType: CreativeDNA['hook_type']) => {
    const colors = {
      curiosity: 'bg-blue-500/20 text-blue-400',
      fear: 'bg-red-500/20 text-red-400',
      status: 'bg-purple-500/20 text-purple-400',
      urgency: 'bg-orange-500/20 text-orange-400',
      social_proof: 'bg-green-500/20 text-green-400',
      scarcity: 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[hookType] || 'bg-gray-500/20 text-gray-400';
  };

  const getToneColor = (tone: CreativeDNA['tone']) => {
    const colors = {
      professional: 'bg-slate-500/20 text-slate-400',
      casual: 'bg-cyan-500/20 text-cyan-400',
      emotional: 'bg-pink-500/20 text-pink-400',
      aggressive: 'bg-red-500/20 text-red-400',
      friendly: 'bg-green-500/20 text-green-400'
    };
    return colors[tone] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Ad Creative Analysis: {adPreview.ad_id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ad Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ad Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={adPreview.image_url} 
                    alt="Ad Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{adPreview.title}</h3>
                  <p className="text-muted-foreground">{adPreview.description}</p>
                  
                  <div className="pt-3">
                    <Button className="w-full" size="lg">
                      {adPreview.cta_text}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Landing Page:</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={adPreview.landing_page_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Page
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Creative DNA Analysis */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Creative DNA Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hook Type */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Hook Type</span>
                  </div>
                  <Badge className={getHookTypeColor(creative_dna.hook_type)}>
                    {creative_dna.hook_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                {/* Tone */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tone</span>
                  </div>
                  <Badge className={getToneColor(creative_dna.tone)}>
                    {creative_dna.tone.toUpperCase()}
                  </Badge>
                </div>

                {/* Color Palette */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Color Palette</span>
                  </div>
                  <div className="flex gap-2">
                    {creative_dna.color_palette.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Ad Structure */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Structure</span>
                  </div>
                  <Badge variant="outline">
                    {creative_dna.ad_structure.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                {/* CTA Style */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">CTA Style</span>
                  </div>
                  <Badge variant="outline">
                    {creative_dna.cta_style.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                <Separator />

                {/* Visual Elements */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Visual Elements</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {creative_dna.visual_elements.map((element, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {element.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Psychological Triggers */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Psychological Triggers</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {creative_dna.psychological_triggers.map((trigger, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-red-500/10 text-red-400">
                        {trigger.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdPreviewModal;
