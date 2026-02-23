// =============================================================================
// LHC LOADING CALCULATIONS — Private Health Insurance Analyser
// Source: privatehealth.gov.au | Verified 2026-02-23
// =============================================================================

import type {
  LHCResult,
  SimpleLhcResult,
  LHCCalculationBreakdown,
} from '@/lib/types';

// ─── LHC Rules (FY 2025-26) ─────────────────────────────────────────────────
// Source: https://www.privatehealth.gov.au/health_insurance/surcharges_incentives/lifetime_health_cover.htm

const LHC_BASE_AGE = 30;              // Loading accrues for each year over 30 without cover
const LHC_RATE_PER_YEAR = 0.02;       // 2% per year over 30
const LHC_MAX_LOADING = 0.70;         // Maximum loading capped at 70%
const LHC_REMOVAL_YEARS = 10;         // Loading removed after 10 continuous years with cover

// ─── Youth Discount Rules ─────────────────────────────────────────────────────
// Source: https://www.privatehealth.gov.au/health_insurance/surcharges_incentives/discount_age.htm
// Optional for insurers — shown as theoretical discount if available.

const YOUTH_DISCOUNT_TABLE: Array<{ ageMin: number; ageMax: number; discount: number }> = [
  { ageMin: 18, ageMax: 25, discount: 0.10 },
  { ageMin: 26, ageMax: 26, discount: 0.08 },
  { ageMin: 27, ageMax: 27, discount: 0.06 },
  { ageMin: 28, ageMax: 28, discount: 0.04 },
  { ageMin: 29, ageMax: 29, discount: 0.02 },
];
// Age 30+: 0% discount

const YOUTH_DISCOUNT_RETENTION_AGE = 41; // Discount frozen until 41 if cover maintained
const YOUTH_DISCOUNT_PHASE_OUT_RATE = 0.02; // Phase-out: −2%/year after 41

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/**
 * Returns the theoretical LHC loading for a person who has NEVER held cover,
 * based solely on current age.
 * Formula: min(70%, 2% × max(0, age − 30))
 */
function calculateNeverHadCoverLoading(age: number): number {
  const yearsOverBase = Math.max(0, age - LHC_BASE_AGE);
  return Math.min(LHC_MAX_LOADING, LHC_RATE_PER_YEAR * yearsOverBase);
}

/**
 * Returns the youth discount applicable to a person of the given age when they
 * FIRST join (not their current age if they've already been holding cover).
 */
function getYouthDiscount(ageAtJoining: number): number {
  for (const bracket of YOUTH_DISCOUNT_TABLE) {
    if (ageAtJoining >= bracket.ageMin && ageAtJoining <= bracket.ageMax) {
      return bracket.discount;
    }
  }
  return 0; // Age 30+ or under 18
}

/**
 * Current effective youth discount for someone who joined at joinAge and is
 * currently currentAge years old (accounting for the retention/phase-out rules).
 *
 * - If currently under 41: discount is frozen at the join-age discount rate.
 * - If currently 41+: discount phases out at 2% per year from the frozen amount.
 */
function getCurrentYouthDiscount(joinAge: number, currentAge: number): number {
  const discountAtJoining = getYouthDiscount(joinAge);
  if (discountAtJoining === 0) return 0;

  if (currentAge < YOUTH_DISCOUNT_RETENTION_AGE) {
    // Discount frozen until age 41
    return discountAtJoining;
  }

  // Phase out: −2% per year after 41, floored at 0%
  const yearsOver41 = currentAge - YOUTH_DISCOUNT_RETENTION_AGE;
  const phasedOut = discountAtJoining - YOUTH_DISCOUNT_PHASE_OUT_RATE * yearsOver41;
  return Math.max(0, phasedOut);
}

// =============================================================================
// PUBLIC API
// =============================================================================

export interface CalculateLhcParams {
  /** Current age of the policyholder. */
  currentAge: number;
  /**
   * Whether the person currently holds or has held hospital cover.
   * false = never held (or treated as not held for loading calculation purposes).
   */
  hasHeldHospitalCover: boolean;
  /**
   * Number of continuous years hospital cover has been held (if hasHeldHospitalCover = true).
   * 0 if they've just joined. Used to calculate loading at time of joining and removal year.
   */
  yearsHeld?: number;
  /**
   * Annual base hospital premium (before loading, before rebate).
   * Used to express loading in dollar terms.
   */
  basePremium: number;
  /**
   * Optional: calculate what the loading would be if the person defers joining to this age.
   * Must be ≥ currentAge. Used for the SimpleLhcResult deferral comparison.
   */
  deferAge?: number;
}

/**
 * Calculates LHC loading and youth discount for FY 2025-26.
 *
 * Loading formula: min(70%, 2% × max(0, ageAtJoining − 30))
 * Loading is removed after 10 continuous years of hospital cover.
 * Youth discount applies for those who join aged 18–29 (optional for insurers).
 *
 * @see https://www.privatehealth.gov.au/health_insurance/surcharges_incentives/lifetime_health_cover.htm
 */
export function calculateLHCLoading({
  currentAge,
  hasHeldHospitalCover,
  yearsHeld = 0,
  basePremium,
}: CalculateLhcParams): LHCResult {

  let loadingPercentage: number;
  let youthDiscount: number;
  let yearsUntilLoadingRemoved: number | null;

  if (!hasHeldHospitalCover) {
    // Never held cover — loading based on current age
    loadingPercentage = calculateNeverHadCoverLoading(currentAge);
    youthDiscount = getYouthDiscount(currentAge); // discount if they join NOW
    yearsUntilLoadingRemoved = loadingPercentage > 0 ? LHC_REMOVAL_YEARS : null;
  } else {
    // Currently holding cover — loading was set when they first joined
    const ageAtJoining = currentAge - yearsHeld;
    loadingPercentage = calculateNeverHadCoverLoading(ageAtJoining);
    youthDiscount = getCurrentYouthDiscount(ageAtJoining, currentAge);
    yearsUntilLoadingRemoved = loadingPercentage > 0
      ? Math.max(0, LHC_REMOVAL_YEARS - yearsHeld)
      : null;
    // If they've hit 10 continuous years, loading is gone
    if (yearsHeld >= LHC_REMOVAL_YEARS) {
      loadingPercentage = 0;
      yearsUntilLoadingRemoved = null;
    }
  }

  const annualLoadingCost = Math.round(basePremium * loadingPercentage);

  // Simple 10-year cumulative loading (no premium growth — flat estimate)
  const yearsOfLoading = yearsUntilLoadingRemoved !== null
    ? Math.min(yearsUntilLoadingRemoved, 10)
    : 0;
  const tenYearCumulativeLoading = annualLoadingCost * yearsOfLoading;

  const removalCalendarYear = yearsUntilLoadingRemoved !== null && yearsUntilLoadingRemoved > 0
    ? new Date().getFullYear() + yearsUntilLoadingRemoved
    : null;

  const breakdown: LHCCalculationBreakdown = {
    currentAge,
    yearsOverBase: Math.max(0, hasHeldHospitalCover ? (currentAge - yearsHeld) - LHC_BASE_AGE : currentAge - LHC_BASE_AGE),
    loadingPercentage,
    youthDiscount,
    annualLoadingCost,
    basePremiumUsed: basePremium,
    removalYear: removalCalendarYear,
  };

  return {
    loadingPercentage,
    youthDiscount,
    annualLoadingCost,
    tenYearCumulativeLoading,
    yearsUntilLoadingRemoved,
    calculationBreakdown: breakdown,
  };
}

/**
 * Extended result including a deferral comparison table and year-by-year costs.
 * Used by the standalone LHC Calculator (/lhc-loading-calculator).
 */
export function calculateLHCLoadingSimple({
  currentAge,
  hasHeldHospitalCover,
  yearsHeld = 0,
  basePremium,
  deferAge,
}: CalculateLhcParams): SimpleLhcResult {
  const base = calculateLHCLoading({ currentAge, hasHeldHospitalCover, yearsHeld, basePremium });

  // Deferral comparison: show loading + 10-year extra cost at several future ages
  const deferralAges = deferAge
    ? [deferAge]
    : [35, 40, 45, 50, 55].filter((a) => a > currentAge);

  const deferralComparison = deferralAges.map((deferToAge) => {
    const loadingAtDefer = calculateNeverHadCoverLoading(deferToAge);
    const extraLoadingPercent = Math.max(0, loadingAtDefer - base.loadingPercentage);
    const extraAnnualCost = Math.round(basePremium * extraLoadingPercent);
    // Extra cumulative cost over 10 years (flat, no growth)
    const cumulativeExtraCostOver10Yrs = extraAnnualCost * Math.min(LHC_REMOVAL_YEARS, 10);
    return { deferToAge, loadingAtDeferAge: loadingAtDefer, cumulativeExtraCostOver10Yrs };
  });

  return {
    ...base,
    deferralComparison,
  };
}

// Export helpers for use in UI components (e.g., LHC explanation panels)
export { calculateNeverHadCoverLoading, getYouthDiscount, getCurrentYouthDiscount };
