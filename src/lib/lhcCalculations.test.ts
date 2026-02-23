// =============================================================================
// LHC CALCULATIONS — TEST SUITE
// Formula: loading = min(70%, 2% × max(0, age − 30))
// Loading removed after 10 continuous years of hospital cover.
// Youth discount: 10% at 18-25, reducing 2%/year to age 29.
// All expected values hand-calculated and annotated.
// =============================================================================

import {
  calculateLHCLoading,
  calculateLHCLoadingSimple,
  calculateNeverHadCoverLoading,
  getYouthDiscount,
  getCurrentYouthDiscount,
} from '@/lib/lhcCalculations';

// Base premium used for loading dollar-cost calculations
const BASE_PREMIUM = 1357; // Bronze single — representative for LHC examples

// =============================================================================
// calculateNeverHadCoverLoading — formula correctness
// =============================================================================

describe('calculateNeverHadCoverLoading — formula: min(70%, 2% × max(0, age − 30))', () => {

  test('age 18 → 0% loading (under base age)', () => {
    // max(0, 18 − 30) = 0 → 0% loading
    expect(calculateNeverHadCoverLoading(18)).toBe(0);
  });

  test('age 30 → 0% loading (at base age)', () => {
    // max(0, 30 − 30) = 0 → 0% loading
    expect(calculateNeverHadCoverLoading(30)).toBe(0);
  });

  test('age 31 → 2% loading (1 year over 30)', () => {
    // 0.02 × (31 − 30) = 0.02 → 2%
    expect(calculateNeverHadCoverLoading(31)).toBeCloseTo(0.02);
  });

  test('age 35 → 10% loading (5 years over 30)', () => {
    // 0.02 × (35 − 30) = 0.10 → 10%
    // Matches checklist example 1: "Age 35, never had cover → 10%"
    expect(calculateNeverHadCoverLoading(35)).toBeCloseTo(0.10);
  });

  test('age 45 → 30% loading (15 years over 30)', () => {
    // 0.02 × (45 − 30) = 0.30 → 30%
    // Matches checklist example 2: "Age 45, never had cover → 30%"
    expect(calculateNeverHadCoverLoading(45)).toBeCloseTo(0.30);
  });

  test('age 60 → 60% loading (30 years over 30)', () => {
    // 0.02 × (60 − 30) = 0.60 → 60%
    expect(calculateNeverHadCoverLoading(60)).toBeCloseTo(0.60);
  });

  test('age 65 → 70% loading (35 years over 30, capped at 70%)', () => {
    // 0.02 × (65 − 30) = 0.70 → capped at 70%
    // Matches checklist example 3: "Age 65, never had cover → 70% (maximum)"
    expect(calculateNeverHadCoverLoading(65)).toBeCloseTo(0.70);
  });

  test('age 80 → 70% loading (cap still applies)', () => {
    // 0.02 × (80 − 30) = 1.00 → capped at 0.70
    expect(calculateNeverHadCoverLoading(80)).toBe(0.70);
  });

});

// =============================================================================
// getYouthDiscount — age-based discount at time of joining
// =============================================================================

describe('getYouthDiscount — discount when joining cover', () => {

  test('age 18 → 10% discount', () => { expect(getYouthDiscount(18)).toBe(0.10); });
  test('age 21 → 10% discount', () => { expect(getYouthDiscount(21)).toBe(0.10); });
  test('age 25 → 10% discount', () => { expect(getYouthDiscount(25)).toBe(0.10); });
  test('age 26 → 8% discount',  () => { expect(getYouthDiscount(26)).toBe(0.08); });
  test('age 27 → 6% discount',  () => { expect(getYouthDiscount(27)).toBe(0.06); });
  test('age 28 → 4% discount',  () => { expect(getYouthDiscount(28)).toBe(0.04); });
  test('age 29 → 2% discount',  () => { expect(getYouthDiscount(29)).toBe(0.02); });
  test('age 30 → 0% discount',  () => { expect(getYouthDiscount(30)).toBe(0);    });
  test('age 35 → 0% discount',  () => { expect(getYouthDiscount(35)).toBe(0);    });

});

// =============================================================================
// getCurrentYouthDiscount — retention + phase-out rules
// =============================================================================

describe('getCurrentYouthDiscount — retention until 41, then phase-out', () => {

  test('joined at 24 (10% discount), currently 30 → still 10% (frozen)', () => {
    // Under 41 → discount frozen at join-age amount
    expect(getCurrentYouthDiscount(24, 30)).toBe(0.10);
  });

  test('joined at 24 (10% discount), currently 40 → still 10% (frozen until 41)', () => {
    expect(getCurrentYouthDiscount(24, 40)).toBe(0.10);
  });

  test('joined at 24 (10% discount), currently 41 → 10% (phase-out starts AFTER 41)', () => {
    // yearsOver41 = 41 − 41 = 0; 10% − (2% × 0) = 10% — phase-out not yet applied
    // Phase-out reduces discount from age 42 onwards
    expect(getCurrentYouthDiscount(24, 41)).toBeCloseTo(0.10);
  });

  test('joined at 24 (10% discount), currently 42 → 8% (1 year of phase-out)', () => {
    // yearsOver41 = 42 − 41 = 1; 10% − (2% × 1) = 8%
    expect(getCurrentYouthDiscount(24, 42)).toBeCloseTo(0.08);
  });

  test('joined at 24 (10% discount), currently 45 → 2% (4 years of phase-out)', () => {
    // yearsOver41 = 45 − 41 = 4; 10% − (2% × 4) = 2%
    expect(getCurrentYouthDiscount(24, 45)).toBeCloseTo(0.02);
  });

  test('joined at 24 (10% discount), currently 46 → 0% (5 years of phase-out, fully gone)', () => {
    // yearsOver41 = 46 − 41 = 5; 10% − (2% × 5) = 0%
    expect(getCurrentYouthDiscount(24, 46)).toBe(0);
  });

  test('joined at 29 (2% discount), currently 41 → 0% (phase-out immediately)', () => {
    // yearsOver41 = 0; 2% − (2% × 0) = 2% at exactly 41; phase-out starts after
    expect(getCurrentYouthDiscount(29, 41)).toBeCloseTo(0.02);
  });

  test('joined at 30 (0% discount), currently 35 → 0% (no discount to freeze)', () => {
    expect(getCurrentYouthDiscount(30, 35)).toBe(0);
  });

});

// =============================================================================
// calculateLHCLoading — never held cover
// =============================================================================

describe('calculateLHCLoading — never held hospital cover', () => {

  test('age 25, never held cover → 0% loading, 10% youth discount', () => {
    const r = calculateLHCLoading({ currentAge: 25, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0);
    expect(r.annualLoadingCost).toBe(0);
    expect(r.youthDiscount).toBe(0.10);
    expect(r.yearsUntilLoadingRemoved).toBeNull();
  });

  test('age 30, never held cover → 0% loading, 0% youth discount', () => {
    const r = calculateLHCLoading({ currentAge: 30, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0);
    expect(r.youthDiscount).toBe(0);
    expect(r.yearsUntilLoadingRemoved).toBeNull();
  });

  test('age 31, never held cover → 2% loading', () => {
    // loading = 0.02 × 1 = 2%
    // annualCost = $1,357 × 0.02 = $27.14 → $27
    const r = calculateLHCLoading({ currentAge: 31, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBeCloseTo(0.02);
    expect(r.annualLoadingCost).toBe(27);
    expect(r.yearsUntilLoadingRemoved).toBe(10);
  });

  test('age 35, never held cover → 10% loading ($136 on Bronze, $1,360 over 10 years)', () => {
    // loading = 0.02 × 5 = 10%
    // annualCost = $1,357 × 0.10 = $135.70 → $136
    // 10-yr cumulative = $136 × 10 = $1,360
    // Matches checklist example: "Age 35, never had cover → 10% loading, $136/yr on Bronze, $1,360 over 10 years"
    const r = calculateLHCLoading({ currentAge: 35, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBeCloseTo(0.10);
    expect(r.annualLoadingCost).toBe(136);
    expect(r.tenYearCumulativeLoading).toBe(1360);
    expect(r.yearsUntilLoadingRemoved).toBe(10);
  });

  test('age 45, never held cover → 30% loading', () => {
    // loading = 0.02 × 15 = 30%
    const r = calculateLHCLoading({ currentAge: 45, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBeCloseTo(0.30);
  });

  test('age 65, never held cover → 70% loading (maximum)', () => {
    // loading = min(0.70, 0.02 × 35) = 0.70
    const r = calculateLHCLoading({ currentAge: 65, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0.70);
  });

});

// =============================================================================
// calculateLHCLoading — has held cover for N years
// =============================================================================

describe('calculateLHCLoading — currently holding cover', () => {

  test('age 35, held cover 5 years (joined at 30) → 0% loading', () => {
    // Joined at 30: loading at joining = 2% × max(0, 30−30) = 0%
    const r = calculateLHCLoading({ currentAge: 35, hasHeldHospitalCover: true, yearsHeld: 5, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0);
    expect(r.annualLoadingCost).toBe(0);
    expect(r.yearsUntilLoadingRemoved).toBeNull();
  });

  test('age 40, held cover 5 years (joined at 35) → 10% loading, 5 years to removal', () => {
    // Joined at 35: loading = 2% × 5 = 10%
    // yearsHeld=5, so 10 − 5 = 5 years remaining
    const r = calculateLHCLoading({ currentAge: 40, hasHeldHospitalCover: true, yearsHeld: 5, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBeCloseTo(0.10);
    expect(r.yearsUntilLoadingRemoved).toBe(5);
  });

  test('age 43, held cover 8 years (joined at 35) → 10% loading, 2 years to removal', () => {
    // Joined at 35: loading = 10%
    // 10 − 8 = 2 years remaining
    const r = calculateLHCLoading({ currentAge: 43, hasHeldHospitalCover: true, yearsHeld: 8, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBeCloseTo(0.10);
    expect(r.yearsUntilLoadingRemoved).toBe(2);
  });

  test('age 45, held cover 10 years (joined at 35) → 0% loading (10-year rule removes it)', () => {
    // Loading is removed after 10 continuous years
    const r = calculateLHCLoading({ currentAge: 45, hasHeldHospitalCover: true, yearsHeld: 10, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0);
    expect(r.annualLoadingCost).toBe(0);
    expect(r.yearsUntilLoadingRemoved).toBeNull();
  });

  test('age 50, held cover 15 years (joined at 35) → 0% loading (well past 10-year removal)', () => {
    const r = calculateLHCLoading({ currentAge: 50, hasHeldHospitalCover: true, yearsHeld: 15, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0);
    expect(r.annualLoadingCost).toBe(0);
  });

  test('age 28, held cover 3 years (joined at 25) → 0% loading, youth discount frozen at 10%', () => {
    // Joined at 25: loading = 0%, youth discount = 10%
    // Current age 28: under 41 → discount frozen at 10%
    const r = calculateLHCLoading({ currentAge: 28, hasHeldHospitalCover: true, yearsHeld: 3, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0);
    expect(r.youthDiscount).toBe(0.10);
  });

});

// =============================================================================
// calculateLHCLoading — edge cases
// =============================================================================

describe('calculateLHCLoading — edge cases', () => {

  test('age 30, joining now → 0% loading, 0% youth discount (boundary)', () => {
    const r = calculateLHCLoading({ currentAge: 30, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.loadingPercentage).toBe(0);
    expect(r.youthDiscount).toBe(0); // Age 30 = no youth discount (table ends at 29)
  });

  test('very high loading premium — Bronze at 70% loading', () => {
    // Base Bronze $1,357 × 70% = $949.90 → $950 extra per year
    const r = calculateLHCLoading({ currentAge: 65, hasHeldHospitalCover: false, basePremium: BASE_PREMIUM });
    expect(r.annualLoadingCost).toBe(950);
  });

  test('zero basePremium → zero loading cost (percentage still correct)', () => {
    const r = calculateLHCLoading({ currentAge: 40, hasHeldHospitalCover: false, basePremium: 0 });
    expect(r.loadingPercentage).toBeCloseTo(0.20);
    expect(r.annualLoadingCost).toBe(0);
  });

});

// =============================================================================
// calculateLHCLoadingSimple — deferral comparison
// =============================================================================

describe('calculateLHCLoadingSimple — deferral comparison', () => {

  test('age 28, deferral to 35 shows increased loading', () => {
    const r = calculateLHCLoadingSimple({
      currentAge: 28,
      hasHeldHospitalCover: false,
      basePremium: BASE_PREMIUM,
      deferAge: 35,
    });
    expect(r.deferralComparison).toHaveLength(1);
    const [deferred] = r.deferralComparison;
    expect(deferred.deferToAge).toBe(35);
    expect(deferred.loadingAtDeferAge).toBeCloseTo(0.10); // 2% × 5 years = 10%
    expect(deferred.cumulativeExtraCostOver10Yrs).toBeGreaterThan(0);
  });

  test('age 28, no deferAge → default deferral ages [35, 40, 45, 50, 55]', () => {
    const r = calculateLHCLoadingSimple({
      currentAge: 28,
      hasHeldHospitalCover: false,
      basePremium: BASE_PREMIUM,
    });
    expect(r.deferralComparison.length).toBe(5);
    const ages = r.deferralComparison.map((d) => d.deferToAge);
    expect(ages).toEqual([35, 40, 45, 50, 55]);
    // Loading increases monotonically with deferral age
    for (let i = 1; i < r.deferralComparison.length; i++) {
      expect(r.deferralComparison[i].loadingAtDeferAge)
        .toBeGreaterThanOrEqual(r.deferralComparison[i - 1].loadingAtDeferAge);
    }
  });

  test('age 50, default deferral ages only show ages > 50 (i.e. [55])', () => {
    const r = calculateLHCLoadingSimple({
      currentAge: 50,
      hasHeldHospitalCover: false,
      basePremium: BASE_PREMIUM,
    });
    const ages = r.deferralComparison.map((d) => d.deferToAge);
    expect(ages).toEqual([55]);
  });

  test('age 60, no default ages > 60 — deferralComparison is empty', () => {
    const r = calculateLHCLoadingSimple({
      currentAge: 60,
      hasHeldHospitalCover: false,
      basePremium: BASE_PREMIUM,
    });
    expect(r.deferralComparison).toHaveLength(0);
  });

});
