import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import { WizardProvider } from '@/components/wizard/WizardContext';
import WizardContainer from '@/components/wizard/WizardContainer';

const pageUrl = `${SITE_URL}/should-i-get-private-health-insurance`;

export const metadata: Metadata = {
  title: `Should I Get Private Health Insurance? Calculator 2026 | ${SITE_NAME}`,
  description:
    'Compare the real cost of private health insurance against going without. Personalised analysis including MLS, rebate, LHC loading and out-of-pocket scenarios for FY 2025-26.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Should I Get Private Health Insurance? Calculator 2026 | ${SITE_NAME}`,
    description:
      'Compare the real cost of private health insurance against going without. Personalised analysis including MLS, rebate, LHC loading and out-of-pocket scenarios for FY 2025-26.',
    url: pageUrl,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function ShouldIGetPHIPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Should I Get Private Health Insurance? Calculator 2026`,
    description: metadata.description,
    url: pageUrl,
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WizardProvider>
        <WizardContainer />
      </WizardProvider>
    </>
  );
}
