import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

/**
 * /sitemap.xml — generated at build time from this list.
 *
 * Auth-gated routes (/app, /api/*) are intentionally excluded so search engines
 * don't try to crawl gated content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/signup`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
