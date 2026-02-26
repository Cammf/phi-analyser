'use client';

import { useMemo } from 'react';
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

      {/* Additional sections added in Tasks 7–9 */}

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
