'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioCard from '@/components/wizard/RadioCard';
import InfoTooltip from '@/components/wizard/InfoTooltip';

type CoverHistory = 'never' | 'currently' | 'used-to';

export default function LHCCalculatorClient() {
  const router = useRouter();

  const [age, setAge] = useState<number | ''>('');
  const [coverHistory, setCoverHistory] = useState<CoverHistory | null>(null);
  const [yearsHeld, setYearsHeld] = useState<number>(1);
  const [deferAge, setDeferAge] = useState<number | ''>('');

  const canCalculate = age !== '' && age >= 18 && age <= 100 && coverHistory !== null;

  function handleCalculate() {
    if (!canCalculate) return;

    const params = new URLSearchParams();
    params.set('age', String(age));
    params.set('cover', coverHistory!);
    if (coverHistory === 'currently') {
      params.set('years', String(yearsHeld));
    }
    if (deferAge !== '' && deferAge > (age as number)) {
      params.set('defer', String(deferAge));
    }

    router.push(`/lhc-loading-calculator/results?${params.toString()}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="mb-3">Lifetime Health Cover Loading Calculator</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Find out how much extra you&apos;ll pay on your hospital premium due to LHC loading,
          and what it costs to wait. Based on current Government rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Age */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">1</span>
              <h2 className="text-xl">Your age</h2>
            </div>
            <p className="text-sm text-muted mb-4">LHC loading is based on how old you are when you first take out hospital cover.</p>

            <label htmlFor="age-input" className="label">Current age</label>
            <input
              id="age-input"
              type="number"
              min={18}
              max={100}
              value={age}
              onChange={(e) => {
                const val = e.target.value;
                setAge(val === '' ? '' : parseInt(val, 10));
              }}
              placeholder="e.g. 34"
              className="input-field max-w-[160px]"
            />
          </section>

          {/* Step 2: Cover history */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">2</span>
              <h2 className="text-xl">Hospital cover history</h2>
            </div>
            <p className="text-sm text-muted mb-4">Have you held private hospital cover before?</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <RadioCard
                id="cover-never"
                name="coverHistory"
                value="never"
                checked={coverHistory === 'never'}
                onChange={() => setCoverHistory('never')}
                label="Never had cover"
                description="Never held hospital insurance"
              />
              <RadioCard
                id="cover-currently"
                name="coverHistory"
                value="currently"
                checked={coverHistory === 'currently'}
                onChange={() => setCoverHistory('currently')}
                label="I have cover now"
                description="Currently holding hospital cover"
              />
              <RadioCard
                id="cover-used-to"
                name="coverHistory"
                value="used-to"
                checked={coverHistory === 'used-to'}
                onChange={() => setCoverHistory('used-to')}
                label="Used to have it"
                description="Had cover but dropped it"
              />
            </div>

            {coverHistory === 'currently' && (
              <div className="mt-4">
                <label htmlFor="years-held" className="label">
                  How many years have you held hospital cover continuously?
                </label>
                <select
                  id="years-held"
                  value={yearsHeld}
                  onChange={(e) => setYearsHeld(parseInt(e.target.value, 10))}
                  className="input-field max-w-[200px]"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'year' : 'years'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {coverHistory === 'used-to' && (
              <p className="mt-3 text-sm text-muted">
                If you&apos;ve dropped cover for more than 3 years (1,094 days), your loading
                will have reset and accumulated since you turned 31. We&apos;ll calculate
                as if you&apos;re taking out new cover now.
              </p>
            )}
          </section>

          {/* Optional: Deferral age */}
          <section className="card">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-border text-muted text-sm font-bold">?</span>
              <h2 className="text-xl">What if I wait? <span className="text-sm font-normal text-muted">(optional)</span></h2>
            </div>
            <p className="text-sm text-muted mb-4">
              Enter a future age to see how much more the loading would cost if you delay getting cover.
            </p>
            <label htmlFor="defer-age" className="label">Age you&apos;re considering waiting until</label>
            <input
              id="defer-age"
              type="number"
              min={age !== '' ? (age as number) + 1 : 19}
              max={100}
              value={deferAge}
              onChange={(e) => {
                const val = e.target.value;
                setDeferAge(val === '' ? '' : parseInt(val, 10));
              }}
              placeholder="e.g. 40"
              className="input-field max-w-[160px]"
            />
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
            Calculate My Loading
          </button>
        </div>

        {/* Sidebar — StepAside */}
        <aside className="lg:col-span-1">
          <div className="card lg:sticky lg:top-24">
            <h3 className="text-lg mb-3">The Lifetime Health Cover loading</h3>
            <p className="text-sm text-muted mb-3">
              LHC loading is an extra charge on your hospital premium if you don&apos;t take out
              cover by 1 July after your 31st birthday. The loading increases the longer you wait.
            </p>

            <h4 className="font-semibold text-sm mb-2">How loading is calculated</h4>
            <ul className="text-sm text-muted space-y-2 mb-4">
              <li><strong>2% per year</strong> for each year over 30 without cover</li>
              <li><strong>Capped at 70%</strong> (maximum loading)</li>
              <li><strong>Removed after 10 years</strong> of continuous hospital cover</li>
              <li><strong>3-year grace period</strong> (1,094 days) — you can drop cover for up to 3 years without the loading increasing</li>
            </ul>

            <h4 className="font-semibold text-sm mb-2">Loading by age (no prior cover)</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 font-semibold text-text-main bg-transparent">Age at joining</th>
                  <th className="text-right py-1.5 font-semibold text-text-main bg-transparent">Loading</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-1.5">30 or under</td>
                  <td className="text-right py-1.5 text-secondary font-medium">0%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5">35</td>
                  <td className="text-right py-1.5 font-medium">10%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5">40</td>
                  <td className="text-right py-1.5 font-medium">20%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5">45</td>
                  <td className="text-right py-1.5 font-medium">30%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5">50</td>
                  <td className="text-right py-1.5 font-medium">40%</td>
                </tr>
                <tr>
                  <td className="py-1.5">65+</td>
                  <td className="text-right py-1.5 font-medium">70% (cap)</td>
                </tr>
              </tbody>
            </table>

            <InfoTooltip trigger="What about the youth discount?">
              <p className="mb-2">
                If you take out hospital cover <strong>between ages 18 and 29</strong>, you may receive
                a discount of up to 10% on your premium:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Age 18–25: 10% discount</li>
                <li>Age 26: 8%</li>
                <li>Age 27: 6%</li>
                <li>Age 28: 4%</li>
                <li>Age 29: 2%</li>
              </ul>
              <p className="mt-2">
                The discount is frozen until age 41, then phases out at 2% per year.
                Note: this discount is optional for insurers — not all offer it.
              </p>
            </InfoTooltip>
          </div>
        </aside>
      </div>
    </div>
  );
}
