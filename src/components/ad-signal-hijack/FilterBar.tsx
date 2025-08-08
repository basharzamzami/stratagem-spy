import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SearchFilters } from "@/services/adSignal";

export default function FilterBar({ onChange }: { onChange: (f: SearchFilters) => void }) {
  const [business, setBusiness] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-4">
      <Input placeholder="Business name" value={business} onChange={(e) => setBusiness(e.target.value)} />
      <Input placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      <Input placeholder="Location (city/state/zip)" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Button variant="outline" onClick={() => onChange({ business, industry, location: parseLocation(location) })}>
        Apply
      </Button>
    </div>
  );
}

function parseLocation(input: string) {
  // naive parser: "city, state zip" or any part
  const parts = input.split(",");
  const city = parts[0]?.trim() || undefined;
  const rest = parts[1]?.trim() || "";
  const [state, zip] = rest.split(/\s+/);
  return { city, state, zip };
}
