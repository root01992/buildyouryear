import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'growth-mindset-carol-dweck';
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
        In <AnimatedCounter end={1998} className="font-bold text-emerald-700" />, Stanford psychologist
        Carol Dweck ran a series of studies on 5th graders. Half were praised for being{' '}
        <em>&ldquo;smart.&rdquo;</em> The other half for being <em>&ldquo;hard-working.&rdquo;</em> Then she gave them an
        increasingly hard puzzle. The &ldquo;smart&rdquo; kids quit fast — avoiding the chance to look stupid.
        The &ldquo;hard-working&rdquo; kids dove deeper, finding the puzzle <em>more</em> interesting because it
        was harder. That one experiment opened a 30-year research programme on the most powerful idea
        in modern psychology: <strong>mindset</strong>.
      </p>

      <Section id="definition" title="Definition: what is a growth mindset?">
        <p>
          <strong>Growth mindset</strong> is the belief that abilities — intelligence, talent,
          character — can be developed through effort, strategy, and good feedback. Its opposite,{' '}
          <strong>fixed mindset</strong>, is the belief that those things are essentially innate and
          unchangeable.
        </p>
        <p>The two mindsets produce dramatically different responses to identical situations:</p>

        <ComparisonTable
          headers={['Situation', 'Fixed mindset response', 'Growth mindset response']}
          rows={[
            ['Hard problem', 'Avoid — risk of looking stupid', 'Engage — chance to grow'],
            ['Effort required', '"If I have to try, I must not be talented"', '"Effort is how skill is built"'],
            ['Criticism', 'Defensive, takes it personally', 'Extracts the useful signal'],
            ['Other people\'s success', 'Threatening, feels diminishing', 'Inspiring, possible to learn from'],
            ['Setback', 'Confirms inadequacy', 'Diagnostic data for next attempt'],
            ['Identity statement', '"I\'m good at math"', '"I\'m learning math"'],
          ]}
        />

        <PullQuote>
          The passion for stretching yourself and sticking to it, even (or especially) when it&rsquo;s not
          going well, is the hallmark of the growth mindset. — Carol Dweck
        </PullQuote>
      </Section>

      <Section id="what" title="What the research actually shows">
        <p>The mindset findings are some of the most-replicated in modern psychology:</p>

        <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-emerald-700">
              <AnimatedCounter end={40} suffix="%" />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Lower-income students with growth mindset training
            </div>
            <div className="mt-1 text-[11.5px] text-zinc-600">improved their math grades vs control (Yeager &amp; Dweck, 2019)</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-sky-700">
              <AnimatedCounter end={3} suffix="x" />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700">
              More likely to persist through difficulty
            </div>
            <div className="mt-1 text-[11.5px] text-zinc-600">in growth-mindset workers (Dweck, multiple workplace studies)</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center">
            <div className="text-[2.2rem] font-extrabold leading-none tabular-nums text-amber-700">
              <AnimatedCounter end={2.5} suffix="x" decimals={1} />
            </div>
            <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Higher leadership ratings
            </div>
            <div className="mt-1 text-[11.5px] text-zinc-600">in growth-mindset CEOs vs fixed-mindset (HBR / Heslin et al.)</div>
          </div>
        </div>

        <p>
          Critically, mindset isn&rsquo;t a personality trait — it&rsquo;s a learned belief. People can have
          growth mindset about cooking and fixed mindset about math. The same person can shift across
          domains, across days. Which is good news: it&rsquo;s changeable.
        </p>
      </Section>

      <Section id="when" title="When fixed mindset shows up (the 4 traps)">
        <p>
          Even people who consider themselves growth-mindset slip into fixed thinking in 4 predictable
          situations:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>When success comes easily.</strong> If you&rsquo;ve been told you&rsquo;re smart, you may avoid challenges where the smart label could be revoked.</li>
          <li><strong>When you compare yourself to peers.</strong> Social comparison reliably triggers fixed thinking — &ldquo;why can&rsquo;t I do what they do?&rdquo;</li>
          <li><strong>When the stakes are high.</strong> Job interviews, public speaking, performance reviews. The brain defaults to protection mode.</li>
          <li><strong>When you face genuine plateaus.</strong> Skill plateaus feel like proof you&rsquo;ve hit your ceiling. Fixed mindset accepts it. Growth mindset asks &ldquo;what&rsquo;s the new training stimulus?&rdquo;</li>
        </ul>
        <Callout icon="🚨" title="The diagnostic question">
          Next time you face difficulty, ask: <em>am I treating this as a verdict on who I am, or as data about what to do next?</em> The first is fixed mindset. The second is growth.
        </Callout>
      </Section>

      <Section id="how" title="How to develop a growth mindset (6 steps)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Add the word "yet"</h3>
        <p>
          The single highest-leverage linguistic shift in mindset work. Convert every &ldquo;I can&rsquo;t do
          X&rdquo; into &ldquo;I can&rsquo;t do X <em>yet</em>.&rdquo; The added word transforms a verdict into a milestone.
          Dweck calls this &ldquo;the power of yet&rdquo; — and schools that adopted it as institutional language
          saw measurable mindset shifts within a year.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Praise effort, not talent (yours included)</h3>
        <p>
          When you (or your kids, team, partner) succeed, attribute it to specific effort and strategy:{' '}
          <em>&ldquo;You worked through that systematically — that&rsquo;s why it clicked.&rdquo;</em> Not{' '}
          <em>&ldquo;You&rsquo;re so smart.&rdquo;</em> Effort praise reinforces growth mindset; talent praise installs
          fixed mindset.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Embrace struggle as the signal</h3>
        <p>
          Reframe difficulty: struggling means you&rsquo;re working in the right zone. If something feels
          easy, you&rsquo;re probably not improving. See our piece on{' '}
          <Link href="/blog/productive-failure" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            productive failure
          </Link>{' '}
          — struggle isn&rsquo;t the cost of learning, it&rsquo;s the mechanism.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Separate identity from performance</h3>
        <p>
          Your math test score isn&rsquo;t a measure of you. Your project failure isn&rsquo;t a measure of you.
          They&rsquo;re measures of <em>that attempt</em>. The growth-mindset move is to keep the identity
          ("I&rsquo;m a learner") and let the performance be just performance.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Seek feedback aggressively</h3>
        <p>
          Fixed mindset avoids feedback (it&rsquo;s a threat). Growth mindset hunts feedback (it&rsquo;s
          information). The simplest practice: ask one person each week, <em>&ldquo;what&rsquo;s one thing I
          could do better?&rdquo;</em> Stomach the answer. Apply it.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Notice and name fixed-mindset moments</h3>
        <p>
          Dweck&rsquo;s most actionable technique: give your fixed-mindset voice a name. When it shows up
          (&ldquo;you&rsquo;ll embarrass yourself,&rdquo; &ldquo;you&rsquo;re not good enough&rdquo;), label it: <em>&ldquo;Oh, that&rsquo;s [name]
          again.&rdquo;</em> Naming it externalises it. You stop being the voice and become someone observing
          the voice.
        </p>
      </Section>

      <Section id="why" title="Why mindset matters more than any single skill">
        <p>
          Mindset is the upstream variable. It determines whether you take on the challenges that build
          skill — and whether you stick with them long enough to develop expertise. Three structural
          reasons it dominates:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>It compounds across years.</strong> A growth mindset compounds — every challenge
            attempted, every skill developed, every setback survived adds to the next round. By
            mid-career, growth-mindset people are operating in a completely different skill landscape.
          </li>
          <li>
            <strong>It changes what you find interesting.</strong> Fixed mindset finds &ldquo;already-good-at-it&rdquo;
            things interesting. Growth mindset finds &ldquo;hard-and-meaningful&rdquo; things interesting. The
            difference in attention allocation across a decade is enormous.
          </li>
          <li>
            <strong>It changes your relationship with failure.</strong> Fixed mindset experiences
            failure as a self-statement. Growth mindset experiences it as data. The first paralyses;
            the second propels. See our piece on{' '}
            <Link href="/blog/why-new-year-resolutions-fail" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              why resolutions fail
            </Link>{' '}
            — most failures of personal change are mindset failures, not capability ones.
          </li>
        </ul>
        <PullQuote>
          Becoming is better than being. — Carol Dweck
        </PullQuote>

        <Callout icon="📋" title="Your 7-day mindset shift">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Add &ldquo;yet&rdquo; to one self-limiting statement per day.</li>
            <li>Praise effort (yours or someone else&rsquo;s) explicitly, with specifics.</li>
            <li>Take on one task that feels mildly threatening.</li>
            <li>Ask one person for one piece of feedback. Apply it.</li>
            <li>Name your fixed-mindset voice. Notice when it shows up.</li>
            <li>Reread one of your past failures as data, not verdict.</li>
            <li>End the week: what got harder? What did you learn?</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear is built around growth-mindset assumptions: every habit you track is a vote
          for who you&rsquo;re becoming, not a verdict on who you are. The streak counter rewards the
          showing up, not the perfection. The goals system encourages identity statements
          (&ldquo;I&rsquo;m someone who…&rdquo;) rather than outcomes (&ldquo;achieve X&rdquo;). See{' '}
          <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            identity-based habits
          </Link>{' '}
          for the deeper pattern.
        </p>
      </Section>
    </BlogLayout>
  );
}
