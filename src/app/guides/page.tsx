import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';

const PAGE_TITLE = 'Guides — Private Health Insurance Australia';
const PAGE_DESCRIPTION =
  'Free guides on private health insurance in Australia — Medicare Levy Surcharge, LHC loading, hospital cover tiers, extras cover, and more. Updated FY 2025–26.';
const PAGE_URL = `${SITE_URL}/guides`;

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

// ── Guide data ────────────────────────────────────────────────────────────────

interface Guide {
  href: string;
  title: string;
  description: string;
  readingTime: string;
}

interface Category {
  name: string;
  badge: string;
  badgeClass: string;
  guides: Guide[];
}

const categories: Category[] = [
  {
    name: 'Tax & Surcharges',
    badge: 'Tax',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    guides: [
      {
        href: '/guides/medicare-levy-surcharge-explained',
        title: 'Medicare Levy Surcharge Explained',
        description:
          'What the surcharge is, who pays it, how to calculate it, and the cheapest legal way to avoid it.',
        readingTime: '8 min',
      },
      {
        href: '/guides/government-rebate-on-private-health-insurance',
        title: 'Government Rebate on Private Health Insurance',
        description:
          'How the government rebate reduces your premium — and how much you get based on income and age.',
        readingTime: '6 min',
      },
    ],
  },
  {
    name: 'Age & Loading',
    badge: 'Loading',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    guides: [
      {
        href: '/guides/lifetime-health-cover-loading',
        title: 'Lifetime Health Cover Loading Explained',
        description:
          'The 2%-per-year age penalty — how it works, when it applies, and the 10-year rule that removes it.',
        readingTime: '8 min',
      },
      {
        href: '/guides/private-health-insurance-under-31',
        title: 'Under 31: Should You Get Private Health Insurance?',
        description:
          'The LHC loading deadline, youth discount, and actual cost projections for people approaching 31.',
        readingTime: '8 min',
      },
    ],
  },
  {
    name: 'Choosing Cover',
    badge: 'Cover',
    badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    guides: [
      {
        href: '/guides/how-private-health-insurance-works',
        title: 'How Private Health Insurance Works',
        description:
          'Medicare vs private, hospital cover vs extras, the four tiers, and key terms — all explained.',
        readingTime: '8 min',
      },
      {
        href: '/guides/hospital-cover-tiers-explained',
        title: 'Hospital Cover Tiers Explained',
        description:
          'Gold, Silver, Bronze, Basic — what each covers, what each costs, and who actually needs what.',
        readingTime: '8 min',
      },
      {
        href: '/guides/extras-cover-is-it-worth-it',
        title: 'Is Extras Cover Worth It?',
        description:
          'APRA data shows most people get back less than 45 cents per dollar. Find out if you\'re the exception.',
        readingTime: '7 min',
      },
    ],
  },
  {
    name: 'Is It Worth It?',
    badge: 'Decision',
    badgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    guides: [
      {
        href: '/guides/is-private-health-insurance-worth-it',
        title: 'Is Private Health Insurance Worth It?',
        description:
          'An honest look at when insurance makes financial sense — and when it doesn\'t. No sales pitch.',
        readingTime: '10 min',
      },
      {
        href: '/guides/gap-fees-explained',
        title: 'Gap Fees Explained',
        description:
          'The hidden cost of private health — what gap fees are, why they exist, and how to minimise them.',
        readingTime: '7 min',
      },
      {
        href: '/guides/private-vs-public-hospital',
        title: 'Private vs Public Hospital',
        description:
          'A balanced comparison of what you actually get — and don\'t get — in public and private hospitals.',
        readingTime: '8 min',
      },
    ],
  },
  {
    name: 'Life Stages',
    badge: 'Life Stage',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    guides: [
      {
        href: '/guides/private-health-insurance-for-families',
        title: 'Private Health Insurance for Families',
        description:
          'Family MLS thresholds, children covered until 31, maternity planning, and family premium comparisons.',
        readingTime: '8 min',
      },
      {
        href: '/guides/private-vs-public-maternity',
        title: 'Private vs Public Maternity Care',
        description:
          'Real cost comparison, choice of obstetrician, C-section rates, and the 12-month waiting period.',
        readingTime: '9 min',
      },
      {
        href: '/guides/private-health-insurance-in-retirement',
        title: 'Private Health Insurance in Retirement',
        description:
          'Income changes, age-based rebate increases, and an honest look at when to keep or drop cover.',
        readingTime: '8 min',
      },
    ],
  },
];

// ── Featured (MVP) guides shown at the top ────────────────────────────────────

const featuredGuides: Guide[] = [
  {
    href: '/guides/medicare-levy-surcharge-explained',
    title: 'Medicare Levy Surcharge Explained',
    description: 'Who pays the 1–1.5% surcharge and how to avoid it.',
    readingTime: '8 min',
  },
  {
    href: '/guides/lifetime-health-cover-loading',
    title: 'LHC Loading Explained',
    description: 'The age penalty on premiums and the 10-year rule.',
    readingTime: '8 min',
  },
  {
    href: '/guides/is-private-health-insurance-worth-it',
    title: 'Is Private Health Insurance Worth It?',
    description: 'An honest answer — sometimes the answer is no.',
    readingTime: '10 min',
  },
  {
    href: '/guides/hospital-cover-tiers-explained',
    title: 'Hospital Cover Tiers Explained',
    description: 'Gold, Silver, Bronze, Basic — what each tier really covers.',
    readingTime: '8 min',
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GuidesIndexPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="mb-3">Guides</h1>
        <p className="text-muted text-base leading-relaxed">
          Free, independent guides on private health insurance in Australia. No commissions,
          no sponsored content — just clear explanations based on ATO, APRA, and AIHW data.
          Updated FY 2025–26.
        </p>
      </div>

      {/* Featured guides */}
      <section className="mb-14">
        <h2 className="mb-5">Most popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="card hover:border-primary/40 transition-colors group block"
            >
              <span className="text-xs font-medium text-muted">{guide.readingTime} read</span>
              <h3 className="font-semibold text-base mt-2 mb-1 group-hover:text-primary transition-colors leading-snug">
                {guide.title}
              </h3>
              <p className="text-sm text-muted leading-snug">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mb-14 p-5 bg-blue-50 dark:bg-blue-950/30 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          <strong className="text-text-main">Want your actual numbers?</strong> Our calculators
          use your income, age, and situation — not generic averages.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/mls-calculator" className="btn-primary text-sm !py-2 !px-4">
            MLS Calculator
          </Link>
          <Link href="/lhc-loading-calculator" className="btn-secondary text-sm !py-2 !px-4">
            LHC Calculator
          </Link>
        </div>
      </section>

      {/* All guides by category */}
      <section>
        <h2 className="mb-8">All guides</h2>
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-lg font-semibold text-text-main">{category.name}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${category.badgeClass}`}
                >
                  {category.badge}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.guides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="card hover:border-primary/40 transition-colors group block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${category.badgeClass}`}
                      >
                        {category.badge}
                      </span>
                      <span className="text-xs text-muted">{guide.readingTime} read</span>
                    </div>
                    <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors leading-snug">
                      {guide.title}
                    </h4>
                    <p className="text-sm text-muted leading-snug">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom disclaimer */}
      <div className="mt-14 pt-8 border-t border-border">
        <p className="text-xs text-muted leading-relaxed max-w-2xl">
          <strong className="text-text-main">About these guides:</strong> All content is based
          on publicly available data from the ATO, APRA, AIHW, and PrivateHealth.gov.au. Rates
          and thresholds are for FY 2025–26. This site is independent — we don&apos;t sell
          insurance, earn commissions, or receive referral fees from any health fund. Not
          financial advice.
        </p>
      </div>
    </main>
  );
}
