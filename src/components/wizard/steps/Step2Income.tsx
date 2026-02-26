'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import IncomeRangeSelector from '@/components/calculator/IncomeRangeSelector';
import InfoTooltip from '@/components/wizard/InfoTooltip';
import type { IncomeRange } from '@/lib/types';

export default function Step2Income() {
  const { state, updateInputs, next, prev } = useWizard();
  const { incomeRange, exactIncome, familyType } = state.inputs;

  const isFamilyThreshold =
    familyType === 'couple' || familyType === 'family' || familyType === 'single-parent';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── Main form ── */}
      <div className="lg:col-span-2 space-y-8">
        {/* Income card */}
        <section className="card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              1
            </span>
            <h2 className="text-xl font-semibold">Your income</h2>
          </div>
          <p className="text-muted mb-6">
            Your income determines whether you&apos;ll pay the Medicare Levy Surcharge and how much
            government rebate you&apos;ll receive on private health insurance premiums.
          </p>

          <IncomeRangeSelector
            selectedRange={incomeRange}
            exactIncome={exactIncome}
            onRangeChange={(range: IncomeRange) => updateInputs({ incomeRange: range })}
            onExactIncomeChange={(income: number | null) => updateInputs({ exactIncome: income })}
          />

          <InfoTooltip trigger="What counts as income for the surcharge?">
            <p className="mb-2">
              MLS income includes more than just your taxable income. The ATO uses a broader
              definition called &quot;income for MLS purposes&quot; which adds several components:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>Taxable income</li>
              <li>Reportable fringe benefits</li>
              <li>Net investment losses (negative gearing)</li>
              <li>Reportable super contributions</li>
              <li>Exempt foreign employment income</li>
              <li>Net financial investment losses under family trust distributions</li>
            </ul>
            <p>
              Many people underestimate their MLS income because they only consider their salary.
              If you have any of the above, your actual MLS income may be higher than you think.
            </p>
          </InfoTooltip>
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
            Next: Insurance Status &rarr;
          </button>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className="lg:col-span-1">
        <div className="card lg:sticky lg:top-24">
          <h3 className="text-lg font-bold text-text-main mb-4">
            Income determines two things
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <p className="font-semibold text-text-main">1. Medicare Levy Surcharge</p>
              <p className="text-sm text-muted">
                If you earn above the threshold and don&apos;t have hospital cover, you&apos;ll pay
                an extra 1–1.5% tax on top of the standard 2% Medicare Levy.
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-main">2. Government rebate</p>
              <p className="text-sm text-muted">
                The government rebates up to 24.608% of your premium if you&apos;re under 65.
                Higher earners (Tier 3) get no rebate at all.
              </p>
            </div>
          </div>

          {/* Threshold table */}
          <div>
            <h4 className="text-sm font-bold text-text-main mb-2">
              FY 2025–26 thresholds{' '}
              <span className="text-muted font-normal">
                ({isFamilyThreshold ? 'families' : 'singles'})
              </span>
            </h4>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted font-medium">Income</th>
                  <th className="text-right py-2 text-muted font-medium">MLS</th>
                </tr>
              </thead>
              <tbody>
                {isFamilyThreshold ? (
                  <>
                    <tr className="border-b border-border">
                      <td className="py-1.5">$0 – $202,000</td>
                      <td className="text-right py-1.5 text-secondary font-medium">0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$202,001 – $236,000</td>
                      <td className="text-right py-1.5 font-medium">1.0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$236,001 – $316,000</td>
                      <td className="text-right py-1.5 font-medium">1.25%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">$316,001+</td>
                      <td className="text-right py-2 font-medium">1.5%</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b border-border">
                      <td className="py-1.5">$0 – $101,000</td>
                      <td className="text-right py-1.5 text-secondary font-medium">0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$101,001 – $118,000</td>
                      <td className="text-right py-1.5 font-medium">1.0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$118,001 – $158,000</td>
                      <td className="text-right py-1.5 font-medium">1.25%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">$158,001+</td>
                      <td className="text-right py-2 font-medium">1.5%</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {isFamilyThreshold && (
              <p className="text-xs text-muted mt-2">
                Family thresholds increase by $1,500 for each dependent child after the first.
              </p>
            )}

            <p className="text-xs text-muted mt-2">
              Source: ATO, FY 2025–26.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
