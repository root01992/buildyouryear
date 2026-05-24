import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'deep-work-how-to-focus';
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
        Cal Newport calls it &ldquo;the superpower of the 21st century.&rdquo; <strong>Deep work</strong> — the
        ability to focus without distraction on a cognitively demanding task — is simultaneously
        becoming rarer (because the world is louder) and more valuable (because rare things are
        rewarded). Here&rsquo;s what deep work actually is, why most workdays are full of &ldquo;shallow work&rdquo;
        masquerading as productivity, and the four rules to build a real deep-work practice.
      </p>

      <Section id="definition" title="Definition: what is deep work?">
        <p>
          From Cal Newport&rsquo;s 2016 book <em>Deep Work</em>:
        </p>
        <PullQuote>
          Deep work: Professional activities performed in a state of distraction-free concentration that
          push your cognitive capabilities to their limit. These efforts create new value, improve your
          skill, and are hard to replicate.
        </PullQuote>
        <p>
          Its opposite is <strong>shallow work</strong>: &ldquo;non-cognitively demanding, logistical-style
          tasks, often performed while distracted.&rdquo; Email. Slack threads. Status meetings. Inbox zero.
          Shallow work doesn&rsquo;t require — or build — meaningful skill.
        </p>
        <p>
          The framework&rsquo;s power is that it draws a sharp line. Every hour of your workday is either
          deep or shallow. There&rsquo;s no middle. Most knowledge workers spend &lt;25% of their week in
          deep work and don&rsquo;t realise it.
        </p>
      </Section>

      <Section id="what" title="What separates deep work from shallow work">
        <p>The two have measurably different fingerprints:</p>

        {/* Deep vs shallow value chart */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Value created per hour, by work type
          </div>
          <svg viewBox="0 0 360 180" className="h-44 w-full">
            <line x1="40" y1="155" x2="350" y2="155" stroke="#d4d4d8" />
            {/* Shallow bar */}
            <rect x="80" y="100" width="80" height="55" fill="#a1a1aa" rx="3" />
            <text x="120" y="125" fontSize="13" fontWeight="800" fill="white" textAnchor="middle">$$</text>
            <text x="120" y="170" fontSize="10.5" fill="#52525b" fontWeight="700" textAnchor="middle">Shallow work</text>
            <text x="120" y="91" fontSize="9.5" fill="#71717a" textAnchor="middle">replicable, low rate</text>
            {/* Deep bar */}
            <rect x="220" y="30" width="80" height="125" fill="#10b981" rx="3" />
            <text x="260" y="100" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">$$$$$</text>
            <text x="260" y="170" fontSize="10.5" fill="#52525b" fontWeight="700" textAnchor="middle">Deep work</text>
            <text x="260" y="22" fontSize="9.5" fill="#047857" fontWeight="700" textAnchor="middle">rare, compounds</text>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            Shallow work earns market rate (anyone can do it). Deep work earns premium rate AND
            compounds into rarer skills over time.
          </div>
        </div>

        <p>Three properties define deep work:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Cognitively demanding.</strong> The task uses your full attention — writing,
            coding, designing, analysing, deciding. If you can do it while half-watching Netflix, it&rsquo;s
            not deep work.
          </li>
          <li>
            <strong>Distraction-free.</strong> No tab-switching, no interruption windows, no
            background notifications. The literature is unambiguous: even brief context-switching costs
            up to 25 minutes of recovery time (Gloria Mark, UC Irvine).
          </li>
          <li>
            <strong>Skill-building.</strong> Deep work pushes against your current ceiling. The Anders
            Ericsson deliberate-practice research is the foundation: skill grows specifically through
            focused, effortful sessions.
          </li>
        </ul>
      </Section>

      <Section id="when" title="When deep work matters most (and when it doesn't)">
        <p>Deep work has the highest ROI for three kinds of work:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Skill-acquisition.</strong> Learning a new language, getting better at chess,
            mastering an instrument, leveling up at coding. None of this happens during shallow work.
          </li>
          <li>
            <strong>Knowledge creation.</strong> Writing, research, analysis, strategic thinking,
            engineering. The output quality is bounded by the quality of focus that went in.
          </li>
          <li>
            <strong>Decision-making on hard problems.</strong> The big calls — career pivots, project
            scoping, hiring decisions, architectural choices — improve dramatically with 90 minutes of
            uninterrupted thinking.
          </li>
        </ul>
        <p>
          It&rsquo;s less essential — sometimes a bad fit — for collaborative coordination, customer
          service, sales calls, anything where your value comes from real-time interaction.
        </p>
        <Callout icon="🎯" title="The acid test">
          Ask: <em>does this task get better if I do it slowly and carefully?</em> If yes, it&rsquo;s deep
          work. If &ldquo;slowly and carefully&rdquo; doesn&rsquo;t help (or hurts), it&rsquo;s shallow — and that&rsquo;s fine,
          just don&rsquo;t protect deep-work hours for it.
        </Callout>
      </Section>

      <Section id="how" title="How to build a deep-work practice (Newport's 4 rules)">

        <h3 className="mt-5 text-[16px] font-bold tracking-tight text-zinc-900">Rule 1: Work deeply</h3>
        <p>
          Choose a deep-work philosophy and commit to it. Newport identifies four styles, ranked by
          intensity:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Monastic:</strong> radically isolated, e.g. Donald Knuth refusing email for decades. Almost no one can do this.</li>
          <li><strong>Bimodal:</strong> alternating between deep retreats and connected periods. Researchers and academics often live here.</li>
          <li><strong>Rhythmic:</strong> a daily deep-work block at the same time. Most achievable for full-time workers.</li>
          <li><strong>Journalistic:</strong> grabbing deep-work bursts whenever they appear. Hardest — requires elite focus muscle.</li>
        </ul>
        <p>
          Start with <strong>rhythmic</strong>. A 90-minute morning block, same time every weekday.
          Stack it onto your morning routine (see our piece on{' '}
          <Link href="/blog/morning-routine-for-high-performers" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            morning routines
          </Link>
          ) and protect it from everything.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">Rule 2: Embrace boredom</h3>
        <p>
          Counterintuitively, your ability to focus on hard tasks is a function of how often you train
          your brain to <em>not</em> reach for distraction. The fix:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Don&rsquo;t use your phone during boring moments (waiting in line, lifts, queues).</li>
          <li>Resist the urge to check email or social media during work tasks &mdash; even &ldquo;quick checks.&rdquo;</li>
          <li>Schedule when you check distraction sources. Outside those windows: nothing.</li>
        </ul>
        <p>
          The brain is plastic. A few weeks of consistent practice raises your focus ceiling
          measurably. A few weeks of constant phone-checking does the opposite.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">Rule 3: Quit social media (or at least audit it)</h3>
        <p>
          Newport&rsquo;s more polarising rule. The core argument isn&rsquo;t that all social media is bad — it&rsquo;s
          that <em>most</em> people use most social media as background noise, and that background
          noise erodes deep-work capability.
        </p>
        <p>
          Practical version: for the next 30 days, delete the apps from your phone (keep web access if
          you need it). Notice what stops happening. Add back only what passes a clear cost-benefit
          test.
        </p>

        <h3 className="mt-6 text-[16px] font-bold tracking-tight text-zinc-900">Rule 4: Drain the shallows</h3>
        <p>
          Most workers spend 60-80% of their week on shallow work — and don&rsquo;t realise it because it
          feels busy. The fixes:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Schedule every minute (see our piece on{' '}
            <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              time blocking
            </Link>
          ).</li>
          <li>Quantify shallow work: count how many hours per week you spend on email/Slack/meetings. If &gt;50%, your work is at risk.</li>
          <li>Cap shallow work. Newport recommends a shallow-work budget — e.g. &ldquo;no more than 2 hours/day on email + Slack.&rdquo;</li>
          <li>Batch and timebox. Email gets 30 minutes at 11am and 30 minutes at 4pm. That&rsquo;s the whole budget.</li>
        </ul>
      </Section>

      <Section id="why" title="Why deep work is becoming a market advantage">
        <p>
          Newport&rsquo;s thesis is economic: as work becomes more cognitive, the rare ability to focus
          deeply commands a premium wage. Three structural forces make this true:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>The Great Restructuring.</strong> Economists (Brynjolfsson, McAfee) argue that the
            knowledge-work economy increasingly rewards three groups: those who work with intelligent
            machines, those with capital, and <strong>those who can master hard cognitive skills</strong>.
            Deep work is the road into the third group.
          </li>
          <li>
            <strong>The attention economy is in arms race.</strong> Every product on your phone is
            engineered by hundreds of people to capture your attention. Resisting that capture is now
            a skill — one most people don&rsquo;t have. Whoever can do it has an unfair advantage on any
            cognitive task.
          </li>
          <li>
            <strong>Compounding.</strong> Hours of deep work build skill nonlinearly. A year of
            consistent 90-minute deep-work sessions is roughly 350 hours — enough, by Anders Ericsson&rsquo;s
            data, to take you from beginner to advanced in most knowledge domains.
          </li>
        </ul>
        <PullQuote>
          A deep life is a good life. — Cal Newport
        </PullQuote>

        <Callout icon="📋" title="Your deep-work starter kit (Week 1)">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Block a 90-minute morning slot, 5 days/week.</li>
            <li>Phone in another room or on airplane mode during the block.</li>
            <li>One task per block. Decide it the night before.</li>
            <li>Track each completed block (a habit in your tracker is perfect for this).</li>
            <li>After 4 weeks, expand: longer blocks, more days, or move to a 2-block day.</li>
          </ol>
        </Callout>

        <p>
          BuildYourYear treats deep work like a habit, which is the right framing — it&rsquo;s a daily
          practice, not a one-off heroic effort. Track &ldquo;90-min deep-work block&rdquo; as one of your daily
          habits, and the 12-week heatmap will show you the truth about your actual consistency. Most
          people overestimate how much deep work they do by 2-3x. The heatmap doesn&rsquo;t lie. For deeper
          context, read on:{' '}
          <Link href="/blog/eisenhower-matrix-explained" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            the Eisenhower Matrix
          </Link>
          ,{' '}
          <Link href="/blog/time-blocking-101" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            time blocking
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
