import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'how-to-stop-procrastinating';
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
        <AnimatedCounter end={88} suffix="%" className="font-bold text-rose-600" /> of people admit they
        procrastinate daily. The mistake is treating it as a time-management problem. Procrastination
        is an <strong>emotional regulation problem</strong> — brain imaging studies show procrastinators
        have an overactive limbic system fighting an under-trained prefrontal cortex. You don&rsquo;t need
        more discipline. You need a different strategy. Here&rsquo;s the science, the root causes, and the
        7-step protocol that actually works.
      </p>

      <Section id="definition" title="Definition: what is procrastination, actually?">
        <p>
          <strong>Procrastination</strong> is the voluntary delay of an intended action despite expecting
          to be worse off for the delay. That distinction matters: <em>postponing</em> dental work
          because you can&rsquo;t afford it isn&rsquo;t procrastination. Postponing it because you don&rsquo;t want to
          deal with the discomfort — that is.
        </p>
        <p>
          Psychologist Piers Steel&rsquo;s definitive meta-analysis (2007) confirmed what brain scans later
          showed: procrastination is the brain&rsquo;s emotion-regulation system winning a fight against its
          goal-pursuit system. The task isn&rsquo;t the problem. The <em>feelings the task triggers</em> are
          the problem.
        </p>
        <PullQuote>
          Procrastination is not a character flaw. It&rsquo;s your brain choosing short-term mood repair
          over long-term goal achievement.
        </PullQuote>
      </Section>

      <Section id="what" title="What's happening in your brain (the procrastination cycle)">
        <p>The cycle has 4 stages, each measurable in fMRI data:</p>

        {/* Procrastination cycle visual */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            The procrastination cycle (and how to interrupt it)
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
            {[
              { n: 1, label: 'Trigger', emoji: '⚡', desc: 'Task appears. Limbic system fires.', color: 'rose' },
              { n: 2, label: 'Discomfort', emoji: '😰', desc: 'Anxiety, boredom, self-doubt rise.', color: 'amber' },
              { n: 3, label: 'Avoidance', emoji: '📱', desc: 'Switch to something easier (scroll, snack, organize).', color: 'sky' },
              { n: 4, label: 'Relief + Guilt', emoji: '😔', desc: 'Temporary mood lift. Then dread of unfinished task.', color: 'violet' },
            ].map((s) => (
              <div key={s.n} className={`rounded-xl border border-${s.color}-200 bg-${s.color}-50/50 p-3 text-center`}>
                <div className={`mx-auto grid h-7 w-7 place-items-center rounded-full bg-${s.color}-100 text-[12px] font-bold text-${s.color}-700`}>
                  {s.n}
                </div>
                <div className="mt-2 text-[18px]">{s.emoji}</div>
                <div className={`mt-1 text-[11px] font-bold uppercase tracking-wider text-${s.color}-700`}>{s.label}</div>
                <div className="mt-1 text-[10.5px] text-zinc-600">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11.5px] leading-snug text-zinc-500">
            The relief at stage 4 reinforces the avoidance at stage 3 — that&rsquo;s why the loop
            self-perpetuates. Each cycle teaches your brain that avoidance &ldquo;works.&rdquo;
          </div>
        </div>

        <p>
          The brain&rsquo;s <strong>limbic system</strong> (emotion centre) wants immediate comfort. The{' '}
          <strong>prefrontal cortex</strong> (executive function) wants long-term reward. When you face
          an uncomfortable task, these two systems fight — and the limbic system has a structural
          advantage (faster, older, energy-cheap). Until you give the PFC a strategy, it loses.
        </p>
      </Section>

      <Section id="when" title="When you're most vulnerable (the 6 procrastination triggers)">
        <p>Procrastination doesn&rsquo;t hit randomly. 6 specific task properties trigger it:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Boring</strong> — no intrinsic reward (admin, expense reports, paperwork)</li>
          <li><strong>Frustrating</strong> — slow progress, technical complexity (debugging, learning curves)</li>
          <li><strong>Difficult</strong> — beyond current skill level (new language, hard math)</li>
          <li><strong>Ambiguous</strong> — unclear what &ldquo;done&rdquo; looks like (creative work, research)</li>
          <li><strong>Unstructured</strong> — no clear first step (write a book, build a business)</li>
          <li><strong>Lacking in personal meaning</strong> — required but not aligned with values</li>
        </ul>
        <p>
          Most procrastinated tasks tick 3+ of these boxes. The fix isn&rsquo;t to power through with
          willpower. The fix is to <strong>change the task properties</strong>.
        </p>
        <Callout icon="🎯" title="The diagnostic question">
          Next time you procrastinate, ask: <em>which of the 6 triggers is firing right now?</em> Then
          attack THAT trigger specifically. Bored? Add a reward. Ambiguous? Define done in one sentence.
          Frustrating? Lower the difficulty. The trigger tells you the intervention.
        </Callout>
      </Section>

      <Section id="how" title="How to stop procrastinating (the 7-step protocol)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Apply the two-minute rule</h3>
        <p>
          Scale the task to its 2-minute version. &ldquo;Write the report&rdquo; → &ldquo;open the doc and write the
          title.&rdquo; Starting is 90% of the battle — once you&rsquo;re in, the rest tends to follow. See our piece on{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the two-minute rule
          </Link>{' '}
          for the science.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Use temptation bundling</h3>
        <p>
          Pair the task you&rsquo;re avoiding with something you enjoy. Only watch your favourite podcast
          while folding laundry. Only drink your specialty coffee while doing admin. Katy Milkman&rsquo;s
          research (Wharton) found temptation bundling boosts adherence by 51%.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Set a Pomodoro timer</h3>
        <p>
          25 minutes is short enough that your brain agrees to it. Try the{' '}
          <Link href="/blog/pomodoro-technique-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            Pomodoro technique
          </Link>{' '}
          — start one block, even if you don&rsquo;t feel like it. Stop when the timer rings. You&rsquo;ll usually
          want to continue.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Use implementation intentions</h3>
        <p>
          Write down: &ldquo;I will [TASK] at [TIME] in [LOCATION].&rdquo; Studies (Gollwitzer 1999) put adherence
          increases at 2-3x just from this. The specificity removes the decision-making overhead — and
          decision-making is where procrastinators get stuck.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Self-compassion, not self-criticism</h3>
        <p>
          Counterintuitive but research-backed (Sirois et al., 2010): people who forgive themselves for
          past procrastination procrastinate less on the next task. Self-criticism produces more
          procrastination, not less, because it loads the next attempt with anxiety.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Remove temptation friction</h3>
        <p>
          Phone in another room. Browser tabs closed. Notifications off. Distractions aren&rsquo;t
          <em> overcome</em> — they&rsquo;re <em>removed</em>. Every minute you&rsquo;re fighting a distraction is a
          minute your prefrontal cortex isn&rsquo;t working on the task.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">7. Use deadlines as leverage</h3>
        <p>
          Self-imposed deadlines beat no deadlines, but external ones beat both. Tell someone what
          you&rsquo;ll deliver and when. Public commitment activates loss-aversion and accountability — both
          stronger motivators than your good intentions. See our piece on{' '}
          <Link href="/blog/parkinsons-law-deadline-leverage" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            Parkinson&rsquo;s Law
          </Link>{' '}
          for the deadline math.
        </p>
      </Section>

      <Section id="why" title="Why willpower-based fixes don't work (and what does)">
        <p>The standard advice — &ldquo;just try harder,&rdquo; &ldquo;be more disciplined&rdquo; — fails for three reasons:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>It treats procrastination as a character flaw, not a brain mechanism.</strong> You
            can&rsquo;t willpower your way out of a limbic-system fight that&rsquo;s already happening.
          </li>
          <li>
            <strong>It targets the wrong stage of the cycle.</strong> &ldquo;Trying harder&rdquo; happens at
            stage 1 (trigger). By then, the cycle is already in motion. Real fixes target stages 3 and
            4 — remove the avoidance options and break the relief reinforcement.
          </li>
          <li>
            <strong>It adds shame, which makes it worse.</strong> Shame triggers more emotion-regulation
            issues — and procrastination is fundamentally an emotion-regulation issue.
          </li>
        </ul>
        <PullQuote>
          The opposite of procrastination isn&rsquo;t discipline. It&rsquo;s an environment designed for the brain
          you actually have.
        </PullQuote>

        <Callout icon="📋" title="Your 60-second anti-procrastination protocol">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Name the trigger (which of the 6 is firing?)</li>
            <li>Scale to 2 minutes (&ldquo;just start&rdquo; not &ldquo;just finish&rdquo;)</li>
            <li>Phone in another room</li>
            <li>Set a 25-minute timer</li>
            <li>Tell someone what you&rsquo;ll deliver</li>
            <li>If you skip — forgive yourself fast, restart with step 1</li>
          </ol>
        </Callout>

        <p>
          The compounding cost of procrastination is bigger than any single missed task. A year of
          consistent small avoidance produces dramatically worse outcomes than a year of imperfect
          execution. BuildYourYear is built to attack the avoidance loop directly: the dashboard
          surfaces today&rsquo;s 3 priorities, the quick-add chips reduce capture friction, the streak
          counter exploits loss-aversion in your favour, and the heatmap shows which tasks you
          actually shipped vs which you keep rolling forward.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the two-minute rule
          </Link>
          ,{' '}
          <Link href="/blog/pomodoro-technique-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the Pomodoro technique
          </Link>
          , and{' '}
          <Link href="/blog/parkinsons-law-deadline-leverage" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            Parkinson&rsquo;s Law
          </Link>{' '}
          (use deadlines as leverage when willpower runs out).
        </p>
      </Section>
    </BlogLayout>
  );
}
