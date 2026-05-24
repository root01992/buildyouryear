'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

/**
 * Google Analytics 4 integration for the Next.js App Router.
 *
 * Two responsibilities:
 *   1. Load gtag.js + initialise it with our measurement ID (via next/script
 *      `afterInteractive` so it never blocks paint).
 *   2. Send a synthetic `config` pageview on every client-side route change —
 *      App Router uses soft navigation, so GA's built-in `page_view` only
 *      fires for the very first load.
 *
 * Configuration:
 *   - `NEXT_PUBLIC_GA_ID` env var overrides the default `G-NVM08VQMBB`.
 *   - In `development` it renders nothing, so local-dev clicks don't
 *     pollute production analytics.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const DEFAULT_GA_ID = 'G-NVM08VQMBB';

function PageViewTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag || !pathname) return;
    const query = searchParams?.toString();
    const page_path = query ? `${pathname}?${query}` : pathname;
    window.gtag('config', gaId, {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}

export default function Analytics() {
  // Skip locally — no point sending dev traffic to GA4
  if (process.env.NODE_ENV === 'development') return null;

  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || DEFAULT_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            page_location: window.location.href,
            page_title: document.title
          });
        `}
      </Script>
      {/* useSearchParams needs a Suspense boundary in App Router */}
      <Suspense fallback={null}>
        <PageViewTracker gaId={gaId} />
      </Suspense>
    </>
  );
}
