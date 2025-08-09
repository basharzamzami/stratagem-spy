
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen w-screen bg-background flex">
      <Navigation />
      <div className="flex-1 min-h-screen w-full">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
