import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'parkinsons-law-deadline-leverage';
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
        In 1955, British historian C. Northcote Parkinson wrote a satirical essay for{' '}
        <em>The Economist</em> with one immortal observation:{' '}
        <strong>&ldquo;Work expands so as to fill the time available for its completion.&rdquo;</strong> 70
        years later, it&rsquo;s the most-quoted rule in productivity — because it&rsquo;s relentlessly true. Give
        yourself a week, the task takes a week. Give yourself 2 hours, often the same task gets done
        in 2 hours. Here&rsquo;s the psychology, when it works for you, and the{' '}
        <AnimatedCounter end={4} className="text-emerald-700 font-bold" /> ways to weaponise it.
      </p>

      <Section id="definition" title="Definition: what is Parkinson's Law?">
        <p>
          <strong>Parkinson&rsquo;s Law:</strong> Work expands to fill the time available for its
          completion. Originally about British civil-service bureaucracy. Now applied to virtually
          every project, task, meeting, and email a knowledge worker handles.
        </p>
        <p>The law has two distinct consequences worth separating:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Time-fill:</strong> tasks consume whatever time you allocate, regardless of true required effort.</li>
          <li><strong>Complexity-bloat:</strong> projects with long timelines accumulate scope, edge cases, and polish until they fill the time too.</li>
        </ul>
        <p>
          Both are subtypes of the same underlying behaviour: humans don&rsquo;t calibrate work to actual
          required effort — they calibrate it to available time. Give us more, we use more. Give us
          less, we adapt.
        </p>
        <PullQuote>
          You don&rsquo;t have a productivity problem. You have a constraint problem. Parkinson&rsquo;s Law
          says: shorten the constraint, watch the output appear.
        </PullQuote>
      </Section>

      <Section id="what" title="What's actually happening psychologically">
        <p>Three converging behavioural mechanisms make the law play out:</p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Planning fallacy + procrastination</h3>
        <p>
          Daniel Kahneman&rsquo;s research showed humans systematically underestimate how long tasks take
          AND overestimate their future motivation. With a long deadline, we use the early days as
          slack (&ldquo;I&rsquo;ll really focus next week&rdquo;) — then compress all the work into the final stretch.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Scope inflation</h3>
        <p>
          A long deadline invites &ldquo;just one more&rdquo; additions: more research, one more review pass,
          another stakeholder, a nicer slide. Each addition feels small; together they fill all
          available time.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Salience of distant deadlines</h3>
        <p>
          A deadline 6 weeks out doesn&rsquo;t feel real. Your limbic system treats it the same as
          &ldquo;eventually.&rdquo; Only when the deadline crosses the salience threshold (typically 48-72 hours
          out) does the body actually mobilise.
        </p>

        {/* Effort distribution chart */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Effort distribution: long deadline vs short deadline (same task)
          </div>
          <svg viewBox="0 0 360 180" className="h-44 w-full">
            <text x="40" y="14" fontSize="10" fill="#52525b" fontWeight="700">Long deadline (2 weeks)</text>
            <line x1="40" y1="55" x2="340" y2="55" stroke="#e4e4e7" />
            {/* Long: small effort early, huge spike at end */}
            <path
              d="M 40 50 L 80 48 L 130 50 L 180 48 L 220 45 L 260 40 L 290 25 L 320 8 L 340 15"
              fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round"
            />
            <text x="335" y="22" fontSize="9" fill="#be123c" textAnchor="end" fontWeight="700">last-minute spike</text>

            <text x="40" y="100" fontSize="10" fill="#52525b" fontWeight="700">Short deadline (2 days)</text>
            <line x1="40" y1="145" x2="340" y2="145" stroke="#e4e4e7" />
            {/* Short: even, focused effort */}
            <path
              d="M 40 130 L 80 100 L 130 95 L 180 92 L 220 95 L 260 100 L 300 110 L 340 130"
              fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round"
            />
            <text x="190" y="85" fontSize="9" fill="#047857" textAnchor="middle" fontWeight="700">sustained focus</text>

            <text x="190" y="170" fontSize="9" fill="#52525b" textAnchor="middle">Both produce comparable output. The long deadline costs 10x the calendar time.</text>
          </svg>
        </div>
      </Section>

      <Section id="when" title="When Parkinson's Law works against you (and when it works for you)">
        <p>Against you in the typical cases:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Long projects.</strong> A 6-month project becomes a 6-month project, period — even if 4 weeks of real work is involved.</li>
          <li><strong>Meetings.</strong> A 60-minute meeting fills 60 minutes. The same agenda in 25 minutes would finish in 25.</li>
          <li><strong>Email.</strong> &ldquo;Open inbox for 30 minutes&rdquo; → 30 minutes consumed. &ldquo;Open inbox until 11:00am&rdquo; → finished at 11:00am.</li>
          <li><strong>Side projects.</strong> &ldquo;Some day&rdquo; means never; &ldquo;by Sunday&rdquo; means Sunday.</li>
        </ul>
        <p>For you — when you weaponise it:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Self-imposed deadlines</strong> shorter than realistic create the same urgency as crisis mode, without the crisis.</li>
          <li><strong>Timeboxed creative work</strong> — &ldquo;write for 45 minutes&rdquo; consistently produces more than &ldquo;write until done.&rdquo;</li>
          <li><strong>Decision-making</strong> — &ldquo;decide in 5 minutes&rdquo; usually produces a 95%-quality decision in 5 minutes vs a 100% decision in 3 weeks.</li>
        </ul>
        <Callout icon="⚠️" title="The exception">
          Parkinson&rsquo;s Law breaks down for genuinely complex creative or research work where the
          quality plateau is far from instantaneous. A novel takes a year because it takes a year —
          shortening to a week produces a worse novel. Use compression on tasks with diminishing
          returns, not exploratory ones.
        </Callout>
      </Section>

      <Section id="how" title="How to weaponise Parkinson's Law (4 techniques)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Aggressive self-imposed deadlines</h3>
        <p>
          For any task: estimate how long it would honestly take. Cut that in half. Commit to the
          shorter time before starting. Most tasks complete inside the compressed window because the
          constraint forces ruthless prioritisation of what actually matters.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Timeboxed work blocks</h3>
        <p>
          Block calendar time for the task with a hard stop. &ldquo;Work on the report from 9-10:30am.&rdquo; At
          10:30, stop — even if it&rsquo;s not finished. You&rsquo;ll be shocked at how often it IS finished. See
          our piece on{' '}
          <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            time blocking
          </Link>
          .
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Public commitment</h3>
        <p>
          Tell someone what you&rsquo;ll deliver and when. The external accountability moves the deadline
          from &ldquo;flexible if I want&rdquo; to &ldquo;costly to miss.&rdquo; Loss aversion does the rest. Tell a friend,
          a partner, your team — anyone whose disappointment you&rsquo;d genuinely feel.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. The 12-Week Year</h3>
        <p>
          The whole framework of the{' '}
          <Link href="/blog/12-week-year-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            12-Week Year
          </Link>{' '}
          is essentially industrial-strength Parkinson&rsquo;s Law applied to annual planning. Compress
          12 months into 12 weeks → output rises 3-4x for most people. Same goals, different constraint.
        </p>

        <ComparisonTable
          headers={['Original time', 'Weaponised time', 'Typical compression']}
          rows={[
            ['1-hour meeting', '25-min stand-up', '58% time recovered'],
            ['2-week project', '3-day sprint', '78% time recovered'],
            ['1-month essay', '1-week essay', '75% time recovered'],
            ['Annual goal', '12-week cycle', '77% time recovered'],
            ['Email session: "for a while"', 'Email until 10am', '~50% time recovered'],
          ]}
        />
      </Section>

      <Section id="why" title="Why this works (and the trap to avoid)">
        <p>The law works because it bypasses your motivation engine entirely:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Constraint forces clarity.</strong> A short deadline is a forcing function. You
            can&rsquo;t do everything in 25 minutes; you have to decide what actually matters. The
            compression makes the prioritisation automatic.
          </li>
          <li>
            <strong>It defeats Parkinson&rsquo;s own corollary.</strong> If work expands to fill time, it
            also <em>contracts</em> to fit time. The same task you couldn&rsquo;t finish in a month often
            fits a single afternoon when there&rsquo;s no other option.
          </li>
          <li>
            <strong>It transfers willpower to the timer.</strong> Once you&rsquo;ve committed to the
            constraint, you don&rsquo;t need to keep deciding to focus — the deadline does the deciding.
          </li>
        </ul>
        <PullQuote>
          The most productive people don&rsquo;t have more time. They have shorter deadlines.
        </PullQuote>

        <Callout icon="⚠️" title="The over-compression trap">
          Aggressive deadlines applied recklessly produce sloppy work and burnout. The right framing:
          compress to the duration where 95% of the value can be captured, not to the duration where
          you barely survive. The Pareto-y truth — 80% of the value usually lives in 30-40% of the
          time. Compress to that, not below.
        </Callout>

        <Callout icon="📋" title="Your week-1 Parkinson's experiment">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Pick one recurring task that &ldquo;always takes a while.&rdquo;</li>
            <li>Estimate honestly. Cut the time in half.</li>
            <li>Block calendar time for the compressed duration.</li>
            <li>Commit publicly to delivery at that time.</li>
            <li>Stop when the timer ends — done or not.</li>
            <li>Audit: did you actually finish? Most people do. The remaining 10% usually wasn&rsquo;t needed.</li>
          </ol>
        </Callout>

        <p>
          Parkinson&rsquo;s Law pairs perfectly with everything else in the productivity stack: the{' '}
          <Link href="/blog/pomodoro-technique-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            Pomodoro Technique
          </Link>{' '}
          is 25-minute Parkinson; the{' '}
          <Link href="/blog/12-week-year-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            12-Week Year
          </Link>{' '}
          is annual Parkinson; the{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            two-minute rule
          </Link>{' '}
          is microscale Parkinson. They all weaponise the same insight: constraints are a feature, not
          a bug.
        </p>
      </Section>
    </BlogLayout>
  );
}
