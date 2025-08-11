
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [activePanel, setActivePanel] = useState('specter-net');

  const handlePanelChange = (panel: string) => {
    setActivePanel(panel);
  };

  return (
    <div className="min-h-screen w-full bg-background flex overflow-hidden">
      <Navigation 
        activePanel={activePanel}
        onPanelChange={handlePanelChange}
      />
      <div className="flex-1 min-w-0 overflow-auto">
        <Dashboard 
          activePanel={activePanel}
          onPanelChange={setActivePanel}
        />
      </div>
    </div>
  );
};

export default Index;
