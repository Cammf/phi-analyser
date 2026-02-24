import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import GuideLayout from '@/components/guide/GuideLayout';
import type { TocItem, FaqItem } from '@/components/guide/GuideLayout';

// ── SEO metadata ────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Medicare Levy Surcharge Explained (2026) — Thresholds, Rates & How to Avoid It';
const PAGE_DESCRIPTION =
  'Complete guide to the Medicare Levy Surcharge in Australia for FY 2025–26. Income thresholds, rates (1%–1.5%), how MLS income is calculated, worked examples, and the cheapest way to avoid it.';
const PAGE_URL = `${SITE_URL}/guides/medicare-levy-surcharge-explained`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: 'article',
  },
};

// ── Table of contents ───────────────────────────────────────────────────────

const toc: TocItem[] = [
  { id: 'what-is-the-mls', label: 'What is the MLS?' },
  { id: 'who-pays', label: 'Who pays the MLS?' },
  { id: 'income-thresholds', label: 'Income thresholds & rates' },
  { id: 'how-mls-income-is-calculated', label: 'How MLS income is calculated' },
  { id: 'worked-example-1', label: 'Worked example: single earner' },
  { id: 'worked-example-2', label: 'Worked example: family' },
  { id: 'cheapest-way-to-avoid', label: 'Cheapest way to avoid the MLS' },
  { id: 'common-mistakes', label: 'Common mistakes' },
  { id: 'appropriate-cover', label: 'What counts as "appropriate" cover' },
  { id: 'mls-vs-medicare-levy', label: 'MLS vs the Medicare Levy' },
  { id: 'faq', label: 'FAQ' },
];

// ── FAQ items ───────────────────────────────────────────────────────────────

const faq: FaqItem[] = [
  {
    question: 'Do I have to pay the Medicare Levy Surcharge?',
    answer:
      'You pay the MLS if your income for MLS purposes exceeds $101,000 (single) or $202,000 (family) and you do not hold appropriate private hospital cover. If your income is below these thresholds, you do not pay the MLS regardless of whether you have private health insurance.',
  },
  {
    question: 'What income is too high to avoid the Medicare Levy Surcharge?',
    answer:
      'There is no income level that is "too high" to avoid the MLS. At any income level, you can avoid the surcharge by holding appropriate private hospital cover with an excess of no more than $750 (single) or $1,500 (family). Even Tier 3 earners (over $158,000 single) can avoid the 1.5% MLS this way — though they receive no government rebate on their premium.',
  },
  {
    question: 'Does my partner\'s income count for the Medicare Levy Surcharge?',
    answer:
      'Yes. If you have a spouse (married or de facto, including same-sex partners), your combined income is used against the family thresholds ($202,000+). This applies even if you are not living together, unless you are legally separated. Your partner\'s income can push you above the threshold even if your own income alone is below it.',
  },
  {
    question: 'Is the Medicare Levy Surcharge the same as the Medicare Levy?',
    answer:
      'No. The Medicare Levy (2% of taxable income) is paid by most Australian taxpayers to fund the public health system. The Medicare Levy Surcharge (1%–1.5%) is an additional charge on top of the Medicare Levy, and only applies to higher-income earners who don\'t have private hospital cover. You can be exempt from the MLS while still paying the standard Medicare Levy.',
  },
  {
    question: 'Does extras cover count for avoiding the Medicare Levy Surcharge?',
    answer:
      'No. Only private patient hospital cover counts as "appropriate cover" for MLS purposes. Extras cover (also called general treatment — dental, optical, physio, etc.) does not exempt you from the MLS, even if you pay a high premium for comprehensive extras.',
  },
  {
    question: 'Can I get private health insurance just for part of the year to avoid the MLS?',
    answer:
      'The MLS is pro-rated by the number of days you don\'t have appropriate cover. If you hold hospital cover for 9 months (274 days) and not for 3 months (91 days), you pay MLS on the 91 days without cover. To fully avoid the MLS, you need cover for the entire financial year (1 July to 30 June).',
  },
  {
    question: 'What is the cheapest way to avoid the Medicare Levy Surcharge?',
    answer:
      'The cheapest compliant policy is typically a Basic hospital cover with a $750 excess (single) or $1,500 excess (family). For a single person under 65, this costs approximately $805/year after the government rebate at the base tier — significantly less than the MLS for most people above the threshold. Compare this to your personal MLS cost using our <a href="/mls-calculator" class="text-primary hover:underline">MLS Calculator</a>.',
  },
  {
    question: 'How do I check if my health insurance counts for the MLS exemption?',
    answer:
      'Your policy must be private patient hospital cover from a registered Australian health insurer. Check your policy\'s "product type" — it must include hospital treatment (not just extras/general treatment). The policy excess must not exceed $750 for singles or $1,500 for couples and families. Your insurer can confirm whether your policy meets the MLS exemption requirements. You can also check on <a href="https://www.privatehealth.gov.au" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">privatehealth.gov.au</a>.',
  },
];

// ── Related guides ──────────────────────────────────────────────────────────

const relatedGuides = [
  {
    href: '/guides/lifetime-health-cover-loading',
    title: 'LHC Loading Explained',
    description: 'The age penalty on premiums and the 10-year rule that removes it.',
  },
  {
    href: '/guides/is-private-health-insurance-worth-it',
    title: 'Is Private Health Insurance Worth It?',
    description: 'An honest look at when insurance makes financial sense — and when it doesn\'t.',
  },
  {
    href: '/guides/hospital-cover-tiers-explained',
    title: 'Hospital Cover Tiers Explained',
    description: 'Gold, Silver, Bronze, Basic — what each tier covers and who needs what.',
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function MLSExplainedGuidePage() {
  return (
    <GuideLayout
      title="Medicare Levy Surcharge Explained"
      description="Complete guide to the MLS for FY 2025–26 — who pays it, how much it costs, how your income is calculated, and the cheapest way to avoid it."
      publishDate="February 2026"
      readingTime="8 min read"
      toc={toc}
      faq={faq}
      relatedGuides={relatedGuides}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Guides', href: '/guides' },
        { label: 'Medicare Levy Surcharge Explained' },
      ]}
      pageUrl={PAGE_URL}
    >
      {/* ── What is the MLS? ─────────────────────────────────────────── */}
      <h2 id="what-is-the-mls">What is the Medicare Levy Surcharge?</h2>

      <p>
        The <strong>Medicare Levy Surcharge (MLS)</strong> is a tax of 1% to 1.5% of your
        income that the Australian government charges higher-income earners who don&apos;t hold
        private hospital cover.
      </p>

      <p>
        It&apos;s separate from the standard 2% Medicare Levy that most taxpayers already pay.
        The MLS is an <em>additional</em> charge on top of that — specifically designed to
        encourage higher earners to take out private health insurance and reduce pressure on the
        public hospital system.
      </p>

      <p>
        The key thing to understand: <strong>the MLS is entirely avoidable.</strong> If you hold
        appropriate private hospital cover for the full financial year, you don&apos;t pay it —
        regardless of how much you earn.
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>Quick check:</strong> If your income is over $101,000 (single) or $202,000
          (family) and you don&apos;t have private hospital cover, you&apos;re almost certainly
          paying the MLS.{' '}
          <Link href="/mls-calculator" className="font-medium">
            Check your exact cost →
          </Link>
        </p>
      </div>

      {/* ── Who pays the MLS? ────────────────────────────────────────── */}
      <h2 id="who-pays">Who pays the MLS?</h2>

      <p>You pay the Medicare Levy Surcharge if <strong>all three</strong> of these apply:</p>

      <ol>
        <li>
          Your <strong>income for MLS purposes</strong> exceeds the threshold ($101,000 for
          singles, $202,000 for families)
        </li>
        <li>
          You <strong>do not hold</strong> appropriate private patient hospital cover (extras
          cover doesn&apos;t count)
        </li>
        <li>
          You are <strong>not exempt</strong> — exemptions include holding a Medicare card
          marked &quot;Interim&quot;, having a Norfolk Island exemption, or being a
          low-income spouse (income under $27,222 with a spouse for the full year)
        </li>
      </ol>

      <p>
        If your income is below the threshold, you never pay the MLS — even if you don&apos;t
        have private health insurance.
      </p>

      <p>
        If you&apos;re in a couple (married or de facto, including same-sex partners), your
        combined income is tested against the family thresholds. This applies even if only one
        of you earns above $101,000 — it&apos;s your <em>combined</em> income that matters.
      </p>

      {/* ── Income thresholds & rates ─────────────────────────────────── */}
      <h2 id="income-thresholds">MLS income thresholds and rates (FY 2025–26)</h2>

      <p>
        The MLS has three tiers above the base threshold. The higher your income, the higher
        the surcharge rate:
      </p>

      <h3>Singles</h3>

      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Income for MLS purposes</th>
            <th>MLS rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base tier</td>
            <td>$0 – $101,000</td>
            <td><strong>0%</strong> — no MLS</td>
          </tr>
          <tr>
            <td>Tier 1</td>
            <td>$101,001 – $118,000</td>
            <td><strong>1.0%</strong></td>
          </tr>
          <tr>
            <td>Tier 2</td>
            <td>$118,001 – $158,000</td>
            <td><strong>1.25%</strong></td>
          </tr>
          <tr>
            <td>Tier 3</td>
            <td>$158,001+</td>
            <td><strong>1.5%</strong></td>
          </tr>
        </tbody>
      </table>

      <h3>Families (couples and single parents)</h3>

      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Combined income for MLS purposes</th>
            <th>MLS rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base tier</td>
            <td>$0 – $202,000</td>
            <td><strong>0%</strong> — no MLS</td>
          </tr>
          <tr>
            <td>Tier 1</td>
            <td>$202,001 – $236,000</td>
            <td><strong>1.0%</strong></td>
          </tr>
          <tr>
            <td>Tier 2</td>
            <td>$236,001 – $316,000</td>
            <td><strong>1.25%</strong></td>
          </tr>
          <tr>
            <td>Tier 3</td>
            <td>$316,001+</td>
            <td><strong>1.5%</strong></td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>Dependent children adjustment:</strong> For families with dependent children,
        the income thresholds increase by <strong>$1,500 for each child after the first</strong>.
        So a family with 3 children has thresholds that are $3,000 higher (2 × $1,500) —
        the base threshold becomes $205,000 instead of $202,000.
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>Source:</strong> These thresholds are from the{' '}
          <a
            href="https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates"
            target="_blank"
            rel="noopener noreferrer"
          >
            ATO&apos;s FY 2025–26 MLS threshold page
          </a>
          , verified 23 February 2026.
        </p>
      </div>

      {/* ── How MLS income is calculated ──────────────────────────────── */}
      <h2 id="how-mls-income-is-calculated">How MLS income is calculated</h2>

      <p>
        This is where many people get caught out. Your &quot;income for MLS purposes&quot; is{' '}
        <strong>not just your taxable income</strong>. The ATO adds several other components:
      </p>

      <ol>
        <li>
          <strong>Taxable income</strong> — your regular salary/wages plus other assessable income,
          minus deductions
        </li>
        <li>
          <strong>Reportable fringe benefits</strong> — the grossed-up value of fringe benefits
          from your employer (shown on your payment summary). This includes salary-packaged
          items like car leases, meal entertainment, and living-away-from-home allowances
        </li>
        <li>
          <strong>Total net investment losses</strong> — if you have negatively geared
          investment properties or share portfolio losses, these amounts are <em>added back</em>{' '}
          to your income for MLS purposes. Negative gearing reduces your taxable income but
          it does <em>not</em> reduce your MLS income
        </li>
        <li>
          <strong>Reportable super contributions</strong> — employer super contributions that
          exceed the standard amount, plus any deductible personal super contributions
        </li>
      </ol>

      <p>
        Two less common components may also apply: trust distributions attributable to your
        spouse, and exempt foreign employment income. Most people only need to worry about
        the four items above.
      </p>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>The trap:</strong> Someone with a $90,000 salary can easily exceed the
          $101,000 MLS threshold once fringe benefits and super contributions are added. This
          is the most common way people are surprised by an MLS bill at tax time. Check your
          payment summary for reportable fringe benefits — that number gets added to your
          taxable income for MLS purposes.
        </p>
      </div>

      {/* ── Worked example 1 ──────────────────────────────────────────── */}
      <h2 id="worked-example-1">Worked example: single earner ($130,000)</h2>

      <p>
        <strong>Sarah</strong> is single, aged 34, and earns a salary of $130,000. She has no
        fringe benefits, investment losses, or extra super contributions. She does not have
        private health insurance.
      </p>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Taxable income</td>
            <td>$130,000</td>
          </tr>
          <tr>
            <td>Reportable fringe benefits</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Net investment losses</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Reportable super contributions</td>
            <td>$0</td>
          </tr>
          <tr>
            <td><strong>Income for MLS purposes</strong></td>
            <td><strong>$130,000</strong></td>
          </tr>
        </tbody>
      </table>

      <p>
        Sarah&apos;s MLS income of $130,000 falls in <strong>Tier 2</strong> ($118,001–$158,000),
        so her MLS rate is <strong>1.25%</strong>.
      </p>

      <p>
        <strong>Annual MLS cost: $130,000 × 1.25% = $1,625</strong>
      </p>

      <p>That&apos;s $1,625 per year in additional tax — on top of the standard 2% Medicare Levy she already pays.</p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Could Sarah save money with insurance?</strong> The cheapest Basic hospital
          policy costs approximately $1,063/year before rebate. At Tier 2, Sarah receives an
          8.1% government rebate, reducing the premium to about <strong>$977/year</strong>.
          By getting Basic cover, she&apos;d save <strong>$648/year</strong> ($1,625 MLS minus
          $977 premium). The insurance literally pays for itself — with $648 left over.
        </p>
      </div>

      {/* ── Worked example 2 ──────────────────────────────────────────── */}
      <h2 id="worked-example-2">Worked example: family ($220,000 combined)</h2>

      <p>
        <strong>James and Priya</strong> are a couple with 2 dependent children. James earns
        $145,000 and Priya earns $75,000. Neither has fringe benefits or investment losses.
        They do not have private health insurance.
      </p>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>James</th>
            <th>Priya</th>
            <th>Combined</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Taxable income</td>
            <td>$145,000</td>
            <td>$75,000</td>
            <td>$220,000</td>
          </tr>
          <tr>
            <td>Other MLS income components</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td><strong>Combined MLS income</strong></td>
            <td colSpan={3}><strong>$220,000</strong></td>
          </tr>
        </tbody>
      </table>

      <p>
        Because they have 2 dependent children, their family threshold increases by $1,500
        (for the second child):
      </p>

      <ul>
        <li>Base threshold: $202,000 + $1,500 = <strong>$203,500</strong></li>
        <li>Tier 1 upper limit: $236,000 + $1,500 = $237,500</li>
      </ul>

      <p>
        Their combined income of $220,000 exceeds the adjusted base threshold ($203,500) but is
        below the adjusted Tier 1 limit ($237,500). They fall in <strong>Tier 1 at 1.0%</strong>.
      </p>

      <p>
        <strong>Annual MLS cost: $220,000 × 1.0% = $2,200</strong>
      </p>

      <p>
        That&apos;s $2,200 per year — enough to pay for a Basic family hospital policy
        (approximately $2,126/year for a couple, or $1,595 for single parent after rebate) and
        still come out ahead.
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>Note:</strong> Notice that Priya earns only $75,000 — well below the $101,000
          single threshold. But because they&apos;re a couple, their combined income is tested
          against the family threshold. This is a common surprise for couples where one partner
          earns most of the household income.
        </p>
      </div>

      {/* ── Cheapest way to avoid MLS ─────────────────────────────────── */}
      <h2 id="cheapest-way-to-avoid">The cheapest way to avoid the MLS</h2>

      <p>
        If your only goal is to avoid the surcharge (rather than getting comprehensive health
        coverage), the cheapest option is a <strong>Basic hospital policy with a $750
        excess</strong>.
      </p>

      <p>Here&apos;s what the cheapest compliant policies cost, after government rebate:</p>

      <table>
        <thead>
          <tr>
            <th>Your MLS tier</th>
            <th>Basic premium after rebate</th>
            <th>Your MLS cost (on $130k)</th>
            <th>Annual saving</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base tier (under $101k)</td>
            <td colSpan={3}><em>No MLS — no action needed</em></td>
          </tr>
          <tr>
            <td>Tier 1 ($101k–$118k)</td>
            <td>~$891/yr</td>
            <td>$1,100 (on $110k)</td>
            <td className="text-green-700 dark:text-green-400 font-medium">$209</td>
          </tr>
          <tr>
            <td>Tier 2 ($118k–$158k)</td>
            <td>~$977/yr</td>
            <td>$1,625 (on $130k)</td>
            <td className="text-green-700 dark:text-green-400 font-medium">$648</td>
          </tr>
          <tr>
            <td>Tier 3 ($158k+)</td>
            <td>$1,063/yr</td>
            <td>$2,700 (on $180k)</td>
            <td className="text-green-700 dark:text-green-400 font-medium">$1,637</td>
          </tr>
        </tbody>
      </table>

      <p>
        At every tier, <strong>Basic hospital cover is cheaper than the MLS</strong>. The higher
        your income, the bigger the saving. Tier 3 earners save the most because they pay the
        highest MLS rate (1.5%) but receive no government rebate — even so, the $1,063 Basic
        premium is far less than the surcharge.
      </p>

      <p>
        Be aware that Basic hospital cover is very limited — it typically covers only
        rehabilitation, psychiatric, and palliative care as a private patient. If you want
        actual hospital coverage (not just a tax strategy), consider Bronze or Silver.
        See our{' '}
        <Link href="/guides/hospital-cover-tiers-explained">guide to hospital cover tiers</Link>
        {' '}for a detailed comparison.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Run the numbers for your situation:</strong> Our{' '}
          <Link href="/mls-calculator" className="font-medium">
            MLS Calculator
          </Link>{' '}
          compares your exact MLS cost to the cheapest compliant policy, including the
          government rebate at your income level.
        </p>
      </div>

      {/* ── Common mistakes ───────────────────────────────────────────── */}
      <h2 id="common-mistakes">Common mistakes with the MLS</h2>

      <p>
        These are the errors that catch people most often — sometimes resulting in an
        unexpected tax bill:
      </p>

      <h3>1. Forgetting fringe benefits push you over the threshold</h3>
      <p>
        If you salary package a car, meals, or other fringe benefits, the{' '}
        <strong>reportable fringe benefits amount</strong> is added to your taxable income for
        MLS purposes. A $90,000 salary with $15,000 in reportable fringe benefits means your
        MLS income is $105,000 — above the $101,000 threshold.
      </p>

      <h3>2. Not counting your partner&apos;s income</h3>
      <p>
        If you have a spouse (married or de facto), your incomes are combined for MLS purposes
        and tested against the family thresholds. Even if neither of you individually earns
        above $101,000, your combined income could exceed $202,000.
      </p>

      <h3>3. Thinking extras cover is enough</h3>
      <p>
        Extras cover (dental, optical, physio) <strong>does not count</strong> as appropriate
        cover for MLS purposes. You must have <em>hospital</em> cover. If you have extras-only
        cover, you&apos;re still liable for the MLS.
      </p>

      <h3>4. Forgetting negative gearing is added back</h3>
      <p>
        Net investment losses — particularly from negatively geared rental properties — are
        added back to your income for MLS purposes. Your taxable income might be $95,000
        after claiming $10,000 in rental losses, but your MLS income is $105,000. The tax
        deduction helps with income tax but <em>not</em> with the MLS.
      </p>

      <h3>5. Letting cover lapse mid-year</h3>
      <p>
        The MLS is pro-rated by the number of days you don&apos;t have cover. If you cancel
        your policy in March and don&apos;t get new cover until September, you&apos;ll pay
        MLS for those months without cover. Keep your policy continuous through the full
        financial year (1 July to 30 June) to avoid any surcharge.
      </p>

      {/* ── What counts as appropriate cover ──────────────────────────── */}
      <h2 id="appropriate-cover">What counts as &quot;appropriate&quot; hospital cover</h2>

      <p>
        To be exempt from the MLS, your private health insurance must meet all of these
        requirements:
      </p>

      <ul>
        <li>
          <strong>Hospital cover</strong> — it must be private patient hospital cover (not
          just extras or general treatment)
        </li>
        <li>
          <strong>Registered insurer</strong> — the policy must be from a registered Australian
          health insurer (overseas insurance doesn&apos;t count)
        </li>
        <li>
          <strong>Covers hospital treatment in Australia</strong> — the policy must provide
          cover for hospital treatment as a private patient in an Australian hospital
        </li>
        <li>
          <strong>Covers you and your dependants</strong> — the policy must cover you, your
          spouse (if applicable), and all your dependent children
        </li>
        <li>
          <strong>Excess limit</strong> — the policy excess must not exceed{' '}
          <strong>$750 for singles</strong> or <strong>$1,500 for couples and families</strong>
        </li>
      </ul>

      <p>
        Any hospital tier (Basic, Bronze, Silver, or Gold) qualifies — there is no minimum
        level of clinical coverage required. This is why Basic hospital cover works as a
        &quot;tax product&quot;: it meets the MLS requirements at the lowest possible cost,
        even though it covers very few hospital procedures.
      </p>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>What does NOT count:</strong> Extras-only cover (dental, optical, physio),
          travel insurance, and insurance from overseas health funds. If you only have extras
          cover, you are still liable for the MLS.
        </p>
      </div>

      {/* ── MLS vs Medicare Levy ──────────────────────────────────────── */}
      <h2 id="mls-vs-medicare-levy">MLS vs the Medicare Levy — what&apos;s the difference?</h2>

      <p>
        These are two separate charges and it&apos;s common to confuse them:
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Medicare Levy</th>
            <th>Medicare Levy Surcharge</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Rate</strong></td>
            <td>2% of taxable income</td>
            <td>1%–1.5% of MLS income</td>
          </tr>
          <tr>
            <td><strong>Who pays</strong></td>
            <td>Most Australian taxpayers</td>
            <td>Higher earners without hospital cover</td>
          </tr>
          <tr>
            <td><strong>Purpose</strong></td>
            <td>Fund Medicare (public health system)</td>
            <td>Incentivise private hospital cover</td>
          </tr>
          <tr>
            <td><strong>How to avoid</strong></td>
            <td>Low-income exemptions only</td>
            <td>Hold private hospital cover or stay below threshold</td>
          </tr>
          <tr>
            <td><strong>Income test</strong></td>
            <td>Taxable income</td>
            <td>MLS income (broader — includes FBT, losses, super)</td>
          </tr>
        </tbody>
      </table>

      <p>
        If you earn above the MLS threshold without hospital cover, you pay <strong>both</strong>
        {' '}— the 2% Medicare Levy <em>and</em> the 1%–1.5% MLS. That&apos;s up to 3.5% of
        your income going to health-related levies.
      </p>
    </GuideLayout>
  );
}
