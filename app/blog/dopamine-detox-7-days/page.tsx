import type { Metadata } from 'next';
import Link from 'next/link';
import BlogLayout, { Section, PullQuote, Callout } from '@/components/BlogLayout';
import AnimatedCounter from '@/components/blog/AnimatedCounter';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-posts';

const SLUG = 'dopamine-detox-7-days';
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
        &ldquo;Dopamine detox&rdquo; is the most-searched productivity term on TikTok — and{' '}
        <strong><AnimatedCounter end={90} suffix="%" className="text-rose-600" /> of what is said about
        it is wrong</strong>. You cannot &ldquo;deplete&rdquo; dopamine. You can&rsquo;t &ldquo;fast&rdquo; from it (your brain
        produces it constantly). But you <em>can</em> reset your brain&rsquo;s reward <strong>sensitivity</strong>{' '}
        in 7 days by removing supernormal stimuli — and the effects are measurable. Here&rsquo;s the actual
        neuroscience, what to cut, and a 7-day protocol that works.
      </p>

      <Section id="definition" title="Definition: what a 'dopamine detox' actually is (and isn't)">
        <p>
          The popular term is misleading. Let&rsquo;s clear up what&rsquo;s happening neurologically:
        </p>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">What it isn&rsquo;t</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>NOT a dopamine fast.</strong> You can&rsquo;t stop your brain from producing dopamine. It releases it during eating, talking, even breathing.</li>
          <li><strong>NOT a depletion reset.</strong> Dopamine isn&rsquo;t a finite reservoir that drains.</li>
          <li><strong>NOT 24 hours of monk-mode isolation.</strong> That viral version (popularised by an LA psychiatrist in 2019) is not what the science supports.</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">What it actually is</h3>
        <p>
          A <strong>dopamine detox is a deliberate reduction in supernormal stimuli</strong> — the
          unnaturally high-reward activities (short video, slot-style notifications, sugar, porn,
          gambling-style apps) that have desensitised your reward system. The goal isn&rsquo;t to eliminate
          dopamine. It&rsquo;s to <em>raise the baseline</em> so normal activities feel rewarding again.
        </p>
        <PullQuote>
          You can&rsquo;t deplete dopamine. But you can absolutely retrain what your brain considers
          interesting.
        </PullQuote>
      </Section>

      <Section id="what" title="What's actually happening in your brain">
        <p>
          Stanford neuroscientist Andrew Huberman&rsquo;s lab has popularised the right model. Two key
          concepts:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Dopamine baseline.</strong> Your brain has a resting level of dopamine. Activities
            release dopamine <em>above</em> this baseline (peaks) — and equivalent <em>drops below</em>{' '}
            baseline after the peak (Huberman calls this &ldquo;the pain side&rdquo;).
          </li>
          <li>
            <strong>Reward sensitivity.</strong> Repeated high peaks reset what your brain considers
            &ldquo;rewarding.&rdquo; After enough TikTok, reading a book feels boring — not because reading
            changed, but because your reward bar moved up.
          </li>
        </ul>

        {/* Dopamine baseline curve */}
        <div className="my-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            How supernormal stimuli reset your baseline over 7 days
          </div>
          <svg viewBox="0 0 360 180" className="h-44 w-full">
            <line x1="40" y1="100" x2="340" y2="100" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
            <text x="340" y="96" fontSize="9" fill="#52525b" textAnchor="end" fontWeight="700">healthy baseline</text>
            {/* Pre-detox: spikes + crashes below baseline */}
            <g>
              <path
                d="M 40 100 L 50 35 L 60 100 L 65 145 L 80 100 L 90 40 L 100 100 L 105 140 L 115 100 L 125 50 L 135 100"
                fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"
              />
              <text x="85" y="22" fontSize="9.5" fill="#be123c" textAnchor="middle" fontWeight="700">
                Before — high peaks, low baseline
              </text>
            </g>
            {/* Transition arrow */}
            <text x="170" y="100" fontSize="12" fill="#a1a1aa" textAnchor="middle">→ 7 days →</text>
            {/* Post-detox: smaller waves around higher baseline */}
            <g>
              <line x1="200" y1="80" x2="340" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
              <text x="340" y="76" fontSize="9" fill="#047857" textAnchor="end" fontWeight="700">restored baseline</text>
              <path
                d="M 200 80 L 215 60 L 230 80 L 245 95 L 260 80 L 275 65 L 290 80 L 305 95 L 320 80 L 335 70"
                fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"
              />
              <text x="270" y="22" fontSize="9.5" fill="#047857" textAnchor="middle" fontWeight="700">
                After — smaller peaks, higher baseline
              </text>
            </g>
          </svg>
          <div className="mt-2 text-[11.5px] leading-snug text-zinc-500">
            After 7 days without supernormal stimuli, the reward baseline rises and normal activities
            (reading, conversation, walking) feel rewarding again.
          </div>
        </div>
      </Section>

      <Section id="when" title="When to do a detox (and signs you need one)">
        <p>The 7 signs your reward sensitivity has been hijacked:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>You reach for your phone within 60 seconds of any &ldquo;empty&rdquo; moment</li>
          <li>You can&rsquo;t read for more than 5 minutes without checking something</li>
          <li>Books that used to engage you now feel slow</li>
          <li>Real-world activities feel &ldquo;low resolution&rdquo; compared to your phone</li>
          <li>You feel a low-grade anxiety when devices are out of reach</li>
          <li>Conversations feel boring unless they&rsquo;re fast-paced</li>
          <li>Your mood is increasingly tied to notifications</li>
        </ul>
        <p>
          If 4+ of these resonate, you&rsquo;re a candidate. The detox is a reset — not a permanent lifestyle.
          Run it 1-2x a year, or after periods of heavy phone/scroll/binge use.
        </p>
        <Callout icon="🎯" title="The right framing">
          The goal isn&rsquo;t to demonise dopamine. Dopamine drives learning, motivation, love, and
          curiosity. The goal is to stop overstimulating it so you can feel the normal-life rewards
          again.
        </Callout>
      </Section>

      <Section id="how" title="How to run a 7-day dopamine reset">

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">What to cut (the supernormal stimuli list)</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>Short-form video (TikTok, Reels, YouTube Shorts)</li>
          <li>Social media scrolling (Twitter/X, Instagram feed)</li>
          <li>News scrolling / refresh-bait</li>
          <li>Gambling-style apps + microtransactions</li>
          <li>Porn</li>
          <li>Refined sugar &amp; ultra-processed snacks</li>
          <li>Recreational substances</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">What to add (replacement behaviours)</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>30+ min walks outdoors (sunlight raises baseline dopamine)</li>
          <li>Reading (long-form, ideally physical book)</li>
          <li>Cold exposure (cold shower / cold plunge — measured 2.5x baseline dopamine, lasting hours)</li>
          <li>Journaling (see our piece on{' '}
            <Link href="/blog/journaling-for-productivity" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              journaling
            </Link>
            )
          </li>
          <li>Real conversation (no devices)</li>
          <li>Exercise (sustained release of healthy dopamine)</li>
          <li>Boredom (yes, deliberately)</li>
        </ul>

        <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900">Day-by-day expectations</h3>
        <div className="my-6 grid grid-cols-1 gap-2.5">
          {[
            { d: 'Day 1-2', emoji: '😤', label: 'Withdrawal-like restlessness, frequent phantom-phone-checking, irritability', color: 'rose' },
            { d: 'Day 3-4', emoji: '🌫️', label: 'Boredom feels overwhelming; your default activities are gone. This is the hardest stretch.', color: 'amber' },
            { d: 'Day 5', emoji: '☁️', label: 'Mind starts to slow down. Reading feels less like work. Sleep often improves.', color: 'sky' },
            { d: 'Day 6-7', emoji: '✨', label: 'Reward baseline visibly higher. Normal activities (walks, food, conversation) feel rewarding again.', color: 'emerald' },
          ].map((s) => (
            <div key={s.d} className={`flex items-start gap-3 rounded-xl border border-${s.color}-200 bg-${s.color}-50/40 p-3`}>
              <span className="text-[24px] leading-none">{s.emoji}</span>
              <div>
                <div className={`text-[11px] font-bold uppercase tracking-wider text-${s.color}-700`}>{s.d}</div>
                <div className="mt-0.5 text-[12.5px] text-zinc-700">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="why" title="Why the 7-day version works (and longer doesn't help more)">
        <p>The 7-day window is calibrated by two converging factors:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Dopamine receptor sensitivity recovers in 5-10 days.</strong> Animal models and
            human PET-scan studies converge on roughly this window for D2 receptor upregulation after
            chronic overstimulation.
          </li>
          <li>
            <strong>Habit re-formation takes ~7 days.</strong> Day 1-2 are withdrawal; days 5-7 are
            when the replacement behaviours start to feel automatic. Less than 7 misses the upswing;
            more than 14 yields diminishing returns.
          </li>
        </ul>
        <PullQuote>
          The point isn&rsquo;t the 7 days. The point is the 8th day — when you&rsquo;ve reset your baseline and
          choose, deliberately, what comes back in.
        </PullQuote>

        <Callout icon="🚪" title="Day 8 is the actual victory">
          The reset is only half the win. On day 8, decide consciously what to reintroduce. Most
          people find: news is unnecessary, TikTok adds nothing, IG-feed is replaceable by IG-DMs,
          and 30-min phone limits genuinely work. Don&rsquo;t go back to default settings — design what comes
          back.
        </Callout>

        <Callout icon="📋" title="Your 7-day protocol checklist">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Day 0 (Sunday night): Delete TikTok / Reels / Twitter apps. Log out of any feeds. Tell people you&rsquo;re offline.</li>
            <li>Set phone to grayscale. Put it in another room while working.</li>
            <li>Plan 30-min walks for each day, ideally morning sunlight.</li>
            <li>Pick one long-form book. Carry it everywhere instead of your phone.</li>
            <li>Cold shower morning + evening (90 seconds is enough).</li>
            <li>Journal each evening: how did today feel?</li>
            <li>Day 8: review, decide what comes back, what stays gone.</li>
          </ol>
        </Callout>

        <p>
          The dopamine detox isn&rsquo;t a hack — it&rsquo;s a recalibration. Done well, it makes everything else
          in your toolkit work better:{' '}
          <Link href="/blog/deep-work-how-to-focus" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            deep work
          </Link>{' '}
          is achievable again,{' '}
          <Link href="/blog/how-to-stop-procrastinating" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            procrastination
          </Link>{' '}
          drops because the brain isn&rsquo;t fleeing to the easy dopamine, and{' '}
          <Link href="/blog/identity-based-habits" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
            identity-based habits
          </Link>{' '}
          install faster because your reward system actually responds to small wins again.
        </p>
        <p>
          BuildYourYear can host the protocol as a 7-day habit set with the streak counter as the
          visible commitment. Run it once. Then design what your post-reset relationship with your
          phone actually looks like.
        </p>
      </Section>
    </BlogLayout>
  );
}
