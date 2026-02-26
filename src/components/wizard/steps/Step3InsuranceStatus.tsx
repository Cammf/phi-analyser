'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import CoverStatusSelector from '@/components/calculator/CoverStatusSelector';
import type { CoverStatus, HospitalTier } from '@/lib/types';

export default function Step3InsuranceStatus() {
  const { state, updateInputs, next, prev } = useWizard();
  const { coverStatus, currentTier, extrasOnly, yearsHeld, yearDropped } = state.inputs;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── Main form ── */}
      <div className="lg:col-span-2 space-y-8">
        <section className="card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              1
            </span>
            <h2 className="text-xl font-semibold">Your insurance status</h2>
          </div>
          <p className="text-muted mb-6">
            Your current cover history determines your Lifetime Health Cover loading and
            which scenario is most relevant to you.
          </p>

          <CoverStatusSelector
            coverStatus={coverStatus}
            currentTier={currentTier}
            hasExtrasOnly={extrasOnly}
            yearsHeld={yearsHeld}
            yearDropped={yearDropped}
            onCoverStatusChange={(status: CoverStatus) => updateInputs({ coverStatus: status })}
            onCurrentTierChange={(tier: HospitalTier) => updateInputs({ currentTier: tier })}
            onExtrasOnlyChange={(val: boolean) => updateInputs({ extrasOnly: val })}
            onYearsHeldChange={(years: number) => updateInputs({ yearsHeld: years })}
            onYearDroppedChange={(year: number | null) => updateInputs({ yearDropped: year })}
          />
        </section>

        {/* Navigation */}
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
            className="btn-primary text-lg px-8 py-4"
            onClick={() => next()}
          >
            Next: Health Needs &rarr;
          </button>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className="lg:col-span-1">
        <div className="card lg:sticky lg:top-24">
          <h3 className="text-lg font-semibold mb-4">Lifetime Health Cover loading</h3>

          <div className="space-y-4 text-sm text-muted">
            <div>
              <p className="font-medium text-text-main">How it works</p>
              <p>
                If you don&apos;t take out hospital cover by age 31, you&apos;ll pay a 2%
                loading on your premiums for every year you were over 30 without cover.
                This is on top of your base premium.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">Example</p>
              <p>
                If you first take out cover at age 40, you&apos;ll pay 20% more on your
                premium (2% &times; 10 years). A $1,357 Bronze premium becomes $1,628.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">The 10-year rule</p>
              <p>
                The good news: loading is removed after 10 continuous years of hospital
                cover. So it&apos;s temporary — not permanent.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">Grace period</p>
              <p>
                If you drop cover, you have a 3-year grace period (1,094 days) before
                your loading starts accruing again. But your 10-year removal clock resets
                if you drop for longer.
              </p>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="font-medium text-text-main">Maximum loading</p>
              <p>
                Loading is capped at 70% (for those who first took cover at age 65 or
                older). It is removed entirely after 10 continuous years.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
