import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'goal-setting-frameworks-compared';
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
        Choosing the right goal-setting framework matters more than choosing the right goal. The wrong
        framework turns clear ambition into vague aspiration; the right one turns a vague aspiration
        into a quarterly shipping plan. This guide compares the four most-used frameworks — SMART,
        OKRs, the 12-Week Year, and BHAGs — across clarity, time horizon, accountability, and
        motivation, with a decision matrix at the end.
      </p>

      <Section id="definition" title="Definition: what is a goal-setting framework?">
        <p>
          A <strong>goal-setting framework</strong> is a structured approach to deciding{' '}
          <em>what</em> to pursue, <em>how</em> you&rsquo;ll measure it, and <em>when</em> you&rsquo;ll check
          progress. Without a framework, &ldquo;goal&rdquo; defaults to wish — a sentence in your journal that
          stops mattering by February.
        </p>
        <p>
          Every serious framework answers four questions:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>What does success look like?</strong> (criteria of done)</li>
          <li><strong>How will I measure progress?</strong> (lead and lag indicators)</li>
          <li><strong>By when?</strong> (time horizon)</li>
          <li><strong>How often do I review?</strong> (cadence)</li>
        </ul>
        <p>The four frameworks below answer those questions differently, and that difference is the entire reason to pick one over another.</p>
      </Section>

      <Section id="what" title="What each framework actually is">

        <h3 className="mt-5 text-[16px] font-bold tracking-tight text-zinc-900">SMART Goals</h3>
        <p>
          Coined in 1981 by George Doran. The acronym is{' '}
          <strong>Specific, Measurable, Achievable, Relevant, Time-bound</strong>. The contribution is
          forcing precision: a SMART goal can&rsquo;t be vague by definition. &ldquo;Read more&rdquo; isn&rsquo;t SMART.
          &ldquo;Read 12 books in 2026, one per month&rdquo; is.
        </p>
        <p>
          <strong>Best for:</strong> Personal goals where the destination is clear and you just need
          rigour. <strong>Worst for:</strong> Strategic goals with discovery built in.
        </p>

        <h3 className="mt-5 text-[16px] font-bold tracking-tight text-zinc-900">OKRs (Objectives &amp; Key Results)</h3>
        <p>
          Developed at Intel by Andy Grove, made famous at Google by John Doerr. Format:{' '}
          <strong>one ambitious Objective + 3-5 measurable Key Results</strong>. Objectives are
          qualitative (&ldquo;be the most loved coffee shop on the block&rdquo;); Key Results are quantitative
          (&ldquo;reach 4.8 Google reviews avg from 50+ reviews&rdquo;). Most teams run them quarterly with weekly
          check-ins.
        </p>
        <p>
          <strong>Best for:</strong> Teams aligning around ambitious outcomes. <strong>Worst for:</strong>{' '}
          Solo individuals on personal habits — too much overhead.
        </p>

        <h3 className="mt-5 text-[16px] font-bold tracking-tight text-zinc-900">12-Week Year</h3>
        <p>
          Created by Brian Moran (2013). Compresses a year of execution into 12 weeks. 1–3 goals per
          cycle, weekly execution scoring, target 85% adherence. Four cycles per calendar year.
        </p>
        <p>
          <strong>Best for:</strong> Execution-heavy personal goals (fitness, side projects, savings
          targets). <strong>Worst for:</strong> Discovery / open-ended exploration. See our full piece
          on{' '}
          <Link href="/blog/12-week-year-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            how to run a 12-Week Year
          </Link>
          .
        </p>

        <h3 className="mt-5 text-[16px] font-bold tracking-tight text-zinc-900">BHAG (Big Hairy Audacious Goal)</h3>
        <p>
          Coined by Jim Collins in <em>Built to Last</em> (1994). A 10-30 year goal so ambitious it feels
          slightly absurd. Apple&rsquo;s &ldquo;a computer for the rest of us&rdquo; was a BHAG. Walmart&rsquo;s &ldquo;become a
          $125B company&rdquo; in 1990 was a BHAG (they hit it in 1995).
        </p>
        <p>
          <strong>Best for:</strong> Anchoring long-term direction; deciding what
          <em> not</em> to do. <strong>Worst for:</strong> Anything you need to act on this week.
        </p>
      </Section>

      <Section id="when" title="When to use which (the decision matrix)">
        <p>
          You don&rsquo;t pick one framework for life. You pick one per goal, based on time horizon,
          team size, and clarity. Here&rsquo;s the matrix:
        </p>
        <ComparisonTable
          headers={['Framework', 'Time horizon', 'Best unit', 'Cadence', 'When to use']}
          rows={[
            ['SMART', '1 week – 1 year', 'Individual', 'Monthly review', 'Personal goal w/ clear destination'],
            ['OKRs', '1 quarter (typically)', 'Team or company', 'Weekly check-ins', 'Cross-team alignment'],
            ['12-Week Year', '12 weeks (rolling)', 'Individual / small team', 'Weekly score (mandatory)', 'Execution-heavy personal goals'],
            ['BHAG', '10–30 years', 'Company / life', 'Annual reflection', 'Strategic North Star'],
          ]}
        />
        <PullQuote>
          A 10-year BHAG, decomposed into four annual themes, decomposed into four 12-Week Years per
          theme, decomposed into SMART weekly intentions — that&rsquo;s the full stack.
        </PullQuote>
        <p>
          You can layer them. The BHAG provides direction (decades). OKRs or the 12-Week Year provide
          execution rhythm (quarter). SMART provides daily precision (week). Don&rsquo;t pick one and forget
          the others — pick the right one for the question you&rsquo;re answering today.
        </p>
      </Section>

      <Section id="how" title="How to actually choose (in 60 seconds)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Use SMART when</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>The goal is personal, the destination is clear, and you just need to lock in rigour.</li>
          <li>You&rsquo;re writing a New Year&rsquo;s resolution — and want it to survive February.</li>
          <li>You want one sentence on the fridge that you&rsquo;ll re-read all year.</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Use OKRs when</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>You&rsquo;re leading a team of 3+ that needs visible alignment.</li>
          <li>The objective is ambitious enough that you&rsquo;d be proud of 70% achievement.</li>
          <li>You can commit to a Monday review ritual without sandbagging it.</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Use the 12-Week Year when</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>You&rsquo;re a solo executor (1 person, your own life).</li>
          <li>You know <em>what</em> to do; the question is &ldquo;will I actually do it?&rdquo;</li>
          <li>You&rsquo;ve failed annual planning before and the calendar feels too long.</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Use a BHAG when</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>You need to decide what <em>not</em> to work on for the next 10 years.</li>
          <li>You&rsquo;re writing a company mission, life philosophy, or 5-year personal vision.</li>
          <li>You want a single anchor that survives a recession, a job change, a kid being born.</li>
        </ul>

        <Callout icon="🧩" title="The most common mistake">
          Picking a framework for the time horizon you <em>think</em> you have, instead of the time
          horizon you <em>actually</em> have. Most people pick &ldquo;annual SMART goals&rdquo; when their attention
          span is honestly 6 weeks. The 12-Week Year exists specifically to fix this.
        </Callout>
      </Section>

      <Section id="why" title="Why frameworks beat free-form intentions">
        <p>
          A 2015 Dominican University study often-cited (and over-extrapolated) found that participants
          who wrote down their goals and shared them with a friend achieved them at materially higher
          rates than those who didn&rsquo;t. The exact numbers vary by replication, but the qualitative
          conclusion holds: <strong>structure beats vibes</strong>.
        </p>
        <p>
          Frameworks force three things that free-form intention doesn&rsquo;t:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>A measurable success condition.</strong> &ldquo;Be healthier&rdquo; is unmeasurable. &ldquo;Run a
            10K under 60 minutes by November&rdquo; is unambiguously yes or no.
          </li>
          <li>
            <strong>A review cadence.</strong> Frameworks bake in when you check progress. Without a
            cadence, goals get reviewed at the same frequency as you accidentally remember them — which
            is rarely.
          </li>
          <li>
            <strong>A failure protocol.</strong> Mature frameworks tell you what to do when you fall
            behind. The 12-Week Year&rsquo;s 85% rule is a failure protocol. OKRs&rsquo; &ldquo;score 0.6-0.7 is great&rdquo;
            is a failure protocol. SMART&rsquo;s &ldquo;adjust if you fall behind&rdquo; is the weakest, which is part
            of why SMART goals quietly die.
          </li>
        </ul>
        <PullQuote>
          The goal is to choose the framework that matches your time horizon, your accountability needs,
          and how honest you&rsquo;re willing to be with yourself.
        </PullQuote>
        <p>
          Most people would benefit from this stack: <strong>1 BHAG, 1 annual theme, 1 active 12-Week
          Year cycle with 1–3 goals, 4 weekly SMART intentions</strong>. Five docs. The whole stack fits
          on one screen.
        </p>

        <Callout icon="📋" title="Your goal stack template">
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>BHAG (10–30 yr):</strong> The version of you/your life that matters at the end.</li>
            <li><strong>Annual theme (1 yr):</strong> One sentence — &ldquo;The year of building.&rdquo; &ldquo;The year I get healthy.&rdquo;</li>
            <li><strong>12-Week Year (12 wk):</strong> 1–3 concrete goals tied to the theme.</li>
            <li><strong>Weekly SMART intentions (1 wk):</strong> 3-5 lead measures you&rsquo;ll do this week.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear ships with separate views for short-term and long-term goals, each with
          milestone breakdowns and deadline tracking. Pair it with a weekly review ritual and you have
          the SMART + 12-Week Year stack working in your favour automatically. For the deeper why,
          read our companion pieces on{' '}
          <Link href="/blog/12-week-year-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the 12-Week Year method
          </Link>{' '}
          and{' '}
          <Link href="/blog/why-new-year-resolutions-fail" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why resolutions fail without a framework
          </Link>
          .
        </p>
        <p>
          Pick one framework. Run it for 12 weeks. Then decide if it&rsquo;s the right one. The worst goal
          framework is the one you abandon by week 3 — and almost any framework, run consistently for
          90 days, beats the best framework run for 7.
        </p>
      </Section>
    </BlogLayout>
  );
}
