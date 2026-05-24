import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'why-new-year-resolutions-fail';
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

  // Drop-off curve: 100% on day 0, ~92% gone by Feb 17 (day 48), and a long tail down to ~8%.
  const curve = [
    { d: 0, p: 100 },
    { d: 7, p: 78 },
    { d: 14, p: 60 },
    { d: 21, p: 46 },
    { d: 30, p: 32 },
    { d: 45, p: 18 },
    { d: 48, p: 12 },
    { d: 90, p: 9 },
    { d: 180, p: 8 },
    { d: 365, p: 8 },
  ];
  const xFor = (d: number) => 40 + (d / 365) * 290;
  const yFor = (p: number) => 30 + (1 - p / 100) * 140;
  const curvePath = curve.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xFor(pt.d).toFixed(2)} ${yFor(pt.p).toFixed(2)}`).join(' ');

  return (
    <BlogLayout post={post} related={related}>
      <p className="text-[17px] font-semibold leading-snug text-zinc-800">
        Every January, ~40% of adults set a New Year&rsquo;s resolution. By February 17th, only ~8% of those
        people are still going. That date — sometimes called &ldquo;Quitter&rsquo;s Day&rdquo; — isn&rsquo;t a willpower
        failure. It&rsquo;s a system failure. Resolutions don&rsquo;t collapse because people are weak. They
        collapse because the design is wrong. Here are the 6 predictable failure modes — and the fixes
        that take resolutions from January aspirations to December wins.
      </p>

      <Section id="definition" title="Definition: what is a New Year's resolution?">
        <p>
          A <strong>New Year&rsquo;s resolution</strong> is a goal or commitment set at the beginning of a new
          calendar year, typically taking advantage of the &ldquo;fresh start&rdquo; psychological effect (Dai,
          Milkman &amp; Riis, 2014). The fresh-start moment briefly boosts motivation — January 1st sees
          a measurable <strong>+82% spike</strong> in goal-related search activity, gym signups, and
          self-improvement intentions.
        </p>
        <p>
          The problem isn&rsquo;t the spike. The problem is what happens 6-8 weeks later, when the spike
          dissipates and the goal has to survive on its own design merits. That&rsquo;s where most
          resolutions die — and the date is statistically predictable.
        </p>

        {/* Drop-off curve */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            % of resolution-setters still adhering, by day of the year
          </div>
          <svg viewBox="0 0 360 200" className="h-44 w-full">
            <defs>
              <linearGradient id="dropFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* axes */}
            <line x1="40" y1="170" x2="340" y2="170" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#d4d4d8" />
            {/* y labels */}
            {[100, 75, 50, 25, 0].map((p) => (
              <g key={p}>
                <line x1="38" y1={yFor(p)} x2="40" y2={yFor(p)} stroke="#a1a1aa" />
                <text x="34" y={yFor(p) + 3} fontSize="9" fill="#71717a" textAnchor="end">{p}%</text>
              </g>
            ))}
            {/* x labels */}
            {[
              { d: 0, l: 'Jan 1' },
              { d: 48, l: 'Feb 17' },
              { d: 90, l: 'Apr' },
              { d: 180, l: 'Jul' },
              { d: 365, l: 'Dec 31' },
            ].map((m) => (
              <g key={m.l}>
                <line x1={xFor(m.d)} y1="170" x2={xFor(m.d)} y2="173" stroke="#a1a1aa" />
                <text x={xFor(m.d)} y="185" fontSize="9.5" fill="#52525b" textAnchor="middle" fontWeight="600">{m.l}</text>
              </g>
            ))}
            {/* fill */}
            <path d={`${curvePath} L ${xFor(365)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`} fill="url(#dropFill)" />
            {/* line */}
            <path d={curvePath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Quitter's day marker */}
            <line x1={xFor(48)} y1={yFor(12)} x2={xFor(48)} y2={yFor(0)} stroke="#be123c" strokeDasharray="3 3" />
            <text x={xFor(48) + 4} y={yFor(12) - 3} fontSize="10" fill="#be123c" fontWeight="800">Quitter&rsquo;s Day · 12%</text>
            {/* Endpoint marker */}
            <circle cx={xFor(365)} cy={yFor(8)} r="3.5" fill="#f43f5e" />
            <text x={xFor(365) - 4} y={yFor(8) - 5} fontSize="10" fill="#be123c" fontWeight="800" textAnchor="end">~8% still going</text>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            Sources: Strava (2019, &ldquo;Quitter&rsquo;s Day&rdquo;), University of Scranton (2002), Statistic Brain.
            Exact numbers vary; the shape doesn&rsquo;t.
          </div>
        </div>
      </Section>

      <Section id="what" title="What actually goes wrong (the 6 failure modes)">
        <p>
          Failures cluster predictably. In behavioural research and our own audit of failed resolutions,
          six patterns explain the overwhelming majority of dropouts:
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. The goal is too vague</h3>
        <p>
          &ldquo;Get healthier.&rdquo; &ldquo;Read more.&rdquo; &ldquo;Be a better person.&rdquo; These aren&rsquo;t goals; they&rsquo;re moods.
          Vague resolutions have no success criteria — which means there&rsquo;s no satisfaction in progress
          and no way to know if you&rsquo;re winning. The brain treats unmeasurable goals as optional.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. There&rsquo;s no system, only intention</h3>
        <p>
          &ldquo;Run more&rdquo; is an intention. &ldquo;Run every Monday/Wednesday/Friday at 7am from my house, 3km
          loop&rdquo; is a system. James Clear&rsquo;s line — <em>you don&rsquo;t rise to the level of your goals, you
          fall to the level of your systems</em> — is the single most quoted sentence in this field for a
          reason. Without a system, motivation is the only fuel. Motivation runs out by mid-February.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. The goal is outcome-based, not identity-based</h3>
        <p>
          &ldquo;Lose 10 kg&rdquo; is an outcome. The scale decides. &ldquo;Become someone who lifts weights 3 times a
          week&rdquo; is an identity. <em>You</em> decide, every day. Identity-based resolutions stick because
          every action is a small confirmation of who you are. Outcome-based resolutions wobble because
          progress is intermittent and demoralising.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. The bar is set on day 1, not day 30</h3>
        <p>
          On January 1st, motivation is artificially high. People design their resolution for that
          person — &ldquo;workout 6 days a week!&rdquo; &ldquo;wake up at 5am every day!&rdquo; — instead of for the
          version of themselves who&rsquo;ll show up on a rainy Tuesday in late February. The right design
          target is the day-30 self: tired, busy, slightly bored. If the resolution doesn&rsquo;t survive
          that day, it won&rsquo;t survive day 60.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. There&rsquo;s no failure protocol</h3>
        <p>
          The single best predictor of long-term success isn&rsquo;t adherence on good days — it&rsquo;s how you
          recover from bad days. Most resolutions have no plan for missing a day. So one miss feels
          like total failure (&ldquo;I&rsquo;ve already broken it&rdquo;) and the resolution collapses. A pre-decided
          failure protocol (&ldquo;never miss twice in a row&rdquo;, &ldquo;skip Sundays&rdquo;, &ldquo;minimum-viable version on
          bad days&rdquo;) absorbs the inevitable misses without psychological damage.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. The goal is tracked publicly, but no one&rsquo;s actually accountable</h3>
        <p>
          Telling Instagram about your resolution gives you a small dopamine hit (&ldquo;social progress&rdquo;)
          that the brain confuses with actual progress — a phenomenon Derek Sivers covered in his TED
          talk: <em>announcing your plans can make you less likely to do them</em>. Public broadcasting
          ≠ accountability. Real accountability is structural: a buddy, a coach, a tracker, a deadline
          with stakes.
        </p>
      </Section>

      <Section id="when" title="When resolutions actually work (the 8%)">
        <p>
          The 8% who succeed share remarkably consistent patterns. Here&rsquo;s what they actually do
          differently:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>They set 1 goal, not 5.</strong> The 5-resolution New Year&rsquo;s list is the most reliable
            way to ship zero of them. Focus is the cheat code.
          </li>
          <li>
            <strong>They define the system, not the outcome.</strong> &ldquo;Walk 7,000 steps daily&rdquo; not
            &ldquo;lose 10 kg.&rdquo;
          </li>
          <li>
            <strong>They start at a sustainable floor.</strong> Day 1 looks identical to day 90 in their
            plan. No heroic-effort phase.
          </li>
          <li>
            <strong>They track visibly.</strong> A streak, a heatmap, a checklist on the fridge. (See our
            piece on{' '}
            <Link href="/blog/habit-tracking-streaks-heatmaps" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              why streaks and heatmaps work
            </Link>{' '}
            for the mechanism.)
          </li>
          <li>
            <strong>They review weekly.</strong> Most resolutions fail in silence. Weekly review catches
            drift before it becomes collapse.
          </li>
          <li>
            <strong>They have a pre-decided recovery rule.</strong> Miss one day, never miss two.
          </li>
        </ul>
        <PullQuote>
          The 8% don&rsquo;t have more discipline. They have less ambition on day 1 and more system by day 30.
        </PullQuote>
      </Section>

      <Section id="how" title="How to redesign your resolution (a 15-minute exercise)">
        <p>
          Whether you&rsquo;re reading this in December (planning) or June (rescuing a fading goal), the same
          exercise applies. Take 15 minutes. Answer 6 questions on paper.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. What identity am I building?</h3>
        <p>
          Reframe the goal as a person, not an outcome. &ldquo;I am someone who reads daily&rdquo; not &ldquo;I want to
          read 30 books.&rdquo; The identity is the resolution; the outcome is the side effect.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. What&rsquo;s the smallest weekly version?</h3>
        <p>
          Don&rsquo;t commit to running 5x a week. Commit to one run per week, every week. If you exceed it,
          bonus. The win condition is consistency, not volume.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. When &amp; where will I do this?</h3>
        <p>
          Write the implementation intention: &ldquo;I will [behaviour] at [time] in [location].&rdquo; If you
          can&rsquo;t answer this, the resolution isn&rsquo;t real yet.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. What&rsquo;s the failure protocol?</h3>
        <p>
          Pre-decide what happens when you miss. &ldquo;Never miss twice.&rdquo; &ldquo;Minimum-viable version on
          travel days.&rdquo; &ldquo;Sunday is a built-in rest day, so missing Sunday doesn&rsquo;t count.&rdquo; Plan recovery
          before you need it.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. How am I tracking this?</h3>
        <p>
          Tracker, calendar, app, fridge magnet — pick one and use it every day. The data is the
          evidence that you&rsquo;re becoming who you said you&rsquo;d become.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. When do I review?</h3>
        <p>
          Pick a weekly time — same time, same day. 15 minutes. What worked, what didn&rsquo;t, what&rsquo;s the
          next 7 days look like. Without a review cadence, resolutions drift silently. With one, they
          self-correct.
        </p>

        <Callout icon="📋" title="Your one-paragraph resolution">
          The redesigned format:
          <em>
            {' '}&ldquo;I&rsquo;m becoming someone who [identity]. Every [day/week], I do [smallest version] at
            [time] in [location]. If I miss once, I&rsquo;m back the next day; never twice. I&rsquo;m tracking
            with [tool]. Every [day/time], I review: what worked, what didn&rsquo;t, what&rsquo;s next.&rdquo;
          </em>
          {' '}If you can write that paragraph, your resolution will outlive Quitter&rsquo;s Day.
        </Callout>
      </Section>

      <Section id="why" title="Why this actually works">
        <p>
          The 8% who succeed aren&rsquo;t harder workers. They&rsquo;ve set up <strong>a system that does the
          working for them</strong>. Behaviour is downstream of design. A well-designed resolution puts
          adherence on autopilot; a badly-designed one demands daily heroism — and daily heroism is the
          only kind of effort the human brain reliably refuses to supply.
        </p>
        <p>
          The compound effect (see our{' '}
          <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep-dive on 1% daily
          </Link>
          ) only kicks in if you stay in the game. Most resolutions die before compounding gets a
          chance. The redesigned format above changes which curve you&rsquo;re on — from the rose drop-off
          curve to the green compound curve.
        </p>
        <PullQuote>
          The question isn&rsquo;t whether you&rsquo;ll be the same person in a year. It&rsquo;s whether you&rsquo;ll be the
          person on the +1% curve or the −1% one. Resolution design decides which.
        </PullQuote>
        <p>
          BuildYourYear is built around this exact redesign. Goals are split into short-term and
          long-term (12-week and beyond). Each goal has milestones. Habits drive lead measures. The
          12-week heatmap shows your real adherence pattern. The streak counter exploits loss aversion
          in your favour. And the auto-rollover banner catches drift before it becomes a quit.
        </p>
        <p>
          If you&rsquo;re reading this in early January, you have a 92% chance of being a Quitter&rsquo;s Day
          statistic — unless you redesign. If you&rsquo;re reading this in May or August, you have an even
          better starting point: lower motivation means more system-dependent resolutions, which are
          the ones that actually survive. There&rsquo;s no bad day to start a well-designed resolution. Just
          run through the 6 questions above and start before the urge fades. For the full system,
          read on:{' '}
          <Link href="/blog/how-to-build-habits-that-stick" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            how to build habits that stick
          </Link>
          ,{' '}
          <Link href="/blog/12-week-year-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the 12-Week Year method
          </Link>
          , and{' '}
          <Link href="/blog/goal-setting-frameworks-compared" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            which goal-setting framework to use
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
