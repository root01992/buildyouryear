import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'morning-routine-for-high-performers';
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
        Forget the 5am Club. The actual research on top-performer morning routines is more interesting:
        the rich and famous don&rsquo;t share a wake-up time — they share <strong>five behavioural
        patterns</strong>. Tim Ferriss interviewed over 130 high performers for <em>Tools of Titans</em>
        and found morning routines varied wildly in <em>what</em> people did. They converged on <em>how</em>
        they did it. Here&rsquo;s the evidence-backed playbook.
      </p>

      <Section id="definition" title="Definition: what is a morning routine?">
        <p>
          A <strong>morning routine</strong> is a sequence of intentional actions performed within the
          first hour or two after waking, designed to set the emotional, physical, and cognitive tone for
          the day. Done right, it functions as a behavioural &ldquo;launch sequence&rdquo; — a series of cheap,
          repeatable wins that compound into momentum.
        </p>
        <p>
          The mistake most articles make is treating the morning routine as a <em>schedule</em>{' '}
          (&ldquo;5:00am wake, 5:10am ice bath, 5:30am journal&rdquo;). The schedule is downstream of the
          purpose. The actual purpose is:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>To make your first decisions of the day <strong>identity-confirming</strong>, not energy-draining.</li>
          <li>To install <strong>controllable wins</strong> before the day starts attacking your plans.</li>
          <li>To <strong>protect deep work</strong> from the inbox/Slack/news triple-tap.</li>
        </ul>
      </Section>

      <Section id="what" title="What top performers actually share (the 5 patterns)">
        <p>
          Across studies and biographies — Tim Ferriss, Hal Elrod&rsquo;s <em>Miracle Morning</em>, Laura
          Vanderkam&rsquo;s time-use research — five patterns appear in 80%+ of high-performer morning
          routines:
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. They start the day with movement</h3>
        <p>
          Not necessarily a workout. Even 5 minutes of walking, stretching, or yoga.
          Movement raises core temperature, releases noradrenaline (alertness chemistry), and signals
          to the brain &ldquo;the day has begun.&rdquo; A 2019 University of Hertfordshire study found that just
          10 minutes of morning movement produced measurable mood and focus improvements lasting until
          early afternoon.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. They protect the first hour from inputs</h3>
        <p>
          Phone in the other room. Email, news, social media — all delayed by at least 60 minutes.
          The reason isn&rsquo;t mystical. It&rsquo;s neurological: the first hour after waking is when your
          prefrontal cortex is most receptive to setting <em>your</em> intentions, before it gets
          hijacked by <em>other people&rsquo;s</em> agendas.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. They do one cognitively demanding thing early</h3>
        <p>
          Writing, planning, reading, deep thinking, meditation. Something that requires intentional
          attention. Top performers know their best cognitive hours are 1–4 hours after waking
          (corroborated by chronobiology research) and they refuse to spend that window answering
          emails.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. They make the routine identity-confirming</h3>
        <p>
          Every step of the routine is a small vote for who they&rsquo;re becoming. A writer writes 200
          words. A runner ties their shoes. A leader reviews the day&rsquo;s priorities. The routine isn&rsquo;t
          about being productive; it&rsquo;s about being the person who shows up.{' '}
          <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            See our deep-dive on identity-based habits
          </Link>{' '}
          for why this matters.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. They keep it short and replicable</h3>
        <p>
          The average high-performer morning routine takes <strong>45-75 minutes</strong>, not 3 hours.
          Anything longer and travel/illness/kids/winter mornings will kill it. The most durable
          routines are designed for the bad day, not the perfect one.
        </p>
        <PullQuote>
          The best morning routine is the one you&rsquo;ll still do on the day you don&rsquo;t feel like it.
        </PullQuote>

        {/* Time allocation chart */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            A high-performer 60-minute morning (typical allocation)
          </div>
          <svg viewBox="0 0 360 130" className="h-32 w-full">
            {[
              { label: 'Wake + water', pct: 5, color: '#a78bfa', x: 40 },
              { label: 'Movement', pct: 15, color: '#34d399', x: 0 },
              { label: 'Mindful (meditation / journaling)', pct: 15, color: '#60a5fa', x: 0 },
              { label: 'Deep work / writing / reading', pct: 35, color: '#f59e0b', x: 0 },
              { label: 'Breakfast + plan day', pct: 30, color: '#fb7185', x: 0 },
            ].reduce(
              (acc, seg) => {
                const w = (seg.pct / 100) * 280;
                acc.bars.push(
                  <g key={seg.label}>
                    <rect x={acc.x} y={40} width={w} height={28} fill={seg.color} rx="3" />
                    <text x={acc.x + w / 2} y={58} fontSize="9.5" fontWeight="700" fill="white" textAnchor="middle">
                      {seg.pct}%
                    </text>
                  </g>,
                );
                acc.labels.push(
                  <g key={seg.label + '-l'}>
                    <rect x="40" y={84 + acc.lblIdx * 9} width="8" height="6" fill={seg.color} />
                    <text x="52" y={89.5 + acc.lblIdx * 9} fontSize="9.5" fill="#52525b">
                      {seg.label} — {seg.pct}%
                    </text>
                  </g>,
                );
                acc.lblIdx += 1;
                acc.x += w;
                return acc;
              },
              { bars: [] as React.ReactNode[], labels: [] as React.ReactNode[], x: 40, lblIdx: 0 },
            ).bars}
            {/* Need second render for labels */}
            <g>
              <rect x="40" y="84" width="8" height="6" fill="#a78bfa" />
              <text x="52" y="89.5" fontSize="9.5" fill="#52525b">Wake + water (5%)</text>
              <rect x="40" y="93" width="8" height="6" fill="#34d399" />
              <text x="52" y="98.5" fontSize="9.5" fill="#52525b">Movement (15%)</text>
              <rect x="40" y="102" width="8" height="6" fill="#60a5fa" />
              <text x="52" y="107.5" fontSize="9.5" fill="#52525b">Mindful (meditation / journaling) — 15%</text>
              <rect x="200" y="93" width="8" height="6" fill="#f59e0b" />
              <text x="212" y="98.5" fontSize="9.5" fill="#52525b">Deep work / reading — 35%</text>
              <rect x="200" y="102" width="8" height="6" fill="#fb7185" />
              <text x="212" y="107.5" fontSize="9.5" fill="#52525b">Breakfast + plan — 30%</text>
            </g>
            <text x="40" y="32" fontSize="10" fill="#52525b" fontWeight="600">Time (60 minutes total)</text>
            <line x1="40" y1="70" x2="320" y2="70" stroke="#e4e4e7" />
          </svg>
        </div>
      </Section>

      <Section id="when" title="When to start (and the wake-up-time fallacy)">
        <p>
          You don&rsquo;t need to wake up at 5am. You need to wake up{' '}
          <strong>at least 60–90 minutes before your first commitment</strong>. For a 9am job, that&rsquo;s
          a 7am wake-up. For a parent dropping kids at 8am, that might be a 5:30am wake-up. The hour
          doesn&rsquo;t matter; the buffer does.
        </p>
        <p>The actual right time is determined by three constraints, in order:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Sleep duration.</strong> Most adults need 7–9 hours. Choose bedtime first, wake-up follows.</li>
          <li><strong>First commitment.</strong> Subtract 60–90 minutes from your earliest required activity.</li>
          <li><strong>Chronotype.</strong> If you&rsquo;re a genuine night owl (about 20% of people), forcing a 5am wake-up will tank your sleep quality and cognitive output. Adapt.</li>
        </ul>
        <Callout icon="🌙" title="The bedtime is more important than the wake-up">
          A 6am wake-up after 6 hours of sleep is worse than an 8am wake-up after 8. The high-performer
          secret isn&rsquo;t the early alarm — it&rsquo;s the disciplined bedtime that makes the early alarm
          sustainable.
        </Callout>
      </Section>

      <Section id="how" title="How to design your morning routine (a 5-step template)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Pick your wake-up time backwards</h3>
        <p>
          Identify your first daily commitment. Subtract 60-90 minutes. That&rsquo;s your wake-up. Now
          subtract 7-9 hours from that. That&rsquo;s your bedtime. Both numbers are non-negotiable for at
          least 30 days.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Stack one habit from each of the 5 pillars</h3>
        <p>Use the 5 patterns above as slots. Fill each one with something tiny:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Movement:</strong> 5-min walk OR 10 push-ups OR 5-min stretch</li>
          <li><strong>Input-free hour:</strong> phone stays out of bedroom until 8am</li>
          <li><strong>Cognitive task:</strong> 15-min reading OR 200 words written OR 10-min meditation</li>
          <li><strong>Identity vote:</strong> one act that signals who you&rsquo;re becoming</li>
          <li><strong>Total time:</strong> aim for 30-60 min; bad-day version under 15 min</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Stack onto an existing anchor</h3>
        <p>
          Use the habit-stacking format we covered in our piece on{' '}
          <Link href="/blog/how-to-build-habits-that-stick" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            building habits that stick
          </Link>
          :{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[12.5px] font-mono">
            After [waking up], I will [drink a glass of water and start the kettle]
          </code>
          . The existing &ldquo;wake up&rdquo; trigger chains to the new behaviour.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Prepare the night before</h3>
        <p>
          The single highest-leverage morning routine optimisation is the night before. Lay out clothes.
          Pre-fill the kettle. Open the book to the right page. Write tomorrow&rsquo;s top 3 priorities
          on paper. Friction at 6am defeats willpower in 90% of cases.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Track it for 30 days</h3>
        <p>
          A simple streak chart on the fridge or in a tracker like BuildYourYear is enough. The point
          isn&rsquo;t to track perfectly; it&rsquo;s to <em>see</em> the consistency pattern. Most morning
          routines die in week 2 because they&rsquo;re invisible. Make them visible and they survive.
        </p>
      </Section>

      <Section id="why" title="Why this works (the science of the first hour)">
        <p>
          Three forces make morning routines disproportionately powerful compared to evening or midday
          routines:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Cortisol awakening response.</strong> Cortisol — the alertness hormone — peaks
            roughly 30–45 minutes after waking. Using that natural focus window for cognitive work
            (instead of email) is the highest-ROI 60 minutes most people have all day.
          </li>
          <li>
            <strong>Decision-quality decay.</strong> Studies on decision fatigue (Roy Baumeister, Jean
            Twenge) show that decision quality declines through the day. The first hour is when you have
            the most decisions left in the tank — spend them on yourself.
          </li>
          <li>
            <strong>The day-shape principle.</strong> A 2018 University of California study found that
            people who started the day with even one small intentional behaviour reported 23% higher
            life satisfaction and 17% higher productivity than control. The first action sets the day&rsquo;s
            tone — for better or worse.
          </li>
        </ul>
        <PullQuote>
          You don&rsquo;t need a 4-hour Miracle Morning. You need 30 minutes that prove to you, every day,
          that you can keep promises to yourself.
        </PullQuote>

        <Callout icon="📋" title="Your 30-second template">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Wake up 60-90 minutes before first commitment.</li>
            <li>Phone stays out of bedroom for the first hour.</li>
            <li>Glass of water + 5 minutes of movement.</li>
            <li>One cognitively demanding thing (read, write, plan).</li>
            <li>Top 3 priorities for the day, written down.</li>
            <li>Track it for 30 days. Adjust then.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear&rsquo;s habit module is designed for exactly this stack. Create 3-5 morning habits
          (water, movement, read, journal, plan) and the dashboard will show your streak + a 12-week
          heatmap so you can see the routine taking shape over time. By month 3, the routine becomes
          identity, not effort. That&rsquo;s when the rest of the year gets easier — because the day starts
          with you already winning.
        </p>
      </Section>
    </BlogLayout>
  );
}
