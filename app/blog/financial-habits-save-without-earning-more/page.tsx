import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import CompoundCalculator from '@/components/blog/CompoundCalculator';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'financial-habits-save-without-earning-more';
const post = getBlogPost(SLUG)!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: { canonical: `/blog/${SLUG}` },
  openGraph: { title: post.title, description: post.description, type: 'article', url: `/blog/${SLUG}`, publishedTime: post.publishedAt },
  twitter: { card: 'summary_large_image', title: post.title, description: post.tagline },
};

export default function Page() {
  const related = BLOG_POSTS.filter((p) => p.slug !== SLUG).slice(0, 2);
  return (
    <BlogLayout post={post} related={related}>
      <p className="text-[17px] font-semibold leading-snug text-zinc-800">
        Here&rsquo;s the math nobody told you in school:{' '}
        <strong>$<AnimatedCounter end={10} className="text-emerald-700" /> a day at a 7% return
        compounds to ~$<AnimatedCounter end={367000} className="text-emerald-700" /> in 30 years.</strong>{' '}
        $30 a day reaches over $1.1M. You don&rsquo;t need to earn more to build wealth — you need a daily
        financial habit. Here&rsquo;s the playbook, the 5 patterns that actually compound, and an
        interactive calculator below to find your number.
      </p>

      <Section id="definition" title="Definition: what is a financial habit?">
        <p>
          A <strong>financial habit</strong> is any recurring money behaviour that either{' '}
          <em>adds</em> to your net worth (saving, investing, earning) or <em>preserves</em> it
          (avoiding lifestyle inflation, declining bad spending). Like any habit, it&rsquo;s the
          <em> consistency</em> that compounds, not the size of any single action.
        </p>
        <p>The key distinction: financial habits are about <strong>inputs</strong>, not outcomes.</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Outcome:</strong> &ldquo;Save $100k by 35.&rdquo; (Goal — but not actionable today.)</li>
          <li><strong>Input habit:</strong> &ldquo;Transfer $300 to savings on the 1st of every month.&rdquo; (Daily/weekly action — produces the outcome.)</li>
        </ul>
        <p>
          You don&rsquo;t control your net worth directly. You control the actions that produce it. The
          actions are habits — and habits compound. See our piece on{' '}
          <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the compound effect
          </Link>{' '}
          for the math.
        </p>
      </Section>

      <Section id="what" title="What $10 a day actually becomes">
        <p>
          The numbers below assume a conservative 7% annual return (the long-run average for the S&amp;P
          500 after inflation). Drag the sliders below to see your own scenario.
        </p>

        {/* Interactive compound calculator */}
        <CompoundCalculator />

        <p>
          A few benchmarks from the calculator:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>$5/day for 30 years @ 7%</strong> → ~$183,000</li>
          <li><strong>$10/day for 30 years @ 7%</strong> → ~$367,000</li>
          <li><strong>$20/day for 30 years @ 7%</strong> → ~$733,000</li>
          <li><strong>$30/day for 30 years @ 7%</strong> → ~$1,100,000</li>
        </ul>
        <PullQuote>
          The cost of one daily coffee, invested instead of spent, is a paid-off house in 30 years.
          That&rsquo;s not financial advice — that&rsquo;s arithmetic.
        </PullQuote>
      </Section>

      <Section id="when" title="When to start (the cost of delay)">
        <p>
          Time matters more than amount. A 25-year-old saving $5/day for 40 years ends up with more
          than a 35-year-old saving $20/day for 30 years. The compounding curve is brutal in your favour
          early — and brutal against you when delayed.
        </p>
        <Callout icon="⏰" title="The 10-year delay cost">
          <p>
            Two friends. Both invest $5,000/year at 7%. Friend A starts at 25 and stops at 35 (invests
            $50k total). Friend B starts at 35 and stops at 65 (invests $150k total). At 65:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Friend A: $602,000</strong> (invested $50k)</li>
            <li><strong>Friend B: $540,000</strong> (invested $150k — 3x as much)</li>
          </ul>
          <p className="mt-2">Friend A wins. Time-in-market beats amount-invested by a wide margin.</p>
        </Callout>
        <p>The right time to start is the day you&rsquo;re reading this, with whatever number you can:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>If $5/day is comfortable, start there.</li>
          <li>If $50/month is the limit, start there.</li>
          <li>If $0 is honestly all you have, start with a habit of moving $0 — set up the transfer infrastructure.</li>
        </ul>
        <p>The amount can scale later. The habit must start now.</p>
      </Section>

      <Section id="how" title="How to install 5 financial habits that compound">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Automate the first 10% (the only habit that matters)</h3>
        <p>
          Set up an automatic transfer the day after payday — at least 10% of net income, into a
          separate savings or investment account. You don&rsquo;t decide. The transfer happens
          automatically. By the time you see your &ldquo;available&rdquo; balance, 10% is already gone.
        </p>
        <p>
          This single habit, run for 30 years on an average salary, produces more wealth than the
          other four combined. It works because it bypasses willpower entirely — automation always
          beats discipline.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. The 24-hour rule for unplanned spending</h3>
        <p>
          For any non-essential purchase over a threshold (start with $50), wait 24 hours before
          buying. Most impulse purchases evaporate in those 24 hours. The 20% that survive the wait
          are usually genuine wants worth the money.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Weekly money check-in (5 minutes)</h3>
        <p>
          Every Sunday: check your bank balance, credit card balance, and tracker. Not budgeting —
          just awareness. The act of looking weekly produces 30-40% better spending discipline than
          monthly checks. (You can&rsquo;t correct what you don&rsquo;t see.)
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Annual subscription audit</h3>
        <p>
          Once a year: list every recurring subscription. Cancel anything you used &lt;2x in the last
          quarter. The average adult discovers $1,000+/year in subscription leakage during the first
          audit. That money, redirected to savings: ~$90,000 over 30 years at 7%.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Lifestyle-inflation pause</h3>
        <p>
          When income increases (raise, bonus, side project), do not increase spending for 90 days.
          Bank the delta. The 90-day pause prevents the most common wealth-killer:{' '}
          <em>parking the new income into a higher lifestyle baseline that&rsquo;s impossible to retreat
          from</em>.
        </p>
      </Section>

      <Section id="why" title="Why financial habits beat financial knowledge">
        <p>
          You can read every personal finance book and still go broke. The opposite is also true:
          someone who doesn&rsquo;t know what a Roth IRA is, but automatically invests 10% of every
          paycheck for 30 years, ends up wealthy. Three reasons habits dominate knowledge:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Habits don&rsquo;t require attention.</strong> The automated transfer happens whether
            you&rsquo;re focused, tired, motivated, depressed, or on vacation. Knowledge requires you to
            be present and willing.
          </li>
          <li>
            <strong>Habits scale with time, not effort.</strong> 30 years of an automated $10/day is
            $109,500 contributed and $367,000 final balance. The other $257,500 was created by
            compounding — and compounding only happens if you&rsquo;re consistent across time.
          </li>
          <li>
            <strong>Habits create identity.</strong> &ldquo;I&rsquo;m a saver&rdquo; is a self-concept. Once installed,
            it makes the next financial decision easier. &ldquo;I&rsquo;m trying to save money&rdquo; is fragile;
            &ldquo;I&rsquo;m a saver&rdquo; isn&rsquo;t. See our piece on{' '}
            <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              identity-based habits
            </Link>
            .
          </li>
        </ul>
        <PullQuote>
          Your future wealth is more determined by what you do automatically every month than by what
          you decide deliberately in any year.
        </PullQuote>

        <Callout icon="📋" title="Your 30-day financial habit starter">
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>Day 1:</strong> Set up automatic transfer of 10% (or whatever&rsquo;s realistic) post-payday.</li>
            <li><strong>Day 2:</strong> Open a separate savings/investment account if you don&rsquo;t have one.</li>
            <li><strong>Day 7:</strong> First weekly check-in. 5 minutes. Just look.</li>
            <li><strong>Day 14:</strong> First 24-hour-rule trigger. Notice what happens.</li>
            <li><strong>Day 30:</strong> Subscription audit. Cancel 2-3 things you don&rsquo;t use.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear&rsquo;s &ldquo;Save &amp; Track&rdquo; module is built exactly for this — set a savings
          target, define a monthly contribution, log the transfers, watch the progress bar fill toward
          your goal. The dashboard shows your ETA, pace, and what 7% compounding would add. The
          quick-add presets (+1%, +5%, +10% of target) let you log a contribution in one tap. Set up
          the habit once. Watch the year build itself.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the compound effect
          </Link>
          ,{' '}
          <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            identity-based habits
          </Link>
          , and{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the two-minute rule
          </Link>{' '}
          (start the financial habit at its 2-minute version — setting up one auto-transfer takes
          exactly that long).
        </p>
      </Section>
    </BlogLayout>
  );
}
