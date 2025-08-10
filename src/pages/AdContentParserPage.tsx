
import PageHeader from '@/components/PageHeader';
import AdContentParserComponent from '@/components/ad-content-parser/AdContentParserComponent';

export default function AdContentParserPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="NLP Ad Content Parser"
        subtitle="Advanced machine learning models for parsing competitor ad structures, psychological triggers, and audience insights"
      />
      <AdContentParserComponent />
    </div>
  );
}
