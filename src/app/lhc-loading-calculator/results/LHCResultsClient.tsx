'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateLHCLoadingSimple } from '@/lib/lhcCalculations';
import { HOSPITAL_PREMIUMS_SINGLE } from '@/lib/resolveInputs';
import { formatDollars, formatPercentage } from '@/lib/format';
import InfoTooltip from '@/components/wizard/InfoTooltip';

type CoverHistory = 'never' | 'currently' | 'used-to';

export default function LHCResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);

  const params = useMemo(() => {
    const ageStr = searchParams.get('age');
    const cover = searchParams.get('cover') as CoverHistory | null;
    const yearsStr = searchParams.get('years');
    const deferStr = searchParams.get('defer');

    if (!ageStr || !cover) return null;

    const age = parseInt(ageStr, 10);
    const yearsHeld = yearsStr ? parseInt(yearsStr, 10) : 0;
    const deferAge = deferStr ? parseInt(deferStr, 10) : undefined;

    if (isNaN(age) || age < 18 || age > 100) return null;

    return { age, cover, yearsHeld, deferAge };
  }, [searchParams]);

  const result = useMemo(() => {
    if (!params) return null;

    const hasHeldCover = params.cover === 'currently';
    return calculateLHCLoadingSimple({
      currentAge: params.age,
      hasHeldHospitalCover: hasHeldCover,
      yearsHeld: hasHeldCover ? params.yearsHeld : 0,
      basePremium: HOSPITAL_PREMIUMS_SINGLE.bronze,
      deferAge: params.deferAge,
    });
  }, [params]);

  // Build year-by-year loading cost projection for 10 years
  const yearByYear = useMemo(() => {
    if (!result || result.loadingPercentage <= 0) return [];
    const rows = [];
    const currentYear = new Date().getFullYear();
    let cumulative = 0;

    for (let i = 1; i <= 10; i++) {
      const loadingRemoved = result.yearsUntilLoadingRemoved !== null && i > result.yearsUntilLoadingRemoved;
      const yearCost = loadingRemoved ? 0 : result.annualLoadingCost;
      cumulative += yearCost;
      rows.push({
        year: i,
        calendarYear: currentYear + i,
        annualCost: yearCost,
        cumulative,
        loadingRemoved,
      });
    }
    return rows;
  }, [result]);

  // Premium calculations for display
  const bronzePremium = HOSPITAL_PREMIUMS_SINGLE.bronze;
  const premiumWithLoading = result ? Math.round(bronzePremium * (1 + result.loadingPercentage)) : 0;
  const premiumWithYouthDiscount = result && result.youthDiscount > 0
    ? Math.round(bronzePremium * (1 - result.youthDiscount))
    : null;

  if (!params || !result) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="mb-4">Missing information</h1>
        <p className="text-muted mb-6">We need your age and cover history to calculate your LHC loading.</p>
        <button onClick={() => router.push('/lhc-loading-calculator')} className="btn-primary">
          Go to LHC Calculator
        </button>
      </div>
    );
  }

  const hasLoading = result.loadingPercentage > 0;
  const hasYouthDiscount = result.youthDiscount > 0;
  const isUnder31 = params.age <= 30;

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleEmail() {
    const subject = encodeURIComponent('My LHC Loading calculation');
    const body = encodeURIComponent(
      `Here are my LHC Loading results:\n\n` +
      `Age: ${params!.age}\n` +
      `Loading: ${formatPercentage(result!.loadingPercentage * 100)}\n` +
      `Annual extra cost: ${formatDollars(result!.annualLoadingCost)}/year (on Bronze)\n` +
      `10-year cumulative: ${formatDollars(result!.tenYearCumulativeLoading)}\n\n` +
      `See my full results: ${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  const editUrl = `/lhc-loading-calculator?age=${params.age}&cover=${params.cover}${params.cover === 'currently' ? `&years=${params.yearsHeld}` : ''}${params.deferAge ? `&defer=${params.deferAge}` : ''}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back / Edit */}
      <button
        onClick={() => router.push(editUrl)}
        className="text-primary text-sm font-medium hover:underline mb-6 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Edit your answers
      </button>

      {/* Hero verdict */}
      <section className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${
            hasLoading
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700'
              : 'bg-secondary/10 text-secondary border-secondary/20'
          }`}>
            {hasLoading ? `${formatPercentage(result.loadingPercentage * 100, 0)} loading` : 'No loading'}
          </span>
          <p className="text-sm text-muted">
            Age {params.age} · {params.cover === 'currently' ? `${params.yearsHeld} year${params.yearsHeld === 1 ? '' : 's'} with cover` : params.cover === 'never' ? 'Never had cover' : 'Previously had cover'}
          </p>
        </div>

        {isUnder31 && !hasLoading ? (
          <div>
            <h1 className="text-secondary mb-2">No LHC loading applies</h1>
            <p className="text-muted">
              At age {params.age}, you&apos;re under 31 — so you have no LHC loading. If you take out hospital
              cover before 1 July after your 31st birthday, you&apos;ll never accumulate any loading.
            </p>
          </div>
        ) : !hasLoading ? (
          <div>
            <h1 className="text-secondary mb-2">No LHC loading</h1>
            <p className="text-muted">
              {params.cover === 'currently' && params.yearsHeld >= 10
                ? 'You\'ve held continuous cover for 10+ years — your loading has been removed entirely.'
                : 'Based on your age and cover history, no LHC loading applies to your premiums.'}
            </p>
          </div>
        ) : (
          <div>
            <h1 className="mb-2">
              Your loading: <span className="text-primary">{formatPercentage(result.loadingPercentage * 100, 0)}</span>
            </h1>
            <p className="text-muted mb-3">
              This adds <strong>{formatDollars(result.annualLoadingCost)}/year</strong> ({formatDollars(Math.round(result.annualLoadingCost / 12))}/month)
              to a Bronze hospital premium. Over 10 years, that&apos;s an extra{' '}
              <strong>{formatDollars(result.tenYearCumulativeLoading)}</strong>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">Bronze base premium</p>
                <p className="font-semibold">{formatDollars(bronzePremium)}/yr</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">With loading</p>
                <p className="font-semibold">{formatDollars(premiumWithLoading)}/yr</p>
              </div>
              {result.yearsUntilLoadingRemoved !== null && (
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">Loading removed</p>
                  <p className="font-semibold">After {result.yearsUntilLoadingRemoved} years</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Loading projection table */}
      {hasLoading && yearByYear.length > 0 && (
        <section className="card mb-8">
          <h2 className="mb-4">10-year loading cost projection</h2>
          <p className="text-sm text-muted mb-4">
            Shows the extra amount you pay due to loading each year on a Bronze single policy
            ({formatDollars(bronzePremium)}/yr base). Loading is removed after 10 continuous years of cover.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-2 font-semibold bg-transparent text-text-main">Year</th>
                  <th className="text-right py-2 font-semibold bg-transparent text-text-main">Loading cost</th>
                  <th className="text-right py-2 font-semibold bg-transparent text-text-main">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {yearByYear.map((row) => (
                  <tr key={row.year} className={`border-b border-border/50 ${row.loadingRemoved ? 'text-muted' : ''}`}>
                    <td className="py-2">
                      Year {row.year} ({row.calendarYear})
                      {row.loadingRemoved && (
                        <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                          Loading removed
                        </span>
                      )}
                    </td>
                    <td className="text-right py-2">{row.loadingRemoved ? '$0' : formatDollars(row.annualCost)}</td>
                    <td className="text-right py-2 font-medium">{formatDollars(row.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Deferral comparison */}
      {result.deferralComparison.length > 0 && (
        <section className="card mb-8">
          <h2 className="mb-4">Cost of waiting</h2>
          <p className="text-sm text-muted mb-4">
            If you delay getting hospital cover, your loading increases by 2% for each additional
            year. Here&apos;s what that means in extra costs over 10 years:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-2 font-semibold bg-transparent text-text-main">Join at age</th>
                  <th className="text-right py-2 font-semibold bg-transparent text-text-main">Loading</th>
                  <th className="text-right py-2 font-semibold bg-transparent text-text-main">Extra cost over 10 years</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 bg-secondary/5">
                  <td className="py-2 font-medium">
                    Now (age {params.age})
                    <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Current</span>
                  </td>
                  <td className="text-right py-2">{formatPercentage(result.loadingPercentage * 100, 0)}</td>
                  <td className="text-right py-2 font-medium">{formatDollars(0)}</td>
                </tr>
                {result.deferralComparison.map((row) => (
                  <tr key={row.deferToAge} className="border-b border-border/50">
                    <td className="py-2">Wait until age {row.deferToAge}</td>
                    <td className="text-right py-2">{formatPercentage(row.loadingAtDeferAge * 100, 0)}</td>
                    <td className="text-right py-2 font-medium text-amber-600 dark:text-amber-400">
                      +{formatDollars(row.cumulativeExtraCostOver10Yrs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-3">
            Based on Bronze single premium ({formatDollars(bronzePremium)}/yr). Actual premiums vary by insurer
            and increase annually.
          </p>
        </section>
      )}

      {/* Youth discount section */}
      {(isUnder31 || hasYouthDiscount) && (
        <section className="card mb-8">
          <h2 className="mb-3">Youth discount</h2>
          {isUnder31 && !hasYouthDiscount && params.age >= 18 && (
            <div>
              <p className="text-muted mb-2">
                At age {params.age}, you&apos;re eligible for a youth discount of up to{' '}
                <strong>{formatPercentage(Math.min(10, (30 - params.age) * 2))}</strong> on your hospital premium
                if your insurer offers it.
              </p>
              {premiumWithYouthDiscount === null && (
                <p className="text-sm text-muted">
                  On a Bronze policy, that could save you around{' '}
                  {formatDollars(Math.round(bronzePremium * Math.min(0.10, (30 - params.age) * 0.02)))}/year.
                </p>
              )}
            </div>
          )}
          {hasYouthDiscount && (
            <div>
              <p className="text-muted mb-2">
                You have a youth discount of <strong>{formatPercentage(result.youthDiscount * 100, 0)}</strong> on
                your hospital premium.
              </p>
              {premiumWithYouthDiscount && (
                <p className="text-sm text-muted">
                  On Bronze: {formatDollars(bronzePremium)}/yr base → {formatDollars(premiumWithYouthDiscount)}/yr
                  with discount (saving {formatDollars(bronzePremium - premiumWithYouthDiscount)}/yr).
                </p>
              )}
            </div>
          )}
          <p className="text-xs text-muted mt-2">
            Note: the youth discount is optional for insurers — not all funds offer it.
            The discount is frozen until age 41, then phases out at 2% per year.
          </p>
        </section>
      )}

      {/* "What This Actually Means" interpretation */}
      <section className="card mb-8">
        <h2 className="mb-3">What this actually means</h2>
        {isUnder31 && !hasLoading ? (
          <div className="text-muted space-y-3">
            <p>
              You&apos;re in the clear — no loading, and you have until <strong>1 July after your 31st birthday</strong> to
              take out hospital cover without ever paying a loading surcharge.
            </p>
            <p>
              If your income is below $101,000 (single) or $202,000 (family), you also don&apos;t pay the
              Medicare Levy Surcharge, which means there&apos;s no financial penalty for not having cover right now.
            </p>
            <p>
              The main reason to get cover before 31 is to lock in zero loading and potentially get a
              youth discount. After 31, loading starts at 2% and compounds — at age 35 that&apos;s 10%
              extra on every premium for the next 10 years.
            </p>
          </div>
        ) : !hasLoading ? (
          <div className="text-muted space-y-3">
            <p>
              Great news — you have no LHC loading on your hospital premium. This means you&apos;re paying
              the standard rate without any age penalty.
            </p>
          </div>
        ) : (
          <div className="text-muted space-y-3">
            <p>
              Your {formatPercentage(result.loadingPercentage * 100, 0)} loading means you&apos;re paying{' '}
              {formatDollars(result.annualLoadingCost)} extra per year on top of the standard Bronze premium.
              Over 10 years, that&apos;s {formatDollars(result.tenYearCumulativeLoading)} in additional costs
              before the loading is removed.
            </p>
            <p>
              The good news: <strong>loading is temporary</strong>. After 10 continuous years of hospital cover,
              it drops to zero. Every year you wait adds another 2% to the loading — so the cost of delay
              compounds quickly.
            </p>
            {result.loadingPercentage <= 0.10 && (
              <p>
                At {formatPercentage(result.loadingPercentage * 100, 0)}, your loading is still relatively low.
                Getting cover now locks in this rate rather than letting it grow further. The longer
                you wait, the more you&apos;ll pay over the 10-year loading period.
              </p>
            )}
            {result.loadingPercentage > 0.10 && result.loadingPercentage <= 0.30 && (
              <p>
                At {formatPercentage(result.loadingPercentage * 100, 0)}, your loading is moderate but meaningful.
                Each additional year of delay adds another 2% — that&apos;s roughly {formatDollars(Math.round(bronzePremium * 0.02))}/year
                extra on Bronze for every year you wait.
              </p>
            )}
            {result.loadingPercentage > 0.30 && (
              <p>
                At {formatPercentage(result.loadingPercentage * 100, 0)}, your loading is substantial. However,
                it still makes sense to get cover now rather than wait — every year of delay adds another 2%
                until you hit the 70% cap.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Key Insights accordion */}
      <section className="mb-8">
        <h2 className="mb-4">Key insights</h2>
        <div className="space-y-2">
          <InfoTooltip trigger="How is LHC loading calculated?">
            <p className="mb-2">
              LHC loading = <strong>2% × (your age when you first take out hospital cover − 30)</strong>,
              capped at 70%.
            </p>
            <p>
              For example, if you first get hospital cover at age 40, your loading is 2% × 10 = 20%.
              This 20% is added on top of your base premium for the first 10 years of cover.
            </p>
          </InfoTooltip>

          <InfoTooltip trigger="What is the 3-year grace period?">
            <p className="mb-2">
              You can drop your hospital cover for up to <strong>1,094 days</strong> (approximately 3 years)
              without your loading increasing. This is called the &quot;permitted days without cover.&quot;
            </p>
            <p>
              If you go beyond 1,094 days without cover, your loading will continue to accumulate from
              where it left off. Days spent overseas on certain visas may not count toward this limit.
            </p>
          </InfoTooltip>

          <InfoTooltip trigger="When does loading get removed?">
            <p>
              After <strong>10 continuous years</strong> of hospital cover, your LHC loading is removed
              entirely and your premium drops to the standard rate. You don&apos;t need to apply — it
              happens automatically.
            </p>
          </InfoTooltip>

          <InfoTooltip trigger="Does loading apply to extras-only cover?">
            <p>
              <strong>No.</strong> LHC loading only applies to hospital cover. If you have extras-only
              (general treatment) cover, it&apos;s not affected by loading — but it also doesn&apos;t count
              toward your 10 years of continuous cover for loading removal.
            </p>
          </InfoTooltip>
        </div>
      </section>

      {/* Next steps */}
      <section className="card mb-8">
        <h2 className="mb-4">Next steps</h2>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">1</span>
            <div>
              <p className="font-medium">Check your MLS position</p>
              <p className="text-sm text-muted">
                LHC loading is separate from the Medicare Levy Surcharge. Use our MLS Calculator to
                see if you also face a tax penalty for not having cover.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">2</span>
            <div>
              <p className="font-medium">Compare real policies on PrivateHealth.gov.au</p>
              <p className="text-sm text-muted">
                The government&apos;s comparison site shows every policy from every insurer.
                Filter by tier and compare premiums including your loading.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">3</span>
            <div>
              <p className="font-medium">Remember the 12-month waiting period</p>
              <p className="text-sm text-muted">
                New hospital policies have a 12-month waiting period for pre-existing conditions
                and most hospital services. Plan ahead — especially for pregnancy or elective surgery.
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300">
          This calculator provides general information only — not financial advice. LHC loading rules
          are set by the Australian Government. Visit{' '}
          <a href="https://www.privatehealth.gov.au" target="_blank" rel="noopener noreferrer" className="underline">
            privatehealth.gov.au
          </a>{' '}
          for official information.
        </div>
      </section>

      {/* Share panel */}
      <section className="card mb-8 print:hidden">
        <h2 className="mb-4">Share your results</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <button onClick={handleCopyLink} className="btn-secondary text-sm px-4 py-2 min-h-[40px]">
            {copiedLink ? 'Copied!' : 'Copy link'}
          </button>
          <button onClick={handleEmail} className="btn-secondary text-sm px-4 py-2 min-h-[40px]">
            Email results
          </button>
          <button onClick={() => window.print()} className="btn-secondary text-sm px-4 py-2 min-h-[40px]">
            Print / Save PDF
          </button>
        </div>
        <p className="text-xs text-muted font-mono break-all">{typeof window !== 'undefined' ? window.location.href : ''}</p>
      </section>

      {/* Related guides */}
      <section className="print:hidden">
        <h2 className="mb-4">Related guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/guides/lifetime-health-cover-loading" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">LHC Loading Explained</h3>
            <p className="text-sm text-muted">Everything about LHC loading, the 10-year rule, and the grace period.</p>
          </a>
          <a href="/mls-calculator" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">MLS Calculator</h3>
            <p className="text-sm text-muted">Check if you&apos;re paying the Medicare Levy Surcharge.</p>
          </a>
          <a href="/guides/private-health-insurance-under-31" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">Under 31 Guide</h3>
            <p className="text-sm text-muted">Should you get cover before turning 31?</p>
          </a>
        </div>
      </section>
    </div>
  );
}
