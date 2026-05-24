import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'compound-effect-1-percent-better';
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

  // Build curve data: 1% better and 1% worse over 365 days
  const points = Array.from({ length: 366 }, (_, d) => ({
    day: d,
    plus: Math.pow(1.01, d),
    minus: Math.pow(0.99, d),
  }));
  const maxY = Math.pow(1.01, 365); // ~37.78
  // SVG mapping: x = 40 + (day/365) * 280, y = 180 - (val / maxY) * 140 (for plus); for minus, y stays close to baseline.
  const xFor = (d: number) => 40 + (d / 365) * 280;
  const yForPlus = (v: number) => 180 - (v / maxY) * 140;
  const yForMinus = (v: number) => 180 - (v / maxY) * 140;
  const plusPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.day).toFixed(2)} ${yForPlus(p.plus).toFixed(2)}`).join(' ');
  const minusPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.day).toFixed(2)} ${yForMinus(p.minus).toFixed(2)}`).join(' ');
  // Reference horizontal line at value = 1
  const yBaseline = yForPlus(1);

  return (
    <BlogLayout post={post} related={related}>
      <p className="text-[17px] font-semibold leading-snug text-zinc-800">
        Here&rsquo;s the most famous productivity math of the last decade: improve 1% every day for a year,
        and you end up <strong>37.78x</strong> better. Decline 1% every day, and you end up at{' '}
        <strong>0.03x</strong> — practically zero. James Clear made the comparison famous in{' '}
        <em>Atomic Habits</em>. The math is real. The behavioural mechanism behind it is more
        interesting than the math.
      </p>

      <Section id="definition" title="Definition: what is the compound effect?">
        <p>
          The <strong>compound effect</strong> is the principle that small, consistent actions produce
          disproportionately large results over time — because each improvement{' '}
          <em>multiplies</em> the prior state rather than adding to a fixed baseline. The math is
          identical to compound interest on money:{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] font-mono">final = initial × (1 + rate)^periods</code>.
        </p>
        <p>
          Apply it to behaviour: read 10 pages a day, become 10x sharper as a thinker over a decade.
          Walk 7,000 steps daily, become a fundamentally different cardiovascular profile in 18 months.
          The catch: same math, in reverse, produces the opposite. Skip the gym for a year? You&rsquo;re not
          where you started — you&rsquo;re measurably worse.
        </p>

        {/* Compound curve chart */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            1% better vs. 1% worse, compounded daily for 365 days
          </div>
          <svg viewBox="0 0 360 200" className="h-48 w-full">
            <defs>
              <linearGradient id="plusFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* axes */}
            <line x1="40" y1="180" x2="320" y2="180" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#d4d4d8" />
            {/* baseline at value=1 */}
            <line x1="40" y1={yBaseline} x2="320" y2={yBaseline} stroke="#a1a1aa" strokeDasharray="3 3" />
            <text x="324" y={yBaseline + 3} fontSize="9" fill="#71717a">baseline (1x)</text>
            {/* plus curve fill + line */}
            <path d={`${plusPath} L 320 ${yForPlus(1).toFixed(2)} L 40 ${yForPlus(1).toFixed(2)} Z`} fill="url(#plusFill)" opacity="0.7" />
            <path d={plusPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            {/* minus curve line */}
            <path d={minusPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0" />
            {/* endpoint labels */}
            <circle cx={xFor(365)} cy={yForPlus(maxY)} r="3.5" fill="#10b981" />
            <text x={xFor(365) - 4} y={yForPlus(maxY) - 6} fontSize="10.5" fontWeight="800" fill="#047857" textAnchor="end">
              37.78x
            </text>
            <circle cx={xFor(365)} cy={yForMinus(Math.pow(0.99, 365))} r="3.5" fill="#f43f5e" />
            <text x={xFor(365) + 6} y={yForMinus(Math.pow(0.99, 365)) + 3} fontSize="10.5" fontWeight="800" fill="#be123c">
              0.03x
            </text>
            {/* day markers */}
            {[0, 90, 180, 270, 365].map((d) => (
              <g key={d}>
                <line x1={xFor(d)} y1="180" x2={xFor(d)} y2="184" stroke="#a1a1aa" />
                <text x={xFor(d)} y="195" fontSize="9.5" fill="#52525b" textAnchor="middle">{d === 0 ? 'Day 0' : `Day ${d}`}</text>
              </g>
            ))}
          </svg>
          <div className="mt-2 flex gap-4 text-[11.5px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-4 rounded bg-emerald-500" />
              +1%/day compounded
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-4 rounded bg-rose-500" />
              −1%/day compounded
            </span>
          </div>
        </div>
      </Section>

      <Section id="what" title="What 1% actually looks like (with examples)">
        <p>
          &ldquo;1% better&rdquo; is a rhetorical device, not an engineering spec. Nobody can measure their day with
          1% precision. The useful translation is: <strong>marginally better than yesterday, on the
          inputs that compound</strong>. Some examples of what 1% improvements look like:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Reading.</strong> 10 pages a day = 3,650 pages a year = ~12-18 books a year.
          </li>
          <li>
            <strong>Writing.</strong> 200 words a day = a 73,000-word book in a year.
          </li>
          <li>
            <strong>Exercise.</strong> Walking 7,000 steps a day = 350+ km a month. Adds ~3 years of
            healthy life expectancy (Lancet Public Health, 2022 meta-analysis).
          </li>
          <li>
            <strong>Savings.</strong> $10/day at 7% annual return = $144,000 after 20 years.
          </li>
          <li>
            <strong>Skill.</strong> 15 minutes of deliberate practice a day = 91 hours/year = a new
            language at conversational level in 2-3 years.
          </li>
        </ul>
        <PullQuote>
          Habits are the compound interest of self-improvement. — James Clear
        </PullQuote>
        <p>
          None of these inputs feel like &ldquo;transformation&rdquo; on any given Tuesday. That&rsquo;s the entire
          point. They feel ordinary, which is why they survive long enough to compound.
        </p>
      </Section>

      <Section id="when" title="When compounding kicks in (the J-curve)">
        <p>
          The curve above is exponential, but the early portion looks almost flat. For the first 50-100
          days, compound improvements feel indistinguishable from doing nothing. This is the{' '}
          <strong>plateau of latent potential</strong> — where most people quit, certain it&rsquo;s &ldquo;not
          working.&rdquo;
        </p>
        <p>Three real-world examples of where the curve kicks in:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Investing:</strong> The first $100K is famously the hardest. After it, compound
            returns start to outpace your contributions. Charlie Munger&rsquo;s exact quote.
          </li>
          <li>
            <strong>Writing online:</strong> Most blogs and newsletters look dead for 6-12 months, then
            cross a tipping point and grow non-linearly.
          </li>
          <li>
            <strong>Strength training:</strong> &ldquo;Newbie gains&rdquo; (weeks 1-12) feel fast, then a long
            plateau, then a second wave of compounding around month 18-24 as form locks in.
          </li>
        </ul>
        <Callout icon="📉" title="The valley of disappointment">
          The hardest stretch isn&rsquo;t day 1 (motivation is high) or day 365 (results are visible). It&rsquo;s
          the middle — days 30 to 120 — where effort is real but output is invisible. This is where
          tracking earns its keep: when the visible numbers say &ldquo;you&rsquo;re still showing up,&rdquo; you keep
          showing up.
        </Callout>
      </Section>

      <Section id="how" title="How to actually set up compound growth">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Pick inputs, not outputs</h3>
        <p>
          You don&rsquo;t control outputs. You control inputs. &ldquo;Lose 10 kg&rdquo; is an output goal — the scale
          decides, not you. &ldquo;Walk 7,000 steps + eat 3 cooked meals&rdquo; is an input goal — you decide,
          every day. Compound the inputs and the outputs take care of themselves.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Pick inputs with high leverage</h3>
        <p>
          Not all 1% improvements are equal. Some inputs compound through multiple systems:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Sleep:</strong> compounds into mood, focus, weight, immune function.</li>
          <li><strong>Reading:</strong> compounds into vocabulary, decision quality, conversation, identity.</li>
          <li><strong>Exercise:</strong> compounds into cardiovascular, hormonal, cognitive, emotional baselines.</li>
        </ul>
        <p>Pick 3-4 of these. Stack them. Track them daily. That&rsquo;s the entire program.</p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Lower your daily target until you can&rsquo;t fail</h3>
        <p>
          The exponential curve only works if the underlying frequency holds. One missed day costs you
          less than one quit habit. So aim for a daily target you can sustain on your worst day. Walk
          7,000 steps, not 12,000. Read 10 pages, not 30. Compounding doesn&rsquo;t care about your peak —
          it cares about your floor.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Make progress visible</h3>
        <p>
          The reason most people quit during the flat phase is that they can&rsquo;t see the trajectory yet.
          A heatmap, a streak counter, a savings tracker that ticks toward a target — these make the
          invisible exponential curve <em>visible</em> at the daily level. They don&rsquo;t accelerate the
          math; they bridge the patience gap. (Our piece on{' '}
          <Link href="/blog/habit-tracking-streaks-heatmaps" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why streaks and heatmaps work
          </Link>{' '}
          goes deep on this.)
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Audit quarterly</h3>
        <p>
          Every 12 weeks, review: are the inputs producing the outputs you expected? If yes, double
          down. If no, change the inputs (not the goals). Compound math punishes you if you change the
          inputs every week — let them run for a quarter before judging.
        </p>
      </Section>

      <Section id="why" title="Why this works (and why most people don't last)">
        <p>
          The math is real, but the math is also boring. Here&rsquo;s the deeper reason compound growth
          works for some and not others:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>It rewards identity, not effort.</strong> A person who reads 10 pages daily for 5
            years doesn&rsquo;t feel like they&rsquo;re &ldquo;trying hard.&rdquo; They feel like a reader. The compounding
            happens in the background of an identity, not in the foreground of a project.
          </li>
          <li>
            <strong>It punishes asymmetry.</strong> Compounding is symmetric: 1% better and 1% worse are
            equal in magnitude. But humans aren&rsquo;t — we feel one bad day far more than one good day.
            That asymmetry pulls many people into the negative curve without realising it.
          </li>
          <li>
            <strong>It rewards patience as a skill.</strong> Most personal-growth advice assumes
            patience is a virtue. Compounding treats it as a competence: the ability to keep doing
            something boring while the math runs in the background.
          </li>
        </ul>
        <PullQuote>
          Success is the product of daily habits — not once-in-a-lifetime transformations.
        </PullQuote>

        <Callout icon="📈" title="Your compound-growth audit">
          <p>Ask yourself, once per quarter:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>What did I do at least 60 of the last 90 days?</li>
            <li>What did I quit before day 30 — and why?</li>
            <li>What inputs have I been compounding for 1+ years? (these are your unfair advantages)</li>
            <li>Where am I on the negative curve without realising it?</li>
          </ul>
        </Callout>
        <p>
          BuildYourYear ships with the math built in: streak counters track daily commitment, the
          12-week heatmap shows you the consistency pattern over time, and the savings tracker turns
          compound contributions into a visible ETA. You don&rsquo;t need to do the math in your head — you
          just need to keep showing up while the math runs underneath.
        </p>
        <p>
          The brutal truth of compounding: at day 1, +1% looks identical to −1%. At day 365, they look
          like different lifetimes. Which curve you&rsquo;re on right now will only become visible in a few
          months. Start the right one today. For the deeper psychology, read on:{' '}
          <Link href="/blog/how-to-build-habits-that-stick" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            how to build habits that stick
          </Link>{' '}
          and{' '}
          <Link href="/blog/why-new-year-resolutions-fail" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why most resolutions fail
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
