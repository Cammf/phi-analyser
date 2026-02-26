import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import { WizardProvider } from '@/components/wizard/WizardContext';
import WizardContainer from '@/components/wizard/WizardContainer';
import { parseWizardParams } from '@/lib/wizardParams';
import type { WizardState } from '@/lib/types';

export const metadata: Metadata = {
  title: `Should I Get Private Health Insurance? Calculator 2026 | ${SITE_NAME}`,
  description:
    'Compare the real cost of private health insurance vs going without. Personalised analysis based on your income, age, family situation, and health needs. FY 2025–26 rates.',
  alternates: {
    canonical: `${SITE_URL}/should-i-get-private-health-insurance`,
  },
  openGraph: {
    title: 'Should I Get Private Health Insurance? | Free Calculator',
    description:
      'Find out if private health insurance saves you money or costs you more — personalised to your situation.',
    url: `${SITE_URL}/should-i-get-private-health-insurance`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ShouldIGetPHIPage({ searchParams }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Private Health Insurance Calculator',
    description:
      'Compare the cost of private health insurance vs going without — personalised to your income, age, and situation.',
    url: `${SITE_URL}/should-i-get-private-health-insurance`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
    creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  // Restore wizard state if navigating back from results with restore=1
  let initialState: WizardState | undefined;
  if (searchParams.restore === '1') {
    const p = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams)
          .filter(([, v]) => typeof v === 'string')
          .map(([k, v]) => [k, v as string]),
      ),
    );
    const inputs = parseWizardParams(p);
    if (inputs) {
      initialState = {
        currentStep: 5,
        inputs,
        isComplete: false,
      };
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WizardProvider initialState={initialState}>
        <WizardContainer />
      </WizardProvider>
    </>
  );
}
