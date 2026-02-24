import Link from 'next/link';
import GuideBreadcrumbs from './GuideBreadcrumbs';
import GuideToc from './GuideToc';
import type { TocItem } from './GuideToc';
import GuideFaq from './GuideFaq';
import type { FaqItem } from './GuideFaq';
import AdSlot from './AdSlot';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';

// Re-export for guide page convenience
export type { TocItem } from './GuideToc';
export type { FaqItem } from './GuideFaq';

interface Crumb {
  label: string;
  href?: string;
}

interface RelatedGuide {
  href: string;
  title: string;
  description: string;
}

interface Props {
  title: string;
  description: string;
  /** e.g. "February 2026" */
  publishDate: string;
  /** e.g. "8 min read" */
  readingTime: string;
  toc: TocItem[];
  faq: FaqItem[];
  relatedGuides?: RelatedGuide[];
  breadcrumbs: Crumb[];
  /** Full canonical URL — used in Article JSON-LD */
  pageUrl: string;
  children: React.ReactNode;
}

/**
 * GuideLayout — 66/33 content + sidebar layout for all guide articles.
 *
 * Server component. Injects Article + FAQPage JSON-LD.
 * Renders: leaderboard ad, breadcrumbs, H1 + meta, mobile ToC (collapsible),
 * prose article, FAQ accordion, dual CTA, disclaimer, related guides,
 * and a sticky desktop sidebar with GuideToc + rectangle ad.
 */
export default function GuideLayout({
  title,
  description,
  publishDate,
  readingTime,
  toc,
  faq,
  relatedGuides = [],
  breadcrumbs,
  pageUrl,
  children,
}: Props) {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: pageUrl,
    datePublished: '2026-02-24',
    dateModified: '2026-02-24',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: 'en-AU',
  };

  const faqJsonLd =
    faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* FAQPage JSON-LD — GuideFaq is called with withSchema=false to avoid duplicates */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Leaderboard ad — desktop only ──────────────────────────────── */}
        <div className="py-4 hidden lg:flex justify-center border-b border-border">
          <AdSlot size="leaderboard" />
        </div>

        {/* ── Breadcrumbs ────────────────────────────────────────────────── */}
        <div className="pt-5 pb-2">
          <GuideBreadcrumbs crumbs={breadcrumbs} />
        </div>

        {/* ── H1 + meta row ──────────────────────────────────────────────── */}
        <div className="pb-6 border-b border-border">
          <h1 className="mb-3">{title}</h1>
          <p className="text-muted text-base mb-3 max-w-2xl leading-relaxed">{description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>Updated {publishDate}</span>
            <span aria-hidden="true">·</span>
            <span>{readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>FY 2025–26 rates</span>
          </div>
        </div>

        {/* ── Mobile ToC — collapsible <details> ─────────────────────────── */}
        {toc.length > 0 && (
          <details className="lg:hidden py-4 border-b border-border group">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-text-main list-none">
              <span>On this page</span>
              <svg
                className="w-4 h-4 text-muted group-open:rotate-180 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <ol className="mt-3 space-y-2">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                  <a href={`#${item.id}`} className="text-sm text-primary hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        )}

        {/* ── Content + sidebar grid ──────────────────────────────────────── */}
        <div className="py-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
          {/* ── Main content column ─────────────────────────────────────── */}
          <main>
            <article className="prose-guide">{children}</article>

            {/* FAQ accordion */}
            {faq.length > 0 && <GuideFaq items={faq} withSchema={false} />}

            {/* Dual CTA */}
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-primary/20">
              <h2 className="text-lg font-semibold text-text-main mb-2">
                Check your numbers — free calculator
              </h2>
              <p className="text-sm text-muted mb-4">
                Use your actual income, age, and situation to see what private health insurance
                would cost — or save — you. No commissions. Based on ATO and APRA data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/mls-calculator" className="btn-primary text-sm text-center">
                  MLS Calculator
                </Link>
                <Link
                  href="/should-i-get-private-health-insurance"
                  className="btn-secondary text-sm text-center"
                >
                  Full PHI Comparison →
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-border">
              <p className="text-xs text-muted leading-relaxed">
                <strong className="text-text-main">Disclaimer:</strong> This guide provides
                general information only — not financial or health advice. Rates and thresholds
                are based on ATO and government data for FY 2025–26. Always verify figures with
                the ATO and your insurer before making financial decisions.
              </p>
            </div>

            {/* Related guides */}
            {relatedGuides.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-text-main mb-4">Related guides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedGuides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="card hover:border-primary/40 transition-colors group block"
                    >
                      <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted leading-snug">{guide.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside>
            <GuideToc items={toc} />
          </aside>
        </div>
      </div>
    </>
  );
}
