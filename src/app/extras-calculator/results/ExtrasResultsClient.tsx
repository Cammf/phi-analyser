'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateExtrasValue } from '@/lib/extrasCalculations';
import { calculateRebate } from '@/lib/rebateCalculations';
import { INCOME_RANGE_MIDPOINTS } from '@/lib/resolveInputs';
import { formatDollars, formatPercentage } from '@/lib/format';
import type { IncomeRange, FamilyType, ExtrasTier, AgeBracket } from '@/lib/types';

const TIER_LABELS: Record<ExtrasTier, string> = {
  none:          'No extras',
  basic:         'Basic extras',
  mid:           'Mid extras',
  comprehensive: 'Comprehensive',
};

const FAMILY_LABELS: Record<FamilyType, string> = {
  single:          'Single',
  couple:          'Couple',
  family:          'Family',
  'single-parent': 'Single parent',
};

const RANGE_LABELS: Record<IncomeRange, string> = {
  'under-90k':  'Under $90,000',
  '90k-110k':   '$90,000 – $110,000',
  '110k-140k':  '$110,000 – $140,000',
  '140k-175k':  '$140,000 – $175,000',
  '175k-250k':  '$175,000 – $250,000',
  'over-250k':  'Over $250,000',
};

export default function ExtrasResultsClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);

  const params = useMemo(() => {
    const range      = searchParams.get('range')   as IncomeRange | null;
    const family     = searchParams.get('family')  as FamilyType  | null;
    const tier       = searchParams.get('tier')    as ExtrasTier  | null;
    if (!range || !family || !tier) return null;

    const incomeStr       = searchParams.get('income');
    const childrenStr     = searchParams.get('children');
    const exactIncome     = incomeStr ? parseInt(incomeStr, 10) : null;
    const dependentChildren = childrenStr ? parseInt(childrenStr, 10) : 0;
    const mlsIncome       = exactIncome && exactIncome > 0 ? exactIncome : INCOME_RANGE_MIDPOINTS[range];
    const ageBracket: AgeBracket = 'under65'; // standalone calculator default

    const dental  = parseInt(searchParams.get('dental')  ?? '0', 10);
    const optical = parseInt(searchParams.get('optical') ?? '0', 10);
    const physio  = parseInt(searchParams.get('physio')  ?? '0', 10);
    const chiro   = parseInt(searchParams.get('chiro')   ?? '0', 10);

    return { range, exactIncome, family, dependentChildren, tier, mlsIncome, ageBracket, dental, optical, physio, chiro };
  }, [searchParams]);

  const result = useMemo(() => {
    if (!params) return null;
    return calculateExtrasValue({
      extrasTier:            params.tier,
      familyType:            params.family,
      mlsIncome:             params.mlsIncome,
      dependentChildren:     params.dependentChildren,
      ageBracket:            params.ageBracket,
      dentalVisitsPerYear:   params.dental,
      opticalClaimsPerYear:  params.optical,
      physioSessionsPerYear: params.physio,
      chiroSessionsPerYear:  params.chiro,
    });
  }, [params]);

  const rebateResult = useMemo(() => {
    if (!params || params.tier === 'none') return null;
    const EXTRAS_PREMIUMS_SINGLE: Record<ExtrasTier, number> = {
      none: 0, basic: 540, mid: 900, comprehensive: 1380,
    };
    const EXTRAS_MULTIPLIERS: Record<FamilyType, number> = {
      single: 1.0, couple: 1.8, family: 1.8, 'single-parent': 1.5,
    };
    const premiumBeforeRebate = Math.round(
      EXTRAS_PREMIUMS_SINGLE[params.tier] * EXTRAS_MULTIPLIERS[params.family]
    );
    return calculateRebate({
      mlsIncome:                 params.mlsIncome,
      familyType:                params.family,
      dependentChildren:         params.dependentChildren,
      ageBracket:                params.ageBracket,
      annualPremiumBeforeRebate: premiumBeforeRebate,
    });
  }, [params]);

  if (!params || !result) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="mb-4">Missing information</h1>
        <p className="text-muted mb-6">We need your income, family details, and extras tier to calculate your break-even.</p>
        <button onClick={() => router.push('/extras-calculator')} className="btn-primary">
          Go to Extras Calculator
        </button>
      </div>
    );
  }

  const { isFinanciallyRational, annualPremium, estimatedAnnualBenefit, netAnnualCost, benefitRatio } = result;
  const isCloseCall = !isFinanciallyRational && netAnnualCost <= 200;

  // Verdict colour
  const verdictBg    = isFinanciallyRational ? 'bg-secondary/10 border-secondary/30'
                     : isCloseCall            ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700'
                                             : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700';
  const verdictText  = isFinanciallyRational ? 'text-secondary'
                     : isCloseCall            ? 'text-amber-700 dark:text-amber-400'
                                             : 'text-red-700 dark:text-red-400';
  const verdictLabel = isFinanciallyRational ? 'Worth it for you'
                     : isCloseCall            ? 'Close call'
                                             : 'Likely not worth it';

  // Per-service breakdown values
  const DENTAL_BENEFIT  = 175;
  const OPTICAL_BENEFIT = 250;
  const PHYSIO_BENEFIT  = 45;
  const CHIRO_BENEFIT   = 40;
  const DENTAL_SUBLIMITS:  Record<ExtrasTier, number> = { none: 0, basic: 300, mid: 500,  comprehensive: 900 };
  const OPTICAL_SUBLIMITS: Record<ExtrasTier, number> = { none: 0, basic: 200, mid: 250,  comprehensive: 400 };
  const PHYSIO_SUBLIMITS:  Record<ExtrasTier, number> = { none: 0, basic: 0,   mid: 450,  comprehensive: 700 };
  const CHIRO_SUBLIMITS:   Record<ExtrasTier, number> = { none: 0, basic: 0,   mid: 400,  comprehensive: 550 };

  const tier = params.tier;
  const serviceRows = [
    {
      service:    'Dental',
      usage:      `${params.dental} visit${params.dental !== 1 ? 's' : ''}/yr`,
      rawBenefit: params.dental * DENTAL_BENEFIT,
      sublimit:   DENTAL_SUBLIMITS[tier],
      benefit:    Math.min(params.dental * DENTAL_BENEFIT, DENTAL_SUBLIMITS[tier]),
    },
    {
      service:    'Optical',
      usage:      `${params.optical} claim${params.optical !== 1 ? 's' : ''}/yr`,
      rawBenefit: params.optical * OPTICAL_BENEFIT,
      sublimit:   OPTICAL_SUBLIMITS[tier],
      benefit:    Math.min(params.optical * OPTICAL_BENEFIT, OPTICAL_SUBLIMITS[tier]),
    },
    {
      service:    'Physio',
      usage:      `${params.physio} session${params.physio !== 1 ? 's' : ''}/yr`,
      rawBenefit: params.physio * PHYSIO_BENEFIT,
      sublimit:   PHYSIO_SUBLIMITS[tier],
      benefit:    Math.min(params.physio * PHYSIO_BENEFIT, PHYSIO_SUBLIMITS[tier]),
    },
    {
      service:    'Chiro',
      usage:      `${params.chiro} session${params.chiro !== 1 ? 's' : ''}/yr`,
      rawBenefit: params.chiro * CHIRO_BENEFIT,
      sublimit:   CHIRO_SUBLIMITS[tier],
      benefit:    Math.min(params.chiro * CHIRO_BENEFIT, CHIRO_SUBLIMITS[tier]),
    },
  ];

  const editUrl = `/extras-calculator?${searchParams.toString()}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back link */}
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
      <section className={`card mb-8 border-2 ${verdictBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${verdictBg} ${verdictText}`}>
            {verdictLabel}
          </span>
          <p className="text-sm text-muted">
            {FAMILY_LABELS[params.family]} · {params.exactIncome ? formatDollars(params.mlsIncome) : (RANGE_LABELS[params.range] ?? params.range)} ·{' '}
            {TIER_LABELS[tier]}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Annual premium</p>
            <p className="text-2xl font-bold">{formatDollars(annualPremium)}</p>
            <p className="text-xs text-muted">after {rebateResult ? formatPercentage(rebateResult.rebatePercentage * 100) : '0%'} rebate</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Estimated benefit</p>
            <p className={`text-2xl font-bold ${isFinanciallyRational ? 'text-secondary' : ''}`}>
              {formatDollars(estimatedAnnualBenefit)}
            </p>
            <p className="text-xs text-muted">per year</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Net cost</p>
            <p className={`text-2xl font-bold ${netAnnualCost <= 0 ? 'text-secondary' : verdictText}`}>
              {netAnnualCost > 0 ? formatDollars(netAnnualCost) : `-${formatDollars(Math.abs(netAnnualCost))}`}
            </p>
            <p className="text-xs text-muted">
              {netAnnualCost > 0 ? 'more than you claim back' : 'net saving per year'}
            </p>
          </div>
        </div>
      </section>

      {/* Per-service breakdown */}
      <section className="card mb-8">
        <h2 className="mb-4">Service breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 font-semibold text-text-main bg-transparent">Service</th>
                <th className="py-2 font-semibold text-text-main bg-transparent">Usage</th>
                <th className="py-2 text-right font-semibold text-text-main bg-transparent">Benefit before cap</th>
                <th className="py-2 text-right font-semibold text-text-main bg-transparent">Annual sub-limit</th>
                <th className="py-2 text-right font-semibold text-text-main bg-transparent">Benefit claimed</th>
              </tr>
            </thead>
            <tbody>
              {serviceRows.map((row) => (
                <tr key={row.service} className="border-b border-border/50">
                  <td className="py-2">{row.service}</td>
                  <td className="py-2 text-muted">{row.usage}</td>
                  <td className="py-2 text-right text-muted">{formatDollars(row.rawBenefit)}</td>
                  <td className="py-2 text-right text-muted">
                    {row.sublimit === 0 ? (
                      <span className="text-red-600 dark:text-red-400">Excluded</span>
                    ) : (
                      formatDollars(row.sublimit)
                    )}
                  </td>
                  <td className="py-2 text-right font-medium">{formatDollars(row.benefit)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2" colSpan={4}>Total estimated annual benefit</td>
                <td className="py-2 text-right text-secondary">{formatDollars(estimatedAnnualBenefit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-3">
          Benefit amounts are industry averages from APRA/PHIO data. Actual benefits depend on your insurer&apos;s
          benefit schedule. Sub-limits shown are conservative midpoints for the {TIER_LABELS[tier]} tier.
        </p>
      </section>

      {/* Industry context */}
      <section className="card mb-8">
        <h2 className="mb-3">How you compare to the average</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Industry return ratio</p>
            <p className="text-2xl font-bold">{'<'}45¢</p>
            <p className="text-sm text-muted">per $1 of extras premiums paid (APRA 2024)</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Average annual benefit</p>
            <p className="text-2xl font-bold">$300</p>
            <p className="text-sm text-muted">claimed by the average extras holder</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Your return ratio</p>
            <p className={`text-2xl font-bold ${benefitRatio >= 1 ? 'text-secondary' : ''}`}>
              {formatPercentage(benefitRatio * 100)}
            </p>
            <p className="text-sm text-muted">of your premium in estimated benefits</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm dark:bg-amber-900/20 dark:border-amber-700">
          <p className="text-amber-800 dark:text-amber-300">
            <strong>APRA data:</strong> Industry-wide, extras cover pays back less than 45 cents for every
            dollar of premium. The insurer keeps the rest for admin costs, profits, and reserves. Extras cover
            is only financially rational if you&apos;re a heavy user.
          </p>
        </div>
      </section>

      {/* Recommendation */}
      <section className="card mb-8">
        <h2 className="mb-3">What this means for you</h2>
        <p className="text-muted">{result.recommendation}</p>
        <p className="text-muted mt-3">
          Break-even point: you&apos;d need approximately{' '}
          <strong>{result.calculationBreakdown.breakEvenFrequency}</strong> to cover the premium cost.
        </p>
      </section>

      {/* Share panel */}
      <section className="card mb-8 print:hidden">
        <h2 className="mb-4">Share your results</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <button onClick={handleCopyLink} className="btn-secondary text-sm px-4 py-2 min-h-[40px]">
            {copiedLink ? 'Copied!' : 'Copy link'}
          </button>
          <button
            onClick={() => {
              const subject = encodeURIComponent('My extras cover break-even calculation');
              const body = encodeURIComponent(
                `Extras tier: ${TIER_LABELS[tier]}\n` +
                `Annual premium: ${formatDollars(annualPremium)}\n` +
                `Estimated benefit: ${formatDollars(estimatedAnnualBenefit)}\n` +
                `Net cost: ${formatDollars(netAnnualCost)}\n\n` +
                `See full results: ${window.location.href}`
              );
              window.open(`mailto:?subject=${subject}&body=${body}`);
            }}
            className="btn-secondary text-sm px-4 py-2 min-h-[40px]"
          >
            Email results
          </button>
          <button onClick={() => window.print()} className="btn-secondary text-sm px-4 py-2 min-h-[40px]">
            Print / Save PDF
          </button>
        </div>
        <p className="text-xs text-muted font-mono break-all">
          {typeof window !== 'undefined' ? window.location.href : ''}
        </p>
      </section>

      {/* Related guides */}
      <section className="print:hidden">
        <h2 className="mb-4">Related guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/guides/is-private-health-insurance-worth-it" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">Is PHI Worth It?</h3>
            <p className="text-sm text-muted">A full breakdown of when private health insurance makes financial sense.</p>
          </a>
          <a href="/guides/hospital-cover-tiers-explained" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">Hospital Tiers Explained</h3>
            <p className="text-sm text-muted">Understand what Gold, Silver, Bronze, and Basic actually cover.</p>
          </a>
          <a href="/should-i-get-private-health-insurance" className="card hover:border-primary/40 transition-colors">
            <h3 className="text-base font-semibold mb-1">Full PHI Analysis</h3>
            <p className="text-sm text-muted">Get a complete 3-scenario comparison including hospital cover.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
