'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateMLSvsInsurance } from '@/lib/mlsCalculations';
import { calculateRebate } from '@/lib/rebateCalculations';
import { resolveIncome, resolveAgeBracket, INCOME_RANGE_MIDPOINTS, HOSPITAL_PREMIUMS_SINGLE, FAMILY_PREMIUM_MULTIPLIERS } from '@/lib/resolveInputs';
import { formatDollars, formatPercentage, formatIncomeRange } from '@/lib/format';
import InfoTooltip from '@/components/wizard/InfoTooltip';
import type { IncomeRange, FamilyType, AgeBracket } from '@/lib/types';

const TIER_LABELS: Record<string, string> = {
  base: 'No MLS',
  '1': 'Tier 1',
  '2': 'Tier 2',
  '3': 'Tier 3',
};

const TIER_COLORS: Record<string, string> = {
  base: 'bg-secondary/10 text-secondary border-secondary/20',
  '1': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
  '2': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700',
  '3': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
};

const FAMILY_LABELS: Record<FamilyType, string> = {
  single: 'Single',
  couple: 'Couple',
  family: 'Family',
  'single-parent': 'Single parent',
};

export default function MLSResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);

  const params = useMemo(() => {
    const range = searchParams.get('range') as IncomeRange | null;
    const incomeStr = searchParams.get('income');
    const family = searchParams.get('family') as FamilyType | null;
    const childrenStr = searchParams.get('children');

    if (!range || !family) return null;

    const exactIncome = incomeStr ? parseInt(incomeStr, 10) : null;
    const dependentChildren = childrenStr ? parseInt(childrenStr, 10) : 0;
    const mlsIncome = exactIncome && exactIncome > 0 ? exactIncome : INCOME_RANGE_MIDPOINTS[range];
    const ageBracket: AgeBracket = 'under65'; // default for standalone MLS calculator

    return { range, exactIncome, family, dependentChildren, mlsIncome, ageBracket };
  }, [searchParams]);

  const result = useMemo(() => {
    if (!params) return null;
    return calculateMLSvsInsurance({
      mlsIncome: params.mlsIncome,
      familyType: params.family,
      dependentChildren: params.dependentChildren,
      ageBracket: params.ageBracket,
      lhcLoadingPercentage: 0,
    });
  }, [params]);

  const rebateResult = useMemo(() => {
    if (!params) return null;
    const basePremium = Math.round(
      HOSPITAL_PREMIUMS_SINGLE.basic * FAMILY_PREMIUM_MULTIPLIERS[params.family]
    );
    return calculateRebate({
      mlsIncome: params.mlsIncome,
      familyType: params.family,
      dependentChildren: params.dependentChildren,
      ageBracket: params.ageBracket,
      annualPremiumBeforeRebate: basePremium,
    });
  }, [params]);

  if (!params || !result || !rebateResult) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="mb-4">Missing information</h1>
        <p className="text-muted mb-6">We need your income and family details to calculate your MLS.</p>
        <button onClick={() => router.push('/mls-calculator')} className="btn-primary">
          Go to MLS Calculator
        </button>
      </div>
    );
  }

  const insuranceMakesSense = result.mlsVsInsuranceDelta > 0;
  const noMLS = result.tier === 'base';

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleEmail() {
    const subject = encodeURIComponent('My Medicare Levy Surcharge calculation');
    const body = encodeURIComponent(
      `Here are my MLS results:\n\n` +
      `Income: ${formatDollars(params!.mlsIncome)}\n` +
      `Family type: ${FAMILY_LABELS[params!.family]}\n` +
      `MLS rate: ${formatPercentage(result!.mlsRate * 100)}\n` +
      `Annual MLS: ${formatDollars(result!.annualMLS)}/year\n\n` +
      `See my full results: ${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  const editUrl = `/mls-calculator?range=${params.range}${params.exactIncome ? `&income=${params.exactIncome}` : ''}&family=${params.family}${params.dependentChildren > 0 ? `&children=${params.dependentChildren}` : ''}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back / Edit link */}
      <button
        onClick={() => router.push(editUrl)}
        className="text-primary text-sm font-medium hover:underline mb-6 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Edit your answers
      </button>

      {/* Hero verdict card */}
      <section className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${TIER_COLORS[result.tier]}`}>
            {TIER_LABELS[result.tier]}
          </span>
          <div>
            <p className="text-sm text-muted">
              {FAMILY_LABELS[params.family]} · {params.exactIncome ? formatDollars(params.mlsIncome) : formatIncomeRange(params.range)} income
              {params.dependentChildren > 0 && ` · ${params.dependentChildren} ${params.dependentChildren === 1 ? 'child' : 'children'}`}
            </p>
          </div>
        </div>

        {noMLS ? (
          <div>
            <h1 className="text-secondary mb-2">You don&apos;t pay the MLS</h1>
            <p className="text-muted">
              Your income of {formatDollars(params.mlsIncome)} is below the {params.family === 'single' ? 'single' : 'family'} MLS
              threshold. You are not required to have private hospital cover to avoid the surcharge.
            </p>
            {result.nextThreshold && (
              <p className="text-sm text-muted mt-2">
                The MLS would start at {formatDollars(result.nextThreshold)} income.
              </p>
            )}
          </div>
        ) : (
          <div>
            <h1 className="mb-2">
              Your MLS: <span className="text-primary">{formatDollars(result.annualMLS)}/year</span>
            </h1>
            <p className="text-muted">
              At {formatPercentage(result.mlsRate * 100, 1)} of your {formatDollars(params.mlsIncome)} income,
              you&apos;d pay <strong>{formatDollars(result.annualMLS)} per year</strong> ({formatDollars(Math.round(result.annualMLS / 12))}/month)
              in Medicare Levy Surcharge without private hospital cover.
            </p>
          </div>
        )}
      </section>

      {/* MLS vs Insurance comparison — only shown if above threshold */}
      {!noMLS && (
        <section className="mb-8">
          <h2 className="mb-4">MLS vs Basic hospital cover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* MLS card */}
            <div className="card border-2 border-border">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                <h3 className="text-lg">Pay the MLS</h3>
              </div>
              <p className="text-3xl font-bold text-text-main mb-1">{formatDollars(result.annualMLS)}<span className="text-base font-normal text-muted">/year</span></p>
              <p className="text-sm text-muted mb-3">{formatDollars(Math.round(result.annualMLS / 12))}/month</p>
              <ul className="text-sm text-muted space-y-1">
                <li>No hospital cover</li>
                <li>Public system only</li>
                <li>Full public waiting times</li>
              </ul>
            </div>

            {/* Insurance card */}
            <div className={`card border-2 ${insuranceMakesSense ? 'border-secondary' : 'border-border'}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${insuranceMakesSense ? 'bg-secondary' : 'bg-amber-500'}`} />
                <h3 className="text-lg">Basic hospital cover</h3>
                {insuranceMakesSense && (
                  <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Cheaper</span>
                )}
              </div>
              <p className="text-3xl font-bold text-text-main mb-1">
                {formatDollars(result.cheapestBasicAfterRebate)}<span className="text-base font-normal text-muted">/year</span>
              </p>
              <p className="text-sm text-muted mb-3">
                {formatDollars(Math.round(result.cheapestBasicAfterRebate / 12))}/month after rebate
              </p>
              <ul className="text-sm text-muted space-y-1">
                <li>Avoids MLS entirely</li>
                <li>Limited hospital cover (Basic tier)</li>
                <li>Includes {formatPercentage(rebateResult.rebatePercentage * 100)} government rebate</li>
              </ul>
            </div>
          </div>

          {/* Delta summary */}
          <div className={`mt-4 p-4 rounded-lg text-sm ${insuranceMakesSense ? 'bg-secondary/5 border border-secondary/20' : 'bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-700'}`}>
            {insuranceMakesSense ? (
              <p>
                <strong>Basic hospital cover saves you {formatDollars(result.mlsVsInsuranceDelta)}/year</strong> compared
                to paying the MLS — and you get hospital cover as well.
              </p>
            ) : (
              <p>
                <strong>The MLS is {formatDollars(Math.abs(result.mlsVsInsuranceDelta))}/year cheaper</strong> than
                Basic cover. Insurance doesn&apos;t save money at your income level, but you may still want cover
                for other reasons (LHC loading, hospital access, peace of mind).
              </p>
            )}
          </div>
        </section>
      )}

      {/* "What This Actually Means" interpretation */}
      <section className="card mb-8">
        <h2 className="mb-3">What this actually means</h2>
        {noMLS ? (
          <div className="text-muted space-y-3">
            <p>
              At your income level, the Medicare Levy Surcharge doesn&apos;t apply to you. You&apos;re free to
              use the public health system without any additional tax penalty.
            </p>
            <p>
              That said, private health insurance can still have benefits beyond avoiding the MLS — shorter
              waiting times for elective surgery, choice of doctor, and private hospital rooms. But purely from
              a tax perspective, there&apos;s no financial pressure to take out cover right now.
            </p>
            {result.nextThreshold && (
              <p>
                If your income increases above {formatDollars(result.nextThreshold)}, you&apos;d start paying
                the MLS at 1.0% — worth keeping in mind if you expect a pay rise or bonus.
              </p>
            )}
          </div>
        ) : insuranceMakesSense ? (
          <div className="text-muted space-y-3">
            <p>
              You&apos;re paying {formatDollars(result.annualMLS)} per year in MLS — essentially a tax penalty
              for not having private hospital cover. A Basic hospital policy would cost you less
              ({formatDollars(result.cheapestBasicAfterRebate)}/year after the government rebate) and remove
              the surcharge entirely.
            </p>
            <p>
              <strong>The practical upshot:</strong> even the cheapest hospital policy saves you money compared
              to the tax. It&apos;s not much cover — Basic hospital is very limited — but it&apos;s enough to
              avoid the surcharge and gives you a starting point if you decide to upgrade later.
            </p>
            <p>
              Keep in mind that Basic cover won&apos;t cover most elective procedures. If you need more than
              just MLS avoidance, consider Bronze or Silver — but the MLS alone justifies at least a Basic policy.
            </p>
          </div>
        ) : (
          <div className="text-muted space-y-3">
            <p>
              At your income and family situation, the MLS ({formatDollars(result.annualMLS)}/year) is actually
              cheaper than the cost of Basic hospital cover ({formatDollars(result.cheapestBasicAfterRebate)}/year).
              From a purely financial perspective, paying the surcharge costs less.
            </p>
            <p>
              However, this is a narrow comparison. There are other reasons people take out cover — avoiding
              Lifetime Health Cover loading (which increases 2% per year after age 31), accessing private
              hospitals, shorter waits for elective surgery, or planning for pregnancy.
            </p>
            <p>
              If you&apos;re under 31, getting cover now avoids the LHC loading that would otherwise make
              premiums more expensive later. Consider using our LHC Loading Calculator to see the long-term impact.
            </p>
          </div>
        )}
      </section>

      {/* Rebate breakdown panel — only if above threshold */}
      {!noMLS && (
        <section className="card mb-8">
          <h2 className="mb-4">Government rebate breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Rebate tier</p>
              <p className="font-semibold">{TIER_LABELS[rebateResult.tier]}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Rebate rate</p>
              <p className="font-semibold">{formatPercentage(rebateResult.rebatePercentage * 100)}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Annual rebate</p>
              <p className="font-semibold text-secondary">{formatDollars(rebateResult.annualRebate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Premium after rebate</p>
              <p className="font-semibold">{formatDollars(rebateResult.premiumAfterRebate)}</p>
            </div>
          </div>
          <p className="text-xs text-muted mt-3">
            Based on Basic hospital cover for a {FAMILY_LABELS[params.family].toLowerCase()} (under 65). Rebate rates are for FY 2025–26 Period 1.
          </p>
        </section>
      )}

      {/* Key Insights accordion */}
      <section className="mb-8">
        <h2 className="mb-4">Key insights</h2>
        <div className="space-y-2">
          <InfoTooltip trigger="How is MLS income calculated?">
            <p className="mb-2">MLS income includes more than just your taxable income. It&apos;s the total of:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Taxable income</strong> — your salary, wages, business income after deductions</li>
              <li><strong>Reportable fringe benefits</strong> — e.g. salary-packaged car, meals</li>
              <li><strong>Net investment losses</strong> — negative gearing losses are added back</li>
              <li><strong>Reportable super contributions</strong> — salary sacrifice above compulsory</li>
            </ol>
            <p className="mt-2">
              Many people forget about these components and underestimate their MLS income. Check your most
              recent tax return or use the ATO&apos;s income test.
            </p>
          </InfoTooltip>

          <InfoTooltip trigger="What does Basic hospital cover actually include?">
            <p className="mb-2">
              Basic is the lowest tier of hospital cover — designed primarily as a tax product to avoid the MLS.
              It typically covers:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rehabilitation</li>
              <li>Psychiatric care</li>
              <li>Palliative care</li>
            </ul>
            <p className="mt-2">
              It <strong>does not</strong> cover most elective surgeries, joint replacements, pregnancy,
              cardiac procedures, or other common hospital treatments. If you need actual hospital coverage,
              Bronze or Silver provides much broader protection.
            </p>
          </InfoTooltip>

          <InfoTooltip trigger="What counts as 'appropriate' cover for MLS purposes?">
            <p className="mb-2">
              To avoid the MLS, your hospital policy must meet these requirements:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Registered with a private health insurer</li>
              <li>Hospital cover (not just extras/general treatment)</li>
              <li>Excess no more than <strong>$750 for singles</strong> or <strong>$1,500 for couples/families</strong></li>
              <li>Cover held for the full year (pro-rated if partial year)</li>
            </ul>
          </InfoTooltip>

          <InfoTooltip trigger="How does the government rebate work?">
            <p className="mb-2">
              The Australian Government contributes a percentage of your premium through the Private Health
              Insurance Rebate. The percentage depends on your income and age:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Lower income</strong> → higher rebate (up to 24.3% under 65)</li>
              <li><strong>Older age</strong> → higher rebate (up to 32.4% for 70+)</li>
              <li><strong>Tier 3 earners</strong> ($158,001+ single) receive 0% rebate</li>
            </ul>
            <p className="mt-2">
              You can receive the rebate as a premium reduction (most common) or claim it when you
              lodge your tax return.
            </p>
          </InfoTooltip>
        </div>
      </section>

      {/* Next steps panel */}
      <section className="card mb-8">
        <h2 className="mb-4">Next steps</h2>
        <ol className="space-y-4">
          {!noMLS && insuranceMakesSense && (
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">1</span>
              <div>
                <p className="font-medium">Compare real policies on PrivateHealth.gov.au</p>
                <p className="text-sm text-muted">
                  The government&apos;s comparison site lists every policy from every insurer — no commissions,
                  no bias. Filter by &quot;Basic&quot; hospital tier to find the cheapest MLS-avoiding option.
                </p>
              </div>
            </li>
          )}
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">{!noMLS && insuranceMakesSense ? '2' : '1'}</span>
            <div>
              <p className="font-medium">Verify your MLS income</p>
              <p className="text-sm text-muted">
                Check your latest tax return for all four income components. An accountant can help
                if you have complex income sources like trusts or investment properties.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">{!noMLS && insuranceMakesSense ? '3' : '2'}</span>
            <div>
              <p className="font-medium">Consider Lifetime Health Cover loading</p>
              <p className="text-sm text-muted">
                If you&apos;re over 31 and have never held hospital cover, you&apos;ll pay an extra 2% loading
                per year when you do eventually join. Use our LHC Loading Calculator to see your loading.
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300">
          This calculator provides general information only — not financial advice. Your actual
          MLS liability is determined by the ATO based on your full tax return. Visit{' '}
          <a href="https://www.servicesaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="underline">
            Services Australia
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
          <a href="/guides/medicare-levy-surcharge-explained" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">MLS Explained</h3>
            <p className="text-sm text-muted">Everything you need to know about the Medicare Levy Surcharge.</p>
          </a>
          <a href="/lhc-loading-calculator" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">LHC Loading Calculator</h3>
            <p className="text-sm text-muted">Find out how much extra you&apos;ll pay if you delay getting cover.</p>
          </a>
          <a href="/guides/is-private-health-insurance-worth-it" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">Is PHI Worth It?</h3>
            <p className="text-sm text-muted">An honest look at when private health insurance makes sense.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
