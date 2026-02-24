import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_NAME } from '@/lib/siteConfig';
import LHCResultsClient from './LHCResultsClient';

const PAGE_TITLE = 'Your LHC Loading Results | Lifetime Health Cover Calculator';
const PAGE_DESCRIPTION =
  'Your personalised LHC loading calculation — see your loading percentage, annual cost, and how much waiting would cost you.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: { index: false, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function LHCResultsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-muted">Calculating your results...</p>
      </div>
    }>
      <LHCResultsClient />
    </Suspense>
  );
}
