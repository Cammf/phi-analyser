// =============================================================================
// GLOBAL TYPE DEFINITIONS — Private Health Insurance Analyser
// =============================================================================

// ─── Wizard Steps ──────────────────────────────────────────────────────────

export type WizardStep = 1 | 2 | 3 | 4 | 5;

// ─── Domain Enums ──────────────────────────────────────────────────────────

export type CoverTier = 'gold' | 'silver' | 'bronze' | 'basic';

export type State = 'ACT' | 'NSW' | 'NT' | 'QLD' | 'SA' | 'TAS' | 'VIC' | 'WA';

export type IncomeRange =
  | 'under-90k'
  | '90k-110k'
  | '110k-140k'
  | '140k-175k'
  | '175k-250k'
  | 'over-250k';

export type HospitalTier = 'none' | 'basic' | 'bronze' | 'silver' | 'gold';

// ─── Wizard Input Types ─────────────────────────────────────────────────────

export interface WizardInputs {
  // Step 1 — About You
  age: number;
  state: State;
  isSingle: boolean;               // true = single/sole parent; false = couple/family

  // Step 2 — Income
  incomeRange: IncomeRange;
  exactIncome: number | null;      // optional exact income for precise MLS/rebate calc

  // Step 3 — Insurance Status
  hasPrivateCover: boolean;
  currentTier: HospitalTier;       // 'none' if no cover
  currentPremiumPerMonth: number | null;

  // Step 4 — Health Needs
  hospitalTierDesired: HospitalTier;
  includeExtras: boolean;
  expectedAnnualClaims: number | null;  // optional: expected annual claims amount

  // Step 5 — Review (no inputs, summary only)
}

// ─── PHI Rate Data Types ────────────────────────────────────────────────────

export interface MLSThreshold {
  incomeMin: number;
  incomeMax: number | null;
  levyPercent: number;
}

export interface RebateTier {
  ageGroup: 'under-65' | '65-69' | '70-plus';
  incomeMin: number;
  incomeMax: number | null;
  rebatePercent: number;
}

export interface LHCLoading {
  yearsWithoutCover: number;
  loadingPercent: number;   // 2% per year, max 70%
}

// ─── Calculation Result Types ───────────────────────────────────────────────

export interface PHIScenario {
  label: string;            // e.g. "Bronze Hospital + No Extras"
  tier: HospitalTier;
  includesExtras: boolean;
  estimatedAnnualPremium: number;
  governmentRebate: number;
  netAnnualPremium: number;  // after rebate
  mlsIfNotInsured: number;   // MLS payable with no cover
  netSavingVsNoInsurance: number;  // positive = insurance cheaper than MLS
}

export interface PHIResult {
  mlsAnnual: number;               // MLS payable at current income with no cover
  mlsPercent: number;              // applicable MLS rate
  rebatePercent: number;           // applicable government rebate %
  lhcLoadingPercent: number;       // LHC loading if applicable
  scenarios: PHIScenario[];
  recommendedScenario: PHIScenario | null;

  calculatedAt: string;
  ratesVersion: string;
}
