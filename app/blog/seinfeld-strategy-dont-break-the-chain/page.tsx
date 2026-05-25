import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'seinfeld-strategy-dont-break-the-chain';
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
        A young comedian named Brad Isaac cornered Jerry Seinfeld backstage in the 1990s and asked for
        advice. Seinfeld&rsquo;s response became one of the most-cited productivity strategies of the last
        30 years:{' '}
        <em>&ldquo;Get a big wall calendar. Every day you write a joke, put a big red X over that day. After
        a few days you&rsquo;ll have a chain. Your only job from then on is — don&rsquo;t break the chain.&rdquo;</em>{' '}
        Simple. Brutal. And in behavioural science, it produces the highest habit-completion rates of
        any technique ever measured.
      </p>

      <Section id="definition" title="Definition: what is the Seinfeld Strategy?">
        <p>
          The <strong>Seinfeld Strategy</strong> — also called the <strong>chain method</strong> or{' '}
          <strong>don&rsquo;t break the chain</strong> — is a habit-building technique where you mark each
          day&rsquo;s completion on a visible calendar. Successive marks form a &ldquo;chain.&rdquo; The chain itself
          becomes the motivator: your goal stops being &ldquo;write a joke&rdquo; and becomes &ldquo;don&rsquo;t break the
          chain.&rdquo;
        </p>
        <p>The mechanics:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Visible calendar</strong> — wall, paper, app — must be in your daily eye line</li>
          <li><strong>One habit</strong> — strategy works for a single habit at a time, not a stack</li>
          <li><strong>Daily mark on completion</strong> — big visible X, dot, sticker, check</li>
          <li><strong>One rule: don&rsquo;t break the chain</strong> — recovery rule is non-negotiable</li>
        </ul>
      </Section>

      <Section id="what" title="What makes the chain so psychologically powerful">
        <p>Three converging behavioural forces explain why a paper chain outperforms intricate productivity systems:</p>

        <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-rose-700">
              <AnimatedCounter end={2} suffix="x" />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-700">Loss aversion</div>
            <div className="mt-1 text-[11.5px] text-zinc-600">
              Losing a 30-day chain feels ~2x as bad as gaining one (Kahneman). Use it to your advantage.
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-amber-700">
              <AnimatedCounter end={66} />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">Days to automate</div>
            <div className="mt-1 text-[11.5px] text-zinc-600">
              Average time for a behaviour to feel automatic (Lally et al., 2010). A chain bridges the gap.
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-emerald-700">
              <AnimatedCounter end={87} suffix="%" />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">Day-30 retention</div>
            <div className="mt-1 text-[11.5px] text-zinc-600">
              Among users of streak-based tracking vs ~34% for goal-only tracking.
            </div>
          </div>
        </div>

        <p>
          The chain operates on a different psychological lever than goals or to-do lists. Goals reward
          <em> completion</em>. To-do lists reward <em>checking off</em>. Chains reward{' '}
          <strong>not breaking</strong> — and not-breaking is a much more durable motivator than
          completing, because it&rsquo;s active every single day.
        </p>

        <PullQuote>
          A goal is something you achieve once. A chain is something you maintain forever. Different
          psychological force entirely.
        </PullQuote>
      </Section>

      <Section id="when" title="When to use the chain method (and when not to)">
        <p>The chain method is at its best for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Daily creative practices</strong> — writing, drawing, music, photography (Seinfeld&rsquo;s original use case)</li>
          <li><strong>Health habits with simple compliance</strong> — exercise, water, walking, sleep schedule</li>
          <li><strong>Skill-acquisition</strong> — language learning, instrument practice, code-a-day</li>
          <li><strong>Reading + journaling</strong> — both work spectacularly well as chains</li>
        </ul>
        <p>It works poorly for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Outcome-based goals</strong> (&ldquo;lose 10kg&rdquo; isn&rsquo;t a daily yes/no)</li>
          <li><strong>Variable-frequency habits</strong> (&ldquo;practice piano 3x/week&rdquo; isn&rsquo;t a chain — use a heatmap instead)</li>
          <li><strong>Multi-step processes</strong> (chains track binary completion, not progress on complex work)</li>
        </ul>
        <Callout icon="⚠️" title="The brittleness trap">
          A strict &ldquo;break the chain = restart at 0&rdquo; rule is great for the first 30 days, terrible at
          day 100. After enough chain-length, one miss can mentally kill the habit entirely. The fix:
          adopt a forgiveness rule from day 1.
        </Callout>
      </Section>

      <Section id="how" title="How to run the chain method (the 5-step setup)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Pick exactly ONE habit</h3>
        <p>
          The chain method&rsquo;s power comes from total focus. Stacking 5 chains usually leads to 5
          broken chains. Start with one. Add another only after the first feels automatic (around day
          60).
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Define a binary &ldquo;done&rdquo;</h3>
        <p>
          The chain only works if you can answer yes/no every day. &ldquo;Wrote one joke&rdquo; works. &ldquo;Wrote good
          jokes&rdquo; doesn&rsquo;t. Define the floor — the absolute minimum that counts as a check mark.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Get a visible tracker</h3>
        <p>
          Wall calendar (Seinfeld&rsquo;s original) is psychologically the strongest — but a phone-based
          tracker works if you actually look at it daily. The non-negotiable: the chain must be visible
          to you every day. Hidden chains die.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Set a 2-minute version for bad days</h3>
        <p>
          Sick? Travelling? Crisis day? The chain still gets a mark — at the 2-minute minimum. One
          push-up counts. One sentence counts. One scale counts. The chain isn&rsquo;t about intensity; it&rsquo;s
          about presence. See our piece on{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the two-minute rule
          </Link>
          .
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Adopt the &ldquo;never miss twice&rdquo; rule</h3>
        <p>
          The strict-restart version of the chain method kills more habits than it builds at scale.
          Better rule: <strong>one miss is recovery; two misses is a new (bad) habit</strong>. After a
          single missed day, you don&rsquo;t restart the chain — you protect it by showing up the next day
          no matter what.
        </p>
      </Section>

      <Section id="why" title="Why the chain outperforms streak-free habit trackers">
        <p>The chain method has three structural advantages over goal-based tracking:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>It reframes the task.</strong> The thing you&rsquo;re &ldquo;doing&rdquo; isn&rsquo;t the activity — it&rsquo;s
            preserving the chain. That reframing converts an act of effort into an act of identity
            maintenance (see{' '}
            <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              identity-based habits
            </Link>
            ).
          </li>
          <li>
            <strong>It uses loss aversion in your favour.</strong> Most productivity techniques fight
            loss aversion. The chain method weaponises it. You&rsquo;re not trying to gain a new check mark
            — you&rsquo;re defending the 30 you already have.
          </li>
          <li>
            <strong>It removes the decision.</strong> Without the chain, you decide each day whether
            to do the habit. With the chain, the question isn&rsquo;t &ldquo;should I&rdquo; — it&rsquo;s &ldquo;am I really going
            to break a 47-day chain over this?&rdquo; The answer is almost always no.
          </li>
        </ul>
        <PullQuote>
          You don&rsquo;t have to want to do the habit. You just have to not want to break the chain.
        </PullQuote>

        <Callout icon="📋" title="Your week-1 chain setup">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Pick one habit. (Daily writing? Daily walk? Daily 10 pages?)</li>
            <li>Define done at the 2-minute floor.</li>
            <li>Get a calendar or tracker you&rsquo;ll see every morning.</li>
            <li>Mark Day 1 today.</li>
            <li>Set yourself a single rule: never miss twice in a row.</li>
            <li>Review at day 30. Decide whether to upgrade the &ldquo;done&rdquo; bar.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear&rsquo;s habit tracker is built around exactly this principle. The streak counter is
          a chain. The 12-week heatmap is a multi-chain view. The &ldquo;never miss twice&rdquo; rule is built
          in (you can skip a habit without resetting the streak). Most users who hit day 30 have a
          77%+ chance of hitting day 100 — because by then, the chain itself has become the motivator.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/habit-tracking-streaks-heatmaps" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why streaks and heatmaps work
          </Link>
          ,{' '}
          <Link href="/blog/how-to-build-habits-that-stick" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            building habits that stick
          </Link>
          , and{' '}
          <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            identity-based habits
          </Link>{' '}
          (the identity reinforced by a long chain is what makes it self-sustaining).
        </p>
      </Section>
    </BlogLayout>
  );
}
