/**
 * Blog post registry. Single source of truth for the listing page,
 * sitemap, and each post's Article JSON-LD.
 *
 * To add a post:
 *   1. Drop a new file at app/blog/<slug>/page.tsx
 *   2. Append metadata here (slug + matching values)
 */

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 — used for `datePublished` schema + lastmod in sitemap */
  publishedAt: string;
  /** Used for displayed read time on the card */
  readTimeMinutes: number;
  /** Short tagline shown in the listing card */
  tagline: string;
  /** Emoji used in the listing card as a visual cue */
  emoji: string;
  /** Comma-separated keywords for metadata */
  keywords: string[];
  /** Top-of-card accent gradient */
  accent: 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'teal';
};

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'how-to-build-habits-that-stick',
    title: 'How to Build a Habit That Sticks: The Complete 365-Day Method',
    description:
      'The 21-day rule is a myth. Real habits take 66 days on average — and some take 254. Here is the research-backed playbook for building habits that survive the entire year, with the cue-craving-response-reward loop and habit stacking patterns that actually work.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 8,
    tagline: 'Why 21 days is a myth and what actually works.',
    emoji: '🌱',
    keywords: [
      'how to build a habit',
      'habit formation',
      'atomic habits',
      '21 day myth',
      'habit stacking',
      'sticky habits',
      'habit loop',
      'cue craving response reward',
    ],
    accent: 'emerald',
  },
  {
    slug: '12-week-year-explained',
    title: 'The 12-Week Year Explained: Get a Year of Work Done in 12 Weeks',
    description:
      'Annual planning fails because 12 months is too long to feel urgent. The 12-Week Year compresses a year into 12 weeks — same goals, 4x the urgency. Here is how the Brian Moran method works, with a step-by-step template you can run this quarter.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 9,
    tagline: 'Why a quarter is the right unit of planning.',
    emoji: '⚡',
    keywords: [
      '12 week year',
      'quarterly planning',
      'Brian Moran',
      '12 week year template',
      '12 week year review',
      'quarterly goals',
    ],
    accent: 'sky',
  },
  {
    slug: 'habit-tracking-streaks-heatmaps',
    title: 'Habit Tracking 101: Streaks, Heatmaps & the Psychology of Consistency',
    description:
      'Tracking a habit is the second hardest part of building one. This guide breaks down why streaks work (loss aversion), why heatmaps work (visual identity), and how to design a habit tracker that you will actually open on day 47.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 8,
    tagline: 'The psychology behind streaks, heatmaps, and consistency.',
    emoji: '🔥',
    keywords: [
      'habit tracker',
      'how to track habits',
      'GitHub heatmap habits',
      'habit streak',
      'consistency tracker',
      '12 week heatmap',
      'streak psychology',
    ],
    accent: 'amber',
  },
  {
    slug: 'goal-setting-frameworks-compared',
    title: 'Goal Setting Frameworks Compared: SMART vs OKRs vs 12-Week Year vs BHAG',
    description:
      'Choosing the wrong framework is the single biggest reason goals stall. This deep-dive compares the four most-used frameworks across clarity, time horizon, accountability, and motivation — with a decision matrix to pick the right one for your goal.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 10,
    tagline: 'SMART, OKRs, 12-Week Year, BHAG — when each one wins.',
    emoji: '🎯',
    keywords: [
      'goal setting',
      'SMART goals',
      'OKR examples',
      'goal setting frameworks',
      'BHAG',
      'OKR vs SMART',
      'how to set goals',
    ],
    accent: 'violet',
  },
  {
    slug: 'compound-effect-1-percent-better',
    title: 'The Compound Effect: How 1% Daily Improvement Transforms Your Year',
    description:
      'James Clear popularised the math: 1% better every day = 37x by the end of the year. 1% worse = nearly zero. The compound effect is the most underrated force in personal growth — here is how it actually works, why most people give up before it kicks in, and how to set up the leverage.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 8,
    tagline: '37x at +1%. 0.03x at -1%. The brutal math of compounding.',
    emoji: '📈',
    keywords: [
      'compound effect',
      '1 percent better',
      'daily improvement',
      'atomic habits compound',
      'marginal gains',
      'Darren Hardy compound effect',
      'compounding habits',
    ],
    accent: 'teal',
  },
  {
    slug: 'why-new-year-resolutions-fail',
    title: 'Why You Quit Your New Year’s Resolutions (And How to Finally Finish Them)',
    description:
      '92% of people quit their resolutions by mid-February. The reason is not willpower — it is the system. This article unpacks the six predictable failure modes (vague goals, missing systems, identity mismatch, etc.) and the fixes that take resolutions from January aspirations to December wins.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 9,
    tagline: '92% quit by February 17. Here is what the 8% do differently.',
    emoji: '🎯',
    keywords: [
      'why resolutions fail',
      'new year resolutions fail',
      'goal psychology',
      'follow through goals',
      'why I quit my resolution',
      'resolution statistics',
    ],
    accent: 'rose',
  },
  {
    slug: 'morning-routine-for-high-performers',
    title: 'The Morning Routine of High Performers: What the Top 1% Actually Do Before 9am',
    description:
      'The 5am Club is a marketing slogan. The actual morning-routine research is more interesting: top performers share 5 behavioural patterns, not a 4:30am wake-up time. Here is the evidence-backed playbook for designing a morning routine that compounds for the rest of your year.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 9,
    tagline: '5 patterns top performers share — none of them are "wake up at 5am".',
    emoji: '🌅',
    keywords: [
      'morning routine',
      'miracle morning',
      '5am club',
      'daily routine for success',
      'productive morning routine',
      'morning habits',
      'best morning routine',
    ],
    accent: 'amber',
  },
  {
    slug: 'eisenhower-matrix-explained',
    title: 'The Eisenhower Matrix Explained: How to Stop Doing Urgent-but-Unimportant Work',
    description:
      'President Eisenhower famously said: "What is important is seldom urgent and what is urgent is seldom important." The matrix that bears his name is the most useful 2x2 in productivity — when you actually use it. Here is the definition, the four quadrants, and how to run a weekly review using it.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 8,
    tagline: 'The 2x2 that rescues your week from urgent-but-unimportant work.',
    emoji: '🧭',
    keywords: [
      'eisenhower matrix',
      'urgent vs important',
      'time management matrix',
      'productivity matrix',
      'prioritization framework',
      'eisenhower box',
      'covey time matrix',
    ],
    accent: 'sky',
  },
  {
    slug: 'deep-work-how-to-focus',
    title: 'Deep Work: How to Focus in a World That Is Trying Very Hard to Distract You',
    description:
      'Cal Newport calls it "the superpower of the 21st century." Deep work — the ability to focus without distraction on a cognitively demanding task — is becoming rarer and therefore more valuable. Here is what deep work actually is, why shallow work feels productive but isn\'t, and the 4 rules to build a deep-work practice.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 9,
    tagline: 'Cal Newport\'s superpower of the 21st century — explained, with rules.',
    emoji: '🎧',
    keywords: [
      'deep work',
      'Cal Newport deep work',
      'focus techniques',
      'how to focus better',
      'deep work rules',
      'distraction free work',
      'shallow work',
    ],
    accent: 'violet',
  },
  {
    slug: 'pareto-principle-80-20-rule',
    title: 'The 80/20 Rule (Pareto Principle): How 20% of Your Day Drives 80% of Your Year',
    description:
      'Vilfredo Pareto discovered in 1896 that 80% of Italy\'s land was owned by 20% of the population. The principle holds across almost every system humans interact with — including your habits, your goals, and your time. Here is how to identify your vital 20% and ruthlessly reallocate the other 80%.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 9,
    tagline: 'Find the 20% that drives 80% of your results. Cut the rest.',
    emoji: '📊',
    keywords: [
      '80 20 rule',
      'pareto principle',
      'pareto law',
      '80 20 rule time management',
      'pareto rule examples',
      'how to apply 80 20 rule',
      'vital few',
    ],
    accent: 'teal',
  },
  {
    slug: 'identity-based-habits',
    title: 'Identity-Based Habits: How to Become the Person Your Goals Require',
    description:
      'Outcome-based habits ask "what do I want to achieve?" Identity-based habits ask "who do I want to become?" That single reframing is, according to behaviour scientists and James Clear, the difference between habits that last a season and habits that last a decade. Here is how it works — and how to apply it this week.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 9,
    tagline: 'You don\'t become a runner by running. You run because you\'re a runner.',
    emoji: '🪞',
    keywords: [
      'identity based habits',
      'atomic habits identity',
      'become who you want to be',
      'identity shift',
      'identity change',
      'how to change your identity',
      'identity based goals',
    ],
    accent: 'rose',
  },
  {
    slug: 'time-blocking-101',
    title: 'Time Blocking 101: How Top Performers Plan Their Day in 15 Minutes',
    description:
      'Cal Newport, Elon Musk, and Bill Gates have all said versions of the same thing: a to-do list without a calendar is just a wish list. Time blocking turns your tasks into appointments with yourself. Here is the complete guide — the 4 styles, the 6-step process, and the rookie mistakes that turn time blocks into time wasted.',
    publishedAt: '2026-05-24',
    readTimeMinutes: 9,
    tagline: 'A to-do list without a calendar is just a wish list. Block the time.',
    emoji: '⏱️',
    keywords: [
      'time blocking',
      'calendar blocking',
      'time block your day',
      'daily schedule template',
      'time blocking template',
      'how to time block',
      'time blocking app',
    ],
    accent: 'emerald',
  },
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
