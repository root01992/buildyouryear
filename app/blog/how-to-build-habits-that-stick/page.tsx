import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'how-to-build-habits-that-stick';
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
        You&rsquo;ve probably heard it takes 21 days to build a habit. That number is wrong — and it&rsquo;s
        the single biggest reason most people quit on day 24. The real data says habit formation
        averages <strong>66 days</strong> and ranges from 18 to 254 depending on the difficulty.
        Here is the playbook that actually works, backed by behavioural science.
      </p>

      <Section id="definition" title="Definition: what is a habit, really?">
        <p>
          A <strong>habit</strong> is a behaviour repeated regularly until it requires almost no conscious
          effort to start. Phillippa Lally&rsquo;s landmark 2010 study at University College London tracked 96
          adults forming a new habit. The average time for the behaviour to feel automatic was{' '}
          <strong>66 days</strong>. The 21-day myth comes from a 1960s plastic surgeon&rsquo;s anecdote about
          phantom limb adjustment — not habit formation.
        </p>
        <p>
          Every habit follows the same four-part loop, popularised by Charles Duhigg and refined by James
          Clear in <em>Atomic Habits</em>:
        </p>
        <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center">
            <div className="text-[24px]">👀</div>
            <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">Cue</div>
            <div className="mt-1 text-[12px] text-zinc-600">A trigger in your environment</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3 text-center">
            <div className="text-[24px]">💭</div>
            <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-sky-700">Craving</div>
            <div className="mt-1 text-[12px] text-zinc-600">The desire the cue creates</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-center">
            <div className="text-[24px]">⚡</div>
            <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-amber-700">Response</div>
            <div className="mt-1 text-[12px] text-zinc-600">The behaviour you do</div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center">
            <div className="text-[24px]">🏆</div>
            <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-rose-700">Reward</div>
            <div className="mt-1 text-[12px] text-zinc-600">The payoff that closes the loop</div>
          </div>
        </div>
        <p>
          If any of the four links is weak, the chain breaks. Most failed habits fail at the cue (no
          reliable trigger) or the reward (too distant to feel real).
        </p>
      </Section>

      <Section id="what" title="What separates a habit that sticks from one that fades">
        <p>
          Sticky habits share three observable properties. Vague intentions like &ldquo;I want to read more&rdquo;
          rarely build any of them. They look like this:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Specificity.</strong> A 2002 British Journal of Health Psychology study found that
            participants who specified <em>when</em> and <em>where</em> they&rsquo;d exercise were{' '}
            <strong>2.5x more likely</strong> to follow through than those who only had a goal.
          </li>
          <li>
            <strong>Friction floor.</strong> The behaviour needs to be small enough that you can do it on
            your worst day. BJ Fogg, Stanford&rsquo;s habit researcher, calls these <em>tiny habits</em> —
            flossing one tooth, doing one push-up. Tiny habits compound; ambitious habits abandon.
          </li>
          <li>
            <strong>Identity anchor.</strong> The most durable habits are tied to an identity, not an
            outcome. &ldquo;I&rsquo;m a runner&rdquo; sticks. &ldquo;I want to lose 10 kg&rdquo; fades.
          </li>
        </ul>

        {/* Habit formation curve (S-shape) */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            How automatic a habit feels over time (Lally et al., 2010)
          </div>
          <svg viewBox="0 0 360 200" className="h-44 w-full">
            <defs>
              <linearGradient id="habitCurveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* axes */}
            <line x1="40" y1="170" x2="350" y2="170" stroke="#d4d4d8" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#d4d4d8" strokeWidth="1" />
            {/* gridlines */}
            {[40, 80, 120, 160].map((y) => (
              <line key={y} x1="40" y1={y} x2="350" y2={y} stroke="#f4f4f5" />
            ))}
            {/* "automatic" threshold */}
            <line x1="40" y1="60" x2="350" y2="60" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <text x="350" y="55" fontSize="9" fontWeight="700" fill="#047857" textAnchor="end">
              automatic
            </text>
            {/* curve (S-shaped) */}
            <path
              d="M 40 170 C 90 168, 140 150, 180 95 S 290 50, 350 45"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 40 170 C 90 168, 140 150, 180 95 S 290 50, 350 45 L 350 170 L 40 170 Z"
              fill="url(#habitCurveFill)"
            />
            {/* day markers */}
            {[
              { x: 130, label: 'Day 18' },
              { x: 195, label: 'Day 66 (avg)' },
              { x: 320, label: 'Day 254' },
            ].map((m) => (
              <g key={m.label}>
                <line x1={m.x} y1="170" x2={m.x} y2="175" stroke="#71717a" />
                <text x={m.x} y="187" fontSize="9.5" fill="#52525b" textAnchor="middle" fontWeight="600">
                  {m.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            The S-curve flattens as a behaviour automates. Most people quit during the slow middle phase
            — days 20-50 — right before the curve steepens.
          </div>
        </div>
      </Section>

      <Section id="when" title="When to start: the trigger-window principle">
        <p>
          Behavioural science calls them <strong>fresh-start moments</strong>. A 2014 Wharton study (Dai,
          Milkman &amp; Riis) found that motivation to begin new behaviours spikes after temporal
          landmarks: Mondays (+15%), the 1st of the month (+25%), birthdays, anniversaries, and{' '}
          <strong>January 1st (+82%)</strong>. The catch: these spikes only convert if you act within
          <strong> 72 hours</strong>. After that, the surge dissipates.
        </p>
        <PullQuote>
          The best day to start a habit was the last fresh-start moment you missed. The second-best is
          tomorrow morning.
        </PullQuote>
        <p>
          You don&rsquo;t have to wait for January. Any Monday is a fresh start. The morning after a long
          weekend is a fresh start. Today, technically, is a fresh start — it&rsquo;s just a less salient
          one. Use whichever lands in front of you.
        </p>
      </Section>

      <Section id="how" title="How to build a habit that survives 365 days">
        <p>
          Here is the playbook. Each step maps to one of the four loop components — fix the broken link
          and the habit holds.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">1. Write an implementation intention (fix the cue)</h3>
        <p>
          The format is:{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[12.5px] font-mono">
            I will [BEHAVIOUR] at [TIME] in [LOCATION]
          </code>
          . That&rsquo;s it. Studies put adherence increases at 2-3x just from naming the time and place.
          Example: &ldquo;I will meditate for 5 minutes at 7:15am in the kitchen.&rdquo;
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">2. Stack it onto an existing habit (reinforce the cue)</h3>
        <p>
          James Clear&rsquo;s &ldquo;habit stacking&rdquo; formula:{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[12.5px] font-mono">
            After [CURRENT HABIT], I will [NEW HABIT]
          </code>
          . Your existing routines are the most reliable triggers you have. Don&rsquo;t invent new ones —
          piggyback on the old ones.
        </p>
        <Callout icon="🧠" title="Examples that work">
          <ul className="list-disc space-y-1 pl-5">
            <li>After I pour my morning coffee, I will write 3 things I&rsquo;m grateful for.</li>
            <li>After I close my laptop for the day, I will do 10 push-ups.</li>
            <li>After I brush my teeth at night, I will read 2 pages of a book.</li>
          </ul>
        </Callout>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">3. Shrink it to the floor (reduce friction in the response)</h3>
        <p>
          The two-minute rule: scale the habit down until it takes less than two minutes to do. &ldquo;Read
          one page&rdquo; beats &ldquo;read for 30 minutes&rdquo; — because on the bad days, you still read one page.
          Consistency beats intensity, every time. Once the habit is automatic, scaling up takes care of
          itself.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">4. Make the reward immediate (close the loop)</h3>
        <p>
          The brain optimises for instant feedback. If the real reward is months out (fitter body,
          finished book), bridge the gap with a tiny instant reward. Cross it off a habit tracker.
          Watch the streak counter tick up. Tell yourself out loud: <em>&ldquo;Done.&rdquo;</em> The cue-loop
          needs to feel complete <em>today</em>, not in October.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">5. Track it visibly (lock in identity)</h3>
        <p>
          A visible streak — checkmarks on a calendar, cells filling on a heatmap — turns each check-in
          into a vote for who you&rsquo;re becoming. 30 ticks isn&rsquo;t just &ldquo;30 days of running&rdquo;; it&rsquo;s 30
          pieces of evidence that you&rsquo;re a runner. See our deep-dive on{' '}
          <Link href="/blog/habit-tracking-streaks-heatmaps" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why streaks and heatmaps work psychologically
          </Link>
          .
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">6. Plan the &ldquo;never miss twice&rdquo; rule</h3>
        <p>
          Missing once is an accident. Missing twice is the start of a new (worse) habit. Before you ever
          miss, decide what your minimum-viable version looks like: 1 push-up on travel days, 1 paragraph
          when sick, 1 minute on overwhelming days. Plan the rebound <em>before</em> you need it.
        </p>
      </Section>

      <Section id="why" title="Why this works (and why willpower doesn't)">
        <p>
          Most people approach habits as a willpower problem — &ldquo;I just need to try harder.&rdquo; The
          research is brutal on this view. Roy Baumeister&rsquo;s famous ego-depletion studies (since
          partially replicated, partially not) suggested willpower behaves like a muscle that fatigues
          across the day. Whether or not depletion holds up in every replication, the practical
          implication is the same: <strong>relying on willpower scales badly</strong>.
        </p>
        <p>
          Habit design wins because it removes the decision. You don&rsquo;t decide to brush your teeth at
          night — you just do it. A well-built habit moves the behaviour from the conscious system
          (System 2, slow, effortful) to the automatic one (System 1, fast, effortless). Once you cross
          that line, motivation becomes optional.
        </p>
        <PullQuote>
          You don&rsquo;t rise to the level of your goals. You fall to the level of your systems. — James
          Clear
        </PullQuote>
        <p>
          That&rsquo;s why we built the BuildYourYear dashboard around the same four-part loop: visible cue
          (tomorrow&rsquo;s checklist), salient craving (today&rsquo;s 4 habits at the top), one-tap response
          (check the box), immediate reward (streak counter, heatmap cell lights up, celebration when
          you finish all 4). The dashboard isn&rsquo;t the habit. It&rsquo;s the scaffolding that lets the habit
          install itself.
        </p>
        <Callout icon="📋" title="Your 30-second starter kit">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Pick <strong>one</strong> habit. Just one.</li>
            <li>Write the implementation intention: <em>I will X at Y in Z.</em></li>
            <li>Stack it after an existing habit.</li>
            <li>Shrink it until you can do it on your worst day.</li>
            <li>Track it visibly every day for 66 days.</li>
            <li>If you miss, never miss twice.</li>
          </ol>
        </Callout>
        <p>
          Day 66 is closer than it looks. The habit you start this Monday will feel automatic by July.
          By December, it will feel like part of you. That&rsquo;s how a year gets built.
        </p>
      </Section>
    </BlogLayout>
  );
}
