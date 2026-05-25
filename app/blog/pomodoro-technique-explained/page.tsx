import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import PomodoroTimer from '@/components/blog/PomodoroTimer';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'pomodoro-technique-explained';
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
        In 1987, a college student named Francesco Cirillo couldn&rsquo;t focus on his exam prep. He grabbed
        a kitchen timer shaped like a tomato — <em>pomodoro</em> in Italian — set it for 25 minutes,
        and committed to one task until it rang. The technique he accidentally invented is now used by
        millions of professionals worldwide. Here&rsquo;s why{' '}
        <strong><AnimatedCounter end={25} className="text-emerald-700" /> minutes beats 4 hours</strong>,
        the 6 rules that make it work, and a live working timer you can start right now.
      </p>

      <Section id="definition" title="Definition: what is the Pomodoro Technique?">
        <p>
          The <strong>Pomodoro Technique</strong> is a time-management method that breaks work into
          focused intervals (called &ldquo;pomodoros&rdquo;) separated by short breaks. The classic ratio:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>25 minutes</strong> of single-task focused work</li>
          <li><strong>5 minutes</strong> of rest</li>
          <li>After every <strong>4 pomodoros</strong>, a longer 15-30 minute break</li>
        </ul>
        <p>
          The rules are unusual: <em>no</em> task-switching during the 25 minutes, <em>no</em> &ldquo;just
          checking&rdquo; messages, <em>no</em> continuing through the break (yes, even if you&rsquo;re in flow).
          The structure isn&rsquo;t a suggestion — it&rsquo;s the entire mechanism.
        </p>

        <PomodoroTimer />
      </Section>

      <Section id="what" title="What the science says (why 25 minutes is the magic number)">
        <p>Three converging findings explain the specific 25-minute window:</p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Attention decays after 20-25 minutes</h3>
        <p>
          fMRI studies of sustained attention show measurable decline in prefrontal-cortex activity
          starting around the 20-minute mark. A 25-minute block captures most of the productive
          attention curve before fatigue accumulates.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Short breaks reset the curve</h3>
        <p>
          A 5-minute break (genuine rest, not just task-switching) returns attention to near-baseline.
          Without breaks, the curve flattens; you&rsquo;re technically &ldquo;working&rdquo; but producing exponentially
          less per hour.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Time-boxing reduces procrastination</h3>
        <p>
          A defined 25-minute commitment is small enough that the limbic system doesn&rsquo;t fight it
          (see our piece on{' '}
          <Link href="/blog/how-to-stop-procrastinating" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why procrastination happens
          </Link>
          ). &ldquo;Work on the report&rdquo; triggers avoidance. &ldquo;Work on it for 25 minutes&rdquo; doesn&rsquo;t.
        </p>

        {/* Focus decay curve */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Focus capacity decays without breaks — pomodoros reset the curve
          </div>
          <svg viewBox="0 0 360 170" className="h-40 w-full">
            <defs>
              <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="40" y1="140" x2="340" y2="140" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#d4d4d8" />
            {/* Continuous work decay (rose) */}
            <path
              d="M 40 35 Q 100 45, 160 75 T 280 115 T 340 125"
              fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 3"
            />
            <text x="280" y="105" fontSize="9.5" fill="#be123c" fontWeight="700">Without breaks</text>
            {/* Pomodoro cycles (emerald) — sawtooth */}
            {[0, 1, 2, 3].map((i) => {
              const xStart = 40 + i * 70;
              const xMid = xStart + 50;
              const xEnd = xStart + 70;
              return (
                <g key={i}>
                  <path
                    d={`M ${xStart} 35 L ${xMid} 65`}
                    fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round"
                  />
                  <path
                    d={`M ${xMid} 65 L ${xEnd} 35`}
                    fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 2"
                  />
                </g>
              );
            })}
            <text x="160" y="28" fontSize="9.5" fill="#047857" fontWeight="700">With pomodoros</text>
            {/* x labels */}
            <text x="40" y="155" fontSize="9" fill="#52525b">0 min</text>
            <text x="190" y="155" fontSize="9" fill="#52525b">75 min</text>
            <text x="340" y="155" fontSize="9" fill="#52525b" textAnchor="end">150 min</text>
          </svg>
        </div>
      </Section>

      <Section id="when" title="When the Pomodoro Technique works best (and when it doesn't)">
        <p>It works extraordinarily well for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Studying / learning</strong> — the most-researched use case. Beats unstructured study by 30-40% on retention.</li>
          <li><strong>Routine knowledge work</strong> — coding, writing, design, analysis</li>
          <li><strong>Tasks you keep procrastinating on</strong> — the 25-min commitment is low enough to start</li>
          <li><strong>ADHD focus support</strong> — many clinicians recommend it; the structure substitutes for executive function</li>
        </ul>
        <p>It works poorly for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Deep flow work</strong> — interrupting a flow state for a mandatory break costs more than the break is worth (see our piece on{' '}
            <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              deep work
            </Link>
            )
          </li>
          <li><strong>Collaborative or real-time work</strong> — meetings, calls, pair programming need their own duration</li>
          <li><strong>Creative ideation</strong> — random &ldquo;tomato&rdquo; cuts can break the thread</li>
        </ul>
        <Callout icon="🎯" title="The hybrid that wins">
          Use pomodoros for the first 1-2 hours of the day (high friction, low momentum). Switch to
          90-minute deep-work blocks once you&rsquo;re in flow. The pomodoro gets you started; the deep block
          finishes the job.
        </Callout>
      </Section>

      <Section id="how" title="How to run the Pomodoro Technique (the 6 rules)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Choose ONE task</h3>
        <p>
          Before starting the timer, name the one task this pomodoro is for. &ldquo;Reply to email&rdquo; is
          fine. &ldquo;Email + research + plan&rdquo; is not — that&rsquo;s 3 pomodoros.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Set the timer for 25 minutes</h3>
        <p>
          Visible countdown is part of the technique. The ticking presence creates mild urgency. Phone,
          kitchen timer, app — anything works.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Work, only on that task, until the timer rings</h3>
        <p>
          If you&rsquo;re interrupted (urgent message, knock on door), you can either: (a) handle it and
          start the pomodoro over, or (b) capture it on a notepad and address it after. Never &ldquo;just
          quickly check.&rdquo;
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Take the 5-minute break — fully</h3>
        <p>
          The break is the recovery half of the technique. Stand up. Walk. Look out a window. Do NOT
          check email or scroll Twitter (these don&rsquo;t rest the same brain regions). Real rest.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. After 4 pomodoros, take a long break</h3>
        <p>
          15-30 minutes. Walk outside if possible. The long break is when the brain consolidates the
          last 100 minutes of work. Skip it and the next pomodoro will produce visibly worse output.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Track completed pomodoros</h3>
        <p>
          The count is the score. Most knowledge workers can sustainably do 6-10 pomodoros of real
          deep work per day — total <em>focused</em> time of 2.5-4 hours. If you&rsquo;re doing 12+, you&rsquo;re
          probably padding shallow work into the count.
        </p>
      </Section>

      <Section id="why" title="Why the Pomodoro Technique outlasts every other focus hack">
        <p>Three reasons it&rsquo;s been the dominant focus technique for 35+ years:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>The structure is the entire technique.</strong> No willpower required — once the
            timer starts, the rules do the work. Most focus methods rely on self-discipline; pomodoros
            replace it with structure.
          </li>
          <li>
            <strong>It reframes &ldquo;productivity&rdquo; as a count.</strong> Instead of vague &ldquo;was I
            productive today?&rdquo;, you can answer concretely: &ldquo;7 pomodoros.&rdquo; That measurability is
            psychologically powerful — and corrects the &ldquo;felt busy but achieved little&rdquo; failure mode.
          </li>
          <li>
            <strong>It scales down on hard days.</strong> Bad day? Do one pomodoro. The 25-minute
            commitment survives weeks where every other technique collapses. Consistency is built from
            the floor up, not the ceiling down.
          </li>
        </ul>
        <PullQuote>
          You don&rsquo;t need a perfect day. You need one good pomodoro — and then another.
        </PullQuote>

        <Callout icon="📋" title="Your 5-pomodoro starter day">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Morning pomodoro 1: hardest task of the day (writing, planning, deep work)</li>
            <li>Pomodoro 2: same task, continue</li>
            <li>Long break</li>
            <li>Pomodoro 3: second priority</li>
            <li>Pomodoro 4: email/shallow batch — use a pomodoro to bound it</li>
            <li>Long break</li>
            <li>Pomodoro 5: tomorrow&rsquo;s prep / planning</li>
          </ol>
          <p className="mt-2">5 pomodoros = 2 hours of actual focused output. More than most full workdays produce.</p>
        </Callout>

        <p>
          The Pomodoro Technique pairs naturally with everything else in the BuildYourYear toolkit:
          the dashboard surfaces today&rsquo;s 3 priorities, you assign each to 1-2 pomodoros, the timer above
          gets you started, and the streak counter rewards the daily practice. By month 3 of consistent
          pomodoros, total deep-work output usually 2-3x without working any longer hours.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>
          ,{' '}
          <Link href="/blog/how-to-stop-procrastinating" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            how to stop procrastinating
          </Link>
          , and{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the two-minute rule
          </Link>{' '}
          (the on-ramp to your first pomodoro).
        </p>
      </Section>
    </BlogLayout>
  );
}
