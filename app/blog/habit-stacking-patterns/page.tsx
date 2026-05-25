import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'habit-stacking-patterns';
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
        James Clear gave one example in <em>Atomic Habits</em>:{' '}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-[13px] font-mono">
          &ldquo;After [CURRENT HABIT], I will [NEW HABIT].&rdquo;
        </code>{' '}
        Millions of people memorised it. Most of them then quit the new habit by day 30 — because the
        basic stack pattern doesn&rsquo;t suit every habit. There are actually{' '}
        <strong><AnimatedCounter end={7} className="text-emerald-700" /> distinct habit stacking
        patterns</strong>, each with different strengths. Here&rsquo;s the complete library — pick the right
        pattern and your stack survives the year.
      </p>

      <Section id="definition" title="Definition: what is habit stacking?">
        <p>
          <strong>Habit stacking</strong> is the technique of using an existing habit as the trigger
          (cue) for a new habit. Instead of inventing a new trigger from scratch — which is what most
          failed habits do — you piggyback on a behaviour that&rsquo;s already automatic.
        </p>
        <p>
          The mechanism is neurological: the brain consolidates pairs of behaviours that consistently
          co-occur. If you always run after putting on your shoes, &ldquo;shoes&rdquo; eventually triggers
          &ldquo;run.&rdquo; Habit stacking deliberately engineers these pairs.
        </p>
        <p>The basic format (Clear&rsquo;s original):</p>
        <PullQuote>
          After [CURRENT HABIT], I will [NEW HABIT].
        </PullQuote>
        <p>
          It works. But the basic version is just one of 7 patterns — and several of the others are
          better suited to specific kinds of habits.
        </p>
      </Section>

      <Section id="what" title="What the 7 patterns look like">
        <p>Each pattern has a different shape and a different ideal use case:</p>

        {/* 7 stacking patterns visual */}
        <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { n: 1, name: 'Linear (after / before)', emoji: '➡️', desc: 'After [A], I will [B]. The classic — best for single new habits.' },
            { n: 2, name: 'Sandwich', emoji: '🥪', desc: '[A] → [new B] → [A2]. Wedge new habit between two existing ones.' },
            { n: 3, name: 'Branching', emoji: '🌿', desc: 'After [A], I will do [B] AND [C]. One trigger spawns 2-3 habits.' },
            { n: 4, name: 'Chain', emoji: '⛓️', desc: '[A] → [B] → [C] → [D]. A morning routine is a 4-link chain.' },
            { n: 5, name: 'Contextual', emoji: '📍', desc: 'When I [enter X location], I will [B]. Place is the cue.' },
            { n: 6, name: 'Emotional', emoji: '💗', desc: 'When I feel [X emotion], I will [B]. Emotion is the cue (great for anxiety/anger interrupts).' },
            { n: 7, name: 'Time-anchored', emoji: '⏰', desc: 'At [specific time], I will [B]. Calendar/clock is the cue.' },
          ].map((p) => (
            <div key={p.n} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-[15px] font-bold text-emerald-700">
                  {p.n}
                </span>
                <span className="text-[16px] leading-none">{p.emoji}</span>
                <span className="text-[13.5px] font-bold text-zinc-900">{p.name}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="when" title="When to use each pattern (the decision guide)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Pattern 1: Linear (after / before)</h3>
        <p>
          <strong>Use when:</strong> adding a single habit to an existing daily routine.{' '}
          <strong>Example:</strong> &ldquo;After I pour my morning coffee, I will write 3 things I&rsquo;m
          grateful for.&rdquo; Best starting pattern. Reliable. Boring.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Pattern 2: Sandwich</h3>
        <p>
          <strong>Use when:</strong> the new habit is friction-heavy and needs to be locked between
          two reliable cues. <strong>Example:</strong> &ldquo;Brush teeth → floss (new) → mouthwash.&rdquo; The
          sandwich works because both ends are already automatic; the middle gets carried along.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Pattern 3: Branching</h3>
        <p>
          <strong>Use when:</strong> you have one strong cue and want to attach multiple small habits.{' '}
          <strong>Example:</strong> &ldquo;After I sit at my desk, I will (a) drink water, (b) review my top
          3 priorities, (c) open my deep-work doc.&rdquo; One trigger, three habits. Massive leverage —
          but only works if all 3 are small (under 2 minutes each).
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Pattern 4: Chain</h3>
        <p>
          <strong>Use when:</strong> building a routine (morning, evening, post-workout, pre-meeting).{' '}
          <strong>Example:</strong> &ldquo;Wake → water → 5 push-ups → cold shower → meditate → coffee → write.&rdquo;
          Each habit becomes the cue for the next. Powerful but fragile — break one link and the
          chain rebuilds slower than a single habit would.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Pattern 5: Contextual</h3>
        <p>
          <strong>Use when:</strong> the habit only makes sense in a specific place.{' '}
          <strong>Example:</strong> &ldquo;When I enter the kitchen, I will refill my water bottle.&rdquo; Place
          is the trigger. Great for reducing willpower load — the location does the reminder for you.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Pattern 6: Emotional</h3>
        <p>
          <strong>Use when:</strong> interrupting a reactive emotional habit (anxiety scroll, anger
          email, stress eating). <strong>Example:</strong> &ldquo;When I feel the urge to check Twitter, I
          will do 5 push-ups instead.&rdquo; The emotion is the cue. Slower to install — emotions are noisier
          triggers — but uniquely powerful for breaking bad habits.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Pattern 7: Time-anchored</h3>
        <p>
          <strong>Use when:</strong> the new habit has no natural existing-habit anchor.{' '}
          <strong>Example:</strong> &ldquo;At 11:30am, I will take a 10-minute walk.&rdquo; Phone alarm is the
          trigger. Use sparingly — alarms are easy to dismiss compared to behavioural triggers — but
          essential for habits with no neighbouring routine.
        </p>

        <Callout icon="🧠" title="The pattern picker">
          <p>Quick decision tree:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>One new habit, existing routine → <strong>Linear</strong></li>
            <li>Friction-heavy new habit → <strong>Sandwich</strong></li>
            <li>Want to install 2-3 small habits at once → <strong>Branching</strong></li>
            <li>Building a routine → <strong>Chain</strong></li>
            <li>Place-specific habit → <strong>Contextual</strong></li>
            <li>Breaking a bad emotional reaction → <strong>Emotional</strong></li>
            <li>No good anchor exists → <strong>Time-anchored</strong></li>
          </ul>
        </Callout>
      </Section>

      <Section id="how" title="How to design a stack that actually sticks (5 rules)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. The anchor must be 100% reliable</h3>
        <p>
          The existing habit you stack onto needs near-100% consistency. Stacking onto &ldquo;after I check
          email&rdquo; (which you do, but not at consistent times) is worse than stacking onto &ldquo;after I
          pour morning coffee&rdquo; (which you do at the same time, in the same place, every day).
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. The new habit should be tiny</h3>
        <p>
          The two-minute rule applies. If the new habit takes 30 minutes, the stack will break the
          first time you&rsquo;re running late. Start with the smallest viable version. (See our piece on{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the two-minute rule
          </Link>
          .)
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Stack at the right time of day</h3>
        <p>
          Morning stacks succeed more than evening stacks — willpower is higher, calendar is emptier,
          and the day hasn&rsquo;t derailed yet. If you have a choice, anchor early.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Write the stack down</h3>
        <p>
          The explicit sentence — &ldquo;After [A], I will [B]&rdquo; — is doing real work. Researchers call it an
          implementation intention; studies (Gollwitzer 1999) put adherence increases at 2-3x just from
          writing the if-then explicitly.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Track only the new link</h3>
        <p>
          Don&rsquo;t track the entire stack. Track the new behaviour. The anchor is automatic; tracking it
          dilutes the signal. The new habit is the dependent variable.
        </p>
      </Section>

      <Section id="why" title="Why habit stacking outperforms standalone habit-building">
        <p>Three reasons stacks are more durable than freestanding habits:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Trigger reliability is borrowed, not built.</strong> The hardest part of any new
            habit is remembering to do it. Stacking inherits the reliability of an existing trigger —
            so you skip the &ldquo;forgot to do it&rdquo; failure mode that kills 60%+ of new habits.
          </li>
          <li>
            <strong>The neural pathway already exists.</strong> Your brain already grooved the path
            for the anchor habit. Adding a step at the end is incremental, not foundational. Cheap.
          </li>
          <li>
            <strong>Identity is reinforced.</strong> Each chained habit becomes evidence for the
            identity the stack implies. A morning stack of &ldquo;water → push-ups → write&rdquo; reinforces
            &ldquo;I&rsquo;m the kind of person who takes care of myself.&rdquo; See our piece on{' '}
            <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              identity-based habits
            </Link>
            .
          </li>
        </ul>
        <PullQuote>
          Don&rsquo;t build a new trigger. Borrow an existing one. That&rsquo;s the entire move.
        </PullQuote>

        <Callout icon="📋" title="Your 5-minute first stack">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Pick ONE existing habit that&rsquo;s 100% reliable.</li>
            <li>Pick ONE new habit you can do in under 2 minutes.</li>
            <li>Write it as: &ldquo;After [A], I will [B].&rdquo;</li>
            <li>Put the sentence somewhere visible.</li>
            <li>Track only the new habit for 30 days.</li>
            <li>Add a second only when the first feels automatic.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear&rsquo;s habit module is designed for stacking. Each habit you create can name an
          anchor in its description — and when you see the daily check-in next to the anchor habit,
          the stack pattern reinforces itself visually. By month 3, the heatmap shows which stacks
          held and which broke; that data informs the next round.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/how-to-build-habits-that-stick" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            how to build habits that stick
          </Link>
          ,{' '}
          <Link href="/blog/two-minute-rule" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the two-minute rule
          </Link>
          , and{' '}
          <Link href="/blog/morning-routine-for-high-performers" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the morning routine playbook
          </Link>
          .
        </p>
      </Section>
    </BlogLayout>
  );
}
