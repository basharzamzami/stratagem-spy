
import PageHeader from '@/components/PageHeader';
import EmailSequenceMonitor from '@/components/email-monitoring/EmailSequenceMonitor';

export default function EmailMonitoring() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Email Sequence Monitoring"
        subtitle="Track and optimize your email marketing campaigns with real-time analytics and performance insights."
      />
      <main className="container mx-auto px-6 py-8">
        <EmailSequenceMonitor />
      </main>
    </div>
  );
}
