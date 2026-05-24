'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export type ConfirmTone = 'danger' | 'warning' | 'info';

export type ConfirmOptions = {
  title: string;
  message?: ReactNode;
  /** Subject line shown as a quoted highlight (e.g. the task title being deleted). */
  subject?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  /** Resolved with true on confirm, false on cancel/dismiss. */
  onResolve: (ok: boolean) => void;
};

/**
 * Centered confirmation modal with backdrop blur, animated entrance,
 * ESC dismisses, Enter confirms.
 *
 * Usage:
 *   const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);
 *   <ConfirmDialog options={confirm} />
 *   // open:
 *   setConfirm({
 *     title: 'Delete this task?',
 *     subject: t.text,
 *     tone: 'danger',
 *     onResolve: (ok) => { setConfirm(null); if (ok) deleteTodo(id); },
 *   });
 */
export default function ConfirmDialog({ options }: { options: ConfirmOptions | null }) {
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!options) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        options.onResolve(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        options.onResolve(true);
      }
    };
    // Focus the confirm button so Enter works immediately
    const id = window.setTimeout(() => confirmBtnRef.current?.focus(), 30);
    window.addEventListener('keydown', onKey);
    // Lock body scroll while the modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [options]);

  if (!options) return null;

  const tone = options.tone ?? 'danger';
  const toneStyles = {
    danger: {
      ring: 'ring-rose-200/70',
      iconBg: 'bg-rose-100',
      iconText: 'text-rose-600',
      confirmBtn:
        'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 shadow-lg hover:shadow-rose-600/45 focus-visible:ring-rose-300',
      topBar: 'from-rose-500 via-rose-400 to-rose-500',
    },
    warning: {
      ring: 'ring-amber-200/70',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      confirmBtn:
        'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30 shadow-lg hover:shadow-amber-600/45 focus-visible:ring-amber-300',
      topBar: 'from-amber-500 via-amber-400 to-amber-500',
    },
    info: {
      ring: 'ring-emerald-200/70',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      confirmBtn:
        'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 shadow-lg hover:shadow-emerald-600/45 focus-visible:ring-emerald-300',
      topBar: 'from-emerald-500 via-teal-400 to-sky-400',
    },
  }[tone];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ animation: 'fadeUp 220ms ease-out both' }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Dismiss dialog"
        onClick={() => options.onResolve(false)}
        className="absolute inset-0 cursor-default bg-zinc-900/55 backdrop-blur-sm"
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] ring-1 ${toneStyles.ring}`}
        style={{ animation: 'wordReveal 320ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        {/* Top accent bar */}
        <div className={`h-[3px] w-full bg-gradient-to-r ${toneStyles.topBar}`} aria-hidden />

        {/* Close button */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => options.onResolve(false)}
          className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneStyles.iconBg} ${toneStyles.iconText} shadow-sm`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="confirm-dialog-title"
                className="text-[16px] font-bold leading-tight tracking-tight text-zinc-900"
              >
                {options.title}
              </h2>
              {options.message && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600">{options.message}</p>
              )}
              {options.subject && (
                <div className="mt-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12.5px] font-medium leading-snug text-zinc-700">
                  &ldquo;{options.subject}&rdquo;
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => options.onResolve(false)}
              className="inline-flex justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px] font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
            >
              {options.cancelLabel ?? 'Keep'}
            </button>
            <button
              ref={confirmBtnRef}
              type="button"
              onClick={() => options.onResolve(true)}
              className={`inline-flex justify-center rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 ${toneStyles.confirmBtn}`}
            >
              {options.confirmLabel ?? 'Delete'}
            </button>
          </div>

          <p className="mt-3 text-center text-[10.5px] text-zinc-400">
            Press <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1 py-px font-mono text-[10px]">Esc</kbd> to keep · <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1 py-px font-mono text-[10px]">Enter</kbd> to confirm
          </p>
        </div>
      </div>
    </div>
  );
}
