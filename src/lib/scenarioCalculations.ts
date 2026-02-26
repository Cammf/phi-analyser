// =============================================================================
// SCENARIO COMPARISON CALCULATIONS — Private Health Insurance Analyser
// Compares 3 scenarios: No Insurance, Basic/Bronze, Silver/Gold
// =============================================================================

import type {
  FamilyType,
  AgeBracket,
  State,
  MLSResult,
  RebateResult,
  LHCResult,
  ScenarioOption,
  ScenarioResult,
  ScenarioCalculationBreakdown,
} from '@/lib/types';
import {
  HOSPITAL_PREMIUMS_SINGLE,
  FAMILY_PREMIUM_MULTIPLIERS,
  resolveAmbulanceInfo,
} from '@/lib/resolveInputs';
import { calculateRebate } from '@/lib/rebateCalculations';

// =============================================================================
// CONSTANTS
// =============================================================================

// Average gap fee per hospital admission (APRA, verified 2026-02-23)
const AVERAGE_GAP_PER_ADMISSION = 478;

// Estimated out-of-pocket per hospital admission without insurance (public system)
// Based on ABS/AIHW data — public patients may still incur some costs (parking, extras)
const PUBLIC_OOP_PER_ADMISSION_ESTIMATE = 150;

// Typical excess (front-end deductible) for a standard policy
const TYPICAL_EXCESS_BASIC_BRONZE = 750;
const TYPICAL_EXCESS_SILVER_GOLD = 500;

// Average hospital admissions per year for a typical adult
// Source: AIHW 2023-24 — ~0.4 admissions/person/year across all ages
const AVG_ADMISSIONS_PER_YEAR = 0.4;

// Premium growth rate default (matches premiums/current.json projectionDefault)
const DEFAULT_GROWTH_RATE = 0.044;

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/**
 * Returns the base annual hospital premium for a given tier category and family type.
 * Basic/Bronze scenario uses bronze; Silver/Gold scenario uses silver.
 */
function getBasePremium(
  tier: 'basic' | 'bronze' | 'silver' | 'gold',
  familyType: FamilyType,
): number {
  const single = HOSPITAL_PREMIUMS_SINGLE[tier];
  return Math.round(single * FAMILY_PREMIUM_MULTIPLIERS[familyType]);
}

/**
 * Calculates a simple 10-year total with compound growth.
 * Formula: sum of year1Cost × (1 + growthRate)^(n-1) for n = 1..10
 */
function tenYearCompoundTotal(year1Cost: number, growthRate: number): number {
  let total = 0;
  for (let n = 0; n < 10; n++) {
    total += year1Cost * Math.pow(1 + growthRate, n);
  }
  return Math.round(total);
}

// =============================================================================
// PUBLIC API
// =============================================================================

export interface CalculateScenarioParams {
  /** MLS calculation result for this user. */
  mlsResult: MLSResult;
  /** Rebate tier and age bracket info (used to compute rebate on each tier). */
  mlsIncome: number;
  familyType: FamilyType;
  dependentChildren: number;
  ageBracket: AgeBracket;
  /** LHC loading result. */
  lhcResult: LHCResult;
  /** User's state — determines ambulance risk cost. */
  state: State;
  /** Expected hospital admissions per year (default 0.4). */
  expectedAdmissionsPerYear?: number;
  /** Premium growth rate for 10-year projection (default 4.4%). */
  growthRate?: number;
}

/**
 * Compares 3 scenarios for the flagship "Should I Get PHI?" calculator:
 *
 * (A) No Insurance — annual MLS + estimated out-of-pocket + ambulance risk
 * (B) Basic/Bronze — premium after rebate + LHC loading, MLS saving, limited coverage
 * (C) Silver/Gold  — premium after rebate + LHC loading + estimated excess + gap fees
 *
 * Returns 3 ScenarioOption objects with year 1 cost, 10-year cost, coverage
 * description, tradeoffs, and a recommendation.
 */
export function calculateScenarioComparison({
  mlsResult,
  mlsIncome,
  familyType,
  dependentChildren,
  ageBracket,
  lhcResult,
  state,
  expectedAdmissionsPerYear = AVG_ADMISSIONS_PER_YEAR,
  growthRate = DEFAULT_GROWTH_RATE,
}: CalculateScenarioParams): ScenarioResult {
  const ambulanceInfo = resolveAmbulanceInfo(state);

  // ─── Scenario A: No Insurance ──────────────────────────────────────────────
  const annualMLS = mlsResult.annualMLS;
  const estimatedOOP = Math.round(PUBLIC_OOP_PER_ADMISSION_ESTIMATE * expectedAdmissionsPerYear);
  // Ambulance risk: annualised cost = typical emergency cost × probability (~2% per year)
  const ambulanceRiskAnnualised = ambulanceInfo.isFree
    ? 0
    : Math.round(ambulanceInfo.typicalEmergencyCost * 0.02);
  const noInsuranceYear1 = annualMLS + estimatedOOP + ambulanceRiskAnnualised;
  // MLS thresholds don't grow with premiums — use flat cost for 10-year
  const noInsurance10Year = noInsuranceYear1 * 10;

  // ─── Scenario B: Basic/Bronze ──────────────────────────────────────────────
  const bronzeBase = getBasePremium('bronze', familyType);
  const bronzeRebate = calculateRebate({
    mlsIncome,
    familyType,
    dependentChildren,
    ageBracket,
    annualPremiumBeforeRebate: bronzeBase,
  });
  const bronzePremiumAfterRebate = bronzeRebate.premiumAfterRebate;
  const bronzeLoadingCost = Math.round(bronzeBase * lhcResult.loadingPercentage);
  const bronzeYear1 = bronzePremiumAfterRebate + bronzeLoadingCost;
  const bronze10Year = tenYearCompoundTotal(bronzeYear1, growthRate);

  // ─── Scenario C: Silver/Gold ───────────────────────────────────────────────
  const silverBase = getBasePremium('silver', familyType);
  const silverRebate = calculateRebate({
    mlsIncome,
    familyType,
    dependentChildren,
    ageBracket,
    annualPremiumBeforeRebate: silverBase,
  });
  const silverPremiumAfterRebate = silverRebate.premiumAfterRebate;
  const silverLoadingCost = Math.round(silverBase * lhcResult.loadingPercentage);
  // Estimated annual excess + gap costs based on expected admissions
  const estimatedExcessGap = Math.round(
    expectedAdmissionsPerYear * (TYPICAL_EXCESS_SILVER_GOLD + AVERAGE_GAP_PER_ADMISSION),
  );
  const silverGoldYear1 = silverPremiumAfterRebate + silverLoadingCost + estimatedExcessGap;
  const silverGold10Year = tenYearCompoundTotal(
    silverPremiumAfterRebate + silverLoadingCost,
    growthRate,
  ) + Math.round(estimatedExcessGap * 10);

  // ─── Determine badges ──────────────────────────────────────────────────────
  const year1Costs = [noInsuranceYear1, bronzeYear1, silverGoldYear1];
  const minYear1 = Math.min(...year1Costs);

  // ─── Build scenario options ────────────────────────────────────────────────
  const scenarioA: ScenarioOption = {
    id: 'no-insurance',
    label: 'No Insurance',
    description: 'Medicare only — rely on the public hospital system',
    year1Cost: noInsuranceYear1,
    tenYearCost: noInsurance10Year,
    coverageDescription: 'Medicare covers all public hospital treatment at no cost. You join the public waiting list and are treated by the assigned doctor. No choice of doctor, shared ward, full public wait times.',
    tradeoffs: [
      `Annual MLS: $${annualMLS.toLocaleString()}`,
      'Full public hospital waiting times',
      ambulanceInfo.isFree
        ? `Ambulance: free in ${state}`
        : `Ambulance risk: ~$${ambulanceInfo.typicalEmergencyCost.toLocaleString()} per emergency`,
      'No cover for private hospital or extras services',
      'No out-of-pocket for public hospital treatment',
    ],
    isCheapest: noInsuranceYear1 === minYear1,
    isBestValue: false, // set below
    isMostCoverage: false,
  };

  const scenarioB: ScenarioOption = {
    id: 'basic-bronze',
    label: 'Basic / Bronze',
    description: 'Limited hospital cover — primarily a tax-saving strategy',
    year1Cost: bronzeYear1,
    tenYearCost: bronze10Year,
    coverageDescription: 'Covers rehabilitation, psychiatric, and palliative care. Bronze adds some additional hospital services but restricts many elective procedures. Essentially a tax product to avoid the MLS.',
    tradeoffs: [
      `Annual premium (after rebate): $${bronzePremiumAfterRebate.toLocaleString()}`,
      annualMLS > 0 ? `Saves $${annualMLS.toLocaleString()}/yr in MLS` : 'No MLS saving (income below threshold)',
      lhcResult.loadingPercentage > 0
        ? `LHC loading adds $${bronzeLoadingCost.toLocaleString()}/yr (${Math.round(lhcResult.loadingPercentage * 100)}%)`
        : 'No LHC loading',
      'Very limited hospital coverage',
      `$${TYPICAL_EXCESS_BASIC_BRONZE} excess per admission`,
    ],
    isCheapest: bronzeYear1 === minYear1,
    isBestValue: false, // set below
    isMostCoverage: false,
  };

  const scenarioC: ScenarioOption = {
    id: 'silver-gold',
    label: 'Silver / Gold',
    description: 'Comprehensive hospital cover — choice, shorter waits, full coverage',
    year1Cost: silverGoldYear1,
    tenYearCost: silverGold10Year,
    coverageDescription: 'Covers most or all hospital services including cardiac, joint replacements, pregnancy (Gold), and psychiatric care. Choose your doctor, private room, and shorter waiting times.',
    tradeoffs: [
      `Annual premium (after rebate): $${silverPremiumAfterRebate.toLocaleString()}`,
      annualMLS > 0 ? `Saves $${annualMLS.toLocaleString()}/yr in MLS` : 'No MLS saving (income below threshold)',
      lhcResult.loadingPercentage > 0
        ? `LHC loading adds $${silverLoadingCost.toLocaleString()}/yr (${Math.round(lhcResult.loadingPercentage * 100)}%)`
        : 'No LHC loading',
      `Est. excess + gap: ~$${estimatedExcessGap.toLocaleString()}/yr`,
      'Choice of doctor, private room, shorter waits',
      'Full hospital coverage (Gold covers everything)',
    ],
    isCheapest: silverGoldYear1 === minYear1,
    isBestValue: false, // set below
    isMostCoverage: true,
  };

  // ─── Best value logic ──────────────────────────────────────────────────────
  // "Best value" = the scenario that balances cost and coverage most effectively
  // If income is below MLS threshold: no-insurance is best value (no tax penalty, no premium)
  // If MLS > bronze premium: basic/bronze is best value (saves tax for less than MLS cost)
  // Otherwise: depends on coverage needs — default to basic/bronze for cost-conscious
  if (mlsResult.tier === 'base') {
    scenarioA.isBestValue = true;
  } else if (annualMLS > bronzeYear1) {
    scenarioB.isBestValue = true;
  } else {
    scenarioB.isBestValue = true;
  }

  // ─── Recommendation ────────────────────────────────────────────────────────
  let recommendedScenario: ScenarioResult['recommendedScenario'];
  let recommendationReason: string;

  if (mlsResult.tier === 'base') {
    // Below MLS threshold — insurance is optional
    recommendedScenario = 'no-insurance';
    recommendationReason =
      'Your income is below the MLS threshold — you won\'t pay a Medicare Levy Surcharge without insurance. ' +
      'Insurance is a personal choice based on your health needs, not a tax obligation.';
  } else if (annualMLS > bronzeYear1) {
    // MLS costs more than basic cover — insurance saves money
    recommendedScenario = 'basic-bronze';
    recommendationReason =
      `Your MLS ($${annualMLS.toLocaleString()}/yr) costs more than Basic/Bronze cover ($${bronzeYear1.toLocaleString()}/yr after rebate). ` +
      'Getting basic hospital cover saves you money while avoiding the surcharge.';
  } else {
    // MLS is cheaper than insurance — no financial incentive
    recommendedScenario = 'no-insurance';
    recommendationReason =
      `Your MLS ($${annualMLS.toLocaleString()}/yr) costs less than Basic/Bronze cover ($${bronzeYear1.toLocaleString()}/yr after rebate). ` +
      'Paying the surcharge is cheaper unless you value private hospital coverage.';
  }

  // ─── Break-even admissions ─────────────────────────────────────────────────
  // How many admissions per year would make Silver/Gold break even with no-insurance?
  // silverGoldYear1 = noInsuranceYear1 + (admissions × costPerAdmission)
  // This calculation shows how many admissions make the premium "worth it"
  const costDifferencePerAdmission =
    (TYPICAL_EXCESS_SILVER_GOLD + AVERAGE_GAP_PER_ADMISSION) - PUBLIC_OOP_PER_ADMISSION_ESTIMATE;
  const premiumDifference = silverGoldYear1 - noInsuranceYear1;
  const breakEvenAdmissions = costDifferencePerAdmission > 0
    ? Math.max(0, Math.round((premiumDifference / costDifferencePerAdmission) * 10) / 10)
    : null;

  // ─── Calculation breakdown ─────────────────────────────────────────────────
  const breakdown: ScenarioCalculationBreakdown = {
    mlsResult,
    rebateResult: bronzeRebate,
    lhcResult,
    basePremiumUsed: bronzeBase,
    premiumAfterRebateAndLoading: bronzeYear1,
  };

  return {
    scenarios: [scenarioA, scenarioB, scenarioC],
    recommendedScenario,
    recommendationReason,
    breakEvenAdmissions,
    calculationBreakdown: breakdown,
  };
}
