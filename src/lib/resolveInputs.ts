// =============================================================================
// RESOLVE INPUTS — Converts WizardInputs to calculation-ready values
// =============================================================================

import type {
  WizardInputs,
  IncomeRange,
  FamilyType,
  AgeBracket,
  State,
  CoverStatus,
  HospitalTier,
} from '@/lib/types';

// =============================================================================
// INCOME RANGE MIDPOINTS
// Aligned to MLS thresholds. Used when exactIncome is not provided.
// Source: checklist task 2.4 specification.
// =============================================================================

export const INCOME_RANGE_MIDPOINTS: Record<IncomeRange, number> = {
  'under-90k':   70000,   // Midpoint of $0–$90k range
  '90k-110k':   100000,   // Midpoint of $90k–$110k range
  '110k-140k':  125000,   // Midpoint of $110k–$140k range
  '140k-175k':  157500,   // Midpoint of $140k–$175k range
  '175k-250k':  212500,   // Midpoint of $175k–$250k range
  'over-250k':  300000,   // Representative amount for $250k+ earners
};

export const INCOME_RANGE_LABELS: Record<IncomeRange, string> = {
  'under-90k':  'Under $90,000',
  '90k-110k':   '$90,000 – $110,000',
  '110k-140k':  '$110,000 – $140,000',
  '140k-175k':  '$140,000 – $175,000',
  '175k-250k':  '$175,000 – $250,000',
  'over-250k':  'Over $250,000',
};

// =============================================================================
// INCOME RESOLUTION
// =============================================================================

/**
 * Returns the effective income to use for MLS/rebate calculations.
 * Uses exactIncome if provided; otherwise uses the IncomeRange midpoint.
 */
export function resolveIncome(inputs: Pick<WizardInputs, 'incomeRange' | 'exactIncome'>): number {
  if (inputs.exactIncome !== null && inputs.exactIncome > 0) {
    return inputs.exactIncome;
  }
  return INCOME_RANGE_MIDPOINTS[inputs.incomeRange];
}

// =============================================================================
// AGE BRACKET RESOLUTION
// Used for rebate percentage lookup.
// =============================================================================

/**
 * Returns the AgeBracket for a given age.
 * Couple rule: caller should pass the OLDER partner's age.
 */
export function resolveAgeBracket(age: number): AgeBracket {
  if (age >= 70) return 'age70plus';
  if (age >= 65) return 'age65to69';
  return 'under65';
}

// =============================================================================
// FAMILY TYPE RESOLUTION
// =============================================================================

/**
 * Returns true if the family type should use family/couple MLS thresholds.
 */
export function isFamilyThreshold(familyType: FamilyType): boolean {
  return familyType === 'couple' || familyType === 'family' || familyType === 'single-parent';
}

/**
 * Returns the effective number of dependent children for threshold adjustment.
 * Couples without children: 0. Single-parent with 1 child: 1.
 */
export function resolveDependentChildren(inputs: Pick<WizardInputs, 'familyType' | 'dependentChildren'>): number {
  if (inputs.familyType === 'couple') return 0; // couples: no child threshold increment
  return inputs.dependentChildren;
}

// =============================================================================
// LHC HISTORY RESOLUTION
// Converts CoverStatus + yearsHeld to LHC calculation inputs.
// =============================================================================

export interface ResolvedLhcHistory {
  hasHeldHospitalCover: boolean;
  yearsHeld: number;
}

/**
 * Resolves the wizard's cover status inputs to the parameters needed by
 * calculateLHCLoading().
 */
export function resolveLhcHistory(
  inputs: Pick<WizardInputs, 'coverStatus' | 'yearsHeld' | 'extrasOnly'>,
): ResolvedLhcHistory {
  // Extras-only cover does NOT count for LHC — must be hospital cover
  if (inputs.extrasOnly) {
    return { hasHeldHospitalCover: false, yearsHeld: 0 };
  }

  switch (inputs.coverStatus) {
    case 'yes':
      return { hasHeldHospitalCover: true, yearsHeld: inputs.yearsHeld };
    case 'used-to-have':
      // Treat as not currently holding for loading display purposes
      // (loading is re-accumulating since they dropped)
      return { hasHeldHospitalCover: false, yearsHeld: 0 };
    case 'never':
    default:
      return { hasHeldHospitalCover: false, yearsHeld: 0 };
  }
}

// =============================================================================
// PREMIUM LOOKUP — Average premiums from src/data/premiums/current.json
// Hardcoded to avoid async data loading in calculation pipeline.
// =============================================================================

// Hospital-only premiums (single adult, before rebate, no LHC loading)
export const HOSPITAL_PREMIUMS_SINGLE: Record<Exclude<HospitalTier, 'none'>, number> = {
  basic:  1063,
  bronze: 1357,
  silver: 2475,
  gold:   3555,
};

// Family multipliers (couple/family/single-parent)
export const FAMILY_PREMIUM_MULTIPLIERS: Record<FamilyType, number> = {
  single:        1.0,
  couple:        1.9,
  family:        2.0,
  'single-parent': 1.5,
};

/**
 * Returns the estimated annual hospital premium for the given tier and family type.
 */
export function resolveHospitalPremium(tier: Exclude<HospitalTier, 'none'>, familyType: FamilyType): number {
  const singlePremium = HOSPITAL_PREMIUMS_SINGLE[tier];
  return Math.round(singlePremium * FAMILY_PREMIUM_MULTIPLIERS[familyType]);
}

// =============================================================================
// AMBULANCE STATE RESOLUTION
// =============================================================================

/** States where ambulance is free for all residents. */
const FREE_AMBULANCE_STATES: State[] = ['QLD', 'TAS'];

export interface AmbulanceInfo {
  isFree: boolean;
  typicalEmergencyCost: number;
  phiRecommendation: string;
}

const AMBULANCE_INFO: Record<State, AmbulanceInfo> = {
  QLD: { isFree: true,  typicalEmergencyCost: 0,    phiRecommendation: 'Low priority (within QLD)' },
  TAS: { isFree: true,  typicalEmergencyCost: 0,    phiRecommendation: 'Low priority (within TAS)' },
  VIC: { isFree: false, typicalEmergencyCost: 1282, phiRecommendation: 'Medium priority (non-concession)' },
  NSW: { isFree: false, typicalEmergencyCost: 401,  phiRecommendation: 'High priority' },
  SA:  { isFree: false, typicalEmergencyCost: 1046, phiRecommendation: 'High priority' },
  WA:  { isFree: false, typicalEmergencyCost: 943,  phiRecommendation: 'High priority' },
  ACT: { isFree: false, typicalEmergencyCost: 401,  phiRecommendation: 'Medium-High priority' },
  NT:  { isFree: false, typicalEmergencyCost: 636,  phiRecommendation: 'High priority' },
};

export function resolveAmbulanceInfo(state: State): AmbulanceInfo {
  return AMBULANCE_INFO[state];
}

// =============================================================================
// FULL INPUT RESOLVER
// Converts WizardInputs into a flat object of calculation-ready values.
// =============================================================================

export interface ResolvedInputs {
  // Core financials
  mlsIncome: number;
  familyType: FamilyType;
  dependentChildren: number;
  ageBracket: AgeBracket;

  // LHC
  lhcHistory: ResolvedLhcHistory;

  // Premiums (for chosen tier, if applicable)
  hospitalPremium: number | null; // null if coverStatus === 'never' with no tier chosen

  // State / ambulance
  state: State;
  ambulanceInfo: AmbulanceInfo;

  // Pass-through for display
  age: number;
  incomeRange: IncomeRange;
  exactIncome: number | null;
}

/**
 * Converts all WizardInputs into calculation-ready values in one call.
 * Called by the Step 5 orchestrator before running calculations.
 */
export function resolveInputs(inputs: WizardInputs): ResolvedInputs {
  const mlsIncome = resolveIncome(inputs);
  const ageBracket = resolveAgeBracket(inputs.age);
  const dependentChildren = resolveDependentChildren(inputs);
  const lhcHistory = resolveLhcHistory(inputs);

  const hasChosenTier =
    inputs.currentTier !== 'none' && inputs.coverStatus === 'yes';
  const hospitalPremium = hasChosenTier
    ? resolveHospitalPremium(inputs.currentTier as Exclude<HospitalTier, 'none'>, inputs.familyType)
    : null;

  return {
    mlsIncome,
    familyType: inputs.familyType,
    dependentChildren,
    ageBracket,
    lhcHistory,
    hospitalPremium,
    state: inputs.state,
    ambulanceInfo: resolveAmbulanceInfo(inputs.state),
    age: inputs.age,
    incomeRange: inputs.incomeRange,
    exactIncome: inputs.exactIncome,
  };
}

// Re-export constants for UI use (income range labels in step components)
export { FREE_AMBULANCE_STATES };
