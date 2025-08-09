import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { SearchFilters } from "@/services/adSignal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";

export default function FilterBar({ onChange }: { onChange: (f: SearchFilters) => void }) {
  const [business, setBusiness] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState<string>("meta");
  const [datePreset, setDatePreset] = useState<string>("7");
  const [customFrom, setCustomFrom] = useState<Date | undefined>(undefined);
  const [customTo, setCustomTo] = useState<Date | undefined>(undefined);
  const [format, setFormat] = useState<string>("");
  const [spend, setSpend] = useState<number[]>([0, 100]);
  const [engagement, setEngagement] = useState<number[]>([0, 100]);

  const debouncedBusiness = useDebounce(business, 400);
  const debouncedIndustry = useDebounce(industry, 400);
  const debouncedLocation = useDebounce(location, 400);

  useEffect(() => {
    // passive update with debounce, Apply still triggers fetch
  }, [debouncedBusiness, debouncedIndustry, debouncedLocation]);

  const dateRange = useMemo(() => {
    if (datePreset === "7") {
      const to = new Date();
      const from = new Date(); from.setDate(to.getDate() - 7);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    if (datePreset === "30") {
      const to = new Date();
      const from = new Date(); from.setDate(to.getDate() - 30);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    if (customFrom && customTo) {
      return { from: customFrom.toISOString(), to: customTo.toISOString() };
    }
    return undefined;
  }, [datePreset, customFrom, customTo]);

  const apply = () => onChange({
    business: debouncedBusiness || undefined,
    industry: debouncedIndustry || undefined,
    location: parseLocation(debouncedLocation),
    platforms: platform ? [platform as any] : undefined,
    dateRange,
    adFormats: format ? [format] : undefined,
    spendRange: { min: spend[0], max: spend[1] },
    engagementRange: { min: engagement[0], max: engagement[1] },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center py-4">
      <Input className="lg:col-span-2" placeholder="Business" value={business} onChange={(e) => setBusiness(e.target.value)} />
      <Input className="lg:col-span-2" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      <Input className="lg:col-span-3" placeholder="Location (city/state/zip)" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Select value={platform} onValueChange={setPlatform}>
        <SelectTrigger className="lg:col-span-2"><SelectValue placeholder="Platform" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="meta">Meta</SelectItem>
          <SelectItem value="google" disabled>Google</SelectItem>
          <SelectItem value="youtube" disabled>YouTube</SelectItem>
          <SelectItem value="tiktok" disabled>TikTok</SelectItem>
        </SelectContent>
      </Select>
      <Select value={datePreset} onValueChange={setDatePreset}>
        <SelectTrigger className="lg:col-span-1"><SelectValue placeholder="Date" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="lg:col-span-1" disabled={datePreset !== 'custom'}>
            Pick dates
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-2">
            <Calendar mode="single" selected={customFrom} onSelect={setCustomFrom} />
            <Calendar mode="single" selected={customTo} onSelect={setCustomTo} />
          </div>
        </PopoverContent>
      </Popover>

      <Select value={format} onValueChange={setFormat}>
        <SelectTrigger className="lg:col-span-1"><SelectValue placeholder="Format" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="image">Image</SelectItem>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="carousel">Carousel</SelectItem>
        </SelectContent>
      </Select>

      <div className="lg:col-span-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-14">Spend</span>
        <Slider value={spend} onValueChange={setSpend} step={5} min={0} max={100} className="flex-1" />
      </div>

      <div className="lg:col-span-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-14">Engage</span>
        <Slider value={engagement} onValueChange={setEngagement} step={5} min={0} max={100} className="flex-1" />
      </div>

      <Button variant="outline" className="lg:col-span-1" onClick={apply}>Apply</Button>
    </div>
  );
}

function parseLocation(input: string) {
  const parts = input.split(",");
  const city = parts[0]?.trim() || undefined;
  const rest = parts[1]?.trim() || "";
  const [state, zip] = rest.split(/\s+/);
  return { city, state, zip };
}
