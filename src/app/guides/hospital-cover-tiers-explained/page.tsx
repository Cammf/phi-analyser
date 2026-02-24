import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import GuideLayout from '@/components/guide/GuideLayout';
import type { TocItem, FaqItem } from '@/components/guide/GuideLayout';

// ── SEO metadata ────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Hospital Cover Tiers Explained (2026) — Gold, Silver, Bronze & Basic Compared';
const PAGE_DESCRIPTION =
  'What each hospital cover tier actually covers in Australia — Gold, Silver, Bronze, and Basic compared. Costs, inclusions, exclusions, excess options, and which tier you actually need. Updated FY 2025–26.';
const PAGE_URL = `${SITE_URL}/guides/hospital-cover-tiers-explained`;

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
  { id: 'what-are-the-tiers', label: 'What are the tiers?' },
  { id: 'tier-comparison', label: 'Tier comparison table' },
  { id: 'gold', label: 'Gold hospital cover' },
  { id: 'silver', label: 'Silver hospital cover' },
  { id: 'bronze', label: 'Bronze hospital cover' },
  { id: 'basic', label: 'Basic hospital cover' },
  { id: 'clinical-categories', label: 'What each tier covers' },
  { id: 'excess-options', label: 'Excess options ($250–$750)' },
  { id: 'which-tier', label: 'Which tier do you actually need?' },
  { id: 'cost-of-downgrading', label: 'The real cost of downgrading' },
  { id: 'upgrading-rules', label: 'Upgrading: the 12-month catch' },
  { id: 'faq', label: 'FAQ' },
];

// ── FAQ items ───────────────────────────────────────────────────────────────

const faq: FaqItem[] = [
  {
    question: 'What is the difference between Gold and Silver hospital cover?',
    answer:
      'Gold covers every clinical category — including cardiac, pregnancy, joint replacements, assisted reproduction, weight loss surgery, and all psychiatric and rehabilitation services. Silver covers most hospital services but excludes some elective procedures like assisted reproduction, weight loss surgery, and some plastic/reconstructive surgery. If you need pregnancy cover or plan joint replacement surgery, Gold is typically required.',
  },
  {
    question: 'Is Basic hospital cover worth it?',
    answer:
      'Basic hospital cover is essentially a tax product. It covers very little — only rehabilitation, psychiatric care, and palliative care as a private patient. Its main purpose is to meet the MLS exemption requirements at the lowest possible cost. If you only want to avoid the Medicare Levy Surcharge and don\'t need hospital coverage, Basic is the cheapest option. If you want actual hospital protection, look at Bronze or above.',
  },
  {
    question: 'What does Bronze hospital cover include?',
    answer:
      'Bronze covers core hospital treatments plus some additional procedures like cataract surgery, hernia repair, colonoscopy, tonsillectomy, and appendicectomy. However, it restricts or excludes many common procedures including joint replacements (hip, knee, shoulder), cardiac surgery, pregnancy, and assisted reproduction. Bronze works for people who want some genuine hospital cover beyond a tax product, without paying for full coverage.',
  },
  {
    question: 'Can I switch hospital cover tiers at any time?',
    answer:
      'You can downgrade at any time and the change takes effect immediately. However, upgrading comes with a 12-month waiting period for any procedures covered at the new tier that were not covered at your old tier. For example, if you upgrade from Bronze to Gold, you\'ll wait 12 months before you can claim for joint replacements or pregnancy. This is why it\'s important to choose the right tier before you need it.',
  },
  {
    question: 'Which hospital tier do I need for pregnancy?',
    answer:
      'You need Gold hospital cover for pregnancy and birth-related services (obstetrics). Pregnancy is not covered on Silver, Bronze, or Basic tiers. There is also a 12-month waiting period — you must hold the policy for 12 months before you can claim for pregnancy-related hospital admissions. Plan ahead: if you\'re thinking about starting a family in the next 1–2 years, Gold cover now avoids the waiting period problem.',
  },
  {
    question: 'What is a hospital excess and which should I choose?',
    answer:
      'An excess (also called a front-end deductible) is the amount you pay per hospital admission before your insurer covers the rest. Common options are $250, $500, or $750. Higher excess = lower premium. A $750 excess typically saves 15–25% on premiums compared to no excess. Choose a higher excess if you\'re unlikely to be hospitalised frequently and can afford the out-of-pocket cost. The maximum excess for MLS purposes is $750 (single) or $1,500 (family).',
  },
  {
    question: 'Does my hospital tier affect wait times?',
    answer:
      'Your tier doesn\'t directly affect wait times, but it determines which procedures you can access privately. If a procedure is covered by your tier, you can use your insurance to see a private surgeon — typically within weeks rather than months. If the procedure isn\'t covered (e.g., joint replacement on Bronze), you\'ll be treated as a public patient with the corresponding public wait time, regardless of having insurance.',
  },
  {
    question: 'What happened to the old hospital cover categories?',
    answer:
      'Before April 2019, health insurers used their own names and categories for hospital products, making comparison extremely difficult. The Australian Government introduced the standardised Gold/Silver/Bronze/Basic tier system so consumers could compare policies across different insurers more easily. Each tier has minimum coverage requirements set by law. Insurers can still offer "plus" variants (e.g., Silver Plus) that cover additional categories beyond the minimum.',
  },
];

// ── Related guides ──────────────────────────────────────────────────────────

const relatedGuides = [
  {
    href: '/guides/is-private-health-insurance-worth-it',
    title: 'Is Private Health Insurance Worth It?',
    description: 'An honest look at when insurance makes financial sense — and when it doesn\'t.',
  },
  {
    href: '/guides/medicare-levy-surcharge-explained',
    title: 'Medicare Levy Surcharge Explained',
    description: 'Who pays the 1–1.5% surcharge and how to avoid it.',
  },
  {
    href: '/guides/lifetime-health-cover-loading',
    title: 'LHC Loading Explained',
    description: 'The age penalty on premiums and the 10-year rule that removes it.',
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function HospitalTiersGuidePage() {
  return (
    <GuideLayout
      title="Hospital Cover Tiers Explained"
      description="Gold, Silver, Bronze, Basic — what each tier covers, what each costs, and who actually needs what. A plain-English guide to the hospital cover tier system."
      publishDate="February 2026"
      readingTime="8 min read"
      toc={toc}
      faq={faq}
      relatedGuides={relatedGuides}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Guides', href: '/guides' },
        { label: 'Hospital Cover Tiers Explained' },
      ]}
      pageUrl={PAGE_URL}
    >
      {/* ── What are the tiers? ───────────────────────────────────────── */}
      <h2 id="what-are-the-tiers">What are the hospital cover tiers?</h2>

      <p>
        Since April 2019, every private hospital insurance policy in Australia must be classified
        into one of <strong>four standardised tiers</strong>: Gold, Silver, Bronze, or Basic.
      </p>

      <p>
        Before this system, every insurer used their own names and categories — making it nearly
        impossible to compare policies across different health funds. The tier system was introduced
        by the Australian Government specifically to fix this.
      </p>

      <p>Each tier has <strong>minimum coverage requirements set by law</strong>:</p>

      <ul>
        <li><strong>Gold</strong> — covers all hospital clinical categories</li>
        <li><strong>Silver</strong> — covers most hospital services, with some exclusions</li>
        <li><strong>Bronze</strong> — covers core hospital services, with significant restrictions</li>
        <li><strong>Basic</strong> — very limited cover (rehabilitation, psychiatric, palliative care)</li>
      </ul>

      <p>
        Insurers can also offer &quot;plus&quot; variants — like Silver Plus or Bronze Plus — that
        cover additional clinical categories beyond the minimum for that tier. Always check the
        specific inclusions, not just the tier name.
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>Key point:</strong> The tier tells you <em>what procedures</em> are covered. It
          does not determine the quality of hospital care, the excess you pay, or the size of any
          gap fees. Those are separate considerations.
        </p>
      </div>

      {/* ── Tier comparison table ─────────────────────────────────────── */}
      <h2 id="tier-comparison">Tier comparison at a glance</h2>

      <p>
        This table shows the average cost and coverage level for each tier. Premiums are annual
        averages for a single adult with no LHC loading, before the government rebate:
      </p>

      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Avg premium (single)</th>
            <th>Coverage level</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Gold</strong></td>
            <td>$3,555/yr ($296/mo)</td>
            <td>Everything — all clinical categories</td>
            <td>Families, pregnancy, anyone wanting full protection</td>
          </tr>
          <tr>
            <td><strong>Silver</strong></td>
            <td>$2,475/yr ($206/mo)</td>
            <td>Most services — some elective exclusions</td>
            <td>General hospital protection without paying for everything</td>
          </tr>
          <tr>
            <td><strong>Bronze</strong></td>
            <td>$1,357/yr ($113/mo)</td>
            <td>Core services — restricted on many categories</td>
            <td>Budget-conscious people who want some genuine cover</td>
          </tr>
          <tr>
            <td><strong>Basic</strong></td>
            <td>$1,063/yr ($89/mo)</td>
            <td>Very limited — rehab, psychiatric, palliative only</td>
            <td>MLS avoidance (tax product)</td>
          </tr>
        </tbody>
      </table>

      <p>
        After the government rebate (24.3% for base-tier earners under 65), these costs
        drop significantly. A Bronze policy might cost around <strong>$1,027/year after
        rebate</strong> — about $20 per week.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Family premiums:</strong> Multiply the single premium by approximately 1.9×
          for couples or 2.0× for families. A Gold family policy averages around $7,110/year
          before rebate.
        </p>
      </div>

      {/* ── Gold ──────────────────────────────────────────────────────── */}
      <h2 id="gold">Gold hospital cover</h2>

      <p>
        Gold is the most comprehensive tier. It covers <strong>every clinical category</strong>,
        including services that are excluded or restricted on all other tiers:
      </p>

      <ul>
        <li><strong>Cardiac surgery</strong> — bypass grafts, valve replacements, pacemakers</li>
        <li><strong>Pregnancy and birth</strong> — private obstetric care, choice of obstetrician, C-sections</li>
        <li><strong>Joint replacements</strong> — hip, knee, shoulder (public wait: 175–265 days)</li>
        <li><strong>Assisted reproduction</strong> — IVF and related fertility treatments</li>
        <li><strong>Weight loss surgery</strong> — gastric band, sleeve gastrectomy</li>
        <li><strong>Psychiatric care</strong> — full inpatient mental health treatment</li>
        <li><strong>Rehabilitation</strong> — post-surgical and ongoing rehab programs</li>
        <li><strong>Palliative care</strong> — end-of-life treatment as a private patient</li>
      </ul>

      <p>
        Gold costs the most — averaging <strong>$3,555/year</strong> for a single adult before
        rebate — but it&apos;s the only tier that provides complete peace of mind. There are no
        &quot;sorry, that&apos;s not covered&quot; surprises.
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>Who needs Gold:</strong> Anyone planning pregnancy (the only tier that covers
          obstetrics), people approaching joint replacement age, those with cardiac risk factors,
          and anyone who wants to know they&apos;re covered for <em>everything</em> without checking
          the fine print.
        </p>
      </div>

      <p>
        Despite being the most comprehensive tier, approximately <strong>400,000 policyholders
        downgraded from Gold</strong> in the 12 months to June 2025 — driven primarily by
        cost-of-living pressures and the 4.41% premium increase in 2026.
      </p>

      {/* ── Silver ────────────────────────────────────────────────────── */}
      <h2 id="silver">Silver hospital cover</h2>

      <p>
        Silver covers <strong>most hospital services</strong> but excludes some elective and
        specialist procedures. It&apos;s the middle ground — genuinely useful hospital cover
        at a lower price than Gold.
      </p>

      <p>Silver typically <strong>includes</strong>:</p>

      <ul>
        <li>Most surgical procedures (appendicectomy, hernia, gallbladder, etc.)</li>
        <li>Cancer treatment (chemotherapy, radiotherapy, surgical oncology)</li>
        <li>Ear, nose, and throat surgery (tonsillectomy, septoplasty)</li>
        <li>Eye surgery (cataracts, glaucoma)</li>
        <li>Gastrointestinal procedures (colonoscopy, endoscopy)</li>
        <li>Mental health — inpatient psychiatric care</li>
        <li>Rehabilitation and palliative care</li>
      </ul>

      <p>Silver typically <strong>excludes</strong>:</p>

      <ul>
        <li>Pregnancy and birth (obstetrics) — Gold only</li>
        <li>Assisted reproduction (IVF) — Gold only</li>
        <li>Weight loss surgery — Gold only</li>
        <li>Some plastic and reconstructive surgery</li>
        <li>Heart and vascular system procedures may be restricted (check your policy)</li>
      </ul>

      <p>
        At <strong>$2,475/year</strong> before rebate ($206/month), Silver saves about $1,080
        per year compared to Gold. That&apos;s a significant saving — but you lose pregnancy
        cover and some specialist procedures.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Silver Plus:</strong> Many insurers offer Silver Plus policies that add back
          some Gold-only categories (e.g., cardiac surgery). If you want more coverage than standard
          Silver without paying full Gold prices, ask about Silver Plus options. Always check exactly
          which additional categories are included.
        </p>
      </div>

      {/* ── Bronze ────────────────────────────────────────────────────── */}
      <h2 id="bronze">Bronze hospital cover</h2>

      <p>
        Bronze covers <strong>core hospital services</strong> but comes with significant
        restrictions. Many common procedures are either excluded or covered only as a
        &quot;restricted&quot; benefit — meaning you may be treated as a public patient in a
        shared ward rather than as a private patient.
      </p>

      <p>Bronze typically <strong>includes</strong>:</p>

      <ul>
        <li>Cataract surgery (public wait: 88 days median)</li>
        <li>Colonoscopy and endoscopy (public wait: 122 days)</li>
        <li>Hernia repair and appendicectomy</li>
        <li>Tonsillectomy (public wait: 179 days)</li>
        <li>Septoplasty (public wait: 332 days)</li>
        <li>Psychiatric care, rehabilitation, and palliative care</li>
      </ul>

      <p>Bronze typically <strong>excludes or restricts</strong>:</p>

      <ul>
        <li>Joint replacements — hip, knee, shoulder (public wait: 175–265 days)</li>
        <li>Cardiac surgery — bypass, valve replacement</li>
        <li>Pregnancy and birth</li>
        <li>Assisted reproduction (IVF)</li>
        <li>Weight loss surgery</li>
        <li>Back, neck, and spine surgery</li>
        <li>Dialysis and organ transplants (may be restricted)</li>
      </ul>

      <p>
        At <strong>$1,357/year</strong> before rebate ($113/month), Bronze is considerably
        cheaper than Silver. After the base-tier rebate, it costs around $1,027/year — about
        $20 per week.
      </p>

      <p>
        Bronze is a reasonable choice for younger, healthier people who want some genuine hospital
        cover at a lower price. However, be aware of what&apos;s excluded — particularly joint
        replacements and cardiac surgery, which become more relevant with age.
      </p>

      {/* ── Basic ─────────────────────────────────────────────────────── */}
      <h2 id="basic">Basic hospital cover</h2>

      <p>
        Let&apos;s be direct: <strong>Basic hospital cover is essentially a tax product.</strong> It
        exists primarily to meet the MLS exemption requirements at the lowest possible cost.
      </p>

      <p>Basic covers only three clinical categories:</p>

      <ol>
        <li><strong>Rehabilitation</strong> — post-surgical and ongoing rehabilitation programs</li>
        <li><strong>Psychiatric care</strong> — inpatient mental health treatment</li>
        <li><strong>Palliative care</strong> — end-of-life care as a private patient</li>
      </ol>

      <p>
        That&apos;s it. No surgical procedures, no cancer treatment, no pregnancy, no joint
        replacements, no cardiac surgery. If you&apos;re admitted to hospital for virtually
        any surgical reason, Basic cover doesn&apos;t help — you&apos;ll be treated as a
        public patient.
      </p>

      <p>
        At <strong>$1,063/year</strong> before rebate ($89/month), Basic is the cheapest hospital
        tier. After the base-tier rebate (24.3% for under-65s earning under $101k), it costs
        approximately <strong>$805/year</strong>.
      </p>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>Don&apos;t confuse Basic with actual hospital protection.</strong> If you take
          out Basic cover thinking you&apos;re insured for hospital, you&apos;ll be disappointed
          when you need surgery. Basic is for people whose <em>only</em> goal is avoiding
          the{' '}
          <Link href="/guides/medicare-levy-surcharge-explained">Medicare Levy Surcharge</Link>.
          If you want hospital coverage, start at Bronze.
        </p>
      </div>

      {/* ── Clinical categories ───────────────────────────────────────── */}
      <h2 id="clinical-categories">What each tier covers: clinical categories</h2>

      <p>
        Hospital procedures are grouped into <strong>clinical categories</strong>. Here are
        the most common categories and which tiers cover them:
      </p>

      <table>
        <thead>
          <tr>
            <th>Clinical category</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Bronze</th>
            <th>Basic</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rehabilitation</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Psychiatric care</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Palliative care</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Cataracts / eye surgery</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Colonoscopy / endoscopy</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Tonsillectomy / ENT surgery</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Hernia / appendicectomy</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Cancer treatment</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Restricted</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Joint replacements (hip, knee)</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>No</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Cardiac surgery</td>
            <td>Yes</td>
            <td>Restricted</td>
            <td>No</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Back, neck, spine surgery</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Restricted</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Pregnancy / obstetrics</td>
            <td>Yes</td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Assisted reproduction (IVF)</td>
            <td>Yes</td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Weight loss surgery</td>
            <td>Yes</td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>&quot;Restricted&quot;</strong> means the insurer will pay a benefit, but you may
        be treated as a public patient (shared ward, no choice of doctor). It&apos;s better than
        no cover, but you don&apos;t get the full private hospital experience.
      </p>

      <div className="callout">
        <p className="mb-0">
          <strong>Important:</strong> This table shows minimum tier requirements. Insurers offering
          &quot;Plus&quot; variants (e.g., Bronze Plus, Silver Plus) may cover additional categories
          beyond the standard minimums. Always check your specific policy&apos;s product information
          sheet on{' '}
          <a
            href="https://www.privatehealth.gov.au"
            target="_blank"
            rel="noopener noreferrer"
          >
            privatehealth.gov.au
          </a>.
        </p>
      </div>

      {/* ── Excess options ────────────────────────────────────────────── */}
      <h2 id="excess-options">Excess options: $250, $500, or $750?</h2>

      <p>
        Your <strong>excess</strong> (also called a front-end deductible) is the amount you pay
        out of pocket per hospital admission before your insurer covers the rest. Choosing a
        higher excess lowers your premium:
      </p>

      <table>
        <thead>
          <tr>
            <th>Excess level</th>
            <th>Typical premium discount</th>
            <th>Annual saving (on $2,475 Silver)</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$0 (no excess)</td>
            <td>—</td>
            <td>—</td>
            <td>Frequent hospital users, those who can&apos;t afford out-of-pocket</td>
          </tr>
          <tr>
            <td>$250</td>
            <td>5–10%</td>
            <td>~$124–248/yr</td>
            <td>Low-risk compromise</td>
          </tr>
          <tr>
            <td>$500</td>
            <td>10–18%</td>
            <td>~$248–446/yr</td>
            <td>Most people — good balance of savings vs risk</td>
          </tr>
          <tr>
            <td>$750</td>
            <td>15–25%</td>
            <td>~$371–619/yr</td>
            <td>Healthy people, MLS avoiders, budget-focused</td>
          </tr>
        </tbody>
      </table>

      <p>
        The maths is straightforward: if you choose a $500 excess and save $300/year in premiums,
        the excess pays for itself unless you&apos;re admitted to hospital more than once every
        ~20 months. For most people, a <strong>$500 excess is the sweet spot</strong>.
      </p>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>MLS excess limit:</strong> For your hospital cover to count as &quot;appropriate
          cover&quot; for MLS purposes, the excess must not exceed <strong>$750 for singles</strong>{' '}
          or <strong>$1,500 for couples/families</strong>. Most standard policies already meet this
          requirement.
        </p>
      </div>

      <p>
        Some policies charge the excess per person per admission, while others cap it at one
        excess per year or per policy. Check whether your excess applies per admission or per
        year — this significantly affects the real cost if you or a family member needs multiple
        hospital stays.
      </p>

      {/* ── Which tier do you need? ───────────────────────────────────── */}
      <h2 id="which-tier">Which tier do you actually need?</h2>

      <p>
        The right tier depends on your life stage, health needs, and budget. Here are the most
        common scenarios:
      </p>

      <h3>Planning pregnancy → Gold</h3>
      <p>
        Pregnancy is covered only on Gold. If you&apos;re planning a family in the next 1–2 years,
        Gold cover now avoids the 12-month waiting period. Private maternity care costs $5,000–15,000
        out of pocket without insurance. Remember: the 12-month obstetric waiting period means
        you need to take out Gold <em>before</em> you conceive, ideally with a few months of buffer.
      </p>

      <h3>Joint pain or over 50 → Silver or Gold</h3>
      <p>
        Joint replacements (hip, knee, shoulder) require at minimum Silver cover. Public wait times
        are among the longest in the system — <strong>265 days median for knee replacement</strong>,
        with 1 in 10 waiting over 614 days. Private wait: typically 4–12 weeks. If you&apos;re
        approaching the age where joint issues become likely, Silver or Gold makes sense.
      </p>

      <h3>General hospital protection → Silver</h3>
      <p>
        Silver covers most hospital services — cancer treatment, ENT surgery, gastrointestinal
        procedures, eye surgery, mental health, and more. For most adults without specific
        pregnancy or cardiac needs, Silver provides good coverage at a moderate price.
      </p>

      <h3>Young and healthy, some cover → Bronze</h3>
      <p>
        Bronze covers core procedures like cataracts, colonoscopy, tonsillectomy, hernia, and
        appendicectomy. It excludes joint replacements and cardiac surgery — procedures that are
        uncommon in younger people. At $1,357/year before rebate, Bronze gives you genuine hospital
        cover at roughly half the cost of Silver.
      </p>

      <h3>Just avoiding the MLS → Basic</h3>
      <p>
        If your income is above $101,000 (single) or $202,000 (family) and your only goal is
        avoiding the Medicare Levy Surcharge, Basic is the cheapest compliant option. At every
        MLS tier, Basic cover costs less than the surcharge. See our{' '}
        <Link href="/mls-calculator">MLS Calculator</Link> for your exact comparison.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Not sure?</strong> Start with Silver — it covers the majority of hospital
          scenarios at a reasonable price. You can always downgrade later if you decide you&apos;re
          paying for coverage you don&apos;t need, but upgrading comes with a 12-month waiting
          period for new categories.
        </p>
      </div>

      {/* ── Cost of downgrading ───────────────────────────────────────── */}
      <h2 id="cost-of-downgrading">The real cost of downgrading</h2>

      <p>
        With premiums rising 4.41% in 2026 — the highest increase since 2017 — downgrading
        is tempting. Approximately 400,000 people downgraded from Gold in the past year. But
        it&apos;s important to understand what you lose:
      </p>

      <h3>Gold → Silver (save ~$1,080/year)</h3>
      <p>
        You lose: pregnancy cover, IVF, weight loss surgery, and potentially some cardiac
        restrictions. If you&apos;re done having children and don&apos;t need these specific
        services, this is often a reasonable downgrade.
      </p>

      <h3>Silver → Bronze (save ~$1,118/year)</h3>
      <p>
        You lose: joint replacements, cardiac surgery, back/spine surgery, and some cancer
        treatment becomes restricted. This is a bigger step — joint replacements are among
        the most common elective procedures for over-50s, and public wait times are severe
        (175–265 days median). Think carefully about this one, especially if you&apos;re over 40.
      </p>

      <h3>Bronze → Basic (save ~$294/year)</h3>
      <p>
        You lose: virtually all hospital cover. Basic only covers rehab, psychiatric, and
        palliative care. The saving is only ~$294/year ($5.65/week) — a small amount to
        give up genuine hospital protection. Unless you truly only need a tax product, this
        downgrade rarely makes sense.
      </p>

      <div className="callout-warning">
        <p className="mb-0">
          <strong>The catch:</strong> If you downgrade now and need to upgrade later, you face
          a <strong>12-month waiting period</strong> for any procedures covered at the higher
          tier that were not covered at your current tier. You can&apos;t upgrade the week before
          you need knee surgery — the waiting period applies.
        </p>
      </div>

      {/* ── Upgrading rules ───────────────────────────────────────────── */}
      <h2 id="upgrading-rules">Upgrading: the 12-month catch</h2>

      <p>
        When you upgrade your hospital cover to a higher tier, a <strong>12-month waiting
        period</strong> applies to any clinical categories that are newly covered at the higher
        tier. This is the same waiting period that applies when you first take out hospital cover.
      </p>

      <p>Here&apos;s what this means in practice:</p>

      <ul>
        <li>
          <strong>Bronze → Silver:</strong> 12-month wait for joint replacements, cardiac surgery,
          and other Silver-only categories
        </li>
        <li>
          <strong>Silver → Gold:</strong> 12-month wait for pregnancy, IVF, weight loss surgery,
          and other Gold-only categories
        </li>
        <li>
          <strong>Basic → anything higher:</strong> 12-month wait for virtually all hospital
          procedures (since Basic covers almost nothing)
        </li>
      </ul>

      <p>
        Categories that were already covered at your old tier have <strong>no new waiting
        period</strong>. If you move from Bronze to Silver, you can immediately claim for
        procedures that Bronze already covered (cataracts, colonoscopy, etc.) — the 12-month
        wait only applies to the new categories (like joint replacements).
      </p>

      <p>
        There is also a <strong>12-month waiting period for pre-existing conditions</strong>.
        If you had signs or symptoms of a condition in the 6 months before joining or upgrading,
        the insurer can apply a 12-month wait for treatment of that condition — even if the
        procedure is covered at your tier.
      </p>

      <div className="callout-tip">
        <p className="mb-0">
          <strong>Plan ahead:</strong> The 12-month waiting period means you need to have the
          right tier <em>before</em> you need it. If you think you might need a specific procedure
          in the next 1–2 years — pregnancy, joint replacement, cardiac surgery — get the
          appropriate tier now, not when symptoms start.
        </p>
      </div>
    </GuideLayout>
  );
}
