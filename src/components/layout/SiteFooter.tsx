import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16 print:hidden">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top: columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="font-semibold text-primary text-base leading-tight block mb-2">
              Private Health Insurance Calculator
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Free, independent analysis of whether private health insurance
              saves you money. MLS, rebate, LHC loading, and scenario comparisons.
            </p>
            <p className="text-xs text-muted mt-3">
              Updated FY 2025–26 · Not financial advice
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wide mb-3">
              Calculators
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/should-i-get-private-health-insurance', label: 'Should I Get PHI?' },
                { href: '/mls-calculator', label: 'MLS Calculator' },
                { href: '/lhc-loading-calculator', label: 'LHC Calculator' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wide mb-3">
              Guides
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/guides/how-private-health-insurance-works', label: 'How PHI Works' },
                { href: '/guides/medicare-levy-surcharge-explained', label: 'MLS Explained' },
                { href: '/guides/lifetime-health-cover-loading', label: 'LHC Loading' },
                { href: '/guides/government-rebate-on-private-health-insurance', label: 'Government Rebate' },
                { href: '/guides/hospital-cover-tiers-explained', label: 'Hospital Cover Tiers' },
                { href: '/guides/extras-cover-is-it-worth-it', label: 'Is Extras Worth It?' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site links */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wide mb-3">
              Site
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About This Site' },
                { href: '/privacy', label: 'Privacy Policy' },
                {
                  href: 'https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge',
                  label: 'ATO — MLS',
                  external: true,
                },
                {
                  href: 'https://www.ombudsman.gov.au/phio',
                  label: 'PHI Ombudsman',
                  external: true,
                },
                {
                  href: 'https://www.apra.gov.au/private-health-insurance-statistics',
                  label: 'APRA Statistics',
                  external: true,
                },
              ].map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted leading-relaxed max-w-3xl mb-3">
            <strong className="text-text-main">Disclaimer:</strong> This site
            provides general information and estimates only. It is not financial
            or health advice. Premium estimates are indicative — actual premiums vary
            by insurer, age, and state. Rates are sourced from{' '}
            <a
              href="https://www.ato.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline"
            >
              ATO
            </a>
            ,{' '}
            <a
              href="https://www.apra.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline"
            >
              APRA
            </a>
            , and the{' '}
            <a
              href="https://www.ombudsman.gov.au/phio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline"
            >
              Private Health Insurance Ombudsman
            </a>
            . Always verify figures with the ATO and your insurer before making
            financial decisions.
          </p>
          <p className="text-xs text-muted">
            © {currentYear} PHI Analyser · Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
