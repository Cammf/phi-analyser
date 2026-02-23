// =============================================================================
// GLOBAL TYPE DEFINITIONS — Private Health Insurance Analyser
// =============================================================================

// ─── Wizard Steps ──────────────────────────────────────────────────────────

export type WizardStep = 1 | 2 | 3 | 4 | 5;

// =============================================================================
// INPUT TYPES
// =============================================================================

/** Hospital cover tier — 'none' used where no cover is held */
export type CoverTier = 'gold' | 'silver' | 'bronze' | 'basic';
export type HospitalTier = 'none' | 'basic' | 'bronze' | 'silver' | 'gold';

/** Australian state/territory */
export type State = 'ACT' | 'NSW' | 'NT' | 'QLD' | 'SA' | 'TAS' | 'VIC' | 'WA';

/** Income bracket options aligned to MLS thresholds */
export type IncomeRange =
  | 'under-90k'
  | '90k-110k'
  | '110k-140k'
  | '140k-175k'
  | '175k-250k'
  | 'over-250k';

/** Family / relationship status */
export type FamilyType = 'single' | 'couple' | 'family' | 'single-parent';

/** Age bracket used for rebate percentage lookup */
export type AgeBracket = 'under65' | 'age65to69' | 'age70plus';

/** Current private hospital cover status */
export type CoverStatus = 'yes' | 'never' | 'used-to-have';

/** Extras (general treatment) cover tier */
export type ExtrasTier = 'none' | 'basic' | 'mid' | 'comprehensive';

/** Common elective procedure types used in wait-time lookups */
export type ProcedureType =
  | 'knee_replacement'
  | 'hip_replacement'
  | 'cataract'
  | 'septoplasty'
  | 'tonsillectomy'
  | 'cabg'
  | 'shoulder_surgery'
  | 'colonoscopy';

// =============================================================================
// WIZARD TYPES
// =============================================================================

export interface WizardInputs {
  // Step 1 — About You
  age: number;
  familyType: FamilyType;
  dependentChildren: number;  // 0 if single or couple with no dependants
  state: State;

  // Step 2 — Income
  incomeRange: IncomeRange;
  exactIncome: number | null;  // optional — enables precise MLS/rebate calc

  // Step 3 — Insurance Status
  coverStatus: CoverStatus;
  currentTier: HospitalTier;            // 'none' if no cover
  currentPremiumPerMonth: number | null;
  extrasOnly: boolean;                  // true if they only have extras, not hospital
  yearsHeld: number;                    // if they have or used to have cover
  yearDropped: number | null;           // calendar year cover lapsed (if used-to-have)

  // Step 4 — Health Needs (optional)
  includeHealthNeeds: boolean;          // false = skip to review
  dentalVisitsPerYear: number;
  opticalClaimsPerYear: number;
  physioSessionsPerYear: number;
  plannedProcedures: ProcedureType[];   // empty array = none selected
  extrasDesired: ExtrasTier;

  // Step 5 — Review (no additional inputs)
}

export interface WizardState {
  currentStep: WizardStep;
  inputs: WizardInputs;
  isComplete: boolean;
}

export type WizardAction =
  | { type: 'GO_TO_STEP'; step: WizardStep }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'UPDATE_INPUT'; payload: Partial<WizardInputs> }
  | { type: 'RESET' }
  | { type: 'RESTORE'; state: WizardState };

// =============================================================================
// DATA FILE TYPES — mirror the JSON structures in /src/data/
// =============================================================================

// ─── MLS Data ──────────────────────────────────────────────────────────────

export interface MLSThreshold {
  tier: 'base' | '1' | '2' | '3';
  label: string;
  incomeMin: number;
  incomeMax: number | null;
  mlsRate: number;  // 0, 0.01, 0.0125, or 0.015
  description: string;
}

export interface MLSRates {
  financialYear: string;
  effectiveDate: string;
  singleThresholds: MLSThreshold[];
  familyThresholds: MLSThreshold[];
  familyThresholdRules: {
    dependentChildIncrement: number;
    incrementAppliesAfterChild: number;
  };
}

// ─── Rebate Data ───────────────────────────────────────────────────────────

export interface RebateTierRates {
  under65: number;
  age65to69: number;
  age70plus: number;
}

export interface RebatePeriod {
  periodLabel: string;
  effectiveDate: string;
  expiryDate: string;
  isPrimaryPeriod: boolean;
  durationMonths: number;
  tiers: {
    base: RebateTierRates;
    '1': RebateTierRates;
    '2': RebateTierRates;
    '3': RebateTierRates;
  };
}

export interface RebateIncomeThreshold {
  tier: 'base' | '1' | '2' | '3';
  label: string;
  incomeMin: number;
  incomeMax: number | null;
}

export interface RebateRates {
  financialYear: string;
  incomeThresholds: {
    single: RebateIncomeThreshold[];
    family: RebateIncomeThreshold[];
    dependentChildIncrement: number;
  };
  rebatePeriods: RebatePeriod[];
}

// ─── LHC Data ──────────────────────────────────────────────────────────────

export interface YouthDiscountBracket {
  ageMin: number;
  ageMax: number | null;
  discount: number;
}

export interface LHCRules {
  lhcLoading: {
    baseAge: number;          // 31
    ratePerYear: number;      // 0.02
    maxLoading: number;       // 0.70
    removalAfterYears: number; // 10
    gracePeriodDays: number;  // 1094
  };
  youthDiscount: {
    discountByAge: YouthDiscountBracket[];
    retentionRule: { freezeUntilAge: number };
    phaseOut: { startsAtAge: number; reductionPerYear: number };
    insurerDiscretion: { isMandatory: boolean };
  };
}

// ─── Premium Data ──────────────────────────────────────────────────────────

export interface TierPremium {
  label: string;
  annualPremium: number;
  monthlyPremium: number;
  description: string;
}

export interface PremiumData {
  hospitalPremiums: {
    single: {
      gold: TierPremium;
      silver: TierPremium;
      bronze: TierPremium;
      basic: TierPremium;
    };
    familyMultipliers: {
      couple: number;
      family: number;
      singleParent: number;
    };
  };
  extrasPremiums: {
    single: {
      basic: TierPremium;
      mid: TierPremium;
      comprehensive: TierPremium;
    };
    familyMultipliers: {
      couple: number;
      family: number;
      singleParent: number;
    };
  };
  premiumGrowth: {
    current2026: number;
    fiveYearAverage: number;
    tenYearAverage: number;
    longTermAverage: number;
    projectionDefault: number;
  };
}

// ─── Industry Stats Data ───────────────────────────────────────────────────

export interface IndustryStats {
  participation: {
    hospitalCoverRate: number;
    hospitalCoverPeople: number;
    extrasCoverRate: number;
    extrasCoverPeople: number;
  };
  benefitsReturn: {
    hospitalBenefitsRatio: number;
    extrasBenefitsRatio: number;
    combinedBenefitsRatio: number;
  };
  gapPayments: {
    averageGap: number;
    noGapRate: number;
    knownGapRate: number;
    unknownGapRate: number;
    medianGapWhenCharged: number;
  };
  premiumIncrease2026: {
    averageRate: number;
    effectiveDate: string;
    range: { lowest: number; highest: number };
  };
  keyMetrics: {
    averageSinglePremium: number;
    averageFamilyPremium: number;
    cheapestBasicSingle: number;
  };
}

// ─── Wait Time Data ─────────────────────────────────────────────────────────

export interface WaitTimeEntry {
  id: ProcedureType;
  label: string;
  category: string;
  publicWaitDays: {
    median: number;
    percentile90: number;
    description: string;
  };
  privateWaitDays: {
    typical: number;
    range: string;
    description: string;
  };
  waitTimeSavingDays: number;
  context: string;
  coverRequired: string;
  urgencyCategory: string;
}

export interface WaitTimeData {
  procedures: WaitTimeEntry[];
  keyInsights: {
    longestPublicWaits: string[];
    shortestPrivateAdvantage: string[];
    mostCommonProcedures: string[];
  };
}

// ─── Maternity Data ─────────────────────────────────────────────────────────

export interface MaternityData {
  private: {
    coverRequired: string;
    waitingPeriod: { months: number; description: string };
    typicalCosts: {
      obstetrician: {
        totalFee: { min: number; max: number; typical: number };
        medicareRebate: number;
        insurerBenefit: { min: number; max: number; typical: number };
        outOfPocket: { min: number; max: number; typical: number; description: string };
      };
      totalOutOfPocket: { min: number; max: number; typical: number; description: string };
    };
    benefits: string[];
    considerations: string[];
    cSectionRate: { private: number; public: number };
  };
  public: {
    cost: string;
    outOfPocket: number;
    benefits: string[];
    considerations: string[];
  };
  comparison: {
    clinicalOutcomes: string;
    keyDecisionFactors: string[];
    recommendation: string;
  };
}

// ─── Ambulance Data ─────────────────────────────────────────────────────────

export interface AmbulanceStateEntry {
  stateName: string;
  freeForAllResidents: boolean;
  partiallyFree?: boolean;
  partialCoverageDescription?: string;
  subscriptionCost?: {
    single: number;
    family: number;
    period: string;
    description: string;
  };
  costWithoutCover: {
    emergency?: {
      min: number;
      max?: number;
      description: string;
    };
    amount?: number;
    description?: string;
  };
  phiRecommendation: string;
  interstateCoverage: string;
}

export interface AmbulanceData {
  states: Record<State, AmbulanceStateEntry>;
  summaryTable: Array<{
    state: State;
    freeForResidents: boolean;
    typicalEmergencyCost: number;
    typicalMaxCost?: number;
    phiPriority: string;
  }>;
}

// ─── Extras Service Data ────────────────────────────────────────────────────

export interface ExtrasService {
  label: string;
  category: string;
  costPerVisit: { min: number; max: number; typical: number; description: string };
  insuranceBenefit: {
    typical: number;
    min: number;
    max: number;
    coverageNote: string;
  };
  typicalGap: { typical: number; min: number; max: number; description?: string };
  typicalFrequency?: string;
  annualSubLimitRange?: {
    basic?: { min: number; max: number; note?: string };
    mid?: { min: number; max: number; note?: string };
    comprehensive?: { min: number; max: number };
  };
  notes?: string;
}

export interface ExtrasServiceData {
  services: Record<string, ExtrasService>;
  breakEvenAnalysis: {
    averageExtrasPremiumSingle: number;
    typicalBenefitsRatio: number;
    averageAnnualBenefitPaid: number;
    insight: string;
  };
}

// =============================================================================
// CALCULATION RESULT TYPES
// =============================================================================

// ─── MLS Result ─────────────────────────────────────────────────────────────

export interface MLSCalculationBreakdown {
  taxableIncome: number;
  otherComponents: number;  // FBT, investment losses, reportable super, etc.
  mlsIncome: number;        // total income for MLS purposes
  familyThresholdUsed: number;
  tier: 'base' | '1' | '2' | '3';
  rateApplied: number;
}

export interface MLSResult {
  mlsRate: number;          // 0, 0.01, 0.0125, or 0.015
  annualMLS: number;
  tier: 'base' | '1' | '2' | '3';
  isAboveThreshold: boolean;
  nextThreshold: number | null;   // null if already at Tier 3
  mlsIncome: number;
  calculationBreakdown: MLSCalculationBreakdown;
}

// ─── Rebate Result ──────────────────────────────────────────────────────────

export interface RebateCalculationBreakdown {
  mlsIncome: number;
  tier: 'base' | '1' | '2' | '3';
  ageBracket: AgeBracket;
  rebatePercentage: number;
  basePremium: number;
  rebateDollars: number;
  premiumAfterRebate: number;
}

export interface RebateResult {
  rebatePercentage: number;
  annualRebate: number;
  premiumAfterRebate: number;
  tier: 'base' | '1' | '2' | '3';
  ageBracket: AgeBracket;
  calculationBreakdown: RebateCalculationBreakdown;
}

// ─── LHC Result ─────────────────────────────────────────────────────────────

export interface LHCCalculationBreakdown {
  currentAge: number;
  yearsOverBase: number;          // years over 30 without cover
  loadingPercentage: number;
  youthDiscount: number;          // 0 if age 30+
  annualLoadingCost: number;      // loading amount in dollars on chosen tier
  basePremiumUsed: number;
  removalYear: number | null;     // calendar year loading will be removed (if has cover)
}

export interface LHCResult {
  loadingPercentage: number;      // e.g. 0.10 for 10%
  youthDiscount: number;          // e.g. 0.06 for 6% (if under 30)
  annualLoadingCost: number;
  tenYearCumulativeLoading: number;
  yearsUntilLoadingRemoved: number | null;
  calculationBreakdown: LHCCalculationBreakdown;
}

// ─── Scenario Result ────────────────────────────────────────────────────────

export interface ScenarioOption {
  id: 'no-insurance' | 'basic-bronze' | 'silver-gold';
  label: string;
  description: string;
  year1Cost: number;
  tenYearCost: number;
  coverageDescription: string;
  tradeoffs: string[];
  isCheapest: boolean;
  isBestValue: boolean;
  isMostCoverage: boolean;
}

export interface ScenarioCalculationBreakdown {
  mlsResult: MLSResult;
  rebateResult: RebateResult;
  lhcResult: LHCResult;
  basePremiumUsed: number;
  premiumAfterRebateAndLoading: number;
}

export interface ScenarioResult {
  scenarios: [ScenarioOption, ScenarioOption, ScenarioOption]; // always 3
  recommendedScenario: 'no-insurance' | 'basic-bronze' | 'silver-gold';
  recommendationReason: string;
  breakEvenAdmissions: number | null;
  calculationBreakdown: ScenarioCalculationBreakdown;
}

// ─── Projection Result ──────────────────────────────────────────────────────

export interface ProjectionYear {
  year: number;       // 1-indexed (Year 1, Year 2, ...)
  calendarYear: number;
  noInsuranceCost: number;
  basicBronzeCost: number;
  silverGoldCost: number;
  noInsuranceCumulative: number;
  basicBronzeCumulative: number;
  silverGoldCumulative: number;
  lhcLoadingRemoved: boolean;
}

export interface ProjectionResult {
  yearByYear: ProjectionYear[];
  tenYearTotal: { noInsurance: number; basicBronze: number; silverGold: number };
  opportunityCost: number;    // premiums invested at 5% p.a. over 10 years
  loadingRemovalYear: number | null;  // which Year (1-10) loading is removed, if applicable
  growthRateUsed: number;
}

// ─── Extras Result ──────────────────────────────────────────────────────────

export interface ExtrasCalculationBreakdown {
  premiumPaid: number;
  estimatedBenefits: number;
  netCost: number;     // positive = net expense; negative = net saving
  breakEvenFrequency: string;
}

export interface ExtrasResult {
  isFinanciallyRational: boolean;
  annualPremium: number;
  estimatedAnnualBenefit: number;
  netAnnualCost: number;
  benefitRatio: number;   // estimatedBenefit / annualPremium
  recommendation: string;
  calculationBreakdown: ExtrasCalculationBreakdown;
}

// ─── Wait Time Result ───────────────────────────────────────────────────────

export interface WaitTimeResult {
  procedure: WaitTimeEntry;
  publicWaitDays: number;
  privateWaitDays: number;
  savingDays: number;
  coverSufficient: boolean;  // true if current tier covers the procedure
  upgradeRequired: CoverTier | null;
}

// =============================================================================
// COMPOSITE / ORCHESTRATION TYPES
// =============================================================================

/** Full output of the runCalculations orchestrator — passed to results page */
export interface CalculationOutput {
  inputs: WizardInputs;
  resolvedIncome: number;

  mlsResult: MLSResult;
  rebateResult: RebateResult;
  lhcResult: LHCResult;
  scenarioResult: ScenarioResult;
  projectionResult: ProjectionResult;
  extrasResult: ExtrasResult | null;  // null if health needs step was skipped
  waitTimeResults: WaitTimeResult[];  // empty array if no procedures selected

  calculatedAt: string;   // ISO 8601
  ratesVersion: string;   // e.g. "FY2025-26"
}

// ─── Legacy / Simple Result Types (used in non-wizard calculators) ──────────

/** Simplified result for standalone MLS Calculator (/mls-calculator) */
export interface SimpleMlsResult extends MLSResult {
  cheapestBasicPremium: number;
  cheapestBasicAfterRebate: number;
  mlsVsInsuranceDelta: number;  // positive = MLS > insurance (insurance makes sense)
}

/** Simplified result for standalone LHC Calculator (/lhc-loading-calculator) */
export interface SimpleLhcResult extends LHCResult {
  deferralComparison: Array<{
    deferToAge: number;
    loadingAtDeferAge: number;
    cumulativeExtraCostOver10Yrs: number;
  }>;
}
