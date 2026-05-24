'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowRight, Check, Flame, Target, ListChecks, TrendingUp } from 'lucide-react';

/** Animate a number from 0 to `end` over `duration` ms on mount. */
function useCountUp(end: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return value;
}

function Counter({
  end,
  duration,
  format,
  className,
}: {
  end: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const v = useCountUp(end, duration);
  return <span className={`tabular-nums ${className ?? ''}`}>{format ? format(v) : Math.round(v)}</span>;
}

/** A single H1 word that lifts + unblurs into place. */
function RevealWord({ text, delay }: { text: string; delay: number }) {
  return (
    <span
      className="inline-block will-change-transform"
      style={{ animation: `wordReveal 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both` }}
    >
      {text}
    </span>
  );
}

/** Deterministic ambient particle field — soft dots drifting across the hero. */
function AmbientParticles() {
  // Deterministic pseudo-random so SSR matches client
  const particles = Array.from({ length: 18 }, (_, i) => {
    const seedX = Math.sin(i * 12.9898) * 43758.5453;
    const seedY = Math.sin(i * 78.233) * 12345.6789;
    const left = ((seedX - Math.floor(seedX)) * 100).toFixed(2);
    const top = ((seedY - Math.floor(seedY)) * 100).toFixed(2);
    const size = 4 + (i % 4) * 2;
    const dx = ((i % 5) - 2) * 18; // -36..36
    const dy = -40 - (i % 6) * 12; // -40..-100
    const duration = 9000 + (i % 7) * 1100; // 9-16s
    const delay = (i * 380) % 6000;
    const palette = ['bg-emerald-400/45', 'bg-sky-400/45', 'bg-violet-400/40', 'bg-teal-400/45'];
    const color = palette[i % palette.length];
    return { left, top, size, dx, dy, duration, delay, color, key: i };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.key}
          className={`absolute rounded-full blur-[0.5px] ${p.color}`}
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              animation: `driftFloat ${p.duration}ms ease-in-out ${p.delay}ms infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const { user, hydrated } = useAuth();
  return (
    <section className="relative isolate overflow-hidden">
      {/* Slowly drifting background blobs — softer, longer arc */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-3xl"
          style={{ animation: 'blobDrift 18s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-32 top-20 h-[460px] w-[460px] rounded-full bg-sky-200/40 blur-3xl"
          style={{ animation: 'blobDrift 22s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-violet-200/30 blur-3xl"
          style={{ animation: 'blobDrift 26s ease-in-out infinite' }}
        />
      </div>

      {/* Ambient drifting particles (deterministic, motion-safe) */}
      <AmbientParticles />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-sm"
              style={{ animation: 'fadeUp 700ms ease-out both' }}
            >
              <span className="grid h-1.5 w-1.5 place-items-center animate-pulse rounded-full bg-emerald-500" />
              365 days · 12-week heatmap · year-end recap
            </span>
            <h1 className="mt-4 text-[2.25rem] font-bold leading-[1.05] tracking-[-0.035em] text-zinc-900 sm:text-[2.75rem] lg:text-[3.5rem]">
              <RevealWord text="Plan" delay={180} />{' '}
              <RevealWord text="your" delay={320} />{' '}
              <RevealWord text="day." delay={460} />
              <br />
              <RevealWord text="Build" delay={720} />{' '}
              <RevealWord text="your" delay={860} />{' '}
              <span
                className="inline-block bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                  animation:
                    'wordReveal 1100ms cubic-bezier(0.22, 1, 0.36, 1) 1020ms both, gradientPan 7s ease-in-out 2200ms infinite',
                  display: 'inline-block',
                }}
              >
                year
              </span>
              <span style={{ animation: 'wordReveal 1100ms cubic-bezier(0.22, 1, 0.36, 1) 1180ms both', display: 'inline-block' }}>.</span>
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-zinc-600 lg:mx-0 lg:text-[16.5px]"
              style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 1500ms both' }}
            >
              365 small days. One transformed year. Track daily to-dos, build habit streaks, save for what
              you want, and ship short- and long-term goals — with a beautiful dashboard, a 12-week
              consistency heatmap, and a year-end recap that compounds.
            </p>
            <div
              className="mt-7 flex flex-col items-center gap-2 sm:flex-row lg:items-start lg:justify-start"
              style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 1800ms both' }}
            >
              {hydrated && user ? (
                <Link
                  href="/app"
                  className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40"
                >
                  Open your dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-5 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/45"
                    style={{ animation: 'ctaPulse 4.2s ease-in-out 2400ms infinite' }}
                  >
                    {/* Sheen sweep on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative">Start day 1 of your year</span>
                    <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-[14.5px] font-semibold text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
                  >
                    I already have an account
                  </Link>
                </>
              )}
            </div>
            <ul
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12.5px] text-zinc-500 lg:justify-start"
              style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 2100ms both' }}
            >
              <li className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> No credit card</li>
              <li className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Syncs across devices</li>
              <li className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Export anytime</li>
            </ul>
          </div>

          {/* Animated visual mock */}
          <AnimatedVisual />
        </div>
      </div>
    </section>
  );
}

function AnimatedVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none respect-motion">
      {/* Soft outer glow (centered, symmetric) */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[32px] bg-gradient-to-br from-emerald-500/15 via-teal-400/15 to-sky-400/15 blur-2xl"
      />

      {/* Main dashboard card — landscape rectangle */}
      <div
        className="relative mx-auto w-full max-w-[640px] rounded-[24px] border border-white bg-white/85 p-2 shadow-[0_25px_60px_-18px_rgba(0,0,0,0.22)] backdrop-blur-sm"
        style={{ animation: 'wordReveal 1400ms cubic-bezier(0.22, 1, 0.36, 1) 600ms both' }}
      >
        {/* Shimmer sweep across the whole card on load */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
          <div
            className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ animation: 'shimmer 2.4s ease-out 1.2s 1' }}
          />
        </div>

        <div className="relative overflow-hidden rounded-[18px] border border-zinc-200 bg-white">
          {/* Top color bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" />

          <div className="space-y-2 p-2.5">
            {/* Top row — 3 equal stat tiles full width */}
            <div className="grid grid-cols-3 gap-2">
              <StatTile
                icon={<Flame className="h-3.5 w-3.5" />}
                accent="emerald"
                label="Score"
                value={<><Counter end={86} duration={1800} />/100</>}
                delay={1050}
              />
              <StatTile
                icon={<ListChecks className="h-3.5 w-3.5" />}
                accent="sky"
                label="Tasks"
                value={<><Counter end={7} duration={1500} />/9</>}
                delay={1200}
              />
              <StatTile
                icon={<Target className="h-3.5 w-3.5" />}
                accent="violet"
                label="Goals"
                value={<Counter end={52} duration={1900} format={(n) => Math.round(n) + '%'} />}
                delay={1350}
              />
            </div>

            {/* 2×2 panel grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Top-left: Sparkline */}
              <Panel delay={1500}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">Last 14 days</div>
                  <div className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    <TrendingUp className="h-2.5 w-2.5" />+<Counter end={18} format={(n) => Math.round(n) + '%'} />
                  </div>
                </div>
                <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="h-[58px] w-full">
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,45 C20,42 30,18 50,22 C72,26 78,8 100,14 C120,20 130,38 152,30 C172,22 180,12 200,8 L200,60 L0,60 Z"
                    fill="url(#hg)"
                    style={{ animation: 'fadeUp 1200ms ease-out 600ms both' }}
                  />
                  <path
                    d="M0,45 C20,42 30,18 50,22 C72,26 78,8 100,14 C120,20 130,38 152,30 C172,22 180,12 200,8"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1}
                    style={{ animation: 'drawLine 1800ms ease-out 200ms forwards' }}
                  />
                  <circle cx="200" cy="8" r="3" fill="#10b981" style={{ animation: 'fadeUp 400ms ease-out 1900ms both' }} />
                  <circle cx="200" cy="8" r="6" fill="#10b981" opacity="0.25" style={{ animation: 'fadeUp 400ms ease-out 1900ms both' }} />
                </svg>
              </Panel>

              {/* Top-right: Today's habits */}
              <Panel delay={1650}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">Today</div>
                  <div className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                    <Flame className="h-2.5 w-2.5" />
                    <Counter end={14} duration={1500} />d
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { emoji: '💧', label: 'Water', delay: 700 },
                    { emoji: '📖', label: 'Read', delay: 950 },
                    { emoji: '🏃', label: 'Move', delay: 1200 },
                    { emoji: '🧘', label: 'Yoga', delay: 1450 },
                  ].map((h) => (
                    <HabitPill key={h.label} emoji={h.emoji} label={h.label} delay={h.delay} />
                  ))}
                </div>
              </Panel>

              {/* Bottom-left: iPad tracker */}
              <Panel delay={1850} tone="rose">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">Saving for</div>
                  <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-rose-700">
                    29%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-zinc-100 bg-white text-base shadow-sm">
                    📱
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[10.5px] font-semibold text-zinc-800">iPad Pro M5</div>
                    <div className="text-[9.5px] tabular-nums text-zinc-500">
                      $<Counter end={230} duration={1800} /> <span className="text-zinc-400">/ $800</span>
                    </div>
                  </div>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
                    style={
                      {
                        '--target-width': '28.75%',
                        animation: 'barFill 1800ms cubic-bezier(0.4, 0, 0.2, 1) 400ms both',
                      } as React.CSSProperties
                    }
                  />
                </div>
                <div className="mt-1 text-[9px] text-zinc-500">ETA 7 mo · $80/mo</div>
              </Panel>

              {/* Bottom-right: Heatmap */}
              <Panel delay={2050}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">12-week consistency</div>
                  <ScaleStrip />
                </div>
                <div className="flex justify-center">
                  <AnimatedHeatmap />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges — symmetric placement (top-right + bottom-left, mirrored rotation) */}
      <FloatingBadge
        className="-top-3 -right-3"
        rotation="3deg"
        delay={2700}
        accent="amber"
        icon="🔥"
        title="14-day streak"
        sub="Personal best"
      />
      <FloatingBadge
        className="-bottom-3 -left-3"
        rotation="-3deg"
        delay={3050}
        accent="emerald"
        icon="🎯"
        title="3 of 4 today"
        sub="Habits hit"
      />
    </div>
  );
}

function Panel({
  children,
  delay = 0,
  tone = 'neutral',
}: {
  children: ReactNode;
  delay?: number;
  tone?: 'neutral' | 'rose';
}) {
  const bg =
    tone === 'rose'
      ? 'border-zinc-100 bg-gradient-to-br from-rose-50/40 via-white to-white'
      : 'border-zinc-100 bg-gradient-to-b from-white to-zinc-50/40';
  return (
    <div
      className={`rounded-lg border p-2 ${bg}`}
      style={{ animation: `fadeUp 500ms ease-out ${delay}ms both` }}
    >
      {children}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  accent: 'emerald' | 'sky' | 'violet';
  delay: number;
}) {
  const map = {
    emerald: { bar: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50', txt: 'text-emerald-700' },
    sky: { bar: 'from-sky-500 to-cyan-400', bg: 'bg-sky-50', txt: 'text-sky-700' },
    violet: { bar: 'from-violet-500 to-purple-400', bg: 'bg-violet-50', txt: 'text-violet-700' },
  } as const;
  const a = map[accent];
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white p-2"
      style={{ animation: `fadeUp 500ms ease-out ${delay}ms both` }}
    >
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${a.bar}`} />
      <div className={`grid h-5 w-5 place-items-center rounded ${a.bg} ${a.txt}`}>{icon}</div>
      <div className="mt-1 text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-0.5 text-[14px] font-bold leading-none text-zinc-900">{value}</div>
    </div>
  );
}

function HabitPill({ emoji, label, delay }: { emoji: string; label: string; delay: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-0 rounded-md border border-emerald-200 bg-emerald-50/70 py-1"
      style={{ animation: `fadeUp 350ms ease-out ${delay - 200}ms both` }}
      title={`${label} — done`}
    >
      <span className="text-[13px] leading-none">{emoji}</span>
      <span className="mt-0.5 text-[7.5px] font-bold uppercase tracking-wider text-emerald-700">{label}</span>
      <span
        className="absolute -right-1 -top-1 grid h-3 w-3 place-items-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white"
        style={{ animation: `habitTick 600ms ease-out ${delay}ms both` }}
      >
        <Check className="h-1.5 w-1.5" strokeWidth={3.5} />
      </span>
    </div>
  );
}

function HabitChip({ emoji, label, delay }: { emoji: string; label: string; delay: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-between gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 px-2 py-1 text-[10.5px] font-semibold text-emerald-800"
      style={{ animation: `fadeUp 350ms ease-out ${delay - 200}ms both` }}
    >
      <span className="inline-flex items-center gap-1 min-w-0">
        <span className="text-[12px] leading-none">{emoji}</span>
        <span className="truncate">{label}</span>
      </span>
      <span
        className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-sm"
        style={{ animation: `habitTick 600ms ease-out ${delay}ms both` }}
      >
        <Check className="h-2 w-2" strokeWidth={3.5} />
      </span>
    </div>
  );
}

function AnimatedHeatmap() {
  // Deterministic pattern (no Math.random — keeps SSR + client matched and reproducible)
  const grid = Array.from({ length: 12 }, (_, w) =>
    Array.from({ length: 7 }, (__, d) => {
      const seed = Math.sin(w * 1.731 + d * 0.917) * 2.5 + 2;
      const intensity = Math.min(4, Math.max(0, Math.floor(seed)));
      return intensity;
    }),
  );
  const todayWeek = 11;
  const todayDay = new Date().getDay();
  const intensityClass = ['bg-zinc-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600', 'bg-emerald-700'];

  return (
    <div className="flex gap-[3px]">
      {grid.map((week, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {week.map((value, d) => {
            const isToday = w === todayWeek && d === todayDay;
            const delay = (w * 7 + d) * 10 + 2200;
            return (
              <div
                key={d}
                className={`h-[10px] w-[10px] rounded-[2px] ${intensityClass[value]} ${
                  isToday ? 'relative ring-2 ring-emerald-500 ring-offset-1' : ''
                }`}
                style={{
                  animation: `cellPopIn 300ms ease-out ${delay}ms both${
                    isToday ? `, pulseRing 2.2s ease-in-out ${delay + 800}ms infinite` : ''
                  }`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ScaleStrip() {
  return (
    <div className="hidden items-center gap-0.5 sm:flex">
      {['bg-zinc-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600', 'bg-emerald-700'].map((c, i) => (
        <span
          key={c}
          className={`h-2.5 w-2.5 rounded-[2px] ${c}`}
          style={{ animation: `fadeUp 300ms ease-out ${500 + i * 50}ms both` }}
        />
      ))}
    </div>
  );
}

function FloatingBadge({
  className,
  rotation,
  delay,
  icon,
  title,
  sub,
  accent,
}: {
  className: string;
  rotation: string;
  delay: number;
  icon: string;
  title: string;
  sub: string;
  accent: 'amber' | 'emerald';
}) {
  const tones = {
    amber: 'from-amber-50 to-orange-50 ring-amber-200 text-amber-900',
    emerald: 'from-emerald-50 to-teal-50 ring-emerald-200 text-emerald-900',
  } as const;
  return (
    <div
      className={`absolute z-10 inline-flex w-[130px] items-center gap-1.5 rounded-xl bg-gradient-to-br ring-1 ${tones[accent]} px-2 py-1.5 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.25)] ${className}`}
      style={
        {
          '--rot': rotation,
          transform: `rotate(${rotation})`,
          animation: `fadeUp 500ms ease-out ${delay}ms both, floaty 4s ease-in-out ${delay + 500}ms infinite`,
        } as React.CSSProperties
      }
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-sm shadow-sm ring-1 ring-zinc-100">
        {icon}
      </span>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-[10.5px] font-bold">{title}</div>
        <div className="truncate text-[9px] opacity-70">{sub}</div>
      </div>
    </div>
  );
}
