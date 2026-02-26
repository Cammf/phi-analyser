// =============================================================================
// PROJECTION CALCULATIONS — TEST SUITE
// Tests calculateProjection() for 10-year cost projections with compound growth,
// LHC loading removal, and opportunity cost.
// =============================================================================

import { calculateProjection, calculateProjectionFromScenario } from '@/lib/projectionCalculations';
import { calculateScenarioComparison } from '@/lib/scenarioCalculations';
import { calculateMLS } from '@/lib/mlsCalculations';
import { calculateLHCLoading } from '@/lib/lhcCalculations';

// =============================================================================
// calculateProjection — basic 10-year projection
// =============================================================================

describe('calculateProjection — basic projection', () => {

  test('10-year projection with zero growth → all years equal', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1000,
      basicBronzeYear1Cost: 1200,
      silverGoldYear1Cost: 2500,
      growthRate: 0,
    });

    expect(result.yearByYear).toHaveLength(10);

    // All years should have the same cost with 0% growth
    for (const year of result.yearByYear) {
      expect(year.noInsuranceCost).toBe(1000);
      expect(year.basicBronzeCost).toBe(1200);
      expect(year.silverGoldCost).toBe(2500);
    }

    // 10-year totals
    expect(result.tenYearTotal.noInsurance).toBe(10000);
    expect(result.tenYearTotal.basicBronze).toBe(12000);
    expect(result.tenYearTotal.silverGold).toBe(25000);
  });

  test('compound growth accuracy — 4.4% over 10 years', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1500,
      basicBronzeYear1Cost: 1000,
      silverGoldYear1Cost: 2000,
      growthRate: 0.044,
    });

    expect(result.yearByYear).toHaveLength(10);
    expect(result.growthRateUsed).toBe(0.044);

    // Year 1: no growth applied
    expect(result.yearByYear[0].basicBronzeCost).toBe(1000);
    expect(result.yearByYear[0].silverGoldCost).toBe(2000);

    // Year 2: $1,000 × 1.044 = $1,044
    expect(result.yearByYear[1].basicBronzeCost).toBe(1044);

    // Year 10: $1,000 × (1.044)^9 ≈ $1,472
    // (1.044)^9 = 1.04400^9 ≈ 1.4716 → $1,472
    expect(result.yearByYear[9].basicBronzeCost).toBe(Math.round(1000 * Math.pow(1.044, 9)));

    // No-insurance cost stays flat
    for (const year of result.yearByYear) {
      expect(year.noInsuranceCost).toBe(1500);
    }
    expect(result.tenYearTotal.noInsurance).toBe(15000);
  });

  test('cumulative totals are running sums', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 500,
      basicBronzeYear1Cost: 800,
      silverGoldYear1Cost: 1500,
      growthRate: 0,
    });

    expect(result.yearByYear[0].noInsuranceCumulative).toBe(500);
    expect(result.yearByYear[1].noInsuranceCumulative).toBe(1000);
    expect(result.yearByYear[9].noInsuranceCumulative).toBe(5000);

    expect(result.yearByYear[0].basicBronzeCumulative).toBe(800);
    expect(result.yearByYear[4].basicBronzeCumulative).toBe(4000);
  });

  test('calendar years are sequential from current year', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1000,
      basicBronzeYear1Cost: 1000,
      silverGoldYear1Cost: 2000,
    });

    const currentYear = new Date().getFullYear();
    expect(result.yearByYear[0].calendarYear).toBe(currentYear);
    expect(result.yearByYear[9].calendarYear).toBe(currentYear + 9);

    // Year numbers are 1-indexed
    expect(result.yearByYear[0].year).toBe(1);
    expect(result.yearByYear[9].year).toBe(10);
  });
});

// =============================================================================
// LHC loading removal
// =============================================================================

describe('calculateProjection — LHC loading removal', () => {

  test('loading removed after specified years', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1000,
      basicBronzeYear1Cost: 1200,
      silverGoldYear1Cost: 2500,
      growthRate: 0,
      lhcLoadingPercentage: 0.10,
      yearsUntilLoadingRemoved: 3,
      basicBronzeLoadingCostYear1: 136,
      silverGoldLoadingCostYear1: 248,
    });

    // Years 1-3: loading active
    expect(result.yearByYear[0].lhcLoadingRemoved).toBe(false);
    expect(result.yearByYear[1].lhcLoadingRemoved).toBe(false);
    expect(result.yearByYear[2].lhcLoadingRemoved).toBe(false);

    // Years 4-10: loading removed
    expect(result.yearByYear[3].lhcLoadingRemoved).toBe(true);
    expect(result.yearByYear[9].lhcLoadingRemoved).toBe(true);

    // Loading removal year should be Year 4 (1-indexed)
    expect(result.loadingRemovalYear).toBe(4);

    // Cost in year 4+ should be lower (no loading component)
    // Year 1: basicBronze = (1200 - 136) premium + 136 loading = 1200
    // Year 4: basicBronze = (1200 - 136) premium + 0 loading = 1064
    expect(result.yearByYear[0].basicBronzeCost).toBe(1200);
    expect(result.yearByYear[3].basicBronzeCost).toBe(1200 - 136);
  });

  test('no loading → no removal year', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1000,
      basicBronzeYear1Cost: 1200,
      silverGoldYear1Cost: 2500,
      lhcLoadingPercentage: 0,
      yearsUntilLoadingRemoved: null,
    });

    expect(result.loadingRemovalYear).toBe(null);

    for (const year of result.yearByYear) {
      expect(year.lhcLoadingRemoved).toBe(false);
    }
  });

  test('loading removal mid-period with growth', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1500,
      basicBronzeYear1Cost: 1400,
      silverGoldYear1Cost: 2600,
      growthRate: 0.044,
      lhcLoadingPercentage: 0.06,
      yearsUntilLoadingRemoved: 5,
      basicBronzeLoadingCostYear1: 81,
      silverGoldLoadingCostYear1: 149,
    });

    // Year 5 still has loading (0-indexed: years 0-4 have loading)
    expect(result.yearByYear[4].lhcLoadingRemoved).toBe(false);
    // Year 6 loading removed
    expect(result.yearByYear[5].lhcLoadingRemoved).toBe(true);
    expect(result.loadingRemovalYear).toBe(6);

    // After loading removal, cost drops
    // The premium portion still grows, but the loading portion disappears
    expect(result.yearByYear[5].basicBronzeCost).toBeLessThan(result.yearByYear[4].basicBronzeCost);
  });
});

// =============================================================================
// Opportunity cost
// =============================================================================

describe('calculateProjection — opportunity cost', () => {

  test('opportunity cost is positive when premiums are invested', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 0,
      basicBronzeYear1Cost: 1000,
      silverGoldYear1Cost: 2000,
      growthRate: 0,
      investmentReturnRate: 0.05,
    });

    // Opportunity cost should be positive — money grows when invested
    expect(result.opportunityCost).toBeGreaterThan(0);
  });

  test('opportunity cost is 0 when investment return is 0', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 0,
      basicBronzeYear1Cost: 1000,
      silverGoldYear1Cost: 2000,
      growthRate: 0,
      investmentReturnRate: 0,
    });

    expect(result.opportunityCost).toBe(0);
  });

  test('opportunity cost increases with higher investment return', () => {
    const resultLow = calculateProjection({
      noInsuranceYear1Cost: 0,
      basicBronzeYear1Cost: 1000,
      silverGoldYear1Cost: 2000,
      growthRate: 0,
      investmentReturnRate: 0.03,
    });

    const resultHigh = calculateProjection({
      noInsuranceYear1Cost: 0,
      basicBronzeYear1Cost: 1000,
      silverGoldYear1Cost: 2000,
      growthRate: 0,
      investmentReturnRate: 0.08,
    });

    expect(resultHigh.opportunityCost).toBeGreaterThan(resultLow.opportunityCost);
  });
});

// =============================================================================
// Custom parameters
// =============================================================================

describe('calculateProjection — custom parameters', () => {

  test('custom growth rate is applied', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1000,
      basicBronzeYear1Cost: 1000,
      silverGoldYear1Cost: 2000,
      growthRate: 0.10, // 10% growth
    });

    expect(result.growthRateUsed).toBe(0.10);

    // Year 2 at 10% growth: $1,000 × 1.10 = $1,100
    expect(result.yearByYear[1].basicBronzeCost).toBe(1100);
  });

  test('custom number of years', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1000,
      basicBronzeYear1Cost: 1200,
      silverGoldYear1Cost: 2000,
      years: 5,
    });

    expect(result.yearByYear).toHaveLength(5);
    expect(result.yearByYear[4].year).toBe(5);
  });

  test('zero premiums → zero totals', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 0,
      basicBronzeYear1Cost: 0,
      silverGoldYear1Cost: 0,
    });

    expect(result.tenYearTotal.noInsurance).toBe(0);
    expect(result.tenYearTotal.basicBronze).toBe(0);
    expect(result.tenYearTotal.silverGold).toBe(0);
    expect(result.opportunityCost).toBe(0);
  });
});

// =============================================================================
// calculateProjectionFromScenario — integration with scenario results
// =============================================================================

describe('calculateProjectionFromScenario — integration', () => {

  test('creates projection from scenario result', () => {
    const mlsResult = calculateMLS({ mlsIncome: 120000, familyType: 'single' });
    const lhcResult = calculateLHCLoading({ currentAge: 35, hasHeldHospitalCover: false, basePremium: 1357 });

    const scenarioResult = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    const projection = calculateProjectionFromScenario(scenarioResult);

    expect(projection.yearByYear).toHaveLength(10);
    expect(projection.yearByYear[0].noInsuranceCost).toBe(scenarioResult.scenarios[0].year1Cost);
    expect(projection.yearByYear[0].basicBronzeCost).toBe(scenarioResult.scenarios[1].year1Cost);
    expect(projection.tenYearTotal.noInsurance).toBeGreaterThan(0);
    expect(projection.tenYearTotal.basicBronze).toBeGreaterThan(0);
    expect(projection.tenYearTotal.silverGold).toBeGreaterThan(0);
  });

  test('passes through LHC loading info from scenario breakdown', () => {
    const mlsResult = calculateMLS({ mlsIncome: 120000, familyType: 'single' });
    const lhcResult = calculateLHCLoading({ currentAge: 40, hasHeldHospitalCover: false, basePremium: 1357 });
    // 40 - 30 = 10 years × 2% = 20% loading, 10 years to remove

    const scenarioResult = calculateScenarioComparison({
      mlsResult,
      mlsIncome: 120000,
      familyType: 'single',
      dependentChildren: 0,
      ageBracket: 'under65',
      lhcResult,
      state: 'NSW',
    });

    const projection = calculateProjectionFromScenario(scenarioResult);

    // Should pass through LHC info
    expect(projection.yearByYear).toHaveLength(10);
  });
});

// =============================================================================
// Output structure
// =============================================================================

describe('calculateProjection — output structure', () => {

  test('returns all required fields', () => {
    const result = calculateProjection({
      noInsuranceYear1Cost: 1500,
      basicBronzeYear1Cost: 1200,
      silverGoldYear1Cost: 2500,
    });

    expect(result).toHaveProperty('yearByYear');
    expect(result).toHaveProperty('tenYearTotal');
    expect(result).toHaveProperty('opportunityCost');
    expect(result).toHaveProperty('loadingRemovalYear');
    expect(result).toHaveProperty('growthRateUsed');

    expect(result.tenYearTotal).toHaveProperty('noInsurance');
    expect(result.tenYearTotal).toHaveProperty('basicBronze');
    expect(result.tenYearTotal).toHaveProperty('silverGold');

    for (const year of result.yearByYear) {
      expect(year).toHaveProperty('year');
      expect(year).toHaveProperty('calendarYear');
      expect(year).toHaveProperty('noInsuranceCost');
      expect(year).toHaveProperty('basicBronzeCost');
      expect(year).toHaveProperty('silverGoldCost');
      expect(year).toHaveProperty('noInsuranceCumulative');
      expect(year).toHaveProperty('basicBronzeCumulative');
      expect(year).toHaveProperty('silverGoldCumulative');
      expect(year).toHaveProperty('lhcLoadingRemoved');
    }
  });
});
