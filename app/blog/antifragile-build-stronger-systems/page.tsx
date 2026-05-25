import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'antifragile-build-stronger-systems';
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
        In <AnimatedCounter end={2012} className="font-bold text-emerald-700" />, Nassim Taleb wrote
        the book that introduced one of the most useful words in the English language. We had words for
        things that break under stress (<em>fragile</em>) and things that survive stress
        (<em>robust / resilient</em>). But we had no word for a third category: things that{' '}
        <strong>get stronger from stress</strong>. Taleb called it <strong>antifragile</strong>. Your
        immune system is antifragile. So are muscles, mental models, careers, and certain economies.
        Here&rsquo;s the framework — and how to make more of your life antifragile.
      </p>

      <Section id="definition" title="Definition: the 3-state framework">
        <p>Taleb&rsquo;s framework divides systems into three categories based on how they respond to stress:</p>

        <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50/40 p-4">
            <div className="text-[24px]">💔</div>
            <div className="mt-2 text-[14px] font-bold text-rose-800">Fragile</div>
            <div className="mt-1 text-[12px] text-zinc-700">Breaks under stress. Hates volatility.</div>
            <div className="mt-2 text-[11px] text-zinc-500"><strong>Examples:</strong> glass, porcelain, just-in-time supply chains, over-leveraged businesses, your knee at high impact</div>
          </div>
          <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-4">
            <div className="text-[24px]">🛡️</div>
            <div className="mt-2 text-[14px] font-bold text-zinc-800">Robust / Resilient</div>
            <div className="mt-1 text-[12px] text-zinc-700">Survives stress unchanged. Neutral to volatility.</div>
            <div className="mt-2 text-[11px] text-zinc-500"><strong>Examples:</strong> steel, a phoenix from the ashes (still the same phoenix), most things people call &ldquo;resilient&rdquo;</div>
          </div>
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-4">
            <div className="text-[24px]">💎</div>
            <div className="mt-2 text-[14px] font-bold text-emerald-800">Antifragile</div>
            <div className="mt-1 text-[12px] text-zinc-700"><em>Gets stronger</em> from stress. Loves controlled volatility.</div>
            <div className="mt-2 text-[11px] text-zinc-500"><strong>Examples:</strong> muscles under load, immune system fighting pathogens, mental models from making mistakes, careers from setbacks</div>
          </div>
        </div>

        <p>
          The framework&rsquo;s power is the third category. Most people think &ldquo;robust&rdquo; is the goal — to
          survive whatever comes. Antifragile reframes the goal: you want to be in systems that{' '}
          <em>improve</em> when stressed. Same volatility, dramatically different outcome.
        </p>

        <PullQuote>
          Some things benefit from shocks; they thrive and grow when exposed to volatility, randomness,
          disorder, and stressors. — Nassim Nicholas Taleb
        </PullQuote>
      </Section>

      <Section id="what" title="What separates antifragile from merely robust">

        <ComparisonTable
          headers={['Property', 'Fragile', 'Robust', 'Antifragile']}
          rows={[
            ['Response to small stress', 'Cracks accumulate', 'Survives, unchanged', 'Strengthens'],
            ['Response to big stress', 'Catastrophic break', 'Survives, often unchanged', 'Sometimes breaks; can grow significantly stronger'],
            ['Preference for volatility', 'Hates it', 'Indifferent', 'Loves it (in correct dose)'],
            ['Recovery from setback', 'Permanent damage', 'Back to baseline', 'Above prior baseline'],
            ['Example: body', 'Sedentary office worker', 'Yoga regular', 'Strength athlete (microtears → growth)'],
            ['Example: career', 'Single corporate job', 'Diversified job + savings', 'Optionality + side projects that compound'],
            ['Example: portfolio', 'All in one stock', '60/40 index funds', 'Barbell: 90% safe + 10% high-upside bets'],
          ]}
        />

        <p>The key insight: <strong>antifragility requires the right dose of stress.</strong></p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Too little stress → atrophy (muscles waste in zero-gravity; immune systems weaken in sterile environments)</li>
          <li>Right dose → strengthening (5x bodyweight deadlift training; controlled pathogen exposure)</li>
          <li>Too much → catastrophic damage (deadlift 10x bodyweight = injury; sepsis kills you)</li>
        </ul>
        <p>
          The art of being antifragile isn&rsquo;t avoiding stress. It&rsquo;s finding the dose where you grow.
        </p>
      </Section>

      <Section id="when" title="When antifragility shows up in your life">
        <p>Most of life has both fragile and antifragile components. The skill is noticing which is which:</p>

        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Body:</strong> Fragile to a single major impact. Antifragile to repeated training
            stimulus. The same body destroys at one extreme and improves at the other.
          </li>
          <li>
            <strong>Career:</strong> Single-source income is fragile. A primary job + 2 side projects +
            savings is antifragile — a job loss prompts growth in the side projects.
          </li>
          <li>
            <strong>Mind:</strong> Sheltered from challenge → fixed mindset. Repeatedly stretched by
            problems just beyond capability → antifragile mental models. See our piece on{' '}
            <Link href="/blog/growth-mindset-carol-dweck" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              growth mindset
            </Link>
            .
          </li>
          <li>
            <strong>Relationships:</strong> Fragile when conflict is avoided. Antifragile when small
            conflicts are processed and resolved repeatedly — the relationship strengthens with each cycle.
          </li>
          <li>
            <strong>Finances:</strong> Single-stock portfolio is fragile. The &ldquo;barbell&rdquo; portfolio
            (mostly safe, small high-upside bets) is antifragile — limited downside, unbounded upside.
          </li>
          <li>
            <strong>Habits:</strong> A rigid streak is fragile (one miss = broken). A flexible
            chain-with-recovery-rule is antifragile (each miss teaches the system).
          </li>
        </ul>
        <Callout icon="🎯" title="The audit question">
          For each major area of your life: <em>does it get stronger from setbacks, survive them
          unchanged, or get weaker?</em> Most people have 1-2 fragile areas they could deliberately make
          antifragile.
        </Callout>
      </Section>

      <Section id="how" title="How to build antifragile systems (5 patterns)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Use the barbell strategy</h3>
        <p>
          Combine extreme safety on one side with extreme risk on the other — and nothing in the
          middle. Examples: 90% of savings in index funds + 10% in high-upside bets. Stable W2 job +
          side projects with unlimited upside. A safe career + a creative pursuit where the worst case
          is &ldquo;learned a skill.&rdquo; The barbell captures upside without exposing you to ruin.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Build optionality</h3>
        <p>
          Optionality is the right to act on something later, without obligation. A side project that
          could become a career. Savings that could become a sabbatical. A network that could become a
          job. Optionality is antifragile because you have nothing to lose from volatility (you just
          don&rsquo;t exercise the option) and unbounded upside from it (when conditions align, you do).
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Add small, recoverable stresses regularly</h3>
        <p>
          The dose makes the poison — and the medicine. Cold showers, fasting, hard workouts, public
          speaking, difficult conversations, learning a new skill. Small voluntary stresses build
          systems that respond well to involuntary ones later. This is the entire principle of
          training.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Embrace skin in the game</h3>
        <p>
          Taleb&rsquo;s related principle: you can&rsquo;t learn antifragility from books — only from systems
          where you bear the consequences of your decisions. Investing your own money (not just paper
          portfolios). Shipping your own work (not just talking about it). Real skin in the game forces
          the feedback loop that makes you antifragile.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Diversify, but not into the middle</h3>
        <p>
          The wrong diversification: 10 mediocre things that all fail together. The right
          diversification: 2-3 things in different domains with uncorrelated risks. You want the kind
          of diversification where one component thriving offsets another failing — not where they
          all underperform together.
        </p>
      </Section>

      <Section id="why" title="Why antifragility beats &lsquo;resilience&rsquo;">
        <p>Three reasons antifragile is the higher target:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Volatility is rising, not falling.</strong> The world is getting more uncertain,
            not less. Resilient systems just survive the volatility; antifragile ones harvest it.
          </li>
          <li>
            <strong>Compounding works in your favour.</strong> Every stress that strengthens you adds
            to a base that handles the next stress better. Resilient stays flat. Antifragile slopes up.
          </li>
          <li>
            <strong>It changes your relationship with setbacks.</strong> A resilient mindset says
            &ldquo;survive the storm.&rdquo; An antifragile mindset says &ldquo;what can I learn that makes the next
            storm trivial?&rdquo; Same setback. Completely different harvest.
          </li>
        </ul>

        <PullQuote>
          Wind extinguishes a candle and energises a fire. The same is true of any uncertainty, any
          volatility, any setback — depending on which kind of system you are.
        </PullQuote>

        <Callout icon="📋" title="Your antifragile audit (10 minutes)">
          <ol className="list-decimal space-y-1 pl-5">
            <li>List 5 important areas of your life (career, finances, body, relationships, skills).</li>
            <li>For each, mark: Fragile / Robust / Antifragile.</li>
            <li>Identify the 1-2 most fragile. What single change would shift them up?</li>
            <li>Add one small voluntary stress per week (cold shower, hard workout, hard conversation, public post).</li>
            <li>Apply the barbell strategy to one domain — extreme safety + extreme upside, nothing in the middle.</li>
          </ol>
        </Callout>

        <p>
          The BuildYourYear framework is itself antifragile by design: a missed day doesn&rsquo;t break the
          chain (never-miss-twice rule), the 12-week year compresses cycles so a bad quarter only costs
          12 weeks (not 12 months), and habits diversify across health/mind/work/savings — one
          struggling doesn&rsquo;t pull down the others. Setbacks become diagnostic data, not verdicts.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/productive-failure" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            productive failure
          </Link>
          ,{' '}
          <Link href="/blog/growth-mindset-carol-dweck" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            growth mindset
          </Link>
          , and{' '}
          <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the compound effect
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
