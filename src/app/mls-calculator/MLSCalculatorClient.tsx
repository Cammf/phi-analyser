'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IncomeRangeSelector from '@/components/calculator/IncomeRangeSelector';
import FamilyTypeSelector from '@/components/calculator/FamilyTypeSelector';
import InfoTooltip from '@/components/wizard/InfoTooltip';
import type { IncomeRange, FamilyType } from '@/lib/types';

export default function MLSCalculatorClient() {
  const router = useRouter();

  const [incomeRange, setIncomeRange] = useState<IncomeRange | null>(null);
  const [exactIncome, setExactIncome] = useState<number | null>(null);
  const [familyType, setFamilyType] = useState<FamilyType | null>(null);
  const [dependentChildren, setDependentChildren] = useState(1);

  const canCalculate = incomeRange !== null && familyType !== null;

  function handleCalculate() {
    if (!canCalculate) return;

    const params = new URLSearchParams();
    params.set('range', incomeRange);
    if (exactIncome !== null) params.set('income', String(exactIncome));
    params.set('family', familyType);
    if (familyType === 'family' || familyType === 'single-parent') {
      params.set('children', String(dependentChildren));
    }

    router.push(`/mls-calculator/results?${params.toString()}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="mb-3">Medicare Levy Surcharge Calculator</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Find out if you need to pay the MLS and whether getting basic hospital cover could
          save you money. Based on ATO rates for FY 2025–26.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form — 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Income */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">1</span>
              <h2 className="text-xl">Your income</h2>
            </div>
            <p className="text-sm text-muted mb-4">
              Select your annual income range, or enter an exact figure for a precise calculation.
            </p>
            <IncomeRangeSelector
              selectedRange={incomeRange}
              exactIncome={exactIncome}
              onRangeChange={setIncomeRange}
              onExactIncomeChange={setExactIncome}
            />
            <InfoTooltip trigger="What counts as income for the MLS?">
              <p className="mb-2">
                <strong>MLS income</strong> is not just your taxable income. It includes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Taxable income</li>
                <li>Reportable fringe benefits</li>
                <li>Net investment losses (e.g. negative gearing)</li>
                <li>Reportable super contributions</li>
                <li>Any exempt foreign employment income</li>
                <li>Net financial investment losses under family trust distributions</li>
              </ul>
              <p className="mt-2 text-muted">
                Many people underestimate their MLS income — check your tax return or use the
                ATO&apos;s income test calculator.
              </p>
            </InfoTooltip>
          </section>

          {/* Step 2: Family type */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">2</span>
              <h2 className="text-xl">Family situation</h2>
            </div>
            <p className="text-sm text-muted mb-4">
              Your family type determines which MLS thresholds apply.
            </p>
            <FamilyTypeSelector
              selectedType={familyType}
              dependentChildren={dependentChildren}
              onTypeChange={setFamilyType}
              onChildrenChange={setDependentChildren}
            />
          </section>

          {/* CTA */}
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className={[
              'w-full sm:w-auto btn-primary text-lg px-8 py-4',
              !canCalculate ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            Calculate My MLS
          </button>
        </div>

        {/* Sidebar — StepAside */}
        <aside className="lg:col-span-1">
          <div className="card lg:sticky lg:top-24">
            <h3 className="text-lg mb-3">What is the Medicare Levy Surcharge?</h3>
            <p className="text-sm text-muted mb-3">
              The MLS is an additional tax of 1–1.5% of your income, charged on top of the
              standard 2% Medicare Levy. It applies to higher-income earners who don&apos;t
              hold an appropriate level of private hospital cover.
            </p>
            <p className="text-sm text-muted mb-4">
              You can avoid the MLS entirely by taking out a Basic (or higher) hospital policy
              with an excess of $750 or less for singles, or $1,500 or less for couples/families.
            </p>

            <h4 className="font-semibold text-sm mb-2">FY 2025–26 thresholds</h4>

            {/* Singles table */}
            <p className="text-xs font-medium text-muted mb-1 uppercase tracking-wide">Singles</p>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 font-semibold text-text-main bg-transparent">Income</th>
                  <th className="text-right py-1.5 font-semibold text-text-main bg-transparent">MLS rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
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
                  <td className="text-right py-1.5 font-medium">1.5%</td>
                </tr>
              </tbody>
            </table>

            {/* Families table */}
            <p className="text-xs font-medium text-muted mb-1 uppercase tracking-wide">Families</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 font-semibold text-text-main bg-transparent">Income</th>
                  <th className="text-right py-1.5 font-semibold text-text-main bg-transparent">MLS rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
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
                  <td className="text-right py-1.5 font-medium">1.5%</td>
                </tr>
              </tbody>
            </table>

            <p className="text-xs text-muted mt-3">
              Family thresholds increase by $1,500 for each dependent child after the first.
              Source: ATO, FY 2025–26.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
