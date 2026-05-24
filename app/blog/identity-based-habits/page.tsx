import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout, ComparisonTable } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'identity-based-habits';
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
        Two people set the same goal: &ldquo;run a marathon.&rdquo; A year later, one runs the marathon and
        keeps running. The other quit by March. The difference isn&rsquo;t willpower, discipline, or even
        training. It&rsquo;s the question they answered when they started. The quitter asked{' '}
        <em>&ldquo;what do I want to achieve?&rdquo;</em>. The finisher asked{' '}
        <strong>&ldquo;who do I want to become?&rdquo;</strong>. That reframe — outcome-based to identity-based —
        is the single most powerful idea in modern behaviour design.
      </p>

      <Section id="definition" title="Definition: what are identity-based habits?">
        <p>
          James Clear, in <em>Atomic Habits</em>, distinguishes three layers of behaviour change:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Outcome layer:</strong> what you want (lose 10 kg, write a book, save $50k).
            Goals.
          </li>
          <li>
            <strong>Process layer:</strong> what you do (workouts, writing sessions, savings
            transfers). Systems.
          </li>
          <li>
            <strong>Identity layer:</strong> who you believe you are (a runner, a writer, a saver).
            Beliefs.
          </li>
        </ul>
        <p>
          Most goal-setting operates at the outcome layer. Identity-based habits invert the stack:
          <strong> start with who you want to become; the outcomes and processes follow.</strong>
        </p>
        <PullQuote>
          The goal is not to read a book. The goal is to become a reader. The goal is not to run a
          marathon. The goal is to become a runner.
        </PullQuote>
      </Section>

      <Section id="what" title="What changes when you flip the layers (outcome → identity)">
        <p>
          The two framings produce strikingly different behaviour:
        </p>
        <ComparisonTable
          headers={['', 'Outcome-based', 'Identity-based']}
          rows={[
            ['Question asked', 'What do I want to achieve?', 'Who do I want to become?'],
            ['Time horizon', 'Until the goal is hit', 'Indefinite'],
            ['Motivation source', 'External (the prize)', 'Internal (the self-image)'],
            ['Response to setbacks', '"I failed; quit"', '"That\'s not who I am; recommit"'],
            ['What happens after success', 'Reverts (lost weight comes back)', 'Persists (you\'re still the kind of person)'],
            ['Example', 'Lose 10 kg', 'Become someone who lifts weights 3x/week'],
            ['Example', 'Write a book', 'Become a writer'],
            ['Example', 'Save $50k', 'Become a saver'],
          ]}
        />

        <p>
          The most striking column is &ldquo;what happens after success.&rdquo; Outcome-based goals are
          self-undermining: the moment you hit the number, the motivation evaporates. Identity-based
          habits are self-reinforcing: the success becomes evidence that you <em>are</em> this person,
          which feeds the next action.
        </p>
      </Section>

      <Section id="when" title="When identity-based habits work best (and when they don't)">
        <p>Identity framing is most powerful for behaviours that meet three criteria:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Recurring.</strong> The habit happens daily or weekly. One-off goals
            (&ldquo;complete a marathon&rdquo;) benefit less than ongoing practices (&ldquo;become a runner&rdquo;).
          </li>
          <li>
            <strong>Skill-building.</strong> The behaviour gets better with practice. Writing, exercise,
            language learning, instrument playing — all compound through identity adoption.
          </li>
          <li>
            <strong>Sustained for &gt;1 year.</strong> The compounding identity-confirming votes only
            kick in after months. For 30-day sprints, outcome framing is faster.
          </li>
        </ul>
        <Callout icon="⚠️" title="Where outcome framing wins">
          For tightly time-boxed goals with clear endpoints — &ldquo;ship the feature by Friday,&rdquo; &ldquo;pass the
          driving test next month&rdquo; — outcome framing is more efficient. You don&rsquo;t need to become a
          &ldquo;Friday-shipper&rdquo; identity; you just need to ship Friday.
        </Callout>
      </Section>

      <Section id="how" title="How to install an identity-based habit (in 4 steps)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Pick the identity, not the outcome</h3>
        <p>
          Write a single sentence: <em>&ldquo;I am the type of person who ___.&rdquo;</em>{' '}
          Fill the blank with something specific:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>&ldquo;I am the type of person who writes every morning.&rdquo;</li>
          <li>&ldquo;I am the type of person who never skips a workout.&rdquo;</li>
          <li>&ldquo;I am the type of person who saves first, spends second.&rdquo;</li>
          <li>&ldquo;I am the type of person who shows up.&rdquo;</li>
        </ul>
        <p>
          The sentence should describe behaviour, not feelings. &ldquo;I am a healthy person&rdquo; is vague.
          &ldquo;I am someone who exercises 4 times a week&rdquo; is operational.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Cast small daily votes</h3>
        <p>
          Identity isn&rsquo;t declared; it&rsquo;s <em>evidenced</em>. Every action is a small vote for the
          identity you&rsquo;re claiming. The math is brutal in your favour:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>1 vote = doubt</li>
          <li>10 votes = a habit forming</li>
          <li>100 votes = unshakeable belief</li>
        </ul>
        <p>
          You don&rsquo;t need every vote. You need a clear majority across time. A week of running with two
          missed days still says <em>&ldquo;mostly a runner.&rdquo;</em>
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Use identity language deliberately</h3>
        <p>
          Watch the words. There&rsquo;s a measurable difference between:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>&ldquo;I&rsquo;m <em>trying</em> to quit smoking&rdquo; → identity unchanged</li>
          <li>&ldquo;<em>No thanks, I&rsquo;m not a smoker</em>&rdquo; → identity reinforced (research: 2014 Behavioral Health study found this phrasing tripled quit-rate adherence)</li>
        </ul>
        <p>
          When you skip a workout, the language matters. &ldquo;I missed today&rdquo; is fine. &ldquo;I&rsquo;m terrible at
          this&rdquo; corrodes the identity. Talk to yourself like you talk to a friend.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Track the identity, not the outcome</h3>
        <p>
          Don&rsquo;t track weight; track workouts. Don&rsquo;t track word count; track writing sessions. Don&rsquo;t
          track net worth daily; track savings transfers. The visible tally is a stack of identity
          votes — and seeing it grow is what makes the identity stick. (Our piece on{' '}
          <Link href="/blog/habit-tracking-streaks-heatmaps" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            habit tracking
          </Link>{' '}
          covers the mechanism in depth.)
        </p>
      </Section>

      <Section id="why" title="Why identity is more durable than discipline">
        <p>
          Discipline is finite. Identity is generative. Here&rsquo;s the deeper reason:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Identity removes the decision.</strong> A &ldquo;runner&rdquo; doesn&rsquo;t decide whether to run.
            They run. The behaviour is downstream of who they are, not upstream of who they want to be.
            Decisions are expensive; identity makes them free.
          </li>
          <li>
            <strong>Identity survives setbacks.</strong> A goal can be missed. An identity can&rsquo;t —
            it can only be <em>contradicted</em>, and contradictions are easier to recover from than
            failures. &ldquo;I&rsquo;m still a runner; I just had a bad week&rdquo; rebuilds quickly. &ldquo;I failed my
            marathon goal&rdquo; ends the project.
          </li>
          <li>
            <strong>Identity compounds.</strong> Each behaviour reinforces the identity, which makes
            the next behaviour easier. Outcome-based habits get harder the longer you do them
            (motivation fades). Identity-based habits get easier — the identity becomes who you are.
          </li>
        </ul>
        <PullQuote>
          You don&rsquo;t rise to the level of your goals. You fall to the level of your systems. And
          underneath the systems is the identity that keeps showing up to maintain them.
        </PullQuote>

        <Callout icon="🪞" title="The mirror question">
          Once a week, ask: <em>looking at how I spent the last 7 days, who would a stranger say I am?</em>
          The answer is your real identity — not the one in your head. Most people are shocked to find
          the gap between aspirational identity and lived identity. Closing that gap is the entire game.
        </Callout>

        <Callout icon="📋" title="Your one-paragraph identity habit">
          <em>
            I am the type of person who [identity]. Every [frequency], I do [smallest behaviour] at
            [time/place]. When I miss, I remind myself: &ldquo;That&rsquo;s not who I am — I&rsquo;m back tomorrow.&rdquo;
            I track the votes, not the outcome. The identity is the goal. The behaviour is the proof.
          </em>
        </Callout>

        <p>
          BuildYourYear&rsquo;s habit module is explicitly identity-shaped. The check-ins aren&rsquo;t &ldquo;tasks
          completed&rdquo; — they&rsquo;re votes. The streak counter shows how many votes you&rsquo;ve cast in a
          row. The 12-week heatmap shows the density of votes over time. By month 3, the visible
          evidence forces a shift: you stop trying to be a runner and start <em>being</em> one. That
          shift is the entire job. The compounding takes over from there. For complementary frameworks,
          read on:{' '}
          <Link href="/blog/how-to-build-habits-that-stick" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            building habits that stick
          </Link>{' '}
          and{' '}
          <Link href="/blog/compound-effect-1-percent-better" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the compound effect of 1% daily
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
