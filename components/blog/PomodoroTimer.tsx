'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Phase = 'focus' | 'break';
const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

/**
 * Working Pomodoro timer embedded inline in the blog. The reader can start an actual
 * 25-minute focus block (or 5-minute break) without leaving the post.
 *
 * Self-contained — no external deps. State auto-transitions focus → break → focus.
 * Audible cue (oscillator) when each phase ends.
 */
export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>('focus');
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Play a short chime when phase ends
  const chime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = phase === 'focus' ? 880 : 660;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    } catch {
      /* ignore — audio is a nice-to-have */
    }
  };

  // Drive the timer
  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // Phase complete — flip + reset
          chime();
          if (phase === 'focus') {
            setCompletedPomodoros((c) => c + 1);
            setPhase('break');
            return BREAK_SECONDS;
          }
          setPhase('focus');
          return FOCUS_SECONDS;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  const reset = () => {
    setRunning(false);
    setPhase('focus');
    setRemaining(FOCUS_SECONDS);
  };

  const totalForPhase = phase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
  const progress = 1 - remaining / totalForPhase;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  // Ring geometry
  const size = 200;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashoffset = c * (1 - progress);

  const accentColor = phase === 'focus' ? '#10b981' : '#0ea5e9';
  const accentSoft = phase === 'focus' ? '#ecfdf5' : '#f0f9ff';
  const accentRing = phase === 'focus' ? 'ring-emerald-200' : 'ring-sky-200';
  const accentText = phase === 'focus' ? 'text-emerald-700' : 'text-sky-700';

  return (
    <div
      className={`my-6 rounded-2xl border-2 bg-gradient-to-br from-white to-${
        phase === 'focus' ? 'emerald' : 'sky'
      }-50/40 p-5 shadow-sm sm:p-7 ${accentRing} ring-1`}
      style={{ borderColor: phase === 'focus' ? '#a7f3d0' : '#bae6fd' }}
    >
      <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
        Try it — live pomodoro timer
      </div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
        {/* Ring */}
        <div className="relative grid place-items-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={accentColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={dashoffset}
              style={{ transition: 'stroke-dashoffset 0.4s linear, stroke 0.4s linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-[10px] font-bold uppercase tracking-[0.22em] ${accentText}`}>
              {phase === 'focus' ? 'Focus' : 'Break'}
            </span>
            <span className="mt-1 text-[2.6rem] font-extrabold leading-none tracking-tight tabular-nums text-zinc-900">
              {mm}:{ss}
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              {phase === 'focus' ? '25 min block' : '5 min reset'}
            </span>
          </div>
        </div>

        {/* Controls + counter */}
        <div className="flex flex-1 flex-col items-stretch gap-3">
          <div className={`rounded-xl ${phase === 'focus' ? 'bg-emerald-50/70' : 'bg-sky-50/70'} px-4 py-3`}>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Completed today
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className={`text-[2rem] font-extrabold leading-none tabular-nums ${accentText}`}>
                {completedPomodoros}
              </span>
              <span className="text-[12px] font-semibold text-zinc-500">pomodoros</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: i < completedPomodoros ? accentColor : '#e4e4e7',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg`}
              style={{ backgroundColor: accentColor }}
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-zinc-600 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-zinc-500">
        25-minute focus block, then a 5-minute break. After 4 pomodoros, take a longer 15-30 minute
        rest. Phone away during focus blocks — that&rsquo;s the whole game.
      </p>
    </div>
  );
}
