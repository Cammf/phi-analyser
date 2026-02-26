// =============================================================================
// RUN CALCULATIONS — Flagship wizard orchestrator
// Calls the full pipeline: resolveInputs → MLS → rebate → LHC →
//   scenario comparison → projection → extras (optional)
// =============================================================================

import type {
  WizardInputs,
  CalculationOutput,
  ExtrasResult,
  ExtrasCalculationBreakdown,
  WaitTimeResult,
} from '@/lib/types';
import {
  resolveInputs,
  HOSPITAL_PREMIUMS_SINGLE,
  FAMILY_PREMIUM_MULTIPLIERS,
} from '@/lib/resolveInputs';
import { calculateMLS } from '@/lib/mlsCalculations';
import { calculateRebate } from '@/lib/rebateCalculations';
import { calculateLHCLoading } from '@/lib/lhcCalculations';
import { calculateScenarioComparison } from '@/lib/scenarioCalculations';
import { calculateProjectionFromScenario } from '@/lib/projectionCalculations';

// ─── Extras calculation constants ───────────────────────────────────────────
// Source: APRA / PHIO data (approximate average benefit per service visit)
const DENTAL_BENEFIT_PER_VISIT    = 180;  // typical check-up + clean benefit
const OPTICAL_BENEFIT_PER_CLAIM   = 220;  // typical frames/lenses benefit
const PHYSIO_BENEFIT_PER_SESSION  = 45;   // typical single physio session benefit

// Annual extras premiums per single adult (matches premiums/current.json)
const EXTRAS_PREMIUMS_SINGLE: Record<string, number> = {
  none:          0,
  basic:       540,
  mid:         900,
  comprehensive: 1380,
};

// Extras family multipliers (based on industry averages)
const EXTRAS_FAMILY_MULTIPLIERS: Record<string, number> = {
  single:          1.0,
  couple:          1.8,
  family:          1.8,
  'single-parent': 1.5,
};

// ─── Extras value calculation ────────────────────────────────────────────────

function calculateExtrasValue(inputs: WizardInputs): ExtrasResult {
  const premiumSingle = EXTRAS_PREMIUMS_SINGLE[inputs.extrasDesired] ?? 0;
  const multiplier    = EXTRAS_FAMILY_MULTIPLIERS[inputs.familyType]  ?? 1.0;
  const annualPremium = Math.round(premiumSingle * multiplier);

  const estimatedAnnualBenefit = Math.round(
    inputs.dentalVisitsPerYear   * DENTAL_BENEFIT_PER_VISIT  +
    inputs.opticalClaimsPerYear  * OPTICAL_BENEFIT_PER_CLAIM +
    inputs.physioSessionsPerYear * PHYSIO_BENEFIT_PER_SESSION,
  );

  const netAnnualCost  = annualPremium - estimatedAnnualBenefit;
  const benefitRatio   = annualPremium > 0 ? estimatedAnnualBenefit / annualPremium : 0;
  const isFinanciallyRational = netAnnualCost <= 0;

  let recommendation: string;
  if (annualPremium === 0) {
    recommendation = 'No extras cover selected.';
  } else if (isFinanciallyRational) {
    recommendation =
      `Based on your usage, ${inputs.extrasDesired} extras cover is likely worthwhile — ` +
      `you'd claim back approximately $${estimatedAnnualBenefit.toLocaleString()} on a ` +
      `$${annualPremium.toLocaleString()} premium.`;
  } else {
    recommendation =
      `Based on your usage, you'd pay $${netAnnualCost.toLocaleString()} more per year ` +
      `than you'd claim back. Extras cover may not be financially rational for your situation.`;
  }

  const breakdown: ExtrasCalculationBreakdown = {
    premiumPaid:         annualPremium,
    estimatedBenefits:   estimatedAnnualBenefit,
    netCost:             netAnnualCost,
    breakEvenFrequency:  annualPremium > 0
      ? `~${Math.ceil(annualPremium / Math.max(DENTAL_BENEFIT_PER_VISIT, 1))} dental visits/year`
      : 'n/a',
  };

  return {
    isFinanciallyRational,
    annualPremium,
    estimatedAnnualBenefit,
    netAnnualCost,
    benefitRatio,
    recommendation,
    calculationBreakdown: breakdown,
  };
}

// ─── Main orchestrator ───────────────────────────────────────────────────────

/**
 * Runs the full flagship calculation pipeline for a given set of WizardInputs.
 * All functions are pure and synchronous — safe to call in useMemo.
 */
export function runCalculations(inputs: WizardInputs): CalculationOutput {
  const resolved = resolveInputs(inputs);

  // Use bronze as the base premium for MLS/rebate/LHC calculations
  // (bronze is the reference tier — cheapest non-Basic hospital cover)
  const bronzeBasePremium = Math.round(
    HOSPITAL_PREMIUMS_SINGLE.bronze * FAMILY_PREMIUM_MULTIPLIERS[resolved.familyType],
  );

  const mlsResult = calculateMLS({
    mlsIncome:         resolved.mlsIncome,
    familyType:        resolved.familyType,
    dependentChildren: resolved.dependentChildren,
  });

  const rebateResult = calculateRebate({
    mlsIncome:                  resolved.mlsIncome,
    familyType:                 resolved.familyType,
    dependentChildren:          resolved.dependentChildren,
    ageBracket:                 resolved.ageBracket,
    annualPremiumBeforeRebate:  bronzeBasePremium,
  });

  const lhcResult = calculateLHCLoading({
    currentAge:            resolved.age,
    hasHeldHospitalCover:  resolved.lhcHistory.hasHeldHospitalCover,
    yearsHeld:             resolved.lhcHistory.yearsHeld,
    basePremium:           bronzeBasePremium,
  });

  const scenarioResult = calculateScenarioComparison({
    mlsResult,
    mlsIncome:         resolved.mlsIncome,
    familyType:        resolved.familyType,
    dependentChildren: resolved.dependentChildren,
    ageBracket:        resolved.ageBracket,
    lhcResult,
    state:             resolved.state,
  });

  const projectionResult = calculateProjectionFromScenario(scenarioResult);

  const extrasResult: ExtrasResult | null =
    inputs.includeHealthNeeds && inputs.extrasDesired !== 'none'
      ? calculateExtrasValue(inputs)
      : null;

  // Wait time results are populated in Phase 8
  const waitTimeResults: WaitTimeResult[] = [];

  return {
    inputs,
    resolvedIncome: resolved.mlsIncome,
    mlsResult,
    rebateResult,
    lhcResult,
    scenarioResult,
    projectionResult,
    extrasResult,
    waitTimeResults,
    calculatedAt:  new Date().toISOString(),
    ratesVersion:  'FY2025-26',
  };
}
