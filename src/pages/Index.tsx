
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      <Navigation />
      <div className="flex-1 w-full h-full overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
