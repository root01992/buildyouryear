import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'anti-resolutions-year-themes';
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
        Resolutions have a hidden flaw: they&rsquo;re binary. You either kept the gym promise or you broke
        it. <strong><AnimatedCounter end={92} suffix="%" className="text-emerald-700" /> of resolutions
        fail by mid-February</strong> — not because people lack discipline, but because the format is
        unforgiving. A <strong>yearly theme</strong> is different: continuous, forgiving, and
        accumulating. CGP Grey popularised it in 2019. Tens of thousands of high-performers have
        adopted it since. Here&rsquo;s why themes win and how to pick yours.
      </p>

      <Section id="definition" title="Definition: what is a yearly theme?">
        <p>
          A <strong>yearly theme</strong> is a single phrase or word that frames how you want to
          approach the next 12 months. It&rsquo;s not a goal (you can&rsquo;t &ldquo;achieve&rdquo; a theme), not a value
          (it&rsquo;s time-bound), and not a resolution (it&rsquo;s not binary). It&rsquo;s a lens.
        </p>
        <p>Some classic examples:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>&ldquo;The Year of Health&rdquo;</li>
          <li>&ldquo;The Year of Less&rdquo;</li>
          <li>&ldquo;The Year of Saying No&rdquo;</li>
          <li>&ldquo;The Year of Depth&rdquo;</li>
          <li>&ldquo;The Year of Building&rdquo;</li>
          <li>&ldquo;The Year of Quiet&rdquo;</li>
        </ul>
        <p>
          The theme doesn&rsquo;t prescribe specific actions. It informs every decision you make for 12
          months. The Year of Less means you ask <em>&ldquo;does this reduce or add?&rdquo;</em> before saying
          yes to anything new. The Year of Building means you ask <em>&ldquo;is this creating something
          that compounds?&rdquo;</em>
        </p>
        <PullQuote>
          Resolutions force a binary verdict every January 17th. Themes ask a question every single day.
        </PullQuote>
      </Section>

      <Section id="what" title="What changes when you swap resolutions for themes">

        <ComparisonTable
          headers={['Dimension', 'Resolutions', 'Yearly themes']}
          rows={[
            ['Format', 'Binary (kept / broken)', 'Continuous (more / less of)'],
            ['Failure mode', 'One miss = "failed"', 'No single moment can break it'],
            ['Time horizon', 'Fixed (lose 10kg by Dec)', 'Direction (move toward health)'],
            ['Decision lens', 'Did I do X today?', 'Did this decision serve my theme?'],
            ['Recovery from bad week', 'Hard — resolution feels broken', 'Trivial — return to the lens'],
            ['Success rate (informal surveys)', '~8% complete by year-end', '~60-70% report meaningful change'],
            ['Cognitive load', '5 specific commitments to track', '1 phrase to remember'],
          ]}
        />

        <p>
          The last row is the underrated one. <strong>You can hold one theme in your head all year.</strong>{' '}
          You cannot hold 5 specific resolutions in your head past February. The cognitive simplicity of
          a theme is what makes it survive — and the surviving is most of the game.
        </p>
      </Section>

      <Section id="when" title="When themes work better than goals (and when they don't)">
        <p>Themes work best for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Open-ended direction changes.</strong> "I want to be healthier" lives well as a theme; the specific goals can flex.</li>
          <li><strong>Years following a turbulent one.</strong> Post-burnout, post-baby, post-pivot — a theme provides direction without locking you into commitments you might need to abandon.</li>
          <li><strong>Multi-domain shifts.</strong> "The Year of Depth" can mean deep work AND deep relationships AND deep books. One theme, many surfaces.</li>
          <li><strong>People who&rsquo;ve burned out on resolutions.</strong> If you&rsquo;ve quit your January promises for 3 years running, themes break the pattern.</li>
        </ul>
        <p>Themes are weaker for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Hard, measurable outcomes.</strong> "Save $20,000 by December" is best as a SMART goal, not a theme.</li>
          <li><strong>Single-domain focus.</strong> If you only care about one thing this year (e.g., ship a book), a goal is more efficient than a theme.</li>
        </ul>
        <p>
          The right stack: <strong>one theme + one or two concrete goals nested inside it</strong>. The
          theme provides the direction; the goals provide the milestones. See our{' '}
          <Link href="/blog/goal-setting-frameworks-compared" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            comparison of goal-setting frameworks
          </Link>{' '}
          for the broader picture.
        </p>
      </Section>

      <Section id="how" title="How to pick a yearly theme (a 30-minute exercise)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Run your annual review first</h3>
        <p>
          A theme without an audit is a wish. The 3-question audit from our{' '}
          <Link href="/blog/annual-review-90-minutes" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            annual review guide
          </Link>{' '}
          surfaces the patterns your theme should respond to. Skip this and you&rsquo;ll pick a theme based
          on vibes, not data.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Identify the one direction that matters most</h3>
        <p>
          Look at your &ldquo;learned&rdquo; column. Where does the gravity want to pull you? Health? Money?
          Depth? Freedom? Less? More? Whatever appears 2-3 times across domains is your theme.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Phrase it as a noun, not a verb</h3>
        <p>
          &ldquo;Get healthy&rdquo; is a verb — and verbs imply completion. &ldquo;The Year of Health&rdquo; is a noun —
          a frame that persists. Use the &ldquo;Year of X&rdquo; format until you&rsquo;re comfortable with the
          pattern. Later you can get more creative (&ldquo;The Year of the Quiet Build&rdquo;).
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Nest 1-3 concrete commitments inside it</h3>
        <p>
          The theme is the lens; the commitments are the lead measures. If your theme is &ldquo;The Year of
          Health,&rdquo; your commitments might be:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Walk 7,000 steps daily</li>
          <li>Be in bed by 11pm</li>
          <li>Cook at least 4 meals a week</li>
        </ul>
        <p>
          The commitments are what you track. The theme is what they roll up to.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Write it down where you&rsquo;ll see it</h3>
        <p>
          The theme has zero effect if you can&rsquo;t see it every morning. Make it a phone wallpaper, a
          sticky note on your monitor, the first line of your journal. The whole point is that the
          theme shows up to inform decisions; if it&rsquo;s buried, it won&rsquo;t.
        </p>

        <Callout icon="🪴" title="5 themes that compound (real examples)">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>The Year of Less</strong> — fewer commitments, subscriptions, possessions, decisions.</li>
            <li><strong>The Year of Depth</strong> — fewer books read more carefully, deeper work, deeper relationships.</li>
            <li><strong>The Year of Building</strong> — every quarter ships one thing that compounds (project, asset, skill).</li>
            <li><strong>The Year of Health</strong> — body, sleep, food, movement — the foundation for everything else.</li>
            <li><strong>The Year of Voice</strong> — for creators: write, post, speak, ship — more often than feels comfortable.</li>
          </ul>
        </Callout>
      </Section>

      <Section id="why" title="Why themes are psychologically more durable">
        <p>
          Three forces explain why themes survive where resolutions die:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>No single moment can break them.</strong> A resolution to &ldquo;exercise every day&rdquo;
            is broken by one missed Tuesday. A theme of &ldquo;The Year of Health&rdquo; just absorbs the
            missed Tuesday and keeps going. Loss aversion (Kahneman) doesn&rsquo;t fire.
          </li>
          <li>
            <strong>They&rsquo;re identity-shaped.</strong> A theme is closer to{' '}
            <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              identity-based habits
            </Link>{' '}
            than to outcome-based goals. &ldquo;I&rsquo;m in The Year of Health&rdquo; is a self-concept; you defend it
            instead of abandoning it.
          </li>
          <li>
            <strong>They scale to your bandwidth.</strong> On busy weeks the theme just means small
            choices in the right direction. On free weeks it can mean big projects. Resolutions don&rsquo;t
            flex; themes do.
          </li>
        </ul>
        <PullQuote>
          A resolution asks &ldquo;did you do it today?&rdquo; A theme asks &ldquo;did today move you toward it?&rdquo;
          The second question is much easier to answer honestly.
        </PullQuote>

        <Callout icon="📋" title="Your 5-minute theme pick">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Re-read last year&rsquo;s &ldquo;learned&rdquo; notes.</li>
            <li>Spot the one direction that keeps showing up.</li>
            <li>Phrase it as &ldquo;The Year of X.&rdquo;</li>
            <li>Pick 1-3 concrete commitments under it.</li>
            <li>Write it where you&rsquo;ll see it daily.</li>
          </ol>
        </Callout>

        <p>
          In BuildYourYear, the theme isn&rsquo;t a separate feature — it&rsquo;s the frame around your year&rsquo;s
          dashboard. Set your 3 habits and 3 goals to match the theme, and every check-in becomes a
          small vote for the version of you the theme describes. By December, the heatmap shows
          whether the theme was a frame or just a sentence. Most people who run themes report it&rsquo;s
          the first year-shaping decision that actually held.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/annual-review-90-minutes" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            run the annual review first
          </Link>
          ,{' '}
          <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            identity-based habits
          </Link>
          , and{' '}
          <Link href="/blog/why-new-year-resolutions-fail" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            why resolutions fail
          </Link>{' '}
          for the contrast.
        </p>
      </Section>
    </BlogLayout>
  );
}
