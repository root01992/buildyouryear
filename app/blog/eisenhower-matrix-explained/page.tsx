import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'eisenhower-matrix-explained';
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
        Dwight Eisenhower — five-star general, then US president — famously said:{' '}
        <em>&ldquo;What is important is seldom urgent, and what is urgent is seldom important.&rdquo;</em>{' '}
        Stephen Covey turned that sentence into a 2×2 matrix that became the most-cited
        prioritisation framework in productivity. Here&rsquo;s what it actually is, when it works,
        and why most people draw it once and never look at it again.
      </p>

      <Section id="definition" title="Definition: what is the Eisenhower Matrix?">
        <p>
          The <strong>Eisenhower Matrix</strong> (also called the Eisenhower Box or the Time Management
          Matrix) is a 2-by-2 grid that sorts every task you face by two dimensions:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Urgency</strong> — does this need to be done now? (deadline pressure)</li>
          <li><strong>Importance</strong> — does this move me toward my long-term goals?</li>
        </ul>
        <p>The four quadrants map to four distinct responses:</p>

        {/* The 2x2 matrix visual */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            The Eisenhower Matrix
          </div>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-[12.5px]">
            <div />
            <div className="text-center text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">Urgent</div>
            <div className="text-center text-[10.5px] font-bold uppercase tracking-wider text-zinc-500">Not Urgent</div>

            <div className="self-center -rotate-90 self-center text-center text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">Important</div>
            <div className="rounded-xl border-2 border-rose-300 bg-rose-50/60 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Q1 · Crisis</div>
              <div className="mt-1 text-[13px] font-bold text-zinc-900">DO IT NOW</div>
              <div className="mt-1 text-[11.5px] leading-snug text-zinc-600">Deadlines, emergencies, fires.</div>
            </div>
            <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50/70 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Q2 · Growth ⭐</div>
              <div className="mt-1 text-[13px] font-bold text-zinc-900">SCHEDULE IT</div>
              <div className="mt-1 text-[11.5px] leading-snug text-zinc-600">Habits, planning, deep work, relationships.</div>
            </div>

            <div className="self-center -rotate-90 self-center text-center text-[10.5px] font-bold uppercase tracking-wider text-zinc-500">Not Important</div>
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50/60 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Q3 · Interruption</div>
              <div className="mt-1 text-[13px] font-bold text-zinc-900">DELEGATE IT</div>
              <div className="mt-1 text-[11.5px] leading-snug text-zinc-600">Other people&rsquo;s urgencies, most meetings.</div>
            </div>
            <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Q4 · Distraction</div>
              <div className="mt-1 text-[13px] font-bold text-zinc-900">DELETE IT</div>
              <div className="mt-1 text-[11.5px] leading-snug text-zinc-600">Doomscrolling, busywork, &ldquo;productive&rdquo; procrastination.</div>
            </div>
          </div>
        </div>

        <p>
          The matrix is descriptively trivial (anyone can sort tasks). It&rsquo;s prescriptively powerful: it
          tells you <strong>where to spend more time and where to spend less</strong>. The
          counter-intuitive answer is the framework&rsquo;s entire gift.
        </p>
      </Section>

      <Section id="what" title="What each quadrant actually contains (with examples)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Q1: Urgent + Important — &ldquo;Crisis&rdquo;</h3>
        <p>
          Genuine emergencies. The task is due today and matters. Examples: a crashed production server,
          a sick family member, the report that&rsquo;s due in 3 hours, the surprise tax deadline. You handle
          Q1 immediately — there&rsquo;s no other option.
        </p>
        <p>
          <strong>The trap:</strong> a high-Q1 life is a reactive life. If you spend 80% of your week in
          Q1, your system is failing somewhere upstream. Q1 tasks should be exceptions, not your default
          mode.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Q2: Not Urgent + Important — &ldquo;Growth&rdquo;</h3>
        <p>
          This is the quadrant high performers protect. Q2 is everything that doesn&rsquo;t scream at you
          today but determines your year:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Exercise / sleep / health habits</li>
          <li>Reading, learning, deliberate practice</li>
          <li>Strategic thinking, weekly planning</li>
          <li>Relationship investment (calls, dates, presence)</li>
          <li>Goal milestone work — the writing, the building, the saving</li>
        </ul>
        <p>
          <strong>The trap:</strong> Q2 has no external pressure forcing you to do it. So most people
          chronically delay it for Q1 (crisis) and Q3 (other people&rsquo;s urgencies). The Eisenhower Matrix
          is really an argument for one thing: <em>schedule Q2 first, every week, before the urgent
          quadrants steal the time.</em>
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Q3: Urgent + Not Important — &ldquo;Interruption&rdquo;</h3>
        <p>
          Things that feel urgent because someone else made them urgent. Most meetings. Most
          interruptions. Most notifications. A coworker&rsquo;s last-minute &ldquo;quick question.&rdquo; The phone
          ringing during dinner.
        </p>
        <p>
          <strong>The trap:</strong> Q3 feels productive because it&rsquo;s reactive — you finished things!
          But you finished other people&rsquo;s things, not yours. The answer is to delegate, defer, or push
          back. &ldquo;Can this be an email?&rdquo; &ldquo;Can someone else handle it?&rdquo; &ldquo;Can it wait 24 hours?&rdquo;
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Q4: Not Urgent + Not Important — &ldquo;Distraction&rdquo;</h3>
        <p>
          The quadrant of regret. Doomscrolling. Reading the news. Endless tab-switching.
          &ldquo;Productive&rdquo; tasks that don&rsquo;t move you forward (re-organising your inbox folders,
          fiddling with your task system instead of doing tasks).
        </p>
        <p>
          <strong>The fix:</strong> delete, not delay. If a Q4 activity isn&rsquo;t worth doing now, it&rsquo;s
          not worth scheduling later. Cut it.
        </p>
        <PullQuote>
          The goal isn&rsquo;t a perfect quadrant split. The goal is to <em>see</em> what quadrant you&rsquo;re
          actually living in.
        </PullQuote>
      </Section>

      <Section id="when" title="When to use the matrix (and when not to)">
        <p>The matrix earns its keep at three specific moments:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Weekly review.</strong> Spend 15 minutes Sunday or Monday sorting next week&rsquo;s
            tasks into the 4 quadrants. Most people are shocked at how Q3-heavy their default week is.
          </li>
          <li>
            <strong>Overwhelmed moments.</strong> When you have 23 things on your list and zero idea
            where to start, the matrix forces a decision. Pick a Q1 fire or a Q2 growth task. Skip Q3
            and Q4 today.
          </li>
          <li>
            <strong>Decision points.</strong> When someone hands you new work (a request, a meeting
            invite, an &ldquo;urgent&rdquo; task), classify it before agreeing.
          </li>
        </ul>
        <Callout icon="⚠️" title="When the matrix doesn't help">
          For creative or exploratory work (writing a novel, prototyping an idea, deep research), the
          matrix can mislead — most of that work feels &ldquo;not urgent&rdquo; and gets demoted to Q2 forever.
          For those, you need scheduling discipline, not categorisation. See our piece on{' '}
          <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            time blocking
          </Link>{' '}
          for how to actually get Q2 work done.
        </Callout>
      </Section>

      <Section id="how" title="How to actually use it (a 6-step weekly review)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Brain-dump every task</h3>
        <p>
          Write everything competing for your attention next week on paper or a list. Don&rsquo;t edit.
          Don&rsquo;t prioritise yet. Just empty the cache.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Sort each task into a quadrant</h3>
        <p>
          For every task, ask two questions:{' '}
          <em>Will the world end if this isn&rsquo;t done by Friday?</em> (urgency) and{' '}
          <em>Will my life be measurably different in 12 months if I do this?</em> (importance).
          Be honest. Most people overestimate urgency dramatically.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Schedule Q2 first</h3>
        <p>
          This is the entire move. Before you schedule Q1 fires or Q3 meetings, block calendar time for
          Q2 growth work. Health, deep work, planning, learning, relationships. Put them on the
          calendar like meetings with yourself — because that&rsquo;s what they are.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Handle Q1 in real time</h3>
        <p>
          Q1 fires need to be done. But ask: <em>could planning have prevented this?</em> If yes, it
          becomes a Q2 task next week. The volume of Q1 in your life is a lagging indicator of how good
          your Q2 work is.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Delegate or decline Q3</h3>
        <p>
          For each Q3 task: can someone else do it? Can you say no? Can it be batched (handle all of
          tomorrow&rsquo;s Q3 in one 30-minute block)? The goal is to spend &lt;20% of your week here.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Delete Q4 ruthlessly</h3>
        <p>
          Q4 doesn&rsquo;t go on a list at all. It goes in the trash. If you find yourself defending a Q4
          task (&ldquo;but I enjoy scrolling Twitter&rdquo;), that&rsquo;s fine — but call it rest, not work, and put a
          timer on it.
        </p>
      </Section>

      <Section id="why" title="Why most people fail with the matrix (and how to avoid it)">
        <p>
          The matrix is conceptually simple but operationally hard. Three predictable failures:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>They treat &ldquo;urgent&rdquo; and &ldquo;important&rdquo; as equivalent.</strong> Urgency comes
            from external pressure. Importance comes from your goals. They&rsquo;re different axes. Don&rsquo;t
            collapse them.
          </li>
          <li>
            <strong>They underestimate Q2&rsquo;s leverage.</strong> Q2 work — the unsexy, unscheduled,
            no-deadline work — is where compound returns happen. The compound effect (see{' '}
            <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              our deep-dive
            </Link>
            ) is almost entirely a Q2 phenomenon.
          </li>
          <li>
            <strong>They don&rsquo;t do the matrix.</strong> They learn it once. Nod. Move on. The matrix
            only works as a weekly ritual. Once-a-year doesn&rsquo;t cut it.
          </li>
        </ul>
        <PullQuote>
          The most successful people don&rsquo;t spend their week in Q1. They spend it in Q2 — making sure
          Q1 never arrives.
        </PullQuote>

        <Callout icon="📋" title="Your 15-minute weekly review">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Brain-dump everything for next week (5 min).</li>
            <li>Sort each into a quadrant (3 min).</li>
            <li>Block Q2 work on your calendar first (3 min).</li>
            <li>Handle Q1 in real time as it arises.</li>
            <li>Batch / delegate / decline Q3.</li>
            <li>Cut Q4 from the list entirely.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear&rsquo;s goal + habit system is essentially a Q2 forcing function. Your daily habits
          are pure Q2 (important, not urgent). Your goals are decomposed into milestones that you
          schedule in advance. The 12-week consistency heatmap shows whether you&rsquo;re actually showing
          up for Q2 — because most people who think they are, aren&rsquo;t. For the related frameworks, read
          on:{' '}
          <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            time blocking
          </Link>
          ,{' '}
          <Link href="/blog/pareto-principle-80-20-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the 80/20 rule
          </Link>
          , and{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
