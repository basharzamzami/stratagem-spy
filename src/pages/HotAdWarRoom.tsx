
import ProductionHotAdDetector from '@/components/ad-signal-hijack/ProductionHotAdDetector';
import WatchlistManager from '@/components/ad-signal-hijack/WatchlistManager';
import PageHeader from '@/components/PageHeader';

const HotAdWarRoom = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="🔥 Hot Ad War Room"
        subtitle="Production-grade hot ad detection and counter-campaign system"
      />
      
      <div className="grid gap-6">
        <WatchlistManager />
        <ProductionHotAdDetector />
      </div>
    </div>
  );
};

export default HotAdWarRoom;
