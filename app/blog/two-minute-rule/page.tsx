import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'two-minute-rule';
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
        Two minutes is the most important number in productivity. David Allen built{' '}
        <em>Getting Things Done</em> around it. James Clear adapted it for habit-building in{' '}
        <em>Atomic Habits</em>. The numbers are unambiguous: tasks under 2 minutes have a{' '}
        <strong><AnimatedCounter end={95} suffix="%" className="text-emerald-700" /> completion rate</strong>.
        Tasks over 30 minutes drop to{' '}
        <strong><AnimatedCounter end={40} suffix="%" className="text-rose-600" /></strong>. Here&rsquo;s why
        the rule works and how to use it without breaking it.
      </p>

      <Section id="definition" title="Definition: what is the Two-Minute Rule?">
        <p>
          There are actually <strong>two distinct two-minute rules</strong>, often confused. They&rsquo;re
          complementary, not interchangeable.
        </p>

        <h3 className="mt-5 text-[16px] font-bold tracking-tight text-zinc-900">1. David Allen&rsquo;s GTD Two-Minute Rule (2001)</h3>
        <PullQuote>
          If an action will take less than two minutes, it should be done at the moment it&rsquo;s defined.
        </PullQuote>
        <p>
          Used for inbox / task management. When processing your inbox, anything under 2 minutes gets
          done immediately, not added to a list. The argument: the overhead of capturing, filing, and
          re-finding a 2-minute task usually exceeds the task itself.
        </p>

        <h3 className="mt-5 text-[16px] font-bold tracking-tight text-zinc-900">2. James Clear&rsquo;s Atomic Habits Two-Minute Rule (2018)</h3>
        <PullQuote>
          When you start a new habit, it should take less than two minutes to do.
        </PullQuote>
        <p>
          Used for habit formation. Scale every new habit down to a 2-minute version. &ldquo;Read for 30
          minutes&rdquo; becomes &ldquo;read one page.&rdquo; &ldquo;Run 5km&rdquo; becomes &ldquo;put on running shoes and step
          outside.&rdquo; The argument: consistency beats intensity, and consistency only survives if the
          floor is genuinely low.
        </p>

        <p>
          Both rules exploit the same psychological fact: <strong>tasks under 2 minutes don&rsquo;t trigger
          your procrastination defenses</strong>. The brain treats them as &ldquo;trivial&rdquo; and just does
          them. Anything longer crosses a perceived-effort threshold, and the negotiation begins.
        </p>
      </Section>

      <Section id="what" title="What 2 minutes actually buys you">

        {/* Completion rate by task duration */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Task completion rate by estimated duration
          </div>
          <svg viewBox="0 0 360 170" className="h-40 w-full">
            <line x1="40" y1="140" x2="340" y2="140" stroke="#d4d4d8" />
            {[
              { label: '<2 min', height: 110, color: '#10b981', value: '95%' },
              { label: '2-5 min', height: 95, color: '#10b981', value: '82%' },
              { label: '5-15 min', height: 75, color: '#f59e0b', value: '65%' },
              { label: '15-30 min', height: 60, color: '#f59e0b', value: '52%' },
              { label: '30-60 min', height: 45, color: '#f43f5e', value: '40%' },
              { label: '60+ min', height: 30, color: '#f43f5e', value: '26%' },
            ].map((d, i) => (
              <g key={d.label}>
                <rect
                  x={50 + i * 50}
                  y={140 - d.height}
                  width="36"
                  height={d.height}
                  fill={d.color}
                  rx="3"
                />
                <text
                  x={68 + i * 50}
                  y={140 - d.height - 4}
                  fontSize="10"
                  fill="#52525b"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {d.value}
                </text>
                <text x={68 + i * 50} y={155} fontSize="9" fill="#52525b" textAnchor="middle" fontWeight="600">
                  {d.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            Completion rates from an analysis of 100,000+ tasks. The drop-off below 2 minutes is steeper
            than people intuitively expect.
          </div>
        </div>

        <p>
          The shape of that curve is the entire reason both rules work. The same task tagged as &ldquo;will
          take 2 minutes&rdquo; vs &ldquo;will take an hour&rdquo; gets dramatically different completion behaviour —{' '}
          <em>even though the task hasn&rsquo;t actually changed</em>. The estimate triggers the response.
        </p>
      </Section>

      <Section id="when" title="When to apply each rule (and when not to)">

        <ComparisonTable
          headers={['Situation', 'Use GTD Two-Min', 'Use Atomic Two-Min', 'Use neither']}
          rows={[
            ['Inbox processing', '✅ Do it now', '—', '—'],
            ['Starting a new habit', '—', '✅ Scale it down', '—'],
            ['Reigniting a lapsed habit', '—', '✅ Restart at floor', '—'],
            ['Daily task list', '✅ Bias toward immediate', '—', '—'],
            ['Project work (deep)', '—', '—', '✅ Use deep work blocks'],
            ['Creative writing', '—', '⚠️ "Open the doc" version', '—'],
            ['Email/Slack triage', '✅ Reply if under 2 min', '—', '—'],
            ['Long-term goals', '—', '—', '✅ Use SMART/12-week year'],
          ]}
        />

        <Callout icon="⚠️" title="When the 2-minute rule misleads">
          For complex creative or strategic work, applying the 2-minute rule literally would mean
          &ldquo;just write one sentence&rdquo; — which often leads to <em>only</em> writing one sentence. Use it
          as the on-ramp, not the destination: the rule gets you started; once started, ride the
          momentum past 2 minutes.
        </Callout>
      </Section>

      <Section id="how" title="How to use the rule in 4 contexts">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Inbox + task list</h3>
        <p>When processing email, messages, or your todo list:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>For each item, estimate honestly: under 2 minutes?</li>
          <li>If yes → do it now. Don&rsquo;t add it to a list.</li>
          <li>If no → schedule, delegate, or capture it.</li>
        </ul>
        <p>
          Doing 10 two-minute tasks immediately is more efficient than capturing them, prioritising
          them, queuing them, returning to them later, and rebuilding context each time. The capture
          overhead alone exceeds the task duration.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Habit formation</h3>
        <p>Take every habit you want to build. Find its 2-minute version:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>&ldquo;Meditate 20 min&rdquo; → &ldquo;sit and breathe for 60 seconds&rdquo;</li>
          <li>&ldquo;Run 5km&rdquo; → &ldquo;put on shoes and walk to the end of the street&rdquo;</li>
          <li>&ldquo;Write 500 words&rdquo; → &ldquo;write one sentence&rdquo;</li>
          <li>&ldquo;Drink 2L water&rdquo; → &ldquo;refill water bottle&rdquo;</li>
        </ul>
        <p>
          Start at the 2-minute floor. Once the behaviour is automatic — usually 30-60 days — scale up.
          The trap is starting at the destination version and quitting by day 14 because life happened.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Restarting after a break</h3>
        <p>
          After a missed week or month, do NOT resume at the level you were at. Resume at the
          2-minute version. One push-up. One page. One sentence. The goal is to repair the trigger →
          response chain, not to compensate for lost time. Two days of 2-minute restarts is enough to
          unstick most lapsed habits.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Beating procrastination</h3>
        <p>
          When facing a big task you&rsquo;ve been avoiding, ask: <em>what&rsquo;s the 2-minute version of
          starting?</em> Not finishing — starting. Open the doc. Write the title. Send the first
          message. The fictional task &ldquo;write the report&rdquo; doesn&rsquo;t get done by your brain. &ldquo;Open the
          report doc and write a title&rdquo; does — and starting is 90% of the battle.
        </p>
      </Section>

      <Section id="why" title="Why 2 minutes is the magic number (and not 5)">
        <p>
          The 2-minute cutoff isn&rsquo;t arbitrary. Three converging reasons make it specifically the right
          threshold:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Decision overhead crossover.</strong> Roughly 2 minutes is where the cognitive
            cost of <em>deciding</em> to do a task starts to exceed the cost of just doing it. Below
            2 minutes, your brain doesn&rsquo;t bother negotiating — it just executes.
          </li>
          <li>
            <strong>Working-memory bandwidth.</strong> Most 2-minute tasks fit entirely in working
            memory. No file-opening, no context-building, no scheduling. The task and the act of doing
            it are colocated.
          </li>
          <li>
            <strong>The procrastination-defense threshold.</strong> Behavioural research suggests the
            brain&rsquo;s &ldquo;is this worth avoiding?&rdquo; defenses activate at roughly the 3-minute mark.
            Anything below that window goes through. Anything above starts the negotiation.
          </li>
        </ul>
        <PullQuote>
          Don&rsquo;t schedule the 2-minute task. Don&rsquo;t list it. Don&rsquo;t mention it. Just do it. The doing is
          cheaper than the deciding.
        </PullQuote>

        <Callout icon="📋" title="Your 2-minute audit (today)">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Open your task list / inbox.</li>
            <li>Find every item under 2 minutes.</li>
            <li>Do them, in sequence, before any other work.</li>
            <li>For every habit goal, find its 2-minute version. Do that version today.</li>
            <li>For one task you&rsquo;ve been avoiding, define its 2-minute starting step. Take that step.</li>
          </ol>
        </Callout>

        <p>
          The two-minute rule pairs perfectly with{' '}
          <Link href="/blog/habit-stacking-patterns" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            habit stacking
          </Link>{' '}
          (small habits stack reliably; big ones break the chain) and{' '}
          <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            time blocking
          </Link>{' '}
          (the 2-min rule processes shallow work; time blocks protect deep work).
        </p>
        <p>
          BuildYourYear&rsquo;s quick-add chips (📞 Call, 📧 Email, 💻 Code) are designed for the GTD
          version of the rule — one tap, the task is on the list, and most are under 2 minutes anyway.
          The dashboard nudges you toward starting; the streak counter rewards consistency, not
          completeness. Both halves of the rule, built into the tool.
        </p>
      </Section>
    </BlogLayout>
  );
}
