// =============================================================================
// REBATE CALCULATIONS — TEST SUITE
// FY 2025-26 | 4 tiers × 3 age brackets = 12 combinations tested
// Period 1 (Jul 2025–Mar 2026) is the default; Period 2 also tested.
// All expected values hand-calculated and annotated.
// =============================================================================

import { calculateRebate, getRebatePercentage } from '@/lib/rebateCalculations';

// Helper: rounds to 2 decimal places (to avoid floating-point noise in %checks)
const pct = (v: number) => Math.round(v * 10000) / 10000;

// =============================================================================
// calculateRebate — all 4 tiers × 3 age brackets (Period 1)
// =============================================================================

describe('calculateRebate — base tier rebate percentages (Period 1)', () => {

  const PREMIUM = 2000; // $2,000 base premium for all tests in this block

  test('base tier, under65: 24.288% → rebate $486, net $1,514', () => {
    // $2,000 × 0.24288 = $485.76 → Math.round → $486; net = $2,000 − $486 = $1,514
    const r = calculateRebate({ mlsIncome: 50000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: PREMIUM });
    expect(pct(r.rebatePercentage)).toBe(0.2429); // 24.288% rounded to 4dp
    expect(r.annualRebate).toBe(486);
    expect(r.premiumAfterRebate).toBe(1514);
    expect(r.tier).toBe('base');
  });

  test('base tier, age65to69: 28.337% → rebate $567, net $1,433', () => {
    // $2,000 × 0.28337 = $566.74 → $567; net = $1,433
    const r = calculateRebate({ mlsIncome: 50000, familyType: 'single', ageBracket: 'age65to69', annualPremiumBeforeRebate: PREMIUM });
    expect(pct(r.rebatePercentage)).toBe(0.2834);
    expect(r.annualRebate).toBe(567);
    expect(r.premiumAfterRebate).toBe(1433);
  });

  test('base tier, age70plus: 32.385% → rebate $648, net $1,352', () => {
    // $2,000 × 0.32385 = $647.70 → $648; net = $1,352
    const r = calculateRebate({ mlsIncome: 50000, familyType: 'single', ageBracket: 'age70plus', annualPremiumBeforeRebate: PREMIUM });
    expect(pct(r.rebatePercentage)).toBe(0.3239);
    expect(r.annualRebate).toBe(648);
    expect(r.premiumAfterRebate).toBe(1352);
  });

});

describe('calculateRebate — Tier 1 rebate percentages (Period 1)', () => {

  const PREMIUM = 2000;

  test('Tier 1, under65: 16.192% → rebate $324, net $1,676', () => {
    // $2,000 × 0.16192 = $323.84 → $324; net = $1,676
    const r = calculateRebate({ mlsIncome: 110000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: PREMIUM });
    expect(r.tier).toBe('1');
    expect(r.annualRebate).toBe(324);
    expect(r.premiumAfterRebate).toBe(1676);
  });

  test('Tier 1, age65to69: 20.240% → rebate $405, net $1,595', () => {
    // $2,000 × 0.20240 = $404.80 → $405; net = $1,595
    const r = calculateRebate({ mlsIncome: 110000, familyType: 'single', ageBracket: 'age65to69', annualPremiumBeforeRebate: PREMIUM });
    expect(r.annualRebate).toBe(405);
    expect(r.premiumAfterRebate).toBe(1595);
  });

  test('Tier 1, age70plus: 24.288% → rebate $486, net $1,514', () => {
    // $2,000 × 0.24288 = $485.76 → $486; net = $1,514
    const r = calculateRebate({ mlsIncome: 110000, familyType: 'single', ageBracket: 'age70plus', annualPremiumBeforeRebate: PREMIUM });
    expect(r.annualRebate).toBe(486);
    expect(r.premiumAfterRebate).toBe(1514);
  });

});

describe('calculateRebate — Tier 2 rebate percentages (Period 1)', () => {

  const PREMIUM = 2000;

  test('Tier 2, under65: 8.095% → rebate $162, net $1,838', () => {
    // $2,000 × 0.08095 = $161.90 → $162; net = $1,838
    const r = calculateRebate({ mlsIncome: 140000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: PREMIUM });
    expect(r.tier).toBe('2');
    expect(r.annualRebate).toBe(162);
    expect(r.premiumAfterRebate).toBe(1838);
  });

  test('Tier 2, age65to69: 12.143% → rebate $243, net $1,757', () => {
    // $2,000 × 0.12143 = $242.86 → $243; net = $1,757
    const r = calculateRebate({ mlsIncome: 140000, familyType: 'single', ageBracket: 'age65to69', annualPremiumBeforeRebate: PREMIUM });
    expect(r.annualRebate).toBe(243);
    expect(r.premiumAfterRebate).toBe(1757);
  });

  test('Tier 2, age70plus: 16.192% → rebate $324, net $1,676', () => {
    // $2,000 × 0.16192 = $323.84 → $324; net = $1,676
    const r = calculateRebate({ mlsIncome: 140000, familyType: 'single', ageBracket: 'age70plus', annualPremiumBeforeRebate: PREMIUM });
    expect(r.annualRebate).toBe(324);
    expect(r.premiumAfterRebate).toBe(1676);
  });

});

describe('calculateRebate — Tier 3: 0% rebate for all ages', () => {

  const PREMIUM = 3000;

  test('Tier 3, under65: 0% → rebate $0, net premium unchanged', () => {
    const r = calculateRebate({ mlsIncome: 200000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: PREMIUM });
    expect(r.tier).toBe('3');
    expect(r.rebatePercentage).toBe(0);
    expect(r.annualRebate).toBe(0);
    expect(r.premiumAfterRebate).toBe(PREMIUM);
  });

  test('Tier 3, age65to69: 0% rebate', () => {
    const r = calculateRebate({ mlsIncome: 200000, familyType: 'single', ageBracket: 'age65to69', annualPremiumBeforeRebate: PREMIUM });
    expect(r.rebatePercentage).toBe(0);
    expect(r.annualRebate).toBe(0);
  });

  test('Tier 3, age70plus: 0% rebate', () => {
    const r = calculateRebate({ mlsIncome: 200000, familyType: 'single', ageBracket: 'age70plus', annualPremiumBeforeRebate: PREMIUM });
    expect(r.rebatePercentage).toBe(0);
    expect(r.annualRebate).toBe(0);
  });

});

// =============================================================================
// calculateRebate — family thresholds
// =============================================================================

describe('calculateRebate — family income thresholds', () => {

  test('couple $202,000 → base tier rebate (24.288%)', () => {
    const r = calculateRebate({ mlsIncome: 202000, familyType: 'couple', ageBracket: 'under65', annualPremiumBeforeRebate: 2000 });
    expect(r.tier).toBe('base');
    expect(pct(r.rebatePercentage)).toBe(0.2429);
  });

  test('couple $202,001 → Tier 1 rebate (16.192%)', () => {
    const r = calculateRebate({ mlsIncome: 202001, familyType: 'couple', ageBracket: 'under65', annualPremiumBeforeRebate: 2000 });
    expect(r.tier).toBe('1');
    expect(pct(r.rebatePercentage)).toBe(0.1619);
  });

  test('family 2 children, $203,500 → base tier (threshold adjusted +$1,500)', () => {
    const r = calculateRebate({ mlsIncome: 203500, familyType: 'family', dependentChildren: 2, ageBracket: 'under65', annualPremiumBeforeRebate: 2000 });
    expect(r.tier).toBe('base');
  });

  test('family 2 children, $203,501 → Tier 1', () => {
    const r = calculateRebate({ mlsIncome: 203501, familyType: 'family', dependentChildren: 2, ageBracket: 'under65', annualPremiumBeforeRebate: 2000 });
    expect(r.tier).toBe('1');
  });

});

// =============================================================================
// calculateRebate — practical premium examples
// =============================================================================

describe('calculateRebate — practical examples', () => {

  test('Bronze single $1,357/yr, base tier, under65 → saves $329, pays $1,028', () => {
    // $1,357 × 0.24288 = $329.59 → $330; net = $1,357 − $330 = $1,027
    // (minor rounding: $1,357 × 0.24288 = 329.59 → rounds to 330; net = 1027)
    const r = calculateRebate({ mlsIncome: 80000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: 1357 });
    expect(r.tier).toBe('base');
    expect(r.annualRebate).toBe(330);
    expect(r.premiumAfterRebate).toBe(1027);
  });

  test('Gold family 2 adults $7,110/yr, base tier, under65 → saves $1,726, pays $5,384', () => {
    // Gold single $3,555 × 2 (family multiplier) = $7,110
    // $7,110 × 0.24288 = $1,726.87 → $1,727; net = $7,110 − $1,727 = $5,383
    const r = calculateRebate({ mlsIncome: 150000, familyType: 'couple', ageBracket: 'under65', annualPremiumBeforeRebate: 7110 });
    expect(r.tier).toBe('base');
    expect(r.annualRebate).toBe(1727);
    expect(r.premiumAfterRebate).toBe(5383);
  });

});

// =============================================================================
// calculateRebate — Period 2 rates
// =============================================================================

describe('calculateRebate — Period 2 rates (Apr–Jun 2026)', () => {

  test('Period 2 rates are slightly lower than Period 1', () => {
    const p1 = calculateRebate({ mlsIncome: 80000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: 2000, usePeriod2: false });
    const p2 = calculateRebate({ mlsIncome: 80000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: 2000, usePeriod2: true });
    // Period 2 base tier under65: 24.118% vs Period 1: 24.288%
    expect(p2.rebatePercentage).toBeLessThan(p1.rebatePercentage);
    expect(p2.annualRebate).toBeLessThanOrEqual(p1.annualRebate);
  });

  test('Period 2 base tier under65: 24.118% → $482 rebate on $2,000', () => {
    // $2,000 × 0.24118 = $482.36 → $482; net = $1,518
    const r = calculateRebate({ mlsIncome: 80000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: 2000, usePeriod2: true });
    expect(r.annualRebate).toBe(482);
    expect(r.premiumAfterRebate).toBe(1518);
  });

});

// =============================================================================
// getRebatePercentage — convenience helper
// =============================================================================

describe('getRebatePercentage', () => {

  test('base tier under65 → 0.24288', () => {
    expect(getRebatePercentage(80000, 'single', 'under65')).toBe(0.24288);
  });

  test('Tier 3 any age → 0', () => {
    expect(getRebatePercentage(200000, 'single', 'under65')).toBe(0);
    expect(getRebatePercentage(200000, 'single', 'age70plus')).toBe(0);
  });

});

// =============================================================================
// calculateRebate — breakdown
// =============================================================================

describe('calculateRebate — calculation breakdown', () => {

  test('breakdown contains all expected fields', () => {
    const r = calculateRebate({ mlsIncome: 110000, familyType: 'single', ageBracket: 'under65', annualPremiumBeforeRebate: 1500 });
    const bd = r.calculationBreakdown;
    expect(bd.mlsIncome).toBe(110000);
    expect(bd.tier).toBe('1');
    expect(bd.ageBracket).toBe('under65');
    expect(bd.rebatePercentage).toBe(0.16192);
    expect(bd.basePremium).toBe(1500);
    expect(bd.rebateDollars).toBe(r.annualRebate);
    expect(bd.premiumAfterRebate).toBe(r.premiumAfterRebate);
  });

});
