import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_NAME } from '@/lib/siteConfig';
import ResultsClient from './ResultsClient';

export const metadata: Metadata = {
  title: `Your Private Health Insurance Analysis | ${SITE_NAME}`,
  description:
    'Your personalised private health insurance analysis — compare costs, see your MLS, rebate and LHC loading, and get a clear recommendation based on your situation.',
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Your Private Health Insurance Analysis',
    description: 'Personalised comparison: No Insurance vs Basic/Bronze vs Silver/Gold.',
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-muted text-lg">Calculating your results…</p>
        </div>
      }
    >
      <ResultsClient />
    </Suspense>
  );
}
