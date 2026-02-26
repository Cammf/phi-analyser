# Flagship Wizard Framework + Steps 1–2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the flagship "Should I Get Private Health Insurance?" wizard framework (WizardContext, WizardContainer, page.tsx) and the first two wizard steps (About You + Income).

**Architecture:** React Context + useReducer for wizard state management. Each step is a standalone component loaded dynamically by WizardContainer. The page.tsx is a server component with SEO metadata; the wizard itself is a client component tree. Steps follow the existing form pattern (card sections with step badges, InfoTooltip, sidebar reference panels).

**Tech Stack:** Next.js 14 / TypeScript / Tailwind CSS / React Context + useReducer

---

### Task 1: Create steps directory

**Files:**
- Create directory: `src/components/wizard/steps/`

**Step 1: Create the directory**

Run: `mkdir -p "C:/Projects/1.3 Public_private health insurance Project/src/components/wizard/steps"`

This is a prerequisite for Tasks 3 and 4.

---

### Task 2: Build WizardContext.tsx

**Files:**
- Create: `src/components/wizard/WizardContext.tsx`

**Step 1: Create WizardContext with useReducer**

```tsx
'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { WizardState, WizardAction, WizardStep, WizardInputs } from '@/lib/types';

const DEFAULT_INPUTS: WizardInputs = {
  // Step 1 — About You
  age: 0,
  familyType: 'single',
  dependentChildren: 1,
  state: 'NSW',

  // Step 2 — Income
  incomeRange: 'under-90k',
  exactIncome: null,

  // Step 3 — Insurance Status
  coverStatus: 'never',
  currentTier: 'none',
  currentPremiumPerMonth: null,
  extrasOnly: false,
  yearsHeld: 1,
  yearDropped: null,

  // Step 4 — Health Needs
  includeHealthNeeds: false,
  dentalVisitsPerYear: 0,
  opticalClaimsPerYear: 0,
  physioSessionsPerYear: 0,
  plannedProcedures: [],
  extrasDesired: 'none',
};

const DEFAULT_STATE: WizardState = {
  currentStep: 1,
  inputs: DEFAULT_INPUTS,
  isComplete: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.step };
    case 'NEXT': {
      const next = Math.min(state.currentStep + 1, 5) as WizardStep;
      return { ...state, currentStep: next };
    }
    case 'PREV': {
      const prev = Math.max(state.currentStep - 1, 1) as WizardStep;
      return { ...state, currentStep: prev };
    }
    case 'UPDATE_INPUT':
      return {
        ...state,
        inputs: { ...state.inputs, ...action.payload },
      };
    case 'RESET':
      return DEFAULT_STATE;
    case 'RESTORE':
      return action.state;
    default:
      return state;
  }
}

interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  updateInputs: (payload: Partial<WizardInputs>) => void;
  goToStep: (step: WizardStep) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: WizardState;
}) {
  const [state, dispatch] = useReducer(wizardReducer, initialState ?? DEFAULT_STATE);

  const updateInputs = (payload: Partial<WizardInputs>) =>
    dispatch({ type: 'UPDATE_INPUT', payload });
  const goToStep = (step: WizardStep) =>
    dispatch({ type: 'GO_TO_STEP', step });
  const next = () => dispatch({ type: 'NEXT' });
  const prev = () => dispatch({ type: 'PREV' });
  const reset = () => dispatch({ type: 'RESET' });

  return (
    <WizardContext.Provider value={{ state, dispatch, updateInputs, goToStep, next, prev, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within a WizardProvider');
  return ctx;
}

export { DEFAULT_INPUTS, DEFAULT_STATE };
```

**Step 2: Verify no TypeScript errors**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to WizardContext.tsx

**Step 3: Commit**

```bash
git add src/components/wizard/WizardContext.tsx
git commit -m "feat: add WizardContext with useReducer state management"
```

---

### Task 3: Build Step 1 — About You

**Files:**
- Create: `src/components/wizard/steps/Step1AboutYou.tsx`

**Step 1: Create the About You step component**

This step collects: age (number input), family type (RadioCards via FamilyTypeSelector), state (RadioCards). Layout follows the existing MLS calculator pattern: 2/3 main + 1/3 sidebar.

```tsx
'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import FamilyTypeSelector from '@/components/calculator/FamilyTypeSelector';
import RadioCard from '@/components/wizard/RadioCard';
import type { State, FamilyType } from '@/lib/types';

const STATES: Array<{ value: State; label: string }> = [
  { value: 'NSW', label: 'NSW' },
  { value: 'VIC', label: 'VIC' },
  { value: 'QLD', label: 'QLD' },
  { value: 'SA',  label: 'SA' },
  { value: 'WA',  label: 'WA' },
  { value: 'TAS', label: 'TAS' },
  { value: 'ACT', label: 'ACT' },
  { value: 'NT',  label: 'NT' },
];

export default function Step1AboutYou() {
  const { state, updateInputs, next } = useWizard();
  const { age, familyType, dependentChildren, state: selectedState } = state.inputs;

  const canProceed = age >= 18 && age <= 120;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-8">
        {/* Age */}
        <section className="card">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              1
            </span>
            <h2 className="text-xl">Your age</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            Your age determines your Lifetime Health Cover loading and rebate tier.
          </p>
          <div>
            <label htmlFor="wizard-age" className="label">
              How old are you?
            </label>
            <input
              id="wizard-age"
              type="number"
              min={18}
              max={120}
              value={age || ''}
              onChange={(e) => {
                const val = e.target.value;
                updateInputs({ age: val === '' ? 0 : Math.max(0, parseInt(val, 10)) });
              }}
              placeholder="e.g. 32"
              className="input-field max-w-[200px]"
            />
          </div>
        </section>

        {/* Family type */}
        <section className="card">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              2
            </span>
            <h2 className="text-xl">Family situation</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            Your family type determines which MLS thresholds and premium structures apply.
          </p>
          <FamilyTypeSelector
            selectedType={familyType}
            dependentChildren={dependentChildren}
            onTypeChange={(type: FamilyType) => updateInputs({ familyType: type })}
            onChildrenChange={(count: number) => updateInputs({ dependentChildren: count })}
          />
        </section>

        {/* State */}
        <section className="card">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              3
            </span>
            <h2 className="text-xl">Your state</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            Ambulance cover varies by state — in some states it&apos;s free, in others it can cost
            over $1,000 per trip.
          </p>
          <fieldset>
            <legend className="sr-only">Select your state or territory</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATES.map((s) => (
                <RadioCard
                  key={s.value}
                  id={`state-${s.value}`}
                  name="state"
                  value={s.value}
                  checked={selectedState === s.value}
                  onChange={(val) => updateInputs({ state: val as State })}
                  label={s.label}
                />
              ))}
            </div>
          </fieldset>
        </section>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={next}
            disabled={!canProceed}
            className={[
              'btn-primary text-lg px-8 py-4',
              !canProceed ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            Next: Income →
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="card lg:sticky lg:top-24">
          <h3 className="text-lg mb-3">Why does this matter?</h3>

          <div className="space-y-4 text-sm text-muted">
            <div>
              <h4 className="font-semibold text-text-main mb-1">Age → LHC loading</h4>
              <p>
                If you&apos;re over 31 and don&apos;t have hospital cover, you&apos;ll pay a 2%
                loading for each year you&apos;re over 30 — up to 70%. This loading lasts 10 years
                once you do take out cover.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-main mb-1">Age → Rebate tier</h4>
              <p>
                If you&apos;re 65–69, you get a higher government rebate on your premium. Over 70,
                it&apos;s higher again — up to 32.4%.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-main mb-1">Family → MLS thresholds</h4>
              <p>
                Couples and families have double the MLS income thresholds of singles ($202,000
                vs $101,000). The threshold also increases by $1,500 for each dependent child after
                the first.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-main mb-1">State → Ambulance</h4>
              <p>
                QLD and TAS provide free ambulance for residents. In other states, a single
                emergency ambulance trip can cost $400–$6,500+. Private health insurance typically
                includes ambulance cover.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
```

**Step 2: Verify no TypeScript errors in the step file**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx tsc --noEmit --pretty 2>&1 | grep -i "step1\|error" | head -20`
Expected: No errors related to Step1AboutYou.tsx

**Step 3: Commit**

```bash
git add src/components/wizard/steps/Step1AboutYou.tsx
git commit -m "feat: add Step 1 About You wizard step (age, family, state)"
```

---

### Task 4: Build Step 2 — Income

**Files:**
- Create: `src/components/wizard/steps/Step2Income.tsx`

**Step 1: Create the Income step component**

This step uses the existing IncomeRangeSelector component, adds an InfoTooltip about MLS income, and has a sidebar with the MLS threshold table (reused from MLSCalculatorClient pattern). The sidebar dynamically shows singles or families thresholds based on the family type selected in Step 1.

```tsx
'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import IncomeRangeSelector from '@/components/calculator/IncomeRangeSelector';
import InfoTooltip from '@/components/wizard/InfoTooltip';
import type { IncomeRange } from '@/lib/types';

export default function Step2Income() {
  const { state, updateInputs, next, prev } = useWizard();
  const { incomeRange, exactIncome, familyType } = state.inputs;

  const canProceed = true; // Income range has a default, so always valid

  const isFamilyThreshold =
    familyType === 'couple' || familyType === 'family' || familyType === 'single-parent';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-8">
        <section className="card">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
              1
            </span>
            <h2 className="text-xl">Your income</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            Your income determines whether you pay the Medicare Levy Surcharge and how much
            government rebate you receive on your premium.
          </p>

          <IncomeRangeSelector
            selectedRange={incomeRange}
            exactIncome={exactIncome}
            onRangeChange={(range: IncomeRange) => updateInputs({ incomeRange: range })}
            onExactIncomeChange={(income: number | null) => updateInputs({ exactIncome: income })}
          />

          <InfoTooltip trigger="What counts as income for the surcharge?">
            <p className="mb-2">
              <strong>MLS income</strong> is not just your taxable income. It includes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Taxable income</li>
              <li>Reportable fringe benefits</li>
              <li>Net investment losses (e.g. negative gearing)</li>
              <li>Reportable super contributions</li>
              <li>Any exempt foreign employment income</li>
              <li>Net financial investment losses under family trust distributions</li>
            </ul>
            <p className="mt-2 text-muted">
              Many people underestimate their MLS income — check your tax return or use the
              ATO&apos;s income test calculator.
            </p>
          </InfoTooltip>
        </section>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prev}
            className="btn-secondary text-lg px-8 py-4"
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed}
            className={[
              'btn-primary text-lg px-8 py-4',
              !canProceed ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            Next: Insurance Status →
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="card lg:sticky lg:top-24">
          <h3 className="text-lg mb-3">Income determines two things</h3>

          <div className="space-y-4 text-sm text-muted">
            <div>
              <h4 className="font-semibold text-text-main mb-1">1. Medicare Levy Surcharge</h4>
              <p>
                If your income is above the threshold and you don&apos;t have hospital cover, you
                pay an extra 1–1.5% tax on top of the standard 2% Medicare Levy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-main mb-1">2. Government rebate</h4>
              <p>
                Lower-income earners get a higher rebate (up to 24.3% under 65), reducing the
                cost of their premium. Higher earners (Tier 3) get no rebate at all.
              </p>
            </div>
          </div>

          {/* Threshold table */}
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">
              FY 2025–26 thresholds{' '}
              <span className="font-normal text-muted">
                ({isFamilyThreshold ? 'families' : 'singles'})
              </span>
            </h4>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 font-semibold text-text-main bg-transparent">Income</th>
                  <th className="text-right py-1.5 font-semibold text-text-main bg-transparent">MLS</th>
                </tr>
              </thead>
              <tbody>
                {isFamilyThreshold ? (
                  <>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$0 – $202,000</td>
                      <td className="text-right py-1.5 text-secondary font-medium">0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$202,001 – $236,000</td>
                      <td className="text-right py-1.5 font-medium">1.0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$236,001 – $316,000</td>
                      <td className="text-right py-1.5 font-medium">1.25%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">$316,001+</td>
                      <td className="text-right py-1.5 font-medium">1.5%</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$0 – $101,000</td>
                      <td className="text-right py-1.5 text-secondary font-medium">0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$101,001 – $118,000</td>
                      <td className="text-right py-1.5 font-medium">1.0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-1.5">$118,001 – $158,000</td>
                      <td className="text-right py-1.5 font-medium">1.25%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">$158,001+</td>
                      <td className="text-right py-1.5 font-medium">1.5%</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {isFamilyThreshold && (
              <p className="text-xs text-muted mt-2">
                Family thresholds increase by $1,500 for each dependent child after the first.
              </p>
            )}

            <p className="text-xs text-muted mt-2">
              Source: ATO, FY 2025–26.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
```

**Step 2: Verify no TypeScript errors**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors — all imports resolve, types match.

**Step 3: Commit**

```bash
git add src/components/wizard/steps/Step2Income.tsx
git commit -m "feat: add Step 2 Income wizard step with MLS threshold sidebar"
```

---

### Task 5: Build WizardContainer.tsx

**Files:**
- Create: `src/components/wizard/WizardContainer.tsx`

**Step 1: Create WizardContainer that dynamically renders steps**

```tsx
'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import WizardProgress from '@/components/wizard/WizardProgress';
import Step1AboutYou from '@/components/wizard/steps/Step1AboutYou';
import Step2Income from '@/components/wizard/steps/Step2Income';

// Steps 3–5 will be imported here as they are built in later tasks

export default function WizardContainer() {
  const { state } = useWizard();

  function renderStep() {
    switch (state.currentStep) {
      case 1:
        return <Step1AboutYou />;
      case 2:
        return <Step2Income />;
      // case 3: return <Step3InsuranceStatus />;
      // case 4: return <Step4HealthNeeds />;
      // case 5: return <Step5Review />;
      default:
        return <Step1AboutYou />;
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="mb-3">Should I Get Private Health Insurance?</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Answer a few questions and we&apos;ll compare the real cost of insurance vs going
          without — based on your income, age, and situation.
        </p>
      </div>

      <WizardProgress currentStep={state.currentStep} />

      {renderStep()}
    </div>
  );
}
```

**Step 2: Verify no TypeScript errors**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: Clean — all Step imports resolve.

**Step 3: Commit**

```bash
git add src/components/wizard/WizardContainer.tsx
git commit -m "feat: add WizardContainer with step routing and progress bar"
```

---

### Task 6: Build the flagship page.tsx (server component)

**Files:**
- Create: `src/app/should-i-get-private-health-insurance/page.tsx`

**Step 1: Create server page with metadata + JSON-LD**

```tsx
import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import { WizardProvider } from '@/components/wizard/WizardContext';
import WizardContainer from '@/components/wizard/WizardContainer';

export const metadata: Metadata = {
  title: `Should I Get Private Health Insurance? Calculator 2026 | ${SITE_NAME}`,
  description:
    'Compare the real cost of private health insurance vs going without. Personalised analysis based on your income, age, family situation, and health needs. FY 2025–26 rates.',
  alternates: {
    canonical: `${SITE_URL}/should-i-get-private-health-insurance`,
  },
  openGraph: {
    title: 'Should I Get Private Health Insurance? | Free Calculator',
    description:
      'Find out if private health insurance saves you money or costs you more — personalised to your situation.',
    url: `${SITE_URL}/should-i-get-private-health-insurance`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function ShouldIGetPHIPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Private Health Insurance Calculator',
    description:
      'Compare the cost of private health insurance vs going without — personalised to your income, age, and situation.',
    url: `${SITE_URL}/should-i-get-private-health-insurance`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
    },
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WizardProvider>
        <WizardContainer />
      </WizardProvider>
    </>
  );
}
```

**Step 2: Verify the page compiles**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: Clean compilation, no errors.

**Step 3: Commit**

```bash
git add src/app/should-i-get-private-health-insurance/page.tsx
git commit -m "feat: add flagship wizard page with metadata and JSON-LD"
```

---

### Task 7: Check for btn-secondary class and add if missing

**Files:**
- Potentially modify: `src/app/globals.css`

**Step 1: Check if btn-secondary exists**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && grep -r "btn-secondary" src/ --include="*.css" --include="*.tsx" | head -10`

**Step 2: If btn-secondary doesn't exist in globals.css, add it**

Look for the existing `btn-primary` definition in `globals.css` and add a matching `btn-secondary` class below it. It should use a muted background with primary text:

```css
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold
    bg-card text-text-main border border-border
    hover:bg-gray-100 dark:hover:bg-gray-800
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    transition-colors duration-150;
}
```

**Step 3: Commit if changes were made**

```bash
git add src/app/globals.css
git commit -m "feat: add btn-secondary utility class"
```

---

### Task 8: Update SiteNav links for flagship calculator

**Files:**
- Modify: `src/components/layout/SiteNav.tsx`

**Step 1: Check if the flagship link is already in SiteNav**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && grep -n "should-i-get" src/components/layout/SiteNav.tsx`

**Step 2: If missing, add the flagship calculator link**

Find the calculators dropdown/links section and add:
```tsx
{ href: '/should-i-get-private-health-insurance', label: 'Should I Get PHI?' }
```

Make it the first item in the calculators list (it's the flagship).

**Step 3: Commit if changes were made**

```bash
git add src/components/layout/SiteNav.tsx
git commit -m "feat: add flagship calculator link to SiteNav"
```

---

### Task 9: Update sitemap.ts for the new page

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Add the flagship wizard page to the sitemap**

Find the existing sitemap entries and add:
```tsx
{
  url: `${SITE_URL}/should-i-get-private-health-insurance`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.9,
},
```

Priority 0.9 — same as MLS and LHC calculators. Do NOT add the `/results` route (results pages are excluded).

**Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add flagship calculator to sitemap"
```

---

### Task 10: Full integration test

**Step 1: Run TypeScript compilation check**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx tsc --noEmit --pretty`
Expected: Clean compilation, no errors.

**Step 2: Run the full test suite**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx jest --passWithNoTests`
Expected: All 132 existing tests pass. No new tests broken.

**Step 3: Run dev server and verify the page loads**

Run: `cd "C:/Projects/1.3 Public_private health insurance Project" && npx next dev -p 3002`
Navigate to: `http://localhost:3002/should-i-get-private-health-insurance`
Expected: Wizard page loads with Step 1 visible — age input, family type RadioCards, state RadioCards, sidebar with "Why does this matter?" content, progress bar showing "Step 1 of 5".

**Step 4: Verify step navigation**

- Enter age 32, select "Single", select "NSW", click "Next: Income →"
- Expected: Step 2 loads with income range selector, MLS threshold sidebar (singles table), "← Back" button, "Next: Insurance Status →" button
- Click "← Back" — should return to Step 1 with values preserved
- Expected: Age still shows 32, Single still selected, NSW still selected

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete tasks 7.3, 7.4, 7.5 — flagship wizard framework with steps 1-2"
```

---

## Execution Order

Tasks must be executed in this order due to dependencies:

1. **Task 1** — Create steps directory (prerequisite)
2. **Task 2** — WizardContext.tsx
3. **Task 3** — Step1AboutYou.tsx
4. **Task 4** — Step2Income.tsx
5. **Task 5** — WizardContainer.tsx (imports Steps 1 & 2)
6. **Task 6** — page.tsx (imports WizardProvider + WizardContainer)
7. **Task 7** — btn-secondary check/add
8. **Task 8** — SiteNav update
9. **Task 9** — Sitemap update
10. **Task 10** — Full integration verification
