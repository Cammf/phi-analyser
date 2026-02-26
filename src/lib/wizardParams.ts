// =============================================================================
// WIZARD URL PARAMS — encode WizardInputs to/from URLSearchParams
// Used by Step5Review (encode) and ResultsClient + wizard restore (decode)
// =============================================================================

import type {
  WizardInputs,
  IncomeRange,
  FamilyType,
  State,
  CoverStatus,
  HospitalTier,
  ExtrasTier,
  ProcedureType,
} from '@/lib/types';

/**
 * Encodes all WizardInputs fields as short URL param keys.
 * The resulting URLSearchParams is appended to the results URL.
 */
export function buildWizardParams(inputs: WizardInputs): URLSearchParams {
  const p = new URLSearchParams();
  p.set('age',    String(inputs.age));
  p.set('fam',    inputs.familyType);
  p.set('ch',     String(inputs.dependentChildren));
  p.set('st',     inputs.state);
  p.set('range',  inputs.incomeRange);
  if (inputs.exactIncome !== null) p.set('income', String(inputs.exactIncome));
  p.set('cover',  inputs.coverStatus);
  p.set('tier',   inputs.currentTier);
  if (inputs.currentPremiumPerMonth !== null) p.set('pm', String(inputs.currentPremiumPerMonth));
  p.set('xonly',  inputs.extrasOnly ? '1' : '0');
  p.set('yrs',    String(inputs.yearsHeld));
  if (inputs.yearDropped !== null) p.set('ydrop', String(inputs.yearDropped));
  p.set('needs',  inputs.includeHealthNeeds ? '1' : '0');
  p.set('dental', String(inputs.dentalVisitsPerYear));
  p.set('optical',String(inputs.opticalClaimsPerYear));
  p.set('physio', String(inputs.physioSessionsPerYear));
  if (inputs.plannedProcedures.length > 0) {
    p.set('procs', inputs.plannedProcedures.join(','));
  }
  p.set('extras', inputs.extrasDesired);
  return p;
}

/**
 * Decodes URLSearchParams back to WizardInputs.
 * Returns null if required params are missing (age, family type).
 */
export function parseWizardParams(p: URLSearchParams): WizardInputs | null {
  const ageStr    = p.get('age');
  const familyStr = p.get('fam');
  if (!ageStr || !familyStr) return null;

  const age = parseInt(ageStr, 10);
  if (isNaN(age) || age < 1) return null;

  const incomeStr = p.get('income');
  const pmStr     = p.get('pm');
  const ydropStr  = p.get('ydrop');
  const procsStr  = p.get('procs');

  return {
    age,
    familyType:             familyStr as FamilyType,
    dependentChildren:      parseInt(p.get('ch')     ?? '0', 10),
    state:                  (p.get('st')              ?? 'NSW') as State,
    incomeRange:            (p.get('range')           ?? 'under-90k') as IncomeRange,
    exactIncome:            incomeStr ? parseInt(incomeStr, 10) : null,
    coverStatus:            (p.get('cover')           ?? 'never') as CoverStatus,
    currentTier:            (p.get('tier')            ?? 'none') as HospitalTier,
    currentPremiumPerMonth: pmStr ? parseInt(pmStr, 10) : null,
    extrasOnly:             p.get('xonly') === '1',
    yearsHeld:              parseInt(p.get('yrs')     ?? '0', 10),
    yearDropped:            ydropStr ? parseInt(ydropStr, 10) : null,
    includeHealthNeeds:     p.get('needs') === '1',
    dentalVisitsPerYear:    parseInt(p.get('dental')  ?? '0', 10),
    opticalClaimsPerYear:   parseInt(p.get('optical') ?? '0', 10),
    physioSessionsPerYear:  parseInt(p.get('physio')  ?? '0', 10),
    plannedProcedures:      procsStr
      ? (procsStr.split(',').filter(Boolean) as ProcedureType[])
      : [],
    extrasDesired:          (p.get('extras')          ?? 'none') as ExtrasTier,
  };
}
