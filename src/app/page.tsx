import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Is Private Health Insurance Worth It?
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Independent calculator for Australians — find out if private health insurance
            saves you money or costs you more. Free, no commissions, based on ATO and APRA data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/should-i-get-private-health-insurance"
              className="inline-flex items-center justify-center bg-white text-primary font-semibold px-8 py-4 rounded-lg text-lg hover:bg-blue-50 transition-colors min-h-[48px]"
            >
              Should I Get Private Health Insurance?
            </Link>
            <Link
              href="/mls-calculator"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/10 transition-colors min-h-[48px]"
            >
              Quick MLS Check
            </Link>
          </div>
          <p className="text-xs text-blue-200 mt-6">
            General information only — not financial advice. Updated FY 2025–26.
          </p>
        </div>
      </section>

      {/* ─── Trust bar ────────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { icon: '✕', label: 'No commissions' },
              { icon: '✓', label: 'ATO & APRA data' },
              { icon: '⏱', label: 'Under 5 minutes' },
              { icon: '📅', label: 'FY 2025–26 rates' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-1">
                <span className="text-lg" aria-hidden="true">{badge.icon}</span>
                <span className="text-sm font-medium text-text-main">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Situation cards ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-center mb-2">Choose your starting point</h2>
        <p className="text-center text-muted mb-8 max-w-xl mx-auto">
          Pick the situation that best describes you — we&apos;ll take you to the right calculator.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: '/lhc-loading-calculator',
              title: 'Turning 31 soon?',
              description: 'Find out how much LHC loading will cost if you wait, and whether you need cover before the deadline.',
              badge: 'LHC Loading',
            },
            {
              href: '/mls-calculator',
              title: 'Earning over $101k?',
              description: 'Calculate your Medicare Levy Surcharge and see if basic hospital cover is cheaper than the tax.',
              badge: 'MLS Calculator',
            },
            {
              href: '/should-i-get-private-health-insurance',
              title: 'Thinking of dropping cover?',
              description: 'Compare keeping, downgrading, or dropping your private health insurance — with real numbers.',
              badge: 'Full Comparison',
            },
            {
              href: '/should-i-get-private-health-insurance',
              title: 'Need a procedure?',
              description: 'Compare public vs private waiting times and costs for common elective surgeries.',
              badge: 'Wait Times',
            },
          ].map((card) => (
            <Link key={card.title} href={card.href} className="card hover:border-primary/40 transition-colors group">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {card.badge}
              </span>
              <h3 className="text-lg font-semibold mt-3 mb-2 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-muted">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Quick-answer stat cards ──────────────────────────────────────── */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-center mb-8">The numbers at a glance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card text-center">
              <p className="text-3xl font-bold text-primary mb-2">45.4%</p>
              <p className="font-medium text-text-main mb-1">of Australians have hospital cover</p>
              <p className="text-sm text-muted">Down from 47% five years ago — more people are questioning the value.</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-primary mb-2">$3,264</p>
              <p className="font-medium text-text-main mb-1">average annual single premium</p>
              <p className="text-sm text-muted">Premiums have risen 4.41% in 2026 — the 24th consecutive annual increase.</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-primary mb-2">&lt;45¢</p>
              <p className="font-medium text-text-main mb-1">in the dollar returned on extras</p>
              <p className="text-sm text-muted">Most people get back less than half what they pay for extras (general treatment) cover.</p>
            </div>
          </div>
          <p className="text-xs text-muted text-center mt-4">
            Sources: APRA Private Health Insurance Statistics, June 2025.
          </p>
        </div>
      </section>

      {/* ─── Popular guides ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-center mb-2">Popular guides</h2>
        <p className="text-center text-muted mb-8">
          Understand the system before you decide.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: '/guides/medicare-levy-surcharge-explained',
              title: 'MLS Explained',
              description: 'What the surcharge is, who pays it, and how to avoid it legally.',
            },
            {
              href: '/guides/lifetime-health-cover-loading',
              title: 'LHC Loading',
              description: 'The age penalty on premiums — and the 10-year rule that removes it.',
            },
            {
              href: '/guides/is-private-health-insurance-worth-it',
              title: 'Is PHI Worth It?',
              description: 'An honest look at when insurance makes sense — and when it doesn\'t.',
            },
            {
              href: '/guides/hospital-cover-tiers-explained',
              title: 'Tiers Explained',
              description: 'Gold, Silver, Bronze, Basic — what each covers and who needs what.',
            },
          ].map((guide) => (
            <Link key={guide.href} href={guide.href} className="card hover:border-primary/40 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <p className="text-sm text-muted">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            Ready to check your numbers?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-6">
            Our calculator uses your income, age, and family situation to show you
            exactly what private health insurance would cost — or save — you.
          </p>
          <Link
            href="/should-i-get-private-health-insurance"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-8 py-4 rounded-lg text-lg hover:bg-blue-50 transition-colors min-h-[48px]"
          >
            Start the Calculator
          </Link>
        </div>
      </section>
    </main>
  );
}
