import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

/**
 * /robots.txt — generated at build time.
 *
 * Allow public surfaces, disallow:
 *   - /api/*   — backend routes
 *   - /app     — auth-gated user dashboard (no value to crawlers, dynamic per user)
 *   - /_next/* — Next.js internals
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/signup', '/login'],
        disallow: ['/api/', '/app', '/app/', '/_next/'],
      },
      // Be explicit and friendly to Googlebot
      {
        userAgent: 'Googlebot',
        allow: ['/', '/signup', '/login'],
        disallow: ['/api/', '/app', '/app/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
