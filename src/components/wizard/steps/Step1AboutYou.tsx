'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import FamilyTypeSelector from '@/components/calculator/FamilyTypeSelector';
import RadioCard from '@/components/wizard/RadioCard';
import type { State, FamilyType } from '@/lib/types';

const STATE_OPTIONS: State[] = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];

export default function Step1AboutYou() {
  const { state, updateInputs, next } = useWizard();
  const { age, familyType, dependentChildren, state: selectedState } = state.inputs;

  const isValid = age >= 18 && age <= 120;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── Main form ─────────────────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-8">
        {/* Card 1: Your age */}
        <section className="card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              1
            </span>
            <h2 className="text-xl font-semibold">Your age</h2>
          </div>
          <p className="text-muted mb-4">
            Your age affects your Lifetime Health Cover loading (2% per year over 30)
            and your private health insurance rebate tier.
          </p>
          <label htmlFor="wizard-age" className="label mb-1 block">
            Age
          </label>
          <input
            id="wizard-age"
            type="number"
            min={18}
            max={120}
            placeholder="e.g. 32"
            className="input-field max-w-[200px]"
            value={age || ''}
            onChange={(e) =>
              updateInputs({ age: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })
            }
          />
        </section>

        {/* Card 2: Family situation */}
        <section className="card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              2
            </span>
            <h2 className="text-xl font-semibold">Family situation</h2>
          </div>
          <p className="text-muted mb-4">
            Your family situation determines which Medicare Levy Surcharge thresholds
            apply and whether you need family or singles cover.
          </p>
          <FamilyTypeSelector
            selectedType={familyType}
            dependentChildren={dependentChildren}
            onTypeChange={(val: FamilyType) => updateInputs({ familyType: val })}
            onChildrenChange={(val: number) => updateInputs({ dependentChildren: val })}
          />
        </section>

        {/* Card 3: Your state */}
        <section className="card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              3
            </span>
            <h2 className="text-xl font-semibold">Your state</h2>
          </div>
          <p className="text-muted mb-4">
            Ambulance cover varies significantly by state &mdash; in some states it&apos;s
            free, while in others a single trip can cost thousands.
          </p>
          <fieldset>
            <legend className="sr-only">Select your state or territory</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATE_OPTIONS.map((s) => (
                <RadioCard
                  key={s}
                  id={`state-${s}`}
                  name="state"
                  value={s}
                  checked={selectedState === s}
                  onChange={(val) => updateInputs({ state: val as State })}
                  label={s}
                />
              ))}
            </div>
          </fieldset>
        </section>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!isValid}
            onClick={() => next()}
            className={`btn-primary text-lg px-8 py-4${!isValid ? ' opacity-50 cursor-not-allowed' : ''}`}
          >
            Next: Income &rarr;
          </button>
        </div>
      </div>

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="lg:col-span-1">
        <div className="card lg:sticky lg:top-24">
          <h3 className="text-lg font-semibold mb-4">Why does this matter?</h3>

          <div className="space-y-4 text-sm text-muted">
            <div>
              <p className="font-medium text-text-main">Age &rarr; LHC loading</p>
              <p>
                If you don&apos;t have hospital cover by age 31, you&apos;ll pay 2% extra per
                year on your premiums &mdash; up to 70%. This loading lasts 10 continuous
                years of cover.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">Age &rarr; Rebate tier</p>
              <p>
                Australians aged 65&ndash;69 receive a higher government rebate on their
                premiums. Those 70+ can receive up to 32.4%.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">Family &rarr; MLS thresholds</p>
              <p>
                Families can earn up to $202k before the Medicare Levy Surcharge applies,
                vs $101k for singles. The threshold increases by $1,500 per dependent child
                after the first.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">State &rarr; Ambulance</p>
              <p>
                QLD and TAS provide free ambulance for residents. In other states, a single
                emergency trip can cost $400&ndash;$6,500+.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
