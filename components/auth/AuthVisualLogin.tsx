'use client';

import { useEffect, useState } from 'react';
import { Check, Flame, TrendingUp } from 'lucide-react';

/**
 * Animated right-pane visual for /login.
 * Vibe: "Welcome back — your progress is waiting."
 * - Calm emerald → teal → sky gradient (established)
 * - Drifting grid + sparkline that draws across the panel
 * - Stacked floating cards showing Today / Streak / Saving for
 */
export default function AuthVisualLogin() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-600 lg:block">
      {/* Drifting grid — slower for a calmer feel */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
        <div
          className="absolute -inset-x-16 -inset-y-16"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            animation: 'gridDrift 32s linear infinite',
          }}
        />
      </div>

      {/* Soft floating blobs — longer arcs */}
      <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/15 blur-3xl"
        style={{ animation: 'blobDrift 16s ease-in-out infinite' }} />
      <div className="absolute -bottom-32 -right-32 h-[440px] w-[440px] rounded-full bg-emerald-300/30 blur-3xl"
        style={{ animation: 'blobDrift 20s ease-in-out infinite reverse' }} />

      {/* Background sparkline that draws across the whole panel */}
      <svg
        aria-hidden
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
      >
        <defs>
          <linearGradient id="bgSparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,420 C80,380 140,300 220,340 C310,385 360,260 460,290 C560,320 600,200 700,220 C760,232 790,210 800,205 L800,600 L0,600 Z"
          fill="url(#bgSparkFill)"
          style={{ animation: 'fadeUp 1500ms ease-out 400ms both' }}
        />
        <path
          d="M0,420 C80,380 140,300 220,340 C310,385 360,260 460,290 C560,320 600,200 700,220 C760,232 790,210 800,205"
          fill="none"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          style={{ animation: 'drawLine 3600ms cubic-bezier(0.22, 1, 0.36, 1) 400ms forwards' }}
        />
      </svg>

      {/* Content — clean vertical stack, no overlapping elements */}
      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col items-center justify-between px-8 py-10 xl:px-10 xl:py-12">
        {/* Top — emotional welcome block */}
        <div className="w-full text-center text-white">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm"
            style={{ animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both' }}
          >
            <span className="grid h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Welcome back · your year is mid-flight
          </span>
          <h2
            className="mt-4 text-[1.55rem] font-bold leading-[1.15] tracking-[-0.02em] xl:text-[1.85rem]"
            style={{ animation: 'fadeUp 1000ms cubic-bezier(0.22, 1, 0.36, 1) 350ms both' }}
          >
            Pick up where you left off.
            <br />
            <span className="text-white/85">A streak is waiting.</span>
          </h2>
        </div>

        {/* Middle — YearRing dominant centerpiece (no flanking cards) */}
        <div className="relative flex flex-col items-center">
          <YearRing />
          {/* Today's snapshot strip — sits BELOW the ring, never collides */}
          <TodaySnapshot />
        </div>

        {/* Bottom — emotional stat row + sign-up nudge */}
        <div className="w-full">
          <div
            className="grid grid-cols-3 gap-2.5"
            style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 3000ms both' }}
          >
            <StatTile label="Days you showed up" value={<><Counter end={128} duration={2000} /></>} delta="of 143 possible" />
            <StatTile label="Best streak" value={<><Counter end={14} duration={1700} />d</>} delta="🔥 personal best" />
            <StatTile label="Year transformed" value={<Counter end={42} duration={2200} format={(n) => Math.round(n) + '%'} />} delta="and compounding" />
          </div>
          <p
            className="mt-5 text-center text-[12px] leading-relaxed text-white/85"
            style={{ animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 3400ms both' }}
          >
            <span className="font-semibold text-white">New here?</span>{' '}
            <a href="/signup" className="underline-offset-2 hover:underline">
              Start your year →
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Compact horizontal strip showing today's snapshot — sits below the YearRing. */
function TodaySnapshot() {
  return (
    <div
      className="mt-5 flex items-stretch gap-2 rounded-2xl border border-white/25 bg-white/12 p-2 backdrop-blur-md"
      style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 2400ms both' }}
    >
      <SnapItem icon="🔥" label="Streak" value="14d" />
      <Divider />
      <SnapItem icon="✓" label="Today" value="3/4" />
      <Divider />
      <SnapItem icon="🎯" label="Goals" value="3/7" />
      <Divider />
      <SnapItem icon="💧" label="Saved" value="$230" />
    </div>
  );
}

function SnapItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex min-w-[68px] flex-col items-center justify-center px-1.5 text-white">
      <span className="text-base leading-none">{icon}</span>
      <span className="mt-1 text-[14.5px] font-bold leading-none tabular-nums">{value}</span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/70">{label}</span>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="w-px self-stretch bg-white/20" />;
}

/* ────────────────────────────────────────────────────────────────────────── */

function Counter({
  end,
  duration = 1500,
  format,
}: {
  end: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <span className="tabular-nums">{format ? format(v) : Math.round(v).toLocaleString()}</span>;
}

function StatTile({
  label,
  value,
  delta,
}: {
  label: string;
  value: React.ReactNode;
  delta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/15 p-3 backdrop-blur-sm">
      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-50/80">{label}</div>
      <div className="mt-1 text-[1.4rem] font-bold leading-none text-white">{value}</div>
      <div className="mt-1.5 text-[10px] font-semibold text-white/80">{delta}</div>
    </div>
  );
}

/* ──────────────── YearRing — centerpiece motif ───────────────────────────── */

/**
 * Animated 365-day progress ring. Renders today's day-of-year over a faint full
 * year track. Both arcs draw in over ~2.5s. Center reads "Day N / 365".
 */
function YearRing() {
  const size = 248;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Day-of-year (deterministic per-day; client + server agree on a date string)
  const dayOfYear = (() => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
    const diff = now.getTime() - start.getTime();
    return Math.max(1, Math.min(365, Math.floor(diff / 86_400_000)));
  })();

  const progress = dayOfYear / 365;
  const filledLen = circumference * progress;
  const ringEnd = circumference - filledLen; // dashoffset target

  return (
    <div
      className="relative"
      style={{ animation: 'fadeUp 1100ms cubic-bezier(0.22, 1, 0.36, 1) 900ms both' }}
    >
      {/* Soft outer halo, breathing */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-white/20 blur-2xl"
        style={{ animation: 'breathe 6s ease-in-out 2s infinite' }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative"
      >
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#bbf7d0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Full-year track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={stroke}
        />

        {/* Progress arc — draws over ~2.5s */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={
            {
              '--ring-end': ringEnd,
              animation: 'ringFill 2500ms cubic-bezier(0.22, 1, 0.36, 1) 1100ms forwards',
              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.45))',
            } as React.CSSProperties
          }
        />

        {/* Tick marks every 30 days */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const inner = r - stroke / 2 - 6;
          const outer = r - stroke / 2 - 2;
          const x1 = cx + Math.cos(angle) * inner;
          const y1 = cy + Math.sin(angle) * inner;
          const x2 = cx + Math.cos(angle) * outer;
          const y2 = cy + Math.sin(angle) * outer;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth={1.5}
              strokeLinecap="round"
              style={{ animation: `fadeUp 400ms ease-out ${1400 + i * 60}ms both` }}
            />
          );
        })}

        {/* Leading-edge dot */}
        <circle
          cx={cx + Math.cos(progress * 2 * Math.PI - Math.PI / 2) * r}
          cy={cy + Math.sin(progress * 2 * Math.PI - Math.PI / 2) * r}
          r={6}
          fill="#ffffff"
          style={{
            animation: 'fadeUp 600ms ease-out 3500ms both, glowPulse 3s ease-in-out 4100ms infinite',
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))',
          }}
        />
      </svg>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div
          className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-white/80"
          style={{ animation: 'fadeUp 700ms ease-out 1300ms both' }}
        >
          Day
        </div>
        <div
          className="mt-0.5 text-[3rem] font-bold leading-none tracking-tight text-white tabular-nums"
          style={{ animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 1400ms both' }}
        >
          <Counter end={dayOfYear} duration={2400} />
        </div>
        <div
          className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/70"
          style={{ animation: 'fadeUp 700ms ease-out 1700ms both' }}
        >
          of 365
        </div>
        <div
          className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
          style={{ animation: 'fadeUp 600ms ease-out 2200ms both' }}
        >
          <Flame className="h-2.5 w-2.5" />
          year in progress
        </div>
      </div>
    </div>
  );
}

/* ──────────────── Floating preview cards ─────────────────────────────────── */

function FloatingCard({
  className = '',
  rotation,
  delay,
  children,
}: {
  className?: string;
  rotation: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative w-[230px] rounded-2xl border border-white/60 bg-white/95 p-3 shadow-[0_18px_44px_-12px_rgba(0,0,0,0.35)] backdrop-blur-sm ${className}`}
      style={
        {
          // --rot keeps rotation through the `floaty` keyframe (which references var(--rot))
          '--rot': rotation,
          transform: `rotate(${rotation})`,
          animation: `fadeUp 600ms ease-out ${delay}ms both, floaty 5s ease-in-out ${delay + 700}ms infinite`,
        } as React.CSSProperties
      }
    >
      <div className="h-[2px] -mx-3 -mt-3 mb-2 rounded-t-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" />
      {children}
    </div>
  );
}

function TodayCard({
  className,
  rotation,
  delay,
}: {
  className?: string;
  rotation: string;
  delay: number;
}) {
  return (
    <FloatingCard className={className} rotation={rotation} delay={delay}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500">Today</span>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
          <Flame className="h-2.5 w-2.5" />
          14d
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { emoji: '💧', label: 'Water', d: delay + 350 },
          { emoji: '📖', label: 'Read', d: delay + 600 },
          { emoji: '🏃', label: 'Move', d: delay + 850 },
          { emoji: '🧘', label: 'Yoga', d: delay + 1100 },
        ].map((h) => (
          <MiniHabit key={h.label} {...h} />
        ))}
      </div>
    </FloatingCard>
  );
}

function MiniHabit({ emoji, label, d }: { emoji: string; label: string; d: number }) {
  return (
    <div
      className="relative flex flex-col items-center gap-0.5 rounded-md border border-emerald-200 bg-emerald-50/70 py-1.5"
      style={{ animation: `fadeUp 400ms ease-out ${d - 200}ms both` }}
    >
      <span className="text-[14px] leading-none">{emoji}</span>
      <span className="text-[7px] font-bold uppercase tracking-wider text-emerald-700">{label}</span>
      <span
        className="absolute -right-1 -top-1 grid h-3 w-3 place-items-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white"
        style={{ animation: `habitTick 500ms ease-out ${d}ms both` }}
      >
        <Check className="h-1.5 w-1.5" strokeWidth={3.5} />
      </span>
    </div>
  );
}

function StreakCard({
  className,
  rotation,
  delay,
}: {
  className?: string;
  rotation: string;
  delay: number;
}) {
  return (
    <FloatingCard className={className} rotation={rotation} delay={delay}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500">Streak</span>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
          <TrendingUp className="h-2.5 w-2.5" />+<Counter end={18} duration={1300} format={(n) => Math.round(n) + '%'} />
        </span>
      </div>
      <div className="flex items-end gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-2xl">
          🔥
        </div>
        <div className="min-w-0">
          <div className="text-[1.6rem] font-bold leading-none text-zinc-900">
            <Counter end={14} duration={1500} />d
          </div>
          <div className="mt-1 text-[10px] text-zinc-500">Best ever · keep going</div>
        </div>
      </div>
      {/* Mini bar row */}
      <div className="mt-3 flex h-6 items-end gap-0.5">
        {[3, 5, 4, 6, 7, 5, 6, 8, 6, 7, 8, 9, 8, 14].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-emerald-300 to-emerald-500"
            style={{
              height: `${(h / 14) * 100}%`,
              animation: `barRise 600ms ease-out ${delay + 400 + i * 35}ms both`,
            }}
          />
        ))}
      </div>
    </FloatingCard>
  );
}

function SavingsCard({
  className,
  rotation,
  delay,
}: {
  className?: string;
  rotation: string;
  delay: number;
}) {
  return (
    <FloatingCard className={className} rotation={rotation} delay={delay}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500">Saving for</span>
        <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-rose-700">
          29%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-zinc-100 bg-white text-base shadow-sm">
          📱
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-semibold text-zinc-800">iPad Pro M5</div>
          <div className="text-[9.5px] tabular-nums text-zinc-500">
            $<Counter end={230} duration={1700} /> <span className="text-zinc-400">/ $800</span>
          </div>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
          style={
            {
              '--target-width': '28.75%',
              animation: `barFill 1800ms cubic-bezier(0.4, 0, 0.2, 1) ${delay + 300}ms both`,
            } as React.CSSProperties
          }
        />
      </div>
      <div className="mt-1.5 text-[9.5px] text-zinc-500">ETA 7 mo · $80/mo plan</div>
    </FloatingCard>
  );
}
