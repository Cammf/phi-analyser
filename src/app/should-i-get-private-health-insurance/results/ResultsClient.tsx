'use client';

import React, { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseWizardParams } from '@/lib/wizardParams';
import { runCalculations } from '@/lib/runCalculations';
import { formatDollars } from '@/lib/format';
import type { CalculationOutput, ScenarioOption } from '@/lib/types';

// ─── Scenario card helpers ───────────────────────────────────────────────────

const SCENARIO_ICONS: Record<string, string> = {
  'no-insurance': '🏥',
  'basic-bronze':  '🛡',
  'silver-gold':   '⭐',
};

const RECOMMENDED_LABEL = 'Recommended';
const CHEAPEST_LABEL    = 'Cheapest';
const COVERAGE_LABEL    = 'Most Coverage';

function ScenarioCard({
  scenario,
  isRecommended,
}: {
  scenario: ScenarioOption;
  isRecommended: boolean;
}) {
  const badge = isRecommended
    ? RECOMMENDED_LABEL
    : scenario.isCheapest
    ? CHEAPEST_LABEL
    : scenario.isMostCoverage
    ? COVERAGE_LABEL
    : null;

  return (
    <div
      className={[
        'card flex flex-col gap-4 relative',
        isRecommended ? 'border-2 border-primary ring-1 ring-primary/20' : '',
      ].join(' ')}
    >
      {badge && (
        <span
          className={[
            'absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold border',
            isRecommended
              ? 'bg-primary text-white border-primary'
              : 'bg-secondary/10 text-secondary border-secondary/20',
          ].join(' ')}
        >
          {badge}
        </span>
      )}

      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl" aria-hidden="true">
            {SCENARIO_ICONS[scenario.id]}
          </span>
          <h3 className="text-lg font-bold">{scenario.label}</h3>
        </div>
        <p className="text-sm text-muted">{scenario.description}</p>
      </div>

      {/* Cost */}
      <div className="rounded-lg bg-background p-4 border border-border">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted">Year 1 cost</span>
          <span className="text-2xl font-bold text-text-main">
            {formatDollars(scenario.year1Cost)}
          </span>
        </div>
        <div className="flex justify-between items-baseline mt-1">
          <span className="text-sm text-muted">10-year total</span>
          <span className="text-lg font-semibold text-muted">
            {formatDollars(scenario.tenYearCost)}
          </span>
        </div>
      </div>

      {/* Coverage */}
      <p className="text-sm text-muted">{scenario.coverageDescription}</p>

      {/* Trade-offs */}
      <ul className="space-y-1">
        {scenario.tradeoffs.map((t, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span className="mt-0.5 text-muted">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── What This Means ─────────────────────────────────────────────────────────

function WhatThisMeans({ output }: { output: CalculationOutput }) {
  const { inputs, mlsResult, lhcResult, scenarioResult } = output;
  const { age, familyType, coverStatus } = inputs;

  const isUnder31       = age < 31;
  const isRetiree       = age >= 65;
  const isIncomeTriggered =
    mlsResult.tier !== 'base' &&
    scenarioResult.scenarios[1].year1Cost < mlsResult.annualMLS;
  const hasFamily =
    familyType === 'family' || familyType === 'single-parent' || familyType === 'couple';

  let heading = 'What this means for you';
  let message: React.ReactNode;

  if (isUnder31) {
    heading = "You're under 31 — now is the easiest time to decide";
    message = (
      <>
        <p>
          You don&apos;t have a Lifetime Health Cover loading yet — your premiums are at the base
          rate. If you take out hospital cover before you turn 31, you lock in no loading forever
          (as long as you keep the cover).
        </p>
        {mlsResult.tier === 'base' ? (
          <p className="mt-3">
            Your income is below the MLS threshold, so you won&apos;t pay a surcharge without
            insurance. The decision is purely about whether you want private hospital access —
            not a tax issue.
          </p>
        ) : (
          <p className="mt-3">
            Your income does trigger the MLS at {Math.round(mlsResult.mlsRate * 100)}%. Getting
            even basic hospital cover would eliminate this surcharge — and at your age, your
            premiums are at their lowest.
          </p>
        )}
      </>
    );
  } else if (isRetiree) {
    heading = 'Insurance decisions at 65+ are different';
    message = (
      <>
        <p>
          At {age}, you qualify for a higher government rebate on your premium —{' '}
          {age >= 70 ? 'the maximum age tier (70+)' : 'the 65–69 age tier'}. This reduces the
          cost of any hospital cover you choose.
        </p>
        <p className="mt-3">
          Consider that health needs tend to increase with age. If you don&apos;t currently
          have cover, the LHC loading and potential wait times for elective procedures are
          worth factoring into the decision alongside the cost comparison above.
        </p>
      </>
    );
  } else if (isIncomeTriggered) {
    heading = 'The numbers favour getting insurance';
    message = (
      <>
        <p>
          Your MLS of {formatDollars(mlsResult.annualMLS)}/year costs more than Basic/Bronze
          cover after rebate. In purely financial terms, getting hospital cover saves you money
          — you&apos;re paying a tax on not having insurance.
        </p>
        <p className="mt-3">
          That said, Basic/Bronze is a limited product — it&apos;s mainly a tax-saving
          strategy. If you actually want private hospital access and choice of doctor, you&apos;d
          need at least Silver cover.
        </p>
        {lhcResult.loadingPercentage >= 0.20 && (
          <p className="mt-3 text-warning font-medium">
            Note: your LHC loading of {Math.round(lhcResult.loadingPercentage * 100)}% adds
            significantly to any policy cost. Once you take out cover and hold it for 10 years,
            this loading disappears.
          </p>
        )}
      </>
    );
  } else if (hasFamily) {
    heading = 'Family cover — the MLS threshold is doubled';
    message = (
      <>
        <p>
          Couples and families have double the MLS income threshold of singles. If your combined
          household income is below $202,000, neither of you pays the surcharge — insurance is a
          personal choice, not a financial obligation.
        </p>
        <p className="mt-3">
          For families with young children, private hospital cover gives you access to private
          obstetrics, choice of specialist, and shorter waits for non-urgent procedures. Whether
          that&apos;s worth the premium depends on your health needs and priorities.
        </p>
      </>
    );
  } else {
    heading = 'The honest picture';
    message = (
      <>
        {mlsResult.tier === 'base' ? (
          <p>
            Your income is below the MLS threshold — you won&apos;t pay a surcharge without
            insurance. Private hospital cover is a personal choice about access and convenience,
            not a tax obligation.
          </p>
        ) : (
          <p>
            Your MLS of {formatDollars(mlsResult.annualMLS)}/year is the cost of going without
            hospital cover. Whether insurance is worth it depends on whether the premium (after
            rebate) represents better value than paying the surcharge and using the public system.
          </p>
        )}
        {coverStatus === 'yes' ? (
          <p className="mt-3">
            You currently have hospital cover. If you&apos;re thinking of dropping it, remember
            that you have a 3-year grace period (1,094 days) before your LHC loading starts
            accruing again — but your 10-year removal clock resets if you lapse longer.
          </p>
        ) : (
          <p className="mt-3">
            The public hospital system provides good quality care for most conditions. The main
            advantages of private cover are choice of specialist, private room, and shorter waits
            for elective procedures. For emergency care, the public system is identical.
          </p>
        )}
      </>
    );
  }

  return (
    <section aria-labelledby="what-this-means-heading" className="card">
      <h2 id="what-this-means-heading" className="text-xl font-bold mb-4">
        {heading}
      </h2>
      <div className="text-muted space-y-0 leading-relaxed">{message}</div>
    </section>
  );
}

// ─── MLS Breakdown ───────────────────────────────────────────────────────────

const MLS_TIER_BADGE_COLORS: Record<string, string> = {
  base: 'bg-secondary/10 text-secondary border-secondary/20',
  '1':  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  '2':  'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
  '3':  'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300',
};

const MLS_TIER_NAMES: Record<string, string> = {
  base: 'Base (no surcharge)',
  '1':  'Tier 1 — 1.0%',
  '2':  'Tier 2 — 1.25%',
  '3':  'Tier 3 — 1.5%',
};

function MLSBreakdownPanel({ output }: { output: CalculationOutput }) {
  const { mlsResult } = output;
  if (!mlsResult.isAboveThreshold) {
    return (
      <section aria-labelledby="mls-heading" className="card">
        <h2 id="mls-heading" className="text-xl font-bold mb-3">
          Medicare Levy Surcharge
        </h2>
        <div className="flex items-center gap-3">
          <span className="inline-block px-2 py-0.5 rounded border text-sm font-semibold bg-secondary/10 text-secondary border-secondary/20">
            No surcharge
          </span>
          <p className="text-muted text-sm">
            Your income is below the MLS threshold — no surcharge applies.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="mls-heading" className="card">
      <h2 id="mls-heading" className="text-xl font-bold mb-4">
        Medicare Levy Surcharge
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-muted mb-1">Your MLS income</p>
          <p className="text-lg font-bold">{formatDollars(mlsResult.mlsIncome)}</p>
        </div>
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-muted mb-1">Rate applied</p>
          <span className={`inline-block px-2 py-0.5 rounded border text-xs font-semibold ${MLS_TIER_BADGE_COLORS[mlsResult.tier]}`}>
            {MLS_TIER_NAMES[mlsResult.tier]}
          </span>
        </div>
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-muted mb-1">Annual surcharge</p>
          <p className="text-lg font-bold text-warning">{formatDollars(mlsResult.annualMLS)}</p>
        </div>
      </div>
      {mlsResult.nextThreshold && (
        <p className="text-xs text-muted mt-3">
          Next threshold: {formatDollars(mlsResult.nextThreshold)} (rate increases to{' '}
          {mlsResult.tier === '1' ? '1.25%' : '1.5%'}).
        </p>
      )}
      <p className="text-xs text-muted mt-2">
        Getting basic hospital cover eliminates this surcharge entirely.
      </p>
    </section>
  );
}

// ─── LHC Panel ───────────────────────────────────────────────────────────────

function LHCPanel({ output }: { output: CalculationOutput }) {
  const { lhcResult } = output;
  if (lhcResult.loadingPercentage === 0 && lhcResult.youthDiscount === 0) {
    return (
      <section aria-labelledby="lhc-heading" className="card">
        <h2 id="lhc-heading" className="text-xl font-bold mb-3">
          Lifetime Health Cover Loading
        </h2>
        <p className="text-secondary font-medium">
          No LHC loading applies to you — your premiums are at the base rate.
        </p>
      </section>
    );
  }

  const loadingPct = Math.round(lhcResult.loadingPercentage * 100);

  return (
    <section aria-labelledby="lhc-heading" className="card">
      <h2 id="lhc-heading" className="text-xl font-bold mb-4">
        Lifetime Health Cover Loading
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-muted mb-1">Your LHC loading</p>
          <p className="text-lg font-bold text-warning">+{loadingPct}%</p>
        </div>
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-muted mb-1">Annual loading cost</p>
          <p className="text-lg font-bold">{formatDollars(lhcResult.annualLoadingCost)}</p>
        </div>
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-muted mb-1">10-year cumulative</p>
          <p className="text-lg font-bold">{formatDollars(lhcResult.tenYearCumulativeLoading)}</p>
        </div>
      </div>
      {lhcResult.yearsUntilLoadingRemoved !== null && (
        <p className="text-sm text-muted mt-3">
          If you take out hospital cover now, the loading will be removed after{' '}
          {lhcResult.yearsUntilLoadingRemoved} more year
          {lhcResult.yearsUntilLoadingRemoved !== 1 ? 's' : ''} of continuous cover.
        </p>
      )}
    </section>
  );
}

// ─── 10-Year Projection ───────────────────────────────────────────────────────

function ProjectionPanel({ output }: { output: CalculationOutput }) {
  const { projectionResult } = output;
  const { yearByYear, tenYearTotal, opportunityCost } = projectionResult;

  return (
    <section aria-labelledby="projection-heading" className="card">
      <h2 id="projection-heading" className="text-xl font-bold mb-2">
        10-Year Cost Projection
      </h2>
      <p className="text-sm text-muted mb-4">
        Premiums grow at the historical average of{' '}
        {Math.round(projectionResult.growthRateUsed * 100)}%/year.
        {projectionResult.loadingRemovalYear !== null && (
          <> LHC loading removed after Year {projectionResult.loadingRemovalYear}.</>
        )}
      </p>

      {/* Totals summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
        {[
          { label: 'No Insurance', value: tenYearTotal.noInsurance },
          { label: 'Basic / Bronze', value: tenYearTotal.basicBronze },
          { label: 'Silver / Gold',  value: tenYearTotal.silverGold },
        ].map(({ label, value }) => (
          <div key={label} className="bg-background rounded-lg p-3 border border-border text-center">
            <p className="text-muted mb-1">{label}</p>
            <p className="text-lg font-bold">{formatDollars(value)}</p>
          </div>
        ))}
      </div>

      {/* Year-by-year table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 font-semibold bg-transparent">Year</th>
              <th className="text-right py-2 font-semibold bg-transparent">No Insurance</th>
              <th className="text-right py-2 font-semibold bg-transparent">Basic/Bronze</th>
              <th className="text-right py-2 font-semibold bg-transparent">Silver/Gold</th>
            </tr>
          </thead>
          <tbody>
            {yearByYear.map((row) => (
              <tr
                key={row.year}
                className={[
                  'border-b border-border/50',
                  row.lhcLoadingRemoved ? 'bg-secondary/5' : '',
                ].join(' ')}
              >
                <td className="py-2">
                  {row.calendarYear}
                  {row.lhcLoadingRemoved && (
                    <span className="ml-2 text-xs text-secondary font-medium">
                      (loading removed)
                    </span>
                  )}
                </td>
                <td className="text-right py-2">{formatDollars(row.noInsuranceCost)}</td>
                <td className="text-right py-2">{formatDollars(row.basicBronzeCost)}</td>
                <td className="text-right py-2">{formatDollars(row.silverGoldCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted mt-3">
        Opportunity cost of Silver/Gold premiums (invested at 5% p.a.):
        approximately {formatDollars(opportunityCost)} over 10 years.
      </p>
    </section>
  );
}

// ─── Ambulance Alert ─────────────────────────────────────────────────────────

function AmbulanceAlert({ output }: { output: CalculationOutput }) {
  const { inputs } = output;
  const FREE_STATES = ['QLD', 'TAS'];
  if (FREE_STATES.includes(inputs.state)) return null;

  const AMBULANCE_COSTS: Record<string, { cost: string; note: string }> = {
    VIC: { cost: 'up to $1,282',  note: 'per emergency call-out' },
    NSW: { cost: 'around $401',   note: 'per emergency call-out' },
    SA:  { cost: 'up to $1,046',  note: 'per emergency call-out' },
    WA:  { cost: 'up to $943',    note: 'per emergency call-out' },
    ACT: { cost: 'around $401',   note: 'per emergency call-out' },
    NT:  { cost: 'up to $636',    note: 'per emergency call-out' },
  };
  const info = AMBULANCE_COSTS[inputs.state] ?? { cost: 'several hundred dollars', note: '' };

  return (
    <section className="card border-warning/30 bg-warning/5">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <span aria-hidden="true">🚑</span> Ambulance Cover — {inputs.state}
      </h2>
      <p className="text-sm text-muted">
        In {inputs.state}, an emergency ambulance can cost{' '}
        <strong>{info.cost}</strong> {info.note}. Private hospital cover typically includes
        ambulance cover, or you can purchase an ambulance subscription separately.
      </p>
      <p className="text-xs text-muted mt-2">
        An ambulance subscription in most states costs $30–$50/year for a single adult.
      </p>
    </section>
  );
}

// ─── Key Insights Accordion ───────────────────────────────────────────────────

function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="border-b border-border last:border-0">
      <summary className="flex items-center justify-between py-4 cursor-pointer select-none font-medium hover:text-primary focus:outline-none">
        {title}
        <span className="ml-4 text-muted text-lg" aria-hidden="true">+</span>
      </summary>
      <div className="pb-4 text-sm text-muted space-y-2">{children}</div>
    </details>
  );
}

function KeyInsightsAccordion({ output }: { output: CalculationOutput }) {
  const { mlsResult, rebateResult, lhcResult } = output;

  return (
    <section aria-labelledby="insights-heading" className="card">
      <h2 id="insights-heading" className="text-xl font-bold mb-4">
        Key Insights
      </h2>
      <div>
        <AccordionItem title="How your MLS was calculated">
          <p>
            The Medicare Levy Surcharge is applied to your <strong>full MLS income</strong> at
            the tier rate — not just the amount above the threshold. Your MLS income of{' '}
            {formatDollars(mlsResult.mlsIncome)} falls in{' '}
            <strong>
              {mlsResult.tier === 'base'
                ? 'the base tier (no surcharge)'
                : `Tier ${mlsResult.tier}`}
            </strong>
            .
          </p>
          {mlsResult.isAboveThreshold && (
            <p>
              MLS income includes: taxable income + reportable fringe benefits + net
              investment losses + reportable super contributions. Check your tax return for
              these components.
            </p>
          )}
        </AccordionItem>

        <AccordionItem title="Understanding the government rebate">
          <p>
            Your rebate is{' '}
            <strong>
              {Math.round(rebateResult.rebatePercentage * 100 * 10) / 10}%
            </strong>{' '}
            (income tier: {rebateResult.tier}, age bracket: {rebateResult.ageBracket}).
            Tier 3 earners (above $158,001 single / $316,001 family) receive 0% rebate.
          </p>
          <p>
            The rebate is applied directly to your premium — you can claim it as a reduced
            premium from your insurer, or claim it back in your tax return.
          </p>
        </AccordionItem>

        <AccordionItem title="What Basic/Bronze actually covers">
          <p>
            Basic hospital cover is required to meet the minimum standards for MLS avoidance,
            but it covers very little: rehabilitation, psychiatric care, and palliative care
            only. Bronze adds some additional services but restricts most elective procedures.
          </p>
          <p>
            If you need a hip replacement, cataract surgery, or any major elective procedure,
            you would need at least Silver cover (and often Gold for some procedures).
          </p>
        </AccordionItem>

        <AccordionItem title="Gap fees: the hidden cost">
          <p>
            Even with hospital cover, you often pay a gap fee — the difference between what
            your doctor charges and what Medicare + your insurer pays. The average gap per
            hospital episode is around <strong>$478</strong>.
          </p>
          <p>
            Ask your specialist upfront about &quot;no-gap&quot; or &quot;known-gap&quot;
            arrangements. Your insurer can tell you which doctors in your area have no-gap
            agreements.
          </p>
        </AccordionItem>

        <AccordionItem title="Private health in emergencies">
          <p>
            In a genuine medical emergency, the public hospital system treats you
            immediately — private insurance makes no difference to emergency care. Private
            cover is most valuable for <em>elective</em> procedures and specialist access.
          </p>
        </AccordionItem>

        <AccordionItem title="Waiting periods for new policies">
          <p>
            If you take out a new policy, you&apos;ll face waiting periods before you can
            claim:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Hospital: 12 months for pre-existing conditions</li>
            <li>Psychiatric: 2 months</li>
            <li>Obstetrics / pregnancy: 12 months</li>
            <li>Accidents: immediately covered (no waiting period)</li>
          </ul>
        </AccordionItem>
      </div>
    </section>
  );
}

// ─── Main results client ─────────────────────────────────────────────────────

export default function ResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { inputs, output } = useMemo(() => {
    const inputs = parseWizardParams(searchParams);
    if (!inputs) return { inputs: null, output: null };
    try {
      return { inputs, output: runCalculations(inputs) };
    } catch {
      return { inputs, output: null };
    }
  }, [searchParams]);

  // ── Guard: invalid params ──
  if (!inputs || !output) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="mb-4">Something went wrong</h1>
        <p className="text-muted mb-6">
          We couldn&apos;t load your results. Please go back and complete the wizard.
        </p>
        <button
          onClick={() => router.push('/should-i-get-private-health-insurance')}
          className="btn-primary"
        >
          Start again
        </button>
      </div>
    );
  }

  const { scenarioResult } = output;
  const [noIns, basic, silverGold] = scenarioResult.scenarios;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">

      {/* ── Page header ── */}
      <div className="text-center">
        <h1 className="mb-2">Your Private Health Insurance Analysis</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Based on your income, age, and situation — FY 2025–26 rates.
        </p>
      </div>

      {/* ── Recommendation banner ── */}
      <div className="card bg-primary/5 border-primary/20">
        <p className="font-semibold text-text-main mb-1">Our recommendation</p>
        <p className="text-muted">{scenarioResult.recommendationReason}</p>
      </div>

      {/* ── Scenario cards ── */}
      <section aria-labelledby="scenarios-heading">
        <h2 id="scenarios-heading" className="text-2xl font-bold mb-6">
          Cost Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScenarioCard
            scenario={noIns}
            isRecommended={scenarioResult.recommendedScenario === 'no-insurance'}
          />
          <ScenarioCard
            scenario={basic}
            isRecommended={scenarioResult.recommendedScenario === 'basic-bronze'}
          />
          <ScenarioCard
            scenario={silverGold}
            isRecommended={scenarioResult.recommendedScenario === 'silver-gold'}
          />
        </div>

        {scenarioResult.breakEvenAdmissions !== null && (
          <p className="text-sm text-muted mt-4 text-center">
            Silver/Gold breaks even vs No Insurance at approximately{' '}
            <strong>{scenarioResult.breakEvenAdmissions} hospital admissions/year</strong>.
          </p>
        )}
      </section>

      {/* ── What This Means ── */}
      <WhatThisMeans output={output} />

      {/* ── MLS Breakdown ── */}
      <MLSBreakdownPanel output={output} />

      {/* ── LHC Panel ── */}
      <LHCPanel output={output} />

      {/* ── 10-Year Projection ── */}
      <ProjectionPanel output={output} />

      {/* ── Ambulance Alert ── */}
      <AmbulanceAlert output={output} />

      {/* ── Key Insights ── */}
      <KeyInsightsAccordion output={output} />

      {/* ── Edit answers link ── */}
      <div className="text-center pt-4 border-t border-border">
        <button
          onClick={() => router.push('/should-i-get-private-health-insurance')}
          className="text-sm text-primary hover:underline"
        >
          ← Edit your answers
        </button>
      </div>

    </div>
  );
}
