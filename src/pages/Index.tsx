
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Navigation />
      <div className="flex-1 overflow-auto w-full">
        <div className="w-full max-w-none">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;
