'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 to `end` (with ease-out-cubic) the first time the element enters the viewport.
 * Used inline in blog posts to make headline stats feel alive without being noisy.
 */
export default function AnimatedCounter({
  end,
  duration = 1600,
  prefix,
  suffix,
  decimals = 0,
  className,
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const t0 = performance.now();
          let raf = 0;
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(end * eased);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          return () => cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
