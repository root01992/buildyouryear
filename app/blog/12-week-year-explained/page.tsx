import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = '12-week-year-explained';
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
        Annual goals have a fatal flaw: 12 months is too long to feel urgent. By March, January&rsquo;s
        commitments feel like someone else&rsquo;s. The <strong>12-Week Year</strong> — created by Brian Moran
        in his 2013 book — fixes this by compressing a full year of progress into 12 weeks. Same goals.
        Four times the urgency. Here&rsquo;s how it works, and how to run your first cycle.
      </p>

      <Section id="definition" title="Definition: what is the 12-Week Year?">
        <p>
          The <strong>12-Week Year</strong> is a goal-execution framework that replaces calendar-year
          planning with rolling 12-week cycles. Every 12 weeks, you set 1–3 goals, build a weekly
          execution plan, and measure progress on lead/lag indicators. At week 13, you start over with
          fresh goals — even if you nailed the last ones.
        </p>
        <p>The core insight from Moran&rsquo;s consulting work with Fortune 500 sales teams:</p>
        <PullQuote>
          The annual planning horizon is the single biggest reason high-performers under-execute.
          Compress the timeline, and you get every benefit of urgency without the burnout of
          quarterly-OKR theatre.
        </PullQuote>
        <p>
          Twelve weeks is short enough to feel real on week one. Long enough to ship something
          meaningful. Repeatable enough to compound across the calendar year — you can run 4 cycles
          per year, instead of one.
        </p>
      </Section>

      <Section id="what" title="What makes a 12-Week Year different from a quarter">
        <p>
          On paper, a quarter (Q1, Q2, Q3, Q4) is also 12-13 weeks. But there&rsquo;s a critical structural
          difference between &ldquo;a quarter&rdquo; and &ldquo;a 12-Week Year&rdquo;:
        </p>
        <ComparisonTable
          headers={['Dimension', 'Traditional Quarter', '12-Week Year']}
          rows={[
            ['Time horizon framing', 'One slice of a year', 'A complete year — compressed'],
            ['Goal cadence', 'Often inherited from annual plan', 'Fresh goals each cycle'],
            ['Weekly review', 'Optional / inconsistent', 'Mandatory — drives the system'],
            ['Sense of urgency', 'Low until last 2 weeks', 'High from week 1'],
            ['Reset opportunities per year', '1 (Q1 resolution season)', '4 (every cycle)'],
            ['Failure recovery', 'Wait until next year', 'Restart in 12 weeks'],
          ]}
        />
        <p>
          That last row matters more than people realise. With annual planning, a January habit failure
          costs you 11 months of compounding. With the 12-Week Year, the maximum cost of any failure is
          12 weeks — then you reset.
        </p>

        {/* Visual: 52-week vs 12-week comparison */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Annual planning vs. 12-Week cycles: effort distribution
          </div>
          <svg viewBox="0 0 360 200" className="h-44 w-full">
            <text x="40" y="18" fontSize="10.5" fontWeight="700" fill="#52525b">Annual: effort spikes at the end</text>
            <text x="40" y="115" fontSize="10.5" fontWeight="700" fill="#52525b">12-Week: even effort, 4 cycles</text>
            {/* Annual graph */}
            <line x1="40" y1="70" x2="350" y2="70" stroke="#d4d4d8" />
            <path d="M 40 65 L 100 64 L 200 60 L 280 50 L 320 30 L 350 22"
              fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            {/* 12-week graph: 4 ramps */}
            <line x1="40" y1="170" x2="350" y2="170" stroke="#d4d4d8" />
            {[40, 117.5, 195, 272.5].map((x0, i) => (
              <path key={i}
                d={`M ${x0} 165 L ${x0 + 60} 130 L ${x0 + 77.5} 165`}
                fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            ))}
            {/* Labels */}
            <text x="350" y="178" fontSize="9" fill="#52525b" textAnchor="end">52 weeks →</text>
            <text x="350" y="82" fontSize="9" fill="#52525b" textAnchor="end">52 weeks →</text>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            Annual plans push effort into Q4. 12-Week cycles distribute peak effort 4 times — and
            harvest results 4 times.
          </div>
        </div>
      </Section>

      <Section id="when" title="When to use the 12-Week Year">
        <p>
          The framework shines when your goals are <strong>execution-bound</strong>, not
          discovery-bound. If you know what to do and the question is &ldquo;will I actually do it?&rdquo; — this
          is the system. Examples:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Lose 8 kg / get to a target body composition</li>
          <li>Ship a side project to first 100 users</li>
          <li>Read 12 books</li>
          <li>Write a book&rsquo;s first draft</li>
          <li>Hit a specific revenue or savings target</li>
          <li>Establish 3 daily habits and lock them in</li>
        </ul>
        <p>
          It is <em>not</em> the right tool for open-ended research, exploration, or career-pivot
          decisions where the goal itself is fuzzy. For those, stick with OKRs or a strategic doc and
          revisit quarterly. (See our{' '}
          <Link href="/blog/goal-setting-frameworks-compared" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            comparison of goal-setting frameworks
          </Link>{' '}
          for when each one wins.)
        </p>
        <Callout icon="📅" title="Best starting moments">
          You don&rsquo;t have to wait for January. The book recommends starting on a Monday, ideally one
          following a natural break (long weekend, end of a project, return from travel). The first
          Monday of each calendar quarter is also a strong default.
        </Callout>
      </Section>

      <Section id="how" title="How to run your first 12-Week Year">
        <p>The system has five components. Skip any one and the engine stalls.</p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">1. Set a vision (5 years out)</h3>
        <p>
          Before your 12-week goals, write a short vision: who you want to be in 5 years, what your life
          looks like, what you care about. Goals without a connecting vision are noise. Vision provides
          the &ldquo;why&rdquo; that survives week 5 motivation dips.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">2. Pick 1–3 goals for the cycle</h3>
        <p>
          Each goal must be <strong>specific, measurable, and finishable in 12 weeks</strong>. &ldquo;Improve
          health&rdquo; is not a 12-Week Year goal. &ldquo;Lose 4 kg by Week 12&rdquo; is. Three is the maximum. Most
          people who try to do five accomplish zero.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">3. Build the tactical plan</h3>
        <p>
          For each goal, list the weekly actions required. These are the <strong>lead measures</strong> —
          the things you control. If the goal is &ldquo;lose 4 kg&rdquo;, the lead measures might be: 4 strength
          workouts/week, 10k steps/day, 3 cooked meals/day. You do not control your weight directly. You
          control the inputs.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">4. Run the weekly review (mandatory)</h3>
        <p>
          Every Monday morning, score the previous week:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>What % of my planned actions did I complete? (target: 85%+)</li>
          <li>What blocked me? What worked?</li>
          <li>What 3 actions matter most this week?</li>
        </ul>
        <p>
          The weekly review is non-optional. Skip a week and the entire system collapses. Most failures
          of the 12-Week Year are weekly-review failures, not goal failures.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">5. Score weekly execution at 85%</h3>
        <p>
          Moran&rsquo;s research found that consistent 85% execution of weekly plans produces the same
          (often better) results as people aiming for 100% — because 100%-targeters burn out and quit.
          Aim for 85% on purpose. Build in slack.
        </p>
        <PullQuote>
          You don&rsquo;t need to be perfect. You need to be reliably 85%.
        </PullQuote>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">6. Take Week 13 off — then start fresh</h3>
        <p>
          After cycle 1, take a week to recover, review what worked, and choose your next 1–3 goals.
          This is where most adopters cheat — they roll directly into cycle 2 without recovery, then
          burn out by cycle 3. The intentional break is what makes the system sustainable across the
          full calendar year.
        </p>
      </Section>

      <Section id="why" title="Why it works (the psychology of compression)">
        <p>
          Three psychological forces make 12 weeks land where 52 weeks slip:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Parkinson&rsquo;s Law.</strong> Work expands to fill the time available. Give yourself a
            year, you&rsquo;ll use a year. Give yourself 12 weeks, you&rsquo;ll figure out what matters fast.
          </li>
          <li>
            <strong>Temporal discounting.</strong> Humans dramatically discount future rewards. December
            feels less real than next Friday. Compressing the goal makes the reward feel real on day one.
          </li>
          <li>
            <strong>Salience.</strong> A 12-week deadline is salient. A 12-month one is decorative.
            Salient deadlines drive behaviour; decorative ones don&rsquo;t.
          </li>
        </ul>
        <p>
          The compounding pattern is also brutal in your favour. Most people who run 12-Week Years
          report shipping <strong>3–4 meaningful goals per calendar year</strong>. Compare to the
          baseline: most annual-resolution-setters ship zero (we cover the numbers in our piece on{' '}
          <Link href="/blog/why-new-year-resolutions-fail" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why resolutions fail
          </Link>
          ).
        </p>

        <Callout icon="📋" title="Your 12-Week Year template">
          <ol className="list-decimal space-y-1 pl-5">
            <li>5-year vision: 1 paragraph.</li>
            <li>This cycle&rsquo;s goals: 1–3, specific, measurable, finishable.</li>
            <li>Weekly lead measures: 3-7 per goal.</li>
            <li>Monday review ritual: 15 minutes, every week.</li>
            <li>Target weekly execution score: 85%.</li>
            <li>Week 13: rest + plan cycle 2.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear runs this pattern out of the box. Set your 12-week goals, add the weekly habits
          that drive them, and the dashboard scores your execution automatically — including a
          12-week consistency heatmap so you can see at a glance whether you&rsquo;re tracking toward the
          85% number.
        </p>
        <p>
          The hardest part isn&rsquo;t the system. It&rsquo;s starting. The next Monday is closer than your next
          January 1st — by a factor of 13.
        </p>
      </Section>
    </BlogLayout>
  );
}
