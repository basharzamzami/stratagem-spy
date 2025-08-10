
import PageHeader from '@/components/PageHeader';
import LandingPageScraperComponent from '@/components/landing-page-scraper/LandingPageScraperComponent';

export default function LandingPageScraperPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Landing Page Scraper & Funnel Tracker"
        subtitle="Advanced competitor analysis with landing page scraping and conversion funnel tracking"
      />
      <LandingPageScraperComponent />
    </div>
  );
}
