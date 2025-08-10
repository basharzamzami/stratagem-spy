import React from "react";
import type { AdListItem } from "../types/ad.types";

export function AdCard({ ad, onClick }: { ad: AdListItem; onClick: () => void }) {
  const isVideo = ad.creativeUrls.some((u) => /\.mp4|\.webm|\.mov/i.test(u));
  const thumbnail = ad.snapshotUrl || ad.creativeUrls[0];
  return (
    <button aria-label={`Open ad ${ad.id}`} onClick={onClick} className="text-left bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <div className="relative">
        {isVideo ? (
          <div className="relative">
            <img src={thumbnail} alt="Ad thumbnail" className="w-full h-48 object-cover rounded-t-lg" onError={(e) => ((e.currentTarget.src = "/placeholder.png"))} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <img src={thumbnail} alt="Ad thumbnail" className="w-full h-48 object-cover rounded-t-lg" onError={(e) => ((e.currentTarget.src = "/placeholder.png"))} />
        )}
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">{ad.platform}</div>
      </div>
      <div className="p-4">
        <div className="text-sm text-slate-600 line-clamp-2" title={ad.copy}>{ad.copy}</div>
        {ad.cta && (
          <div className="mt-2">
            <span className="inline-block text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">{ad.cta}</span>
          </div>
        )}
        <div className="mt-2 text-xs text-slate-500">Fetched {new Date(ad.fetchedAt).toLocaleString()}</div>
      </div>
    </button>
  );
}

export default AdCard;

