
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handlePanelChange = (panel: string | null) => {
    setActivePanel(panel);
  };

  const handlePanelClose = () => {
    setActivePanel(null);
  };

  return (
    <div className="min-h-screen w-full bg-background flex overflow-hidden">
      <Navigation 
        onPanelChange={handlePanelChange} 
        activePanel={activePanel}
      />
      <div className="flex-1 min-w-0 overflow-hidden">
        <Dashboard 
          activePanel={activePanel} 
          onPanelClose={handlePanelClose}
        />
      </div>
    </div>
  );
};

export default Index;
