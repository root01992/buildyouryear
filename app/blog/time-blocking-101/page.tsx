import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'time-blocking-101';
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

  // Sample time-blocked day
  const blocks = [
    { start: '06:30', end: '07:30', label: 'Morning routine', kind: 'morning', color: '#a78bfa' },
    { start: '07:30', end: '09:00', label: 'Deep work block #1 (writing)', kind: 'deep', color: '#10b981' },
    { start: '09:00', end: '10:00', label: 'Email + Slack', kind: 'shallow', color: '#a1a1aa' },
    { start: '10:00', end: '11:30', label: 'Deep work block #2 (project)', kind: 'deep', color: '#10b981' },
    { start: '11:30', end: '12:30', label: 'Meetings', kind: 'meeting', color: '#fb7185' },
    { start: '12:30', end: '13:30', label: 'Lunch + walk', kind: 'break', color: '#f59e0b' },
    { start: '13:30', end: '15:00', label: 'Deep work block #3 (review)', kind: 'deep', color: '#10b981' },
    { start: '15:00', end: '16:30', label: 'Meetings / collab', kind: 'meeting', color: '#fb7185' },
    { start: '16:30', end: '17:00', label: 'Email + plan tomorrow', kind: 'shallow', color: '#a1a1aa' },
    { start: '17:00', end: '18:30', label: 'Workout', kind: 'health', color: '#60a5fa' },
    { start: '18:30', end: '21:30', label: 'Family / personal', kind: 'personal', color: '#34d399' },
    { start: '21:30', end: '22:30', label: 'Wind down + read', kind: 'rest', color: '#a78bfa' },
  ];
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const startMin = toMinutes('06:00');
  const endMin = toMinutes('22:30');
  const totalMin = endMin - startMin;

  return (
    <BlogLayout post={post} related={related}>
      <p className="text-[17px] font-semibold leading-snug text-zinc-800">
        Cal Newport, Bill Gates, and Elon Musk have all said versions of the same thing: a to-do list
        without a calendar is just a wish list. <strong>Time blocking</strong> is the practice of
        assigning every minute of your day a specific job — turning tasks into appointments with
        yourself. Here&rsquo;s the complete guide: the 4 styles, the 6-step process, and the rookie
        mistakes that turn time blocks into time wasted.
      </p>

      <Section id="definition" title="Definition: what is time blocking?">
        <p>
          <strong>Time blocking</strong> is a scheduling method where you divide your day into named
          blocks of time, each dedicated to a specific task or category of work. Instead of working
          through a to-do list reactively (whatever feels most urgent), you decide in advance what
          each hour of your day is for — and then defend those hours.
        </p>
        <p>
          The format is unforgiving: every minute from morning to night is assigned. Yes, including
          email, lunch, meetings, breaks, and rest. The discipline isn&rsquo;t the planning — it&rsquo;s the
          honest accounting of where your time actually goes.
        </p>
        <PullQuote>
          A schedule defends from chaos and whim. It is a net for catching days. — Annie Dillard
        </PullQuote>

        {/* Sample time-blocked day visualisation */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            A sample time-blocked day (6:00 → 22:30)
          </div>
          <svg viewBox="0 0 360 220" className="h-56 w-full">
            {blocks.map((b, i) => {
              const x = 40 + ((toMinutes(b.start) - startMin) / totalMin) * 300;
              const w = ((toMinutes(b.end) - toMinutes(b.start)) / totalMin) * 300;
              return (
                <g key={i}>
                  <rect x={x} y={30} width={w} height={20} fill={b.color} rx="2" />
                </g>
              );
            })}
            {/* Hour ticks */}
            {[6, 9, 12, 15, 18, 21].map((h) => {
              const x = 40 + ((h * 60 - startMin) / totalMin) * 300;
              return (
                <g key={h}>
                  <line x1={x} y1="50" x2={x} y2="54" stroke="#71717a" />
                  <text x={x} y="65" fontSize="9.5" fill="#52525b" textAnchor="middle">{`${h}:00`}</text>
                </g>
              );
            })}
            {/* Legend */}
            <g transform="translate(40, 85)">
              {[
                { color: '#10b981', label: 'Deep work (4.5h)' },
                { color: '#fb7185', label: 'Meetings (2.5h)' },
                { color: '#a1a1aa', label: 'Email / shallow (1.5h)' },
                { color: '#60a5fa', label: 'Workout (1.5h)' },
                { color: '#f59e0b', label: 'Lunch (1h)' },
                { color: '#a78bfa', label: 'Routine / rest (2h)' },
                { color: '#34d399', label: 'Personal (3h)' },
              ].map((l, i) => (
                <g key={l.label} transform={`translate(${(i % 4) * 80}, ${Math.floor(i / 4) * 18})`}>
                  <rect x="0" y="0" width="10" height="10" fill={l.color} rx="2" />
                  <text x="14" y="9" fontSize="9.5" fill="#52525b">{l.label}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </Section>

      <Section id="what" title="What time blocking is NOT (clarifying the confusion)">
        <p>The technique gets confused with adjacent practices. Here&rsquo;s the distinction:</p>
        <ComparisonTable
          headers={['Practice', 'What it is', 'Why it differs']}
          rows={[
            ['Time blocking', 'Every hour assigned to a specific task/category', 'Defends the time before it&rsquo;s claimed'],
            ['Time boxing', 'Setting a max time limit on a single task', 'Constrains effort; doesn&rsquo;t plan the day'],
            ['Task batching', 'Grouping similar tasks (all email at once)', 'Optimises within blocks; isn&rsquo;t a schedule'],
            ['Pomodoro', '25-min work / 5-min break sprints', 'Focus technique; doesn&rsquo;t allocate time across the day'],
            ['Day theming', 'Each day of week dedicated to one work type', 'Time blocking at a weekly granularity'],
          ]}
        />
        <p>You can stack all five. Time blocking is the scaffold; the others fit inside.</p>
      </Section>

      <Section id="when" title="When time blocking works best (and for whom)">
        <p>The practice has the highest ROI for three groups:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Knowledge workers with autonomy.</strong> Writers, engineers, designers, solo
            consultants — anyone whose calendar is their own to control. The output quality is directly
            proportional to the protected deep-work blocks.
          </li>
          <li>
            <strong>People who feel chronically &ldquo;busy but unproductive&rdquo;.</strong> Time blocking
            forces an honest audit. Once you write down where the day actually goes, the leaks are
            visible. Most people are shocked at how few hours of their week produce real output.
          </li>
          <li>
            <strong>Parents and caretakers.</strong> When your time is intermittently interrupted,
            blocking the windows you DO control becomes critical. It&rsquo;s the difference between
            &ldquo;1 hour of writing after the kids sleep&rdquo; happening and not happening.
          </li>
        </ul>
        <Callout icon="⚠️" title="When time blocking misfires">
          For roles with high real-time demand (customer support, ER medicine, on-call ops), strict
          time blocks break down. Use a hybrid: block 2 hours of deep work, leave the rest fluid. For
          most knowledge workers, this hybrid is the realistic version anyway.
        </Callout>
      </Section>

      <Section id="how" title="How to time-block your day (6-step process)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Brain-dump tomorrow&rsquo;s tasks (5 min)</h3>
        <p>
          The night before, list everything you want or need to do tomorrow. Don&rsquo;t edit. Don&rsquo;t
          prioritise. Just empty the cache.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Identify your deep-work windows (2 min)</h3>
        <p>
          Pick the 2-4 hours of tomorrow when you&rsquo;ll be most focused. For most people, this is
          90 minutes after waking and again early afternoon. Block these first. Everything else builds
          around them. (Our piece on{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>{' '}
          covers how to choose them.)
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Schedule fixed commitments (2 min)</h3>
        <p>
          Meetings, school pickups, gym classes, calls. These are non-negotiable, so place them on
          the calendar exactly. Most people skip this — they leave fixed events unblocked because
          they&rsquo;re &ldquo;just there.&rdquo; That&rsquo;s why other blocks bleed into them.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Assign your top 3 tasks to deep-work blocks (3 min)</h3>
        <p>
          From your brain-dump, pick the 3 highest-leverage tasks. Each one gets one of your
          deep-work blocks. This is the entire ballgame — if your deep-work blocks are doing your
          most important work, the day is already a win.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Batch shallow work into 1-2 windows (2 min)</h3>
        <p>
          Email, Slack, errands, &ldquo;quick admin&rdquo; tasks all live in 1-2 dedicated blocks (e.g.,
          11am-12pm and 4-5pm). The rest of the day, your inbox doesn&rsquo;t exist. This single move
          recovers 1-2 hours of effective deep work for most people.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Block breaks, meals, and transitions (1 min)</h3>
        <p>
          Lunch, walks, transitions between meetings — these get blocks too. If you don&rsquo;t block
          them, they get eaten by adjacent work and you end the day wondering why you&rsquo;re fried.
        </p>

        <Callout icon="⏰" title="The 15-minute rule">
          Newport recommends spending 15 minutes the night before or 15 minutes first thing in the
          morning blocking the day. Skipping this is what makes most time-blocking attempts fail.
          15 minutes of planning saves 2-3 hours of reactive flailing.
        </Callout>
      </Section>

      <Section id="why" title="Why it works (and the 4 rookie mistakes)">
        <p>Time blocking works because it forces three uncomfortable truths into the open:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>You have less time than you think.</strong> A 10-hour workday minus meetings,
            email, lunch, and transitions usually leaves 3-4 hours of real work capacity. The schedule
            makes the truth visible.
          </li>
          <li>
            <strong>You confuse busy with productive.</strong> Without a plan, your day is shaped by
            other people&rsquo;s urgencies. With a plan, the day is shaped by your priorities.
          </li>
          <li>
            <strong>Decisions are exhausting.</strong> Time blocking removes 100+ small decisions a
            day (&ldquo;what should I do now?&rdquo;). The decisions were made the night before. You just
            execute.
          </li>
        </ul>
        <PullQuote>
          The most successful people don&rsquo;t have more time. They have more pre-decided time.
        </PullQuote>

        <h3 className="mt-6 text-[15px] font-bold tracking-tight text-zinc-900">The 4 rookie mistakes</h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Over-scheduling.</strong> 100% calendar coverage with zero buffer breaks at the
            first surprise. Leave 25-30% slack between blocks for the inevitable overruns.
          </li>
          <li>
            <strong>Optimistic durations.</strong> A 2-hour block of deep work usually produces 90
            minutes of real output. Plan for the real number, not the aspirational one.
          </li>
          <li>
            <strong>No mid-day re-planning.</strong> Days break by 11am. Build a 10-minute mid-day
            check-in into your blocks — reshuffle the afternoon based on what actually happened in the
            morning.
          </li>
          <li>
            <strong>Treating it as a one-off.</strong> Time blocking only works as a daily habit.
            One day doesn&rsquo;t prove anything. Run it for 2 weeks before judging.
          </li>
        </ul>

        <Callout icon="📋" title="Your starter template (Week 1)">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Each night, spend 15 minutes blocking tomorrow.</li>
            <li>Mark 2 deep-work blocks (90 minutes each).</li>
            <li>Batch all email/Slack into 2 dedicated windows.</li>
            <li>Schedule lunch + 1 walk explicitly.</li>
            <li>Leave 25% buffer between blocks.</li>
            <li>Re-plan mid-day (10 min) if the morning blew up.</li>
            <li>At end of day, audit: what % of blocks did I honor?</li>
          </ol>
        </Callout>

        <p>
          Time blocking is the operational layer beneath every productivity system. Goal-setting tells
          you <em>what</em> matters; the Eisenhower Matrix tells you <em>which</em> matters first; time
          blocking tells you <em>when</em> it actually happens. Without the last step, the others are
          theory. With it, the year you said you wanted starts compounding on Monday morning. For the
          complementary frameworks, read on:{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>
          ,{' '}
          <Link href="/blog/eisenhower-matrix-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the Eisenhower Matrix
          </Link>
          , and{' '}
          <Link href="/blog/morning-routine-for-high-performers" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            morning routines that set up the first block
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
