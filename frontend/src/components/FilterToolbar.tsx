import React from "react";

export interface FiltersState {
  accountId: string;
  competitorId?: string;
  platform?: "meta" | "google" | "tiktok";
  dateFrom?: string;
  dateTo?: string;
}

export function FilterToolbar({ value, onChange, onClear }: { value: FiltersState; onChange: (v: FiltersState) => void; onClear: () => void }) {
  return (
    <div className="flex flex-wrap items-end gap-3 bg-white/10 p-3 rounded-lg text-white">
      <label className="text-sm">
        <div>Account</div>
        <input value={value.accountId} onChange={(e) => onChange({ ...value, accountId: e.target.value })} placeholder="Account ID" className="mt-1 bg-white text-slate-900 rounded px-2 py-1" />
      </label>
      <label className="text-sm">
        <div>Competitor</div>
        <input value={value.competitorId || ""} onChange={(e) => onChange({ ...value, competitorId: e.target.value || undefined })} placeholder="Competitor ID" className="mt-1 bg-white text-slate-900 rounded px-2 py-1" />
      </label>
      <label className="text-sm">
        <div>Platform</div>
        <select value={value.platform || ""} onChange={(e) => onChange({ ...value, platform: (e.target.value || undefined) as any })} className="mt-1 bg-white text-slate-900 rounded px-2 py-1">
          <option value="">All</option>
          <option value="meta">Meta</option>
          <option value="google">Google</option>
          <option value="tiktok">TikTok</option>
        </select>
      </label>
      <label className="text-sm">
        <div>From</div>
        <input type="date" value={value.dateFrom || ""} onChange={(e) => onChange({ ...value, dateFrom: e.target.value || undefined })} className="mt-1 bg-white text-slate-900 rounded px-2 py-1" />
      </label>
      <label className="text-sm">
        <div>To</div>
        <input type="date" value={value.dateTo || ""} onChange={(e) => onChange({ ...value, dateTo: e.target.value || undefined })} className="mt-1 bg-white text-slate-900 rounded px-2 py-1" />
      </label>
      <button onClick={onClear} className="ml-auto bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded">Clear</button>
    </div>
  );
}

export default FilterToolbar;

