'use client';

import Script from 'next/script';

/**
 * Google AdSense loader. Loads pagead-js so AdSense can:
 *   1. Crawl the site for approval review
 *   2. Serve ads in any <ins class="adsbygoogle"> slots we later place
 *
 * Loaded via next/script with afterInteractive — won't block paint.
 * Skipped in development so dev traffic doesn't trigger ad impressions.
 *
 * Configurable via env (NEXT_PUBLIC_ADSENSE_CLIENT) with a sensible default.
 */
const DEFAULT_ADSENSE_CLIENT = 'ca-pub-6349841658473646';

export default function AdSense() {
  if (process.env.NODE_ENV === 'development') return null;
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || DEFAULT_ADSENSE_CLIENT;
  if (!client) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
