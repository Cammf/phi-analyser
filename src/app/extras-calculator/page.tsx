import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import ExtrasCalculatorClient from './ExtrasCalculatorClient';

const PAGE_TITLE = 'Extras Cover Calculator 2026 | Is Extras Insurance Worth It?';
const PAGE_DESCRIPTION =
  'Calculate whether extras (general treatment) cover is worth the cost for your dental, optical, and physio usage. Free, independent break-even analysis.';
const PAGE_URL = `${SITE_URL}/extras-calculator`;

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
    { '@type': 'ListItem', position: 2, name: 'Extras Calculator', item: PAGE_URL },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Extras Cover Break-Even Calculator',
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

export default function ExtrasCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ExtrasCalculatorClient />
    </>
  );
}
