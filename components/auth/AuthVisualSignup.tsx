'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Flame, Trophy, Calendar, Check } from 'lucide-react';

/**
 * Animated right-pane visual for /signup.
 * Vibe: "Day 1 starts the moment you decide."
 * - Aurora gradient (violet → indigo → sky), totally different palette from login
 * - Background: light streaks sweeping diagonally + orbiting orbs
 * - Foreground: 6-month timeline filling 0→100%, milestone chips lighting up
 * - 6 habit tokens drop in sequentially below the timeline
 * - Bottom: aspirational community stats
 */
export default function AuthVisualSignup() {
  return (
    <aside className="relative hidden overflow-hidden bg-[radial-gradient(at_top_right,rgb(99_102_241/0.95),transparent),radial-gradient(at_bottom_left,rgb(56_189_248/0.9),transparent),linear-gradient(135deg,rgb(124_58_237),rgb(99_102_241),rgb(14_165_233))] lg:block">
      {/* Diagonal light streaks — slow continuous loop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -inset-[20%] opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, transparent 0 80px, rgba(255,255,255,0.18) 80px 82px, transparent 82px 200px)',
            animation: 'streakSweep 14s linear infinite',
          }}
        />
      </div>

      {/* Orbiting orbs — soft glow */}
      <div
        aria-hidden
        className="absolute left-[10%] top-[20%] h-[260px] w-[260px] rounded-full bg-fuchsia-300/35 blur-3xl"
        style={{ animation: 'orbit 16s ease-in-out infinite' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] right-[8%] h-[300px] w-[300px] rounded-full bg-cyan-300/35 blur-3xl"
        style={{ animation: 'orbit 18s ease-in-out infinite reverse' }}
      />

      {/* Subtle sparkle dots */}
      <Sparkle className="absolute left-[18%] top-[16%]" delay={400} />
      <Sparkle className="absolute right-[22%] top-[28%]" delay={900} size={14} />
      <Sparkle className="absolute right-[14%] bottom-[34%]" delay={1300} />
      <Sparkle className="absolute left-[28%] bottom-[18%]" delay={1700} size={12} />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between px-10 py-12 xl:px-12 xl:py-14">
        {/* Top: quote */}
        <blockquote
          className="max-w-md text-white"
          style={{ animation: 'fadeUp 1000ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both' }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            <span className="grid h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Day 1 · the rest of your year starts here
          </span>
          <p className="mt-4 text-[1.55rem] font-bold leading-[1.15] tracking-[-0.02em] xl:text-[1.85rem]">
            Who do you want to be
            <br />
            <span className="text-white/85">365 days from now?</span>
          </p>

          {/* Identity rotator — the answer to the question */}
          <IdentityRotator />
        </blockquote>

        {/* Middle: animated timeline + milestone cards */}
        <div className="my-6 space-y-5">
          <Timeline />
          <MilestoneRow />
          <HabitTokenRow />
        </div>

        {/* Bottom: aspirational stats */}
        <div
          className="grid max-w-xl grid-cols-4 gap-2.5"
          style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 5800ms both' }}
        >
          <Stat label="Habits you'll build"   value={<><Counter end={6}   duration={1400} delay={5800} /></>} hint="one per slot, daily" />
          <Stat label="Goals you'll ship"     value={<><Counter end={10}  duration={1600} delay={5950} /></>} hint="4 short + 6 long" />
          <Stat label="Milestones you'll hit" value={<><Counter end={48}  duration={2000} delay={6100} /></>} hint="auto-broken-down" />
          <Stat label="Compounding days"      value={<><Counter end={365} duration={2400} delay={6250} /></>} hint="and counting" />
        </div>
      </div>
    </aside>
  );
}

/* ──────────────── Timeline ─────────────────────────────────────────────── */

const TIMELINE_DAYS = 365;
const TIMELINE_FILL_MS = 5200; // a beat longer for full year
const TIMELINE_DELAY_MS = 1100;

/** Evenly spaced for visual symmetry — five anchor points at 0 / 25 / 50 / 75 / 100 %. */
const MILESTONES: { day: number; percent: number; label: string; vibe?: string; emoji?: string }[] = [
  { day: 1,   percent: 0,   label: 'Day 1',   vibe: 'Begin',          emoji: '🌱' },
  { day: 91,  percent: 25,  label: 'Month 3', vibe: 'Habits forming', emoji: '🔥' },
  { day: 183, percent: 50,  label: 'Month 6', vibe: 'Halfway there',  emoji: '⚡' },
  { day: 274, percent: 75,  label: 'Month 9', vibe: 'Almost yours',   emoji: '💪' },
  { day: 365, percent: 100, label: 'Day 365', vibe: 'Year built',     emoji: '🏆' },
];

function Timeline() {
  // Moment the bar reaches Day 365
  const burstDelay = TIMELINE_DELAY_MS + TIMELINE_FILL_MS - 150;
  // Continuous pulse on bookend dots starts after their entry settles
  const bookendPulseStart = TIMELINE_DELAY_MS + 600;
  // Aspirational labels appear ABOVE the bar but BELOW the title row — use a dedicated slot

  return (
    <div
      className="relative rounded-2xl border border-white/30 bg-white/10 px-5 pb-5 pt-5 backdrop-blur-md"
      style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 800ms both' }}
    >
      {/* Title row — symmetric three-part: chip · live counter · chip */}
      <div className="mb-3 grid grid-cols-3 items-center text-white">
        <span className="justify-self-start inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/85">
          <Calendar className="h-2.5 w-2.5" />
          365 days
        </span>
        <span
          className="justify-self-center text-[13px] font-extrabold uppercase tracking-[0.14em] text-white tabular-nums"
          style={{ animation: 'liveCountGlow 2.4s ease-in-out infinite' }}
        >
          Day&nbsp;<Counter end={TIMELINE_DAYS} duration={TIMELINE_FILL_MS} delay={TIMELINE_DELAY_MS} />
          <span className="font-bold text-white/55">&nbsp;/&nbsp;365</span>
        </span>
        <span className="justify-self-end inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/85">
          <span className="grid h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          live
        </span>
      </div>

      {/* Aspiration row — small motivational labels pop in ABOVE the bar when bar arrives */}
      <div className="relative mb-2 h-5">
        {MILESTONES.map((m, i) => {
          const delay = TIMELINE_DELAY_MS + (m.percent / 100) * TIMELINE_FILL_MS - 50;
          const isFirst = i === 0;
          const isLast = i === MILESTONES.length - 1;
          const labelTx = isFirst ? '0%' : isLast ? '-100%' : '-50%';
          return (
            <span
              key={`vibe-${m.day}`}
              className="absolute top-0 inline-flex items-center gap-0.5 whitespace-nowrap rounded-full bg-white/85 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-fuchsia-700 shadow-[0_6px_14px_-4px_rgba(255,255,255,0.55)] ring-1 ring-white/70"
              style={{
                left: `${m.percent}%`,
                opacity: 0,
                '--label-tx': labelTx,
                animation: `aspirationPop 2200ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms forwards`,
              } as React.CSSProperties}
            >
              <span aria-hidden>{m.emoji}</span>
              <span>{m.vibe}</span>
            </span>
          );
        })}
      </div>

      {/* The track + bar */}
      <div className="relative mt-2 h-3 rounded-full bg-white/15">
        {/* 52 weekly tick marks behind the bar (texture) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-between rounded-full px-[1px]"
        >
          {Array.from({ length: 52 }).map((_, i) => (
            <span
              key={i}
              className="block h-1.5 w-px bg-white/22"
              style={{ animation: `fadeUp 350ms ease-out ${600 + i * 6}ms both` }}
            />
          ))}
        </div>

        {/* Quarter dividers — clean vertical lines at 25/50/75% */}
        {[25, 50, 75].map((pct) => (
          <span
            key={pct}
            aria-hidden
            className="pointer-events-none absolute top-1/2 z-[6] h-5 w-px -translate-y-1/2 bg-white/35"
            style={{ left: `${pct}%`, animation: `fadeUp 500ms ease-out ${700 + pct * 6}ms both` }}
          />
        ))}

        {/* Milestone ring pulses — fire when bar crosses each milestone */}
        {MILESTONES.map((m) => {
          const delay = TIMELINE_DELAY_MS + (m.percent / 100) * TIMELINE_FILL_MS;
          return (
            <div
              key={`pulse-${m.day}`}
              aria-hidden
              className="pointer-events-none absolute top-1/2 z-[15] -ml-2 -mt-2 h-4 w-4"
              style={{ left: `${m.percent}%` }}
            >
              <span
                className="absolute inset-0 rounded-full border-2 border-white/80"
                style={{ animation: `milestonePulseOut 1300ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both` }}
              />
              <span
                className="absolute inset-0 rounded-full border-2 border-white/60"
                style={{ animation: `milestonePulseOut 1300ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 200}ms both` }}
              />
            </div>
          );
        })}

        {/* Filling bar — wrapper grows; comet + sparkle trail anchored at leading edge */}
        <div
          className="absolute left-0 top-0 z-10 h-full rounded-full bg-gradient-to-r from-white via-fuchsia-100 to-cyan-100 shadow-[0_0_22px_rgba(255,255,255,0.55)]"
          style={
            {
              '--target-width': '100%',
              animation: `barFill ${TIMELINE_FILL_MS}ms cubic-bezier(0.25, 0.85, 0.4, 1) ${TIMELINE_DELAY_MS}ms both`,
            } as React.CSSProperties
          }
        >
          {/* Inner flowing stripes — gives the bar energy */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-60"
            style={{
              backgroundImage:
                'repeating-linear-gradient(115deg, transparent 0 6px, rgba(255,255,255,0.45) 6px 7px)',
              animation: 'innerFlow 0.9s linear infinite',
            }}
          />

          {/* Sparkle trail */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-white"
              style={{
                right: `${10 + i * 7}px`,
                animation: `sparkleFade ${900 + i * 180}ms ease-out ${
                  TIMELINE_DELAY_MS + i * 120
                }ms infinite`,
                boxShadow: '0 0 6px rgba(255,255,255,0.85)',
              }}
            />
          ))}

          {/* Comet head — glowing orb at the leading edge */}
          <span
            aria-hidden
            className="absolute right-0 top-1/2 z-20 h-4 w-4 rounded-full bg-white"
            style={{
              transform: 'translate(50%, -50%)',
              animation: 'cometBob 1.4s ease-in-out infinite',
              boxShadow:
                '0 0 16px rgba(255,255,255,0.95), 0 0 32px rgba(255,255,255,0.6), 0 0 52px rgba(255,255,255,0.32)',
            }}
          />
        </div>

        {/* Milestone dots — bookends (Day 1 + Day 365) are larger and pulse continuously */}
        {MILESTONES.map((m) => {
          const delay = TIMELINE_DELAY_MS + (m.percent / 100) * TIMELINE_FILL_MS;
          const isFirst = m.percent === 0;
          const isLast = m.percent === 100;
          const isBookend = isFirst || isLast;

          // Larger size for bookends to match the right-side comet weight
          const size = isBookend ? 'h-5 w-5 -ml-2.5 -mt-2.5' : 'h-4 w-4 -ml-2 -mt-2';
          const ringClass = isBookend
            ? 'h-full w-full rounded-full bg-white ring-[3px] ring-white/55 shadow-[0_0_18px_rgba(255,255,255,0.7)]'
            : 'h-full w-full rounded-full bg-white shadow-[0_0_0_2px_rgba(124,58,237,0.6)] ring-2 ring-white/40';

          const entryAnim = isLast
            ? `climacticPop 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`
            : isFirst
            ? `originBurst 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${TIMELINE_DELAY_MS - 200}ms both`
            : `milestoneGlow 700ms ease-out ${delay}ms both`;

          const continuousAnim = isBookend
            ? `, bookendPulse 2800ms ease-in-out ${bookendPulseStart}ms infinite`
            : '';

          return (
            <div
              key={m.day}
              className={`absolute top-1/2 z-[12] ${size}`}
              style={{ left: `${m.percent}%` }}
            >
              <div className={ringClass} style={{ animation: `${entryAnim}${continuousAnim}` }} />
            </div>
          );
        })}
      </div>

      {/* Milestone labels — absolutely positioned for perfect alignment with dots; bookends emphasized */}
      <div className="relative mt-5 h-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
        {MILESTONES.map((m, i) => {
          const delay = TIMELINE_DELAY_MS + (m.percent / 100) * TIMELINE_FILL_MS;
          const isFirst = i === 0;
          const isLast = i === MILESTONES.length - 1;
          const isBookend = isFirst || isLast;
          const translateX = isFirst ? '0' : isLast ? '-100%' : '-50%';
          return (
            <span
              key={m.day}
              className={`absolute top-0 whitespace-nowrap tabular-nums ${
                isBookend ? 'text-[10.5px] text-white' : ''
              }`}
              style={{
                left: `${m.percent}%`,
                transform: `translateX(${translateX})`,
                animation: `labelHighlight 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
              }}
            >
              {m.label}
            </span>
          );
        })}
      </div>

      {/* Mini-confetti at every quarter milestone (Q1/Q2/Q3) — Day 365 gets the big one below */}
      {MILESTONES.filter((m) => m.percent > 0 && m.percent < 100).map((m) => (
        <MiniConfetti
          key={`mini-${m.day}`}
          delay={TIMELINE_DELAY_MS + (m.percent / 100) * TIMELINE_FILL_MS - 100}
          leftPct={m.percent}
        />
      ))}

      {/* Big confetti burst at year completion */}
      <ConfettiBurst delay={burstDelay} />
    </div>
  );
}

/* ──────────────── MiniConfetti — small burst for quarter milestones ─────── */

function MiniConfetti({ delay, leftPct }: { delay: number; leftPct: number }) {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = ((i / 12) * Math.PI * 2) - Math.PI / 2;
    const distance = 28 + (i % 4) * 9;
    const cx = Math.cos(angle) * distance;
    const cy = Math.sin(angle) * distance - 8;
    const cr = (i % 3) * 200 - 100;
    const dur = 850 + (i % 4) * 160;
    const palette = ['bg-fuchsia-300', 'bg-cyan-200', 'bg-amber-200', 'bg-white', 'bg-rose-200'];
    const color = palette[i % palette.length];
    const size = (i % 2) === 0 ? 5 : 3.5;
    return { i, cx, cy, cr, dur, color, size };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-20 h-1 w-1"
      style={{ left: `${leftPct}%`, top: '54%' }}
    >
      {particles.map((p) => (
        <span
          key={p.i}
          className={`absolute left-0 top-0 rounded-[2px] ${p.color}`}
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--cx': `${p.cx}px`,
              '--cy': `${p.cy}px`,
              '--cr': `${p.cr}deg`,
              animation: `confettiFly ${p.dur}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + (p.i % 4) * 28}ms both`,
              boxShadow: '0 0 4px rgba(255,255,255,0.55)',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ──────────────── Milestone cards (3 that unlock in sequence) ──────────── */

function MilestoneRow() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <MilestoneCard
        icon={<Flame className="h-4 w-4" />}
        day="Day 7"
        title="First streak"
        delay={2400}
        accent="from-amber-300 to-orange-400"
      />
      <MilestoneCard
        icon={<Calendar className="h-4 w-4" />}
        day="Day 90"
        title="Habits locked"
        delay={2800}
        accent="from-emerald-300 to-teal-400"
      />
      <MilestoneCard
        icon={<Trophy className="h-4 w-4" />}
        day="Day 365"
        title="Year transformed"
        delay={3200}
        accent="from-fuchsia-300 to-rose-400"
      />
    </div>
  );
}

function MilestoneCard({
  icon,
  day,
  title,
  delay,
  accent,
}: {
  icon: React.ReactNode;
  day: string;
  title: string;
  delay: number;
  accent: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/30 bg-white/12 p-2.5 backdrop-blur-md"
      style={{ animation: `fadeUp 500ms ease-out ${delay}ms both, milestonePop 500ms ease-out ${delay + 200}ms both` }}
    >
      {/* Inner gradient halo */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accent}`} aria-hidden />
      <div className="flex items-center gap-2 text-white">
        <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${accent} text-zinc-900 shadow`}>
          {icon}
        </span>
        <div className="min-w-0 leading-tight">
          <div className="text-[9px] font-bold uppercase tracking-wider text-white/70">{day}</div>
          <div className="truncate text-[12px] font-bold">{title}</div>
        </div>
      </div>
      {/* Check stamp that appears after card pops */}
      <span
        className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-white text-emerald-600 shadow-md ring-2 ring-white/40"
        style={{ animation: `habitTick 600ms ease-out ${delay + 600}ms both` }}
      >
        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
      </span>
    </div>
  );
}

/* ──────────────── Habit token row (6 tokens drop in sequence) ──────────── */

const HABIT_TOKENS = [
  { emoji: '💧', label: 'Water', delay: 4200 },
  { emoji: '🏃', label: 'Move', delay: 4400 },
  { emoji: '🧘', label: 'Calm', delay: 4600 },
  { emoji: '📖', label: 'Read', delay: 4800 },
  { emoji: '✍️', label: 'Journal', delay: 5000 },
  { emoji: '💤', label: 'Sleep', delay: 5200 },
];

function HabitTokenRow() {
  return (
    <div
      className="rounded-2xl border border-white/30 bg-white/10 p-3 backdrop-blur-md"
      style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 3800ms both' }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-white/85">Your 6 daily habits</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/85">
          <Sparkles className="h-3 w-3" />
          curated
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {HABIT_TOKENS.map((h) => (
          <HabitToken key={h.label} {...h} />
        ))}
      </div>
    </div>
  );
}

function HabitToken({ emoji, label, delay }: { emoji: string; label: string; delay: number }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-lg bg-white/95 py-1.5 shadow-md"
      style={{ animation: `tokenDrop 500ms cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both` }}
    >
      <span className="text-[15px] leading-none">{emoji}</span>
      <span className="text-[7.5px] font-bold uppercase tracking-wider text-zinc-700">{label}</span>
    </div>
  );
}

/* ──────────────── Sparkle ─────────────────────────────────────────────── */

function Sparkle({ className = '', delay = 0, size = 16 }: { className?: string; delay?: number; size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`pointer-events-none text-white ${className}`}
      style={{ animation: `sparkleTwinkle 3.5s ease-in-out ${delay}ms infinite` }}
    >
      <path
        d="M12 2 L13.5 9.5 L22 12 L13.5 14.5 L12 22 L10.5 14.5 L2 12 L10.5 9.5 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

/* ──────────────── Identity Rotator — the answer to the H2 question ─────── */

const IDENTITIES = [
  'a writer who actually ships.',
  'someone who finishes a marathon.',
  'fluent in a second language.',
  'reading 24 books a year.',
  '10 kg leaner. for good.',
  'debt-free. finally.',
  'building daily. shipping weekly.',
  'the person who shows up.',
];

const ROTATION_MS = 2600; // time each identity holds + cross-fades

function IdentityRotator() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % IDENTITIES.length), ROTATION_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="mt-5 max-w-md rounded-2xl border border-white/25 bg-white/12 p-3.5 backdrop-blur-md"
      style={{ animation: 'fadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 850ms both' }}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
        <Sparkles className="h-3 w-3" />
        I am becoming…
      </div>
      <div className="relative mt-1.5 h-[2.1rem] overflow-hidden">
        {IDENTITIES.map((line, i) => (
          <span
            key={i}
            aria-hidden={i !== idx}
            className="absolute inset-0 flex items-center text-[1.05rem] font-bold leading-tight tracking-[-0.01em] text-white xl:text-[1.15rem]"
            style={{
              animation:
                i === idx ? `identityIn ${ROTATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both` : undefined,
              opacity: i === idx ? undefined : 0,
            }}
          >
            {line}
            <span
              aria-hidden
              className="ml-1 inline-block h-[1.05rem] w-[2px] bg-white"
              style={{ animation: 'cursorBlink 0.9s steps(1,end) infinite' }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────── Confetti — fires once when the timeline reaches Day 365 ─ */

function ConfettiBurst({ delay }: { delay: number }) {
  // Deterministic particle field — radial out from the right edge of the bar
  const particles = Array.from({ length: 26 }, (_, i) => {
    const angle = ((i / 26) * Math.PI * 2) - Math.PI / 2; // distribute around origin
    const distance = 70 + (i % 5) * 18; // 70-142 px
    const cx = Math.cos(angle) * distance + (i % 2 === 0 ? 6 : -6);
    const cy = Math.sin(angle) * distance - 20;
    const cr = (i % 3) * 240 - 120; // -120, 120, 360
    const dur = 1100 + (i % 4) * 220;
    const palette = [
      'bg-fuchsia-300',
      'bg-cyan-200',
      'bg-amber-200',
      'bg-rose-300',
      'bg-white',
      'bg-emerald-200',
    ];
    const color = palette[i % palette.length];
    const size = (i % 3) === 0 ? 7 : 5;
    return { i, cx, cy, cr, dur, color, size };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-1 top-1.5 z-20 h-1 w-1"
    >
      {particles.map((p) => (
        <span
          key={p.i}
          className={`absolute left-0 top-0 rounded-[2px] ${p.color}`}
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--cx': `${p.cx}px`,
              '--cy': `${p.cy}px`,
              '--cr': `${p.cr}deg`,
              animation: `confettiFly ${p.dur}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + (p.i % 6) * 35}ms both`,
              boxShadow: '0 0 6px rgba(255,255,255,0.6)',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ──────────────── Helpers (Counter + Stat) ─────────────────────────────── */

function Counter({
  end,
  duration = 1500,
  delay = 0,
  format,
}: {
  end: number;
  duration?: number;
  delay?: number;
  format?: (n: number) => string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setV(end * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, [end, duration, delay]);
  return <span className="tabular-nums">{format ? format(v) : Math.round(v).toLocaleString()}</span>;
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/15 p-3 backdrop-blur-sm">
      <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">{label}</div>
      <div className="mt-1 text-[1.4rem] font-bold leading-none text-white">{value}</div>
      <div className="mt-1.5 text-[10px] font-semibold text-white/80">{hint}</div>
    </div>
  );
}
