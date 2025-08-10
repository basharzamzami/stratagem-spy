import React, { useEffect, useState } from "react";
import type { AdDetail } from "../types/ad.types";
import CounterTaskForm from "./CounterTaskForm";

export function AdDetailModal({ adId, onClose }: { adId: string; onClose: () => void }) {
  const [data, setData] = useState<AdDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskCreated, setTaskCreated] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/ads/${adId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load ad"))))
      .then((json) => mounted && setData(json))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [adId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (taskCreated) {
      const t = setTimeout(() => onClose(), 800);
      return () => clearTimeout(t);
    }
  }, [taskCreated, onClose]);

  if (!adId) return null;

  return (
    <div role="dialog" aria-modal className="fixed inset-0 bg-black/60 z-50 flex">
      <div className="m-auto w-full h-full sm:h-[90vh] sm:w-[95vw] bg-white rounded-none sm:rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-fade-in">
        <div className="p-4 sm:p-6 overflow-auto">
          {loading ? (
            <div className="h-64 bg-slate-100 animate-pulse rounded" />
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : data ? (
            <div>
              <div className="mb-4">
                <div className="text-slate-500 text-xs">Creative</div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {data.creativeUrls.map((u) => (
                    <img key={u} src={u} alt="Creative" className="w-full h-40 object-cover rounded" onError={(e) => ((e.currentTarget.src = "/placeholder.png"))} />
                  ))}
                </div>
                {data.cta && <div className="mt-3 inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">{data.cta}</div>}
              </div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap">{data.copy}</div>
            </div>
          ) : null}
        </div>
        <div className="relative bg-slate-50 p-4 sm:p-6 overflow-auto">
          <button aria-label="Close modal" onClick={onClose} className="absolute top-3 right-3 text-slate-600 hover:text-slate-900">✕</button>
          {loading ? (
            <div className="h-64 bg-slate-200 animate-pulse rounded" />
          ) : error ? null : data ? (
            <div>
              <div className="mb-3 text-slate-500 text-xs">Landing page</div>
              {data.snapshotUrl ? (
                <img src={data.snapshotUrl} alt="Landing page screenshot" className="w-full max-h-[50vh] object-contain rounded border" />
              ) : (
                <div className="h-64 bg-slate-200 rounded" />
              )}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">H1:</span> {data.h1 || "—"}</div>
                <div><span className="text-slate-500">H2:</span> {data.h2 || "—"}</div>
                <div><span className="text-slate-500">Form:</span> {data.formPresent ? "✓" : "✗"}</div>
                <div><span className="text-slate-500">Pixel:</span> {data.pixelPresent ? "✓" : "✗"}</div>
              </div>
              <CounterTaskForm adId={adId} onSuccess={() => setTaskCreated(true)} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AdDetailModal;

