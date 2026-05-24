/**
 * Single source of truth for site-wide SEO/branding constants.
 * Used by app/layout.tsx, app/sitemap.ts, app/robots.ts, app/opengraph-image.tsx.
 */

/**
 * Resolve the canonical site URL.
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL — set this on Vercel to your real production URL
 *      (e.g. https://buildyouryear.com or https://buildyouryear-xxx.vercel.app).
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel auto-injects this for the production deployment.
 *   3. Sensible fallback during local dev / preview.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return 'https://buildyouryear.com';
}

export const SITE_NAME = 'BuildYourYear';
export const SITE_TAGLINE = 'Plan your day. Build your year.';
export const SITE_DESCRIPTION =
  'BuildYourYear turns 365 small days into one transformed year. Track daily to-dos, build habit streaks, save for what you want, and ship short- and long-term goals — with a beautiful dashboard, 12-week consistency heatmap, and a year-end recap that compounds. Free, encrypted, syncs across devices.';
