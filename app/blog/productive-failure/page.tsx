import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'productive-failure';
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
        At <AnimatedCounter end={2008} className="font-bold text-emerald-700" />, learning scientist
        Manu Kapur ran a counterintuitive experiment. He gave one group of students a problem AFTER
        teaching them the solution. He gave another group the SAME problem with no instruction first
        — let them struggle, fail, then taught the solution. The struggle group learned the material{' '}
        <strong><AnimatedCounter end={2} suffix="x" className="text-emerald-700" /> better</strong> on
        transfer tests weeks later. Kapur named the phenomenon{' '}
        <strong>productive failure</strong> — and it&rsquo;s the most underused learning principle in
        modern education.
      </p>

      <Section id="definition" title="Definition: what is productive failure?">
        <p>
          <strong>Productive failure</strong> is the deliberate practice of attempting hard problems{' '}
          <em>before</em> being shown the answer — even though you&rsquo;ll fail. The failure isn&rsquo;t
          incidental; it&rsquo;s the mechanism. The struggle creates the cognitive structures that make
          the subsequent learning stick.
        </p>
        <p>
          The phrase &ldquo;productive failure&rdquo; comes from Kapur&rsquo;s 2008 paper. Related concepts:{' '}
          <strong>desirable difficulty</strong> (Robert Bjork), <strong>generative learning</strong>{' '}
          (Wittrock), and the broader principle from neuroscience that the brain consolidates new
          information much better when it&rsquo;s already wrestled with the problem.
        </p>
        <PullQuote>
          Smooth learning produces shallow knowledge. Productive failure produces durable expertise.
        </PullQuote>
      </Section>

      <Section id="what" title="What's actually happening in the brain">
        <p>Three converging mechanisms explain why struggle works:</p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Activation of prior knowledge</h3>
        <p>
          When you struggle with a problem, your brain searches existing knowledge for analogies and
          patterns. Even if it doesn&rsquo;t find the answer, the search activates and connects related
          concepts. When the teaching comes after, you have hooks to hang it on. Without the struggle,
          the teaching slides off into temporary memory.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Generation of hypotheses</h3>
        <p>
          Struggling forces you to invent partial solutions, hypothesise mechanisms, propose
          frameworks. Even when these are wrong (often especially when they&rsquo;re wrong), the act of
          generating them creates the conceptual scaffold that the correct answer fits onto.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Increased motivation to learn the solution</h3>
        <p>
          Once you&rsquo;ve struggled, you genuinely want the answer. You&rsquo;re paying attention. The teaching
          isn&rsquo;t abstract; it&rsquo;s the resolution to a problem you care about. Attention drives
          encoding, encoding drives retention.
        </p>

        {/* Learning curves comparison */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Learning curves: smooth instruction vs productive failure (over 8 weeks)
          </div>
          <svg viewBox="0 0 360 170" className="h-40 w-full">
            <defs>
              <linearGradient id="pfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="40" y1="140" x2="340" y2="140" stroke="#d4d4d8" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#d4d4d8" />

            {/* Smooth: fast early, slow late, plateaus */}
            <path
              d="M 40 130 Q 80 80, 120 60 T 220 50 T 340 60"
              fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 3"
            />
            <text x="180" y="40" fontSize="9.5" fill="#92400e" textAnchor="middle" fontWeight="700">
              Smooth instruction
            </text>
            <text x="180" y="52" fontSize="8.5" fill="#92400e" textAnchor="middle">(fast start, flat plateau)</text>

            {/* Productive failure: slow start, accelerates, surpasses */}
            <path
              d="M 40 130 Q 80 135, 120 120 T 220 70 T 340 25"
              fill="url(#pfFill)" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round"
            />
            <text x="280" y="40" fontSize="9.5" fill="#047857" textAnchor="middle" fontWeight="700">
              Productive failure
            </text>

            <text x="40" y="160" fontSize="9" fill="#52525b">Week 0</text>
            <text x="340" y="160" fontSize="9" fill="#52525b" textAnchor="end">Week 8</text>
            <text x="36" y="138" fontSize="9" fill="#71717a" textAnchor="end">low</text>
            <text x="36" y="32" fontSize="9" fill="#71717a" textAnchor="end">high</text>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            Smooth instruction has a faster early curve. Productive failure starts slower but compounds
            — surpassing smooth instruction by week 4 and pulling ahead non-linearly after that.
          </div>
        </div>
      </Section>

      <Section id="when" title="When productive failure works (and when it backfires)">
        <p>Productive failure works best when:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>The problem is at the edge of your current skill</strong> — within reach with effort, not impossible</li>
          <li><strong>You have some related knowledge</strong> to bring to bear — pure beginners need scaffolding first</li>
          <li><strong>You will actually receive the solution afterward</strong> — struggling without ever getting the answer is just frustration</li>
          <li><strong>The domain rewards deep understanding</strong> — math, programming, language, music, writing, design</li>
        </ul>
        <p>It backfires when:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>The problem is far beyond your skill</strong> (no productive failure — just demoralising failure)</li>
          <li><strong>You quit during the struggle phase</strong> (need to push through to the learning moment)</li>
          <li><strong>The domain rewards memorisation only</strong> (spaced repetition works better — see our piece on{' '}
            <Link href="/blog/spaced-repetition-memory" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              spaced repetition
            </Link>
            )
          </li>
        </ul>
        <Callout icon="🎯" title="The right-sized struggle">
          The sweet spot is problems where you have 50-70% of the necessary knowledge and the
          remaining 30-50% requires reaching. Too easy = no struggle benefit. Too hard = quitting.
          That &ldquo;productive struggle zone&rdquo; is where learning compounds.
        </Callout>
      </Section>

      <Section id="how" title="How to design productive failure into your learning">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">1. Try first, then look it up</h3>
        <p>
          Whatever you&rsquo;re learning — coding, language, instrument, math — attempt the problem before
          consulting the solution. Even 15 minutes of struggle before the AI/tutorial/teacher
          dramatically improves retention.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">2. Use the &ldquo;5-minute write-up&rdquo; rule</h3>
        <p>
          Before looking up an answer, spend 5 minutes writing your best guess, your reasoning, and
          where you got stuck. This single practice — popularised by Anders Ericsson&rsquo;s deliberate
          practice research — captures most of the productive-failure benefit.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">3. Solve real problems, not toy ones</h3>
        <p>
          Toy problems with known answers produce shallow learning. Real problems with stakes (a real
          project, a real bug, a real client) produce productive failure naturally — the failure
          matters, which accelerates the encoding.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">4. Teach what you just learned</h3>
        <p>
          The Feynman technique: explain what you learned to someone (or to a rubber duck, or to a
          blank page). Gaps in your understanding immediately surface as struggle. Filling those gaps
          is productive failure operating in reverse.
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">5. Embrace the &ldquo;getting harder&rdquo; feeling</h3>
        <p>
          As your skill grows, the things that used to feel easy become uninteresting. Move to harder
          problems — and accept that the failure rate goes up. If you&rsquo;re always succeeding, you&rsquo;re
          probably not learning anymore. See our piece on{' '}
          <Link href="/blog/growth-mindset-carol-dweck" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            growth mindset
          </Link>
          .
        </p>
      </Section>

      <Section id="why" title="Why this matters more than 'more hours studying'">
        <p>Three reasons productive failure beats raw study time:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Quality of attention beats quantity.</strong> 30 minutes of genuine struggle
            produces more learning than 3 hours of passive reading. The brain encodes much harder
            during struggle than during smooth comprehension.
          </li>
          <li>
            <strong>It produces transferable knowledge.</strong> Smooth-instruction learners can solve
            problems that look exactly like the practiced ones. Productive-failure learners can solve
            adjacent problems they&rsquo;ve never seen. Transfer is the actual test of expertise.
          </li>
          <li>
            <strong>It builds the &ldquo;hard things&rdquo; muscle.</strong> Over years, the person comfortable
            with struggle attempts harder things — and develops dramatically more capability. The
            comfort with struggle becomes a meta-skill.
          </li>
        </ul>
        <PullQuote>
          You don&rsquo;t learn things by being told them. You learn them by struggling to figure them out
          and then being told them.
        </PullQuote>

        <Callout icon="📋" title="Your productive failure protocol">
          <ol className="list-decimal space-y-1 pl-5">
            <li>For your next learning task, write down what you think you know first.</li>
            <li>Attempt the problem cold for 15 minutes — no Google, no AI.</li>
            <li>Document your reasoning, even where it&rsquo;s wrong.</li>
            <li>Look up the solution. Compare to your attempt.</li>
            <li>Identify the specific gap between your model and the right answer.</li>
            <li>Teach what you learned to someone or write it as if you were teaching.</li>
          </ol>
        </Callout>

        <p>
          The BuildYourYear framework treats productive failure as a feature: missed habits aren&rsquo;t
          erased — they&rsquo;re visible on the heatmap as data. A missed week tells you something about
          your environment, your habit design, or your priorities. The setbacks become diagnostic. By
          month 3, the patterns you&rsquo;ve learned from your own friction outperform any external advice.
        </p>
        <p>
          For related reading:{' '}
          <Link href="/blog/growth-mindset-carol-dweck" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            growth mindset
          </Link>
          ,{' '}
          <Link href="/blog/antifragile-build-stronger-systems" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            antifragile systems
          </Link>
          , and{' '}
          <Link href="/blog/spaced-repetition-memory" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            spaced repetition
          </Link>{' '}
          (the perfect complement: productive failure encodes concepts; spaced repetition retains them).
        </p>
      </Section>
    </BlogLayout>
  );
}
