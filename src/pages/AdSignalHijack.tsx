
import Navigation from '@/components/Navigation';
import AdSignalDashboard from '@/components/AdSignalDashboard';

const AdSignalHijack = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <AdSignalDashboard />
      </div>
    </div>
  );
};

export default AdSignalHijack;
