
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handlePanelSelect = (panel: string | null) => {
    setActivePanel(panel);
  };

  return (
    <div className="min-h-screen w-full bg-background flex overflow-hidden">
      <Navigation onPanelSelect={handlePanelSelect} activePanel={activePanel} />
      <div className="flex-1 min-w-0 overflow-auto">
        <Dashboard activePanel={activePanel} />
      </div>
    </div>
  );
};

export default Index;
