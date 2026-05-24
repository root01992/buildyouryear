import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'habit-tracking-streaks-heatmaps';
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
  // Generate a deterministic 12-week heatmap for the visual
  const grid = Array.from({ length: 12 }, (_, w) =>
    Array.from({ length: 7 }, (__, d) => {
      const seed = Math.sin(w * 1.731 + d * 0.917) * 2.5 + 2;
      return Math.min(4, Math.max(0, Math.floor(seed)));
    }),
  );
  const cellColors = ['#f4f4f5', '#bbf7d0', '#86efac', '#22c55e', '#15803d'];

  return (
    <BlogLayout post={post} related={related}>
      <p className="text-[17px] font-semibold leading-snug text-zinc-800">
        You don&rsquo;t need an app to track habits. You need a system that you&rsquo;ll <em>actually open</em>
        on day 47, when motivation is gone and your only company is the cold accountability of an empty
        checkbox. Streaks, heatmaps, and visual scoring aren&rsquo;t gimmicks — they&rsquo;re the most
        researched-backed tools in behaviour design. Here&rsquo;s the psychology behind them, and how to set
        up a tracker that earns its place on your home screen.
      </p>

      <Section id="definition" title="Definition: what is habit tracking?">
        <p>
          <strong>Habit tracking</strong> is the daily act of recording whether you did a behaviour
          you&rsquo;re trying to build. It can be as low-tech as ticking a box on a calendar (Jerry Seinfeld&rsquo;s
          legendary &ldquo;Don&rsquo;t Break the Chain&rdquo; technique), or as high-tech as a synced dashboard with
          heatmaps, streak counters, and recap analytics.
        </p>
        <p>
          The format matters less than the function: tracking <strong>closes the feedback loop</strong>{' '}
          between intention and behaviour. Without tracking, your brain optimistically rounds your effort
          up (&ldquo;I&rsquo;ve been running pretty regularly!&rdquo; — actually 2 of the last 14 days). With tracking,
          you confront the ground truth.
        </p>
      </Section>

      <Section id="what" title="What tracking actually does for you (three underrated effects)">
        <p>
          Beyond the obvious &ldquo;remember to do it,&rdquo; consistent tracking produces three behavioural
          effects that compound:
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. The Hawthorne Effect (the act of measuring changes the behaviour)</h3>
        <p>
          People do more of what they measure. A 2015 meta-analysis covering 19,951 participants found
          that self-monitoring alone — without any other intervention — produced a{' '}
          <strong>meaningful improvement in target behaviours</strong> across diet, exercise, and habit
          formation. You&rsquo;ll do more of a habit just because you&rsquo;re tracking it.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Loss aversion (streaks become valuable)</h3>
        <p>
          Daniel Kahneman&rsquo;s Nobel-winning research established that humans feel losses{' '}
          <strong>roughly 2x as strongly as equivalent gains</strong>. A 30-day streak isn&rsquo;t just an
          arbitrary number — it&rsquo;s 30 days of accumulated &ldquo;loss potential&rdquo; that makes the next check-in
          feel almost mandatory. This is why streak-based apps see such high day-2 retention.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Identity reinforcement (you become the data)</h3>
        <p>
          Every checked box is a vote for who you&rsquo;re becoming. Forty consecutive days of running creates
          a different self-concept than forty random runs over a year. The visible record locks in the
          identity: you stop trying to be a runner and start <em>being</em> one. Identity-based habits
          have far higher long-term retention than outcome-based ones.
        </p>
        <PullQuote>
          Every action you take is a vote for the type of person you wish to become. — James Clear
        </PullQuote>
      </Section>

      <Section id="when" title="When to track (and when not to)">
        <p>
          Tracking helps for behaviours that meet three criteria:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Recurring.</strong> Daily or weekly. One-off goals belong in a goal tracker, not a
            habit tracker.
          </li>
          <li>
            <strong>Binary (or trivially countable).</strong> &ldquo;Did I meditate today?&rdquo; is yes/no.
            &ldquo;Was today a good day?&rdquo; is not trackable as a habit.
          </li>
          <li>
            <strong>Owned by you.</strong> Don&rsquo;t track outputs you don&rsquo;t control. Track inputs.
            &ldquo;Wrote 500 words today&rdquo; works. &ldquo;Got 100 newsletter subscribers&rdquo; doesn&rsquo;t.
          </li>
        </ul>
        <Callout icon="⚠️" title="When tracking hurts">
          For some people, with some behaviours (especially around food or weight), constant tracking
          produces anxiety, perfectionism, and abandonment. If tracking starts to feel like surveillance
          rather than reflection, scale back. The goal is behaviour change, not a clean spreadsheet.
        </Callout>
      </Section>

      <Section id="how" title="How to set up a tracker that you'll actually use">
        <p>
          The tracker is a tool, not the project. Here&rsquo;s how to design one that maximises adherence:
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Cap your active habits at 4 (one per quadrant)</h3>
        <p>
          The most consistent habit-trackers track <strong>fewer habits, not more</strong>. A useful
          framing: one habit per life quadrant — health, mind, work, and relationship. Tracking 12
          habits guarantees ignoring 8 of them by week three.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Use a streak counter for momentum</h3>
        <p>
          The streak number on your screen is doing real work. It exploits loss aversion (above) and
          creates a Schelling point — a number that becomes a target in itself. &ldquo;Don&rsquo;t break the
          chain&rdquo; is one of the most reliable behaviour-design techniques ever discovered. Combine
          current streak + best streak ever for extra leverage.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Use a heatmap for the long view</h3>
        <p>
          Streaks reward today. Heatmaps reward the year. The GitHub-style 12-week (or 52-week) grid
          gives you something a streak can&rsquo;t: a pattern view of your entire effort over time. Bad
          weeks are visible. Good seasons are visible. The shape of your year is visible.
        </p>

        {/* Heatmap visualization */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              12-week consistency heatmap (sample)
            </span>
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-zinc-400">less</span>
              {cellColors.map((c, i) => (
                <span key={i} style={{ background: c }} className="h-2.5 w-2.5 rounded-[2px]" />
              ))}
              <span className="text-[9px] text-zinc-400">more</span>
            </div>
          </div>
          <div className="flex gap-[3px] overflow-x-auto">
            {grid.map((week, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {week.map((value, d) => (
                  <span
                    key={d}
                    style={{ background: cellColors[value] }}
                    className="h-[14px] w-[14px] rounded-[2px]"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11.5px] leading-snug text-zinc-500">
            Each column is a week. Each cell, a day. Dense green = you showed up. The visible
            pattern is more motivating than any number.
          </div>
        </div>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Make check-in friction zero</h3>
        <p>
          The tracker should take <em>less than 5 seconds</em> to update. If logging a habit takes
          longer than the habit, you&rsquo;ll quit tracking before you quit the habit. Tap a checkbox. Done.
          Avoid notes, ratings, tags, or any structured data unless they directly inform behaviour.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Make the streak forgiving (one-miss rule)</h3>
        <p>
          The strict &ldquo;reset to 0 on a missed day&rdquo; model is a great motivator for the first 30 days and
          a quitting machine after that. A better rule: <strong>never miss twice in a row</strong>.
          One miss is recovery; two misses is a new habit (a bad one). Some trackers implement this as a
          freeze pass; others bake it into the streak math directly.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Review weekly, not daily</h3>
        <p>
          Check the heatmap once a week, not constantly. Daily check-ins are for the streak. The
          weekly review is where the actual learning happens: which habits dropped, what life event
          caused it, what to adjust.
        </p>
      </Section>

      <Section id="why" title="Why heatmaps beat streaks (for the long game)">
        <p>
          Streaks are great motivators for days 1-30. After day 30, they get fragile. One missed day,
          and a 60-day streak is psychologically &ldquo;ruined.&rdquo; Heatmaps are different — they don&rsquo;t care
          about consecutive days. They reward <strong>density over time</strong>.
        </p>
        <p>
          Compare two patterns over 90 days:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Person A:</strong> 90-day streak, then quit. Streak counter says: amazing. Then zero.</li>
          <li><strong>Person B:</strong> Showed up 70 of 90 days, with 4 gaps. Streak says: 12. Heatmap says: a sea of green.</li>
        </ul>
        <p>
          Person B has the better long-term outcome — by a wide margin. The heatmap reflects that
          reality. The streak number doesn&rsquo;t.
        </p>
        <PullQuote>
          The goal isn&rsquo;t a perfect streak. The goal is a green-saturated heatmap at the end of the
          year.
        </PullQuote>
        <p>
          That&rsquo;s why we ship both. The streak counter gives you a daily nudge. The 12-week heatmap
          shows you the truth — and the truth is what compounds.
        </p>

        <Callout icon="🎯" title="The tracker scorecard">
          <p>
            Use this as a quick audit. A tracker (app or paper) earns its place if it has{' '}
            <strong>at least 5 of these 7</strong>:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>One-tap daily check-in (zero friction)</li>
            <li>Visible streak counter</li>
            <li>Visible heatmap or 52/12-week grid</li>
            <li>Forgiveness mechanic (skip pass / never-miss-twice)</li>
            <li>4–6 habits max (not 20)</li>
            <li>Identity-reinforcing language (&ldquo;today I&rsquo;m a runner&rdquo; not &ldquo;running task&rdquo;)</li>
            <li>Weekly recap (not just daily)</li>
          </ul>
        </Callout>

        <p>
          BuildYourYear is built around exactly this scorecard. Each habit gets a streak. The
          dashboard ships with a 12-week heatmap. The &ldquo;done today&rdquo; celebration reinforces identity.
          And the tab badge counts only active habits (not paused) — so you&rsquo;re never staring at habits
          you&rsquo;ve quietly retired.
        </p>
        <p>
          The behaviour is the goal. The tracker just makes the behaviour easier to repeat — and
          easier to <em>see</em>. By Week 12, the chart on your dashboard will tell you something more
          honest about who you are than any to-do list ever could. See our companion piece on{' '}
          <Link href="/blog/how-to-build-habits-that-stick" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            building habits that stick
          </Link>{' '}
          and{' '}
          <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the compound effect of 1% daily
          </Link>{' '}
          for the full system.
        </p>
      </Section>
    </BlogLayout>
  );
}
