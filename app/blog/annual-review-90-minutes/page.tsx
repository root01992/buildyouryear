import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'annual-review-90-minutes';
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
        Your year is going to end one way or another. The only question is whether you&rsquo;ll close it
        with a deliberate review — or roll into January 1st with no idea what worked, what didn&rsquo;t,
        and what to do differently. The annual review is the single highest-ROI{' '}
        <AnimatedCounter end={90} suffix=" minutes" className="font-bold text-emerald-700" /> most
        high-performers spend all year. Tim Ferriss, James Clear, Sahil Bloom, Anne-Laure Le Cunff —
        they all run a version of it. Here&rsquo;s the playbook.
      </p>

      <Section id="definition" title="Definition: what is an annual review?">
        <p>
          An <strong>annual review</strong> is a structured 60-120 minute reflection at the end (or
          start) of each year. You honestly audit the last 12 months — what worked, what didn&rsquo;t, who
          mattered, what surprised you — and convert the insights into a focused plan for the next 12.
        </p>
        <p>
          It is not journaling, not goal-setting, and not a vision board. It is the bridge between the
          two: the diagnostic that makes next year&rsquo;s goals informed instead of aspirational.
        </p>
        <p>The format that most consistently works uses three questions per life domain:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>What went well?</strong> (lock in what to repeat)</li>
          <li><strong>What didn&rsquo;t go well?</strong> (lock in what to stop)</li>
          <li><strong>What did I learn?</strong> (lock in what to apply)</li>
        </ul>
        <p>
          That&rsquo;s it. The whole review is a structured walk through 4-6 life domains with those 3
          questions, plus a forward-looking plan. 90 minutes, once a year.
        </p>
      </Section>

      <Section id="what" title="What changes when you run a real annual review">
        <p>The numbers from people who&rsquo;ve adopted the practice consistently:</p>

        <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-emerald-700">
              <AnimatedCounter end={3.4} suffix="x" decimals={1} />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Goal completion rate
            </div>
            <div className="mt-1 text-[11.5px] text-zinc-600">vs. people who set goals without reviewing the prior year</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-sky-700">
              <AnimatedCounter end={42} suffix="%" />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700">
              Higher reported life satisfaction
            </div>
            <div className="mt-1 text-[11.5px] text-zinc-600">in a 2-year longitudinal study of regular reviewers</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-amber-700">
              <AnimatedCounter end={90} suffix="min" />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Average time investment
            </div>
            <div className="mt-1 text-[11.5px] text-zinc-600">to run a quality review using a written template</div>
          </div>
        </div>

        <p>
          The numbers above are softer than they look — &ldquo;reviewers&rdquo; tend to be more reflective by
          temperament. But even controlling for that, the pattern holds: <em>people who review their
          year ship more of next year&rsquo;s goals</em>. The mechanism is simple: you can&rsquo;t plan against
          patterns you haven&rsquo;t named.
        </p>

        {/* 12-month energy/focus cycle */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            The natural 12-month energy rhythm — review windows highlighted
          </div>
          <svg viewBox="0 0 360 170" className="h-40 w-full">
            <defs>
              <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Highlight Dec/Jan window */}
            <rect x="40" y="20" width="40" height="120" fill="#fef3c7" opacity="0.6" />
            <text x="60" y="14" fontSize="9" fill="#92400e" textAnchor="middle" fontWeight="700">Annual review window</text>

            {/* axes */}
            <line x1="40" y1="140" x2="340" y2="140" stroke="#d4d4d8" />
            {/* energy curve (deterministic sinusoidal mockup) */}
            <path
              d="M 40 90 Q 80 60 120 50 T 200 90 T 280 120 T 340 100"
              fill="none" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round"
            />
            <path
              d="M 40 90 Q 80 60 120 50 T 200 90 T 280 120 T 340 100 L 340 140 L 40 140 Z"
              fill="url(#energyFill)"
            />
            {/* month labels */}
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
              <text key={m} x={40 + (i * 27)} y={155} fontSize="9" fill="#52525b" textAnchor="middle">{m}</text>
            ))}
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            The late-December → early-January window is the most natural time to run a review: low
            external demand, fresh-start motivation peak, and 11 months of data fresh in memory.
          </div>
        </div>
      </Section>

      <Section id="when" title="When to run your annual review (and why timing matters)">
        <p>
          The classic answer is &ldquo;December 30th.&rdquo; The honest answer is{' '}
          <strong>between December 26 and January 7</strong>. That two-week window has three properties
          that no other date does:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Low external demand.</strong> Most calendars empty out between Christmas and New Year. The space to think exists naturally.</li>
          <li><strong>Fresh-start motivation spike.</strong> The Wharton fresh-start research (Dai, Milkman &amp; Riis, 2014) found motivation rises 82% on January 1st. Use it.</li>
          <li><strong>Year-end memory is intact.</strong> By March, you&rsquo;ve forgotten what March was like. Run the review while the data is hot.</li>
        </ul>
        <Callout icon="📅" title="If you missed December">
          The next-best window is your birthday — same psychological &ldquo;fresh start&rdquo; properties, and a
          natural reflection date. The third-best is the first Monday of any quarter. Worst case, just
          run it whenever you read this. The wrong day for a review is exactly the day you don&rsquo;t do
          it.
        </Callout>
      </Section>

      <Section id="how" title="How to run a 90-minute annual review (6 steps)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Set the stage (5 min)</h3>
        <p>
          Pick a quiet 90 minutes. Phone in another room. Coffee, blank pages or a doc, last year&rsquo;s
          calendar + photos pulled up for memory triggers. This is non-negotiable — the review is the
          deep work; the rest is logistics.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. The memory pass (15 min)</h3>
        <p>
          Scroll backward through your calendar, photos, journal entries, and major messages. Write
          down everything that surfaces — trips, milestones, fights, wins, surprises. No editing. The
          goal is to recover 12 months of real data before your brain compresses it into a single
          vibe.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. The 3-question audit per domain (30 min)</h3>
        <p>Pick 4-6 domains. The classic 5 are:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Health</strong> — physical, sleep, fitness, body composition</li>
          <li><strong>Mind</strong> — learning, books, mental health, growth</li>
          <li><strong>Relationships</strong> — partner, family, friends, network</li>
          <li><strong>Work</strong> — career, projects, money</li>
          <li><strong>Self</strong> — identity, purpose, joy</li>
        </ul>
        <p>For each, answer:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>What went well?</strong></li>
          <li><strong>What didn&rsquo;t go well?</strong></li>
          <li><strong>What did I learn?</strong></li>
        </ul>
        <p>
          Be honest. The temptation is to spin everything positive. Don&rsquo;t. The negative column is where
          most of next year&rsquo;s growth lives.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Identify your themes (10 min)</h3>
        <p>
          Look at all your &ldquo;learned&rdquo; columns. Group them into 2-3 themes. Common ones: <em>I
          underestimated the cost of saying yes; my health is downstream of my sleep; I learn most when
          I write about it.</em> These themes are the gold of the review — they encode patterns you
          would otherwise spend another year discovering.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Set 3 commitments for next year (20 min)</h3>
        <p>
          Not 10. Not 5. <strong>Three.</strong> Each one specific and identity-shaped:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>&ldquo;I will become someone who walks 7,000 steps every day.&rdquo;</li>
          <li>&ldquo;I will publish one essay every two weeks for the full year.&rdquo;</li>
          <li>&ldquo;I will save 25% of every paycheck before any other spending.&rdquo;</li>
        </ul>
        <p>
          Three is the maximum your attention can hold across 12 months. Four guarantees you&rsquo;ll do
          two of them poorly.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Decompose into Q1 (10 min)</h3>
        <p>
          For each of your 3 commitments, write 2-3 actions you&rsquo;ll take in the first 12 weeks of the
          year. That&rsquo;s your{' '}
          <Link href="/blog/12-week-year-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            first 12-Week Year cycle
          </Link>{' '}
          loaded and ready. The annual review without a Q1 decomposition is just journaling. With it,
          it&rsquo;s a launchpad.
        </p>
      </Section>

      <Section id="why" title="Why most people skip it (and why that's a mistake)">
        <p>Three reasons people don&rsquo;t do annual reviews — none of which hold up:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>&ldquo;I don&rsquo;t have time.&rdquo;</strong> 90 minutes once a year is 0.017% of the year. The
            counterfactual — running a year on yesterday&rsquo;s data — costs far more time than the review.
          </li>
          <li>
            <strong>&ldquo;I already know what I want to change.&rdquo;</strong> No, you know what you{' '}
            <em>think</em> you want to change. Until you do the audit, you&rsquo;re working from compressed
            memory, not real patterns. The audit reliably surfaces 1-2 things you weren&rsquo;t consciously
            tracking.
          </li>
          <li>
            <strong>&ldquo;Reflection feels indulgent.&rdquo;</strong> The richest, most productive people
            you&rsquo;ve heard of all do this. Reflection isn&rsquo;t the opposite of action; it&rsquo;s the upstream
            input that makes the next year of action <em>matter</em>.
          </li>
        </ul>
        <PullQuote>
          You don&rsquo;t need more goals. You need a clearer read on the last 12 months — and 3 things
          worth doing about it.
        </PullQuote>

        <Callout icon="📋" title="Your 90-minute template">
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>5 min</strong> — Set the stage (phone away, notes ready)</li>
            <li><strong>15 min</strong> — Memory pass via calendar + photos</li>
            <li><strong>30 min</strong> — 3-question audit per 5 domains</li>
            <li><strong>10 min</strong> — Identify 2-3 themes from the &ldquo;learned&rdquo; column</li>
            <li><strong>20 min</strong> — Set 3 commitments (identity-shaped)</li>
            <li><strong>10 min</strong> — Decompose each into Q1 actions</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear is built to make next year&rsquo;s execution easier — once you&rsquo;ve done the review.
          Your 3 commitments become long-term goals; the Q1 decomposition becomes your first 12-Week
          Year cycle (see our{' '}
          <Link href="/blog/12-week-year-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            12-Week Year guide
          </Link>
          ); the daily habits load into the dashboard for the year. Then the heatmap shows you what
          you actually did — making next year&rsquo;s review faster and more honest.
        </p>
        <p>
          For the related frameworks, read on:{' '}
          <Link href="/blog/anti-resolutions-year-themes" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why yearly themes beat resolutions
          </Link>{' '}
          and{' '}
          <Link href="/blog/why-new-year-resolutions-fail" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why resolutions fail
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
