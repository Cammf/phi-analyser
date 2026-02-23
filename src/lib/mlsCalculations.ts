// =============================================================================
// MLS CALCULATIONS — Private Health Insurance Analyser
// FY 2025-26 | Source: ato.gov.au | Verified 2026-02-23
// =============================================================================

import type {
  FamilyType,
  AgeBracket,
  MLSResult,
  SimpleMlsResult,
  MLSCalculationBreakdown,
} from '@/lib/types';

// ─── FY 2025-26 Verified Thresholds ─────────────────────────────────────────
// Source: https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates
// Verified 2026-02-23. Thresholds indexed annually on 1 July.

type MLSTier = 'base' | '1' | '2' | '3';

interface ThresholdEntry {
  tier: MLSTier;
  incomeMin: number;
  incomeMax: number | null;
  mlsRate: number;
}

const SINGLE_THRESHOLDS: ThresholdEntry[] = [
  { tier: 'base', incomeMin: 0,      incomeMax: 101000, mlsRate: 0      },
  { tier: '1',    incomeMin: 101001, incomeMax: 118000, mlsRate: 0.01   },
  { tier: '2',    incomeMin: 118001, incomeMax: 158000, mlsRate: 0.0125 },
  { tier: '3',    incomeMin: 158001, incomeMax: null,   mlsRate: 0.015  },
];

const FAMILY_BASE_THRESHOLDS: ThresholdEntry[] = [
  { tier: 'base', incomeMin: 0,      incomeMax: 202000, mlsRate: 0      },
  { tier: '1',    incomeMin: 202001, incomeMax: 236000, mlsRate: 0.01   },
  { tier: '2',    incomeMin: 236001, incomeMax: 316000, mlsRate: 0.0125 },
  { tier: '3',    incomeMin: 316001, incomeMax: null,   mlsRate: 0.015  },
];

// Dependent child increment: +$1,500 per child AFTER the first
// 0 children = $0; 1 child = $0; 2 children = +$1,500; 3 children = +$3,000
const CHILD_INCREMENT = 1500;

// Cheapest Basic single hospital premium (before rebate/loading) — src/data/premiums/current.json
const CHEAPEST_BASIC_SINGLE = 1063;

// Inlined rebate table (Period 1, Jul 2025–Mar 2026) to avoid circular dependency
// with rebateCalculations.ts. Source: src/data/rebate/current.json — verified 2026-02-23.
// Values are percentages stored as decimals (e.g. 0.24288 = 24.288%).
const REBATE_TABLE: Record<MLSTier, Record<AgeBracket, number>> = {
  base: { under65: 0.24288, age65to69: 0.28337, age70plus: 0.32385 },
  '1':  { under65: 0.16192, age65to69: 0.20240, age70plus: 0.24288 },
  '2':  { under65: 0.08095, age65to69: 0.12143, age70plus: 0.16192 },
  '3':  { under65: 0,       age65to69: 0,       age70plus: 0       },
};

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

function isFamilyType(familyType: FamilyType): boolean {
  return familyType === 'couple' || familyType === 'family' || familyType === 'single-parent';
}

/**
 * Returns adjusted family thresholds accounting for dependent children.
 * Every threshold boundary shifts up by $1,500 for each child after the first.
 *
 * @example dependentChildren=2 → all boundaries +$1,500
 * @example dependentChildren=3 → all boundaries +$3,000
 */
function buildFamilyThresholds(dependentChildren: number): ThresholdEntry[] {
  const extraChildren = Math.max(0, dependentChildren - 1);
  const increment = extraChildren * CHILD_INCREMENT;
  if (increment === 0) return FAMILY_BASE_THRESHOLDS;

  return FAMILY_BASE_THRESHOLDS.map((entry) => ({
    ...entry,
    incomeMin: entry.incomeMin === 0 ? 0 : entry.incomeMin + increment,
    incomeMax: entry.incomeMax !== null ? entry.incomeMax + increment : null,
  }));
}

function findTier(mlsIncome: number, thresholds: ThresholdEntry[]): ThresholdEntry {
  for (const entry of thresholds) {
    if (entry.incomeMax === null || mlsIncome <= entry.incomeMax) {
      return entry;
    }
  }
  return thresholds[thresholds.length - 1];
}

function getNextThresholdMin(currentTier: MLSTier, thresholds: ThresholdEntry[]): number | null {
  const order: MLSTier[] = ['base', '1', '2', '3'];
  const nextTier = order[order.indexOf(currentTier) + 1];
  if (!nextTier) return null;
  return thresholds.find((t) => t.tier === nextTier)?.incomeMin ?? null;
}

// =============================================================================
// PUBLIC API
// =============================================================================

export interface CalculateMlsParams {
  /**
   * Income for MLS purposes — taxable income + reportable FBT + net investment
   * losses + reportable super contributions (+ any applicable trust/foreign income).
   */
  mlsIncome: number;
  familyType: FamilyType;
  /** Dependent children count for family threshold adjustment (default 0). */
  dependentChildren?: number;
}

/**
 * Calculates Medicare Levy Surcharge (MLS) for FY 2025-26.
 *
 * MLS is assessed on the FULL income at the applicable tier rate — NOT marginal.
 * Family/couple/single-parent types use family thresholds.
 *
 * @see https://www.ato.gov.au/.../medicare-levy-surcharge
 */
export function calculateMLS({
  mlsIncome,
  familyType,
  dependentChildren = 0,
}: CalculateMlsParams): MLSResult {
  const useFamily = isFamilyType(familyType);
  const thresholds = useFamily ? buildFamilyThresholds(dependentChildren) : SINGLE_THRESHOLDS;

  const tier = findTier(mlsIncome, thresholds);
  // MLS applies to FULL income — not just the amount over the threshold
  const annualMLS = Math.round(mlsIncome * tier.mlsRate);
  const nextThreshold = getNextThresholdMin(tier.tier, thresholds);

  const breakdown: MLSCalculationBreakdown = {
    taxableIncome: mlsIncome,
    otherComponents: 0,
    mlsIncome,
    familyThresholdUsed: useFamily ? (thresholds[0].incomeMax ?? 0) : 0,
    tier: tier.tier,
    rateApplied: tier.mlsRate,
  };

  return {
    mlsRate: tier.mlsRate,
    annualMLS,
    tier: tier.tier,
    isAboveThreshold: tier.tier !== 'base',
    nextThreshold,
    mlsIncome,
    calculationBreakdown: breakdown,
  };
}

export interface CalculateMlsVsInsuranceParams extends CalculateMlsParams {
  ageBracket: AgeBracket;
  /** LHC loading as a decimal (0.10 = 10% loading). Default 0. */
  lhcLoadingPercentage?: number;
}

/**
 * Compares annual MLS cost to the cheapest Basic hospital-only policy (after rebate + LHC loading).
 *
 * `mlsVsInsuranceDelta > 0`  → MLS costs more → insurance saves money.
 * `mlsVsInsuranceDelta < 0`  → Insurance costs more → no cover is cheaper.
 * `mlsVsInsuranceDelta === 0`→ Break-even.
 */
export function calculateMLSvsInsurance({
  mlsIncome,
  familyType,
  dependentChildren = 0,
  ageBracket,
  lhcLoadingPercentage = 0,
}: CalculateMlsVsInsuranceParams): SimpleMlsResult {
  const mlsResult = calculateMLS({ mlsIncome, familyType, dependentChildren });

  // Family/couple policies are ~2× the single premium
  const basePremium = isFamilyType(familyType)
    ? Math.round(CHEAPEST_BASIC_SINGLE * 2.0)
    : CHEAPEST_BASIC_SINGLE;

  // LHC loading is applied to the base premium before the rebate
  const premiumWithLoading = Math.round(basePremium * (1 + lhcLoadingPercentage));

  // Apply government rebate — Tier 3 earners receive 0% rebate
  const rebateRate = REBATE_TABLE[mlsResult.tier][ageBracket];
  const rebateDollars = Math.round(premiumWithLoading * rebateRate);
  const cheapestBasicAfterRebate = premiumWithLoading - rebateDollars;

  return {
    ...mlsResult,
    cheapestBasicPremium: premiumWithLoading,
    cheapestBasicAfterRebate,
    mlsVsInsuranceDelta: mlsResult.annualMLS - cheapestBasicAfterRebate,
  };
}
