import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'energy-management-vs-time-management';
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
  return (
    <BlogLayout post={post} related={BLOG_POSTS.filter((p) => p.slug !== SLUG).slice(0, 2)}>
      <p className="text-[17px] font-semibold leading-snug text-zinc-800">
        Tony Schwartz and Jim Loehr studied elite athletes — Olympic competitors, top-ranked tennis
        pros — and made a counterintuitive discovery. The best didn&rsquo;t practice longer than the rest.
        They <strong>recovered better between sessions</strong>. Translated to knowledge work, the
        finding became their landmark book&rsquo;s thesis: <em>&ldquo;Energy, not time, is the fundamental
        currency of high performance.&rdquo;</em> Time is fixed. Energy is renewable. Here&rsquo;s how to manage
        the renewable one.
      </p>

      <Section id="definition" title="Definition: what is energy management?">
        <p>
          <strong>Energy management</strong> is the practice of structuring your day, week, and year
          around the capacity to do focused work — not around the hours available to do it. Where time
          management asks <em>&ldquo;what should I do in this hour?&rdquo;</em>, energy management asks{' '}
          <em>&ldquo;what state should I be in for the next hour&rsquo;s work?&rdquo;</em>
        </p>
        <p>
          Loehr and Schwartz identified <strong>4 dimensions of human energy</strong>, each operating
          on its own rhythm:
        </p>

        <div className="my-6 grid grid-cols-2 gap-3">
          {[
            { name: 'Physical', emoji: '💪', desc: 'Sleep, nutrition, movement, hydration. The foundation.', color: 'emerald' },
            { name: 'Emotional', emoji: '❤️', desc: 'Mood, motivation, relationships. The fuel.', color: 'rose' },
            { name: 'Mental', emoji: '🧠', desc: 'Focus, attention, cognitive clarity. The engine.', color: 'sky' },
            { name: 'Spiritual', emoji: '🌟', desc: 'Purpose, meaning, alignment with values. The compass.', color: 'amber' },
          ].map((d) => (
            <div key={d.name} className={`rounded-xl border border-${d.color}-200 bg-${d.color}-50/50 p-4`}>
              <div className="flex items-center gap-2">
                <span className="text-[22px]">{d.emoji}</span>
                <span className={`text-[15px] font-bold text-${d.color}-800`}>{d.name} energy</span>
              </div>
              <div className="mt-2 text-[12px] text-zinc-700">{d.desc}</div>
            </div>
          ))}
        </div>

        <p>
          Each dimension recharges differently — and depletes differently. A 12-hour day spent in
          flowing mental work but lonely (no emotional recharge) leaves you wrecked. A weekend with
          high emotional energy but zero physical movement leaves you sluggish on Monday. The 4
          dimensions are independent inputs.
        </p>
      </Section>

      <Section id="what" title="What 'managing energy' actually looks like in a day">
        <p>
          Most humans run on <strong>ultradian rhythms</strong> — natural 90-120 minute cycles of high
          alertness followed by a 15-20 minute trough. Pioneered by sleep researcher Nathan Kleitman
          in the 1960s, the same cycle that governs REM/non-REM sleep continues during waking hours.
        </p>

        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Typical daily energy curve (chronotype-adjusted)
          </div>
          <svg viewBox="0 0 360 180" className="h-44 w-full">
            <defs>
              <linearGradient id="energyDayFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="40" y1="140" x2="340" y2="140" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#d4d4d8" />
            <path
              d="M 40 100 Q 70 30, 100 35 T 160 65 Q 180 50, 200 45 T 260 90 Q 280 75, 300 80 T 340 130"
              fill="url(#energyDayFill)"
              stroke="#10b981" strokeWidth="2.4" strokeLinecap="round"
            />
            {/* Peak markers */}
            <circle cx="100" cy="35" r="3.5" fill="#10b981" />
            <text x="100" y="22" fontSize="9" fill="#047857" textAnchor="middle" fontWeight="700">Peak 1</text>
            <circle cx="220" cy="40" r="3.5" fill="#10b981" />
            <text x="220" y="27" fontSize="9" fill="#047857" textAnchor="middle" fontWeight="700">Peak 2</text>
            {/* Trough */}
            <text x="160" y="80" fontSize="9" fill="#71717a" textAnchor="middle">trough</text>
            {/* x labels */}
            {['6am', '9am', '12pm', '3pm', '6pm', '9pm'].map((t, i) => (
              <text key={t} x={40 + i * 60} y="160" fontSize="9.5" fill="#52525b" textAnchor="middle">{t}</text>
            ))}
            {/* y labels */}
            <text x="36" y="35" fontSize="9" fill="#71717a" textAnchor="end">high</text>
            <text x="36" y="143" fontSize="9" fill="#71717a" textAnchor="end">low</text>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            Two natural peaks per day (mid-morning + early afternoon) separated by a real trough
            around 12-2pm. Time-management ignores this curve; energy-management designs around it.
          </div>
        </div>
      </Section>

      <Section id="when" title="When to match work to energy (the matching rule)">
        <p>The single highest-leverage move in energy management: match work type to energy state.</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Peak energy windows</strong> → deepest work (writing, strategy, decisions, hard problems). See our piece on{' '}
            <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              deep work
            </Link>
            .
          </li>
          <li><strong>Trough windows</strong> → shallow work (email, admin, planning, organising). The trough is fine for these — don&rsquo;t waste it on hard work.</li>
          <li><strong>Recovery windows</strong> → genuine rest (walk, nap, no screens). NOT &ldquo;rest-by-scrolling&rdquo; — that doesn&rsquo;t recharge.</li>
        </ul>
        <Callout icon="🎯" title="The 80% mistake">
          <AnimatedCounter end={80} suffix="%" /> of professionals do their most important work in
          their trough windows (after lunch, late afternoon) and waste their peak windows on email and
          meetings. Inverting that pattern alone produces 2-3x more deep output without changing total
          hours worked.
        </Callout>
      </Section>

      <Section id="how" title="How to manage energy across all 4 dimensions">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Physical energy (the foundation)</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Sleep 7-9 hours.</strong> Single biggest lever. Non-negotiable.</li>
          <li><strong>Move every 90 minutes.</strong> Even a 2-minute stand-and-stretch resets focus.</li>
          <li><strong>Eat for stable energy.</strong> Protein + fat + complex carbs. Skip the sugar crashes.</li>
          <li><strong>Hydrate aggressively.</strong> 2% dehydration drops cognitive performance measurably.</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Emotional energy (the fuel)</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>One real connection per day.</strong> A 10-min call, a meal with someone you care about.</li>
          <li><strong>Identify your emotional drains.</strong> Specific people, meetings, or situations that consistently leave you depleted. Limit exposure.</li>
          <li><strong>Reframe via gratitude or journaling.</strong> Quick mood reset. See our piece on{' '}
            <Link href="/blog/journaling-for-productivity" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              journaling for productivity
            </Link>
            .
          </li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Mental energy (the engine)</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Honour your ultradian cycles.</strong> 90-min work blocks, 15-20 min recovery.</li>
          <li><strong>Single-task.</strong> Context-switching can cost up to 25 minutes of recovery per switch.</li>
          <li><strong>Strategic boredom.</strong> Don&rsquo;t fill every gap with input. The brain needs unstructured time to consolidate.</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Spiritual energy (the compass)</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Weekly review of the &ldquo;why.&rdquo;</strong> 10 minutes asking: am I working toward something I care about?</li>
          <li><strong>One value-aligned commitment per quarter.</strong> Not for productivity — for meaning.</li>
          <li><strong>Disengage from work that violates your values.</strong> Spiritual energy is the only one that can&rsquo;t be recovered through technique. Misalignment must be solved structurally.</li>
        </ul>
      </Section>

      <Section id="why" title="Why energy management beats time management long-term">
        <p>Three structural reasons:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Time is fixed; energy is variable.</strong> You can&rsquo;t buy a 25th hour. You can
            absolutely turn a tired 9 hours into an energised 6 hours that ships more. The ceiling on
            energy is much higher than the ceiling on time.
          </li>
          <li>
            <strong>Energy compounds across days; time doesn&rsquo;t.</strong> A well-rested Monday makes
            Tuesday easier. A burned-out Monday makes the rest of the week 30-40% worse. Time-management
            misses this entirely — it treats every hour as equivalent.
          </li>
          <li>
            <strong>Energy is the upstream variable.</strong> Time-management says: &ldquo;block your calendar
            better.&rdquo; Energy-management says: &ldquo;why are you exhausted by 2pm?&rdquo; The first treats the
            symptom. The second fixes the cause.
          </li>
        </ul>
        <PullQuote>
          The most successful people don&rsquo;t do more in their time. They do more <em>per unit of
          time</em>. Energy is what determines the multiplier.
        </PullQuote>

        <Callout icon="📋" title="Your 7-day energy audit">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Each day, rate each energy dimension 1-10 (physical, emotional, mental, spiritual).</li>
            <li>Note what you did before each measurement.</li>
            <li>Identify your two daily peak windows.</li>
            <li>Identify your two biggest energy leaks (specific people, tasks, contexts).</li>
            <li>Next week: schedule deep work in peaks; reduce exposure to leaks; add one recovery practice per dimension.</li>
            <li>Re-rate. Output usually rises measurably within 14 days.</li>
          </ol>
        </Callout>

        <p>
          Energy management is the framework that makes every other productivity technique work. Deep
          work is impossible without mental energy. Habits collapse without physical energy. Goals lose
          meaning without spiritual energy. The whole BuildYourYear stack — habits, goals, trackers,
          12-week cycles — runs on energy more than on hours. The dashboard&rsquo;s job is to make the
          inputs (habits) visible so the outputs (sustainable execution) compound.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>
          ,{' '}
          <Link href="/blog/morning-routine-for-high-performers" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            morning routine
          </Link>
          ,{' '}
          <Link href="/blog/pomodoro-technique-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the Pomodoro technique
          </Link>{' '}
          (designed around the ultradian cycle).
        </p>
      </Section>
    </BlogLayout>
  );
}
