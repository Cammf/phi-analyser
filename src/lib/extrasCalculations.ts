// =============================================================================
// EXTRAS CALCULATIONS — Private Health Insurance Analyser
// Calculates the financial value of extras (general treatment) cover,
// applying the government rebate to the premium and capping benefits at
// per-tier sub-limits.
// FY 2025-26 | Source: PHIO / APRA industry data
// =============================================================================

import type {
  ExtrasTier,
  FamilyType,
  AgeBracket,
  ExtrasResult,
  ExtrasCalculationBreakdown,
} from '@/lib/types';
import { calculateRebate } from '@/lib/rebateCalculations';

// =============================================================================
// CONSTANTS
// =============================================================================

// ─── Annual extras premiums — single adult, before rebate ────────────────────
// Matches src/data/premiums/current.json extrasPremiums.single
const EXTRAS_PREMIUMS_SINGLE: Record<ExtrasTier, number> = {
  none:          0,
  basic:       540,
  mid:         900,
  comprehensive: 1380,
};

// ─── Family multipliers ──────────────────────────────────────────────────────
const EXTRAS_FAMILY_MULTIPLIERS: Record<FamilyType, number> = {
  single:          1.0,
  couple:          1.8,
  family:          1.8,
  'single-parent': 1.5,
};

// ─── Sub-limits by tier (midpoints from service-costs.json annualSubLimitRange) ─
// 0 = excluded from that tier
const DENTAL_SUB_LIMITS: Record<ExtrasTier, number> = {
  none:          0,
  basic:       300,
  mid:         500,
  comprehensive: 900,
};

const OPTICAL_SUB_LIMITS: Record<ExtrasTier, number> = {
  none:          0,
  basic:       200,
  mid:         250,
  comprehensive: 400,
};

const PHYSIO_SUB_LIMITS: Record<ExtrasTier, number> = {
  none:          0,
  basic:         0,   // excluded from basic
  mid:         450,
  comprehensive: 700,
};

const CHIRO_SUB_LIMITS: Record<ExtrasTier, number> = {
  none:          0,
  basic:         0,   // excluded from basic
  mid:         400,
  comprehensive: 550,
};

// ─── Benefit amounts per visit / claim / session ─────────────────────────────
// Typical insurance benefit paid (not the full cost of the service)
const DENTAL_BENEFIT_PER_VISIT   = 175;
const OPTICAL_BENEFIT_PER_CLAIM  = 250;
const PHYSIO_BENEFIT_PER_SESSION = 45;
const CHIRO_BENEFIT_PER_SESSION  = 40;

// =============================================================================
// INPUT TYPE
// =============================================================================

export interface ExtrasValueInputs {
  extrasTier: ExtrasTier;
  familyType: FamilyType;
  mlsIncome: number;
  dependentChildren: number;
  ageBracket: AgeBracket;
  dentalVisitsPerYear: number;
  opticalClaimsPerYear: number;
  physioSessionsPerYear: number;
  chiroSessionsPerYear: number;
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Calculates the financial value of extras (general treatment) cover.
 *
 * Steps:
 *   1. If tier is 'none' → return all-zero result.
 *   2. Calculate raw premium (single × family multiplier).
 *   3. Apply government rebate via calculateRebate() to get annualPremium.
 *   4. Calculate each service benefit, capped at the tier's sub-limit.
 *   5. Sum benefits, compute netAnnualCost, benefitRatio, isFinanciallyRational.
 *   6. Build breakEvenFrequency based on dental visits.
 */
export function calculateExtrasValue(inputs: ExtrasValueInputs): ExtrasResult {
  const {
    extrasTier,
    familyType,
    mlsIncome,
    dependentChildren,
    ageBracket,
    dentalVisitsPerYear,
    opticalClaimsPerYear,
    physioSessionsPerYear,
    chiroSessionsPerYear,
  } = inputs;

  // Step 1 — 'none' tier: return all zeros
  if (extrasTier === 'none') {
    const breakdown: ExtrasCalculationBreakdown = {
      premiumPaid:        0,
      estimatedBenefits:  0,
      netCost:            0,
      breakEvenFrequency: 'n/a',
    };
    return {
      isFinanciallyRational:  false,
      annualPremium:           0,
      estimatedAnnualBenefit:  0,
      netAnnualCost:           0,
      benefitRatio:            0,
      recommendation:         'No extras cover selected.',
      calculationBreakdown:   breakdown,
    };
  }

  // Step 2 — Raw premium before rebate
  const premiumBeforeRebate = EXTRAS_PREMIUMS_SINGLE[extrasTier] * EXTRAS_FAMILY_MULTIPLIERS[familyType];

  // Step 3 — Apply government rebate
  const rebateResult = calculateRebate({
    mlsIncome,
    familyType,
    dependentChildren,
    ageBracket,
    annualPremiumBeforeRebate: premiumBeforeRebate,
  });
  const annualPremium = rebateResult.premiumAfterRebate;

  // Step 4 — Cap each service benefit at the tier sub-limit
  const dentalBenefit = Math.min(
    dentalVisitsPerYear * DENTAL_BENEFIT_PER_VISIT,
    DENTAL_SUB_LIMITS[extrasTier],
  );
  const opticalBenefit = Math.min(
    opticalClaimsPerYear * OPTICAL_BENEFIT_PER_CLAIM,
    OPTICAL_SUB_LIMITS[extrasTier],
  );
  const physioBenefit = Math.min(
    physioSessionsPerYear * PHYSIO_BENEFIT_PER_SESSION,
    PHYSIO_SUB_LIMITS[extrasTier],
  );
  const chiroBenefit = Math.min(
    chiroSessionsPerYear * CHIRO_BENEFIT_PER_SESSION,
    CHIRO_SUB_LIMITS[extrasTier],
  );

  // Step 5 — Aggregate
  const estimatedAnnualBenefit = dentalBenefit + opticalBenefit + physioBenefit + chiroBenefit;
  const netAnnualCost          = annualPremium - estimatedAnnualBenefit;
  const benefitRatio           = annualPremium > 0 ? estimatedAnnualBenefit / annualPremium : 0;
  const isFinanciallyRational  = netAnnualCost <= 0;

  // Step 6 — Break-even frequency (based on dental as the reference service)
  const breakEvenVisits = Math.ceil(annualPremium / DENTAL_BENEFIT_PER_VISIT);
  const breakEvenFrequency = `~${breakEvenVisits} dental visits/year to break even`;

  // Build recommendation string
  let recommendation: string;
  if (isFinanciallyRational) {
    recommendation =
      `Based on your usage, ${extrasTier} extras cover is likely worthwhile — ` +
      `you'd claim back approximately $${Math.round(estimatedAnnualBenefit).toLocaleString()} on a ` +
      `$${Math.round(annualPremium).toLocaleString()} premium.`;
  } else {
    recommendation =
      `Based on your usage, you'd pay $${Math.round(netAnnualCost).toLocaleString()} more per year ` +
      `than you'd claim back. Extras cover may not be financially rational for your situation.`;
  }

  const breakdown: ExtrasCalculationBreakdown = {
    premiumPaid:        annualPremium,
    estimatedBenefits:  estimatedAnnualBenefit,
    netCost:            netAnnualCost,
    breakEvenFrequency,
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

// =============================================================================
// EXPORTS — constants made available for results page components
// =============================================================================

export {
  EXTRAS_PREMIUMS_SINGLE,
  EXTRAS_FAMILY_MULTIPLIERS,
  DENTAL_SUB_LIMITS,
  OPTICAL_SUB_LIMITS,
  PHYSIO_SUB_LIMITS,
  CHIRO_SUB_LIMITS,
};
