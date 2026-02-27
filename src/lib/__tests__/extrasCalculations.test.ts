import { calculateExtrasValue } from '@/lib/extrasCalculations';
import type { ExtrasTier, FamilyType, AgeBracket } from '@/lib/types';

const BASE: Parameters<typeof calculateExtrasValue>[0] = {
  extrasTier: 'basic',
  familyType: 'single',
  mlsIncome: 70000,   // base rebate tier → 24.288% rebate
  dependentChildren: 0,
  ageBracket: 'under65',
  dentalVisitsPerYear: 0,
  opticalClaimsPerYear: 0,
  physioSessionsPerYear: 0,
  chiroSessionsPerYear: 0,
};

describe('calculateExtrasValue', () => {
  test('none tier returns all zeros and isFinanciallyRational=false', () => {
    const r = calculateExtrasValue({ ...BASE, extrasTier: 'none' });
    expect(r.annualPremium).toBe(0);
    expect(r.estimatedAnnualBenefit).toBe(0);
    expect(r.netAnnualCost).toBe(0);
    expect(r.benefitRatio).toBe(0);
    expect(r.isFinanciallyRational).toBe(false);
  });

  test('basic tier zero usage: premium after rebate, zero benefit, not rational', () => {
    const r = calculateExtrasValue(BASE);
    // single basic $540, 24.288% rebate → ~$409 after rebate
    expect(r.annualPremium).toBeGreaterThan(400);
    expect(r.annualPremium).toBeLessThan(540);
    expect(r.estimatedAnnualBenefit).toBe(0);
    expect(r.netAnnualCost).toBeGreaterThan(0);
    expect(r.isFinanciallyRational).toBe(false);
  });

  test('dental benefit capped at basic sub-limit ($300)', () => {
    // 3 visits × $175 = $525, but basic cap is $300
    const r = calculateExtrasValue({ ...BASE, dentalVisitsPerYear: 3 });
    expect(r.estimatedAnnualBenefit).toBe(300);
  });

  test('physio excluded from basic tier (sub-limit = 0)', () => {
    const r = calculateExtrasValue({ ...BASE, physioSessionsPerYear: 9 });
    expect(r.estimatedAnnualBenefit).toBe(0);
  });

  test('mid tier typical usage (1 dental + 1 optical) is not rational', () => {
    // benefit: 175 + 250 = 425; mid premium single ~$681 after rebate
    const r = calculateExtrasValue({
      ...BASE,
      extrasTier: 'mid',
      dentalVisitsPerYear: 1,
      opticalClaimsPerYear: 1,
    });
    expect(r.estimatedAnnualBenefit).toBe(425);
    expect(r.isFinanciallyRational).toBe(false);
  });

  test('mid tier heavy usage (2 dental + 1 optical + 9 physio) is financially rational', () => {
    // dental: min(350, 500)=350; optical: min(250, 250)=250; physio: min(405, 450)=405 → total 1005
    const r = calculateExtrasValue({
      ...BASE,
      extrasTier: 'mid',
      dentalVisitsPerYear: 2,
      opticalClaimsPerYear: 1,
      physioSessionsPerYear: 9,
    });
    expect(r.estimatedAnnualBenefit).toBe(1005);
    expect(r.isFinanciallyRational).toBe(true);
    expect(r.netAnnualCost).toBeLessThan(0);
  });

  test('optical benefit capped at mid sub-limit ($250)', () => {
    // 2 optical × $250 = $500, but mid cap is $250
    const r = calculateExtrasValue({ ...BASE, extrasTier: 'mid', opticalClaimsPerYear: 2 });
    expect(r.estimatedAnnualBenefit).toBe(250);
  });

  test('family multiplier: couple premium ≈ 1.8x single', () => {
    const single = calculateExtrasValue({ ...BASE, extrasTier: 'mid' });
    const couple = calculateExtrasValue({ ...BASE, extrasTier: 'mid', familyType: 'couple' });
    expect(couple.annualPremium).toBeCloseTo(single.annualPremium * 1.8, -1);
  });

  test('Tier 3 income ($200k single) receives 0% rebate — full premium charged', () => {
    const r = calculateExtrasValue({ ...BASE, extrasTier: 'mid', mlsIncome: 200000 });
    expect(r.annualPremium).toBe(900);
  });

  test('benefitRatio equals estimatedAnnualBenefit / annualPremium', () => {
    const r = calculateExtrasValue({
      ...BASE,
      extrasTier: 'mid',
      dentalVisitsPerYear: 1,
      opticalClaimsPerYear: 1,
    });
    expect(r.benefitRatio).toBeCloseTo(r.estimatedAnnualBenefit / r.annualPremium, 5);
  });
});
