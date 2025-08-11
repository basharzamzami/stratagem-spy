
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [activePanel, setActivePanel] = useState('specter-net');

  const handleModuleSelect = (module: string) => {
    setActivePanel(module);
  };

  return (
    <div className="min-h-screen w-full bg-background flex overflow-hidden">
      <Navigation 
        onModuleSelect={handleModuleSelect}
        activeModule={activePanel}
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
