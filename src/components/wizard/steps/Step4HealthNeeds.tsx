'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import RadioCard from '@/components/wizard/RadioCard';
import type { ProcedureType, ExtrasTier } from '@/lib/types';

const DENTAL_OPTIONS = [
  { value: 0, label: 'None',  description: 'No dental visits planned' },
  { value: 1, label: '1/year', description: 'Annual check-up' },
  { value: 2, label: '2/year', description: 'Check-up + treatment' },
  { value: 3, label: '3+/year', description: 'Frequent visits' },
];

const OPTICAL_OPTIONS = [
  { value: 0, label: 'None',   description: 'No optical claims' },
  { value: 1, label: '1/year', description: 'Annual frames/lenses' },
  { value: 2, label: '2+/year', description: 'Contact lenses + glasses' },
];

const PHYSIO_OPTIONS = [
  { value: 0,  label: 'None',    description: 'No physio or chiro' },
  { value: 3,  label: '1–5/year', description: 'Occasional sessions' },
  { value: 9,  label: '6–12/year', description: 'Regular treatment' },
  { value: 13, label: '12+/year', description: 'Ongoing rehab' },
];

const EXTRAS_OPTIONS: Array<{ value: ExtrasTier; label: string; description: string }> = [
  { value: 'none',          label: 'None',          description: 'No extras cover needed' },
  { value: 'basic',         label: 'Basic extras',  description: 'Dental + optical basics (~$540/yr)' },
  { value: 'mid',           label: 'Mid extras',    description: 'Dental + optical + physio (~$900/yr)' },
  { value: 'comprehensive', label: 'Comprehensive', description: 'Full extras cover (~$1,380/yr)' },
];

const PROCEDURE_OPTIONS: Array<{ value: ProcedureType; label: string }> = [
  { value: 'knee_replacement', label: 'Hip or knee replacement' },
  { value: 'cataract',         label: 'Cataract surgery' },
  { value: 'tonsillectomy',    label: 'Tonsillectomy' },
  { value: 'septoplasty',      label: 'Nose/septum surgery' },
  { value: 'shoulder_surgery', label: 'Shoulder surgery' },
  { value: 'colonoscopy',      label: 'Colonoscopy' },
  { value: 'cabg',             label: 'Heart surgery (CABG)' },
];

export default function Step4HealthNeeds() {
  const { state, updateInputs, next, prev, goToStep } = useWizard();
  const {
    includeHealthNeeds,
    dentalVisitsPerYear,
    opticalClaimsPerYear,
    physioSessionsPerYear,
    plannedProcedures,
    extrasDesired,
  } = state.inputs;

  function toggleProcedure(proc: ProcedureType) {
    const current = plannedProcedures;
    const updated = current.includes(proc)
      ? current.filter((p) => p !== proc)
      : [...current, proc];
    updateInputs({ plannedProcedures: updated });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── Main form ── */}
      <div className="lg:col-span-2 space-y-8">
        {/* Opt-in / opt-out */}
        <section className="card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              1
            </span>
            <h2 className="text-xl font-semibold">Include your health needs? (optional)</h2>
          </div>
          <p className="text-muted mb-4">
            If you tell us about your expected health usage, we can estimate how much you&apos;d
            actually claim — and whether extras cover is worth it for you specifically.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RadioCard
              id="health-needs-yes"
              name="includeHealthNeeds"
              value="yes"
              checked={includeHealthNeeds}
              onChange={() => updateInputs({ includeHealthNeeds: true })}
              label="Yes, include my health needs"
              description="Get a personalised extras break-even estimate"
            />
            <RadioCard
              id="health-needs-no"
              name="includeHealthNeeds"
              value="no"
              checked={!includeHealthNeeds}
              onChange={() => updateInputs({ includeHealthNeeds: false })}
              label="No, just compare costs"
              description="Skip to the review step"
            />
          </div>
        </section>

        {/* Conditional health details */}
        {includeHealthNeeds && (
          <>
            {/* Dental */}
            <section className="card">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
                  2
                </span>
                <h2 className="text-xl font-semibold">Dental visits per year</h2>
              </div>
              <p className="text-muted mb-4">
                A typical check-up + clean costs $250–$350. Extras cover typically pays
                $160–$220 per visit (subject to annual limits).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DENTAL_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`dental-${opt.value}`}
                    name="dentalVisits"
                    value={String(opt.value)}
                    checked={dentalVisitsPerYear === opt.value}
                    onChange={() => updateInputs({ dentalVisitsPerYear: opt.value })}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </section>

            {/* Optical */}
            <section className="card">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
                  3
                </span>
                <h2 className="text-xl font-semibold">Optical claims per year</h2>
              </div>
              <p className="text-muted mb-4">
                New glasses or contact lenses typically cost $350–$600. Extras cover
                pays $200–$300 (subject to annual limits).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {OPTICAL_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`optical-${opt.value}`}
                    name="opticalClaims"
                    value={String(opt.value)}
                    checked={opticalClaimsPerYear === opt.value}
                    onChange={() => updateInputs({ opticalClaimsPerYear: opt.value })}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </section>

            {/* Physio / chiro */}
            <section className="card">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
                  4
                </span>
                <h2 className="text-xl font-semibold">Physio or chiro sessions per year</h2>
              </div>
              <p className="text-muted mb-4">
                A session costs $70–$120. Extras cover typically pays $35–$55 per session
                (subject to annual limits, usually capped at $500–$800/year).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PHYSIO_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`physio-${opt.value}`}
                    name="physioSessions"
                    value={String(opt.value)}
                    checked={physioSessionsPerYear === opt.value}
                    onChange={() => updateInputs({ physioSessionsPerYear: opt.value })}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </section>

            {/* Planned procedures */}
            <section className="card">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
                  5
                </span>
                <h2 className="text-xl font-semibold">Planned procedures (optional)</h2>
              </div>
              <p className="text-muted mb-4">
                Are you planning any of the following in the next few years? These affect
                whether private cover is likely worth it — and which tier you&apos;d need.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROCEDURE_OPTIONS.map((proc) => (
                  <label
                    key={proc.value}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={plannedProcedures.includes(proc.value)}
                      onChange={() => toggleProcedure(proc.value)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-main">{proc.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Extras desired */}
            <section className="card">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
                  6
                </span>
                <h2 className="text-xl font-semibold">Extras cover level (if any)</h2>
              </div>
              <p className="text-muted mb-4">
                Are you considering adding extras (general treatment) cover to any hospital
                policy? This affects the break-even analysis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXTRAS_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`extras-${opt.value}`}
                    name="extrasDesired"
                    value={opt.value}
                    checked={extrasDesired === opt.value}
                    onChange={(val) => updateInputs({ extrasDesired: val as ExtrasTier })}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            className="btn-secondary text-lg px-8 py-4"
            onClick={() => prev()}
          >
            &larr; Back
          </button>
          <button
            type="button"
            className="btn-primary text-lg px-8 py-4"
            onClick={() => {
              if (!includeHealthNeeds) {
                goToStep(5);
              } else {
                next();
              }
            }}
          >
            {includeHealthNeeds ? 'Next: Review & Calculate \u2192' : 'Skip to Review \u2192'}
          </button>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className="lg:col-span-1">
        <div className="card lg:sticky lg:top-24">
          <h3 className="text-lg font-semibold mb-4">Why this matters</h3>

          <div className="space-y-4 text-sm text-muted">
            <div>
              <p className="font-medium text-text-main">Extras: often poor value</p>
              <p>
                APRA data shows that for every dollar paid in extras premiums, less than
                45 cents comes back as benefits. Most people lose money on extras cover.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">But heavy users can break even</p>
              <p>
                If you have 2+ dental visits per year, wear glasses, and do regular physio,
                extras cover may break even or save money — especially at higher tiers.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">Sub-limits cap your claims</p>
              <p>
                Extras cover has annual limits per service category ($300–$800 typical for
                dental). Even if you have claims, you can&apos;t claim more than the annual cap.
              </p>
            </div>

            <div>
              <p className="font-medium text-text-main">Gap fees apply to hospital too</p>
              <p>
                Even with hospital cover, you&apos;ll often pay a gap fee. The average gap per
                hospital episode is $478. Ask your doctor upfront about no-gap arrangements.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
