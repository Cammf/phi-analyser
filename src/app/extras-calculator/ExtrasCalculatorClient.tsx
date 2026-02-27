'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IncomeRangeSelector from '@/components/calculator/IncomeRangeSelector';
import FamilyTypeSelector from '@/components/calculator/FamilyTypeSelector';
import RadioCard from '@/components/wizard/RadioCard';
import type { IncomeRange, FamilyType, ExtrasTier } from '@/lib/types';

const EXTRAS_TIER_OPTIONS: Array<{ value: ExtrasTier; label: string; description: string }> = [
  { value: 'basic',         label: 'Basic extras',  description: '~$540/yr — dental + optical basics' },
  { value: 'mid',           label: 'Mid extras',    description: '~$900/yr — dental + optical + physio' },
  { value: 'comprehensive', label: 'Comprehensive', description: '~$1,380/yr — full extras cover' },
];

const DENTAL_OPTIONS  = [
  { value: 0, label: 'None',    description: 'No dental visits planned' },
  { value: 1, label: '1/year',  description: 'Annual check-up' },
  { value: 2, label: '2/year',  description: 'Check-up + treatment' },
  { value: 3, label: '3+/year', description: 'Frequent visits' },
];

const OPTICAL_OPTIONS = [
  { value: 0, label: 'None',    description: 'No optical claims' },
  { value: 1, label: '1/year',  description: 'Annual frames/lenses' },
  { value: 2, label: '2+/year', description: 'Contact lenses + glasses' },
];

const PHYSIO_OPTIONS  = [
  { value: 0,  label: 'None',      description: 'No physio sessions' },
  { value: 3,  label: '1–5/year',  description: 'Occasional sessions' },
  { value: 9,  label: '6–12/year', description: 'Regular treatment' },
  { value: 13, label: '12+/year',  description: 'Ongoing rehab' },
];

const CHIRO_OPTIONS   = [
  { value: 0, label: 'None',     description: 'No chiro sessions' },
  { value: 3, label: '1–5/year', description: 'Occasional sessions' },
  { value: 9, label: '6+/year',  description: 'Regular treatment' },
];

export default function ExtrasCalculatorClient() {
  const router = useRouter();

  const [incomeRange, setIncomeRange]    = useState<IncomeRange | null>(null);
  const [exactIncome, setExactIncome]    = useState<number | null>(null);
  const [familyType, setFamilyType]      = useState<FamilyType | null>(null);
  const [dependentChildren, setChildren] = useState(1);
  const [extrasTier, setExtrasTier]      = useState<ExtrasTier | null>(null);
  const [dental, setDental]              = useState(0);
  const [optical, setOptical]            = useState(0);
  const [physio, setPhysio]              = useState(0);
  const [chiro, setChiro]                = useState(0);

  const canCalculate = incomeRange !== null && familyType !== null && extrasTier !== null;

  function handleCalculate() {
    if (!canCalculate) return;
    const params = new URLSearchParams();
    params.set('range',  incomeRange);
    if (exactIncome !== null) params.set('income', String(exactIncome));
    params.set('family', familyType);
    if (familyType === 'family' || familyType === 'single-parent') {
      params.set('children', String(dependentChildren));
    }
    params.set('tier',   extrasTier);
    params.set('dental', String(dental));
    params.set('optical', String(optical));
    params.set('physio', String(physio));
    params.set('chiro',  String(chiro));
    router.push(`/extras-calculator/results?${params.toString()}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="mb-3">Extras Cover Break-Even Calculator</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Find out whether adding extras (general treatment) cover to your policy is worth the
          cost. Enter your expected usage and we&apos;ll show you whether you&apos;d come out
          ahead or behind. Based on average benefit data for FY 2025–26.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-8">

          {/* Step 1: Income */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">1</span>
              <h2 className="text-xl">Your income</h2>
            </div>
            <p className="text-sm text-muted mb-4">Used to calculate your government rebate on the extras premium.</p>
            <IncomeRangeSelector
              selectedRange={incomeRange}
              exactIncome={exactIncome}
              onRangeChange={setIncomeRange}
              onExactIncomeChange={setExactIncome}
            />
          </section>

          {/* Step 2: Family type */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">2</span>
              <h2 className="text-xl">Family situation</h2>
            </div>
            <p className="text-sm text-muted mb-4">Family policies cost more but cover all family members.</p>
            <FamilyTypeSelector
              selectedType={familyType}
              dependentChildren={dependentChildren}
              onTypeChange={setFamilyType}
              onChildrenChange={setChildren}
            />
          </section>

          {/* Step 3: Extras tier */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">3</span>
              <h2 className="text-xl">Extras cover level</h2>
            </div>
            <p className="text-sm text-muted mb-4">Which tier are you considering? Premium shown for single adult before rebate.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EXTRAS_TIER_OPTIONS.map((opt) => (
                <RadioCard
                  key={opt.value}
                  id={`tier-${opt.value}`}
                  name="extrasTier"
                  value={opt.value}
                  checked={extrasTier === opt.value}
                  onChange={(val) => setExtrasTier(val as ExtrasTier)}
                  label={opt.label}
                  description={opt.description}
                />
              ))}
            </div>
          </section>

          {/* Step 4: Usage */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">4</span>
              <h2 className="text-xl">Your expected usage</h2>
            </div>
            <p className="text-sm text-muted mb-6">
              How often do you use each service? We&apos;ll estimate your likely insurance benefit.
            </p>

            {/* Dental */}
            <div className="mb-6">
              <h3 className="font-semibold mb-1">Dental visits per year</h3>
              <p className="text-sm text-muted mb-3">Check-ups, cleans, fillings — typical benefit $175/visit.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DENTAL_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`dental-${opt.value}`}
                    name="dental"
                    value={String(opt.value)}
                    checked={dental === opt.value}
                    onChange={(val) => setDental(parseInt(val, 10))}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </div>

            {/* Optical */}
            <div className="mb-6">
              <h3 className="font-semibold mb-1">Optical claims per year</h3>
              <p className="text-sm text-muted mb-3">Glasses or contact lenses — typical benefit $250/claim.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {OPTICAL_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`optical-${opt.value}`}
                    name="optical"
                    value={String(opt.value)}
                    checked={optical === opt.value}
                    onChange={(val) => setOptical(parseInt(val, 10))}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </div>

            {/* Physio */}
            <div className="mb-6">
              <h3 className="font-semibold mb-1">Physio sessions per year</h3>
              <p className="text-sm text-muted mb-3">Physiotherapy sessions — typical benefit $45/session.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PHYSIO_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`physio-${opt.value}`}
                    name="physio"
                    value={String(opt.value)}
                    checked={physio === opt.value}
                    onChange={(val) => setPhysio(parseInt(val, 10))}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </div>

            {/* Chiro */}
            <div>
              <h3 className="font-semibold mb-1">Chiropractic sessions per year</h3>
              <p className="text-sm text-muted mb-3">Chiro sessions — typical benefit $40/session.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CHIRO_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`chiro-${opt.value}`}
                    name="chiro"
                    value={String(opt.value)}
                    checked={chiro === opt.value}
                    onChange={(val) => setChiro(parseInt(val, 10))}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className={[
              'w-full sm:w-auto btn-primary text-lg px-8 py-4',
              !canCalculate ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            Calculate My Extras Value
          </button>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card lg:sticky lg:top-24">
            <h3 className="text-lg mb-3">Extras cover: the honest picture</h3>
            <div className="space-y-4 text-sm text-muted">
              <div>
                <p className="font-medium text-text-main">Industry-wide: less than 45¢ back</p>
                <p>APRA data shows that for every dollar paid in extras premiums, the average Australian gets back less than 45 cents in benefits. Most people lose money.</p>
              </div>
              <div>
                <p className="font-medium text-text-main">But heavy users can break even</p>
                <p>Regular physio, glasses every year, and 2+ dental visits can tip the balance — especially with mid or comprehensive cover.</p>
              </div>
              <div>
                <p className="font-medium text-text-main">Sub-limits cap what you can claim</p>
                <p>Even if your usage is high, annual caps per service category limit your total benefit. Basic dental cap is typically $250–$400/year.</p>
              </div>
              <div>
                <p className="font-medium text-text-main">Government rebate reduces the premium</p>
                <p>If your income is below $158,001 (single), you&apos;ll receive a rebate of 8–24% on your extras premium — which is factored into this calculation.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
