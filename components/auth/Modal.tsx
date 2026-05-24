'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  // Close on Escape, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] grid place-items-center px-4"
    >
      <div
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeUp 200ms ease-out both' }}
      />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]"
        style={{ animation: 'fadeUp 260ms ease-out both' }}
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" />
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-zinc-900">{title}</h2>
            {subtitle && <p className="mt-1 text-[12.5px] text-zinc-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 pt-3">{children}</div>
      </div>
    </div>
  );
}
