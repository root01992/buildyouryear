'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowRight } from 'lucide-react';
import { ev } from '@/lib/analytics';

export default function CTA() {
  const { user, hydrated } = useAuth();
  return (
    <section className="relative isolate overflow-hidden border-t border-zinc-200/70 bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-600">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.85rem] font-bold leading-tight tracking-[-0.025em] text-white sm:text-[2.5rem]">
            Day 1 of your year starts now.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[14.5px] text-emerald-50/95">
            Sign up in 30 seconds. Encrypted account, syncs across devices, free forever.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {hydrated && user ? (
              <Link
                href="/app"
                onClick={() => ev.ctaClick({ location: 'bottom_cta', label: 'open_dashboard', destination: '/app' })}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14.5px] font-bold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50"
              >
                Open your dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => ev.ctaClick({ location: 'bottom_cta', label: 'create_account', destination: '/signup' })}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14.5px] font-bold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50"
                >
                  Create your account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/login"
                  onClick={() => ev.ctaClick({ location: 'bottom_cta', label: 'sign_in', destination: '/login' })}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-[14.5px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
