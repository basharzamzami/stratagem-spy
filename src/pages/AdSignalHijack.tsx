import Navigation from "@/components/Navigation";
import React from "react";
import AdSignalHijackPage from "../../frontend/src/pages/AdSignalHijack";

export default function AdSignalHijack() {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <AdSignalHijackPage />
      </div>
    </div>
  );
}
