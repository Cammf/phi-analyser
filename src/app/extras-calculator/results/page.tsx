import type { Metadata } from 'next';
import { Suspense } from 'react';
import ExtrasResultsClient from './ExtrasResultsClient';

export const metadata: Metadata = {
  title: 'Extras Cover Results | Is It Worth It?',
  description: 'Your personalised extras cover break-even analysis.',
  robots: { index: false, follow: true },
};

export default function ExtrasResultsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-muted">
        Calculating your extras value…
      </div>
    }>
      <ExtrasResultsClient />
    </Suspense>
  );
}
