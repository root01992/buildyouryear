'use client';

import { useEffect, useRef, useState } from 'react';
import { Flame, ListChecks, Target, PiggyBank } from 'lucide-react';

/** Counts from 0 → end once the element enters the viewport. */
function useInViewCount(end: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || startedRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(end * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return { ref, value };
}

function BigStat({
  end,
  suffix,
  prefix,
  label,
  hint,
  icon: Icon,
  accent,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  hint: string;
  icon: typeof Flame;
  accent: 'emerald' | 'sky' | 'amber' | 'rose';
}) {
  const { ref, value } = useInViewCount(end);
  const accents = {
    emerald: { bg: 'bg-emerald-50', txt: 'text-emerald-700', bar: 'from-emerald-500 to-teal-400' },
    sky: { bg: 'bg-sky-50', txt: 'text-sky-700', bar: 'from-sky-500 to-cyan-400' },
    amber: { bg: 'bg-amber-50', txt: 'text-amber-700', bar: 'from-amber-500 to-orange-400' },
    rose: { bg: 'bg-rose-50', txt: 'text-rose-700', bar: 'from-rose-500 to-pink-400' },
  } as const;
  const a = accents[accent];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`} aria-hidden />
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${a.bg} ${a.txt}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 flex items-baseline gap-0.5 tabular-nums">
        {prefix && <span className="text-[1.4rem] font-bold text-zinc-700">{prefix}</span>}
        <span className="text-[2.2rem] font-bold leading-none tracking-[-0.02em] text-zinc-900">
          {Math.round(value).toLocaleString()}
        </span>
        {suffix && <span className="text-[1.4rem] font-bold text-zinc-700">{suffix}</span>}
      </div>
      <div className="mt-1.5 text-[13.5px] font-semibold text-zinc-700">{label}</div>
      <div className="mt-0.5 text-[12px] text-zinc-500">{hint}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="border-t border-zinc-200/70 bg-gradient-to-b from-white via-zinc-50/40 to-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            The math of a built year
          </div>
          <h2 className="mt-2 text-[1.6rem] font-bold tracking-[-0.025em] text-zinc-900 sm:text-[2rem]">
            What 30 days with BuildYourYear looks like
          </h2>
          <p className="mt-2.5 text-[14px] leading-relaxed text-zinc-600">
            Compounding is brutal — in your favor. A few minutes a day, twelve months out.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <BigStat
            icon={Flame}
            accent="amber"
            end={30}
            suffix="d"
            label="Streak potential"
            hint="If you keep showing up, one habit at a time"
          />
          <BigStat
            icon={ListChecks}
            accent="sky"
            end={120}
            suffix="+"
            label="Tasks shipped"
            hint="At just 4 todos a day for a month"
          />
          <BigStat
            icon={Target}
            accent="emerald"
            end={4}
            label="Goals advanced"
            hint="Milestones move; goals get done"
          />
          <BigStat
            icon={PiggyBank}
            accent="rose"
            end={240}
            prefix="$"
            label="Saved toward what you want"
            hint="At $8/day toward an iPad, vacation, anything"
          />
        </div>
      </div>
    </section>
  );
}
