import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'why-you-cant-multitask';
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
        Stanford researchers spent years looking for the heavy multitaskers — the people who could
        genuinely juggle multiple streams of information at once. They found them. Then they tested
        them on every multitasking-relevant skill they could measure: filtering distractions, switching
        between tasks, holding information in working memory. The heavy multitaskers performed{' '}
        <strong>worse on every single test</strong>. The brutal truth: roughly{' '}
        <AnimatedCounter end={2.5} suffix="%" className="font-bold text-teal-700" /> of humans
        can actually multitask. The rest of us are task-switching — and paying a productivity tax of
        up to <AnimatedCounter end={40} suffix="%" className="font-bold text-teal-700" /> every
        time we do.
      </p>

      <Section id="definition" title="Definition: multitasking vs task-switching">
        <p>
          Most of what people call &ldquo;multitasking&rdquo; isn&rsquo;t multitasking at all. Your
          brain has one prefrontal cortex — it can only consciously direct attention to one cognitive
          task at a time. What feels like doing two things at once is actually:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Task-switching:</strong> rapidly toggling focus between tasks (with a switching cost each time)</li>
          <li><strong>Background automation:</strong> one task running on autopilot (walking) while another is conscious (talking)</li>
          <li><strong>Continuous partial attention:</strong> doing both tasks worse than you&rsquo;d do either alone</li>
        </ul>
        <p>
          True multitasking — running two cognitively demanding tasks simultaneously, both at full
          performance — is only possible when one of the tasks is fully automated (an expert pianist
          can sight-read and chat, a beginner cannot). For everything else, the brain serialises:
          switch, focus, switch, focus.
        </p>

        <PullQuote>
          The human brain doesn&rsquo;t multitask. It rapidly switches between tasks, and every switch
          has a measurable cost. — Earl Miller, MIT neuroscientist
        </PullQuote>
      </Section>

      <Section id="what" title="What the research actually shows">
        <p>The numbers are stark and consistent across decades of studies:</p>

        <ComparisonTable
          headers={['Finding', 'Effect', 'Source']}
          rows={[
            ['Productivity loss from task-switching', '−40%', 'APA / Meyer & Rubinstein'],
            ['IQ drop while juggling email + work', '−10 points (worse than cannabis)', 'King\'s College London / Glenn Wilson'],
            ['Time to refocus after an interruption', '23 min 15 sec average', 'UC Irvine / Gloria Mark'],
            ['Errors made while multitasking', '+50%', 'Stanford / Clifford Nass'],
            ['% who can multitask without loss', '~2.5%', 'University of Utah / Watson & Strayer'],
            ['Self-described "great multitaskers" actual score', 'Worse on every measure', 'Stanford / Nass et al.'],
            ['Recovery cost from one Slack ping', '~64 sec direct + ~10 min cognitive', 'Microsoft Research'],
          ]}
        />

        <div className="my-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-2 text-[12px] font-bold uppercase tracking-wide text-teal-700">The context-switch cost over time</div>
          <svg viewBox="0 0 600 220" className="h-auto w-full">
            <defs>
              <linearGradient id="ctxArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* axes */}
            <line x1="50" y1="180" x2="580" y2="180" stroke="#a1a1aa" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#a1a1aa" strokeWidth="1" />
            {/* baseline */}
            <line x1="50" y1="50" x2="580" y2="50" stroke="#10b981" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x="56" y="42" fontSize="10" fill="#065f46" fontWeight="700">Deep-work productivity (single task)</text>
            {/* sawtooth task-switching curve - drops, climbs back, drops */}
            <path
              d="M 50 50 L 110 50 L 120 165 L 180 90 L 190 170 L 250 110 L 260 170 L 320 120 L 330 168 L 390 130 L 400 168 L 460 135 L 470 168 L 530 140 L 540 168 L 580 145"
              fill="url(#ctxArea)"
              stroke="#0d9488"
              strokeWidth="2.2"
            />
            {/* switch markers */}
            {[120, 190, 260, 330, 400, 470, 540].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy={168} r="3" fill="#ef4444" />
              </g>
            ))}
            <text x="56" y="200" fontSize="10" fill="#52525b">0 min</text>
            <text x="270" y="200" fontSize="10" fill="#52525b">switch every ~3 min</text>
            <text x="540" y="200" fontSize="10" fill="#52525b">25 min</text>
            <text x="14" y="55" fontSize="10" fill="#52525b" fontWeight="600">100%</text>
            <text x="20" y="175" fontSize="10" fill="#52525b" fontWeight="600">30%</text>
            <text x="320" y="35" fontSize="11" fill="#0f766e" fontWeight="700">Each red dot = one switch. Performance never recovers.</text>
          </svg>
          <p className="mt-2 text-[12px] text-zinc-600">
            Single-task focus stays at the dashed green line. Task-switching every few minutes (red
            dots) keeps performance pinned to the 30–50% band — the brain can&rsquo;t climb back to
            deep work because each ramp-up gets interrupted.
          </p>
        </div>

        <p>
          The most counterintuitive finding: <strong>people who multitask the most are worst at it.</strong>
          Stanford&rsquo;s Clifford Nass expected heavy multitaskers to have some hidden cognitive
          superpower. Instead they found heavy multitaskers were worse at filtering irrelevant
          information, worse at organising memory, and worse at switching between tasks. The very
          activity they thought they were optimising had degraded the underlying machinery.
        </p>
      </Section>

      <Section id="when" title="When the switching cost hits hardest">
        <p>Not all switches cost the same. Task-switching cost scales with three factors:</p>

        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Cognitive depth of the task.</strong> Switching between two shallow tasks
            (sorting email + folding laundry) costs little. Switching between two deep tasks (writing
            code + writing strategy) costs enormous reload time — your working memory has to flush
            and refill each time.
          </li>
          <li>
            <strong>Similarity of the tasks.</strong> Two writing tasks share mental models. Code +
            spreadsheet + Slack DM live in completely different cognitive territories — each switch
            forces a full context teardown.
          </li>
          <li>
            <strong>Recency of the previous task.</strong> If you switched away from Task A 30 seconds
            ago, returning is fast. After 10 minutes, you&rsquo;ve cooled off and re-priming the
            context takes minutes.
          </li>
        </ul>

        <Callout icon="⚠️" title="The hidden cost: residual attention">
          When you switch from Task A to Task B, part of your attention stays stuck on Task A — what
          Sophie Leroy called &ldquo;attention residue.&rdquo; You&rsquo;re not fully present on B
          for several minutes. This is why answering &ldquo;just one quick email&rdquo; mid-deep-work
          ruins the next 20 minutes, not the next 2.
        </Callout>

        <p>
          The most expensive multitasking happens in knowledge work: writing, designing, coding,
          analysing, strategising. Anything that requires holding a complex model in your head. These
          are exactly the tasks people most often try to multitask — because they feel hard, and
          interruption feels like relief. The relief is real. The cost is invisible until you measure
          output at week&rsquo;s end and notice 60% of your hours produced 10% of the value.
        </p>
      </Section>

      <Section id="how" title="How to single-task (the 5-step protocol)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Pick one Most Important Task per work block</h3>
        <p>
          Before starting a work block, choose exactly one task. Not three. Not &ldquo;these few
          things.&rdquo; One. Write it on paper. Everything else this block is interruption — even if
          it&rsquo;s &ldquo;productive&rdquo; interruption. The goal isn&rsquo;t to do everything;
          it&rsquo;s to finish the one thing that matters most.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Use a Pomodoro structure (25/5)</h3>
        <p>
          Twenty-five minutes of pure single-tasking, five minutes of break. During the 25, you do
          only one thing — no phone-checks, no Slack peek, no &ldquo;quick&rdquo; tab. The break is
          for everything else. Try our{' '}
          <Link href="/blog/pomodoro-technique-explained" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            Pomodoro guide
          </Link>{' '}
          with a working timer for the protocol.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Close every channel that can interrupt you</h3>
        <p>
          Slack: closed. Email tab: closed. Phone: face-down or in another room. Notifications:
          silenced. Two browser windows max — one for the task, one for the reference material. Every
          channel that can fire a notification is a switching cost waiting to charge you. The
          deepest-working people don&rsquo;t have superhuman discipline; they have fewer open
          channels.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Batch shallow work into one daily window</h3>
        <p>
          Email, Slack replies, admin, calendar tetris — these are all shallow tasks that{' '}
          <em>feel</em> productive but consume the working hours that should be deep. Batch them into
          a single 30-60 min window (mid-afternoon works for most people). Outside that window,
          you&rsquo;re unavailable. This single change reclaims 2-3 hours of deep work per day for
          most knowledge workers.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Track your context switches</h3>
        <p>
          For one week, make a tally mark every time you switch tasks. Most people are shocked — 50,
          80, 120 switches per day. The act of counting alone reduces switches by ~30%. Pair this
          with a goal: cut your daily switch count in half over 4 weeks. Your output will roughly
          double.
        </p>
      </Section>

      <Section id="why" title="Why single-tasking is a competitive moat">
        <p>
          The world is getting more distracted, not less. Every year more apps compete for your
          attention, more channels demand reply, more meetings fragment your calendar. The average
          knowledge worker now switches tasks every 3 minutes. In this environment, the ability to
          single-task for 90 uninterrupted minutes isn&rsquo;t just nice — it&rsquo;s a moat.
        </p>

        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Compounding effect.</strong> A 40% productivity tax compounds. Over a year, the
            single-tasker ships ~2x the output of the equally-talented multitasker.
          </li>
          <li>
            <strong>Quality, not just quantity.</strong> Deep work produces better work. The
            multitasker delivers shallow output that needs more revision; the single-tasker
            delivers the final draft.
          </li>
          <li>
            <strong>Recovery and energy.</strong> Constant switching drains glucose and willpower
            faster than focused work. End-of-day fatigue from heavy multitasking is real and
            measurable — see{' '}
            <Link href="/blog/decision-fatigue" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
              decision fatigue
            </Link>
            .
          </li>
          <li>
            <strong>Mental clarity.</strong> Long-term heavy multitaskers show measurably worse
            working memory and attention filtering even when single-tasking. The damage persists.
          </li>
        </ul>

        <PullQuote>
          To be productive is to do less, but to do it deeper. The myth of multitasking is the most
          expensive lie modern work has sold us.
        </PullQuote>

        <Callout icon="📋" title="Your single-tasking week (start tomorrow)">
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>Monday:</strong> Pick one MIT for the day. Work on it first, before email/Slack.</li>
            <li><strong>Tuesday:</strong> Add a 90-min deep work block. Phone in another room.</li>
            <li><strong>Wednesday:</strong> Batch shallow work into one window (e.g. 2-3pm). Outside it, unavailable.</li>
            <li><strong>Thursday:</strong> Count your context switches. Aim for under 30 for the day.</li>
            <li><strong>Friday:</strong> Two 90-min deep work blocks. Notice the output difference.</li>
            <li><strong>Saturday:</strong> Audit. Which channels caused the most switches? Mute them next week.</li>
            <li><strong>Sunday:</strong> Plan next week&rsquo;s MITs in advance. One per day, written down.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear was designed for the single-tasker: a clear daily MIT, habits tracked in
          seconds (not minutes of fiddling), and a dashboard that doesn&rsquo;t ping you. The whole
          philosophy is one focused click per day — the opposite of the &ldquo;engagement&rdquo; loop
          most productivity apps optimise for.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/pomodoro-technique-explained" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            the Pomodoro technique
          </Link>
          ,{' '}
          <Link href="/blog/dopamine-detox-7-days" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            dopamine detox
          </Link>
          , and{' '}
          <Link href="/blog/parkinsons-law-deadline-leverage" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            Parkinson&rsquo;s Law
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
