import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import GuideLayout from '@/components/guide/GuideLayout';
import type { TocItem, FaqItem } from '@/components/guide/GuideLayout';

// ── SEO metadata ────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Lifetime Health Cover Loading Explained (2026) — How It Works & What It Costs';
const PAGE_DESCRIPTION =
  'Complete guide to LHC loading in Australia — how the 2% per year penalty works, the 10-year removal rule, youth discount, grace period, and real cost projections at every age.';
const PAGE_URL = `${SITE_URL}/guides/lifetime-health-cover-loading`;

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
  { id: 'what-is-lhc', label: 'What is LHC loading?' },
  { id: 'how-its-calculated', label: 'How loading is calculated' },
  { id: 'cost-projections', label: 'Cost projections by age' },
  { id: 'worked-example-1', label: 'Example: age 35' },
  { id: 'worked-example-2', label: 'Example: age 45' },
  { id: 'ten-year-rule', label: 'The 10-year removal rule' },
  { id: 'youth-discount', label: 'Youth discount (ages 18–29)' },
  { id: 'grace-period', label: 'The 1,094-day grace period' },
  { id: 'overseas-residents', label: 'Overseas residents & migrants' },
  { id: 'what-to-do', label: 'What you should do' },
  { id: 'faq', label: 'FAQ' },
];

// ── FAQ items ───────────────────────────────────────────────────────────────

const faq: FaqItem[] = [
  {
    question: 'What age do I need to get private health insurance to avoid LHC loading?',
    answer:
      'You need to take out private hospital cover by <strong>1 July following your 31st birthday</strong>. If you turn 31 on 15 March 2026, your deadline is 1 July 2026. If you turn 31 on 10 September 2026, your deadline is 1 July 2027. Missing this deadline starts the 2% per year loading on any hospital cover you take out later.',
  },
  {
    question: 'Does LHC loading apply to extras cover?',
    answer:
      'No. LHC loading applies only to <strong>hospital cover premiums</strong>. It does not apply to extras (general treatment) cover such as dental, optical, or physiotherapy. You can take out extras cover at any age without paying any loading.',
  },
  {
    question: 'How long do I have to keep hospital cover to remove my LHC loading?',
    answer:
      'You must maintain <strong>continuous hospital cover for 10 years</strong>. After 10 years, the loading is removed permanently — you go back to paying the base premium. If you cancel your cover before the 10 years is up, the loading &quot;clock&quot; pauses. If you resume within your remaining grace period (1,094 days lifetime total), you pick up where you left off. If you exceed the grace period, your loading may increase.',
  },
  {
    question: 'Can I avoid LHC loading by getting the cheapest possible hospital cover?',
    answer:
      'Yes. Any level of hospital cover — including Basic — counts for LHC purposes. Many people take out Basic hospital cover before their 31st birthday deadline specifically to avoid accruing loading. The key is that it must be <strong>hospital</strong> cover from a registered Australian insurer, not extras-only.',
  },
  {
    question: 'What happens to my LHC loading if I go overseas?',
    answer:
      'Time spent <strong>continuously overseas</strong> does not count toward your 1,094-day grace period — the clock pauses while you are away. However, when you return to Australia, you must take out hospital cover within 12 months of registering for Medicare to avoid your loading increasing. If you were overseas on your LHC base day, you are treated as having held continuous cover during that time.',
  },
  {
    question: 'Does my LHC loading transfer if I switch health insurers?',
    answer:
      'Yes. LHC loading is tracked by Medicare, not by your insurer. When you switch health funds, your loading percentage and years of continuous cover carry over automatically. Your new insurer will apply the same loading. Switching insurers does not reset or reduce your loading.',
  },
  {
    question: 'Is LHC loading calculated before or after the government rebate?',
    answer:
      'LHC loading is applied to the <strong>base hospital premium first</strong>, and then the government rebate is calculated on the total (base premium + loading). This means the rebate partially offsets the loading cost, but you still pay more overall than someone without loading.',
  },
  {
    question: 'I\'m 29 — should I get hospital cover now or wait until I\'m 30?',
    answer:
      'There is no financial penalty for waiting until 30. LHC loading only starts accruing from 1 July after your 31st birthday. However, if you take out hospital cover before turning 30, you may qualify for the <strong>youth discount</strong> (up to 10% off premiums), which is locked in until you turn 41. If you are considering cover anyway, getting it at 29 gives you the maximum youth discount.',
  },
];

// ── Related guides ──────────────────────────────────────────────────────────

const relatedGuides = [
  {
    href: '/guides/medicare-levy-surcharge-explained',
    title: 'MLS Explained',
    description: 'The 1–1.5% tax on higher earners without hospital cover.',
  },
  {
    href: '/guides/is-private-health-insurance-worth-it',
    title: 'Is Private Health Insurance Worth It?',
    description: 'An honest look at when insurance makes sense — and when it doesn\'t.',
  },
  {
    href: '/guides/hospital-cover-tiers-explained',
    title: 'Hospital Cover Tiers Explained',
    description: 'Gold, Silver, Bronze, Basic — what each tier covers and who needs what.',
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function LHCLoadingGuidePage() {
  return (
    <GuideLayout
      title="Lifetime Health Cover Loading Explained"
      description="The 2%-per-year age penalty on hospital premiums — how it works, what it costs at every age, the 10-year rule that removes it, and the youth discount."
      publishDate="February 2026"
      readingTime="8 min read"
      toc={toc}
      faq={faq}
      relatedGuides={relatedGuides}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Guides', href: '/guides' },
        { label: 'LHC Loading Explained' },
      ]}
      pageUrl={PAGE_URL}
    >
      {/* ── What is LHC loading? ─────────────────────────────────────── */}
      <h2 id="what-is-lhc">What is LHC loading?</h2>

      <p>
        <strong>Lifetime Health Cover (LHC) loading</strong> is a government penalty that makes
        private hospital insurance more expensive for people who don&apos;t take it out early
        enough. It&apos;s a surcharge added on top of your hospital premium.
      </p>

      <p>
        The rule is simple: if you don&apos;t have hospital cover by{' '}
        <strong>1 July following your 31st birthday</strong>, you&apos;ll pay a 2% loading on
        your hospital premium for every year you&apos;re over 30 when you eventually do take
        it out.
      </p>

      <p>
        The loading can reach a maximum of 70% — and you have to pay it for 10 continuous years
        before it&apos;s removed. It only applies to hospital cover, not extras (dental, optical,
        physio).
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>The bottom line:</strong> The longer you wait past 31, the more you pay. A
          35-year-old pays 10% more. A 45-year-old pays 30% more. A 65-year-old pays 70% more.
          And you pay that extra amount for a full decade.{' '}
          <Link href="/lhc-loading-calculator" className="font-medium">
            Calculate your exact loading →
          </Link>
        </p>
      </div>

      {/* ── How it's calculated ───────────────────────────────────────── */}
      <h2 id="how-its-calculated">How LHC loading is calculated</h2>

      <p>The formula is straightforward:</p>

      <div className="callout">
        <p className="mb-1">
          <strong>Loading = 2% × (your age − 30)</strong>
        </p>
        <p className="mb-0">
          Capped at 70%. Applied to your hospital premium before the government rebate.
        </p>
      </div>

      <p>Some important details:</p>

      <ul>
        <li>
          Your <strong>LHC base day</strong> is the later of: (a) 1 July 2000, or (b) 1 July
          following your 31st birthday
        </li>
        <li>
          Loading accrues for every year after your base day that you <strong>don&apos;t</strong>
          {' '}have hospital cover
        </li>
        <li>
          The loading is calculated when you first take out (or resume) hospital cover, and stays
          fixed for 10 years
        </li>
        <li>
          It applies to <strong>hospital cover only</strong> — not extras or general treatment
        </li>
        <li>
          The loading is applied to the base premium <em>before</em> the government rebate is
          calculated — so the rebate partially offsets it, but you still pay more
        </li>
      </ul>

      {/* ── Cost projections ──────────────────────────────────────────── */}
      <h2 id="cost-projections">What LHC loading costs at every age</h2>

      <p>
        Here&apos;s what loading adds to a typical Bronze hospital policy ($1,357/year) if
        you&apos;ve never held hospital cover:
      </p>

      <table>
        <thead>
          <tr>
            <th>Age when you get cover</th>
            <th>Loading %</th>
            <th>Extra cost per year</th>
            <th>Extra cost over 10 years</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>30 or under</td>
            <td><strong>0%</strong></td>
            <td>$0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>31</td>
            <td>2%</td>
            <td>$27</td>
            <td>$271</td>
          </tr>
          <tr>
            <td>35</td>
            <td>10%</td>
            <td>$136</td>
            <td>$1,357</td>
          </tr>
          <tr>
            <td>40</td>
            <td>20%</td>
            <td>$271</td>
            <td>$2,714</td>
          </tr>
          <tr>
            <td>45</td>
            <td>30%</td>
            <td>$407</td>
            <td>$4,071</td>
          </tr>
          <tr>
            <td>50</td>
            <td>40%</td>
            <td>$543</td>
            <td>$5,428</td>
          </tr>
          <tr>
            <td>55</td>
            <td>50%</td>
            <td>$679</td>
            <td>$6,785</td>
          </tr>
          <tr>
            <td>60</td>
            <td>60%</td>
            <td>$814</td>
            <td>$8,142</td>
          </tr>
          <tr>
            <td>65+</td>
            <td>70% (max)</td>
            <td>$950</td>
            <td>$9,499</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are the loading costs alone — on top of the base premium of $1,357. A 45-year-old
        would pay $1,357 + $407 = <strong>$1,764/year</strong> for the same Bronze policy that
        costs a 30-year-old $1,357.
      </p>

      <p>
        And these are conservative numbers — they use today&apos;s premiums. With average annual
        premium increases of 4.4%, the real 10-year cost will be higher.
      </p>

      {/* ── Worked example 1 ──────────────────────────────────────────── */}
      <h2 id="worked-example-1">Worked example: age 35, never had cover</h2>

      <p>
        <strong>Alex</strong> is 35, has never had hospital cover, and is now considering
        taking it out.
      </p>

      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Age</td>
            <td>35</td>
          </tr>
          <tr>
            <td>Years over 30 without cover</td>
            <td>5</td>
          </tr>
          <tr>
            <td>LHC loading</td>
            <td><strong>10%</strong> (2% × 5)</td>
          </tr>
          <tr>
            <td>Bronze base premium</td>
            <td>$1,357/year</td>
          </tr>
          <tr>
            <td>Loading cost</td>
            <td>$136/year ($1,357 × 10%)</td>
          </tr>
          <tr>
            <td>Premium with loading</td>
            <td><strong>$1,493/year</strong></td>
          </tr>
          <tr>
            <td>10-year loading cost</td>
            <td><strong>$1,357</strong> ($136 × 10 years)</td>
          </tr>
          <tr>
            <td>Loading removed</td>
            <td>After 10 continuous years (age 45)</td>
          </tr>
        </tbody>
      </table>

      <p>
        Alex pays an extra $136 per year for 10 years — a total penalty of $1,357 for waiting
        5 years. Not catastrophic, but not nothing either. That&apos;s essentially an extra
        year&apos;s worth of Bronze premiums.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>The real question for Alex:</strong> Is the $1,357 total loading cost
          worth more or less than what he saved by not paying premiums from age 31 to 35?
          Four years of Bronze cover would have cost ~$5,428 — so Alex actually came out
          ahead by waiting, assuming he didn&apos;t need hospital treatment during those years.
          The maths changes at older ages.
        </p>
      </div>

      {/* ── Worked example 2 ──────────────────────────────────────────── */}
      <h2 id="worked-example-2">Worked example: age 45, cost of waiting</h2>

      <p>
        <strong>Michelle</strong> is 45 and has never had hospital cover. She&apos;s comparing
        the cost of getting cover now versus waiting until 50.
      </p>

      <h3>If Michelle gets cover now (age 45)</h3>

      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Loading</td>
            <td><strong>30%</strong> (2% × 15)</td>
          </tr>
          <tr>
            <td>Annual loading cost on Bronze</td>
            <td>$407</td>
          </tr>
          <tr>
            <td>10-year loading total</td>
            <td><strong>$4,071</strong></td>
          </tr>
          <tr>
            <td>Loading removed at age</td>
            <td>55</td>
          </tr>
        </tbody>
      </table>

      <h3>If Michelle waits until age 50</h3>

      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Loading</td>
            <td><strong>40%</strong> (2% × 20)</td>
          </tr>
          <tr>
            <td>Annual loading cost on Bronze</td>
            <td>$543</td>
          </tr>
          <tr>
            <td>10-year loading total</td>
            <td><strong>$5,428</strong></td>
          </tr>
          <tr>
            <td>Loading removed at age</td>
            <td>60</td>
          </tr>
        </tbody>
      </table>

      <p>
        By waiting 5 more years, Michelle&apos;s total loading penalty increases by{' '}
        <strong>$1,357</strong> ($5,428 − $4,071). She also pays loading until age 60 instead
        of 55 — during years when health needs tend to increase and the value of private cover
        is higher.
      </p>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>The compounding trap:</strong> Every year of delay adds 2% to your loading
          <em> and</em> pushes back the 10-year removal date. At 45, Michelle has 15 years of
          accrued loading and 10 more years to pay it off. The financial and health arguments
          for getting cover strengthen significantly after 40.
        </p>
      </div>

      {/* ── The 10-year rule ──────────────────────────────────────────── */}
      <h2 id="ten-year-rule">The 10-year removal rule</h2>

      <p>
        LHC loading is not permanent. After you maintain <strong>continuous hospital cover for
        10 years</strong>, the loading is removed completely. You go back to paying the standard
        base premium — the same as someone who has held cover since they were 30.
      </p>

      <p>Key details about the 10-year rule:</p>

      <ul>
        <li>
          The 10 years must be <strong>continuous</strong> — gaps in cover can pause or reset
          your progress (see grace period below)
        </li>
        <li>
          You can switch insurers during the 10 years without affecting your progress —
          your loading history is tracked by Medicare, not your insurer
        </li>
        <li>
          The loading percentage is <strong>fixed</strong> when you take out cover. If you
          get cover at 35 with 10% loading, it stays at 10% for the full 10 years — it
          doesn&apos;t increase as you age
        </li>
        <li>
          Any tier of hospital cover counts — you can hold Basic the entire time if you want
        </li>
      </ul>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Strategy:</strong> If you&apos;re mainly getting hospital cover to
          start the 10-year loading removal clock, you can hold the cheapest Basic policy
          for 10 years. Once the loading is removed, you can upgrade to a higher tier
          (though upgrading has its own 12-month waiting period for new services).
        </p>
      </div>

      {/* ── Youth discount ────────────────────────────────────────────── */}
      <h2 id="youth-discount">Youth discount (ages 18–29)</h2>

      <p>
        Since 1 April 2019, Australians aged 18–29 can receive a discount on hospital cover
        premiums — the opposite of LHC loading.
      </p>

      <table>
        <thead>
          <tr>
            <th>Age when you take out cover</th>
            <th>Discount</th>
            <th>Annual saving on Bronze ($1,357)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>18–25</td>
            <td><strong>10%</strong> (maximum)</td>
            <td>$136</td>
          </tr>
          <tr>
            <td>26</td>
            <td>8%</td>
            <td>$109</td>
          </tr>
          <tr>
            <td>27</td>
            <td>6%</td>
            <td>$81</td>
          </tr>
          <tr>
            <td>28</td>
            <td>4%</td>
            <td>$54</td>
          </tr>
          <tr>
            <td>29</td>
            <td>2%</td>
            <td>$27</td>
          </tr>
          <tr>
            <td>30+</td>
            <td>0%</td>
            <td>$0</td>
          </tr>
        </tbody>
      </table>

      <p>The discount has some important conditions:</p>

      <ul>
        <li>
          The discount is <strong>locked in</strong> at the age you take out cover. If you
          get cover at 24 with a 10% discount, you keep that 10% until you turn 41
        </li>
        <li>
          From age 41, the discount <strong>phases out</strong> at 2% per year (back to 0%
          by age 46 for someone who had the maximum 10% discount)
        </li>
        <li>
          It applies to <strong>hospital cover only</strong>, not extras
        </li>
        <li>
          <strong>Not all insurers offer it</strong> — the youth discount is optional for
          health funds. Check with your insurer before assuming you&apos;ll receive it
        </li>
        <li>
          On couple or family policies, the discount is the <strong>average</strong> of both
          adults&apos; individual discounts
        </li>
      </ul>

      {/* ── Grace period ──────────────────────────────────────────────── */}
      <h2 id="grace-period">The 1,094-day grace period</h2>

      <p>
        You don&apos;t lose everything if you briefly drop your hospital cover. The LHC rules
        include a <strong>lifetime grace period of 1,094 days</strong> (approximately 3 years
        minus 1 day).
      </p>

      <p>This means:</p>

      <ul>
        <li>
          You can have gaps in your hospital cover totalling up to 1,094 days over your
          entire lifetime without your loading percentage increasing
        </li>
        <li>
          The days are <strong>cumulative</strong> — it&apos;s a lifetime total, not per gap.
          Three separate 1-year gaps use up all 1,094 days
        </li>
        <li>
          If you exceed 1,094 days without cover, your loading increases by 2% for each
          additional year
        </li>
        <li>
          Time spent continuously overseas does <strong>not</strong> count against your grace
          period
        </li>
        <li>
          Suspended cover (e.g., while travelling) <strong>does</strong> count against the
          grace period
        </li>
      </ul>

      <div className="callout">
        <p className="mb-0">
          <strong>Practical example:</strong> You held hospital cover for 6 years, then cancelled
          for 2 years (730 days). You&apos;ve used 730 of your 1,094 grace days. When you
          resume cover, your loading doesn&apos;t change — but you only have 364 days of grace
          remaining for any future gaps. And your 10-year removal clock pauses during gaps, so
          you&apos;d need 4 more continuous years to complete the 10.
        </p>
      </div>

      {/* ── Overseas residents ────────────────────────────────────────── */}
      <h2 id="overseas-residents">Overseas residents and new migrants</h2>

      <p>
        The LHC rules have specific provisions for people who have lived overseas:
      </p>

      <h3>Returning Australians</h3>
      <p>
        If you live overseas continuously, those days do <strong>not</strong> count toward your
        1,094-day grace period. Your loading clock effectively pauses while you&apos;re away.
        When you return, you have 12 months after registering for Medicare to take out hospital
        cover without increasing your loading.
      </p>

      <h3>New migrants</h3>
      <p>
        If you arrived in Australia after turning 31, your LHC base day is the first
        anniversary of your full Medicare registration — not your 31st birthday. This gives
        you a full year to get hospital cover after arriving before loading starts accruing.
      </p>

      <h3>Australians who were overseas on 1 July 2000</h3>
      <p>
        The LHC scheme started on 1 July 2000. If you were overseas on that date and over 31,
        you&apos;re treated as having held continuous cover during your time overseas. Your base
        day starts when you returned and registered for Medicare.
      </p>

      {/* ── What you should do ────────────────────────────────────────── */}
      <h2 id="what-to-do">What you should do</h2>

      <p>
        Your next step depends on your age and situation:
      </p>

      <h3>Under 31</h3>
      <p>
        You have time. Loading doesn&apos;t start until 1 July after your 31st birthday. If
        you&apos;re 28 or 29 and considering hospital cover anyway, getting it now locks in
        the youth discount (up to 6–10% off premiums until age 41). If you&apos;re below the
        MLS income threshold ($101,000 single), there may be no financial reason to get cover
        at all right now — the loading that starts at 31 is only 2% per year, and the first
        few years of loading are cheap.
      </p>

      <h3>31–40</h3>
      <p>
        Your loading is building but still manageable (2–20%). The cost of waiting grows every
        year. If you&apos;re above the MLS income threshold, a Basic hospital policy almost
        certainly makes financial sense — it avoids the MLS <em>and</em> starts your 10-year
        loading removal clock.
      </p>

      <h3>Over 40</h3>
      <p>
        Loading is now significant (20%+). Every year of delay adds 2% more loading and pushes
        back the 10-year removal date. At this age, health needs are increasing and the value
        of hospital cover is higher. The financial argument for getting cover is strongest here.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Run the numbers:</strong> Our{' '}
          <Link href="/lhc-loading-calculator" className="font-medium">
            LHC Loading Calculator
          </Link>{' '}
          shows your exact loading percentage, annual cost, and what happens if you wait.
          It takes about 30 seconds.
        </p>
      </div>
    </GuideLayout>
  );
}
