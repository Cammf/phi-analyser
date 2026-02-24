import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import GuideBreadcrumbs from '@/components/guide/GuideBreadcrumbs';

const PAGE_TITLE = 'About This Site';
const PAGE_DESCRIPTION =
  'How this independent private health insurance calculator works — data sources, calculation methods, and what this site is (and isn\'t).';
const PAGE_URL = `${SITE_URL}/about`;

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

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <GuideBreadcrumbs
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />
      <h1 className="mb-6">About this site</h1>

      {/* What this site does */}
      <section className="mb-10">
        <h2 className="mb-3">What this site does</h2>
        <p className="text-muted mb-4">
          This is a free, independent calculator that helps Australians understand whether
          private health insurance saves them money or costs them more. It answers questions like:
        </p>
        <ul className="list-disc pl-6 text-muted space-y-2 mb-4">
          <li>Am I paying the Medicare Levy Surcharge, and would insurance be cheaper?</li>
          <li>How much LHC loading will I pay if I wait to get cover?</li>
          <li>Is my extras cover giving me value for money?</li>
          <li>How do public and private hospital waiting times compare for my procedure?</li>
          <li>What would the next 10 years cost under different insurance scenarios?</li>
        </ul>
        <p className="text-muted">
          Every calculation uses your actual numbers — income, age, family situation — not
          generic averages.
        </p>
      </section>

      {/* What it is NOT */}
      <section className="mb-10">
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-700">
          <h2 className="text-amber-800 dark:text-amber-300 mb-3">What this site is NOT</h2>
          <ul className="list-disc pl-6 text-amber-800 dark:text-amber-300 space-y-2 text-sm">
            <li><strong>Not financial advice.</strong> This site provides general information and estimates.
              It does not take into account your complete financial situation.</li>
            <li><strong>Not a comparison site.</strong> We don&apos;t compare or recommend specific
              health insurance policies or insurers.</li>
            <li><strong>Not affiliated with any insurer.</strong> We don&apos;t sell insurance,
              earn commissions, or receive referral fees from any health fund.</li>
            <li><strong>Not a substitute for professional advice.</strong> For complex situations,
              speak to a financial adviser or contact{' '}
              <a
                href="https://www.servicesaustralia.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Services Australia
              </a>.
            </li>
          </ul>
        </div>
      </section>

      {/* How the calculations work */}
      <section className="mb-10">
        <h2 className="mb-4">How the calculations work</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1">Medicare Levy Surcharge (MLS)</h3>
            <p className="text-sm text-muted">
              Calculates your MLS rate based on income, family type, and dependent children using the
              ATO&apos;s FY 2025–26 thresholds. Compares the surcharge cost to the cheapest Basic
              hospital policy (after government rebate and any LHC loading).
            </p>
          </div>
          <div>
            <h3 className="mb-1">Government rebate</h3>
            <p className="text-sm text-muted">
              Looks up your rebate percentage from the ATO&apos;s income tier and age bracket matrix.
              The rebate reduces your premium — higher for lower incomes and older Australians.
              Tier 3 earners ($158,001+ single) receive 0% rebate.
            </p>
          </div>
          <div>
            <h3 className="mb-1">Lifetime Health Cover (LHC) loading</h3>
            <p className="text-sm text-muted">
              Calculates the 2%-per-year loading that applies if you don&apos;t take out hospital
              cover by 1 July after your 31st birthday. Shows the 10-year cumulative cost and
              what it costs to delay. Based on privatehealth.gov.au rules.
            </p>
          </div>
          <div>
            <h3 className="mb-1">Scenario comparison</h3>
            <p className="text-sm text-muted">
              Compares three options — no insurance, Basic/Bronze, and Silver/Gold — over 1 year
              and 10 years, factoring in MLS, rebate, LHC loading, premium growth (4.4% default),
              and estimated gap fees. Shows which option is cheapest and which offers best value.
            </p>
          </div>
          <div>
            <h3 className="mb-1">Extras break-even</h3>
            <p className="text-sm text-muted">
              Estimates the annual value of extras cover based on your usage (dental, optical,
              physio) against the premium cost. Uses average claim amounts from APRA data.
              Industry-wide, extras returns less than 45 cents per dollar — most people lose money.
            </p>
          </div>
          <div>
            <h3 className="mb-1">Wait time comparison</h3>
            <p className="text-sm text-muted">
              Compares public median and 90th-percentile wait times to private typical wait times
              for common elective procedures. Data sourced from AIHW 2023–24 national statistics.
            </p>
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="mb-10">
        <h2 className="mb-4">Data sources</h2>
        <div className="space-y-3">
          {[
            {
              name: 'Australian Taxation Office (ATO)',
              url: 'https://www.ato.gov.au',
              description: 'MLS thresholds and rates, rebate tier percentages, income definitions',
            },
            {
              name: 'Australian Prudential Regulation Authority (APRA)',
              url: 'https://www.apra.gov.au',
              description: 'Industry statistics, benefits ratios, premium data, participation rates',
            },
            {
              name: 'Australian Institute of Health and Welfare (AIHW)',
              url: 'https://www.aihw.gov.au',
              description: 'Elective surgery waiting times, hospital utilisation data',
            },
            {
              name: 'PrivateHealth.gov.au',
              url: 'https://www.privatehealth.gov.au',
              description: 'LHC loading rules, youth discount, tier definitions, policy comparison',
            },
            {
              name: 'Medical Costs Finder',
              url: 'https://www.health.gov.au/resources/apps-and-tools/medical-costs-finder',
              description: 'Typical fees for common medical procedures',
            },
            {
              name: 'Moneysmart (ASIC)',
              url: 'https://moneysmart.gov.au',
              description: 'Consumer guidance on health insurance decisions',
            },
          ].map((source) => (
            <div key={source.name} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {source.name}
                </a>
                <p className="text-sm text-muted">{source.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When rates are updated */}
      <section className="mb-10">
        <h2 className="mb-3">When rates are updated</h2>
        <div className="space-y-3 text-sm text-muted">
          <div className="flex gap-3">
            <span className="font-semibold text-text-main whitespace-nowrap">1 April</span>
            <span>Rebate tier percentages are re-indexed. Premium increases take effect (announced in February, effective April).</span>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold text-text-main whitespace-nowrap">1 July</span>
            <span>MLS income thresholds may be adjusted (indexed annually). New financial year begins — all calculator rates switch to the new FY.</span>
          </div>
        </div>
        <p className="text-sm text-muted mt-3">
          We update all data files and re-verify against official sources within one week of each
          change. The site displays the effective FY and data verification date on all calculator
          and results pages.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center py-8 border-t border-border">
        <h2 className="mb-4">Ready to check your numbers?</h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/mls-calculator" className="btn-primary">
            MLS Calculator
          </Link>
          <Link href="/lhc-loading-calculator" className="btn-secondary">
            LHC Loading Calculator
          </Link>
        </div>
      </section>
    </main>
  );
}
