'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import DailyTracker from '@/components/DailyTracker';

/** Day-of-year, 1..365. Deterministic from "now". */
function dayOfYear(): number {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.min(365, Math.floor(diff / 86_400_000)));
}

/** Time-of-day greeting. */
function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'One more for the day';
}

export default function AppPage() {
  const { user } = useAuth();
  const first = (user?.displayName ?? '').split(/\s+/)[0] || 'there';
  const day = dayOfYear();
  const pct = Math.round((day / 365) * 100);
  const remaining = 365 - day;
  const today = new Date();
  const weekday = today.toLocaleDateString(undefined, { weekday: 'long' });
  const dateLabel = today.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const greet = timeGreeting();

  return (
    <div className="space-y-4">
      <HeroDayBlock
        first={first}
        greet={greet}
        day={day}
        pct={pct}
        remaining={remaining}
        weekday={weekday}
        dateLabel={dateLabel}
      />
      <DailyTracker />
    </div>
  );
}

function HeroDayBlock({
  first,
  greet,
  day,
  pct,
  remaining,
  weekday,
  dateLabel,
}: {
  first: string;
  greet: string;
  day: number;
  pct: number;
  remaining: number;
  weekday: string;
  dateLabel: string;
}) {
  const quarter = day <= 91 ? 'Q1' : day <= 183 ? 'Q2' : day <= 274 ? 'Q3' : 'Q4';
  const phase =
    day <= 30
      ? 'Establishing'
      : day <= 91
      ? 'Habits forming'
      : day <= 183
      ? 'Halfway there'
      : day <= 274
      ? 'Almost yours'
      : 'Finish strong';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white via-emerald-50/30 to-sky-50/30 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]">
      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" aria-hidden />

      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 -top-20 h-[280px] w-[280px] rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-[220px] w-[220px] rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 items-center gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:gap-6 lg:p-6">
        {/* Left — greeting + contextual chips */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-emerald-700">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-0.5">
              <span className="grid h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {weekday} · {dateLabel}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-500">{quarter} · {phase}</span>
          </div>

          <h1 className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[1.7rem] font-bold leading-[1.1] tracking-[-0.025em] text-zinc-900 sm:text-[2rem]">
            <span>{greet},</span>
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">
              {first}.
            </span>
          </h1>

          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-zinc-600 sm:text-[14px]">
            You&rsquo;re <strong className="text-zinc-900 tabular-nums">{day} days</strong> into your year.
            That&rsquo;s <strong className="text-zinc-900 tabular-nums">{remaining}</strong> more chances to
            show up — starting now.
          </p>

          {/* Inline progress for the year, paired with quick stat chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11.5px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/70 px-2.5 py-1 font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
              <span className="grid h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Plan today
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/70 px-2.5 py-1 font-semibold text-amber-700 shadow-sm backdrop-blur-sm">
              <span className="grid h-1.5 w-1.5 rounded-full bg-amber-500" />
              Build habits
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/70 px-2.5 py-1 font-semibold text-sky-700 shadow-sm backdrop-blur-sm">
              <span className="grid h-1.5 w-1.5 rounded-full bg-sky-500" />
              Ship goals
            </span>
          </div>
        </div>

        {/* Right — Big year ring */}
        <YearRingHero day={day} pct={pct} remaining={remaining} />
      </div>
    </div>
  );
}

function YearRingHero({ day, pct, remaining }: { day: number; pct: number; remaining: number }) {
  const size = 152;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference * (1 - day / 365);

  return (
    <div className="flex shrink-0 items-center gap-4 lg:gap-5">
      {/* Caption on the left (above on mobile) */}
      <div className="order-1 hidden flex-col text-right lg:flex">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-emerald-700">Your year</span>
        <span className="mt-1 text-[1.6rem] font-bold leading-none tabular-nums text-zinc-900">
          {pct}<span className="text-zinc-400">%</span>
        </span>
        <span className="mt-1.5 text-[11.5px] font-semibold text-zinc-500">
          built — <span className="tabular-nums text-zinc-700">{remaining}d</span> to go
        </span>
      </div>

      {/* The ring */}
      <div className="relative grid place-items-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <defs>
            <linearGradient id="heroRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
          {/* Filled arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="url(#heroRingGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.25))' }}
          />
          {/* Leading-edge dot */}
          <circle
            cx={cx + Math.cos((day / 365) * 2 * Math.PI) * r}
            cy={cy + Math.sin((day / 365) * 2 * Math.PI) * r}
            r={5}
            fill="#0ea5e9"
            style={{ filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.7))' }}
          />
        </svg>

        {/* Center — big Day number */}
        <div className="absolute flex flex-col items-center">
          <span className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-zinc-500">Day</span>
          <span className="-mt-0.5 text-[2.4rem] font-extrabold leading-none tracking-tight tabular-nums text-zinc-900">
            {day}
          </span>
          <span className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.22em] text-zinc-400">of 365</span>
        </div>
      </div>

      {/* Mobile caption (below ring) */}
      <div className="order-2 flex flex-col text-left lg:hidden">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-emerald-700">Your year</span>
        <span className="mt-1 text-[1.5rem] font-bold leading-none tabular-nums text-zinc-900">
          {pct}<span className="text-zinc-400">%</span>
        </span>
        <span className="mt-1.5 text-[11px] font-semibold text-zinc-500">
          built · <span className="tabular-nums text-zinc-700">{remaining}d</span> to go
        </span>
      </div>
    </div>
  );
}
