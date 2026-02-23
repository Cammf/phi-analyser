// =============================================================================
// REBATE CALCULATIONS — Private Health Insurance Analyser
// FY 2025-26 | Source: ato.gov.au | Verified 2026-02-23
// =============================================================================

import type {
  FamilyType,
  AgeBracket,
  RebateResult,
  RebateCalculationBreakdown,
} from '@/lib/types';

// ─── FY 2025-26 Income Thresholds (same as MLS) ──────────────────────────────
// Rebate tier is determined by the same income thresholds as MLS.

type RebateTier = 'base' | '1' | '2' | '3';

interface RebateThreshold {
  tier: RebateTier;
  incomeMin: number;
  incomeMax: number | null;
}

const SINGLE_THRESHOLDS: RebateThreshold[] = [
  { tier: 'base', incomeMin: 0,      incomeMax: 101000 },
  { tier: '1',    incomeMin: 101001, incomeMax: 118000 },
  { tier: '2',    incomeMin: 118001, incomeMax: 158000 },
  { tier: '3',    incomeMin: 158001, incomeMax: null   },
];

const FAMILY_BASE_THRESHOLDS: RebateThreshold[] = [
  { tier: 'base', incomeMin: 0,      incomeMax: 202000 },
  { tier: '1',    incomeMin: 202001, incomeMax: 236000 },
  { tier: '2',    incomeMin: 236001, incomeMax: 316000 },
  { tier: '3',    incomeMin: 316001, incomeMax: null   },
];

const CHILD_INCREMENT = 1500;

// ─── FY 2025-26 Rebate Percentages — Period 1 (primary) ─────────────────────
// Period 1: 1 July 2025 – 31 March 2026 (9 of 12 months)
// Indexed on 1 April; two periods exist within FY 2025-26.
// The primary (Period 1) rates are used as the calculator default.
// Source: src/data/rebate/current.json — verified 2026-02-23
// Values are DECIMAL rates (e.g. 0.24288 = 24.288%).

const REBATE_RATES_PERIOD1: Record<RebateTier, Record<AgeBracket, number>> = {
  base: { under65: 0.24288, age65to69: 0.28337, age70plus: 0.32385 },
  '1':  { under65: 0.16192, age65to69: 0.20240, age70plus: 0.24288 },
  '2':  { under65: 0.08095, age65to69: 0.12143, age70plus: 0.16192 },
  '3':  { under65: 0,       age65to69: 0,       age70plus: 0       },
};

// Period 2: 1 April 2026 – 30 June 2026 (3 of 12 months, post-April indexation)
const REBATE_RATES_PERIOD2: Record<RebateTier, Record<AgeBracket, number>> = {
  base: { under65: 0.24118, age65to69: 0.28139, age70plus: 0.32158 },
  '1':  { under65: 0.16079, age65to69: 0.20098, age70plus: 0.24118 },
  '2':  { under65: 0.08038, age65to69: 0.12058, age70plus: 0.16079 },
  '3':  { under65: 0,       age65to69: 0,       age70plus: 0       },
};

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

function isFamilyType(familyType: FamilyType): boolean {
  return familyType === 'couple' || familyType === 'family' || familyType === 'single-parent';
}

function buildFamilyThresholds(dependentChildren: number): RebateThreshold[] {
  const increment = Math.max(0, dependentChildren - 1) * CHILD_INCREMENT;
  if (increment === 0) return FAMILY_BASE_THRESHOLDS;
  return FAMILY_BASE_THRESHOLDS.map((entry) => ({
    ...entry,
    incomeMin: entry.incomeMin === 0 ? 0 : entry.incomeMin + increment,
    incomeMax: entry.incomeMax !== null ? entry.incomeMax + increment : null,
  }));
}

function findTier(mlsIncome: number, thresholds: RebateThreshold[]): RebateThreshold {
  for (const entry of thresholds) {
    if (entry.incomeMax === null || mlsIncome <= entry.incomeMax) {
      return entry;
    }
  }
  return thresholds[thresholds.length - 1];
}

// =============================================================================
// PUBLIC API
// =============================================================================

export interface CalculateRebateParams {
  /**
   * Income for MLS/rebate purposes — same definition as MLS income.
   * Taxable income + FBT + net investment losses + reportable super contributions.
   */
  mlsIncome: number;
  familyType: FamilyType;
  dependentChildren?: number;
  /**
   * Age bracket of the policyholder (or the older of a couple).
   * Couple rule: use the older person's age bracket for the rebate.
   */
  ageBracket: AgeBracket;
  /**
   * Annual hospital + extras premium BEFORE any rebate or LHC loading.
   * The rebate is applied to this base premium.
   */
  annualPremiumBeforeRebate: number;
  /** Use Period 2 rates (April 2026 – June 2026). Defaults to Period 1. */
  usePeriod2?: boolean;
}

/**
 * Calculates the Private Health Insurance Government Rebate for FY 2025-26.
 *
 * The rebate percentage is determined by income tier (same thresholds as MLS)
 * and age bracket. Tier 3 earners receive 0% rebate at all ages.
 *
 * Two rate periods exist within FY 2025-26 due to April indexation:
 *   - Period 1: 1 Jul 2025 – 31 Mar 2026 (primary, default)
 *   - Period 2: 1 Apr 2026 – 30 Jun 2026 (slightly lower rates)
 *
 * Couple age rule: use the older partner's age bracket.
 *
 * @see https://www.ato.gov.au/.../private-health-insurance-rebate/income-thresholds-and-rates
 */
export function calculateRebate({
  mlsIncome,
  familyType,
  dependentChildren = 0,
  ageBracket,
  annualPremiumBeforeRebate,
  usePeriod2 = false,
}: CalculateRebateParams): RebateResult {
  const useFamily = isFamilyType(familyType);
  const thresholds = useFamily ? buildFamilyThresholds(dependentChildren) : SINGLE_THRESHOLDS;
  const tierEntry = findTier(mlsIncome, thresholds);

  const rates = usePeriod2 ? REBATE_RATES_PERIOD2 : REBATE_RATES_PERIOD1;
  const rebatePercentage = rates[tierEntry.tier][ageBracket];

  const annualRebate = Math.round(annualPremiumBeforeRebate * rebatePercentage);
  const premiumAfterRebate = annualPremiumBeforeRebate - annualRebate;

  const breakdown: RebateCalculationBreakdown = {
    mlsIncome,
    tier: tierEntry.tier,
    ageBracket,
    rebatePercentage,
    basePremium: annualPremiumBeforeRebate,
    rebateDollars: annualRebate,
    premiumAfterRebate,
  };

  return {
    rebatePercentage,
    annualRebate,
    premiumAfterRebate,
    tier: tierEntry.tier,
    ageBracket,
    calculationBreakdown: breakdown,
  };
}

/**
 * Convenience: returns just the rebate percentage for a given income + age bracket.
 * Useful for quick lookups without a premium amount.
 */
export function getRebatePercentage(
  mlsIncome: number,
  familyType: FamilyType,
  ageBracket: AgeBracket,
  dependentChildren = 0,
  usePeriod2 = false,
): number {
  const useFamily = isFamilyType(familyType);
  const thresholds = useFamily ? buildFamilyThresholds(dependentChildren) : SINGLE_THRESHOLDS;
  const tierEntry = findTier(mlsIncome, thresholds);
  const rates = usePeriod2 ? REBATE_RATES_PERIOD2 : REBATE_RATES_PERIOD1;
  return rates[tierEntry.tier][ageBracket];
}

// Export rate tables for use in UI components
export { REBATE_RATES_PERIOD1, REBATE_RATES_PERIOD2 };
