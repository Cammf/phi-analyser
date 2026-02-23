// =============================================================================
// MLS CALCULATIONS — TEST SUITE
// FY 2025-26 thresholds: singles $101k/$118k/$158k; families $202k/$236k/$316k
// All expected values hand-calculated and annotated below.
// =============================================================================

import { calculateMLS, calculateMLSvsInsurance } from '@/lib/mlsCalculations';

// =============================================================================
// calculateMLS — single thresholds
// =============================================================================

describe('calculateMLS — single thresholds (FY 2025-26)', () => {

  // ─── Base tier ─────────────────────────────────────────────────────────────

  test('single $0 → base tier, $0 MLS', () => {
    const r = calculateMLS({ mlsIncome: 0, familyType: 'single' });
    expect(r.tier).toBe('base');
    expect(r.annualMLS).toBe(0);
    expect(r.isAboveThreshold).toBe(false);
    expect(r.mlsRate).toBe(0);
    expect(r.nextThreshold).toBe(101001);
  });

  test('single $100,999 → base tier, $0 MLS', () => {
    // $100,999 < $101,000 base tier max — no MLS
    const r = calculateMLS({ mlsIncome: 100999, familyType: 'single' });
    expect(r.tier).toBe('base');
    expect(r.annualMLS).toBe(0);
    expect(r.isAboveThreshold).toBe(false);
  });

  test('single $101,000 → base tier (boundary inclusive), $0 MLS', () => {
    // $101,000 equals the base tier max — still no MLS
    const r = calculateMLS({ mlsIncome: 101000, familyType: 'single' });
    expect(r.tier).toBe('base');
    expect(r.annualMLS).toBe(0);
  });

  // ─── Tier 1 ────────────────────────────────────────────────────────────────

  test('single $101,001 → Tier 1, 1% MLS = $1,010', () => {
    // $101,001 × 0.01 = $1,010.01 → Math.round → $1,010
    const r = calculateMLS({ mlsIncome: 101001, familyType: 'single' });
    expect(r.tier).toBe('1');
    expect(r.mlsRate).toBe(0.01);
    expect(r.annualMLS).toBe(1010);
    expect(r.isAboveThreshold).toBe(true);
    expect(r.nextThreshold).toBe(118001);
  });

  test('single $110,000 → Tier 1, 1% MLS = $1,100', () => {
    // $110,000 × 0.01 = $1,100
    const r = calculateMLS({ mlsIncome: 110000, familyType: 'single' });
    expect(r.tier).toBe('1');
    expect(r.annualMLS).toBe(1100);
  });

  test('ATO official example: Tom $117,000 MLS income → Tier 1, $1,170', () => {
    // Source: ATO website example (taxable $90k + FBT $27k = $117k MLS income)
    // $117,000 is in Tier 1 ($101,001–$118,000), rate 1%
    // $117,000 × 0.01 = $1,170
    const r = calculateMLS({ mlsIncome: 117000, familyType: 'single' });
    expect(r.tier).toBe('1');
    expect(r.mlsRate).toBe(0.01);
    expect(r.annualMLS).toBe(1170);
  });

  test('single $118,000 → Tier 1 (upper boundary), $1,180 MLS', () => {
    // $118,000 is still Tier 1 (max $118,000)
    // $118,000 × 0.01 = $1,180
    const r = calculateMLS({ mlsIncome: 118000, familyType: 'single' });
    expect(r.tier).toBe('1');
    expect(r.annualMLS).toBe(1180);
    expect(r.nextThreshold).toBe(118001);
  });

  // ─── Tier 2 ────────────────────────────────────────────────────────────────

  test('single $118,001 → Tier 2, 1.25% MLS = $1,475', () => {
    // $118,001 × 0.0125 = $1,475.0125 → Math.round → $1,475
    const r = calculateMLS({ mlsIncome: 118001, familyType: 'single' });
    expect(r.tier).toBe('2');
    expect(r.mlsRate).toBe(0.0125);
    expect(r.annualMLS).toBe(1475);
    expect(r.nextThreshold).toBe(158001);
  });

  test('single $140,000 → Tier 2, 1.25% MLS = $1,750', () => {
    // $140,000 × 0.0125 = $1,750
    const r = calculateMLS({ mlsIncome: 140000, familyType: 'single' });
    expect(r.tier).toBe('2');
    expect(r.annualMLS).toBe(1750);
  });

  test('single $158,000 → Tier 2 (upper boundary), 1.25% MLS = $1,975', () => {
    // $158,000 × 0.0125 = $1,975
    const r = calculateMLS({ mlsIncome: 158000, familyType: 'single' });
    expect(r.tier).toBe('2');
    expect(r.annualMLS).toBe(1975);
  });

  // ─── Tier 3 ────────────────────────────────────────────────────────────────

  test('single $158,001 → Tier 3, 1.5% MLS = $2,370', () => {
    // $158,001 × 0.015 = $2,370.015 → Math.round → $2,370
    const r = calculateMLS({ mlsIncome: 158001, familyType: 'single' });
    expect(r.tier).toBe('3');
    expect(r.mlsRate).toBe(0.015);
    expect(r.annualMLS).toBe(2370);
    expect(r.nextThreshold).toBeNull();
  });

  test('single $200,000 → Tier 3, 1.5% MLS = $3,000', () => {
    // $200,000 × 0.015 = $3,000
    const r = calculateMLS({ mlsIncome: 200000, familyType: 'single' });
    expect(r.tier).toBe('3');
    expect(r.annualMLS).toBe(3000);
    expect(r.nextThreshold).toBeNull();
  });

  test('single $300,000 → Tier 3, 1.5% MLS = $4,500', () => {
    // $300,000 × 0.015 = $4,500
    const r = calculateMLS({ mlsIncome: 300000, familyType: 'single' });
    expect(r.tier).toBe('3');
    expect(r.annualMLS).toBe(4500);
  });

});

// =============================================================================
// calculateMLS — family thresholds
// =============================================================================

describe('calculateMLS — family thresholds (FY 2025-26)', () => {

  // ─── Base tier boundaries ──────────────────────────────────────────────────

  test('couple $202,000 → base tier, $0 MLS', () => {
    const r = calculateMLS({ mlsIncome: 202000, familyType: 'couple' });
    expect(r.tier).toBe('base');
    expect(r.annualMLS).toBe(0);
    expect(r.isAboveThreshold).toBe(false);
  });

  test('couple $202,001 → Tier 1, 1% MLS = $2,020', () => {
    // $202,001 × 0.01 = $2,020.01 → Math.round → $2,020
    const r = calculateMLS({ mlsIncome: 202001, familyType: 'couple' });
    expect(r.tier).toBe('1');
    expect(r.annualMLS).toBe(2020);
    expect(r.isAboveThreshold).toBe(true);
  });

  // ─── Tier 1/2 boundary ─────────────────────────────────────────────────────

  test('family $236,000 → Tier 1, 1% MLS = $2,360', () => {
    // $236,000 × 0.01 = $2,360
    const r = calculateMLS({ mlsIncome: 236000, familyType: 'family', dependentChildren: 1 });
    expect(r.tier).toBe('1');
    expect(r.annualMLS).toBe(2360);
  });

  test('family $236,001 → Tier 2, 1.25% MLS = $2,950', () => {
    // $236,001 × 0.0125 = $2,950.0125 → $2,950
    const r = calculateMLS({ mlsIncome: 236001, familyType: 'family', dependentChildren: 1 });
    expect(r.tier).toBe('2');
    expect(r.annualMLS).toBe(2950);
  });

  // ─── Tier 2/3 boundary ─────────────────────────────────────────────────────

  test('family $316,000 → Tier 2, 1.25% MLS = $3,950', () => {
    // $316,000 × 0.0125 = $3,950
    const r = calculateMLS({ mlsIncome: 316000, familyType: 'family', dependentChildren: 2 });
    expect(r.tier).toBe('2');
    expect(r.annualMLS).toBe(3950);
  });

  test('family $316,001 → Tier 3, 1.5% MLS = $4,740 (no children — unshifted boundary)', () => {
    // Base family Tier 2 max = $316,000; $316,001 crosses into Tier 3.
    // Using dependentChildren=0 to test the unshifted boundary.
    // With dependentChildren=2, threshold shifts +$1,500 → Tier 3 starts at $317,501.
    // $316,001 × 0.015 = $4,740.015 → $4,740
    const r = calculateMLS({ mlsIncome: 316001, familyType: 'family', dependentChildren: 0 });
    expect(r.tier).toBe('3');
    expect(r.annualMLS).toBe(4740);
    expect(r.nextThreshold).toBeNull();
  });

  // ─── Dependent child increment ─────────────────────────────────────────────

  test('family 0 children: same base threshold as couple ($202,000)', () => {
    const r = calculateMLS({ mlsIncome: 202000, familyType: 'family', dependentChildren: 0 });
    expect(r.tier).toBe('base');
    expect(r.annualMLS).toBe(0);
  });

  test('family 1 child: no increment — base threshold still $202,000', () => {
    // Increment only applies AFTER the first child
    const atThreshold = calculateMLS({ mlsIncome: 202000, familyType: 'family', dependentChildren: 1 });
    expect(atThreshold.tier).toBe('base');
    expect(atThreshold.annualMLS).toBe(0);

    const aboveThreshold = calculateMLS({ mlsIncome: 202001, familyType: 'family', dependentChildren: 1 });
    expect(aboveThreshold.tier).toBe('1');
  });

  test('family 2 children: base threshold = $203,500 ($202,000 + $1,500)', () => {
    // 2 children: extraChildren=1, increment = 1 × $1,500 = $1,500
    const atThreshold = calculateMLS({ mlsIncome: 203500, familyType: 'family', dependentChildren: 2 });
    expect(atThreshold.tier).toBe('base');
    expect(atThreshold.annualMLS).toBe(0);

    const justAbove = calculateMLS({ mlsIncome: 203501, familyType: 'family', dependentChildren: 2 });
    expect(justAbove.tier).toBe('1');
  });

  test('family 3 children: base threshold = $205,000 ($202,000 + $3,000)', () => {
    // 3 children: extraChildren=2, increment = 2 × $1,500 = $3,000
    // Matches checklist example: threshold = $202k + $1,500×2 = $205k
    const atThreshold = calculateMLS({ mlsIncome: 205000, familyType: 'family', dependentChildren: 3 });
    expect(atThreshold.tier).toBe('base');
    expect(atThreshold.annualMLS).toBe(0);

    const justAbove = calculateMLS({ mlsIncome: 205001, familyType: 'family', dependentChildren: 3 });
    expect(justAbove.tier).toBe('1');
  });

  test('family 4 children: base threshold = $206,500 ($202,000 + $4,500)', () => {
    // 4 children: extraChildren=3, increment = 3 × $1,500 = $4,500
    const atThreshold = calculateMLS({ mlsIncome: 206500, familyType: 'family', dependentChildren: 4 });
    expect(atThreshold.tier).toBe('base');

    const justAbove = calculateMLS({ mlsIncome: 206501, familyType: 'family', dependentChildren: 4 });
    expect(justAbove.tier).toBe('1');
  });

  // ─── Single-parent uses family thresholds ──────────────────────────────────

  test('single-parent uses family thresholds, not single thresholds', () => {
    // Single income of $150,000 would be Tier 3 on single thresholds ($158,001+)
    // but is base tier on family thresholds ($202,000 base max)
    const r = calculateMLS({ mlsIncome: 150000, familyType: 'single-parent', dependentChildren: 1 });
    expect(r.tier).toBe('base');
    expect(r.annualMLS).toBe(0);
  });

});

// =============================================================================
// calculateMLS — calculation breakdown
// =============================================================================

describe('calculateMLS — calculation breakdown', () => {

  test('breakdown contains correct values for single Tier 1', () => {
    const r = calculateMLS({ mlsIncome: 117000, familyType: 'single' });
    expect(r.calculationBreakdown.mlsIncome).toBe(117000);
    expect(r.calculationBreakdown.tier).toBe('1');
    expect(r.calculationBreakdown.rateApplied).toBe(0.01);
    expect(r.calculationBreakdown.familyThresholdUsed).toBe(0); // single — no family threshold
  });

  test('breakdown contains family threshold for couple', () => {
    const r = calculateMLS({ mlsIncome: 250000, familyType: 'couple' });
    expect(r.calculationBreakdown.familyThresholdUsed).toBe(202000); // base family max
  });

  test('breakdown family threshold reflects child increment for 2 children', () => {
    // 2 children: family base max shifts from $202,000 to $203,500
    const r = calculateMLS({ mlsIncome: 203000, familyType: 'family', dependentChildren: 2 });
    expect(r.calculationBreakdown.familyThresholdUsed).toBe(203500);
  });

});

// =============================================================================
// calculateMLSvsInsurance
// =============================================================================

describe('calculateMLSvsInsurance', () => {

  test('Tier 1 income — insurance cheaper than MLS (positive delta)', () => {
    // MLS: $115,000 × 1% = $1,150
    // Basic premium: $1,063 (no loading)
    // Rebate: $1,063 × 16.192% (Tier 1, under65) = $172 → net = $891
    // Delta: $1,150 − $891 = $259 (positive = insurance saves money)
    const r = calculateMLSvsInsurance({
      mlsIncome: 115000,
      familyType: 'single',
      ageBracket: 'under65',
    });
    expect(r.tier).toBe('1');
    expect(r.annualMLS).toBe(1150);
    expect(r.mlsVsInsuranceDelta).toBeGreaterThan(0);
  });

  test('below MLS threshold — no insurance is cheaper (negative delta)', () => {
    // MLS: $0 (base tier)
    // Net insurance cost ~$805 after rebate
    // Delta: $0 − $805 = −$805 (negative = no insurance is cheaper)
    const r = calculateMLSvsInsurance({
      mlsIncome: 80000,
      familyType: 'single',
      ageBracket: 'under65',
    });
    expect(r.tier).toBe('base');
    expect(r.annualMLS).toBe(0);
    expect(r.mlsVsInsuranceDelta).toBeLessThan(0);
  });

  test('LHC loading raises insurance cost, reducing delta', () => {
    const noLoading = calculateMLSvsInsurance({
      mlsIncome: 115000,
      familyType: 'single',
      ageBracket: 'under65',
      lhcLoadingPercentage: 0,
    });
    const withLoading = calculateMLSvsInsurance({
      mlsIncome: 115000,
      familyType: 'single',
      ageBracket: 'under65',
      lhcLoadingPercentage: 0.20,  // 20% loading
    });
    // Loading increases premium → reduces how much cheaper insurance is vs MLS
    expect(withLoading.cheapestBasicPremium).toBeGreaterThan(noLoading.cheapestBasicPremium);
    expect(withLoading.cheapestBasicAfterRebate).toBeGreaterThan(noLoading.cheapestBasicAfterRebate);
    expect(withLoading.mlsVsInsuranceDelta).toBeLessThan(noLoading.mlsVsInsuranceDelta);
  });

  test('Tier 3 income: 0% rebate, net premium = full (loaded) premium', () => {
    // Tier 3 → rebate = 0% → no reduction
    const r = calculateMLSvsInsurance({
      mlsIncome: 200000,
      familyType: 'single',
      ageBracket: 'under65',
    });
    expect(r.tier).toBe('3');
    expect(r.cheapestBasicPremium).toBe(r.cheapestBasicAfterRebate);
  });

  test('age 70+ receives higher rebate, reducing net insurance cost', () => {
    const under65 = calculateMLSvsInsurance({
      mlsIncome: 115000,
      familyType: 'single',
      ageBracket: 'under65',
    });
    const over70 = calculateMLSvsInsurance({
      mlsIncome: 115000,
      familyType: 'single',
      ageBracket: 'age70plus',
    });
    // 70+ rebate (24.288%) > under-65 rebate (16.192%) at Tier 1
    expect(over70.cheapestBasicAfterRebate).toBeLessThan(under65.cheapestBasicAfterRebate);
  });

  test('family type uses 2× premium estimate', () => {
    const single = calculateMLSvsInsurance({
      mlsIncome: 250000,
      familyType: 'single',
      ageBracket: 'under65',
    });
    const couple = calculateMLSvsInsurance({
      mlsIncome: 250000,
      familyType: 'couple',
      ageBracket: 'under65',
    });
    // Family premium = 2× single (before rebate) → couple net cost > single net cost
    expect(couple.cheapestBasicPremium).toBe(single.cheapestBasicPremium * 2);
  });

});
