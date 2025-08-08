import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function AdSignalHijack() {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 sticky top-0 bg-background z-10 border-b border-border">
            <div className="py-4">
              <h1 className="text-3xl font-bold text-foreground">Ad Signal Hijack</h1>
              <p className="text-muted-foreground">Real-time competitor ad tracking & decoding</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-4">
              <Input placeholder="Business name" />
              <Input placeholder="Industry" />
              <Input placeholder="Location (city/state/zip)" />
              <Button variant="outline">Filters</Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="saas-card p-6">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Live Ad Feed</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-success">LIVE</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Coming next: real ads loaded here.</div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="saas-card p-6">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-4">Ad Analysis Dashboard</h3>
                    <div>Charts and insights will render here.</div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="saas-card p-6">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-4">Export & Reporting</h3>
                    <div className="flex gap-3">
                      <Button>CSV</Button>
                      <Button variant="outline">PDF</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
