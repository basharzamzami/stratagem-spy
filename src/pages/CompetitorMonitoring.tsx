
import PageHeader from '@/components/PageHeader';
import RealTimeMonitorDashboard from '@/components/competitor-monitoring/RealTimeMonitorDashboard';

export default function CompetitorMonitoring() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Competitor Monitoring"
        subtitle="Real-time competitor activity detection with automated response playbooks"
      />
      <main className="container mx-auto px-6 py-8">
        <RealTimeMonitorDashboard />
      </main>
    </div>
  );
}
