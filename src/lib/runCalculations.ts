// =============================================================================
// RUN CALCULATIONS — Flagship wizard orchestrator
// Calls the full pipeline: resolveInputs → MLS → rebate → LHC →
//   scenario comparison → projection → extras (optional) → wait times
// =============================================================================

import type {
  WizardInputs,
  CalculationOutput,
  ExtrasResult,
  WaitTimeResult,
  WaitTimeEntry,
  CoverTier,
  HospitalTier,
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
import { calculateExtrasValue } from '@/lib/extrasCalculations';
import waitTimeData from '@/data/procedures/wait-times.json';

// ─── Wait time helpers ───────────────────────────────────────────────────────

const TIER_RANK: Record<string, number> = { basic: 1, bronze: 2, silver: 3, gold: 4 };

function parseCoverRequiredTier(coverRequired: string): CoverTier {
  const lower = coverRequired.toLowerCase();
  if (lower.includes('gold'))   return 'gold';
  if (lower.includes('silver')) return 'silver';
  if (lower.includes('bronze')) return 'bronze';
  return 'basic';
}

function buildWaitTimeResults(inputs: WizardInputs): WaitTimeResult[] {
  if (!inputs.plannedProcedures.length) return [];

  const userTier: HospitalTier =
    inputs.coverStatus === 'yes' ? inputs.currentTier : 'none';

  return inputs.plannedProcedures.flatMap((procId) => {
    const entry = (waitTimeData.procedures as WaitTimeEntry[]).find((p) => p.id === procId);
    if (!entry) return [];

    const requiredTier    = parseCoverRequiredTier(entry.coverRequired);
    const coverSufficient =
      userTier !== 'none' && TIER_RANK[userTier] >= TIER_RANK[requiredTier];
    const upgradeRequired: CoverTier | null = coverSufficient ? null : requiredTier;

    return [{
      procedure:       entry,
      publicWaitDays:  entry.publicWaitDays.median,
      privateWaitDays: entry.privateWaitDays.typical,
      savingDays:      entry.waitTimeSavingDays,
      coverSufficient,
      upgradeRequired,
    }];
  });
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
      ? calculateExtrasValue({
          extrasTier:            inputs.extrasDesired,
          familyType:            resolved.familyType,
          mlsIncome:             resolved.mlsIncome,
          dependentChildren:     resolved.dependentChildren,
          ageBracket:            resolved.ageBracket,
          dentalVisitsPerYear:   inputs.dentalVisitsPerYear,
          opticalClaimsPerYear:  inputs.opticalClaimsPerYear,
          physioSessionsPerYear: inputs.physioSessionsPerYear,
          chiroSessionsPerYear:  0,  // wizard captures physio+chiro combined as physioSessionsPerYear
        })
      : null;

  const waitTimeResults: WaitTimeResult[] = buildWaitTimeResults(inputs);

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
