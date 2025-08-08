import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdItem } from "@/services/adSignal";

export default function AdCard({ ad }: { ad: AdItem }) {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="flex gap-4">
          {ad.creative_url ? (
            <img src={ad.creative_url} alt={ad.headline || "ad"} className="w-40 h-24 object-cover rounded" loading="lazy" />
          ) : (
            <div className="w-40 h-24 bg-muted rounded" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary">{ad.platform.toUpperCase()}</Badge>
              {ad.active && <Badge className="bg-success/10 text-success">Active</Badge>}
              {ad.first_seen && <span className="text-xs text-muted-foreground">Launched {new Date(ad.first_seen).toLocaleDateString()}</span>}
            </div>
            <div className="text-sm font-semibold text-foreground truncate">{ad.headline || ad.primary_text || ad.competitor_name}</div>
            {ad.primary_text && <div className="text-xs text-muted-foreground line-clamp-2">{ad.primary_text}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
