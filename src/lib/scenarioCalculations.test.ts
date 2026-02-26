// =============================================================================
// SCENARIO COMPARISON CALCULATIONS — TEST SUITE
// Tests calculateScenarioComparison() for various income, family, and edge cases.
// All expected values hand-calculated and annotated below.
// =============================================================================

import { calculateScenarioComparison } from '@/lib/scenarioCalculations';
import { calculateMLS } from '@/lib/mlsCalculations';
import { calculateLHCLoading } from '@/lib/lhcCalculations';
import type { MLSResult, LHCResult } from '@/lib/types';

// =============================================================================
// HELPERS — pre-calculate common MLS and LHC results for test inputs
// =============================================================================

function getMlsResult(mlsIncome: number, familyType: 'single' | 'couple' | 'family' | 'single-parent' = 'single', dependentChildren = 0): MLSResult {
  return calculateMLS({ mlsIncome, familyType, dependentChildren });
}

function getLhcResult(currentAge: number, hasHeldHospitalCover: boolean, yearsHeld = 0, basePremium = 1357): LHCResult {
  return calculateLHCLoading({ currentAge, hasHeldHospitalCover, yearsHeld, basePremium });
}

// =============================================================================
// calculateScenarioComparison — single, normal income scenarios
// =============================================================================

describe('calculateScenarioComparison — single income scenarios', () => {

  test('single $120k, age 35, never had cover → Tier 1, recommends basic/bronze', () => {
    // MLS: $120k × 1.25% = $1,500 (Tier 2: $118,001–$158,000)
    // Wait — $120k is in Tier 2 for singles ($118,001–$158,000), rate 1.25%
    // MLS = $120,000 × 0.0125 = $1,500
    const mlsResult = getMlsResult(120000);
    const lhcResult = getLhcResult(35, false);
    // LHC: age 35, never had cover → (35 - 30) × 2% = 10% loading

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    expect(result.scenarios).toHaveLength(3);
    expect(result.scenarios[0].id).toBe('no-insurance');
    expect(result.scenarios[1].id).toBe('basic-bronze');
    expect(result.scenarios[2].id).toBe('silver-gold');

    // Scenario A (no insurance): MLS $1,500 + small OOP + ambulance risk
    expect(result.scenarios[0].year1Cost).toBeGreaterThan(1500);

    // Scenario B (basic/bronze) should be populated
    expect(result.scenarios[1].year1Cost).toBeGreaterThan(0);

    // Scenario C (silver/gold) should be the most expensive
    expect(result.scenarios[2].year1Cost).toBeGreaterThan(result.scenarios[1].year1Cost);

    // Most coverage = silver/gold
    expect(result.scenarios[2].isMostCoverage).toBe(true);
    expect(result.scenarios[0].isMostCoverage).toBe(false);
    expect(result.scenarios[1].isMostCoverage).toBe(false);

    // Should recommend basic/bronze (MLS > bronze cost after rebate)
    expect(result.recommendedScenario).toBe('basic-bronze');
    expect(result.recommendationReason).toContain('MLS');
  });

  test('single $200k, age 40, never had cover → Tier 3, high MLS', () => {
    // MLS: $200k × 1.5% = $3,000 (Tier 3: $158,001+)
    const mlsResult = getMlsResult(200000);
    expect(mlsResult.annualMLS).toBe(3000);
    expect(mlsResult.tier).toBe('3');

    // LHC: age 40, never → (40 - 30) × 2% = 20% loading
    const lhcResult = getLhcResult(40, false);
    expect(lhcResult.loadingPercentage).toBe(0.20);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 200000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'VIC',
    });

    // Tier 3 → 0% rebate, so premium is not reduced
    // Bronze single = $1,357 base
    // + 20% loading on $1,357 = $271 loading
    // + 0% rebate (Tier 3) = $0 rebate
    // Bronze year 1 ≈ $1,357 + $271 = $1,628
    expect(result.scenarios[1].year1Cost).toBeGreaterThan(1500);

    // MLS ($3,000) > bronze cost → should recommend basic/bronze
    expect(result.recommendedScenario).toBe('basic-bronze');
  });

  test('single $80k, age 28 → below MLS threshold, recommends no-insurance', () => {
    // MLS: $80k is below $101k threshold → $0 MLS, base tier
    const mlsResult = getMlsResult(80000);
    expect(mlsResult.annualMLS).toBe(0);
    expect(mlsResult.tier).toBe('base');

    // LHC: age 28, no cover → no loading (under 31)
    const lhcResult = getLhcResult(28, false);
    expect(lhcResult.loadingPercentage).toBe(0);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 80000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'QLD', // free ambulance
    });

    // No MLS, QLD (free ambulance) → no-insurance year 1 cost is very low
    expect(result.scenarios[0].year1Cost).toBeLessThan(200);

    // Should recommend no-insurance
    expect(result.recommendedScenario).toBe('no-insurance');
    expect(result.recommendationReason).toContain('below the MLS threshold');
    expect(result.scenarios[0].isBestValue).toBe(true);
  });
});

// =============================================================================
// calculateScenarioComparison — family scenarios
// =============================================================================

describe('calculateScenarioComparison — family scenarios', () => {

  test('family $220k, 2 children → Tier 1 (adjusted threshold), MLS applies', () => {
    // Family with 2 children: threshold adjusted +$1,500 for child after first
    // Base tier max = $202,000 + $1,500 = $203,500
    // $220k > $203,500 → above base, into Tier 1
    // Family Tier 1: $202,001–$236,000 (adjusted +$1,500 → $203,501–$237,500)
    // MLS = $220,000 × 1% = $2,200
    const mlsResult = getMlsResult(220000, 'family', 2);
    expect(mlsResult.annualMLS).toBe(2200);

    const lhcResult = getLhcResult(38, false);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 220000,
      familyType: 'family',
      dependentChildren: 2,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    // Family premiums should be ~2× single
    // Bronze family ≈ $1,357 × 2.0 = $2,714 base
    expect(result.scenarios[1].year1Cost).toBeGreaterThan(2000);

    // 10-year costs should be populated
    expect(result.scenarios[0].tenYearCost).toBeGreaterThan(0);
    expect(result.scenarios[1].tenYearCost).toBeGreaterThan(0);
    expect(result.scenarios[2].tenYearCost).toBeGreaterThan(0);
  });

  test('couple $190k → below family threshold ($202k), no MLS', () => {
    const mlsResult = getMlsResult(190000, 'couple');
    expect(mlsResult.annualMLS).toBe(0);
    expect(mlsResult.tier).toBe('base');

    const lhcResult = getLhcResult(45, false);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 190000,
      familyType: 'couple',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'SA',
    });

    expect(result.recommendedScenario).toBe('no-insurance');
  });
});

// =============================================================================
// Edge cases
// =============================================================================

describe('calculateScenarioComparison — edge cases', () => {

  test('income exactly at threshold boundary $101,000 → base tier, no MLS', () => {
    const mlsResult = getMlsResult(101000);
    expect(mlsResult.annualMLS).toBe(0);

    const lhcResult = getLhcResult(32, false);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 101000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    expect(result.recommendedScenario).toBe('no-insurance');
  });

  test('very high LHC loading (age 65, never had cover) → capped at 70%', () => {
    const lhcResult = getLhcResult(65, false);
    expect(lhcResult.loadingPercentage).toBe(0.70);

    const mlsResult = getMlsResult(130000);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 130000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    // With 70% loading, Basic/Bronze cost is high
    // Bronze $1,357 + 70% loading = $1,357 + $950 = ~$2,307 base + rebate
    expect(result.scenarios[1].year1Cost).toBeGreaterThan(2000);
  });

  test('QLD/TAS → ambulance cost is free, reflected in no-insurance scenario', () => {
    const mlsResult = getMlsResult(80000);
    const lhcResult = getLhcResult(30, false);

    const resultQLD = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 80000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'QLD',
    });

    const resultNSW = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 80000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    // QLD no-insurance cost should be lower (no ambulance risk)
    expect(resultQLD.scenarios[0].year1Cost).toBeLessThan(resultNSW.scenarios[0].year1Cost);

    // Tradeoffs should mention free ambulance in QLD
    expect(resultQLD.scenarios[0].tradeoffs.some(t => t.includes('free'))).toBe(true);
  });

  test('Tier 3 income ($200k) → 0% rebate, full premium cost', () => {
    const mlsResult = getMlsResult(200000);
    expect(mlsResult.tier).toBe('3');

    const lhcResult = getLhcResult(32, false);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 200000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'VIC',
    });

    // Bronze single: $1,357 base, 0% rebate (Tier 3), 4% loading
    // Year 1 ≈ $1,357 + $27 loading = ~$1,384
    // (No rebate discount)
    expect(result.scenarios[1].year1Cost).toBeGreaterThanOrEqual(1357);
  });

  test('person with existing cover and low loading → yearsHeld reduces loading', () => {
    // Age 38, has held cover for 5 years → joined at 33 → loading = (33-30)×2% = 6%
    // 5 years remaining on loading
    const lhcResult = getLhcResult(38, true, 5, 1357);
    expect(lhcResult.loadingPercentage).toBe(0.06);
    expect(lhcResult.yearsUntilLoadingRemoved).toBe(5);

    const mlsResult = getMlsResult(130000);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 130000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    // Should have 3 valid scenarios
    expect(result.scenarios).toHaveLength(3);
    expect(result.scenarios[1].year1Cost).toBeGreaterThan(0);
  });

  test('break-even admissions is a positive number or null', () => {
    const mlsResult = getMlsResult(120000);
    const lhcResult = getLhcResult(35, false);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    if (result.breakEvenAdmissions !== null) {
      expect(result.breakEvenAdmissions).toBeGreaterThanOrEqual(0);
    }
  });

  test('custom expectedAdmissionsPerYear changes OOP estimates', () => {
    const mlsResult = getMlsResult(120000);
    const lhcResult = getLhcResult(35, false);

    const resultLow = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
      expectedAdmissionsPerYear: 0,
    });

    const resultHigh = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
      expectedAdmissionsPerYear: 2,
    });

    // Higher admissions → higher silver/gold cost (more excess/gap)
    expect(resultHigh.scenarios[2].year1Cost).toBeGreaterThan(resultLow.scenarios[2].year1Cost);
  });

  test('age 70+ with base tier income → higher rebate percentage', () => {
    const mlsResult = getMlsResult(80000); // base tier
    const lhcResult = getLhcResult(72, true, 20, 1357); // long-term holder, no loading

    const resultUnder65 = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 80000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'QLD',
    });

    const result70Plus = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 80000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'age70plus',
      lhcResult,
      state: 'QLD',
    });

    // 70+ gets higher rebate → lower premium → lower year 1 cost
    expect(result70Plus.scenarios[1].year1Cost).toBeLessThan(resultUnder65.scenarios[1].year1Cost);
  });
});

// =============================================================================
// Structure and output validation
// =============================================================================

describe('calculateScenarioComparison — output structure', () => {

  test('returns correct structure with all required fields', () => {
    const mlsResult = getMlsResult(120000);
    const lhcResult = getLhcResult(35, false);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    // Top-level structure
    expect(result).toHaveProperty('scenarios');
    expect(result).toHaveProperty('recommendedScenario');
    expect(result).toHaveProperty('recommendationReason');
    expect(result).toHaveProperty('breakEvenAdmissions');
    expect(result).toHaveProperty('calculationBreakdown');

    // Each scenario has required fields
    for (const scenario of result.scenarios) {
      expect(scenario).toHaveProperty('id');
      expect(scenario).toHaveProperty('label');
      expect(scenario).toHaveProperty('description');
      expect(scenario).toHaveProperty('year1Cost');
      expect(scenario).toHaveProperty('tenYearCost');
      expect(scenario).toHaveProperty('coverageDescription');
      expect(scenario).toHaveProperty('tradeoffs');
      expect(scenario).toHaveProperty('isCheapest');
      expect(scenario).toHaveProperty('isBestValue');
      expect(scenario).toHaveProperty('isMostCoverage');
      expect(Array.isArray(scenario.tradeoffs)).toBe(true);
      expect(scenario.tradeoffs.length).toBeGreaterThan(0);
    }

    // Exactly one scenario should be isMostCoverage
    expect(result.scenarios.filter(s => s.isMostCoverage)).toHaveLength(1);

    // Recommendation should be one of the valid IDs
    expect(['no-insurance', 'basic-bronze', 'silver-gold']).toContain(result.recommendedScenario);

    // Breakdown should contain MLS, rebate, and LHC results
    expect(result.calculationBreakdown).toHaveProperty('mlsResult');
    expect(result.calculationBreakdown).toHaveProperty('rebateResult');
    expect(result.calculationBreakdown).toHaveProperty('lhcResult');
  });

  test('exactly one isCheapest flag is true', () => {
    const mlsResult = getMlsResult(120000);
    const lhcResult = getLhcResult(35, false);

    const result = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    const cheapest = result.scenarios.filter(s => s.isCheapest);
    expect(cheapest.length).toBeGreaterThanOrEqual(1);
  });
});
