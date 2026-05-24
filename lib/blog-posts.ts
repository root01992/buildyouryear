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
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
