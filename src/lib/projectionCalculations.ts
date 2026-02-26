// =============================================================================
// PROJECTION CALCULATIONS — Private Health Insurance Analyser
// 10-year year-by-year cost projection for all 3 scenarios
// =============================================================================

import type {
  ProjectionYear,
  ProjectionResult,
  ScenarioResult,
} from '@/lib/types';

// =============================================================================
// CONSTANTS
// =============================================================================

// Default growth rate for premiums (matches premiums/current.json projectionDefault)
const DEFAULT_GROWTH_RATE = 0.044;

// Default investment return rate for opportunity cost calculation
const DEFAULT_INVESTMENT_RETURN = 0.05;

// Default projection period
const DEFAULT_YEARS = 10;

// =============================================================================
// PUBLIC API
// =============================================================================

export interface CalculateProjectionParams {
  /** Year 1 costs from scenario comparison. */
  noInsuranceYear1Cost: number;
  basicBronzeYear1Cost: number;
  silverGoldYear1Cost: number;
  /** Annual premium growth rate (default 4.4%). Applies to insurance scenarios only. */
  growthRate?: number;
  /** LHC loading percentage (decimal, e.g. 0.10 = 10%). */
  lhcLoadingPercentage?: number;
  /** Years until loading is removed (null if no loading). */
  yearsUntilLoadingRemoved?: number | null;
  /** Annual LHC loading cost on Basic/Bronze in Year 1. */
  basicBronzeLoadingCostYear1?: number;
  /** Annual LHC loading cost on Silver/Gold in Year 1. */
  silverGoldLoadingCostYear1?: number;
  /** Investment return rate for opportunity cost (default 5%). */
  investmentReturnRate?: number;
  /** Number of years to project (default 10). */
  years?: number;
}

/**
 * Calculates a 10-year year-by-year cost projection for all 3 scenarios.
 *
 * Premiums grow at the specified growth rate (compound).
 * LHC loading is removed after the specified number of years.
 * No-insurance costs (MLS) are kept flat — MLS thresholds are indexed but
 * income growth is unknowable, so we project flat as a conservative estimate.
 *
 * Opportunity cost: the cumulative premiums paid for Silver/Gold, if instead
 * invested at the investment return rate, compounded annually.
 */
export function calculateProjection({
  noInsuranceYear1Cost,
  basicBronzeYear1Cost,
  silverGoldYear1Cost,
  growthRate = DEFAULT_GROWTH_RATE,
  lhcLoadingPercentage = 0,
  yearsUntilLoadingRemoved = null,
  basicBronzeLoadingCostYear1 = 0,
  silverGoldLoadingCostYear1 = 0,
  investmentReturnRate = DEFAULT_INVESTMENT_RETURN,
  years = DEFAULT_YEARS,
}: CalculateProjectionParams): ProjectionResult {
  const currentCalendarYear = new Date().getFullYear();
  const yearByYear: ProjectionYear[] = [];

  let noInsuranceCumulative = 0;
  let basicBronzeCumulative = 0;
  let silverGoldCumulative = 0;

  // Separate the premium portion (grows) from the loading portion (removed after N years)
  const basicBronzePremiumYear1 = basicBronzeYear1Cost - basicBronzeLoadingCostYear1;
  const silverGoldPremiumYear1 = silverGoldYear1Cost - silverGoldLoadingCostYear1;

  let loadingRemovalYear: number | null = null;

  for (let n = 0; n < years; n++) {
    const yearNumber = n + 1; // 1-indexed
    const calendarYear = currentCalendarYear + n;
    const growthFactor = Math.pow(1 + growthRate, n);

    // No-insurance: flat (MLS doesn't compound)
    const noInsuranceCost = noInsuranceYear1Cost;

    // Loading check: is loading still active this year?
    const loadingActive =
      lhcLoadingPercentage > 0 &&
      yearsUntilLoadingRemoved !== null &&
      n < yearsUntilLoadingRemoved;

    if (
      lhcLoadingPercentage > 0 &&
      yearsUntilLoadingRemoved !== null &&
      n === yearsUntilLoadingRemoved
    ) {
      loadingRemovalYear = yearNumber;
    }

    // Basic/Bronze: premium grows, loading is flat until removed
    const basicBronzePremium = Math.round(basicBronzePremiumYear1 * growthFactor);
    const basicBronzeLoading = loadingActive
      ? Math.round(basicBronzeLoadingCostYear1 * growthFactor)
      : 0;
    const basicBronzeCost = basicBronzePremium + basicBronzeLoading;

    // Silver/Gold: premium grows, loading is flat until removed
    const silverGoldPremium = Math.round(silverGoldPremiumYear1 * growthFactor);
    const silverGoldLoading = loadingActive
      ? Math.round(silverGoldLoadingCostYear1 * growthFactor)
      : 0;
    const silverGoldCost = silverGoldPremium + silverGoldLoading;

    noInsuranceCumulative += noInsuranceCost;
    basicBronzeCumulative += basicBronzeCost;
    silverGoldCumulative += silverGoldCost;

    yearByYear.push({
      year: yearNumber,
      calendarYear,
      noInsuranceCost,
      basicBronzeCost,
      silverGoldCost,
      noInsuranceCumulative,
      basicBronzeCumulative,
      silverGoldCumulative,
      lhcLoadingRemoved:
        lhcLoadingPercentage > 0 &&
        yearsUntilLoadingRemoved !== null &&
        n >= yearsUntilLoadingRemoved,
    });
  }

  // Opportunity cost: if the annual Silver/Gold premiums were invested instead
  // Uses future value of annuity formula: sum of each year's premium compounded
  let opportunityCost = 0;
  for (let n = 0; n < years; n++) {
    const yearCost = yearByYear[n].silverGoldCost;
    const yearsToCompound = years - n - 1;
    opportunityCost += yearCost * Math.pow(1 + investmentReturnRate, yearsToCompound);
  }
  opportunityCost = Math.round(opportunityCost - silverGoldCumulative);

  return {
    yearByYear,
    tenYearTotal: {
      noInsurance: noInsuranceCumulative,
      basicBronze: basicBronzeCumulative,
      silverGold: silverGoldCumulative,
    },
    opportunityCost,
    loadingRemovalYear,
    growthRateUsed: growthRate,
  };
}

/**
 * Convenience function: creates projection directly from a ScenarioResult.
 * Extracts year 1 costs from scenario comparison output.
 */
export function calculateProjectionFromScenario(
  scenarioResult: ScenarioResult,
  options?: Partial<Omit<CalculateProjectionParams, 'noInsuranceYear1Cost' | 'basicBronzeYear1Cost' | 'silverGoldYear1Cost'>>,
): ProjectionResult {
  const [noIns, basicBronze, silverGold] = scenarioResult.scenarios;

  return calculateProjection({
    noInsuranceYear1Cost: noIns.year1Cost,
    basicBronzeYear1Cost: basicBronze.year1Cost,
    silverGoldYear1Cost: silverGold.year1Cost,
    lhcLoadingPercentage: scenarioResult.calculationBreakdown.lhcResult.loadingPercentage,
    yearsUntilLoadingRemoved: scenarioResult.calculationBreakdown.lhcResult.yearsUntilLoadingRemoved,
    ...options,
  });
}
