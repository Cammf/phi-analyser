'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/wizard/WizardContext';
import { runCalculations } from '@/lib/runCalculations';
import { buildWizardParams } from '@/lib/wizardParams';
import { INCOME_RANGE_LABELS } from '@/lib/resolveInputs';
import { formatDollars, formatPercentage } from '@/lib/format';
import type { WizardStep } from '@/lib/types';

const FAMILY_LABELS: Record<string, string> = {
  single: 'Single',
  couple: 'Couple',
  family: 'Family',
  'single-parent': 'Single parent',
};

const COVER_STATUS_LABELS: Record<string, string> = {
  yes:           'Yes — currently insured',
  never:         'Never had hospital cover',
  'used-to-have':'Used to have cover',
};

const TIER_LABELS: Record<string, string> = {
  none:   'Not specified',
  basic:  'Basic',
  bronze: 'Bronze',
  silver: 'Silver',
  gold:   'Gold',
};

const MLS_TIER_LABELS: Record<string, string> = {
  base: 'No surcharge',
  '1':  'Tier 1 — 1.0%',
  '2':  'Tier 2 — 1.25%',
  '3':  'Tier 3 — 1.5%',
};

const MLS_TIER_COLORS: Record<string, string> = {
  base: 'bg-secondary/10 text-secondary border-secondary/20',
  '1':  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  '2':  'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
  '3':  'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300',
};

interface ReviewSectionProps {
  title: string;
  step: WizardStep;
  children: React.ReactNode;
  onEdit: (step: WizardStep) => void;
}

function ReviewSection({ title, step, children, onEdit }: ReviewSectionProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-sm text-primary hover:underline focus:outline-none"
          aria-label={`Edit ${title}`}
        >
          Edit ›
        </button>
      </div>
      <dl className="space-y-1 text-sm">{children}</dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}

export default function Step5Review() {
  const { state, goToStep, prev } = useWizard();
  const router = useRouter();
  const { inputs } = state;

  // Run full calculation pipeline for the live preview
  const preview = useMemo(() => {
    if (inputs.age < 18) return null;
    try {
      return runCalculations(inputs);
    } catch {
      return null;
    }
  }, [inputs]);

  function handleCalculate() {
    const params = buildWizardParams(inputs);
    router.push(`/should-i-get-private-health-insurance/results?${params.toString()}`);
  }

  const canCalculate = inputs.age >= 18 && inputs.age <= 120;

  return (
    <div className="space-y-8">
      {/* ── Review cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReviewSection title="About You" step={1} onEdit={goToStep}>
          <ReviewRow label="Age"     value={String(inputs.age) || '—'} />
          <ReviewRow label="Family"  value={FAMILY_LABELS[inputs.familyType]} />
          {(inputs.familyType === 'family' || inputs.familyType === 'single-parent') && (
            <ReviewRow label="Children" value={String(inputs.dependentChildren)} />
          )}
          <ReviewRow label="State"   value={inputs.state} />
        </ReviewSection>

        <ReviewSection title="Income" step={2} onEdit={goToStep}>
          <ReviewRow
            label="Income range"
            value={INCOME_RANGE_LABELS[inputs.incomeRange]}
          />
          {inputs.exactIncome !== null && (
            <ReviewRow
              label="Exact income"
              value={formatDollars(inputs.exactIncome)}
            />
          )}
        </ReviewSection>

        <ReviewSection title="Insurance Status" step={3} onEdit={goToStep}>
          <ReviewRow label="Cover status" value={COVER_STATUS_LABELS[inputs.coverStatus]} />
          {inputs.coverStatus === 'yes' && (
            <>
              <ReviewRow label="Tier" value={TIER_LABELS[inputs.currentTier]} />
              {inputs.extrasOnly && (
                <ReviewRow label="Type" value="Extras only (no hospital)" />
              )}
            </>
          )}
          {inputs.coverStatus === 'used-to-have' && (
            <ReviewRow label="Years held" value={`${inputs.yearsHeld} year(s)`} />
          )}
        </ReviewSection>

        <ReviewSection title="Health Needs" step={4} onEdit={goToStep}>
          {!inputs.includeHealthNeeds ? (
            <ReviewRow label="Health needs" value="Skipped" />
          ) : (
            <>
              <ReviewRow label="Dental"  value={`${inputs.dentalVisitsPerYear} visit(s)/yr`} />
              <ReviewRow label="Optical" value={`${inputs.opticalClaimsPerYear} claim(s)/yr`} />
              <ReviewRow label="Physio"  value={`${inputs.physioSessionsPerYear} session(s)/yr`} />
              <ReviewRow label="Extras"  value={inputs.extrasDesired === 'none' ? 'None' : inputs.extrasDesired} />
              {inputs.plannedProcedures.length > 0 && (
                <ReviewRow
                  label="Procedures"
                  value={`${inputs.plannedProcedures.length} selected`}
                />
              )}
            </>
          )}
        </ReviewSection>
      </div>

      {/* ── Live preview ── */}
      {preview && (
        <div className="card bg-card border border-border">
          <h3 className="text-base font-semibold mb-4">Your situation at a glance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 rounded-lg bg-background border border-border">
              <p className="text-muted mb-1">MLS rate</p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                  MLS_TIER_COLORS[preview.mlsResult.tier]
                }`}
              >
                {MLS_TIER_LABELS[preview.mlsResult.tier]}
              </span>
              {preview.mlsResult.annualMLS > 0 && (
                <p className="mt-1 font-medium">
                  {formatDollars(preview.mlsResult.annualMLS)}/yr
                </p>
              )}
            </div>

            <div className="text-center p-3 rounded-lg bg-background border border-border">
              <p className="text-muted mb-1">Govt rebate</p>
              <p className="text-lg font-bold text-primary">
                {formatPercentage(preview.rebateResult.rebatePercentage)}
              </p>
              <p className="text-xs text-muted mt-0.5">on your premium</p>
            </div>

            <div className="text-center p-3 rounded-lg bg-background border border-border">
              <p className="text-muted mb-1">LHC loading</p>
              {preview.lhcResult.loadingPercentage > 0 ? (
                <>
                  <p className="text-lg font-bold text-warning">
                    +{formatPercentage(preview.lhcResult.loadingPercentage)}
                  </p>
                  <p className="text-xs text-muted mt-0.5">on hospital cover</p>
                </>
              ) : (
                <p className="text-lg font-bold text-secondary">None</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex justify-between">
        <button
          type="button"
          className="btn-secondary text-lg px-8 py-4"
          onClick={() => prev()}
        >
          &larr; Back
        </button>
        <button
          type="button"
          disabled={!canCalculate}
          onClick={handleCalculate}
          className={[
            'btn-primary text-lg px-8 py-4',
            !canCalculate ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        >
          Show Me the Numbers &rarr;
        </button>
      </div>
    </div>
  );
}
