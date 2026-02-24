'use client';

import { useState } from 'react';
import RadioCard from '@/components/wizard/RadioCard';
import { INCOME_RANGE_LABELS, INCOME_RANGE_MIDPOINTS } from '@/lib/resolveInputs';
import { formatDollars } from '@/lib/format';
import type { IncomeRange } from '@/lib/types';

const INCOME_RANGES: IncomeRange[] = [
  'under-90k',
  '90k-110k',
  '110k-140k',
  '140k-175k',
  '175k-250k',
  'over-250k',
];

const RANGE_DESCRIPTIONS: Record<IncomeRange, string> = {
  'under-90k':  'Below MLS threshold',
  '90k-110k':   'Near the MLS threshold',
  '110k-140k':  'MLS Tier 1–2 range',
  '140k-175k':  'MLS Tier 2–3 range',
  '175k-250k':  'MLS Tier 3',
  'over-250k':  'MLS Tier 3',
};

interface IncomeRangeSelectorProps {
  selectedRange: IncomeRange | null;
  exactIncome: number | null;
  onRangeChange: (range: IncomeRange) => void;
  onExactIncomeChange: (income: number | null) => void;
}

export default function IncomeRangeSelector({
  selectedRange,
  exactIncome,
  onRangeChange,
  onExactIncomeChange,
}: IncomeRangeSelectorProps) {
  const [showExact, setShowExact] = useState(exactIncome !== null);

  const effectiveIncome = exactIncome ?? (selectedRange ? INCOME_RANGE_MIDPOINTS[selectedRange] : null);

  return (
    <div>
      <fieldset>
        <legend className="label mb-3">
          What is your income for MLS purposes?
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INCOME_RANGES.map((range) => (
            <RadioCard
              key={range}
              id={`income-${range}`}
              name="incomeRange"
              value={range}
              checked={selectedRange === range}
              onChange={(val) => onRangeChange(val as IncomeRange)}
              label={INCOME_RANGE_LABELS[range]}
              description={RANGE_DESCRIPTIONS[range]}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            const next = !showExact;
            setShowExact(next);
            if (!next) onExactIncomeChange(null);
          }}
          className="text-sm text-primary font-medium hover:underline focus:outline-none focus:underline"
        >
          {showExact ? 'Use income range instead' : 'I know my exact income'}
        </button>

        {showExact && (
          <div className="mt-3">
            <label htmlFor="exact-income" className="text-sm text-muted block mb-1">
              Enter your exact MLS income
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
              <input
                id="exact-income"
                type="number"
                min={0}
                step={1000}
                value={exactIncome ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onExactIncomeChange(val === '' ? null : Math.max(0, parseInt(val, 10)));
                }}
                placeholder="e.g. 125000"
                className="input-field pl-8"
              />
            </div>
          </div>
        )}
      </div>

      {effectiveIncome !== null && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-primary/20 rounded-full text-sm font-medium text-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Using income: {formatDollars(effectiveIncome)}
        </div>
      )}
    </div>
  );
}
