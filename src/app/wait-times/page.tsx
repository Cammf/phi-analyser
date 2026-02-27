import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import WaitTimesClient from './WaitTimesClient';

const PAGE_TITLE = 'Private vs Public Hospital Wait Times Australia 2026';
const PAGE_DESCRIPTION =
  'Compare public and private hospital wait times for common elective procedures. See how much time private health insurance can save — and which cover tier you need.';
const PAGE_URL = `${SITE_URL}/wait-times`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Wait Times', item: PAGE_URL },
  ],
};

export default function WaitTimesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <WaitTimesClient />
    </>
  );
}
