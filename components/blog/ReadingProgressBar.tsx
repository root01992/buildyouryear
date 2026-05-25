'use client';

import { useEffect, useState } from 'react';

/**
 * Slim fixed-position bar at the top of the viewport that tracks how far the reader
 * has scrolled through the article. Subtle visual cue + UX-polish signal for SEO.
 *
 * No deps — pure scroll listener throttled via rAF. Auto-cleans on unmount.
 */
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId = 0;
    const update = () => {
      // Scroll progress = (scrollY) / (scrollableHeight)
      const doc = document.documentElement;
      const scrolled = window.scrollY || doc.scrollTop;
      const scrollable = (doc.scrollHeight || 0) - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;
      setProgress(p);
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = 0;
      });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-zinc-200/40"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
        style={{
          width: `${progress * 100}%`,
          transition: 'width 90ms linear',
        }}
      />
    </div>
  );
}
