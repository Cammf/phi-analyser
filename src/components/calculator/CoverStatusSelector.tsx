'use client';

import RadioCard from '@/components/wizard/RadioCard';
import type { CoverStatus, HospitalTier } from '@/lib/types';

interface CoverStatusSelectorProps {
  coverStatus: CoverStatus | null;
  currentTier: HospitalTier;
  hasExtrasOnly: boolean;
  yearsHeld: number;
  yearDropped: number | null;
  onCoverStatusChange: (status: CoverStatus) => void;
  onCurrentTierChange: (tier: HospitalTier) => void;
  onExtrasOnlyChange: (extrasOnly: boolean) => void;
  onYearsHeldChange: (years: number) => void;
  onYearDroppedChange: (year: number | null) => void;
}

const COVER_OPTIONS: Array<{ value: CoverStatus; label: string; description: string }> = [
  { value: 'yes',          label: 'Yes — I have hospital cover now',         description: 'Currently holding a hospital policy' },
  { value: 'never',        label: 'No — I\'ve never had it',                 description: 'Never held private hospital insurance' },
  { value: 'used-to-have', label: 'No — I used to have it but dropped it',   description: 'Previously held cover but cancelled' },
];

const TIER_OPTIONS: Array<{ value: HospitalTier; label: string }> = [
  { value: 'gold',   label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'basic',  label: 'Basic' },
  { value: 'none',   label: 'Not sure' },
];

const currentYear = new Date().getFullYear();

export default function CoverStatusSelector({
  coverStatus,
  currentTier,
  hasExtrasOnly,
  yearsHeld,
  yearDropped,
  onCoverStatusChange,
  onCurrentTierChange,
  onExtrasOnlyChange,
  onYearsHeldChange,
  onYearDroppedChange,
}: CoverStatusSelectorProps) {
  return (
    <div>
      <fieldset>
        <legend className="label mb-3">Do you currently have private hospital cover?</legend>

        <div className="grid grid-cols-1 gap-3">
          {COVER_OPTIONS.map((opt) => (
            <RadioCard
              key={opt.value}
              id={`cover-${opt.value}`}
              name="coverStatus"
              value={opt.value}
              checked={coverStatus === opt.value}
              onChange={(val) => onCoverStatusChange(val as CoverStatus)}
              label={opt.label}
              description={opt.description}
            />
          ))}
        </div>
      </fieldset>

      {/* Conditional fields for "yes" — currently holding cover */}
      {coverStatus === 'yes' && (
        <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="label">What tier is your hospital cover?</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TIER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onCurrentTierChange(opt.value)}
                  className={[
                    'px-4 py-2 rounded-lg text-sm font-medium border min-h-[40px] transition-colors',
                    currentTier === opt.value
                      ? 'border-primary bg-blue-50 text-primary'
                      : 'border-border bg-card text-text-main hover:border-primary/40',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasExtrasOnly}
                onChange={(e) => onExtrasOnlyChange(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-text-main">I only have extras (general treatment) cover, not hospital</span>
            </label>
            {hasExtrasOnly && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 ml-6">
                Extras-only cover does not count toward LHC loading removal or MLS avoidance.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="years-held-select" className="label">
              How many years have you held hospital cover continuously?
            </label>
            <select
              id="years-held-select"
              value={yearsHeld}
              onChange={(e) => onYearsHeldChange(parseInt(e.target.value, 10))}
              className="input-field max-w-[200px]"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'year' : 'years'}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Conditional fields for "used-to-have" */}
      {coverStatus === 'used-to-have' && (
        <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label htmlFor="years-held-prev" className="label">
              How many years did you hold hospital cover?
            </label>
            <select
              id="years-held-prev"
              value={yearsHeld}
              onChange={(e) => onYearsHeldChange(parseInt(e.target.value, 10))}
              className="input-field max-w-[200px]"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'year' : 'years'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year-dropped" className="label">
              What year did you drop your cover?
            </label>
            <select
              id="year-dropped"
              value={yearDropped ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                onYearDroppedChange(val === '' ? null : parseInt(val, 10));
              }}
              className="input-field max-w-[200px]"
            >
              <option value="">Not sure</option>
              {Array.from({ length: 20 }, (_, i) => currentYear - i).map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <p className="text-sm text-muted">
            If you dropped cover more than 3 years ago (1,094 days), your loading will have continued
            to accumulate as though you never had cover.
          </p>
        </div>
      )}
    </div>
  );
}
