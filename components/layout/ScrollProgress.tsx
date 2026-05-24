'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setPct(max <= 0 ? 0 : (window.scrollY / max) * 100);
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-[width] duration-100"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
