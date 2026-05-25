import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'spaced-repetition-memory';
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
        In <AnimatedCounter end={1885} className="font-bold text-emerald-700" />, German psychologist
        Hermann Ebbinghaus did something nobody had attempted: he memorised{' '}
        <AnimatedCounter end={2300} className="font-bold text-emerald-700" /> nonsense syllables, then
        tested himself at intervals to see how fast he forgot. He discovered the{' '}
        <strong>forgetting curve</strong> — and the cure for it. <strong>Spaced repetition</strong>{' '}
        leverages that 140-year-old finding to cut study time by{' '}
        <strong><AnimatedCounter end={80} suffix="%" className="text-emerald-700" /></strong> while
        improving retention. Here&rsquo;s the science, the apps that work, and the protocol.
      </p>

      <Section id="definition" title="Definition: what is spaced repetition?">
        <p>
          <strong>Spaced repetition</strong> is a learning technique that schedules reviews of
          previously studied material at expanding intervals — review on day 1, then day 3, then day
          7, then day 14, etc. The schedule is designed to catch each piece of information just before
          you would have forgotten it.
        </p>
        <p>The system is implemented today through apps:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Anki</strong> — free, open-source, the gold standard for serious learners</li>
          <li><strong>SuperMemo</strong> — Piotr Wozniak&rsquo;s original algorithm, more academic</li>
          <li><strong>Quizlet</strong> — easier UX, popular with students</li>
          <li><strong>RemNote</strong> — combines notes + spaced repetition</li>
        </ul>
        <p>
          All use variants of the same underlying math: each successful recall increases the next
          interval (you don&rsquo;t need to see it again for a while); each failed recall resets the
          interval (you need it again soon).
        </p>
      </Section>

      <Section id="what" title="What the forgetting curve actually shows">

        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Ebbinghaus forgetting curve — and how spaced reviews flatten it
          </div>
          <svg viewBox="0 0 360 180" className="h-44 w-full">
            <line x1="40" y1="150" x2="340" y2="150" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="150" stroke="#d4d4d8" />

            {/* Without spaced repetition — exponential decay */}
            <path
              d="M 40 25 Q 80 90, 140 120 T 240 145 T 340 148"
              fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 3"
            />
            <text x="320" y="142" fontSize="9" fill="#be123c" textAnchor="end" fontWeight="700">
              without review: ~10% retained
            </text>

            {/* With spaced repetition — sawtooth that stays high */}
            <g>
              {/* drop + recovery */}
              <path d="M 40 25 L 70 60" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 70 60 L 75 25" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 2" />

              <path d="M 75 25 L 130 50" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 130 50 L 135 25" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 2" />

              <path d="M 135 25 L 215 45" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 215 45 L 220 25" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 2" />

              <path d="M 220 25 L 340 35" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
            </g>
            <text x="180" y="14" fontSize="9.5" fill="#047857" textAnchor="middle" fontWeight="700">
              with spaced reviews: ~95% retained
            </text>

            <text x="40" y="170" fontSize="9" fill="#52525b">Day 0</text>
            <text x="190" y="170" fontSize="9" fill="#52525b" textAnchor="middle">Day 30</text>
            <text x="340" y="170" fontSize="9" fill="#52525b" textAnchor="end">Day 90</text>
            <text x="36" y="32" fontSize="9" fill="#71717a" textAnchor="end">100%</text>
            <text x="36" y="152" fontSize="9" fill="#71717a" textAnchor="end">0%</text>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            Without review, exponential forgetting — by day 30 you remember ~10%. Each well-timed
            review resets the curve, and the intervals can grow larger each time.
          </div>
        </div>

        <p>The numbers from Ebbinghaus&rsquo;s original work (replicated many times since):</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Within 20 minutes</strong>: ~42% forgotten</li>
          <li><strong>Within 1 day</strong>: ~67% forgotten</li>
          <li><strong>Within 6 days</strong>: ~75% forgotten</li>
          <li><strong>Within 31 days</strong>: ~79% forgotten — then it stabilises</li>
        </ul>
        <p>
          The curve isn&rsquo;t linear — it&rsquo;s exponential. Most of the forgetting happens fast. Reviews
          timed at the right moments interrupt the curve and reset retention to near 100%, with each
          successful review extending the &ldquo;safe&rdquo; interval until the next.
        </p>
      </Section>

      <Section id="when" title="When spaced repetition is the right tool">
        <p>SRS works extraordinarily well for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Vocabulary in any language</strong> (Anki was originally built for Japanese kanji)</li>
          <li><strong>Medical school facts</strong> (medical students using Anki score higher on board exams, per multiple studies)</li>
          <li><strong>Programming syntax + APIs</strong></li>
          <li><strong>Legal cases, formulas, anatomy</strong></li>
          <li><strong>Historical dates, names, geography</strong></li>
          <li><strong>Music theory, poetry, lines, scripts</strong></li>
        </ul>
        <p>SRS is less helpful for:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Deep conceptual understanding</strong> (you need productive failure for that — see our piece on{' '}
            <Link href="/blog/productive-failure" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              productive failure
            </Link>
            )
          </li>
          <li><strong>Skills with motor / procedural components</strong> (you need actual practice)</li>
          <li><strong>Creative thinking</strong> (cards can&rsquo;t encode the generative process)</li>
        </ul>
        <Callout icon="🎯" title="The complementary pair">
          Productive failure builds the model; spaced repetition retains the facts. Used together,
          they cover both halves of expertise — the deep understanding AND the dense knowledge base.
        </Callout>
      </Section>

      <Section id="how" title="How to start spaced repetition (the 6-step setup)">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Pick an app</h3>
        <p>
          For most learners: <strong>Anki</strong> (free, the most-researched app, works on every
          platform). Quizlet for casual use. RemNote if you want notes + cards in one tool. The app
          matters less than the practice.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Make cards as you learn</h3>
        <p>
          Don&rsquo;t batch card-creation. Create cards immediately after learning a new fact, while it&rsquo;s
          fresh. The act of writing the card is itself a learning event. A few cards a day beats 100
          cards once.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Atomic cards (one fact per card)</h3>
        <p>
          The most common beginner mistake: cramming multiple facts into one card. Break each card
          down to one atomic question with one atomic answer. &ldquo;What&rsquo;s the capital of Germany?&rdquo; not
          &ldquo;Capitals of Europe.&rdquo;
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Use cloze deletions for facts in context</h3>
        <p>
          Instead of Q/A pairs for sentences, use cloze deletion: hide one word from a sentence, the
          rest is the cue. The brain remembers facts-in-context far better than facts-in-isolation.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Review daily, briefly</h3>
        <p>
          15-20 minutes a day, ideally at the same time. The app schedules the cards — you just do
          what it shows you. Skip a day and your queue accumulates; skip a week and you&rsquo;ll have
          hundreds of cards waiting. Daily consistency is the entire game.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">6. Trust the algorithm</h3>
        <p>
          Don&rsquo;t mark cards &ldquo;easy&rdquo; just to clear them. Don&rsquo;t mark them &ldquo;hard&rdquo; to be safe. Rate
          honestly — the algorithm uses your ratings to set the next interval. Honest feedback
          produces optimal scheduling; sandbagging breaks the system.
        </p>
      </Section>

      <Section id="why" title="Why spaced repetition beats cramming (and traditional studying)">
        <p>Three structural reasons SRS is the best memorisation system ever invented:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>It matches the brain&rsquo;s actual forgetting pattern.</strong> Cramming fights against
            biology — trying to hold everything in short-term memory. SRS works WITH biology, catching
            things just before they&rsquo;d be lost.
          </li>
          <li>
            <strong>Effort is bounded.</strong> The daily 15-minute review is a fixed commitment. The
            knowledge base grows; the daily effort doesn&rsquo;t. After a year of daily Anki, learners can
            have 5,000+ cards retained with the same daily time investment.
          </li>
          <li>
            <strong>The reviews ARE the learning.</strong> Active recall (forcing yourself to remember
            before seeing the answer) is dramatically more effective than re-reading. SRS makes active
            recall the daily practice.
          </li>
        </ul>
        <PullQuote>
          Anki is the most powerful productivity tool I&rsquo;ve ever used. — Michael Nielsen, quantum
          computing researcher
        </PullQuote>

        <Callout icon="📋" title="Your 30-day spaced-repetition starter">
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>Day 1:</strong> Install Anki. Create a deck for one specific knowledge area.</li>
            <li><strong>Day 1-7:</strong> Add 10-15 cards per day. Keep them atomic.</li>
            <li><strong>Daily, 15 min:</strong> Review whatever the app shows. Rate honestly.</li>
            <li><strong>Day 14:</strong> Audit — are your cards too dense? Break complex ones into atoms.</li>
            <li><strong>Day 30:</strong> Notice retention. Decide what knowledge area to add next.</li>
          </ol>
        </Callout>

        <p>
          Spaced repetition makes a habit out of remembering — which makes everything else in your
          learning stack work better. Combined with{' '}
          <Link href="/blog/productive-failure" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            productive failure
          </Link>{' '}
          (encoding) and{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>{' '}
          (practice), you have the complete expertise-building system. The BuildYourYear habit module
          handles the daily Anki review as one of your tracked habits — the streak counter takes care
          of the consistency, the algorithm takes care of the scheduling.
        </p>
        <p>
          By month 6 of consistent practice, learners typically retain 90%+ of what they put into the
          system — a number that&rsquo;s incomprehensible to anyone who&rsquo;s only done conventional study.
        </p>
      </Section>
    </BlogLayout>
  );
}
