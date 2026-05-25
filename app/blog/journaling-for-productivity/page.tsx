import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'journaling-for-productivity';
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
        Marcus Aurelius journaled for <AnimatedCounter end={19} className="font-bold text-emerald-700" />{' '}
        years. Tim Ferriss does it daily. Oprah swears by it. Productivity journaling is the
        highest-leverage 10 minutes most high-performers spend each day — but{' '}
        <strong>most people quit by day 12</strong>. The reason isn&rsquo;t discipline. It&rsquo;s that they
        picked the wrong style. There are 5 distinct journaling styles, each suited to a different
        kind of mind. Here&rsquo;s the complete guide — pick yours and run it for the year.
      </p>

      <Section id="definition" title="Definition: what is productivity journaling?">
        <p>
          <strong>Productivity journaling</strong> is the daily practice of writing — by hand or on
          screen — for the purpose of clarifying thought, processing emotion, planning action, or
          reinforcing identity. It&rsquo;s a tool, not a hobby. Done right, it&rsquo;s the most consistently
          underrated 10-minute investment in self-improvement.
        </p>
        <p>The research is unusually robust:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>James Pennebaker (UT Austin) found expressive writing improved immune function, sleep, and mood across 200+ studies over 40 years.</li>
          <li>Matthew Killingsworth (Harvard) found gratitude journaling produced sustained life-satisfaction increases of 10-25%.</li>
          <li>Teresa Amabile (HBS) showed daily reflection journaling improved professional performance more than additional training.</li>
        </ul>
        <PullQuote>
          The unexamined life is not worth living. — Socrates. The unjournaled life is harder to learn from. — modern corollary.
        </PullQuote>
      </Section>

      <Section id="what" title="What the 5 journaling styles actually are">

        <ComparisonTable
          headers={['Style', 'Best for', 'Time/day', 'Sample prompt']}
          rows={[
            ['Morning Pages', 'Mental clarity, anxiety dump', '20-30 min', '3 pages of stream-of-consciousness, no editing'],
            ['Gratitude Journal', 'Mood, life satisfaction', '5 min', '3 things you&rsquo;re grateful for today, and why'],
            ['5-Minute Journal', 'Daily structure, momentum', '5 min', '3 wins, 3 priorities, 1 affirmation, evening reflection'],
            ['Reflective / Bullet', 'Decision quality, learning', '10 min', 'What happened. What worked. What I&rsquo;d do differently.'],
            ['Productivity / Planning', 'Execution, focus', '10 min', 'Top 3 today, what I&rsquo;ll say no to, deep-work block plan'],
          ]}
        />

        <p>Each style has a different center of gravity:</p>

        <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
            <div className="text-[14px] font-bold text-rose-900">Morning Pages</div>
            <div className="mt-1 text-[12px] text-zinc-600">Julia Cameron&rsquo;s technique. Pure cognitive offload — 3 longhand pages, anything that comes to mind. Best for creators, anxious minds, decision overwhelm.</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="text-[14px] font-bold text-amber-900">Gratitude Journal</div>
            <div className="mt-1 text-[12px] text-zinc-600">The most research-backed format. 3 specific things daily. Best for mood, sleep, life satisfaction. Takes 5 minutes; effects measurable in 14 days.</div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="text-[14px] font-bold text-emerald-900">5-Minute Journal</div>
            <div className="mt-1 text-[12px] text-zinc-600">Structured template: morning wins/priorities, evening reflection. Best for beginners and time-strapped people. Highest adherence rate across styles.</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
            <div className="text-[14px] font-bold text-sky-900">Reflective / Bullet</div>
            <div className="mt-1 text-[12px] text-zinc-600">Ryder Carroll&rsquo;s bullet journal or just nightly reflection. Best for decision quality, learning velocity, project management.</div>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 sm:col-span-2">
            <div className="text-[14px] font-bold text-violet-900">Productivity / Planning</div>
            <div className="mt-1 text-[12px] text-zinc-600">Tim Ferriss-style. Morning: 3 priorities + deep-work plan + what you&rsquo;ll decline. Best for execution-heavy roles (founders, ICs, students). Doubles as a daily review.</div>
          </div>
        </div>
      </Section>

      <Section id="when" title="When each style is the right fit (decision guide)">
        <p>The wrong style guarantees you&rsquo;ll quit by day 12. The right one survives the year. Pick by need:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>You feel mentally cluttered → Morning Pages.</strong> The 20-30 min of unstructured dumping clears the cache.</li>
          <li><strong>You feel low / ungrateful / cynical → Gratitude Journal.</strong> 5 min, biggest mood impact per minute spent.</li>
          <li><strong>You&rsquo;ve never journaled before → 5-Minute Journal.</strong> Template removes the &ldquo;what should I write?&rdquo; friction.</li>
          <li><strong>You make many decisions → Reflective.</strong> Nightly post-mortem improves next-day judgment.</li>
          <li><strong>Your problem is execution, not insight → Productivity/Planning.</strong> Skip the introspection; plan the day.</li>
        </ul>
        <Callout icon="🎯" title="The most underrated combination">
          5-Minute morning + Reflective evening. 10 minutes total. Front-loads structure, back-loads
          learning. Most people who hit a 1-year journaling streak run this exact pattern.
        </Callout>
      </Section>

      <Section id="how" title="How to run a daily journaling practice (6 rules)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Anchor it to an existing habit</h3>
        <p>
          Journaling at a random time of day doesn&rsquo;t survive busy weeks. Stack it onto morning coffee
          or evening tooth-brushing using one of the{' '}
          <Link href="/blog/habit-stacking-patterns" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            7 habit stacking patterns
          </Link>
          . The trigger does the remembering for you.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Use a template (especially at first)</h3>
        <p>
          Blank pages cause writer&rsquo;s block — even in journaling. A 3-prompt template eliminates the
          decision of &ldquo;what should I write?&rdquo; The 5-Minute Journal&rsquo;s prompts are the most adopted
          for a reason: they remove friction.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Pen-and-paper or digital — pick one and commit</h3>
        <p>
          Both work. Pen-and-paper has slight edges in memory consolidation (Mueller &amp; Oppenheimer
          2014); digital wins on search and portability. The wrong tool for you is whichever one creates
          friction. Try each for a week; pick the one you actually reach for.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Two minutes is enough on bad days</h3>
        <p>
          Apply the{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            two-minute rule
          </Link>
          . On the day you&rsquo;re sick / travelling / overwhelmed, write one sentence. Not zero. One. The
          chain stays intact; the depth comes back on the next normal day.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Review the journal monthly</h3>
        <p>
          The compounding magic of journaling kicks in around month 3, when you start reading back what
          you wrote. Patterns you couldn&rsquo;t see daily become obvious at 30-day distance. Schedule a
          15-minute monthly review.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Don&rsquo;t self-edit</h3>
        <p>
          The journal is for you. Bad grammar, ugly handwriting, half-thoughts are all fine. The
          instinct to write neatly is exactly the instinct that kills the practice. Write fast, write
          honest, write often.
        </p>
      </Section>

      <Section id="why" title="Why journaling outperforms more &lsquo;productive&rsquo; activities">
        <p>The mechanism behind the research findings is mostly three things:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Externalising thought.</strong> The act of writing turns vague feelings into
            structured language. Once a problem is named, the brain can work on it. Vague anxiety is
            paralysing; named anxiety is solvable.
          </li>
          <li>
            <strong>Memory consolidation.</strong> Writing improves long-term retention by 60-80%
            (Mueller &amp; Oppenheimer). The journal isn&rsquo;t just storage; the act of writing IS the
            learning.
          </li>
          <li>
            <strong>Identity reinforcement.</strong> Every entry is a small vote for who you&rsquo;re
            becoming (see our piece on{' '}
            <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              identity-based habits
            </Link>
            ). &ldquo;I&rsquo;m the type of person who journals&rdquo; is a self-concept the practice reinforces daily.
          </li>
        </ul>
        <PullQuote>
          You can&rsquo;t outrun a problem you haven&rsquo;t named. The journal is where the naming happens.
        </PullQuote>

        <Callout icon="📋" title="Your 1-week journaling starter">
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>Day 1:</strong> Pick a style from the 5 above. Bias toward 5-Minute Journal if unsure.</li>
            <li><strong>Day 2-3:</strong> Stack it onto morning coffee. Use a template.</li>
            <li><strong>Day 4-5:</strong> 2-minute version on busy days. Don&rsquo;t miss two in a row.</li>
            <li><strong>Day 6-7:</strong> Re-read week 1. Notice patterns. Adjust the prompts.</li>
            <li><strong>Day 30:</strong> Decide whether the style fits. If not, switch — don&rsquo;t quit.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear treats journaling as a daily habit — set it up once, the dashboard remembers.
          The streak counter exploits the daily rhythm; the 12-week heatmap shows the consistency
          pattern. Most people who try journaling underestimate what compounds at month 3 — when the
          act of writing has become automatic and the act of <em>noticing</em> takes over. That&rsquo;s where
          the year gets reshaped.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/morning-routine-for-high-performers" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            morning routine
          </Link>
          ,{' '}
          <Link href="/blog/habit-stacking-patterns" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            habit stacking
          </Link>
          , and{' '}
          <Link href="/blog/annual-review-90-minutes" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the annual review
          </Link>{' '}
          (a journal makes the review 10x easier).
        </p>
      </Section>
    </BlogLayout>
  );
}
