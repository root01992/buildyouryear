import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'decision-fatigue';
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
        In 2011, Columbia researchers studied{' '}
        <AnimatedCounter end={1112} className="font-bold text-emerald-700" /> parole decisions made by
        Israeli judges. At <strong>9am</strong>, judges granted parole <AnimatedCounter end={65} suffix="%" className="font-bold text-emerald-700" />{' '}
        of the time. By <strong>late afternoon</strong>, the same judges granted parole{' '}
        <strong className="text-rose-600">almost 0%</strong>. Same judges. Same cases. Different
        answer. The culprit: <strong>decision fatigue</strong>. Every choice you make depletes a
        finite resource — and at the end of the day, even smart people make bad calls.
      </p>

      <Section id="definition" title="Definition: what is decision fatigue?">
        <p>
          <strong>Decision fatigue</strong> is the deterioration in decision quality that occurs after
          a long session of making choices. Coined by social psychologist Roy Baumeister, the concept
          captures a structural truth about cognition: the brain&rsquo;s self-control and judgment systems
          run on a metabolic budget that depletes with use.
        </p>
        <p>
          The mechanism — though some specifics of Baumeister&rsquo;s original ego-depletion theory have
          faced replication challenges — converges on three observations that have held up across many
          studies:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Sustained decision-making measurably degrades subsequent decision quality.</li>
          <li>People default to easier (often worse) options when fatigued.</li>
          <li>The effect is reduced by glucose intake, breaks, and removing trivial choices.</li>
        </ul>
        <PullQuote>
          The best decision you make all day is the first one. The worst is usually the last.
        </PullQuote>
      </Section>

      <Section id="what" title="What happens to your brain across a day">

        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Decision quality degrades through the day (typical pattern)
          </div>
          <svg viewBox="0 0 360 170" className="h-40 w-full">
            <defs>
              <linearGradient id="decisionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="40" y1="140" x2="340" y2="140" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#d4d4d8" />
            <path
              d="M 40 35 Q 100 38, 140 50 T 220 90 Q 250 100, 280 115 T 340 130"
              fill="url(#decisionFill)" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round"
            />
            {/* Markers */}
            <circle cx="60" cy="38" r="3.5" fill="#10b981" />
            <text x="60" y="25" fontSize="9.5" fill="#047857" textAnchor="middle" fontWeight="700">peak</text>
            <circle cx="180" cy="73" r="3.5" fill="#f59e0b" />
            <text x="180" y="60" fontSize="9.5" fill="#92400e" textAnchor="middle" fontWeight="700">mid-day drop</text>
            <circle cx="320" cy="125" r="3.5" fill="#f43f5e" />
            <text x="320" y="115" fontSize="9.5" fill="#be123c" textAnchor="middle" fontWeight="700">depleted</text>
            {['6am', '9am', '12pm', '3pm', '6pm', '9pm'].map((t, i) => (
              <text key={t} x={40 + i * 60} y="158" fontSize="9.5" fill="#52525b" textAnchor="middle">{t}</text>
            ))}
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            The drop isn&rsquo;t a slow decline — it&rsquo;s a measurable cliff around the late-afternoon /
            early-evening window when most poor decisions cluster.
          </div>
        </div>

        <p>The fatigue shows up as three predictable behaviour patterns:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Decision avoidance.</strong> &ldquo;Let&rsquo;s decide tomorrow.&rdquo; The brain defers rather than choose.</li>
          <li><strong>Defaulting to the status quo.</strong> &ldquo;Whatever you want&rdquo; / &ldquo;the usual.&rdquo; Familiar choice wins because deliberation has run out.</li>
          <li><strong>Impulse spending / comfort behaviour.</strong> Late-night shopping, snacking, doomscrolling — all classic decision-fatigue tells.</li>
        </ul>
      </Section>

      <Section id="when" title="When you're most vulnerable (and the high-stakes mistake)">
        <p>Decision fatigue hits hardest at 3 specific times:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>End of the workday.</strong> 5-7pm window — most people&rsquo;s worst decision quality.</li>
          <li><strong>After hard creative or strategic work.</strong> 2-3 hours of cognitive work depletes a different system than physical work.</li>
          <li><strong>When sleep-deprived.</strong> One night of poor sleep degrades decision quality more than a long workday.</li>
        </ul>
        <Callout icon="⚠️" title="The high-stakes mistake">
          Most people <em>schedule</em> their most important personal decisions for late evening —
          financial choices, relationship conversations, career planning. These are decisions worth
          delaying to a morning slot where your prefrontal cortex is rested. Big decisions belong to
          your <strong>9-11am window</strong>, not your 9-11pm one.
        </Callout>
      </Section>

      <Section id="how" title="How to design a low-decision-fatigue life (7 practices)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Move important decisions to the morning</h3>
        <p>
          Schedule big calls — career decisions, financial choices, hiring, fires, important
          conversations — to your 9-11am window. Treat the morning as a high-stakes decision zone.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Eliminate trivial choices</h3>
        <p>
          Steve Jobs wore the same outfit. Obama wore only blue/grey suits. Both cited the same reason:
          conserving decision capacity for important things. You don&rsquo;t need to imitate the wardrobe —
          but you can automate breakfast, commute, default workout, default lunch.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Pre-decide the night before</h3>
        <p>
          Write down tomorrow&rsquo;s top 3 priorities BEFORE you sleep. The morning then becomes pure
          execution, not choosing. See our piece on{' '}
          <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            time blocking
          </Link>{' '}
          for the planning ritual.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Batch similar decisions</h3>
        <p>
          Process all email at once. Decide weekly groceries in one sitting. Run financial check-ins
          monthly. The cognitive cost of context-switching between decision categories is roughly 30%
          per switch — batching is the cure.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Eat and rest strategically</h3>
        <p>
          Glucose dips correlate with decision-quality dips. A real lunch (protein + complex carbs)
          before the afternoon decision block helps. A 10-minute walk between blocks restores capacity
          better than scrolling does.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Build &ldquo;if X then Y&rdquo; default rules</h3>
        <p>
          For recurring decisions, replace deliberation with rules. &ldquo;If it&rsquo;s under $50 and useful,
          buy it without asking again.&rdquo; &ldquo;If a meeting has no agenda, decline.&rdquo; &ldquo;If I haven&rsquo;t opened
          this subscription in 60 days, cancel.&rdquo; Rules conserve the deciding-capacity for the things
          that genuinely need it.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">7. Sleep is the only real reset</h3>
        <p>
          Decision fatigue doesn&rsquo;t fully recover from a short break — it recovers from sleep. If you
          face a critical decision and you&rsquo;re depleted, the right answer is almost always: <em>wait
          until morning</em>.
        </p>
      </Section>

      <Section id="why" title="Why this matters more than any single decision">
        <p>
          The compounding cost of late-day bad decisions across a year is staggering. Three reasons
          this is the most underrated productivity lever:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Each decision is small; the pattern is huge.</strong> One bad late-night purchase
            is nothing. 50 of them per year, every year, for a decade, shape your finances. Same with
            relationships, career choices, health.
          </li>
          <li>
            <strong>It explains why you &ldquo;can&rsquo;t stick to plans.&rdquo;</strong> Most plans are made in the
            morning (high capacity) and executed in the evening (low capacity). The gap between
            morning self and evening self is bigger than people think.
          </li>
          <li>
            <strong>It compounds across days.</strong> A late-evening bad decision (impulse food / late
            sleep / doom-scroll) degrades the next morning&rsquo;s capacity. The fatigue effect chains
            forward.
          </li>
        </ul>
        <PullQuote>
          You don&rsquo;t need to make better decisions. You need to make important decisions when your
          brain is actually fresh.
        </PullQuote>

        <Callout icon="📋" title="Your 5-step audit (today)">
          <ol className="list-decimal space-y-1 pl-5">
            <li>List your top 3 most important recurring decisions. Move them to your 9-11am window.</li>
            <li>Eliminate one trivial decision — automate breakfast, outfit, or commute choice.</li>
            <li>Tonight: write tomorrow&rsquo;s top 3 priorities before sleep.</li>
            <li>Batch one decision category — email, groceries, household.</li>
            <li>Add one default rule: &ldquo;If X, then Y&rdquo; — for a recurring small choice.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear&rsquo;s system is designed to take decisions OFF your plate: habits run on
          autopilot once installed, the year&rsquo;s 3 goals are pre-decided, the daily quick-add chips
          remove choice friction, and the 6-month plan presets your habits and goals in one click.
          The dashboard&rsquo;s job isn&rsquo;t to give you more to decide — it&rsquo;s to remove decisions so the few
          that remain are high-capacity ones.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/morning-routine-for-high-performers" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            morning routine
          </Link>
          ,{' '}
          <Link href="/blog/energy-management-vs-time-management" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            energy management vs time management
          </Link>
          , and{' '}
          <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            time blocking
          </Link>{' '}
          (a pre-decided calendar is the antidote to in-the-moment decision fatigue).
        </p>
      </Section>
    </BlogLayout>
  );
}
