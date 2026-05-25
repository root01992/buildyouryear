'use client';

import { useMemo, useState } from 'react';

/**
 * Interactive compound-interest calculator embedded inside the Financial Habits blog post.
 * Lets a reader drag sliders for daily savings, years, and annual return rate, and see
 * both the principal contributed AND the total compounded amount update live.
 *
 * No external deps — pure React + Tailwind + inline SVG.
 */
export default function CompoundCalculator() {
  const [dailyAmount, setDailyAmount] = useState(10);
  const [years, setYears] = useState(20);
  const [annualRatePct, setAnnualRatePct] = useState(7);

  const { totals, points } = useMemo(() => {
    const r = annualRatePct / 100;
    const months = years * 12;
    const monthlyContribution = dailyAmount * 30;
    const monthlyRate = r / 12;

    let balance = 0;
    let contributed = 0;
    const pts: { month: number; balance: number; contributed: number }[] = [];
    for (let m = 0; m <= months; m++) {
      if (m > 0) {
        balance = (balance + monthlyContribution) * (1 + monthlyRate);
        contributed += monthlyContribution;
      }
      // Sample once per quarter for the chart
      if (m % 3 === 0 || m === months) {
        pts.push({ month: m, balance, contributed });
      }
    }

    return {
      totals: {
        final: balance,
        contributed,
        interest: balance - contributed,
      },
      points: pts,
    };
  }, [dailyAmount, years, annualRatePct]);

  // SVG chart bounds
  const W = 320;
  const H = 140;
  const padding = { l: 36, r: 8, t: 8, b: 22 };
  const innerW = W - padding.l - padding.r;
  const innerH = H - padding.t - padding.b;
  const maxY = Math.max(totals.final, 1);
  const maxX = points.length ? points[points.length - 1].month : 1;
  const xFor = (m: number) => padding.l + (m / maxX) * innerW;
  const yFor = (v: number) => padding.t + innerH - (v / maxY) * innerH;
  const balancePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.month).toFixed(1)} ${yFor(p.balance).toFixed(1)}`).join(' ');
  const contribPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.month).toFixed(1)} ${yFor(p.contributed).toFixed(1)}`).join(' ');

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="my-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/30 p-5 shadow-sm">
      <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-emerald-700">
        Try it — interactive calculator
      </div>
      <h3 className="mt-1 text-[16px] font-bold tracking-tight text-zinc-900">
        Your savings, compounded
      </h3>

      {/* Sliders */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SliderField
          label="Daily savings"
          value={dailyAmount}
          min={1}
          max={100}
          step={1}
          format={(v) => `$${v}/day`}
          onChange={setDailyAmount}
          accent="emerald"
        />
        <SliderField
          label="Years invested"
          value={years}
          min={1}
          max={40}
          step={1}
          format={(v) => `${v} yr`}
          onChange={setYears}
          accent="sky"
        />
        <SliderField
          label="Annual return"
          value={annualRatePct}
          min={0}
          max={12}
          step={0.5}
          format={(v) => `${v}%`}
          onChange={setAnnualRatePct}
          accent="amber"
        />
      </div>

      {/* Big result */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <ResultTile
          label="You contribute"
          value={fmt(totals.contributed)}
          accent="zinc"
        />
        <ResultTile
          label="Compound interest"
          value={fmt(totals.interest)}
          accent="amber"
        />
        <ResultTile
          label="Final balance"
          value={fmt(totals.final)}
          accent="emerald"
          highlight
        />
      </div>

      {/* Chart */}
      <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
        <div className="mb-1.5 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          <span>Growth over {years} year{years === 1 ? '' : 's'}</span>
          <span className="inline-flex items-center gap-3 text-[10.5px] font-semibold normal-case tracking-normal text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-0.5 w-3.5 rounded bg-emerald-500" />
              Total (with interest)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-0.5 w-3.5 rounded bg-zinc-400" />
              Contributions only
            </span>
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full">
          <defs>
            <linearGradient id="ccBalanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* axes */}
          <line x1={padding.l} y1={H - padding.b} x2={W - padding.r} y2={H - padding.b} stroke="#e4e4e7" />
          <line x1={padding.l} y1={padding.t} x2={padding.l} y2={H - padding.b} stroke="#e4e4e7" />
          {/* y labels */}
          {[0, 0.5, 1].map((p) => (
            <g key={p}>
              <text x={padding.l - 4} y={yFor(maxY * p) + 3} fontSize="8.5" fill="#71717a" textAnchor="end">
                {fmt(maxY * p)}
              </text>
            </g>
          ))}
          {/* x labels */}
          {[0, Math.floor(years / 2), years].map((yr) => (
            <text key={yr} x={xFor(yr * 12)} y={H - padding.b + 11} fontSize="8.5" fill="#71717a" textAnchor="middle">
              Y{yr}
            </text>
          ))}
          {/* fill */}
          <path d={`${balancePath} L ${xFor(maxX)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`} fill="url(#ccBalanceFill)" />
          {/* contribution line */}
          <path d={contribPath} fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
          {/* balance line */}
          <path d={balancePath} fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
          {/* endpoint dot */}
          <circle cx={xFor(maxX)} cy={yFor(totals.final)} r="3.5" fill="#10b981" />
        </svg>
      </div>

      <p className="mt-3 text-[11.5px] leading-relaxed text-zinc-500">
        Numbers above assume monthly compounding ({(annualRatePct / 12).toFixed(2)}% per month) and consistent deposits. Real returns vary —
        but the shape of the curve doesn&rsquo;t.
      </p>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  accent: 'emerald' | 'sky' | 'amber';
}) {
  const accentColors = {
    emerald: 'accent-emerald-500 text-emerald-700',
    sky: 'accent-sky-500 text-sky-700',
    amber: 'accent-amber-500 text-amber-700',
  };
  return (
    <label className="block">
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="font-bold uppercase tracking-wider text-zinc-500">{label}</span>
        <span className={`font-bold tabular-nums ${accentColors[accent].split(' ')[1]}`}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`mt-1.5 w-full ${accentColors[accent].split(' ')[0]}`}
      />
    </label>
  );
}

function ResultTile({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  accent: 'zinc' | 'amber' | 'emerald';
  highlight?: boolean;
}) {
  const map = {
    zinc: 'bg-zinc-50 border-zinc-200 text-zinc-900',
    amber: 'bg-amber-50/70 border-amber-200 text-amber-900',
    emerald: 'bg-emerald-50/80 border-emerald-300 text-emerald-900',
  };
  return (
    <div
      className={`rounded-lg border p-2.5 ${map[accent]} ${
        highlight ? 'shadow-[0_4px_18px_-6px_rgba(16,185,129,0.45)] ring-1 ring-emerald-300' : ''
      }`}
    >
      <div className="text-[9.5px] font-bold uppercase tracking-wider opacity-75">{label}</div>
      <div className="mt-1 text-[18px] font-extrabold leading-tight tabular-nums">{value}</div>
    </div>
  );
}
