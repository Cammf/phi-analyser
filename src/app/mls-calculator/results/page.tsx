import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import MLSResultsClient from './MLSResultsClient';

const PAGE_TITLE = 'Your MLS Results | Medicare Levy Surcharge Calculator';
const PAGE_DESCRIPTION =
  'Your personalised Medicare Levy Surcharge calculation — see your MLS rate, annual cost, and whether basic hospital cover could save you money.';

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

export default function MLSResultsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-muted">Calculating your results...</p>
      </div>
    }>
      <MLSResultsClient />
    </Suspense>
  );
}
