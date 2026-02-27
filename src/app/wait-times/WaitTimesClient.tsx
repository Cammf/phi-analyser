'use client';

import { useState } from 'react';
import Link from 'next/link';
import waitTimeData from '@/data/procedures/wait-times.json';
import maternityData from '@/data/procedures/maternity.json';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDays(days: number): string {
  if (days >= 365) return `~${(days / 365).toFixed(1)} years`;
  if (days >= 30) return `~${Math.round(days / 30)} months`;
  return `${days} days`;
}

function getCoverTierFromRequired(coverRequired: string): string {
  const lower = coverRequired.toLowerCase();
  if (lower.includes('silver')) return 'silver';
  if (lower.includes('gold'))   return 'gold';
  if (lower.includes('bronze')) return 'bronze';
  return 'basic';
}

const TIER_BADGE_COLORS: Record<string, string> = {
  basic:
    'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
  bronze:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
  silver:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  gold:
    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500',
};

// ── Types ────────────────────────────────────────────────────────────────────

interface Procedure {
  id: string;
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

// ── Component ────────────────────────────────────────────────────────────────

export default function WaitTimesClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const procedures = waitTimeData.procedures as Procedure[];
  const displayed = selectedId
    ? procedures.filter((p) => p.id === selectedId)
    : procedures;

  const selectedProcedure = selectedId
    ? procedures.find((p) => p.id === selectedId) ?? null
    : null;

  const privateBenefits = maternityData.private.benefits as string[];
  const publicBenefits = maternityData.public.benefits as string[];
  const cSectionPrivate = maternityData.private.cSectionRate.private;
  const cSectionPublic = maternityData.private.cSectionRate.public;
  const clinicalOutcomes = maternityData.comparison.clinicalOutcomes;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      {/* ── Page header ── */}
      <section>
        <h1 className="text-h1 text-text-main mb-4">
          Private vs Public Hospital Wait Times
        </h1>
        <p className="text-base text-muted max-w-3xl">
          For elective procedures, public hospital wait times in Australia can
          stretch from months to years. Private cover lets you bypass the queue
          — but only if your tier covers the procedure. Data sourced from{' '}
          <a
            href="https://www.aihw.gov.au/reports/hospitals/elective-surgery-waiting-times-2023-24"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            AIHW Elective Surgery Waiting Times 2023–24
          </a>
          . Private estimates are industry averages.
        </p>
      </section>

      {/* ── Filter pills ── */}
      <section>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedId(null)}
            aria-pressed={selectedId === null}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedId === null
                ? 'bg-primary text-white border-primary'
                : 'border-border text-muted hover:border-primary hover:text-primary'
            }`}
          >
            All procedures
          </button>
          {procedures.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
              aria-pressed={selectedId === p.id}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedId === p.id
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Wait times table ── */}
      <section>
        <div className="bg-card rounded border border-border shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th scope="col" className="text-left px-4 py-3 font-semibold text-text-main">
                  Procedure
                </th>
                <th scope="col" className="text-right px-4 py-3 font-semibold text-text-main whitespace-nowrap">
                  Public median
                </th>
                <th scope="col" className="text-right px-4 py-3 font-semibold text-text-main whitespace-nowrap">
                  Public 90th %ile
                </th>
                <th scope="col" className="text-right px-4 py-3 font-semibold text-text-main whitespace-nowrap">
                  Private typical
                </th>
                <th scope="col" className="text-right px-4 py-3 font-semibold text-text-main whitespace-nowrap">
                  Days saved
                </th>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-text-main">
                  Cover required
                </th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((p, i) => {
                const tier = getCoverTierFromRequired(p.coverRequired);
                const tierBadgeClass = TIER_BADGE_COLORS[tier] ?? TIER_BADGE_COLORS.basic;
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-border last:border-b-0 cursor-pointer transition-colors ${
                      i % 2 === 0 ? 'bg-card' : 'bg-background'
                    } hover:bg-primary/5`}
                    onClick={() =>
                      setSelectedId(selectedId === p.id ? null : p.id)
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-main">
                        {p.label}
                      </div>
                      <div className="text-xs text-muted">{p.category}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-red-600 dark:text-red-400 whitespace-nowrap">
                      {formatDays(p.publicWaitDays.median)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted whitespace-nowrap">
                      {formatDays(p.publicWaitDays.percentile90)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-secondary whitespace-nowrap">
                      {formatDays(p.privateWaitDays.typical)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-primary whitespace-nowrap">
                      {formatDays(p.waitTimeSavingDays)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border capitalize ${tierBadgeClass}`}
                      >
                        {tier}+
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-2">
          Click a row or filter pill to see detail. Public times: AIHW national
          medians FY 2023–24. Private times: industry estimates — actual times
          vary by specialist availability.
        </p>
      </section>

      {/* ── Expanded detail panel ── */}
      {selectedProcedure && (
        <section>
          <div className="bg-card rounded border border-border shadow-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-h2 text-text-main">
                  {selectedProcedure.label}
                </h2>
                <p className="text-sm text-muted mt-1">
                  {selectedProcedure.category} &middot;{' '}
                  {selectedProcedure.urgencyCategory}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-muted hover:text-text-main text-lg leading-none mt-1 shrink-0"
                aria-label="Close detail panel"
              >
                &times;
              </button>
            </div>
            <p className="text-base text-muted">{selectedProcedure.context}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Public side */}
              <div className="rounded border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-4">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
                  Public hospital
                </h3>
                <div className="space-y-1 text-sm text-text-main">
                  <div>
                    <span className="text-muted">Median wait: </span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {formatDays(selectedProcedure.publicWaitDays.median)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted">90th percentile: </span>
                    <span className="font-medium">
                      {formatDays(selectedProcedure.publicWaitDays.percentile90)}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    {selectedProcedure.publicWaitDays.description}
                  </p>
                </div>
              </div>
              {/* Private side */}
              <div className="rounded border border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/20 p-4">
                <h3 className="font-semibold text-secondary mb-2">
                  Private hospital
                </h3>
                <div className="space-y-1 text-sm text-text-main">
                  <div>
                    <span className="text-muted">Typical wait: </span>
                    <span className="font-semibold text-secondary">
                      {formatDays(selectedProcedure.privateWaitDays.typical)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted">Range: </span>
                    <span className="font-medium">
                      {selectedProcedure.privateWaitDays.range}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    {selectedProcedure.privateWaitDays.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted">Cover required:</span>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium border capitalize ${
                  TIER_BADGE_COLORS[
                    getCoverTierFromRequired(selectedProcedure.coverRequired)
                  ] ?? TIER_BADGE_COLORS.basic
                }`}
              >
                {getCoverTierFromRequired(selectedProcedure.coverRequired)}+
              </span>
              <span className="text-muted text-xs">
                — {selectedProcedure.coverRequired}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Key insights ── */}
      <section>
        <h2 className="text-h2 text-text-main mb-4">Key insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-card rounded border border-border shadow-card p-5 text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              {formatDays(332)}
            </div>
            <div className="text-sm font-medium text-text-main">
              Longest public wait
            </div>
            <div className="text-xs text-muted mt-1">
              Septoplasty (deviated septum)
            </div>
          </div>
          <div className="bg-card rounded border border-border shadow-card p-5 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {formatDays(287)}
            </div>
            <div className="text-sm font-medium text-text-main">
              Biggest time saving
            </div>
            <div className="text-xs text-muted mt-1">
              Septoplasty — public {formatDays(332)} vs private{' '}
              {formatDays(45)}
            </div>
          </div>
          <div className="bg-card rounded border border-border shadow-card p-5 text-center">
            <div className="text-3xl font-bold text-secondary mb-1">
              {formatDays(18)}
            </div>
            <div className="text-sm font-medium text-text-main">
              Shortest public wait
            </div>
            <div className="text-xs text-muted mt-1">
              CABG (cardiac) — urgent surgery prioritised
            </div>
          </div>
        </div>
        {/* Emergency care note */}
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-4">
          <span className="text-amber-600 dark:text-amber-400 text-xl leading-none mt-0.5">
            &#9888;
          </span>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Emergency care is exempt from wait times.</strong> If your
            condition is life-threatening, you will be treated immediately in
            any public or private hospital emergency department regardless of
            your insurance status. Wait times only apply to elective (planned)
            procedures.
          </p>
        </div>
      </section>

      {/* ── Maternity section ── */}
      <section>
        <h2 className="text-h2 text-text-main mb-2">
          Maternity: private vs public
        </h2>
        <p className="text-base text-muted mb-6">
          Maternity care has no wait time — the baby sets the timeline. The
          difference between private and public is about experience, continuity
          of care, and cost.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Private */}
          <div className="bg-card rounded border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-h3 text-text-main">Private hospital</h3>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border ${TIER_BADGE_COLORS.gold}`}
              >
                Gold required
              </span>
            </div>
            <ul className="space-y-1.5 text-sm text-text-main mb-4">
              {privateBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5 shrink-0">&#10003;</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div>
                <span className="text-muted">Typical out-of-pocket: </span>
                <span className="font-semibold text-text-main">
                  ${maternityData.private.typicalCosts.totalOutOfPocket.typical.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted">Waiting period: </span>
                <span className="font-medium text-text-main">
                  {maternityData.private.waitingPeriod.months} months
                </span>
              </div>
              <div>
                <span className="text-muted">C-section rate: </span>
                <span className="font-medium text-text-main">
                  {Math.round(cSectionPrivate * 100)}%
                </span>
              </div>
            </div>
          </div>
          {/* Public */}
          <div className="bg-card rounded border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-h3 text-text-main">Public hospital</h3>
              <span className="px-2 py-0.5 rounded text-xs font-medium border bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                Free
              </span>
            </div>
            <ul className="space-y-1.5 text-sm text-text-main mb-4">
              {publicBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5 shrink-0">&#10003;</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div>
                <span className="text-muted">Out-of-pocket: </span>
                <span className="font-semibold text-secondary">
                  {maternityData.public.cost}
                </span>
              </div>
              <div>
                <span className="text-muted">C-section rate: </span>
                <span className="font-medium text-text-main">
                  {Math.round(cSectionPublic * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Clinical outcomes note */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-4 text-sm text-blue-800 dark:text-blue-300">
          <strong>Clinical outcomes:</strong> {clinicalOutcomes}
        </div>
        <p className="text-xs text-muted mt-3">
          {maternityData.private.cSectionRate.description}
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded p-6 text-center">
        <h2 className="text-h2 text-text-main mb-2">
          Is private health insurance worth it for you?
        </h2>
        <p className="text-base text-muted mb-4">
          Wait times are one factor. Use our personalised calculator to see
          whether private cover makes financial sense for your situation.
        </p>
        <Link
          href="/should-i-get-private-health-insurance"
          className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded hover:bg-primary/90 transition-colors"
        >
          Run the free calculator
        </Link>
      </section>
    </main>
  );
}
