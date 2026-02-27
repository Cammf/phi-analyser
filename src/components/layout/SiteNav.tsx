'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

// ──────────────────────────────────────────────────────────────────────────────
// Nav link data
// ──────────────────────────────────────────────────────────────────────────────

const calculatorLinks = [
  {
    href: '/should-i-get-private-health-insurance',
    label: 'Should I Get PHI?',
    description: 'Find out if private health insurance is right for you',
  },
  {
    href: '/private-health-insurance-calculator',
    label: 'PHI Calculator',
    description: 'Is private health insurance worth it for your situation?',
  },
  {
    href: '/mls-calculator',
    label: 'MLS Calculator',
    description: 'Calculate your Medicare Levy Surcharge exposure',
  },
  {
    href: '/lhc-loading-calculator',
    label: 'LHC Calculator',
    description: 'Estimate your Lifetime Health Cover loading',
  },
  {
    href: '/extras-calculator',
    label: 'Extras Calculator',
    description: 'Is extras (general treatment) cover worth the cost for you?',
  },
  {
    href: '/wait-times',
    label: 'Wait Times',
    description: 'Compare public vs private hospital wait times for common procedures',
  },
];

const guideLinks = [
  { href: '/guides/how-private-health-insurance-works', label: 'How PHI Works' },
  { href: '/guides/medicare-levy-surcharge-explained', label: 'MLS Explained' },
  { href: '/guides/lifetime-health-cover-loading', label: 'LHC Loading Guide' },
  { href: '/guides/government-rebate-on-private-health-insurance', label: 'Government Rebate' },
  { href: '/guides/hospital-cover-tiers-explained', label: 'Hospital Cover Tiers' },
  { href: '/guides/extras-cover-is-it-worth-it', label: 'Is Extras Cover Worth It?' },
  { href: '/guides/private-vs-public-hospital', label: 'Private vs Public Hospital' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Dropdown
// ──────────────────────────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  href?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

function Dropdown({ label, href, isOpen, onToggle, onClose, children }: DropdownProps) {
  const chevron = (
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div
      className="relative flex items-center"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onClose();
        }
      }}
    >
      {href ? (
        // Split: label navigates, chevron toggles dropdown
        <>
          <Link
            href={href}
            onClick={onClose}
            className="text-sm font-medium text-text-main hover:text-primary transition-colors min-h-[48px] px-2 flex items-center focus:outline-none focus:text-primary"
          >
            {label}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center text-text-main hover:text-primary transition-colors min-h-[48px] pr-2 focus:outline-none"
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label={`Show ${label} menu`}
          >
            {chevron}
          </button>
        </>
      ) : (
        // Combined button: whole thing toggles dropdown
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1 text-sm font-medium text-text-main hover:text-primary transition-colors min-h-[48px] px-2 focus:outline-none focus:text-primary"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {label}
          {chevron}
        </button>
      )}

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[260px] py-1"
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SiteNav
// ──────────────────────────────────────────────────────────────────────────────

export default function SiteNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<'calc' | 'guides' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggle = (menu: 'calc' | 'guides') =>
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  const close = () => setOpenDropdown(null);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 print:hidden">
      <nav
        className="max-w-6xl mx-auto px-4 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 py-3 min-h-[48px] font-semibold text-primary text-base hover:text-primary/80 transition-colors"
          onClick={close}
        >
          {/* Health / shield icon */}
          <svg
            className="w-6 h-6 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="leading-tight">
            PHI Analyser<br />
            <span className="text-xs font-normal text-muted">Private Health Insurance</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Dropdown
            label="Calculators"
            isOpen={openDropdown === 'calc'}
            onToggle={() => toggle('calc')}
            onClose={close}
          >
            {calculatorLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={close}
                className={`block px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors ${
                  pathname === link.href ? 'text-primary font-medium' : 'text-text-main'
                }`}
              >
                <span className="block text-sm font-medium">{link.label}</span>
                <span className="block text-xs text-muted mt-0.5">{link.description}</span>
              </Link>
            ))}
          </Dropdown>

          <Dropdown
            label="Guides"
            href="/guides"
            isOpen={openDropdown === 'guides'}
            onToggle={() => toggle('guides')}
            onClose={close}
          >
            <Link
              href="/guides"
              role="menuitem"
              onClick={close}
              className={`block px-4 py-2.5 text-sm font-medium border-b border-border mb-1 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors ${
                pathname === '/guides' ? 'text-primary' : 'text-text-main'
              }`}
            >
              All guides →
            </Link>
            {guideLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={close}
                className={`block px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors ${
                  pathname === link.href ? 'text-primary font-medium' : 'text-text-main'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </Dropdown>

          <Link
            href="/about"
            onClick={close}
            className={`text-sm font-medium px-2 min-h-[48px] flex items-center hover:text-primary transition-colors ${
              pathname === '/about' ? 'text-primary' : 'text-text-main'
            }`}
          >
            About
          </Link>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Primary CTA */}
          <Link
            href="/private-health-insurance-calculator"
            onClick={close}
            className="ml-2 btn-primary text-sm !py-2 !px-4 !min-h-[40px]"
          >
            Check My Insurance →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-[48px] h-[48px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary rounded"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2 mt-1">Calculators</p>
            {calculatorLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-text-main hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2 mt-4">Guides</p>
            <Link
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-primary hover:text-primary/80 border-b border-border mb-1"
            >
              All guides →
            </Link>
            {guideLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-text-main hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-border mt-3">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-text-main hover:text-primary"
              >
                About
              </Link>
              <div className="flex items-center justify-between mt-3">
                <Link
                  href="/private-health-insurance-calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 btn-primary text-center text-sm"
                >
                  Check My Insurance →
                </Link>
                <div className="ml-2 flex-shrink-0">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
