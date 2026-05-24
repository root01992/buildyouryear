import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'pareto-principle-80-20-rule';
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
        In 1896, Italian economist Vilfredo Pareto noticed that 80% of Italy&rsquo;s land was owned by 20%
        of the population. He found the same ratio in his garden — 20% of the pea pods produced 80% of
        the peas. Over the next century, researchers found this <strong>80/20 distribution</strong>
        almost everywhere humans interact with systems: customers, sales, bugs, vocabulary, exercise
        results, life satisfaction. Here&rsquo;s why it matters for your day — and how to use it.
      </p>

      <Section id="definition" title="Definition: what is the Pareto Principle?">
        <p>
          The <strong>Pareto Principle</strong> (also called the 80/20 Rule, the Law of the Vital Few,
          or Pareto&rsquo;s Law) states that approximately <strong>80% of effects come from 20% of
          causes</strong>. The exact ratio varies (it might be 70/30 or 90/10 in any given system), but
          the structural insight is the same: <em>outputs are not evenly distributed across inputs</em>.
        </p>
        <p>It shows up everywhere — and once you see it, you can&rsquo;t un-see it:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>80% of a company&rsquo;s revenue comes from 20% of customers</li>
          <li>80% of your wardrobe usage = 20% of your clothes</li>
          <li>80% of communication value comes from 20% of conversations</li>
          <li>80% of fitness results come from 20% of exercises (compound lifts, basics)</li>
          <li>80% of your productivity happens in 20% of your work day</li>
          <li>80% of code bugs cluster in 20% of the codebase</li>
        </ul>

        {/* Pareto distribution chart */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Pareto distribution: outputs vs. inputs
          </div>
          <svg viewBox="0 0 360 200" className="h-48 w-full">
            <defs>
              <linearGradient id="paretoFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* axes */}
            <line x1="40" y1="170" x2="340" y2="170" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#d4d4d8" />
            <text x="40" y="14" fontSize="10" fill="#52525b" fontWeight="700">% of total output</text>
            <text x="340" y="187" fontSize="10" fill="#52525b" fontWeight="700" textAnchor="end">% of inputs (ranked)</text>
            {/* 80% horizontal line */}
            <line x1="40" y1="42" x2="340" y2="42" stroke="#0d9488" strokeDasharray="3 3" opacity="0.5" />
            <text x="36" y="46" fontSize="9.5" fill="#0f766e" textAnchor="end" fontWeight="700">80%</text>
            {/* 20% vertical line */}
            <line x1="100" y1="20" x2="100" y2="170" stroke="#0d9488" strokeDasharray="3 3" opacity="0.5" />
            <text x="100" y="183" fontSize="9.5" fill="#0f766e" textAnchor="middle" fontWeight="700">20%</text>
            {/* Pareto curve */}
            <path
              d="M 40 170 Q 60 80, 100 50 T 220 28 T 340 22"
              fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"
            />
            <path
              d="M 40 170 Q 60 80, 100 50 T 220 28 T 340 22 L 340 170 L 40 170 Z"
              fill="url(#paretoFill)"
            />
            {/* Highlight the 80/20 intersection */}
            <circle cx="100" cy="42" r="5" fill="#0d9488" />
            <text x="108" y="38" fontSize="10" fill="#0f766e" fontWeight="800">
              20% causes → 80% effects
            </text>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            The Pareto curve steepens fast in the first 20% of inputs and flattens for the remaining
            80%. That flat tail is where most people spend most of their time.
          </div>
        </div>
      </Section>

      <Section id="what" title="What 80/20 actually looks like in everyday life">
        <p>
          The Pareto Principle is descriptive, not prescriptive — but the descriptive power is what
          makes it useful. Some concrete personal examples:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Productivity:</strong> Across a typical 10-hour workday, ~2 hours produce the bulk
            of meaningful output. The other 8 are coordination, communication, and busywork.
          </li>
          <li>
            <strong>Fitness:</strong> Compound movements (squat, deadlift, bench, pull-up, walk) drive
            ~80% of strength and cardiovascular gains. The other 80% of exercise variety adds &lt;20% of
            results.
          </li>
          <li>
            <strong>Relationships:</strong> 20% of the people in your life account for 80% of your
            joy, growth, and support. The reverse is also true — 20% of contacts cause 80% of your
            stress.
          </li>
          <li>
            <strong>Wardrobe:</strong> You wear ~20% of your clothes ~80% of the time. The rest are
            decoration.
          </li>
          <li>
            <strong>Income:</strong> For most freelancers and businesses, 20% of clients/projects
            generate 80% of revenue.
          </li>
        </ul>
        <PullQuote>
          The 80/20 rule isn&rsquo;t a productivity hack. It&rsquo;s a lens. Apply it to anything in your life
          and you&rsquo;ll find leverage you didn&rsquo;t know existed.
        </PullQuote>
      </Section>

      <Section id="when" title="When to apply the 80/20 rule (and when it misleads)">
        <p>Pareto thinking helps most in three scenarios:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>When you feel overwhelmed.</strong> The list is too long. Apply 80/20 to find the
            2-3 items that produce most of the value, do those, defer the rest. The list goes from 20
            tasks to 4.
          </li>
          <li>
            <strong>When something feels stalled.</strong> Goals not moving? Identify the 20% of
            actions actually driving them. Most plateaus happen because you&rsquo;re working on the bottom 80%.
          </li>
          <li>
            <strong>When you&rsquo;re cutting.</strong> Subscriptions, meetings, commitments. Find the 20%
            that produce 80% of the value. Cut the rest without guilt.
          </li>
        </ul>
        <Callout icon="⚠️" title="When 80/20 misleads">
          The rule breaks down for systems where every component must work (a 4-stroke engine doesn&rsquo;t
          work at 80% if 20% of the cylinders fail). It also misleads in fields where the long tail
          matters — academic research, art, exploration. Don&rsquo;t apply Pareto to your novel&rsquo;s plot or
          your child&rsquo;s emotional needs.
        </Callout>
      </Section>

      <Section id="how" title="How to apply 80/20 to your week (a 5-step process)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. List 100% of inputs honestly</h3>
        <p>
          Pick a domain — your work tasks, your fitness routine, your relationships, your spending.
          Brain-dump every activity/item/contact in that domain. Don&rsquo;t edit yet. You can&rsquo;t find the
          vital 20% if you haven&rsquo;t mapped the full 100%.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Rank by output produced</h3>
        <p>
          For each item, ask: <em>how much of the total result does this produce?</em> Be brutal. Use
          a rough numeric scale (1-10) or just stack-rank top to bottom. You&rsquo;re looking for the obvious
          outliers — the items that&rsquo;ve quietly carried most of your year.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Identify the vital 20%</h3>
        <p>
          The top 20% of your ranked list is almost certainly producing 60-80% of your results. Circle
          them. These are your <strong>leverage points</strong>. If you doubled the time/attention/care
          here, the impact would be enormous.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Reallocate from the bottom 80%</h3>
        <p>
          This is the move. Most people refuse to make. The bottom 80% of inputs are doing 20% of the
          work. They&rsquo;re also taking 80% of your time. <em>Cut, automate, delegate, or batch</em> the
          bottom — and redeploy the freed capacity into the top 20%.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Re-audit quarterly</h3>
        <p>
          Pareto patterns drift. The vital 20% of clients last year may not be this year&rsquo;s. Set a
          recurring quarterly review. 30 minutes. Re-rank. Re-allocate. The compounding effect of
          consistently doing this is staggering across years — see our piece on{' '}
          <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            compound growth
          </Link>
          .
        </p>
      </Section>

      <Section id="why" title="Why most people resist the 80/20 rule (and why it works anyway)">
        <p>
          The math is universally accepted. The practice is rare. Three reasons people resist:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Fairness bias.</strong> &ldquo;Cutting the bottom 80% feels harsh.&rdquo; Especially when
            those 80% are tasks, clients, or commitments you said yes to. Pareto requires saying no
            after the fact — which feels worse than saying no in advance.
          </li>
          <li>
            <strong>Loss aversion.</strong> Cutting things feels like losing them. Even if you never
            use those things. (Look at your storage closet for evidence.)
          </li>
          <li>
            <strong>The bottom 80% is comfortable.</strong> It feels productive. Inboxing, fiddling,
            tweaking — it&rsquo;s busywork that mimics real work. The top 20% is usually harder, scarier,
            and more demanding. The bottom 80% is the path of least resistance, which is exactly why
            most people live there.
          </li>
        </ul>
        <PullQuote>
          Doing more is easy. Doing the right less is the hardest skill in personal productivity.
        </PullQuote>

        <Callout icon="📋" title="Your quarterly Pareto audit (30 min)">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Pick one domain (work, health, finance, relationships).</li>
            <li>List every input/activity/commitment in it.</li>
            <li>Rank by output produced.</li>
            <li>Circle the top 20%.</li>
            <li>Cut, delegate, or downgrade the bottom 20-30%.</li>
            <li>Redeploy the time into the top 20%.</li>
            <li>Re-audit in 90 days.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear nudges you toward 80/20 thinking by design. The 6-habit cap forces you to pick
          your <em>vital few</em> habits, not your aspirational many. The dashboard shows you which
          ones you&rsquo;re actually doing — and over weeks, the heatmap reveals which 20% of habits are
          carrying 80% of your consistency. Cut the rest. The year you&rsquo;re building is shaped more by
          what you drop than what you add. For deeper context, read on:{' '}
          <Link href="/blog/eisenhower-matrix-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the Eisenhower Matrix
          </Link>{' '}
          (prioritisation tool that pairs perfectly with Pareto) and{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>{' '}
          (how to actually spend the freed time on the vital 20%).
        </p>
      </Section>
    </BlogLayout>
  );
}
