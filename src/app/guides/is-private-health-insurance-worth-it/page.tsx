import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import GuideLayout from '@/components/guide/GuideLayout';
import type { TocItem, FaqItem } from '@/components/guide/GuideLayout';

// ── SEO metadata ────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Is Private Health Insurance Worth It in Australia? (2026) — Honest Analysis';
const PAGE_DESCRIPTION =
  'An honest look at whether private health insurance is worth it in Australia for FY 2025–26. Five factors that determine the answer, three real scenarios, and industry data. Sometimes the answer is no.';
const PAGE_URL = `${SITE_URL}/guides/is-private-health-insurance-worth-it`;

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
  { id: 'the-honest-answer', label: 'The honest answer' },
  { id: 'factor-1-income', label: 'Factor 1: Your income & the MLS' },
  { id: 'factor-2-age', label: 'Factor 2: Your age & LHC loading' },
  { id: 'factor-3-health', label: 'Factor 3: Your health needs' },
  { id: 'factor-4-risk', label: 'Factor 4: Your risk tolerance' },
  { id: 'factor-5-value', label: 'Factor 5: What you value' },
  { id: 'scenario-yes', label: 'When insurance clearly makes sense' },
  { id: 'scenario-no', label: 'When insurance clearly doesn\'t' },
  { id: 'scenario-uncertain', label: 'When it\'s genuinely uncertain' },
  { id: 'industry-context', label: 'The industry numbers' },
  { id: 'when-to-buy', label: 'When to buy vs when to skip' },
  { id: 'faq', label: 'FAQ' },
];

// ── FAQ items ───────────────────────────────────────────────────────────────

const faq: FaqItem[] = [
  {
    question: 'Is private health insurance worth it on a $100,000 salary?',
    answer:
      'At $100,000, you are just below the MLS threshold ($101,000 for singles), so there is no tax penalty for not having insurance. The answer depends on your health needs and risk tolerance. If you are healthy and have no planned procedures, the financial case for insurance is weak at this income. If you earn just over $101,000 (including fringe benefits and super), a Basic policy at ~$805/year after rebate is cheaper than the MLS.',
  },
  {
    question: 'Is private health insurance worth it for young people?',
    answer:
      'For most young, healthy people earning under $101,000 — no. You are covered by Medicare, there is no MLS penalty, and LHC loading has not started accruing (if you are under 31). The main reasons to consider it: you want a youth discount (ages 18–29), you are approaching 31 and want to avoid future LHC loading, or you have specific health needs like planned surgery or pregnancy.',
  },
  {
    question: 'Is extras cover worth it?',
    answer:
      'For the average person, no. APRA data shows the industry returns less than 45 cents for every dollar paid in extras premiums. If you use dental, optical, and physio frequently, you <em>might</em> break even — but most people pay more in premiums than they claim back. Consider self-insuring by putting the equivalent premium into a savings account and paying for dental and optical out of pocket.',
  },
  {
    question: 'Should I downgrade my cover to save money?',
    answer:
      'If cost is the priority, downgrading can make sense — but understand what you lose. Going from Gold to Silver saves ~$1,080/year but removes access to cardiac surgery, joint replacements, and some pregnancy services as a private patient. Going to Bronze saves more but covers very little. Going to Basic saves the most but is essentially a tax product. Check our <a href="/guides/hospital-cover-tiers-explained" class="text-primary hover:underline">tier guide</a> to see what each covers.',
  },
  {
    question: 'Can I just use the public system instead of private health insurance?',
    answer:
      'Yes. Medicare covers all Australians for treatment in public hospitals — free of charge. Emergency care is identical in public and private. The trade-offs with public: longer waiting times for elective surgery (knee replacement median 265 days vs ~60 private), no choice of doctor, shared wards, and potentially less continuity of care. For many Australians, these trade-offs are acceptable.',
  },
  {
    question: 'What happens if I drop my private health insurance?',
    answer:
      'Three things to consider: (1) If you earn over $101,000, you will start paying the MLS (1%–1.5% of income). (2) If you later want hospital cover again, you may face LHC loading — though you have a 1,094-day (3-year) grace period before loading increases. (3) You lose access to private hospital treatment and shorter waiting times, though emergency care remains identical.',
  },
  {
    question: 'Is private health insurance a waste of money?',
    answer:
      'It depends entirely on your situation. For a healthy 28-year-old earning $80,000 — statistically, yes, you will pay more in premiums than you receive in benefits. For a 55-year-old earning $160,000 with a family history of joint problems — insurance is likely to save you significant money and wait time. There is no universal answer. That is why we built a <a href="/should-i-get-private-health-insurance" class="text-primary hover:underline">calculator that uses your actual numbers</a>.',
  },
  {
    question: 'How much does private health insurance cost per month?',
    answer:
      'The average single combined (hospital + extras) premium is $272/month ($3,264/year). But costs vary enormously by tier: Basic hospital is ~$89/month, Bronze ~$113/month, Silver ~$206/month, Gold ~$296/month. Government rebates reduce these by 8–32% depending on your income and age. Use our <a href="/mls-calculator" class="text-primary hover:underline">MLS Calculator</a> to see your rebate.',
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
    href: '/guides/lifetime-health-cover-loading',
    title: 'LHC Loading Explained',
    description: 'The age penalty on premiums and the 10-year rule that removes it.',
  },
  {
    href: '/guides/hospital-cover-tiers-explained',
    title: 'Hospital Cover Tiers Explained',
    description: 'Gold, Silver, Bronze, Basic — what each tier covers and who needs what.',
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function IsPHIWorthItGuidePage() {
  return (
    <GuideLayout
      title="Is Private Health Insurance Worth It?"
      description="An honest, independent analysis of whether private health insurance makes financial sense in Australia. Five factors, three scenarios, real numbers. Sometimes the answer is no."
      publishDate="February 2026"
      readingTime="10 min read"
      toc={toc}
      faq={faq}
      relatedGuides={relatedGuides}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Guides', href: '/guides' },
        { label: 'Is Private Health Insurance Worth It?' },
      ]}
      pageUrl={PAGE_URL}
    >
      {/* ── The honest answer ─────────────────────────────────────────── */}
      <h2 id="the-honest-answer">The honest answer</h2>

      <p>
        It depends. That&apos;s not a cop-out — it genuinely depends on five things about your
        specific situation. For some Australians, private health insurance is a clear financial
        win. For others, it&apos;s a clear waste of money. And for many, it&apos;s a genuine
        toss-up.
      </p>

      <p>
        This guide will help you figure out which category you&apos;re in. We don&apos;t sell
        insurance, earn commissions, or have any financial incentive for you to buy a policy.
        When the numbers say insurance doesn&apos;t make sense, we&apos;ll tell you that.
      </p>

      <p>
        The five factors that determine your answer:
      </p>

      <ol>
        <li><strong>Your income</strong> — and whether you&apos;re paying the Medicare Levy Surcharge</li>
        <li><strong>Your age</strong> — and how much LHC loading you&apos;d face</li>
        <li><strong>Your health needs</strong> — current conditions and likely future needs</li>
        <li><strong>Your risk tolerance</strong> — how you feel about potential large medical costs</li>
        <li><strong>What you value</strong> — choice of doctor, shorter waits, private room</li>
      </ol>

      <p>
        Let&apos;s work through each one.
      </p>

      {/* ── Factor 1: Income ──────────────────────────────────────────── */}
      <h2 id="factor-1-income">Factor 1: Your income and the Medicare Levy Surcharge</h2>

      <p>
        This is the single biggest financial factor for most people. If your income for MLS
        purposes exceeds <strong>$101,000 (single)</strong> or <strong>$202,000
        (family)</strong>, you pay a 1–1.5% surcharge on top of the standard 2% Medicare Levy
        — unless you hold private hospital cover.
      </p>

      <p>What this means in dollars:</p>

      <table>
        <thead>
          <tr>
            <th>Income (single)</th>
            <th>Annual MLS</th>
            <th>Cheapest Basic cover (after rebate)</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$80,000</td>
            <td>$0 (below threshold)</td>
            <td>~$805</td>
            <td>No MLS — insurance is a pure cost</td>
          </tr>
          <tr>
            <td>$110,000</td>
            <td>$1,100</td>
            <td>~$891</td>
            <td className="text-green-700 dark:text-green-400 font-medium">Insurance saves $209/yr</td>
          </tr>
          <tr>
            <td>$130,000</td>
            <td>$1,625</td>
            <td>~$977</td>
            <td className="text-green-700 dark:text-green-400 font-medium">Insurance saves $648/yr</td>
          </tr>
          <tr>
            <td>$180,000</td>
            <td>$2,700</td>
            <td>$1,063</td>
            <td className="text-green-700 dark:text-green-400 font-medium">Insurance saves $1,637/yr</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>If you earn above $101,000:</strong> basic hospital cover almost certainly makes
        financial sense. The insurance costs less than the tax penalty — you come out ahead even
        if you never use the insurance.
      </p>

      <p>
        <strong>If you earn below $101,000:</strong> there is no MLS penalty. Insurance is a
        pure cost with no tax offset. The financial case depends entirely on the other four
        factors.
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>Remember:</strong> MLS income includes fringe benefits, investment losses,
          and super contributions — not just your salary. Many people earning $85,000–$100,000
          in salary actually exceed the $101,000 MLS threshold once these are added.{' '}
          <Link href="/mls-calculator" className="font-medium">
            Check your exact MLS cost →
          </Link>
        </p>
      </div>

      {/* ── Factor 2: Age ─────────────────────────────────────────────── */}
      <h2 id="factor-2-age">Factor 2: Your age and LHC loading</h2>

      <p>
        If you don&apos;t take out hospital cover by 1 July after your 31st birthday, you pay
        a <strong>2% loading per year</strong> on your hospital premium when you eventually do.
        The loading lasts for 10 years.
      </p>

      <p>The cost of waiting — extra you pay on a Bronze policy ($1,357/year):</p>

      <table>
        <thead>
          <tr>
            <th>Age you get cover</th>
            <th>Loading</th>
            <th>10-year penalty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>30 or under</td>
            <td>0%</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>35</td>
            <td>10%</td>
            <td>$1,357</td>
          </tr>
          <tr>
            <td>40</td>
            <td>20%</td>
            <td>$2,714</td>
          </tr>
          <tr>
            <td>45</td>
            <td>30%</td>
            <td>$4,071</td>
          </tr>
          <tr>
            <td>55</td>
            <td>50%</td>
            <td>$6,785</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>If you&apos;re under 31:</strong> no loading accrues yet. You can wait without
        penalty. If you&apos;re under 30, you may also qualify for a youth discount (2–10% off).
      </p>

      <p>
        <strong>If you&apos;re over 31 without cover:</strong> loading is accruing at 2% per
        year. The longer you wait, the more expensive insurance becomes when you eventually
        need it. This doesn&apos;t mean you <em>should</em> get cover now — but the cost of
        getting it later is increasing.
      </p>

      <p>
        See our{' '}
        <Link href="/guides/lifetime-health-cover-loading">LHC loading guide</Link> for worked
        examples and the full cost table.
      </p>

      {/* ── Factor 3: Health ──────────────────────────────────────────── */}
      <h2 id="factor-3-health">Factor 3: Your health needs</h2>

      <p>
        Insurance is most valuable when you actually need hospital treatment. Consider:
      </p>

      <ul>
        <li>
          <strong>Planned procedures:</strong> If you need a knee replacement, hip replacement,
          or other elective surgery, the public waiting times are long. Knee replacements have
          a median public wait of 265 days; privately, it&apos;s around 60 days. But you need
          Silver or Gold cover for joint replacements — Bronze and Basic don&apos;t cover them.
        </li>
        <li>
          <strong>Pregnancy:</strong> If you&apos;re planning to have children in the next
          2–3 years, private maternity care gives you choice of obstetrician, private room,
          and shorter waits. But there is a <strong>12-month waiting period</strong> on all
          new policies for obstetric services, and Gold cover is required. Out-of-pocket costs
          for private birth are typically $2,400–$4,900 even with insurance.
        </li>
        <li>
          <strong>Mental health:</strong> Private psychiatric care has only a 2-month waiting
          period (vs 12 months for most hospital services) and is available from Bronze tier
          upward. If you need inpatient mental health support, private cover can significantly
          reduce wait times.
        </li>
        <li>
          <strong>Chronic conditions:</strong> If you have a condition likely to require future
          surgery or hospital stays, insurance becomes more valuable. But pre-existing
          conditions have a 12-month waiting period on new policies.
        </li>
        <li>
          <strong>Emergency care:</strong> Identical in public and private. If an ambulance
          takes you to emergency, you are treated the same regardless of insurance. Private
          health insurance does not give you faster or better emergency care.
        </li>
      </ul>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>Key insight:</strong> If you are young, healthy, and have no planned
          procedures or pregnancy, the health-needs argument for insurance is weak. Medicare
          covers everything you&apos;re likely to need. Insurance is most valuable for people
          who are likely to use it — which tends to correlate with age, family plans, and
          existing conditions.
        </p>
      </div>

      {/* ── Factor 4: Risk ────────────────────────────────────────────── */}
      <h2 id="factor-4-risk">Factor 4: Your risk tolerance</h2>

      <p>
        Insurance is fundamentally about transferring risk. The question isn&apos;t just
        &quot;will I use it?&quot; — it&apos;s &quot;can I handle the cost if something
        unexpected happens?&quot;
      </p>

      <p>
        Without private cover, unexpected elective surgery means joining the public waiting
        list. A knee replacement at 265 days median wait might be manageable — or it might
        mean months of pain affecting your ability to work. That&apos;s a personal risk
        assessment, not a purely financial one.
      </p>

      <p>
        Some questions to ask yourself:
      </p>

      <ul>
        <li>
          Could you wait 6–12 months for elective surgery if needed? Many public waits are
          in this range.
        </li>
        <li>
          Do you have savings to cover potential gap fees? When privately insured, the average
          gap is $478 per hospital episode — though 87% of services have no gap at all.
        </li>
        <li>
          How important is certainty of timing? Private cover lets you schedule surgery at
          your convenience; public depends on availability and urgency.
        </li>
      </ul>

      <p>
        If you&apos;re comfortable with uncertainty and public waiting times, insurance is less
        valuable to you — regardless of the pure financial calculation.
      </p>

      {/* ── Factor 5: Values ──────────────────────────────────────────── */}
      <h2 id="factor-5-value">Factor 5: What you value</h2>

      <p>
        Beyond dollars and risk, private health insurance provides things that some people
        value highly and others don&apos;t care about:
      </p>

      <ul>
        <li>
          <strong>Choice of doctor:</strong> In public, you&apos;re treated by whoever is
          available. Privately, you choose your specialist. For some procedures (particularly
          pregnancy), this matters enormously to people. For others, it&apos;s irrelevant.
        </li>
        <li>
          <strong>Private room:</strong> Public hospitals use shared wards. Private gives you
          your own room. This is a comfort preference, not a medical one.
        </li>
        <li>
          <strong>Shorter waiting times:</strong> The gap is significant for some procedures.
          Knee replacement: 265 days public vs ~60 days private. Cataract surgery: 88 vs 22
          days. Septoplasty: 332 vs 45 days. For urgent-feeling conditions, shorter waits can
          be the primary reason people value insurance.
        </li>
        <li>
          <strong>Extras services:</strong> Dental, optical, physio, psychology. These are
          genuinely useful services — but extras cover returns less than 45 cents per dollar on
          average. You may get more value by self-insuring (saving the premium and paying out
          of pocket).
        </li>
      </ul>

      <p>
        These factors are personal. No calculator can tell you how much you value choosing
        your own obstetrician or having a private room. But we can tell you exactly how much
        it costs.
      </p>

      {/* ── Scenario: clearly makes sense ─────────────────────────────── */}
      <h2 id="scenario-yes">When insurance clearly makes sense</h2>

      <p>
        Private health insurance is almost certainly worth it if you match most of these:
      </p>

      <ul>
        <li>Income over $101,000 (single) or $202,000 (family) — you&apos;re paying the MLS</li>
        <li>Over 35 and expect to eventually want hospital cover — LHC loading is building</li>
        <li>Planning pregnancy in the next 1–3 years — 12-month waiting period to plan for</li>
        <li>Known upcoming surgery — orthopaedic, cataract, or other elective procedures</li>
        <li>Family history of conditions requiring surgical intervention</li>
      </ul>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Example:</strong> David, 42, earns $145,000, family of four. His MLS would be
          $1,450/year. Basic family cover after rebate costs approximately $1,610/year — nearly
          the same as his MLS. He&apos;s also accruing LHC loading at 24%. Getting Silver cover
          makes financial sense: it costs more than Basic but covers the joint surgery his GP
          has flagged as likely in the next 5 years. Public wait for a knee replacement: 265
          days. Private: ~60 days.
        </p>
      </div>

      {/* ── Scenario: clearly doesn't ─────────────────────────────────── */}
      <h2 id="scenario-no">When insurance clearly doesn&apos;t make sense</h2>

      <p>
        Private health insurance is probably not worth it if most of these apply:
      </p>

      <ul>
        <li>Income under $101,000 — no MLS penalty</li>
        <li>Under 31 — no LHC loading accruing yet</li>
        <li>Young and healthy with no planned procedures</li>
        <li>No pregnancy plans in the near term</li>
        <li>Comfortable with public hospital waiting times</li>
        <li>Have savings to cover unexpected dental and optical out of pocket</li>
      </ul>

      <div className="callout">
        <p className="mb-0">
          <strong>Example:</strong> Mia, 27, earns $78,000, single, healthy, no planned
          surgeries. She pays no MLS, has no LHC loading yet, and Medicare covers all her
          hospital needs. If she put $272/month (the average premium) into savings instead,
          she&apos;d have $3,264/year for dental, optical, and a growing emergency fund. In
          Mia&apos;s situation, insurance is a net cost with little practical benefit.
        </p>
      </div>

      <p>
        We are saying this plainly: <strong>for many young, healthy, lower-income
        Australians, private health insurance is not worth the money.</strong> Medicare
        provides comprehensive hospital coverage. The MLS doesn&apos;t apply. LHC loading
        hasn&apos;t started. The financial case simply isn&apos;t there.
      </p>

      {/* ── Scenario: genuinely uncertain ─────────────────────────────── */}
      <h2 id="scenario-uncertain">When it&apos;s genuinely uncertain</h2>

      <p>
        The trickiest situations are in between. These are the cases where reasonable people
        disagree:
      </p>

      <ul>
        <li>
          <strong>Income $90,000–$105,000:</strong> You&apos;re near the MLS threshold. A
          small pay rise or fringe benefit could push you over. Getting Basic cover ($805/year
          after rebate) is cheap insurance against an unexpected MLS bill — but it&apos;s still
          a cost if you stay below the threshold.
        </li>
        <li>
          <strong>Age 29–32:</strong> The LHC deadline is approaching or just passed. The
          loading is small (0–4%) and the 10-year cost is minimal. But getting cover now
          locks in low loading and starts the 10-year removal clock. Is it worth paying
          premiums for a decade to avoid a small loading? Financially, the maths is marginal.
        </li>
        <li>
          <strong>Healthy 40-year-old with growing income:</strong> No current health needs,
          but LHC loading is 20% and rising. You don&apos;t need insurance now, but you
          probably will in 10–15 years. Getting it now means 20% loading for 10 years; waiting
          until 50 means 40% loading for 10 years. The &quot;right&quot; answer depends on
          assumptions about your future health and income.
        </li>
        <li>
          <strong>Couple earning $180,000–$210,000 combined:</strong> Near or at the family
          threshold. If one partner changes jobs or income fluctuates, you may cross the
          threshold in some years but not others. Basic family cover provides certainty
          against MLS surprises.
        </li>
      </ul>

      <p>
        In these uncertain cases, <strong>running the numbers for your specific situation is
        the only way to decide.</strong> Generic advice can&apos;t account for your income,
        age, family situation, and health needs simultaneously.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          This is exactly why we built our calculators.{' '}
          <Link href="/mls-calculator" className="font-medium">Check your MLS cost</Link>
          {' '}and{' '}
          <Link href="/lhc-loading-calculator" className="font-medium">
            calculate your LHC loading
          </Link>{' '}
          to see where you actually stand — not where you think you stand.
        </p>
      </div>

      {/* ── Industry context ──────────────────────────────────────────── */}
      <h2 id="industry-context">The industry numbers you should know</h2>

      <p>
        Before deciding, understand the state of private health insurance in Australia:
      </p>

      <ul>
        <li>
          <strong>45.4% of Australians</strong> have hospital cover — down from ~47% five
          years ago. Participation is declining, not growing. More people are questioning
          the value proposition.
        </li>
        <li>
          <strong>~400,000 Gold downgrades</strong> in the year to June 2025. Cost-of-living
          pressure is pushing hundreds of thousands of Australians to lower-tier policies.
        </li>
        <li>
          <strong>Premiums rose 4.41% in 2026</strong> — the highest average increase since
          2017. The long-term average is 5.35% per year, consistently above inflation and
          wage growth.
        </li>
        <li>
          <strong>Hospital benefits ratio: ~83 cents per dollar.</strong> For every dollar in
          hospital premiums, about 83 cents goes back to policyholders as benefits. The rest
          covers administration, profit, and risk equalisation.
        </li>
        <li>
          <strong>Extras benefits ratio: less than 45 cents per dollar.</strong> Most people
          claim back less than half of what they pay in extras premiums. Extras cover is a
          convenience product, not a financial saving for the average person.
        </li>
        <li>
          <strong>Average gap fee: $478</strong> per hospital episode (when a gap is charged).
          87.1% of in-hospital services had no gap at all — but this rate is slowly declining.
        </li>
      </ul>

      <p>
        These numbers tell an important story: hospital cover provides decent value as
        insurance against large costs, but extras cover is generally poor value, and premiums
        are rising faster than most people&apos;s wages.
      </p>

      {/* ── When to buy vs skip ───────────────────────────────────────── */}
      <h2 id="when-to-buy">When to buy vs when to skip</h2>

      <p>
        Based on the five factors and the industry data, here is our summary:
      </p>

      <h3>Buy hospital cover if:</h3>
      <ul>
        <li>Your income exceeds the MLS threshold — even Basic cover saves money vs the MLS</li>
        <li>You are over 35 and expect to want cover in the future — loading is building</li>
        <li>You have specific upcoming health needs (surgery, pregnancy, mental health)</li>
        <li>You value shorter wait times and choice of doctor enough to pay for them</li>
      </ul>

      <h3>Skip hospital cover if:</h3>
      <ul>
        <li>Your income is comfortably below $101,000 and unlikely to rise above it</li>
        <li>You are under 31 with no current health needs</li>
        <li>You are comfortable with Medicare and public hospital waiting times</li>
        <li>You would rather save the premium money for other financial goals</li>
      </ul>

      <h3>Be cautious with extras cover:</h3>
      <ul>
        <li>Most people lose money on extras — less than 45 cents per dollar returned</li>
        <li>If you use dental and optical heavily, you might break even. Run the numbers.</li>
        <li>
          Consider the &quot;self-insurance&quot; approach: put the extras premium ($45–$115/month)
          into a dedicated savings account and pay for dental and optical out of pocket
        </li>
      </ul>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>Final thought:</strong> The &quot;right&quot; answer changes over time. Your
          income, age, health needs, and life circumstances will shift. Review your decision
          annually — particularly if you get a pay rise, approach a birthday milestone (31 for
          LHC, 65/70 for rebate increases), or have a change in health needs. The worst outcome
          is paying for insurance you don&apos;t need — or not having it when you do.
        </p>
      </div>
    </GuideLayout>
  );
}
