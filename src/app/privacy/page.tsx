import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import GuideBreadcrumbs from '@/components/guide/GuideBreadcrumbs';

const PAGE_TITLE = 'Privacy Policy';
const PAGE_DESCRIPTION =
  'Privacy policy for the Private Health Insurance Calculator Australia — what data we collect, how we use it, and your rights.';
const PAGE_URL = `${SITE_URL}/privacy`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <GuideBreadcrumbs
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
      />
      <h1 className="mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted mb-8">Effective date: February 2026</p>

      <div className="space-y-10">
        {/* 1. Overview */}
        <section>
          <h2 className="mb-3">1. Overview</h2>
          <p className="text-muted">
            {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, or &quot;this site&quot;) is committed to
            protecting your privacy. This policy explains what information we collect when you use
            our calculators and guides, how that information is used, and your choices regarding it.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section>
          <h2 className="mb-3">2. Information we collect</h2>
          <p className="text-muted mb-3">
            <strong className="text-text-main">We do not store any personal data.</strong> The
            income, age, and family information you enter into our calculators is processed
            entirely in your browser. It is not transmitted to our servers or stored in any
            database.
          </p>
          <p className="text-muted mb-3">
            Calculator results can be shared via URL — the URL contains your inputs as
            parameters (e.g. income range, family type). Anyone with the URL can see those
            parameters.
          </p>
          <p className="text-muted">
            We collect anonymous usage data through Google Analytics 4 (GA4) to understand how
            the site is used. This includes:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-1 mt-2">
            <li>Pages visited and time spent</li>
            <li>Device type, browser, and operating system</li>
            <li>Approximate geographic location (city-level, not precise)</li>
            <li>Referring website or search query</li>
            <li>Calculator usage patterns (which calculators are used, not the inputs)</li>
          </ul>
        </section>

        {/* 3. Cookies */}
        <section>
          <h2 className="mb-3">3. Cookies</h2>
          <p className="text-muted mb-3">
            This site uses cookies set by Google Analytics 4 to distinguish unique visitors and
            track sessions. These cookies do not contain personally identifiable information.
          </p>
          <p className="text-muted mb-3">The GA4 cookies used are:</p>
          <ul className="list-disc pl-6 text-muted space-y-1 mb-3">
            <li><code className="text-sm bg-gray-50 dark:bg-slate-800 px-1 rounded">_ga</code> — Distinguishes unique users (expires after 2 years)</li>
            <li><code className="text-sm bg-gray-50 dark:bg-slate-800 px-1 rounded">_ga_*</code> — Maintains session state (expires after 2 years)</li>
          </ul>
          <p className="text-muted">
            We also use a <code className="text-sm bg-gray-50 dark:bg-slate-800 px-1 rounded">theme</code> cookie
            to remember your light/dark mode preference. This cookie is stored locally and not
            transmitted to any server.
          </p>
          <p className="text-muted mt-3">
            You can opt out of Google Analytics by installing the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </section>

        {/* 4. Advertising */}
        <section>
          <h2 className="mb-3">4. Advertising</h2>
          <p className="text-muted mb-3">
            This site may display advertisements through Google AdSense or similar advertising
            networks. These services may use cookies and similar technologies to serve ads based
            on your prior visits to this site or other websites.
          </p>
          <p className="text-muted">
            You can manage your ad personalisation preferences at{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Ad Settings
            </a>{' '}
            or opt out of personalised advertising at{' '}
            <a
              href="https://www.aboutads.info/choices"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              aboutads.info
            </a>.
          </p>
        </section>

        {/* 5. Third-Party Links */}
        <section>
          <h2 className="mb-3">5. Third-party links</h2>
          <p className="text-muted">
            This site contains links to external websites including the ATO, APRA, AIHW,
            PrivateHealth.gov.au, Services Australia, and others. We are not responsible for
            the privacy practices or content of these external sites. We encourage you to
            review the privacy policy of any site you visit.
          </p>
        </section>

        {/* 6. Data Retention */}
        <section>
          <h2 className="mb-3">6. Data retention</h2>
          <p className="text-muted">
            Google Analytics data is retained for 26 months (the GA4 default), after which
            it is automatically deleted. We do not maintain any separate database of user data.
            Your calculator inputs are never stored on our servers.
          </p>
        </section>

        {/* 7. Children's Privacy */}
        <section>
          <h2 className="mb-3">7. Children&apos;s privacy</h2>
          <p className="text-muted">
            This site is intended for adults making health insurance decisions. We do not
            knowingly collect information from children under 16. If you believe we have
            inadvertently collected information from a child, please contact us and we will
            take steps to delete it.
          </p>
        </section>

        {/* 8. Changes to This Policy */}
        <section>
          <h2 className="mb-3">8. Changes to this policy</h2>
          <p className="text-muted">
            We may update this privacy policy from time to time. Any changes will be posted
            on this page with an updated effective date. We encourage you to review this
            policy periodically.
          </p>
        </section>

        {/* 9. Contact */}
        <section>
          <h2 className="mb-3">9. Contact</h2>
          <p className="text-muted">
            If you have questions about this privacy policy or how your data is handled,
            please contact us via the details on our{' '}
            <a href="/about" className="text-primary hover:underline">About page</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
